#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

/**
 * Mock API Server for Testing
 * Simulates image recognition without ML models
 */

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Mock COCO objects
const MOCK_OBJECTS = [
  'person', 'car', 'dog', 'cat', 'bird', 'bus', 'truck', 'bicycle',
  'backpack', 'umbrella', 'chair', 'table', 'laptop', 'phone', 'book'
];

// Mock classifications
const MOCK_CLASSES = [
  'Golden Retriever', 'Labrador retriever', 'German Shepherd',
  'Siamese cat', 'Maine Coon cat', 'Persian cat',
  'Apple', 'Orange', 'Banana', 'Strawberry'
];

app.post('/api/detect-objects', (req, res) => {
  try {
    // Simulate detection with random results
    const count = Math.floor(Math.random() * 4) + 1;
    const predictions = [];

    for (let i = 0; i < count; i++) {
      predictions.push({
        class: MOCK_OBJECTS[Math.floor(Math.random() * MOCK_OBJECTS.length)],
        score: (Math.random() * 0.4 + 0.6).toFixed(4),
        bbox: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 300 + 50,
          Math.random() * 300 + 50
        ]
      });
    }

    res.json({
      success: true,
      model: 'COCO-SSD (Mock)',
      predictions,
      count: predictions.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/classify-image', (req, res) => {
  try {
    const predictions = [];

    for (let i = 0; i < 5; i++) {
      predictions.push({
        className: MOCK_CLASSES[Math.floor(Math.random() * MOCK_CLASSES.length)],
        probability: (Math.random() * 0.3 + 0.7 - i * 0.15).toFixed(4)
      });
    }

    res.json({
      success: true,
      model: 'MobileNet (Mock)',
      predictions,
      topPrediction: predictions[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/detect-base64', (req, res) => {
  try {
    const count = Math.floor(Math.random() * 3) + 1;
    const predictions = [];

    for (let i = 0; i < count; i++) {
      predictions.push({
        class: MOCK_OBJECTS[Math.floor(Math.random() * MOCK_OBJECTS.length)],
        score: (Math.random() * 0.3 + 0.7).toFixed(4),
        bbox: [Math.random() * 100, Math.random() * 100, 150, 150]
      });
    }

    res.json({
      success: true,
      predictions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'mock',
    models: { coco: true, mobilenet: true },
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🎭 Mock Image Recognition API running on port ${PORT}`);
  console.log(`📋 Mode: Mock Testing (No ML models required)`);
  console.log(`\n✅ Endpoints available:`);
  console.log(`  POST /api/detect-objects`);
  console.log(`  POST /api/classify-image`);
  console.log(`  POST /api/detect-base64`);
  console.log(`  GET  /api/health\n`);
});