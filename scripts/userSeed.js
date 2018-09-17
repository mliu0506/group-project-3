const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

const pw = bcrypt.hashSync("123456", bcrypt.genSaltSync(10), null);

// This file empties the User collection and inserts the users below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/sharebox"
);

const userSeed = [
  {
    username: "Michael",
    password: pw,
    pwChangeAttempts: 0,
    firstName: "Michael",
    lastName: "Liu",
    email: "mliu@gmail.com",
    street: "14 Carlton Road",
    city: "Markham",
    province: "ON",
    postalCode: "L3R-1Z2",
    phone: "6473232268",
    photo: "https://res.cloudinary.com/dvp0y7ati/image/upload/v1537108233/ft1lrwqtgvor6ojfgx9g.jpg",
    reservations: [],
    pastRentals: []
  }
]

db.User
  .remove({})
  .then(() => db.User.collection.insertMany(userSeed))
  .then(data => {
    let cartArray = [];
    for (let i = 0; i < data.ops.length; i++) {
      const element = data.insertedIds[i];
      const cartObject = {
        customerId: element,
        tempReservations: [],
      };
      cartArray.push(cartObject);
    }
    db.ShoppingCart.collection.insertMany(cartArray)
      .then(() => {
        console.log(data.insertedCount + " records inserted!");
        process.exit(0);
      });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });