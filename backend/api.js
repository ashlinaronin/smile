const Koa = require('koa');
const cors = require('koa-cors');
const logger = require('koa-logger');
const app = new Koa();
const emotionDetectionRoutes = require('./routes/emotion-detection');
const router = require('koa-router')();

router.use('/emotion-detection', emotionDetectionRoutes.routes());

app
  .use(logger())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 3000);