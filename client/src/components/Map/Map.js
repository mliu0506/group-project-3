import React from 'react';
import {Component} from 'react';
import { compose, withProps } from 'recompose';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} from 'react-google-maps';

/*using recompose to simplify the component*/
const MapComponent = compose(
    withProps({
        /*Developer Mode URL*/
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
        /*Production URL*/
        //googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${KEY-HERE}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{height: '100%'}}/>,
        containerElement: <div style={{height: '100vh'}}/>,
        mapElement: <div style={{height:'100%'}}/>
    }),
    withScriptjs,
    withGoogleMap
)((props)=>
    <GoogleMap
        /*Place default settings here*/
        defaultZoom={8}
        defaultCenter={{ lat: 29.5, lng: -95 }}
    >
        {/*Marker props handler*/}
        {props.markers.map(marker =>{
            const onClick = props.onClick.bind(this,marker)
            return (
                <Marker
                    key={marker.id}
                    onClick={onClick}
                    position={{lat:marker.latitude, lng: marker.longitude}}
                >
                    {/*Place Marker data inside InfoWindow*/}
                    {props.selectedMarker === marker && 
                        <InfoWindow>
                            <div>
                                {marker.shelter}
                            </div>
                        </InfoWindow>
                    }
                </Marker>
            )
        })}
    </GoogleMap>
)

class Map extends Component{
    /*Implement States here*/
    constructor(props) {
        super(props)
        this.state = {
            shelters: [],
            selectedMarker: false
        }
    }

    /*load data into here*/
    componentDidMount() {
        fetch("https://api.harveyneeds.org/api/v1/shelters?limit=20")
          .then(r => r.json())
          .then(data => {
            this.setState({ shelters: data.shelters })
          })
    }
    handleClick = (marker, event) => {
        // console.log({ marker })
        this.setState({ selectedMarker: marker })
    }

    render(){
        return(
            <MapComponent
                selectedMarker={this.state.selectedMarker}
                markers={this.state.shelters}
                onClick={this.handleClick}
            />
        )
    } 
}

export default Map;