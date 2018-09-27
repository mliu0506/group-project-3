import React from "react";

export const Listitem = props => (
  <li className="list-group-item">
    {props.children}
  </li>
);

export default Listitem;