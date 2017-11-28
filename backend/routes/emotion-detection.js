const busboy = require('koa-busboy');
const FormData = require('form-data');
const fetch = require('isomorphic-fetch');
const config = require('../config');
const router = require('koa-router')();
const persistence = require('../services/persistence');
const faceChopper = require('../services/face-chopper');
const uploader = busboy({
  dest: './uploads',
});

init();

async function init() {
  await persistence.init();
}

/***
 *  POST /sky-biometry
 *  Upload an image and get attributes for the first face from SkyBiometry
 ***/
router.post('/sky-biometry', uploader, async ctx => {
  try {
    const formData = new FormData();
    formData.append('api_key', process.env.SKYBIOMETRY_API_KEY);
    formData.append('api_secret', process.env.SKYBIOMETRY_API_SECRET);
    formData.append('attributes', 'all');
    formData.append('urls', ctx.request.files[0]); // readStream

    const response = await fetch(config.skyBiometryBaseUrl, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      const userId = await persistence.createNewDonor();
      const donation = await persistence.addSmileToDonor(userId, jsonResponse);
      await faceChopper.saveSmilesFromDonation(donation);

      ctx.body = jsonResponse;
    } else {
      ctx.throw(500, 'SkyBiometry: error uploading face');
    }
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'SkyBiometry: error uploading face');
  }
});

/***
 *  POST /kairos
 *  Upload an image and get attributes for the first face from Kairos
 ***/
router.post('/kairos', uploader, async ctx => {
  try {
    const formData = new FormData();
    formData.append('source', ctx.request.files[0]); // readStream
    formData.append('landmarks', 1);
    formData.append('timeout', 20);

    const response = await fetch(config.kairosBaseUrl, {
      headers: {
        app_id: process.env.KAIROS_APP_ID,
        app_key: process.env.KAIROS_API_KEY
      },
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      ctx.body = await response.json();
    } else {
      ctx.throw(500, 'Kairos: error uploading face');
    }
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'Kairos: error uploading face');
  }
});

module.exports = router;