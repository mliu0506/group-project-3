import React, { Component, Fragment } from "react";
import { Input, FormBtn } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";
import Dropzone from 'react-dropzone';
import request from 'superagent';

const CLOUDINARY_UPLOAD_PRESET = '';
const CLOUDINARY_UPLOAD_URL = '';


export class SignupForm extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
    uploadedFile: null,
    uploadedFileCloudinaryUrl: ''
  }

  onImageDrop(files) {
    this.setState({uploadedFile: files[0]});

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({uploadedFileCloudinaryUrl: response.body.secure_url});
      }
      console.log(this.state.uploadedFileCloudinaryUrl);
    });
  }


  closeModal = () => {
    this.setState({
      modal: { isOpen: false }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
  
    //request to server to add a new username/password
    API.signup({
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      street: this.state.street,
      city: this.state.city,
      province: this.state.province,
      postalCode: this.state.postalCode,
      phone: this.state.phone,
      photo: this.state.uploadedFileCloudinaryUrl
    })
      .then(res => {
        if (res.data.error) {
          switch (res.data.error) {
            case "username taken":
              this.setModal({
                body: <h4>That username is already taken</h4>
              });
              break;
            case "email taken":
              this.setModal({
                body: <h4>That email already exists in our database</h4>
              });
              break;
            default:
              this.setModal({
                body: <h4>Something went wrong - please try again</h4>
              });
          }
        }
        //  'errmsg' seems to be standard MongoDB terminology...
        else if (!res.data.errmsg) {

          //  If signup was successful, log the user in and setRedirect, which will send them either back where they came from, or to where they were going (the 'to' part of this is currently irrelevant, but may again be relevant if there are any links to protected routes that show to non-logged in users - such as cart functionality that requires a login before checkout)
          API.login({
            username: this.state.username,
            password: this.state.password
          }).then(response => {
            // update App.js state
            this.props.updateUser({
              auth: true,
              state: {
                loggedIn: true,
                username: res.data.username,
                firstName: res.data.firstName,
              }
            });
            // Once logged in, set call this.props.redirect to setState on the login page so the component will reload and trigger the if/else to redirect elsewhere
            this.props.setRedirect();
          })
        } else {
          console.log('username already taken');
        }
      }).catch(error => {
        console.log('signup error: ');
        console.log(error);
      });
  };

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          closeModal={this.closeModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <form>
          <div className="group">  
            <Dropzone

              multiple={false}
              accept="image/*"
              onDrop={this
              .onImageDrop
              .bind(this)}>
              <p>Drop an image or click to select a file to upload.</p>
              {this.state.uploadedFileCloudinaryUrl?
                <img className="upload-profile-pic" name="photo" src={this.state.uploadedFileCloudinaryUrl}></img>
                :
                <img className="upload-profile-pic" name="photo" src="https://mliu0506.github.io/friends-finder/app/public/images/default.png"></img>}
              
            </Dropzone>
          </div>
          <div className="row">
          <div className="group col-md-4">
          <Input
            value={this.state.username}
            onChange={this.handleInputChange}
            name="username"
            type="text"
            pattern="^[a-zA-Z0-9]+$"
            label="Create a Username:"
          />
          </div>
          <div className="group col-md-4">
          <Input
            value={this.state.password}
            onChange={this.handleInputChange}
            name="password"
            type="password"
            pattern="^[\S]{4,}$"
            label="Create a Password:"
          />
          </div>
          <div className="group col-md-4">
          <Input
            value={this.state.confirmPassword}
            onChange={this.handleInputChange}
            name="confirmPassword"
            type="password"
            pattern={this.state.password}
            label="Confirm your password:"
          />
          </div>
          </div>
          <div className="row">
          <div className="group col-md-4">
          <Input
            value={this.state.firstName}
            onChange={this.handleInputChange}
            name="firstName"
            type="text"
            pattern="^[a-zA-Z]+$"
            label="First Name:"
          />
          </div>
          <div className="group col-md-4">
          <Input
            value={this.state.lastName}
            onChange={this.handleInputChange}
            name="lastName"
            type="text"
            pattern="^[a-zA-Z0-9]+$"
            label="Last Name:"
          />
          </div>
          <div className="group col-md-4">
          <Input
            value={this.state.email}
            onChange={this.handleInputChange}
            name="email"
            type="email"
            pattern="^[a-zA-Z0-9.!#$%&amp;'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
            label="Email:"
          />
          </div>
          </div>
          <div className="row">
          <div className="group col-md-4">
          <Input
            value={this.state.street}
            onChange={this.handleInputChange}
            name="street"
            type="text"
            label="Street Address:"
          />
          </div>
          <div className="group col-md-4">
          <Input
            value={this.state.city}
            onChange={this.handleInputChange}
            name="city"
            type="text"
            label="City:"
          />
          </div>
          <div className="group col-md-4">
          <Input
            value={this.state.province.toUpperCase()}
            onChange={this.handleInputChange}
            name="province"
            type="text"
            label="Province:"
          />
          </div>
          </div>
          <div className="row">
          <div className="group col-md-4">
          <Input
            value={this.state.postalCode}
            onChange={this.handleInputChange}
            name="postalCode"
            pattern="^[a-zA-Z0-9-]+$"
            label="Postal Code:"
            placeholder=""
          />
          </div>
          <div className="group col-md-4">
          <Input
            value={this.state.phone}
            onChange={this.handleInputChange}
            name="phone"
            type="tel"
            pattern="^\d{3}[\-]\d{3}[\-]\d{4}"
            label="Phone Number:"
            placeholder=""
          />
          </div>
          </div>
          <FormBtn
            disabled={(
              (
                !this.state.username ||
                !/^[a-zA-Z0-9]+$/.test(this.state.username)
              ) || (
                !this.state.password ||
                !/^[\S]{4,}$/.test(this.state.password)
              ) || (
                !this.state.firstName ||
                !/^[a-zA-Z]+$/.test(this.state.firstName)
              ) || (
                !this.state.lastName ||
                !/^[a-zA-Z]+$/.test(this.state.lastName)
              ) || (
                !this.state.email ||
                !/^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email)
              ) || (
                !this.state.street
              ) || (
                !this.state.city
              ) || (
                !this.state.province
              ) || (
                !this.state.postalCode
              ) || (
                !this.state.phone ||
                !/^\d{3}[-]\d{3}[-]\d{4}/.test(this.state.phone)
              )
            ) || (this.state.password !== this.state.confirmPassword)}
            onClick={this.handleFormSubmit}
          >
            Submit
        </FormBtn>
        </form>
      </Fragment>
    )
  }

}