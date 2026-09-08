package com.example.imagerecognition;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import com.google.appinventor.components.annotations.*;
import com.google.appinventor.components.common.ComponentCategory;
import com.google.appinventor.components.runtime.AndroidNonvisibleComponent;
import com.google.appinventor.components.runtime.EventDispatcher;
import com.google.appinventor.components.runtime.Component;
import com.google.appinventor.components.runtime.Form;
import android.os.AsyncTask;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

@DesignerComponent(
    version = 1,
    description = "Image Recognition component for MIT App Inventor using TensorFlow and cloud APIs",
    category = ComponentCategory.EXTENSION,
    nonVisible = true,
    iconName = "https://raw.githubusercontent.com/notniquedesu/MIT-AppInventor-ImageRecognition-API/main/assets/icon.png")
@SimpleObject(external = true)
public class ImageRecognition extends AndroidNonvisibleComponent implements Component {

    private String serverUrl = "http://localhost:5000";
    private String imagePath = "";
    private Bitmap selectedBitmap = null;
    private Context context;

    public ImageRecognition(Form form) {
        super(form);
        this.context = form.getApplicationContext();
    }

    @SimpleProperty(description = "Set the server URL for the image recognition API")
    public void ServerUrl(String url) {
        this.serverUrl = url;
    }

    @SimpleProperty()
    public String ServerUrl() {
        return this.serverUrl;
    }

    @SimpleMethod(description = "Set image from file path")
    public void SetImagePath(String path) {
        this.imagePath = path;
        try {
            this.selectedBitmap = BitmapFactory.decodeFile(path);
        } catch (Exception e) {
            ErrorOccurred("Failed to load image: " + e.getMessage());
        }
    }

    @SimpleMethod(description = "Set image from base64 string")
    public void SetImageBase64(String base64String) {
        try {
            byte[] decodedString = Base64.decode(base64String, Base64.DEFAULT);
            this.selectedBitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
        } catch (Exception e) {
            ErrorOccurred("Failed to decode base64 image: " + e.getMessage());
        }
    }

    @SimpleMethod(description = "Detect objects in the image")
    public void DetectObjects() {
        if (this.selectedBitmap == null && this.imagePath.isEmpty()) {
            ErrorOccurred("No image set. Use SetImagePath or SetImageBase64 first.");
            return;
        }
        new DetectionTask().execute("detect");
    }

    @SimpleMethod(description = "Classify the image")
    public void ClassifyImage() {
        if (this.selectedBitmap == null && this.imagePath.isEmpty()) {
            ErrorOccurred("No image set. Use SetImagePath or SetImageBase64 first.");
            return;
        }
        new DetectionTask().execute("classify");
    }

    @SimpleEvent(description = "Triggered when detection is complete")
    public void DetectionComplete(String result) {
        EventDispatcher.dispatchEvent(this, "DetectionComplete", result);
    }

    @SimpleEvent(description = "Triggered when classification is complete")
    public void ClassificationComplete(String result) {
        EventDispatcher.dispatchEvent(this, "ClassificationComplete", result);
    }

    @SimpleEvent(description = "Triggered when an error occurs")
    public void ErrorOccurred(String errorMessage) {
        EventDispatcher.dispatchEvent(this, "ErrorOccurred", errorMessage);
    }

    private class DetectionTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... params) {
            try {
                String mode = params[0];
                String endpoint = mode.equals("detect") ? "/api/detect-base64" : "/api/classify-image";
                
                // Convert bitmap to base64
                String imageBase64 = bitmapToBase64(selectedBitmap);
                
                URL url = new URL(serverUrl + endpoint);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                conn.setConnectTimeout(30000);
                conn.setReadTimeout(30000);

                JSONObject payload = new JSONObject();
                payload.put("image", "data:image/jpeg;base64," + imageBase64);

                OutputStream os = conn.getOutputStream();
                os.write(payload.toString().getBytes());
                os.flush();
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();
                    return response.toString();
                } else {
                    return "{\"error\":\"HTTP " + responseCode + "\"}"; 
                }
            } catch (Exception e) {
                return "{\"error\":\"" + e.getMessage() + "\"}"; 
            }
        }

        @Override
        protected void onPostExecute(String result) {
            try {
                JSONObject jsonResult = new JSONObject(result);
                if (jsonResult.has("error")) {
                    ErrorOccurred(jsonResult.getString("error"));
                } else if (result.contains("topPrediction")) {
                    ClassificationComplete(result);
                } else {
                    DetectionComplete(result);
                }
            } catch (Exception e) {
                ErrorOccurred(e.getMessage());
            }
        }
    }

    private String bitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.DEFAULT);
    }
}