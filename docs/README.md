# Image Recognition API for MIT App Inventor

A comprehensive image recognition extension for MIT App Inventor with support for:
- **Object Detection** using COCO-SSD
- **Image Classification** using MobileNet
- **Multiple Backend Options** (TensorFlow.js, Clarifai, Google Vision)
- **Real-time Processing**

## Features

✅ Object Detection (COCO-SSD)
✅ Image Classification (MobileNet)
✅ Base64 Image Support
✅ Multi-threaded Processing
✅ Error Handling
✅ RESTful API
✅ Android Extension (.aix)

## Quick Start

### Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

### Using in MIT App Inventor

1. Download the `.aix` file from releases
2. Import into MIT App Inventor
3. Configure the server URL
4. Set image and call methods

## API Endpoints

### 1. Object Detection (COCO-SSD)

**POST** `/api/detect-objects`

```javascript
FormData:
- image: File

Response:
{
  "success": true,
  "model": "COCO-SSD",
  "predictions": [
    {
      "class": "person",
      "score": 0.9542,
      "bbox": [x, y, width, height]
    }
  ],
  "count": 1
}
```

### 2. Image Classification (MobileNet)

**POST** `/api/classify-image`

```javascript
FormData:
- image: File

Response:
{
  "success": true,
  "model": "MobileNet",
  "predictions": [
    {
      "className": "Labrador retriever",
      "probability": 0.8234
    }
  ],
  "topPrediction": { ... }
}
```

### 3. Base64 Detection

**POST** `/api/detect-base64`

```javascript
JSON:
{
  "image": "data:image/jpeg;base64,..."
}

Response: Same as Object Detection
```

### 4. Health Check

**GET** `/api/health`

```javascript
Response:
{
  "status": "ok",
  "models": {
    "coco": true,
    "mobilenet": true
  }
}
```

## MIT App Inventor Component Methods

### Properties

- `ServerUrl` - Set/Get the API server URL

### Methods

- `SetImagePath(path)` - Load image from file path
- `SetImageBase64(base64String)` - Load image from base64
- `DetectObjects()` - Perform object detection
- `ClassifyImage()` - Perform image classification

### Events

- `DetectionComplete(result)` - Triggered when detection finishes
- `ClassificationComplete(result)` - Triggered when classification finishes
- `ErrorOccurred(errorMessage)` - Triggered on error

## Installation

### Option 1: Pre-built Extension

1. Download `ImageRecognition.aix` from releases
2. In MIT App Inventor: `Import extension` → Select `.aix` file

### Option 2: Build from Source

```bash
cd extension
gradlew build
```

Generate `.aix` using MIT App Inventor extension builder.

## Usage Example

### Blocks (MIT App Inventor)

```
when Button.Click
  call ImageRecognition.SetImagePath /sdcard/Pictures/photo.jpg
  call ImageRecognition.ServerUrl "http://192.168.1.100:5000"
  call ImageRecognition.DetectObjects

when ImageRecognition.DetectionComplete result
  set Label.Text to result
```

## Configuration

### Server Environment Variables

Create `.env` file in backend folder:

```env
PORT=5000
NODE_ENV=development
CLARIFAI_API_KEY=your_key
GOOGLE_VISION_API_KEY=your_key
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package.json .
RUN npm install
COPY backend/server.js .
EXPOSE 5000
CMD ["npm", "start"]
```

### Heroku

```bash
heroku create your-app-name
git push heroku main
heroku logs --tail
```

## Alternative Backends

### Google Vision API

```javascript
// See: google-vision-adapter.js
const vision = require('@google-cloud/vision');
```

### Clarifai API

```javascript
// See: clarifai-adapter.js
const Clarifai = require('clarifai');
```

## Troubleshooting

### Issue: Connection Timeout
**Solution:** Ensure server is running and firewall allows traffic on port 5000

### Issue: CORS Error
**Solution:** Verify cors() is enabled in server.js

### Issue: Invalid Image Format
**Solution:** Use JPEG or PNG format, ensure file is readable

## Performance Tips

- Resize images before processing for faster results
- Use object detection for multiple objects
- Use classification for single object identification
- Batch requests when possible

## License

MIT License - See LICENSE.md

## Support

For issues and feature requests, visit: https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API/issues