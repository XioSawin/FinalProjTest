const { Router } = require('express');
const ordenController = require('../controllers/ordenController');

const router = Router();

router.get('/:numOrden', ordenController.getOrden);
router.get('/:userID', ordenController.getOrdenesByID);
router.post('/checkout/:userID', ordenController.checkout);
router.post('/complete/:numOrden', ordenController.complete);

module.exports = router;