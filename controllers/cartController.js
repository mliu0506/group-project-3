const db = require('../models');


module.exports = {



  findUserCart: function (req, res) {
    db.ShoppingCart.findOne({ customerId: req.user._id })
      .populate("tempReservations")
      .then(cart => res.json(cart))
      .catch(err => res.json(err));
  },


  addReservationToCart: function (req, res) {

    const reservationObject = {
      itemId: req.body._id,
      category: req.body.category,
      dailyRate: parseFloat(req.body.dailyRate.$numberDecimal),
      itemName: req.body.name,
      customerId: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      date: {
        from: req.params.from,
        to: req.params.to
      }
    }

    // Checks to see if a similar tempReservation already exists in the cart:
    db.TempReservation.find(
      {
        customerId: req.user._id,
        itemId: req.body._id,
        // Checks to see if either condition is met ($or):
        $or: [
          {
            // Either your chosen 'from' date falls between the from and to dates already in the db
            $and: [
              { "date.from": { $lte: req.params.from } },
              { "date.to": { $gte: req.params.from } }
            ]
          },
          {
            // Or your chosen 'to' date falls between the from and to dates already in the db
            $and: [
              { "date.to": { $gte: req.params.to } },
              { "date.from": { $lte: req.params.to } }
            ]
          },
          {
            // Or your chosen 'to' date falls between the from and to dates already in the db
            $and: [
              { "date.from": { $gte: req.params.from } },
              { "date.to": { $lte: req.params.to } }
            ]
          }
        ]
      }
    ).then(reservation => {
      //  if tempReservation already exists, sends back a message: "duplicate"
      //  This message will trigger a modal asking if they want to change their cart or keep the original.
      if (reservation.length > 0) {
        return res.send({ message: "duplicate", existingRes: reservation })
      }
      //  If there is no duplicate, it creates the tempReservation in the cart.
      else {
        db.TempReservation.create(reservationObject)
          .then(reservation => {
            return db.ShoppingCart.findOneAndUpdate(
              { customerId: req.user._id },
              { $push: { tempReservations: reservation._id } },
              { new: true }
            )
          })
          .then(cart => res.send(cart))
          .catch(err => res.json(err));
      }
    }).catch(err => res.json(err))
  },

  changeReservationInCart: function (req, res) {
    db.TempReservation.findOneAndUpdate(
      {
        customerId: req.user._id,
        itemId: req.body._id,
        $and: [
          { "date.from": req.body.oldFrom },
          { "date.to": req.body.oldTo }
        ]
      },
      {
        "date.from": req.params.from,
        "date.to": req.params.to
      }
    ).then(tempRes => res.json(tempRes))
      .catch(err => res.json(err));
  },

  removeReservationFromCart: function (req, res) {
    db.TempReservation
      .deleteOne({ _id: req.params.id })
      .then(response => {
        return db.ShoppingCart.findOneAndUpdate(
          { customerId: req.user._id },
          { $pull: { tempReservations: req.params.id } },
          { new: true }
        )
      })
      .then(cart => res.json(cart))
      .catch(err => res.json(err));
  },

  checkout: function (req, res) {
    const { reservations } = req.body;
    let promiseArray = [];
    for (let i = 0; i < reservations.length; i++) {
      const element = reservations[i];
      const query = db.Reservation.create(element)
      promiseArray.push(query);
    }
    Promise.all(promiseArray)
      .then(values => res.send({ values: values }))
      .catch(err => res.json(err));
  },

  update: function (req, res) {

  }

};