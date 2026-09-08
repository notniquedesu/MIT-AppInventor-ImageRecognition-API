#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Integration Tests
 * Tests the full workflow from image to result
 */

async function runIntegrationTests() {
  console.log('\n🔗 Integration Tests - Full Workflow');
  console.log('='.repeat(60));

  const serverUrl = 'http://localhost:5000';
  const testImagePath = path.join(__dirname, '../test-images/sample.jpg');

  try {
    // Check if server is running
    console.log('\n1️⃣  Checking server connection...');
    const axios = require('axios');
    const health = await axios.get(`${serverUrl}/api/health`);
    console.log(`   ✅ Server is running (${health.data.status})`);
    console.log(`   Models: COCO=${health.data.models.coco}, MobileNet=${health.data.models.mobilenet}`);

    // Test detection workflow
    console.log('\n2️⃣  Testing object detection workflow...');
    if (fs.existsSync(testImagePath)) {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('image', fs.createReadStream(testImagePath));

      const response = await axios.post(`${serverUrl}/api/detect-objects`, form, {
        headers: form.getHeaders()
      });

      console.log(`   ✅ Detection successful`);
      console.log(`   Objects found: ${response.data.count}`);
      response.data.predictions.forEach((pred, i) => {
        console.log(`   ${i + 1}. ${pred.class} (${(pred.score * 100).toFixed(2)}%)`);
      });
    } else {
      console.log(`   ⚠️  Test image not found: ${testImagePath}`);
      console.log(`   Skipping detection test`);
    }

    // Test classification workflow
    console.log('\n3️⃣  Testing image classification workflow...');
    if (fs.existsSync(testImagePath)) {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('image', fs.createReadStream(testImagePath));

      const response = await axios.post(`${serverUrl}/api/classify-image`, form, {
        headers: form.getHeaders()
      });

      console.log(`   ✅ Classification successful`);
      console.log(`   Top prediction: ${response.data.topPrediction.className}`);
      console.log(`   Confidence: ${(response.data.topPrediction.probability * 100).toFixed(2)}%`);
    } else {
      console.log(`   ⚠️  Skipping classification test`);
    }

    // Test API client
    console.log('\n4️⃣  Testing API client...');
    const ImageRecognitionClient = require('../scripts/client.js');
    const client = new ImageRecognitionClient(serverUrl);
    
    const status = await client.health();
    console.log(`   ✅ Client connected successfully`);
    console.log(`   Server status: ${status.status}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ All integration tests passed!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Integration test failed:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  runIntegrationTests();
}

module.exports = runIntegrationTests;