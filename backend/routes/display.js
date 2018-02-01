const router = require('koa-router')();
const persistence = require('../services/persistence');

/***
 *  GET /all-donations
 *  Get a JSON dump of all donated images from DB
 ***/
router.get('/all-donations', async ctx => {
  try {
    ctx.body = await persistence.getAllDonations();
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'Display: error fetching donations from DB');
  }
});

/***
 * GET /all-smiles
 * Get a JSON dump of all smiles from DB
 */
router.get('/all-smiles', async ctx => {
  try {
    ctx.body = await persistence.getAllSmiles();
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'Display: error fetching smiles from DB');
  }
});

/***
 * GET /new-smiles
 * Get a JSON dump of new smiles since timestamp
 */
router.get('/new-smiles/:timestamp', async ctx => {
  try {
    ctx.body = await persistence.getNewSmiles(ctx.params.timestamp);
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'Display: error fetching smiles from DB');
  }
});

module.exports = router;