import axios from "axios";

export default {

 
  // CHARGE ROUTES
  // Send charge to Stripe
  charge: function (charge) {
    return axios.post('/api/charge', charge);
  },
  // Update reservation paid status
  logResPayment: function (res, total) {
    return axios.put('/api/charge/respaid', { reservation: res, resTotal: total });
  },

  // USER AUTHENTICATION ROUTES
  // Get user info
  getUser: function () {
    return axios.get('/user');
  },
  // Get user info for profile (excludes some data)
  getUserProfileData: function () {
    return axios.get('/user/data');
  },
  // User updates their own info
  updateUserInfo: function (userData) {
    return axios.put('/user/data', userData);
  },
  // New user signup
  signup: function (signupData) {
    return axios.post('/user', signupData);
  },
  // User login
  login: function (loginData) {
    return axios.post('/user/login', loginData);
  },
  // User logout
  logout: function () {
    return axios.post('/user/logout');
  },
  //  Checks current password and returns error message if incorrect, or changes it if correct
  changePassword: function (pwData) {
    return axios.post('/user/change', pwData);
  },



  // CART ROUTES
  // Get user shopping cart
  getUserShoppingCart: function (id) {
    return axios.get(`/api/cart/${id}`);
  },

  // Adds a rental reservation to shopping cart and tempReservations collection
  addReservationToCart: function (from, to, rentalData) {
    return axios.post(`/api/cart/rentals/date/${from}/${to}`, rentalData);
  },

  // After checking for duplicates, finding one, and then asking if the user would like to change, updates the existing temporary reservation
  changeReservationInCart: function (from, to, rentalData) {
    return axios.put(`/api/cart/rentals/date/${from}/${to}`, rentalData);
  },

  // Removes reservation from cart and deletes document from tempReservation
  removeReservationFromCart: (id) => {
    return axios.delete(`/api/cart/rentals/${id}`);
  },

  //  Grabs all cart items and sends them to the db
  checkoutAllCartItems: (checkoutObject) => {
    return axios.post('/api/cart/checkout', checkoutObject);
  },


  // USER ROUTES


  //  USER RENTAL ROUTES
  // Gets All Rentals - this one may not be necessary, depending on how we set this up
  getAllRentals: function () {
    return axios.get('/api/rentals/');
  },

  // This route creates a doc in the Reservations collection,
  // and creates a reference in the associated User and Rental documents
  // Reserves Rental by date range
  reserveRental: function (rentalData) {
    return axios.post(`/api/rentals`, rentalData);
  },

  finalCheck: function (rentalData) {
    return axios.put(`/api/rentals`, rentalData)
  },

  // Gets Rental item by category - if the user chooses Paddleboard or Kayak without first entering dates, this will pull all rentals.
  getRentalsByCategory: function (category) {
    return axios.get(`/api/rentals/${category}`);
  },

  // Gets Rental item by id - if the user chooses a particular item, this will pull the data for it.
  getRentalById: function (category, id) {
    return axios.get(`/api/rentals/${category}/${id}`);
  },
  // Cancels a reservation - 'reservationData' collected by event listener and should include the item info and the user.
  removeRentalReservation: function (reservationId, reservationData) {
    return axios.put(`/api/rentals/remove/${reservationId}`, reservationData);
  },

  //CATEGORY ROUTES
  // Gets all categories
  getAllCategories: function () {
    return axios.get('/user/data');
  },



};
