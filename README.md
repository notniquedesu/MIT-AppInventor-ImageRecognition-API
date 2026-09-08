# Image Recognition API for MIT App Inventor

> 🎯 Complete image recognition solution with TensorFlow.js backend and Android extension support

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Android](https://img.shields.io/badge/Android-21+-blue)](https://www.android.com/)

## 🌟 Features

✨ **Object Detection** - COCO-SSD real-time detection
✨ **Image Classification** - MobileNet-based classification
✨ **MIT App Inventor Extension** - Ready-to-use .aix file
✨ **Multiple Backends** - TensorFlow.js, Google Vision, Clarifai
✨ **REST API** - Easy integration with any platform
✨ **Base64 Support** - Process images without file uploads
✨ **Docker Support** - Deploy anywhere with containers
✨ **Production Ready** - Error handling, timeouts, retries

## 📦 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API.git
cd MIT-AppInventor-ImageRecognition-API
bash quick-start.sh
```

### 2. Start Backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

### 3. Build Extension

```bash
cd scripts
npm install
npm run build-aix
```

Generated: `dist/ImageRecognition.aix`

### 4. Use in MIT App Inventor

1. Open MIT App Inventor
2. Import `ImageRecognition.aix`
3. Drag component to screen
4. Configure server URL
5. Add blocks to your app

## 🚀 Deployment

### Docker

```bash
docker build -t image-recognition .
docker run -p 5000:5000 image-recognition
```

### Docker Compose

```bash
docker-compose up -d
```

### Heroku

```bash
heroku create your-app-name
git push heroku main
```

### AWS Lambda

See [AWS Lambda Guide](./docs/DEPLOYMENT.md)

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [Installation](./docs/INSTALLATION.md) | Detailed setup instructions |
| [API Reference](./docs/API.md) | Complete API documentation |
| [Examples](./docs/EXAMPLES.md) | Code examples for multiple languages |
| [AIX Builder](./docs/AIX-BUILDER.md) | Extension building guide |
| [Testing](./docs/TESTING.md) | Test suite and benchmarks |
| [Deployment](./docs/DEPLOYMENT.md) | Production deployment guides |

## 💻 API Endpoints

### Detect Objects

```bash
curl -X POST -F "image=@photo.jpg" \
  http://localhost:5000/api/detect-objects
```

**Response:**
```json
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

### Classify Image

```bash
curl -X POST -F "image=@photo.jpg" \
  http://localhost:5000/api/classify-image
```

**Response:**
```json
{
  "success": true,
  "model": "MobileNet",
  "predictions": [
    {
      "className": "Labrador retriever",
      "probability": 0.8234
    }
  ],
  "topPrediction": {...}
}
```

## 📱 MIT App Inventor Blocks

```blocks
when Screen.Initialize
  call ImageRecognition.ServerUrl "http://192.168.1.100:5000"

when Button_Camera.Click
  call Camera1.TakePicture

when Camera1.AfterPicture imagePath
  call ImageRecognition.SetImagePath imagePath
  call ImageRecognition.DetectObjects

when ImageRecognition.DetectionComplete result
  set Label_Results.Text to result
```

## 🔧 Technology Stack

- **Backend**: Node.js + Express
- **ML Models**: TensorFlow.js, COCO-SSD, MobileNet
- **Mobile Extension**: Android SDK
- **Deployment**: Docker, Heroku, AWS
- **Testing**: Jest, Mocha, Artillery

## 📊 Performance

- **Detection**: ~300-500ms per image
- **Classification**: ~200-400ms per image
- **Throughput**: 2-4 requests/second (single server)
- **Memory Usage**: 500MB-1GB
- **Image Size**: Supports up to 50MB

## 🛠️ Configuration

Edit `.env` in backend:

```env
PORT=5000
NODE_ENV=production
MAX_UPLOAD_SIZE=50mb
TIMEOUT=30000
```

## 🧪 Testing

### Run Tests

```bash
cd tests
npm install
npm test
```

### Mock Server

```bash
cd scripts
npm run mock-server
```

## 🐛 Troubleshooting

### Issue: Models fail to load

```bash
rm -rf node_modules package-lock.json
npm install --no-optional
```

### Issue: Port already in use

```bash
PORT=5001 npm start
```

### Issue: Extension import fails

1. Clear browser cache
2. Try different browser (Chrome recommended)
3. Rebuild extension

## 📈 Roadmap

- [ ] Real-time streaming
- [ ] Custom model support
- [ ] GPU acceleration
- [ ] Multi-language UI
- [ ] Mobile app for testing
- [ ] Cloud deployment templates

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License - See [LICENSE.md](./LICENSE.md)

## 💬 Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API/issues)
- 💬 [Discussions](https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API/discussions)
- 📧 [Email Support](mailto:support@example.com)

## ⭐ Show Your Support

Give a ⭐ if this project helped you!

---

<div align="center">
  Made with ❤️ by the Image Recognition Community
</div>