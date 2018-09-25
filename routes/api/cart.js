const router = require('express').Router();
const passport = require('../../passport');
const cartController = require('../../controllers/cartController');


router
  .route('/:id')
  .get(isLoggedIn, cartController.findUserCart);


router
  .route('/rentals/date/:from/:to')
  .put(isLoggedIn, cartController.changeReservationInCart)
  .post(isLoggedIn, cartController.addReservationToCart);

router
  .route('/rentals/:id')
  .delete(isLoggedIn, cartController.removeReservationFromCart);

router
  .route('/checkout')
  .post(isLoggedIn, cartController.checkout);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
