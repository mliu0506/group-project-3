import React, { Component } from "react";
import Products from "./Product/product";

// import "./components/product.css";
// import { ListGroup, ListGroupItem } from "reactstrap";

class addProduct extends Component {

  render() {
    return (
      <div>
        {/* <Products onChange={fields => this.onChange(fields)} /> */}
        <Products />
        {/* <DropModal /> */}
        {/* <ListGroup className="App">
          <ListGroupItem>
            {JSON.stringify(this.state.fields, null, 2)}{" "}
          </ListGroupItem>
        </ListGroup> */}
        {/* <p> {JSON.stringify(this.state.fields, null, 2)} </p> */}
      </div>
    );
  }
}

export default addProduct;
