const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Rentals collection and inserts the rentals below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/sharebox"
);

const rentalSeed = [
  {
    name: 'Hand Trowel',
    category: 'Gardening Tools',
    maker: 'Home Depot',
    sku: 'p-2017-66b-002',
    dailyRate: 0.20,
    reservations: [],
    pastRentals: [],
    timesRented: 22,
    dateAcquired: 1492257600,
    condition: 'Good',
    images: [],
    displayImageUrl: "https://res.cloudinary.com/dvp0y7ati/image/upload/v1536736122/hand-troweljpg.jpg",
    type: "rental",
    latitude:43.666676,
    longitude:-79.398458,
  },
  {
    name: 'Pruning Shears',
    category: 'Gardening Tools',
    maker: 'Home Depot',
    sku: 'p-2018-89k-004',
    dailyRate: 0.50,
    reservations: [],
    pastRentals: [],
    timesRented: 0,
    dateAcquired: 1525435200,
    condition: 'New',
    images: [],
    displayImageUrl: "https://res.cloudinary.com/dvp0y7ati/image/upload/v1536736123/pruning-shears.jpg",
    type: "rental",
    latitude:43.660011,
    longitude:-79.394834,
  },
  {
    name: 'Rake',
    category: 'Gardening Tools',
    maker: 'Home Depot',
    sku: 'p-2018-79p-011',
    dailyRate: 0.50,
    reservations: [],
    pastRentals: [],
    timesRented: 6,
    dateAcquired: 1492257600,
    condition: 'Good',
    images: [],
    displayImageUrl: "https://res.cloudinary.com/dvp0y7ati/image/upload/v1536736123/rake.jpg",
    type: "rental",
    latitude:43.659681,
    longitude:-79.4007,
  },
  {
    name: 'Garden Spade',
    category: 'Gardening Tools',
    maker: 'Home Depot',
    sku: 'k-554-urq-14',
    dailyRate: 0.20,
    reservations: [],
    pastRentals: [],
    timesRented: 112,
    dateAcquired: 1464868800,
    condition: 'Disrepair',
    images: [],
    displayImageUrl: "https://res.cloudinary.com/dvp0y7ati/image/upload/v1536736123/garden-spade.jpg",
    type: "rental",
    latitude:43.663908,
    longitude:-79.394486,
  },
  {
    name: 'Garden Hoe',
    category: 'Gardening Tools',
    maker: 'Home Depot',
    sku: 'k-122-hrs-01',
    dailyRate: 0.50,
    reservations: [],
    pastRentals: [],
    timesRented: 87,
    dateAcquired: 1464868800,
    condition: 'Working',
    images: [],
    displayImageUrl: "https://res.cloudinary.com/dvp0y7ati/image/upload/v1536736123/garden-hoe.jpg",
    type: "rental",
    latitude:43.664485,
    longitude:-79.399693,
  },
  {
    name: 'Loppers',
    category: 'Gardening Tools',
    maker: 'Home Depot',
    sku: 'k-212-aja-118',
    dailyRate: 1.00,
    reservations: [],
    pastRentals: [],
    timesRented: 79,
    dateAcquired: 1464868800,
    condition: 'Working',
    images: [],
    displayImageUrl: "https://res.cloudinary.com/dvp0y7ati/image/upload/v1536736123/loppers.jpg",
    type: "rental",
    latitude:43.65988,
    longitude:-79.390477,
  }
];

db.Rental
  .remove({})
  .then(() => db.Rental.collection.insertMany(rentalSeed))
  .then(data => {
    console.log(data.insertedCount + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });