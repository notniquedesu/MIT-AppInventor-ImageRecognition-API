# Usage Examples

## Example 1: Simple Object Detection

### MIT App Inventor Blocks

```blocks
when Button_Detect.Click
  call ImageRecognition.ServerUrl "http://192.168.1.100:5000"
  call ImageRecognition.SetImagePath "/sdcard/Pictures/photo.jpg"
  call ImageRecognition.DetectObjects

when ImageRecognition.DetectionComplete result
  call Label_Results.SetText result
```

### JavaScript/Node.js

```javascript
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function detectObjects(imagePath) {
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));
  
  try {
    const response = await axios.post(
      'http://localhost:5000/api/detect-objects',
      form,
      { headers: form.getHeaders() }
    );
    console.log('Detections:', response.data.predictions);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

detectObjects('photo.jpg');
```

## Example 2: Image Classification

### MIT App Inventor Blocks

```blocks
when Button_Classify.Click
  call ImageRecognition.ServerUrl "http://192.168.1.100:5000"
  call ImageRecognition.SetImagePath "/sdcard/Pictures/dog.jpg"
  call ImageRecognition.ClassifyImage

when ImageRecognition.ClassificationComplete result
  // Parse result and show top prediction
  set Label_Classification.Text to "Top prediction: " + call extract_top_class result
```

### Python

```python
import requests
import json

def classify_image(image_path, server_url='http://localhost:5000'):
    with open(image_path, 'rb') as img:
        files = {'image': img}
        response = requests.post(
            f'{server_url}/api/classify-image',
            files=files
        )
    
    result = response.json()
    if result['success']:
        top = result['topPrediction']
        print(f"Class: {top['className']}")
        print(f"Confidence: {top['probability']}")
    else:
        print(f"Error: {result['error']}")

classify_image('photo.jpg')
```

## Example 3: Real-time Camera Detection

### MIT App Inventor Blocks

```blocks
when Screen.Initialize
  call ImageRecognition.ServerUrl "http://192.168.1.100:5000"

when Button_Capture.Click
  call Camera1.TakePicture

when Camera1.AfterPicture imagePath
  call Image1.SetPicture imagePath
  call ImageRecognition.SetImagePath imagePath
  call ImageRecognition.DetectObjects

when ImageRecognition.DetectionComplete result
  call process_results result
```

## Example 4: Multiple Object Filtering

### MIT App Inventor (Advanced)

```blocks
when ImageRecognition.DetectionComplete result
  // Filter for persons only
  local filteredResults = call filter_objects result "person"
  call Label_PersonCount.SetText ("Found " + (length of filteredResults) + " persons")

procedure filter_objects result objectType
  // Parse JSON and filter
  return filtered list
```

### JavaScript Helper

```javascript
function filterObjects(jsonResult, objectType, minConfidence = 0.5) {
  try {
    const result = JSON.parse(jsonResult);
    return result.predictions.filter(pred => 
      pred.class.toLowerCase() === objectType.toLowerCase() &&
      parseFloat(pred.score) >= minConfidence
    );
  } catch (error) {
    return [];
  }
}

// Usage
const detections = filterObjects(responseJSON, 'person', 0.7);
console.log(`Found ${detections.length} persons with >70% confidence`);
```

## Example 5: Batch Processing

### Node.js

```javascript
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function batchDetect(folderPath, serverUrl = 'http://localhost:5000') {
  const files = fs.readdirSync(folderPath)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  
  const results = {};
  
  for (const file of files) {
    try {
      const form = new FormData();
      form.append('image', fs.createReadStream(path.join(folderPath, file)));
      
      const response = await axios.post(
        `${serverUrl}/api/detect-objects`,
        form,
        { headers: form.getHeaders() }
      );
      
      results[file] = response.data.predictions;
      console.log(`✓ Processed: ${file}`);
    } catch (error) {
      results[file] = { error: error.message };
      console.log(`✗ Failed: ${file}`);
    }
  }
  
  // Save results
  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to results.json');
}

batchDetect('./images');
```

## Example 6: REST API Client

### cURL

```bash
# Detect objects
curl -X POST -F "image=@photo.jpg" http://localhost:5000/api/detect-objects

# Classify image
curl -X POST -F "image=@photo.jpg" http://localhost:5000/api/classify-image

# Health check
curl http://localhost:5000/api/health
```

### Postman

1. Create POST request to `http://localhost:5000/api/detect-objects`
2. Body → form-data
3. Key: `image` (File type)
4. Select image file
5. Send

## Example 7: Base64 Processing

### JavaScript

```javascript
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

async function detectFromBase64(file, serverUrl) {
  const base64 = await imageToBase64(file);
  
  const response = await fetch(`${serverUrl}/api/detect-base64`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 })
  });
  
  return response.json();
}
```

## Example 8: Error Handling

### MIT App Inventor

```blocks
when ImageRecognition.ErrorOccurred errorMessage
  if (errorMessage contains "timeout")
    call Notifier1.ShowAlert "Server connection timeout. Check URL."
  else if (errorMessage contains "Invalid image")
    call Notifier1.ShowAlert "Image format not supported. Use JPG or PNG."
  else
    call Notifier1.ShowAlert ("Error: " + errorMessage)
```

### Python with Retry Logic

```python
import requests
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def requests_retry_session(
    retries=3,
    backoff_factor=0.3,
    status_forcelist=(500, 502, 504),
):
    session = requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def reliable_detect(image_path, server_url):
    try:
        session = requests_retry_session()
        with open(image_path, 'rb') as f:
            response = session.post(
                f'{server_url}/api/detect-objects',
                files={'image': f},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None
```

## Example 9: Performance Comparison

### Benchmark Script

```javascript
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function benchmark(imagePath, iterations = 5) {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    
    const start = Date.now();
    await axios.post('http://localhost:5000/api/detect-objects', form, {
      headers: form.getHeaders()
    });
    const duration = Date.now() - start;
    
    times.push(duration);
    console.log(`Iteration ${i + 1}: ${duration}ms`);
  }
  
  const avg = times.reduce((a, b) => a + b) / times.length;
  console.log(`\nAverage: ${avg.toFixed(2)}ms`);
  console.log(`Min: ${Math.min(...times)}ms`);
  console.log(`Max: ${Math.max(...times)}ms`);
}

benchmark('photo.jpg', 10);
```

## Example 10: Production App Integration

### Complete Flask Web App

```python
from flask import Flask, render_template, request, jsonify
import requests
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

IMAGE_API_URL = 'http://localhost:5000'

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({'error': 'No file'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Send to image recognition API
        with open(filepath, 'rb') as f:
            files = {'image': f}
            response = requests.post(
                f'{IMAGE_API_URL}/api/detect-objects',
                files=files
            )
        
        os.remove(filepath)
        return response.json()
    
    return jsonify({'error': 'Invalid file'}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=8000)
```