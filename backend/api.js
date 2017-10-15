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
const baseUrl = 'https://api.skybiometry.com/fc/faces/detect.json';

/***
 *  POST /face-attributes
 *  Upload an image and get attributes for the first face from SkyBiometry
 ***/
router.post('/face-attributes', uploader, async ctx => {
  try {
    const formData = new FormData();
    formData.append('api_key', process.env.SKYBIOMETRY_API_KEY);
    formData.append('api_secret', process.env.SKYBIOMETRY_API_SECRET);
    formData.append('attributes', 'all');
    formData.append('urls', ctx.request.files[0]); // readStream

    const response = await fetch(baseUrl, {
      method: 'POST',
      body: formData
    });

    ctx.body = await response.json();
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'error uploading face');
  }
});

app
  .use(logger())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);