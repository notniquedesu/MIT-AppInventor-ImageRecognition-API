const axios = require('axios');

/**
 * Clarifai API Adapter
 * Alternative backend for image recognition
 */

class ClarifaiAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.clarifai.com/v2';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async detectObjects(imagePath) {
    try {
      const imageBase64 = this._readImageAsBase64(imagePath);
      
      const response = await this.client.post('/models/aaa03c23b3724a16a56b629203edc62c/outputs', {
        inputs: [
          {
            data: {
              image: {
                base64: imageBase64
              }
            }
          }
        ]
      });

      const regions = response.data.outputs[0].data.regions || [];

      return {
        success: true,
        model: 'Clarifai',
        predictions: regions.map(region => ({
          class: region.data.concepts[0].name,
          score: region.data.concepts[0].value.toFixed(4),
          bbox: this._extractBbox(region.region_info.bounding_box)
        })),
        count: regions.length
      };
    } catch (error) {
      throw new Error(`Clarifai detection failed: ${error.message}`);
    }
  }

  async classifyImage(imagePath) {
    try {
      const imageBase64 = this._readImageAsBase64(imagePath);
      
      const response = await this.client.post('/models/general-image-recognition/outputs', {
        inputs: [
          {
            data: {
              image: {
                base64: imageBase64
              }
            }
          }
        ]
      });

      const concepts = response.data.outputs[0].data.concepts || [];

      return {
        success: true,
        model: 'Clarifai',
        predictions: concepts.slice(0, 10).map(concept => ({
          className: concept.name,
          probability: concept.value.toFixed(4)
        })),
        topPrediction: concepts[0] ? {
          className: concepts[0].name,
          probability: concepts[0].value.toFixed(4)
        } : null
      };
    } catch (error) {
      throw new Error(`Clarifai classification failed: ${error.message}`);
    }
  }

  _readImageAsBase64(imagePath) {
    const fs = require('fs');
    return fs.readFileSync(imagePath).toString('base64');
  }

  _extractBbox(bbox) {
    return [
      bbox.left_row * 640,
      bbox.top_col * 480,
      (bbox.right_row - bbox.left_row) * 640,
      (bbox.bottom_col - bbox.top_col) * 480
    ];
  }
}

module.exports = ClarifaiAdapter;