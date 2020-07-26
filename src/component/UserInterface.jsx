import React from 'react';
import axios from 'axios';
import Map from './Map';
import './../App.css';

const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY;
const DATASETS_API_KEY = process.env.REACT_APP_MAPBOX_DATASETS_API_KEY;
const DEFAULT_LAT = 36.778259;
const DEFAULT_LNG = -119.417931;

class UserInterface extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         feature_id: props.match.params.user,
         lng: DEFAULT_LNG,
         lat: DEFAULT_LAT,
      };

      this.handlePositive = this.handlePositive.bind(this);
      this.deletePoint = this.deletePoint.bind(this);
   }

   // Replace feature_id with a function that will get last feature id + 1;
   async handlePositive() {
      try {
         const dataResponse = await axios.get(`https://api.mapbox.com/datasets/v1/apotheosis/ckcsyviga1d932bt6iu0l8tnz/features?access_token=${API_KEY}`);
         //Change feature_id system to unique log in or UUID based system
         this.setState({feature_id: dataResponse.data.features.length + 1});
      } catch(error) {
         console.error(error);
      }


      if (this.state.feature_id !== null) {
         try {
            var time = new Date();
            var id_to_delete = this.state.feature_id;

            const response = await axios.put(`https://api.mapbox.com/datasets/v1/apotheosis/ckcsyviga1d932bt6iu0l8tnz/features/${this.state.feature_id}?access_token=${DATASETS_API_KEY}`, {
               id: `${this.state.feature_id}`,
               type: 'Feature',
               geometry: {
                  type: 'Point',
                  coordinates: [
                     this.state.lng,
                     this.state.lat
                  ]
               },
               properties: {
                  description: `<strong> Covid-19 Case </strong><p>${time}</p>`
               }
            })
            setTimeout( 
               function(){axios.delete(`https://api.mapbox.com/datasets/v1/apotheosis/ckcsyviga1d932bt6iu0l8tnz/features/${id_to_delete}?access_token=${DATASETS_API_KEY}`);
               console.log("Point Deleted :)");}
            , 20000)
            console.log(response);

         } catch (error) {
            console.error(error);
         }
      }
   }
   
   async deletePoint() {
      try {
         const response = await axios.delete(`https://api.mapbox.com/datasets/v1/apotheosis/ckcsyviga1d932bt6iu0l8tnz/features/${this.state.feature_id}?access_token=${DATASETS_API_KEY}`)
       
         console.log(response);
      } catch (error) {
         console.error(error);
      }
   }

   componentDidMount() {
      if ("geolocation" in navigator) { 
         navigator.geolocation.getCurrentPosition(position => {
            this.setState({lng: position.coords.longitude, lat: position.coords.latitude});
         });
      }
   }

   render() {
      return (
      <div>
         <div className="cpn__map">
            <Map lng={this.state.lng} lat={this.state.lat}/>
         </div>
         <div className="cpn__buttons">
            <button onClick={this.handlePositive}>I'm Positive</button>
            <button onClick={this.deletePoint}>Delete Previous</button>
         </div>
      </div>
      )
   }
}

export default UserInterface;
