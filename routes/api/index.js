const router = require('express').Router();
const rentalRoutes = require('./rentals');
const cartRoutes = require('./cart');
const chargeRoutes = require('./charge');

// api routes
router.use('/rentals', rentalRoutes);
router.use('/cart', cartRoutes);
router.use('/charge', chargeRoutes);

module.exports = router;