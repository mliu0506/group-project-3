import React, { Component, Fragment } from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from 'react-stripe-elements';
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import { Link } from 'react-router-dom';
import './CheckoutForm.css';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.checkout = this.checkout.bind(this);
    this.state = {
      complete: false,
      modal: {
        isOpen: false,
        body: "",
        buttons: ""
      },
      cardHolderName: "",
      cardNumber: ""
    };
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  }

  closeModal = (checkout) => {
    this.setState({
      modal: { isOpen: false }
    });
    if (checkout) {
      this.checkout();
    }
  }


  removeReservationFromCart = id => {
    this.toggleLoadingModal();
    API.removeReservationFromCart(id)
      .then(res => {
        this.props.getUserShoppingCart();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  checkout = () => {
    // console.log("running checkout")
    this.props.toggleLoadingModal();
    let checkArray = [];
    this.props.tempReservations.forEach(res => {
      const checkQuery = API.finalCheck(res);
      checkArray.push(checkQuery);

    });


    Promise.all(checkArray)
      .then(response => {
        let noGood = [];
        let types = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i].data.response === "already reserved" || response[i].data.response === "full") {
            noGood.push({ name: response[i].data.info.name, id: response[i].data.tempId, type: response[i].data.info.type })
          }
        }
        // console.log(noGood)
        if (noGood.length > 0) {
          noGood.forEach(del => {
            if (del.type === "item") {
              this.removeReservationFromCart(del.id);
            }
            types.push(del.type);
          });
          Promise.all(noGood)
            .then(() => {
              this.props.toggleLoadingModal();
              this.setModal({
                body:
                  <Fragment>
                    <h1><span role="img" aria-label="explodey face">🤯</span></h1>
                    <br />
                    <h3>Oh no!!</h3>
                    <br />
                    <h4>Someone beat you to the punch and reserved the following {noGood.length === 1 ? "item" : "items"} before you did... </h4>
                    {noGood.map(thing =>
                      <h3 key={thing.name}>{thing.name}</h3>
                    )}
                    <h5>Would you like to remove {noGood.length === 1 ? "it" : "them"} and continue to checkout, or go back and select another date for your reservation?</h5>
                  </Fragment>,
                buttons:
                  <Fragment>
                    {types.includes("rental")
                      ? <Link
                        className="modal-btn-link"
                        to={{ pathname: '/rentals' }}
                        role="button"
                      >
                        Select new date
              </Link> 
                        : types.includes("rental")
                          ? <Link
                            className="modal-btn-link"
                            to={{ pathname: '/rental' }}
                            role="button"
                          >
                            Select new dates
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
        } else { // ***PAYMENT PROCESSING NEEDS TO GO HERE ***
          this.submit();
        }
      })
      .catch(err => console.log(err));
  }



  async submit(ev) {
    let { token } = await this.props.stripe.createToken({ name: this.state.cardHolderName });
    if (!token || !this.state.cardHolderName) {
      this.props.toggleLoadingModal();
      return this.setModal({
        body: "Complete all payment fields before clicking submit. ",
        buttons:
          <Fragment>
            <button onClick={() => this.closeModal(false)}>Continue</button>
          </Fragment>
      });
    }
    let charge = { token: token.id, chrgAmt: this.props.total };

    // let charge = { test: "test" };
    API.charge(charge)
      .then((res) => {
        if (res.data[0].status === "succeeded") {
          let promiseArray = [];
          this.props.tempReservations.forEach(res => {
            //  Add total cost of the reservation to the reservation object:
            res.total = (((parseInt(res.date.to) - parseInt(res.date.from)) / 86400) + 1) * res.dailyRate.$numberDecimal;
            const resQuery = API.reserveRental(res);
            promiseArray.push(resQuery);
          });
          Promise.all(promiseArray)
            .then(() => {
              let paymentArray = [];
              this.props.tempReservations.forEach(res => {
                let resTotal = parseFloat(((((res.date.to - res.date.from) / 86400) + 1) * parseFloat(res.dailyRate.$numberDecimal)).toFixed(2));
                const logResPayment = API.logResPayment(res, resTotal);
                paymentArray.push(logResPayment);
              });
              Promise.all(paymentArray)
                .then(() => {
                  this.props.getUserShoppingCart();
                  this.props.toggleLoadingModal();
                  this.setState({ complete: true });
                  this.props.setModal({
                    body: <h4>Your reservations are confirmed.</h4>,
                    buttons:
                      <Fragment>
                        <Link className="modal-btn-link" to={{ pathname: "/profile" }} role="button">My Info</Link>
                        <button onClick={() => this.props.closeModal(false)}>Close</button>
                      </Fragment>
                  })
                });
            });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.complete) return <h1>Purchase Complete</h1>;

    return (

      <div>
        <Modal
          show={this.state.modal.isOpen}
          closeModal={this.closeModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <div className="checkout">

          <div>
            <span className="test">Cardholder's Name</span>
            <input name="cardHolderName" className="test" type="text" placeholder="Michael Liu" value={this.state.cardHolderName} onChange={(e) => this.handleInputChange(e)} />
          </div>
          Card Number
          <CardNumberElement className="input numberInput" />
          Expiration date
          <CardExpiryElement className="expInput input" />
          CVC
          <CardCVCElement className="cvcInput input" />

          <button className="chkbtn" onClick={this.checkout}>Pay {this.props.total > 0 ? "$" + this.props.total : null}</button>

        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);