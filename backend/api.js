const Koa = require('koa');
const koaJson = require('koa-json');
const busboy = require('koa-busboy');
const cors = require('koa-cors');
const logger = require('koa-logger');
const fetch = require('isomorphic-fetch');
const app = new Koa();
const router = require('koa-router')();

const uploader = busboy({
  dest: './uploads',
});

const baseUrl = 'https://api.skybiometry.com/fc/faces/detect.json';

router.get('/', async ctx => {
  ctx.body = 'Hello World';
});

/***
 *  POST /face-attributes
 *  Upload an image and get attributes for the first face from SkyBiometry
 ***/
router.post('/face-attributes', uploader, async ctx => {
  try {
    // read uploaded file
    const { name } = ctx.request.body;
    let fileReadStream = ctx.request.files[0];

    // POST uploaded file directly to skybiometry api
    const formData = {
      api_key: process.env.SKYBIOMETRY_API_KEY,
      api_secret: process.env.SKYBIOMETRY_API_SECRET,
      urls: ctx.request.files[0],
      attributes: 'all'
    };

    // const response = await fetch(baseUrl, {
    //   method: 'POST',
    //   body: formData
    // });
    //
    // const jsonResponse = JSON.parse(response);
    //
    // ctx.body = jsonResponse;

    request.post({ url: baseUrl, formData }, (err, res, body) => {
      if (err) {
        console.error('upload failed:', err);
      }

      const jsonBody = JSON.parse(body);

      ctx.body = jsonBody;
    });
  }
  catch (err) {
    console.error('error uploading face', err);
    ctx.throw(500, 'error uploading face');
  }
});

app
  .use(logger())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(koaJson());

app.listen(3000);