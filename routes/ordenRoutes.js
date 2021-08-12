const { Router } = require('express');
const ordenController = require('../controllers/ordenController');

const router = Router();

router.get('/:userID', ordenController.getOrdenesByID);
router.get('/:numOrden', ordenController.getOrden);
router.post('/:userID', ordenController.checkout);
router.post('/complete/:numOrden', ordenController.complete);

module.exports = router;