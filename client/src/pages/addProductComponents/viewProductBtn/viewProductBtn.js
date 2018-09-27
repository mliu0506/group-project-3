import React from "react";
import "./viewProductBtn.css";


const ViewProductButton = (props) => (
    <button type="button" className="btn btn-primary" id="viewProductButton" onClick={props.onClick}>
      View Product
    </button>
)

export default ViewProductButton