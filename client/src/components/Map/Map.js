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
import "./Map.css";

/*using recompose to simplify the component*/
const Map = compose(
    withProps({
        /*Developer Mode URL*/
        //googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
        /*Production URL*/
        googleMapURL: ``,
        loadingElement: <div style={{height: '100%'}}/>,
        containerElement: <div style={{height: '100vh'}}/>,
        mapElement: <div style={{height:'100%'}}/>
    }),
    withScriptjs,
    withGoogleMap
)((props)=>
    <GoogleMap
        /*Place default settings here*/
        defaultZoom={15}
        defaultCenter={{ lat: 43.660527, lng: -79.396762 }}
    >
        {/*Marker props handler*/}
        {props.markers.map(marker =>{
            //console.log("lat: "+ marker.latitude.$numberDecimal);
            const onClick = props.onClick.bind(this,marker)
            
            return (
                <Marker
                    key={marker._id}
                    onClick={onClick}
                    position={{lat:parseFloat(marker.latitude.$numberDecimal), lng: parseFloat(marker.longitude.$numberDecimal)}}
                >
                    {/*Place Marker data inside InfoWindow*/}
                    {props.selectedMarker === marker && 
                        <InfoWindow>
                            <div className="infoContainer">
                                <div className="info-img-container">
                                    <img src={marker.displayImageUrl} alt="" />
                                </div>
                                <h3>{marker.name}</h3>
                                <h4>{marker.category}</h4>
                                <p>Daily rate: ${parseFloat(marker.dailyRate.$numberDecimal).toFixed(2)}</p>
                            </div>
                        </InfoWindow>
                    }
                </Marker>
            )
        })}
    </GoogleMap>
)

export default Map;