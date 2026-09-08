const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Google Vision API Adapter
 * Alternative backend for image recognition
 */

const vision = require('@google-cloud/vision');

class GoogleVisionAdapter {
  constructor(apiKey) {
    this.client = new vision.ImageAnnotatorClient({
      keyFilename: apiKey
    });
  }

  async detectObjects(imagePath) {
    const request = {
      image: { content: fs.readFileSync(imagePath) }
    };

    const [result] = await this.client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;

    return {
      success: true,
      model: 'Google Vision API',
      predictions: objects.map(obj => ({
        class: obj.name,
        score: obj.score.toFixed(4),
        bbox: this._normalizeBbox(obj.boundingPoly)
      })),
      count: objects.length
    };
  }

  async classifyImage(imagePath) {
    const request = {
      image: { content: fs.readFileSync(imagePath) }
    };

    const [result] = await this.client.labelDetection(request);
    const labels = result.labelAnnotations;

    return {
      success: true,
      model: 'Google Vision API',
      predictions: labels.map(label => ({
        className: label.description,
        probability: label.score.toFixed(4)
      })),
      topPrediction: labels[0] ? {
        className: labels[0].description,
        probability: labels[0].score.toFixed(4)
      } : null
    };
  }

  _normalizeBbox(poly) {
    const vertices = poly.normalizedVertices;
    if (!vertices || vertices.length < 2) return [0, 0, 0, 0];
    
    const xs = vertices.map(v => v.x);
    const ys = vertices.map(v => v.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    
    return [
      minX * 640,
      minY * 480,
      (maxX - minX) * 640,
      (maxY - minY) * 480
    ];
  }
}

module.exports = GoogleVisionAdapter;