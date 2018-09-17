const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingCartSchema = new Schema({
  customerId: Schema.Types.ObjectId,
  tempReservations: [{
    type: Schema.Types.ObjectId,
    ref: "TempReservation"
  }],
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);

module.exports = ShoppingCart;