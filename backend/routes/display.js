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
router.get('/smiles', async ctx => {
  try {
    ctx.body = await persistence.getSmiles();
  }
  catch (err) {
    console.error(err);
    ctx.throw(500, 'Display: error fetching smiles from DB');
  }
});

module.exports = router;