import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import { Input, FormBtn } from "../../components/Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";
import Dropzone from "react-dropzone";
import request from "superagent";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import "./AddProductPage.css";

//For Uploading Images
const CLOUDINARY_UPLOAD_PRESET = "";
const CLOUDINARY_UPLOAD_URL = "";

class AddProductPage extends Component {

  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },

    name: "",
    category:"",
    maker: "",
    dailyRate: 0,
    displayImageUrl:"",
    uploadedFile: null,
    uploadedFileCloudinaryUrl: '',
    lat: 0,
    lng: 0
  }



  componentDidMount(){
    this.loadProducts();
    this.getGeoLocation();
  }

  loadProducts =() => {
    this.setState({
      name:"",
      category:"",
      maker:"",
      displayImageUrl:"",
      uploadedFile: null,
      uploadedFileCloudinaryUrl: '',
      dailyRate: 0,
      lat: 0,
      lng:0
  })
  }

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        }
      )
    } else {
      error => console.log(error)
    }
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
    // console.log(this.state);

    API.saveProduct({    
        name: this.state.name,
        category:this.state.category,
        maker: this.state.maker,
        dailyRate: this.state.dailyRate,
        latitude: this.state.lat,
        longitude: this.state.lng,
        displayImageUrl:this.state.uploadedFileCloudinaryUrl,
        type: "rental",
        condition: "Working",
        sku:""
    })
    .then(res => {
      console.log(res);
      if (res.status === 200){
      this.setModal({
        body: <h4>Product is sucessfully created in our database</h4>
      })
      // created the product
      this.loadProducts();
      }
      // Once logged in, set this.state.redirect to true so the component will reload and trigger the if/else to redirect elsewhere
      this.props.setRedirect();

  }).catch(err => console.log(err));
  };


  render() {
    //  'from' is set as a referrer either:
    //    a) when login is arrived at due to a redirect caused by trying to access a protected route prior to signing in
    //    b) when the login page is arrived at from the signup page - this allows us to prevent sending a user back to signup after logging in
    console.log(this.props.location.state);
    const { from } = this.props.location.state || { from: null };
    if (this.state.redirect) {
      if (from) {
        return <Redirect to={from} />
      } else {
        this.props.history.goBack();
      }
    }

    return (

      <div className="login-container" >
        <div className="sticky-footer-div">
          <NavBar
            loggedIn={this.props.loggedIn}
            logout={this.props.logout}
            location={this.props.location}
            toggleForm={this.toggleForm}
            loginShow={this.state.loginShow}
          />
        
        <div id="login-forms-container">
        <div className="login-form-div">
        <h2>Add Product</h2>
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
                <img className="upload-tool-pic" name="photo" src={this.state.uploadedFileCloudinaryUrl} alt=""></img>
                :
                <img className="upload-tool-pic" name="photo" alt="" ></img>}
              
            </Dropzone>
          </div>
          <div className="row">
          <div className="group col-md-3">
          <Input
            value={this.state.name}
            onChange={this.handleInputChange}
            name="name"
            type="text"
            pattern="^[a-zA-Z0-9 ]+$"
            label="Product Name:"
          />
          </div>
          <div className="group col-md-3">
          <Input
            value={this.state.maker}
            onChange={this.handleInputChange}
            name="maker"
            type="text"
            pattern="^[a-zA-Z0-9 ]+$"
            label="Maker:"
          />
          </div>
          <div className="group col-md-3">
          <Input
            value={this.state.category}
            onChange={this.handleInputChange}
            name="category"
            type="text"
            pattern="^[a-zA-Z0-9 ]+$"
            label="Category:"
          />
          </div>
          <div className="group col-md-3">
          <Input
            value={this.state.dailyRate}
            onChange={this.handleInputChange}
            name="dailyRate"
            label="Daily Rate:"
          />
          </div>
          </div>
          <div className="group">
          <Input
            value={this.state.lat}
            name="lat"
            type="hidden"
          />
          </div>
          <div className="group">
          <Input
            value={this.state.lng}
            name="lng"
            type="hidden"
          />
          </div>
          <FormBtn
            onClick={this.handleFormSubmit}
          >
            Submit
        </FormBtn>
        </form>
        </Fragment>
        </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default AddProductPage;
