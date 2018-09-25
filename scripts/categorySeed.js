const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;



mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/sharebox"
);

const categorySeed = [
  {
    category: 'Gardening Tools',
    description: 'Tools for the Gardening'
  },
  {
    category: 'Househost Tools',
    description: 'Tools for the Househost'
  }
];

db.Category
  .remove({})
  .then(() => db.Category.collection.insertMany(categorySeed))
  .then(data => {
    console.log(data.insertedCount + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });