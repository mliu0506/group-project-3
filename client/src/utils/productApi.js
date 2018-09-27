import axios from "axios";

export default {
  //load products to database whenever user enter it on the form
  saveProduct: function(Products) {
    return axios.post("/addProduct", Products);
  },
  //Find all products
  getProducts: function(){
    return axios.get("/api/rentals/");
  },
  //Delete with given ID
  deleteProducts: function (id){
    return axios.delete("/api/items/" + id);
  }
};
// // Cancels a reservation - 'reservationData' collected by event listener and should include the item info and the user.
// removeRentalReservation: function (reservationId, reservationData) {
//   return axios.put(`/api/rentals/remove/${reservationId}`, reservationData);
// },