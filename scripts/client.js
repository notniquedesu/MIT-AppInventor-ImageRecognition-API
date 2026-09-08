#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

class ImageRecognitionClient {
  constructor(serverUrl = 'http://localhost:5000') {
    this.serverUrl = serverUrl;
    this.client = axios.create({
      baseURL: serverUrl,
      timeout: 30000
    });
  }

  async detectObjects(imagePath) {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const response = await this.client.post('/api/detect-objects', form, {
      headers: form.getHeaders()
    });

    return response.data;
  }

  async classifyImage(imagePath) {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const response = await this.client.post('/api/classify-image', form, {
      headers: form.getHeaders()
    });

    return response.data;
  }

  async detectBase64(base64String) {
    const response = await this.client.post('/api/detect-base64', {
      image: base64String
    });

    return response.data;
  }

  async health() {
    const response = await this.client.get('/api/health');
    return response.data;
  }

  filterPredictions(predictions, objectType, minConfidence = 0.5) {
    return predictions.filter(pred => 
      pred.class.toLowerCase() === objectType.toLowerCase() &&
      parseFloat(pred.score) >= minConfidence
    );
  }

  formatResults(results, detailed = false) {
    if (!detailed) {
      return results.predictions.map(p => 
        `${p.class || p.className}: ${(parseFloat(p.score || p.probability) * 100).toFixed(2)}%`
      ).join('\n');
    }
    return JSON.stringify(results, null, 2);
  }
}

module.exports = ImageRecognitionClient;

// CLI Usage
if (require.main === module) {
  const [command, imagePath] = process.argv.slice(2);
  const client = new ImageRecognitionClient();

  (async () => {
    try {
      if (command === 'detect' && imagePath) {
        const result = await client.detectObjects(imagePath);
        console.log(client.formatResults(result, true));
      } else if (command === 'classify' && imagePath) {
        const result = await client.classifyImage(imagePath);
        console.log(client.formatResults(result, true));
      } else if (command === 'health') {
        const status = await client.health();
        console.log('Server Status:', status);
      } else {
        console.log('Usage: node client.js <detect|classify|health> [imagePath]');
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}