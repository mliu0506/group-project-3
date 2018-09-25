import React, { Component, Fragment } from "react";
import NavBar from "../../components/Elements/NavBar";
import Footer from '../../components/Elements/Footer';
import Map from "../../components/Map/Map";
import API from '../../utils/API';

class MapPage extends Component{
    //Implement States here
    constructor(props) {
        super(props)
        this.state = {
            rentals: [],
            selectedMarker: false
        }
    }

    //get json data
    getAllRentals = () =>{
        API.getAllRentals()
            .then(res=>{
                this.setState({rentals: res.data})
                //console.log(JSON.stringify(res.data, null, 2));
            })
            .catch(err=>console.log(err));
    }

    //load data into here
    componentDidMount() {
        this.getAllRentals();
    }
    handleClick = (marker, event) => {
        // console.log({ marker })
        this.setState({ selectedMarker: marker })
    }

    render(){
        return(
            <Fragment>
                <NavBar
                    loggedIn={this.props.loggedIn}
                    logout={this.props.logout}
                    location={this.props.location}
                />
                <Map
                    selectedMarker={this.state.selectedMarker}
                    markers={this.state.rentals}
                    onClick={this.handleClick}
                />
                <Footer/>
            </Fragment>
        )
    }
}

export default MapPage;