# Image Recognition Extension - .aix Builder Guide

## Quick Build

### Option 1: Automated Build (Recommended)

```bash
cd scripts
npm install
npm run build-aix
```

The `.aix` file will be generated in `dist/ImageRecognition.aix`

### Option 2: Use Pre-built Extension

Download the latest `ImageRecognition.aix` from GitHub Releases.

## What's Inside the .aix File

The extension contains:

```
ImageRecognition.aix
├── classinfo.json          # Component metadata
├── AndroidManifest.xml     # Android permissions
├── version.json            # Version information
├── classes/                # Compiled Java classes
├── libs/                   # Dependencies
├── icon.png               # Extension icon
└── dependencies.json      # Required libraries
```

## Build From Source

### Prerequisites

- Android SDK (API 21+)
- Java JDK 8+
- Node.js 14+
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API.git
cd MIT-AppInventor-ImageRecognition-API
```

### Step 2: Build Extension

```bash
cd scripts
npm install
```

For Android Studio:

```bash
cd ../extension
./gradlew build
```

### Step 3: Generate .aix

```bash
cd ../scripts
npm run build-aix
```

### Step 4: Find Output

The generated file: `dist/ImageRecognition.aix`

## Using the .aix Extension

### 1. Import in MIT App Inventor

1. Open MIT App Inventor (ai2.appinventor.mit.edu)
2. Create new or open existing project
3. Click **Projects** → **Import extension**
4. Select `ImageRecognition.aix`
5. Click **Import**

### 2. Add to Screen

In the Designer:
1. Scroll to **Extension** category
2. Drag **ImageRecognition** to screen (invisible component)

### 3. Configure Blocks

```blocks
when Screen.Initialize
  call ImageRecognition.ServerUrl "http://192.168.1.100:5000"

when Button_Capture.Click
  call Camera1.TakePicture

when Camera1.AfterPicture imagePath
  call ImageRecognition.SetImagePath imagePath
  call ImageRecognition.DetectObjects

when ImageRecognition.DetectionComplete result
  set Label_Result.Text to result
```

## Available Methods

### Properties

```java
// Set/Get API server URL
ImageRecognition.ServerUrl(String url)
```

### Methods

```java
// Load image from file path
void SetImagePath(String path)

// Load image from base64 string
void SetImageBase64(String base64String)

// Detect objects in image
void DetectObjects()

// Classify image (single object)
void ClassifyImage()
```

### Events

```java
// Fired when detection completes
event DetectionComplete(String result)

// Fired when classification completes
event ClassificationComplete(String result)

// Fired when error occurs
event ErrorOccurred(String errorMessage)
```

## Troubleshooting

### Issue: "Failed to import extension"

**Solution:**
- Check browser console for errors
- Clear cache and refresh
- Try different browser (Chrome recommended)
- Re-download .aix file

### Issue: "Extension not appearing in Palette"

**Solution:**
- Reload project
- Close and reopen MIT App Inventor
- Check file size (should be > 50KB)

### Issue: "Network errors when calling API"

**Solution:**
- Verify server is running: `curl http://server:5000/api/health`
- Check firewall settings
- Ensure device and server on same network
- Use correct server IP address

### Issue: "Image processing fails"

**Solution:**
- Check image format (JPEG/PNG only)
- Verify image file exists and is readable
- Check image file permissions
- Try with a different image

## Performance Optimization

### For faster processing:

1. **Resize images before detection**
   - Max: 800x600 pixels
   - Format: JPEG with 85% quality

2. **Use appropriate method**
   - `DetectObjects()` - Multiple objects
   - `ClassifyImage()` - Single object identification

3. **Batch processing**
   - Process multiple images sequentially
   - Add delays between requests

## Advanced Configuration

### Server Environment Variables

Edit backend `.env`:

```env
PORT=5000
NODE_ENV=production
MAX_UPLOAD_SIZE=50mb
TIMEOUT=30000
```

### Extension Customization

Edit `extension/ImageRecognition.java`:

```java
// Change default server
private String serverUrl = "http://your-server.com:5000";

// Modify timeout
conn.setConnectTimeout(60000); // 60 seconds

// Add custom headers
conn.setRequestProperty("Authorization", "Bearer token");
```

## Building Custom Extensions

To create your own extension:

1. Fork the repository
2. Modify `extension/ImageRecognition.java`
3. Update `extension/build.gradle` if adding dependencies
4. Run build script: `npm run build-aix`
5. Share your extension

## Testing

### Test with Mock Server

```bash
cd scripts
npm run mock-server
# Runs on port 5001
```

Then use `http://localhost:5001` in your app.

### Test with Real API

```bash
cd backend
npm install
npm start
# Runs on port 5000
```

### Test API Endpoint

```bash
cd scripts
node client.js health
node client.js detect ../test-image.jpg
node client.js classify ../test-image.jpg
```

## Distribution

### Share Your Extension

1. Build the .aix file
2. Create GitHub Release
3. Upload .aix as asset
4. Share download link

### File Size

- Typical: 150-300 KB
- With dependencies: 500+ KB

## Support

- 📖 [API Documentation](../docs/API.md)
- 📚 [Examples](../docs/EXAMPLES.md)
- 🐛 [Report Issues](https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API/issues)
- 💬 [Discussions](https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API/discussions)