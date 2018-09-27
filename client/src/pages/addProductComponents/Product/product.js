import React, { Component } from "react";
import { Button, Modal, Table, ModalHeader,Form, ModalBody, FormGroup,ModalFooter, Label, Input, Container } from "reactstrap";
// import DropBox from "./Droppic.js";
import Dropzone from "react-dropzone";
import request from "superagent";
import API from "../../../utils/productApi";
// import  ListItem from "./../Components/Listitem";
// import { List, Listitem } from "./../Components/List";
import DeleteButton from "../DeleteButton";
import ViewProductButton from "../viewProductBtn";
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
const CLOUDINARY_UPLOAD_URL =
  " https://api.cloudinary.com/v1_1/dvp0y7ati/upload";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productArr: [],
      category:"",
      name: "",
      maker: "",
      dailyRate: 0,
      modal: false,
      viewList: false,
      uploadedFile: null,
      uploadedFileCloudinaryUrl: "",
      lat: 0,
      lng: 0
    };
    this.toggle = this.toggle.bind(this);
    this.view = this.view.bind(this);
  }
  
  componentDidMount(){
    this.loadProducts();
    this.getGeoLocation();
  }
  
  loadProducts = () =>{
    API.getProducts()
      .then(res => 
      //   this.setState({
      //     productArr: res.data,
      //     name:"",
      //     maker:"",
      //     dailyRate: Number,
      //     note:"",
      //     // select:""
      // }
      console.log(res))
      .catch(err => console.log(err));
  };
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
  delete =(id) => {
    API.deleteProducts(id)
      .then(res => this.loadProducts())
      .catch(err => console.log(err))
    };
  
  //Toggle modal function
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  };
  view(){
    console.log('view button clicked');
    this.setState({
      viewList: !this.state.viewList
    });
  }
  //This helps track the number of item on the database which also get rendered on modal
 addItem(){
   this.setState({
     item: this.state.item+1
   })
 }
  // Submit button click , save it to MongoDb Anil's mlab
  handleFormSubmit = event => {
    event.preventDefault();
    console.log(this.state);
    this.toggle();
    API.saveProduct({    
        name: this.state.name,
        description: this.state.maker,
        daily_Rent: this.state.dailyRate,
        lat:this.state.lat,
        lng:this.state.lng,
        photo: this.state.uploadedFileCloudinaryUrl
    })
    .then(res => console.log(this.name, this.maker,this.dailyRate),this.loadProducts())
    .catch(err => console.log(err));
    
  };
  onImageDrop(files) {
    this.setState({ uploadedFile: files[0] });

    this.handleImageUpload(files[0]);
  }
  handleImageUpload(file) {
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      .field("file", file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== "") {
        this.setState({ uploadedFileCloudinaryUrl: response.body.secure_url });
      }
    });
  }
  render() {
    return (
      <Container>
        <Form>
          <FormGroup>
            
            <Input
              value={this.state.name}
              onChange={this.handleInputChange}
              name="name"
              placeholder="product Name"
              
            />
          </FormGroup>
          <FormGroup>
            
            <Input  
              value={this.state.maker}
              
              onChange={this.handleInputChange}
              name="maker"
              placeholder="product description"
              
            />
          </FormGroup>
            <FormGroup>
              
              <Input
                value={this.state.dailyRate}
                onChange={this.handleInputChange}
                name="dailyRate"
                placeholder="daily rate"            
              />
            </FormGroup>

         
          <FormGroup>
            
            <Input
              value={this.state.category}
              onChange={this.handleInputChange}
              name="category" 
              type="text"     
              placeholder="category" 
            />
          </FormGroup>  
          <FormGroup>
            <Input
              value={this.state.lat}
              name="lat" 
              type="hidden"      
            />
          </FormGroup>  
          <FormGroup>
            <Input
              value={this.state.lng}
              name="lng" 
              type="hidden"      
            />
          </FormGroup>  
          <ViewProductButton 
              onClick={this.view}
            /> 
          {this.state.viewList ? (
            this.state.productArr.length ? (
          <Table>
                      <thead>
                        <tr>
                            <th></th>
                            <th className="productTitle">Product Name</th>                 
                            <th className="productDescription">Description</th>             
                            <th className="productRent">Daily Rate</th>                 
                        </tr>
                      </thead>
                      {/* (this.state.productArr.length) ? */}
                        {this.state.productArr.map(product =>    
                          <tr key={product._id}>
                            <th>{product.name}</th>
                            <th>{product.maker}</th>
                            <th>${product.dailyRate}</th>
                            <DeleteButton 
                        onClick={() => this.delete (product._id)}                     
                        />
                          </tr>
                        )}
                        
            </Table>  ) : <h3>No results</h3>
          ):
                   null             
           }


            {/* {this.state.viewList ? 
                        (this.state.productArr.length) ? (
                <List>
                  {this.state.productArr.map(product => (
                    <Listitem key={product._id}>
                        {product.name} - ${product.daily_Rent}
                        <DeleteButton 
                        onClick={() => this.delete (product._id)}                     
                        />
                    </Listitem>
                    ))}
                </List>
                        
                  ): (
                    <h3>No results</h3>
                )
              :
                null
                } */}
          <Button className="btn" onClick={this.handleFormSubmit}>
            Submit
          </Button>
        </Form>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}>Thank You!</ModalHeader>
              <ModalBody>
                <h1 id="title">Product Successfully Added</h1>
                  {/* <Table>
                      <thead>
                        <tr>
                            <th>#</th>
                            <th className="productTitle">Product Name</th>                 
                            <th className="productDescription">Description</th>             
                            <th className="productRent">Daily_Rent</th>                 
                        </tr>
                      </thead>
                        {this.state.productArr.map(product =>    
                          <tr key={product._id}>
                            <th>{product.addItem}</th>
                            <th>{product.name}</th>
                            <th>{product.description}</th>
                            <th>${product.daily_Rent}</th>
                          </tr>
                        )}       
                      </Table> */}
              </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={this.toggle}>
              Add to View Product Page
            </Button>{" "} */}
            <Button color="primary" onClick={this.toggle}>
              Exit
            </Button>
          </ModalFooter>
        </Modal>
        <Container>
          <div>
            {/* If uploadFileCloudinaryUrl exsists in the state output the image you uploaded */}
            {/* Else upload a default image of your specification */}
            {this.state.uploadedFileCloudinaryUrl ? (
              <img height="50px" src={this.state.uploadedFileCloudinaryUrl} />
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
        </Container>
      </Container>
    );
  }
}

export default Products;
