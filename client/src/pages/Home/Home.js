import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import "./Home.css";

class Home extends Component {
  state = {
    topic: "",
    begin_date: "",
    end_date: "",
    toResults: false,
    results: []
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    //  blah blah blah
  };

  render() {
    return (
      <Fragment>
        <NavBar
          loggedIn={this.props.loggedIn}
          logout={this.props.logout}
          location={this.props.location}
        />
        
        <div className="jumbotron">
        <video autoPlay loop muted id="main-video">
            <source src="https://res.cloudinary.com/dvp0y7ati/video/upload/v1536570110/samples/sea-turtle.mp4" type="video/mp4">
            </source>
        </video>
        <section className="landing-page-content">
            <div id="landing-page" className="hero-body">
                <div className="container">

                    <div id="logo">
                        <img className="img-fluid center-block" src="./static/assets/images/sharebox-full-padding.png" alt="logo" >
                        </img>
                    </div>

                    <div className="landingBlock">
                        <h3 className="title is-2" id="highlight">
                              <span id="tagline">A sharing tools app...... 
                              <br></br>
                              <br></br>
                              It is all about sharing, helping out your neighbourhood in need!</span>
                        </h3>
                    </div>
                </div>
            </div>
        </section>
          

        </div>
        <Footer />
      </Fragment>
    );
  }
}

export default Home;
