const Koa = require('koa');
const busboy = require('koa-busboy');
const cors = require('koa-cors');
const logger = require('koa-logger');
const FormData = require('form-data');
const fetch = require('isomorphic-fetch');
const app = new Koa();
const router = require('koa-router')();

const uploader = busboy({
  dest: './uploads',
});
const skyBiometryBaseUrl = 'https://api.skybiometry.com/fc/faces/detect.json';
const kairosBaseUrl = 'https://api.kairos.com/v2/media';

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

    const response = await fetch(skyBiometryBaseUrl, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      ctx.body = await response.json();
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

    const response = await fetch(kairosBaseUrl, {
      headers: {
        app_id: process.env.KAIROS_APP_ID,
        app_key: process.env.KAIROS_API_KEY
      },
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      ctx.body = await response.json();;
    } else {
      ctx.throw(500, 'Kairos: error uploading face');
    }
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'Kairos: error uploading face');
  }
});

app
  .use(logger())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);