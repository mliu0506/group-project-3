import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import { ChangePwForm } from "./../../components/AuthForms";
import { UserUpdateForm } from "./../../components/AuthForms";
import Footer from "../../components/Elements/Footer";
import dateFns from "date-fns";

import { Link } from "react-router-dom";
import "./Profile.css"

class Profile extends Component {
  
    
    state = {
      modal: {
        isOpen: false,
        body: "",
        buttons: ""
      },
      loadingModalOpen: false,
      userData: [],
      reservations: [],
      pastRentals: [],
      formsShow: false,
      pastRentalsShow: false,
      userPwForm: false,
      userDataForm: false
    };
  
  
  

  componentWillMount() {
    this.getUserProfileData();
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  closeModal = () => {
    this.setState({
      modal: { isOpen: false }
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
  };

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  };

  getUserProfileData = () => {
    API.getUserProfileData()
      .then(user => {
        console.log(user);
        this.setState({
          userData: user.data,
          reservations: user.data.reservations,
          pastRentals: user.data.pastRentals
        });
      });
  }

  toggleFormsShow = () => {
    this.setState({
      formsShow: false,
      userPwForm: false,
      userDataForm: false
    })
  }

  toggleEditUserInfoForm = () => {
    this.setState({
      formsShow: true,
      userPwForm: false,
      userDataForm: true
    });
  }

  toggleChangePwForm = () => {
    this.setState({
      formsShow: true,
      userPwForm: true,
      userDataForm: false
    });
  }


  togglePastRentals = () => {
    this.setState({
      pastRentalsShow: !this.state.pastRentalsShow,
    });
  }

  getRentalDetails = reservation => {
    const { category, itemId } = reservation;
    // console.log(reservation);
    API.getRentalById(category, itemId)
      .then(res => {
        console.log(res);
        this.setModal({
          body:
            <div className="reservation-modal-div">
              <div className="reservation-modal-data">
                <h2>{res.data.name}</h2>
                <h4>by {res.data.maker}</h4>
                <h5>Daily Rate: {`$${parseFloat(res.data.dailyRate.$numberDecimal).toFixed(2)}`}</h5>
              </div>
              <div className="reservation-modal-image">
                <img src={res.data.displayImageUrl} alt={`${res.data.category}`} />
              </div>
            </div>
        })
      })
  }

  cancelReservationModal = reservation => {
    this.setModal({
      body:
        <Fragment>
          <h4>Are you sure?</h4>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={() => this.cancelReservation(reservation)}>Yes. Delete it.</button>
          <button onClick={this.closeModal}>No. Keep it.</button>
        </Fragment>
    })
  }
 
  cancelReservation = reservation => {
    this.closeModal();
    this.toggleLoadingModal();
    const { _id } = reservation;
    console.log(_id);
    API.removeRentalReservation(_id, reservation)
      .then(res => {
        console.log(res);
        this.toggleLoadingModal();
        //  filter the row from the reservations array in state and then setState to the filtered data.
        const newReservations = this.state.reservations.filter(reservation => (reservation._id !== _id));

        //  empty selection and selectedRow so the affected buttons revert to disabled
        this.setState({
          reservations: newReservations
        })
      })
      .catch(err => console.log(err));
  }




  render() {

    const { city, email, firstName, lastName, phone, province, street, username, postalCode, photo } = this.state.userData;

    let telephone;
    if (phone) telephone = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;

    if (this.state.reservations.length > 0) {
      this.state.reservations.forEach(reservation => {
        if (reservation.paid) {
          reservation.hasPaid = "True";
          reservation.amtDue = "$0.00"
        }
        else {
          reservation.hasPaid = "False";
          //  86400 = # of seconds in a day
          const bill = (((parseInt(reservation.date.to) - parseInt(reservation.date.from)) / 86400) + 1) * reservation.dailyRate.$numberDecimal;
          reservation.amtDue = "$" + parseFloat(bill).toFixed(2);
        }
      })
    }


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

        <div className="page-container">
          <div className="content-container">
            <div className="user-info-div">
              <img className="profile-pic" src={photo} ></img>
              <h3>{firstName} {lastName}</h3>
              <h3>Username: {username}</h3>
              <h4>{street}</h4>
              <h4>{city}, {province}, {postalCode}</h4>
              <h4>{email}</h4>
              <h4>{telephone}</h4>
            </div>

            {this.state.formsShow ? (
              <div className="user-info-btn-div">
                <button onClick={this.toggleFormsShow}>Show Reservations</button>
              </div>
            ) : (
                <div className="user-info-btn-div">
                  <button onClick={this.toggleEditUserInfoForm}>Edit Profile</button>
                  <button onClick={this.toggleChangePwForm}>Change Password</button>
                </div>
              )
            }
            <Link className="btn btn-primary" to="/addProduct" role="button">Add Product</Link>

            {this.state.formsShow ? null : (
              <div className="reservations-container">
                <h2>My Reservations</h2>

                {this.state.reservations.length > 0 ?
                  <Fragment>
                    {this.state.reservations.sort((a, b) => {
                      let keyA = new Date(a.date.from);
                      let keyB = new Date(b.date.from);
                      if (keyA < keyB) return -1;
                      if (keyA > keyB) return 1;
                      return 0;
                    }).map(res => (
                      <div key={res._id} className="reservation-card">
                        {res.date.from === res.date.to ? (
                          <h5>{dateFns.format(res.date.from * 1000, "MMM Do YYYY")}</h5>
                        ) : (
                            <h5>{dateFns.format(res.date.from * 1000, "MMM Do YYYY")} - {dateFns.format(res.date.to * 1000, "MMM Do YYYY")}</h5>
                          )
                        }
                        <h4>{res.itemName}</h4>
                        <h3>{res.category}</h3>
                        <p>Amt due at pick up: {res.amtDue}</p>
                        {res.paid ?
                          <i className="fas fa-trash-alt fa-lg profile-icon-disabled" aria-hidden="true"></i>
                          :
                          <i onClick={() => this.cancelReservationModal(res)} className="fas fa-trash-alt fa-lg" aria-hidden="true"></i>
                        }
                        <i onClick={() => this.getRentalDetails(res)} className="far fa-images fa-2x" aria-hidden="true"></i>
                      </div>
                    ))}
                  </Fragment>
                  : <h4>You have no rentals reserved.</h4>}
              </div>
            )}

            {this.state.pastRentalsShow ?
              <div className="reservations-container past-reservations">
                <h2>My Reservations</h2>
                {this.state.pastRentals ? this.state.pastRentals.map(res => (
                  <div key={res._id} className="reservation-card">
                    {res.date.from === res.date.to ? (
                      <h5>{dateFns.format(res.date.from * 1000, "MMM Do YYYY")}</h5>
                    ) : (
                        <h5>{dateFns.format(res.date.from * 1000, "MMM Do YYYY")} - {dateFns.format(res.date.to * 1000, "MMM Do YYYY")}</h5>
                      )
                    }
                    <h4>{res.itemName}</h4>
                    <h3>{res.category}</h3>
                    <p>Amt due at pick up: {res.amtDue}</p>
                    <i onClick={() => this.cancelReservation(res)} className="fas fa-trash-alt fa-lg" aria-hidden="true"></i>
                    <i onClick={() => this.getRentalDetails(res)} className="far fa-images fa-2x" aria-hidden="true"></i>
                  </div>
                )) : null}
              </div>
              : null}

            {this.state.userPwForm ?
              <div className="user-forms-container">
                <div className="user-forms-toggle-div">
                  <button className="user-toggle-btn user-toggle-btn-light" onClick={this.toggleEditUserInfoForm}>Edit Info</button>
                  <button className="user-toggle-btn">Change PW</button>
                </div>
                <div className="user-form-div">
                  <ChangePwForm
                    getUserProfileData={this.getUserProfileData}
                    badLogout={this.props.badLogout}
                  />
                </div>
              </div>
              : null}

            {this.state.userDataForm ?
              <div className="user-forms-container">
                <div className="user-forms-toggle-div">
                  <button className="user-toggle-btn">Edit Info</button>
                  <button className="user-toggle-btn user-toggle-btn-light" onClick={this.toggleChangePwForm}>Change PW</button>
                </div>
                <div className="user-form-div">
                  <UserUpdateForm
                    getUserProfileData={this.getUserProfileData}
                    userData={this.state.userData}
                  />
                </div>
              </div>
              : null}

          </div>
          <Footer />
        </div>
      </Fragment >
    )
  }
}

export default Profile;