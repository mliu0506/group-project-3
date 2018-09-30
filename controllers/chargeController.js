const db = require('../models');
const stripe = require("stripe");

module.exports = {

  charge: function (req, res) {
    const token = req.body.token;
    const total = parseFloat(req.body.chrgAmt) * 100;

    const charge = stripe.charges.create({
      amount: total,
      currency: 'cad',
      description: 'res/reg charge',
      source: token
    });

    Promise.all([charge])
      .then((chargeResponse) => {
        res.json(chargeResponse);
      })
      .catch(err => console.log(err));
  },

  respaid: function (req, res) {
    db.Reservation.findOneAndUpdate(
      { _id: req.body.reservation._id },
      {
        paid: true,
        amtPaid: req.body.resTotal
      }
    ).then((resp) => {
      res.send("reservation paid");
    })
      .catch(err => console.log(err));
  }

}