import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import "./ShoppingCart.css";
import dateFns from "date-fns"
import { Link } from 'react-router-dom';
import CheckoutForm from "../../components/Stripe/CheckoutForm";
import StripeProvider from "../../components/Stripe/CheckoutForm";

class ShoppingCart extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    loadingModalOpen: false,
    tempReservations: [],
    rentals: [],
    complete: false,
    total: 0
  }

  componentWillMount() {
    this.getUserShoppingCart();
  }

  closeModal = (checkout) => {
    this.setState({
      modal: { isOpen: false }
    });
    if (checkout) {
      this.checkout();
    }
  }

  setModal = (modalInput) => {
    // console.log(modalInput)
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  }

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  getUserShoppingCart = () => {
    let total = 0.00;
    API.getUserShoppingCart()
      .then(cart => {
        cart.data.tempReservations.forEach(res => {
          total = (parseFloat(total) + parseFloat((((res.date.to - res.date.from) / 86400) + 1) * parseFloat(res.dailyRate.$numberDecimal))).toFixed(2);
        });
        this.setState({
          tempReservations: cart.data.tempReservations,
          total: parseFloat(total).toFixed(2)
        });
      });
  }

  getAllRentals = () => {
    API.getAllRentals()
      .then(res => {
        this.setState({
          rentals: res.data
        });
      })
      .catch(err => console.log(err));
  }



  removeReservationFromCart = id => {
    this.toggleLoadingModal();
    API.removeReservationFromCart(id)
      .then(res => {
        this.getUserShoppingCart();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  confirmReservation = rental => {
    this.toggleLoadingModal();
    API.reserveRental(rental)
      .then(() => {
        this.getUserShoppingCart();
        this.toggleLoadingModal();
      });
  }


 
  checkout = () => {
    this.toggleLoadingModal();
    let checkArray = [];
    let promiseArray = [];
    this.state.tempReservations.forEach(res => {
      const checkQuery = API.finalCheck(res);
      checkArray.push(checkQuery);
    });


    Promise.all(checkArray)
      .then(response => {
        // console.log(res)
        console.log(response)
        let noGood = [];
        let types = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i].data.response === "already reserved" || response[i].data.response === "full") {
            noGood.push({ name: response[i].data.info.name, id: response[i].data.tempId, type: response[i].data.info.type })
          }
        }
        console.log(noGood)
        if (noGood.length > 0) {
          noGood.forEach(del => {
            console.log(del)
        if (del.type === "item") {
              this.removeReservationFromCart(del.id);
            }
            types.push(del.type);
          });
          Promise.all(noGood)
            .then(() => {
              this.toggleLoadingModal();
              this.setModal({
                body:
                  <Fragment>
                    <h1><span role="img" aria-label="explodey face">🤯</span></h1>
                    <h4>It looks like someone beat you to the punch on the following: </h4>
                    {noGood.map(thing =>
                      <h3 key={thing.name}>{thing.name}</h3>
                    )}
                    <h5>Would you like to remove {noGood.length === 1 ? "it" : "them"} and continue to checkout, or go back and select another selection?</h5>
                  </Fragment>,
                buttons:
                  <Fragment>
                    {types.includes("rental")
                      ? <Link
                        className="modal-btn-link"
                        to={{ pathname: '/rentals' }}
                        role="button"
                      >
                        Rentals
              </Link> 
                        : types.includes("rental")
                          ? <Link
                            className="modal-btn-link"
                            to={{ pathname: '/rental' }}
                            role="button"
                          >
                            Rentals
              </Link>
                          : null
                    }
                    <button
                      className="modal-btn-link"
                      onClick={() => this.closeModal(true)}
                    >
                      Remove
                      </button>
                  </Fragment>
              })
            })
        } else {
          this.state.tempReservations.forEach(res => {
            //  Add total cost of the reservation to the reservation object:
            res.total = (((parseInt(res.date.to) - parseInt(res.date.from)) / 86400) + 1) * res.dailyRate.$numberDecimal;

            const resQuery = API.reserveRental(res);
            promiseArray.push(resQuery);
          });
          Promise.all(promiseArray)
            .then(() => {
              this.getUserShoppingCart();
              this.toggleLoadingModal();
              this.setModal({
                body: <h4>Your reservations are confirmed.</h4>,
                buttons:
                  <Fragment>
                    <Link className="modal-btn-link" to={{ pathname: "/profile" }} role="button">My Info</Link>
                    <button onClick={() => this.closeModal(false)}>Close</button>
                  </Fragment>
              })
              // this.setState({
              //   complete: true
              // });
            });
        }
      })
      .catch(err => console.log(err));
  }

  render() {

    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          closeModal={this.closeModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <LoadingModal show={this.state.loadingModalOpen} />
        <NavBar
          loggedIn={this.props.loggedIn}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container" id="shopping-cart-page">
          <div className='body-container '>
            <div className="shopping-cart-header">

              {
                this.state.tempReservations.length > 0 ?
                  <h3>You're almost done!</h3>
                  :
                  <h3 className="empty-cart">Your Shopping Cart is Empty</h3>
              }

            </div>
            {this.state.complete === true || this.state.tempReservations.length > 0
              ? <div className="payment-container">
                <StripeProvider>
                  <Elements>
                    <CheckoutForm
                      btn={() => this.checkout()}
                      firstName={this.props.firstName}
                      getUserShoppingCart={() => this.getUserShoppingCart()}
                      lastName={this.props.lastName}
                      removeReservationFromCart={() => this.removeReservationFromCart()}
                      setModal={this.setModal}
                      closeModal={this.closeModal}
                      tempReservations={this.state.tempReservations}
                      toggleLoadingModal={this.toggleLoadingModal}
                      total={this.state.total}
                    />
                  </Elements>
                </StripeProvider>
              </div>
              : null}

            <div className="cart-page-container">
              <div className="cart-items">
                {this.state.tempReservations ? (
                  this.state.tempReservations.map(res => (
                    <div key={res._id} className="cart-res-container">
                      <h2>Rentals</h2>
                      <h3>{res.itemName}</h3>
                      {res.date.from !== res.date.to ? <h4>Reservation Dates:</h4> : <h4>Reservation Date:</h4>}
                      {res.date.from !== res.date.to
                        ? <div><p>From: {dateFns.format(res.date.from * 1000, "ddd MMM Do YYYY")}</p>
                          <p>To: {dateFns.format(res.date.to * 1000, "ddd MMM Do YYYY")}</p></div>
                        : <p>{dateFns.format(res.date.from * 1000, "ddd MMM Do YYYY")}</p>}
                      <p>Daily Rate: ${parseFloat(res.dailyRate.$numberDecimal).toFixed(2)}</p>
                      <h4>Total cost: ${parseFloat(((((res.date.to - res.date.from) / 86400) + 1) * parseFloat(res.dailyRate.$numberDecimal)).toFixed(2))}</h4>
                      {/* <button onClick={() => this.confirmReservation(res)}>Confirm</button> */}
                      <button className="remove-reservation" onClick={() => this.removeReservationFromCart(res._id)}>Remove</button>
                    </div>
                  ))
                ) : null}

                <div className={this.state.tempReservations.length === 0 ?
                  "no-confirm" : "checkout-proceed"}>
                  <button className={`${ this.state.tempReservations.length === 0 ?
                    "chkoutDisabled" : ""}`} onClick={() => this.checkout()}>Confirm Reservation <i className="fas fa-check-circle"></i></button>
                </div>
              </div>
            </div>
          </div>
          <Footer />

        </div>
      </Fragment>
    )
  }
}

export default ShoppingCart;