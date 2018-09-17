const db = require('../models');
const dateFns = require("date-fns");

// Defining methods for the rentalsController
module.exports = {

  findAll: function (req, res) {
    db.Rental
      .find({})
      .populate("reservations")
      .sort({ date: -1 }) 
      .then(dbModel => {
        const rentalArray = filterRentalItemData(dbModel);
        res.json(rentalArray);
      })
      .catch(err => res.status(422).json(err));
  },

  findByCategory: function (req, res) {
    db.Rental
      .find({ category: req.params.category })
      .populate("reservations")
      .then(dbModel => {
        const rentalArray = filterRentalItemData(dbModel);
        res.json(rentalArray);
      })
      .catch(err => res.status(422).json(err));
  },

  findById: function (req, res) {
    db.Rental
      .findById(req.params.id)
      .then(dbModel => {
  
        const rentalObject = {
          _id: dbModel._id,
          name: dbModel.name,
          category: dbModel.category,
          maker: dbModel.maker,
          dailyRate: dbModel.dailyRate,
          displayImageUrl: dbModel.displayImageUrl,
          reservations: dbModel.reservations
        }
        res.json(rentalObject)
      })
      .catch(err => res.status(422).json(err));
  },



  finalCheck: function (req, res) {
    db.Rental.findById(req.body.itemId)
      .populate("reservations")
      .then(dbModel => {
        for (let i = 0; i < dbModel.reservations.length; i++) {
          if (dbModel.reservations[i].date.from === dbModel.reservations[i].date.to && req.body.date.from === req.body.date.to) {
            if (dbModel.reservations[i].date.from === req.body.date.from) {
              return res.send({ response: "already reserved", info: dbModel, tempId: req.body._id })
            }
          }
          if (dbModel.reservations[i].date.from === dbModel.reservations[i].date.to && req.body.date.from !== req.body.date.to) {
            if (dateFns.isWithinRange(dbModel.reservations[i].date.from, req.body.date.from, req.body.date.to)) {
              return res.send({ response: "already reserved", info: dbModel, tempId: req.body._id })
            }
          }
          if (dbModel.reservations[i].date.from !== dbModel.reservations[i].date.to && req.body.date.from === req.body.date.to) {
            if (dateFns.isWithinRange(req.body.date.from, dbModel.reservations[i].date.from, dbModel.reservations[i].date.to)) {
              return res.send({ response: "already reserved", info: dbModel, tempId: req.body._id })
            }
          }
          if (dbModel.reservations[i].date.from !== dbModel.reservations[i].date.to && req.body.date.from !== req.body.date.to) {
            if (dateFns.areRangesOverlapping(dbModel.reservations[i].date.from, dbModel.reservations[i].date.to, req.body.date.from, req.body.date.to)) {
              return res.send({ response: "already reserved", info: dbModel, tempId: req.body._id })
            }
          }
        }
  
        return res.send({ response: "Success!", info: dbModel, tempId: req.body._id })
      }).catch(err => res.json(err));
  },

  reserveRental: function (req, res) {
    db.Rental.findById(req.body.itemId)
      .populate("reservations")
      .then(dbModel => {
        db.Reservation.create(req.body)
          .then(reservation => {

            Promise.all([
              db.Rental.findOneAndUpdate(
                { _id: req.body.itemId },
                { $push: { reservations: reservation._id } },
                { new: true }
              ), db.User.findOneAndUpdate(
                { _id: req.user._id },
                { $push: { reservations: reservation._id } },
                { new: true }
              ), db.ShoppingCart.findOneAndUpdate(
                { customerId: req.user._id },
                { $pull: { tempReservations: req.body._id } },
                { new: true }
              ), db.TempReservation.deleteOne(
                { _id: req.body._id }
              )
            ])
              .then(() => {
                return res.send({ response: "Success!" })
              })
          })
          .catch(err => res.json(err));

      });
  },



  breakReservation: function (req, res) {
    console.log(req.body);
    db.Reservation
      .deleteOne({ _id: req.params.id })
      .then(() => {
        Promise.all([
          db.Rental.findByIdAndUpdate(
            { _id: req.body.itemId },
            { $pull: { reservations: req.params.id } },
            { new: true }
          ), db.User.findByIdAndUpdate(
            { _id: req.body.customerId },
            { $pull: { reservations: req.params.id } },
            { new: true }
          )
        ])
          .then(values => {
            res.send({ values: values })
          })
      })
      .catch(err => res.status(422).json(err));
  },

};


function filterRentalItemData(dbModel) {
  let rentalArray = [];
  //  removing private data (e.g. sku, pastRentals) from public rental display
  for (let i = 0; i < dbModel.length; i++) {
    const element = dbModel[i];
    const rentalObject = {
      _id: element._id,
      name: element.name,
      category: element.category,
      maker: element.maker,
      dailyRate: element.dailyRate,
      reservations: element.reservations,
      displayImageUrl: element.displayImageUrl
    }
    rentalArray.push(rentalObject);
  }
  return rentalArray;
}