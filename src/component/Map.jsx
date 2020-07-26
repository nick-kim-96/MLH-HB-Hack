import React from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY;
mapboxgl.accessToken = API_KEY;

export default class Map extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         lng: this.props.lng,
         lat: this.props.lat,
         zoom: 10,
      };
   }

   async componentDidMount() {
      // eslint-disable-next-line
      var data = axios.get(`https://api.mapbox.com/datasets/v1/apotheosis/ckcsyviga1d932bt6iu0l8tnz/features?access_token=${API_KEY}`);

      var map = new mapboxgl.Map({
         container: this.mapContainer,
         style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
         center: [this.state.lng, this.state.lat],
         zoom: this.state.zoom
      });

      map.addControl(
         new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true
         })
      );
      //Reset orientation
      map.addControl(new mapboxgl.NavigationControl());
      //Start of hover function
      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
         closeButton: false
      });


      map.on('load', function() {
         map.addSource('covid-cases', {
            type: 'geojson',
            data: `https://api.mapbox.com/datasets/v1/apotheosis/ckcsyviga1d932bt6iu0l8tnz/features?access_token=${API_KEY}`
         });
         
         map.addLayer({
            'id': 'covid',
            'type': 'circle',
            'source': 'covid-cases',
            'paint' : {
               'circle-radius': 10,
               'circle-color': '#cf6761',
               'circle-opacity': 1
             }
         });

         //Mouse hover function start
         map.on('mouseenter', 'covid', function(e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
             
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
             
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
            });
             
            map.on('mouseleave', 'covid', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
            });
         //Mouse hover function end
      })

      
   }

   render() {
      return (
      <div>
         <div ref={el => this.mapContainer = el} className="mapContainer" />
      </div>
      )
   }
}

