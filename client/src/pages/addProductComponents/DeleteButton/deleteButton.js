import React from "react";
import "./delete.css";

//accepting props that has function of delete
const deleteButton =(props) => (
    <span className="delete-btn" {...props}>
        ✗
    </span>
)

export default deleteButton;