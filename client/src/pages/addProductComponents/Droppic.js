// import React, { Component } from "react";
// import Dropzone from "react-dropzone";
// import request from "superagent";
// import { Container } from "reactstrap";

// const CLOUDINARY_UPLOAD_PRESET = "ywtrj1y7";
// const CLOUDINARY_UPLOAD_URL =
//   " https://api.cloudinary.com/v1_1/dvp0y7ati/upload";

// class DropBox extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       uploadedFile: null,
//       uploadedFileCloudinaryUrl: ""
//     };
//   }

//   handleImageUpload(file) {
//     let upload = request
//       .post(CLOUDINARY_UPLOAD_URL)
//       .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
//       .field("file", file);

//     upload.end((err, response) => {
//       if (err) {
//         console.error(err);
//       }

//       if (response.body.secure_url !== "") {
//         this.setState({ uploadedFileCloudinaryUrl: response.body.secure_url });
//       }
//     });
//   }
//   render() {
//     return (
//       <Container>
//         <div>
//           {/* If uploadFileCloudinaryUrl exsists in the state output the image you uploaded */}
//           {/* Else upload a default image of your specification */}
//           {this.state.uploadedFileCloudinaryUrl ? (
//             <img height="50px" src={this.state.uploadedFileCloudinaryUrl} />
//           ) : (
//             <img height="50px" src="" />
//           )}
//           <Dropzone
//             multiple={false}
//             accept="image/*"
//             onDrop={this.onImageDrop.bind(this)}
//           >
//             <p>Drop an image or click to select a file to upload.</p>
//           </Dropzone>
//         </div>
//       </Container>
//     );
//   }
// }

// export default DropBox;
