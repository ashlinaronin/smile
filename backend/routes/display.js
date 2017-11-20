const router = require('koa-router')();
const persistence = require('../services/persistence');

/***
 *  GET /all-smiles
 *  Get a JSON dump of all donated smiles from DB
 ***/
router.get('/all-smiles', async ctx => {
  try {
    ctx.body = await persistence.getAllSmiles();
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'Display: error fetching smiles from DB');
  }
});

module.exports = router;