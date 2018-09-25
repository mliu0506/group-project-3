import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
import GreyBtn from "../Buttons/GreyBtn";
import "./NavBar.css"

// Must pass in a relative or web url with an image in order for parallax to work

class NavBar extends React.Component {

  componentDidMount = () => {
    document.querySelector(".cross").style.display = 'none';
    // document.querySelector(".menu").style.display = 'none';
    document.querySelector(".menu").style.visibility = 'none';
    document.querySelector(".menu").style.opacity = '0';
  }

  hamburgerClick = () => {
    document.querySelector(".cross").style.display = 'flex';
    document.querySelector(".menu").style.visibility = 'visible';
    document.querySelector(".menu").style.opacity = '1';
    document.querySelector(".hamburger").style.display = 'none';
  }

  crossClick = () => {
    document.querySelector(".cross").style.display = 'none';
    // document.querySelector(".menu").style.display = 'none';
    document.querySelector(".menu").style.visibility = 'none';
    document.querySelector(".menu").style.opacity = '0';
    document.querySelector(".hamburger").style.display = '';
  }

  //  wanted to call both functions from an onClick event, so this function calls them both
  multiClick = () => {
    this.props.toggleForm();
    this.crossClick();
  }

  render() {
    return (
      <nav className='navbar'>

        <div className='links'>
          <Link className="btn-link" to="/" role="button">Home <i className="fas fa-home"></i></Link>
          <Link className="btn-link" to="/rentals" role="button">Products <i className="fas fa-list"></i></Link>

          {this.props.loggedIn ? (
            <Fragment>
              <Link className="btn-link" to="/cart" role="button">Shopping <i className="fas fa-shopping-cart"></i></Link>
              <Link className="btn-link" to="/profile" role="button">Profile <i className="far fa-user-circle"></i></Link>
              <GreyBtn logout={this.props.logout}>Logout</GreyBtn>
            </Fragment>
          ) : (
              <Fragment>
                {this.props.loginShow ? (
                  <Fragment>
                    <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} onClick={this.props.toggleForm} role="button">Signup <i className="fas fa-user-plus"></i></Link>
                    <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} role="button">Login <i className="fas fa-sign-in-alt"></i></Link>
                  </Fragment>
                ) : (
                    <Fragment>
                      <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} role="button">Signup <i className="fas fa-user-plus"></i></Link>
                      <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} onClick={this.props.toggleForm} role="button">Login <i className="fas fa-sign-in-alt"></i></Link>
                    </Fragment>
                  )
                }
              </Fragment>
            )
          }
        </div>
        <div className="hamburger-btns">
          <button onClick={this.hamburgerClick} className="hamburger"><i className="fas fa-bars"></i></button>
          <button onClick={this.crossClick} className="cross"><i className="fas fa-times 2x"></i></button>
        </div>
        <div className="menu" id="menu">
          <Link className="btn-link" to="/" role="button">Home <i className="fas fa-home"></i></Link>
          <Link className="btn-link" to="/rentals" role="button">Products <i className="fas fa-list"></i></Link>

          {this.props.loggedIn ? (
            <Fragment>
              <Link className="btn-link" to="/profile" role="button">Profile <i className="far fa-user-circle"></i></Link>
              <Link className="btn-link" to="/cart" role="button">Shopping <i className="fas fa-shopping-cart"></i></Link>
              <GreyBtn logout={this.props.logout}>Logout</GreyBtn>
            </Fragment>
          ) : (
              <Fragment>
                {this.props.loginShow ? (
                  <Fragment>
                    <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} onClick={this.multiClick} role="button">Signup <i className="fas fa-user-plus"></i></Link>
                    <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} role="button">Login <i className="fas fa-sign-in-alt"></i></Link>
                  </Fragment>
                ) : (
                    <Fragment>
                      <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} role="button">Signup <i className="fas fa-user-plus"></i></Link>
                      <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} onClick={this.multiClick} role="button">Login <i className="fas fa-sign-in-alt"></i></Link>
                    </Fragment>
                  )
                }
              </Fragment>
            )
          }
        </div>
      </nav>
    );
  }
}


export default NavBar;