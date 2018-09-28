import React, { Component, Fragment } from "react";
import { Button,Modal, ModalHeader, ModalBody, FormGroup,ModalFooter, Container } from "reactstrap";
import DropBox from "../Droppic";
import Dropzone from "react-dropzone";
import request from "superagent";
import API from "../../../utils/productApi";
import NavBar from '../../../components/Elements/NavBar';
import Footer from '../../../components/Elements/Footer';
import "./product.css";

// import  ListItem from "./../Components/Listitem";
// import { List, Listitem } from "./../Components/List";
// import DeleteButton from "../DeleteButton";
// import ViewProductButton from "../viewProductBtn";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import "./product.css";

//For Uploading Images
const CLOUDINARY_UPLOAD_PRESET = "ywtrj1y7";
const CLOUDINARY_UPLOAD_URL = " https://api.cloudinary.com/v1_1/dvp0y7ati/upload";

class Products extends Component {
  
    state = {
      productArr: [],
      category:"",
      name: "",
      maker: "",
      dailyRate: 0,
      modal: false,
      viewList: false,
      displayImageUrl:"",
      uploadedFile: null,
      // uploadedFileCloudinaryUrl: "",

      lat: 0,
      lng: 0
    };
    
  componentDidMount(){
    this.loadProducts();
    this.getGeoLocation();
  }
  loadProducts =() => {
    this.setState({
      // productArr: res.data,
      name:"",
      category:"",
      maker:"",
      displayImageUrl:"",
      dailyRate: 0,
      lat: 0,
      lng:0
  })
  }
  // loadProducts =()=> {
  //   API.getProduct()
  //     .then(res => 
  //       this.setState({
  //         productArr: res.data,
  //         name:"",
  //         category:"",
  //         maker:"",
  //         dailyRate: 0,
  //         lat: 0,
  //         lng:0
  //     }))
  //     .catch(err => console.log(err));
  //   };

  
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

  handleInputChange = event => {
    const {name, value } = event.target;

    this.setState({
      [name]: value
    });
  };
  // delete =(id) => {
  //   API.deleteProducts(id)
  //     .then(res => this.loadProducts())
  //     .catch(err => console.log(err))
  //   };
  
  //Toggle modal function
  toggle=()=> {
    this.setState({
      modal: !this.state.modal
    });
  };
  
  // view=()=>{
  //   console.log('view button clicked');
  //   this.setState({
  //     viewList: !this.state.viewList
  //   });
  // }
 
  // Submit button click , save it to MongoDb Anil's mlab
  handleFormSubmit = event => {
    event.preventDefault();
    // console.log(this.state);
    this.toggle();
    API.saveProduct({    
        name: this.state.name,
        category:this.state.category,
        maker: this.state.maker,
        dailyRate: this.state.dailyRate,
        lat:this.state.lat,
        lng:this.state.lng,
        displayImageUrl:this.state.displayImageUrl
    })
    .then(res => this.loadProducts())
    .catch(err => console.log(err));
    
  };
  onImageDrop=(files)=> {
    this.setState({ uploadedFile: files[0] });

    this.handleImageUpload(files[0]);
  }
  handleImageUpload=(file)=> {
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      .field("file", file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== "") {
        this.setState({ displayImageUrl: response.body.secure_url });
      }
    });
  }
  render(){
    return(
    <div>
      <div className="container-fluid">
       <div className="row">
          <NavBar
              loggedIn={this.props.loggedIn}
              logout={this.props.logout}
              location={this.props.location}
            />
        </div>
      </div>
    <form className="form">
      <div className="form-group">
        <input  className="form-control" value={this.state.name} 
                  onChange={this.handleInputChange} 
                  name="name"  
                  placeholder="Product Name"/>
      </div>
          <div className="form-group">
            <input  className="form-control" value={this.state.maker} 
                      onChange={this.handleInputChange} 
                      name="maker"  
                      placeholder="Maker"/>
          </div>
          <div className="form-group">
          <input  className="form-control" value={this.state.category} 
                    onChange={this.handleInputChange} 
                    name="category"  
                    placeholder="Category"/>
          </div>
          <div className="form-group">
          <input  className="form-control" value={this.state.dailyRate} 
                    onChange={this.handleInputChange} 
                    name="dailyRate"  
                    placeholder="Daily Rate"/>
          </div>
          <div className="form-group">
          <input  className="form-control" value={this.state.lat}     
                    name="lat"  
                    type="hidden"/>
          </div>
          <div className="form-group">
          <input  className="form-control" value={this.state.lng} 
                    name="lng"  
                    type="hidden"/>
          </div>
          <button className="btn btn-primary" onClick={this.handleFormSubmit}>
            Submit
          </button>
    </form>
    <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}>Thank You!</ModalHeader>
              <ModalBody>
                  <h1 id="title">Product Successfully Added</h1>
              </ModalBody>
              <ModalFooter>
                  <Button color="primary" onClick={this.toggle}>
                    Exit
                  </Button>
              </ModalFooter>
        </Modal>
        <div>
          <div> 
            {/* If uploadFileCloudinaryUrl exsists in the state output the image you uploaded
            {/* Else upload a default image of your specification */}
             {this.state.displayImageUrl ? (
              <img height="50px" src={this.state.displayImageUrl} />
            ) : (
              <img height="50px" src="" />
            )}
            <Dropzone
              multiple={false}
              accept="image/*"
              onDrop={this.onImageDrop.bind(this)}
            >
                <p>Drop an image or click to select a file to upload.</p>
            </Dropzone>
          </div> 
        </div> 
        {/* <Footer /> */}
    </div>
   
      
    )
  }
}

  export default Products;
