import React, { Component, Fragment } from "react";
import NavBar from "../../components/Elements/NavBar";
import Footer from '../../components/Elements/Footer';
import Map from "../../components/Map/Map";
import API from '../../utils/API';

class MapPage extends Component{
    render(){
        return(
            <Fragment>
                <NavBar
                    loggedIn={this.props.loggedIn}
                    logout={this.props.logout}
                    location={this.props.location}
                />
                <Map/>
                <Footer/>
            </Fragment>
        )
    }
}

export default MapPage;