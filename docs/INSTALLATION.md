# Installation Guide

## Prerequisites

- Node.js 14+
- MIT App Inventor 2
- Android device or emulator
- Python 3.6+ (for TensorFlow setup)

## Backend Installation

### 1. Clone Repository

```bash
git clone https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API.git
cd MIT-AppInventor-ImageRecognition-API/backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Express.js
- TensorFlow.js
- COCO-SSD model
- MobileNet model
- CORS support
- Multer for file uploads

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
NODE_ENV=development
```

### 4. Start Server

```bash
npm start
```

You should see:
```
Loading COCO-SSD model...
COCO-SSD model loaded
Loading MobileNet model...
MobileNet model loaded
Image Recognition API running on port 5000
```

### 5. Verify Server

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","models":{"coco":true,"mobilenet":true}}
```

## Extension Installation

### Method 1: Use Pre-built Extension (Easiest)

1. Download `ImageRecognition.aix` from GitHub Releases
2. Open MIT App Inventor
3. Go to: **Project → Import extension → Select .aix file**
4. Wait for import to complete
5. Find "ImageRecognition" in the Palette under "Extension"

### Method 2: Build Extension Locally

#### Requirements:
- Android SDK
- Java JDK 8+
- Maven or Gradle

#### Build Steps:

```bash
cd extension

# Update with your paths
export ANDROID_SDK_ROOT=/path/to/android-sdk
export JAVA_HOME=/path/to/jdk8

# Build
mvn clean package

# Or with Gradle
./gradlew build
```

Generated `.aix` file will be in:
```
extension/build/outputs/
```

#### Using MIT App Inventor Extension Builder:

1. Visit: http://appinventor.mit.edu/build
2. Tools → Import extension → Upload `.aia` project
3. Build extension → Download `.aix`

## Android App Setup

### 1. Create New Project
- MIT App Inventor → Create new project

### 2. Import Extension
- Project → Import extension → Select `ImageRecognition.aix`

### 3. Add Components

**Screen:**
- Camera component
- Image component
- Button component
- Label component

**From Extension:**
- ImageRecognition component

### 4. Connect Components

```blocks
when Button1.Click
  call ImageRecognition.ServerUrl "http://YOUR_SERVER:5000"
  call Camera1.TakePicture

when Camera1.AfterPicture imagePath
  call ImageRecognition.SetImagePath imagePath
  call Image1.Picture imagePath
  call ImageRecognition.DetectObjects

when ImageRecognition.DetectionComplete result
  set Label1.Text to result
```

## Network Configuration

### Local Network (Development)

1. Get server IP:
```bash
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig
```

2. Update app to use: `http://192.168.x.x:5000`

3. Ensure device and server on same network

### Remote Server (Production)

#### Deploying to Heroku:

```bash
# Login
heroku login

# Create app
heroku create image-recognition-api

# Deploy
git push heroku main

# Check logs
heroku logs --tail

# Use in app: https://image-recognition-api.herokuapp.com
```

#### AWS EC2 Deployment:

```bash
# SSH into instance
ssh -i key.pem ec2-user@your-instance.amazonaws.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone your-repo
cd backend
npm install
sudo npm install -g pm2
PORT=80 pm2 start server.js --name image-recognition
pm2 startup
pm2 save
```

## Troubleshooting

### Issue: Models fail to load

**Error:** `Cannot find module '@tensorflow/tfjs-node'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Port already in use

**Error:** `listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm start
```

### Issue: Extension not importing

**Solution:**
1. Clear MIT App Inventor cache
2. Try different browser (Chrome recommended)
3. Rebuild extension from source

### Issue: CORS error on device

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Ensure `cors()` is enabled in server.js and server URL is correct

### Issue: Image not recognized

**Checklist:**
- Image format: JPEG or PNG
- Image size: 200x200 minimum
- Server models loaded successfully
- Network connection working

## Performance Optimization

### For Better Results:

1. **Resize large images:**
```javascript
// Client-side before sending
const max_width = 800;
const max_height = 600;
```

2. **Enable caching:**
```bash
npm install redis
```

3. **Use GPU acceleration:**
```bash
npm install @tensorflow/tfjs-node-gpu
```

## Next Steps

1. Read the [API Documentation](./API.md)
2. Check [Usage Examples](./EXAMPLES.md)
3. Explore [Advanced Features](./ADVANCED.md)