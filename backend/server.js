const express = require('express');
const cors = require('cors');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const coco = require('@tensorflow-models/coco-ssd');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

let cocoModel = null;
let mobilenetModel = null;

// Initialize models
async function initializeModels() {
  try {
    console.log('Loading COCO-SSD model...');
    cocoModel = await coco.load();
    console.log('COCO-SSD model loaded');
    
    console.log('Loading MobileNet model...');
    mobilenetModel = await mobilenet.load();
    console.log('MobileNet model loaded');
  } catch (error) {
    console.error('Error loading models:', error);
  }
}

// Object Detection Endpoint (COCO-SSD)
app.post('/api/detect-objects', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const image = tf.node.decodeImage(req.file.buffer, 3);
    const predictions = await cocoModel.estimateObjects(image);
    
    image.dispose();

    const results = predictions.map(pred => ({
      class: pred.class,
      score: pred.score.toFixed(4),
      bbox: pred.bbox
    }));

    res.json({
      success: true,
      model: 'COCO-SSD',
      predictions: results,
      count: results.length
    });
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Image Classification Endpoint (MobileNet)
app.post('/api/classify-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const image = tf.node.decodeImage(req.file.buffer, 3);
    const predictions = await mobilenetModel.classify(image);
    
    image.dispose();

    const results = predictions.map(pred => ({
      className: pred.className,
      probability: pred.probability.toFixed(4)
    }));

    res.json({
      success: true,
      model: 'MobileNet',
      predictions: results,
      topPrediction: results[0]
    });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', models: { coco: !!cocoModel, mobilenet: !!mobilenetModel } });
});

// Base64 Image Detection
app.post('/api/detect-base64', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const buffer = Buffer.from(image.split(',')[1] || image, 'base64');
    const imageData = tf.node.decodeImage(buffer, 3);
    const predictions = await cocoModel.estimateObjects(imageData);
    
    imageData.dispose();

    const results = predictions.map(pred => ({
      class: pred.class,
      score: pred.score.toFixed(4),
      bbox: pred.bbox
    }));

    res.json({
      success: true,
      predictions: results
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
initializeModels().then(() => {
  app.listen(PORT, () => {
    console.log(`Image Recognition API running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});