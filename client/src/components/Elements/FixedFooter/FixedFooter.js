import React from "react";
import { Link } from 'react-router-dom';
import "./FixedFooter.css"

const FixedFooter = () => (
  <footer className='fixed-footer'>
    <a href="" target="_blank" rel="noopener noreferrer">GitHub</a>
    <p>&#9400;2018</p>
    <Link className="btn-link" to={{ pathname: "/", hash: "#about-us-para-header" }} role="button">Contact</Link>
  </footer>
)

export default FixedFooter;