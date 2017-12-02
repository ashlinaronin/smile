const Koa = require('koa');
const serve = require('koa-static-server');
const cors = require('koa-cors');
const logger = require('koa-logger');
const app = new Koa();
const emotionDetectionRoutes = require('./routes/emotion-detection');
const displayRoutes = require('./routes/display');
const router = require('koa-router')();

router.use('/emotion-detection', emotionDetectionRoutes.routes());
router.use('/display', displayRoutes.routes());

app
  .use(logger())
  .use(cors())
  .use(serve({ rootDir: 'uploads', rootPath: '/uploads' }))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 3000);