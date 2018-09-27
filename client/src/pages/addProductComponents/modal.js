import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
//Anil's Work
import { Table } from "reactstrap";
// import API from "../utils/API"
// import List from "./List"
// import Listitem from "./Listitem"
// import Products from "./product"

class DropModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      // Products: Products
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  handleClickEvent(event){
      
  }
  // <a href="#" onClick={(event) => { func1(); func2();}}>Test Link</a>
  render() {
    return (
      <div>
        <Button color="success" onClick={this.toggle}>
           submit
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Product info</ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Daily_Rent</th>
                </tr>
              </thead>
            </Table>
              {/* <div className="productList">
                  <List />
                    <Listitem  key={Products._id} />
                    {this.state.Products.name} and {this.state.Products.description} and
                    {this.state.Products.daily_Rent}
              </div> */}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>
              Add to View Product Page
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DropModal;
