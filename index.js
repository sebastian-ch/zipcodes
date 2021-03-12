import "leaflet"
import '@babel/polyfill';
import "./node_modules/leaflet/dist/leaflet.css";
import "./index.css";
import fips from "./fips.js"

import gjnUSA from './geojsons/usSelectedWNames2.geojson'
import gjnGer from './geojsons/germanSelected1.geojson'



Promise.all([
  fetch(gjnUSA),
  fetch(gjnGer)
]).then(function(resp) {

  return Promise.all(resp.map(function(res) {
    return res.json()

  }));

}).then(function(data) {
  makeMap(data)
})


    function makeMap(data) {

      const usStartingView = {
        latlng: [40.29, -97.79],
        zoom: 4
      };

      const germanStartingView = {
        latlng: [50.59, 10.41],
        zoom: 6
      };


      const mapLeft = L.map("mapLeft", {zoomControl: false}).setView(usStartingView.latlng, usStartingView.zoom);
      const mapRight = L.map("mapRight", {zoomControl: false}).setView(germanStartingView.latlng, germanStartingView.zoom);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(mapLeft);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(mapRight);
        
        const leftlayerGroup = L.layerGroup().addTo(mapLeft);
        const rightlayerGroup = L.layerGroup().addTo(mapRight);

        const usshowStyle = {
          color: '#3b3b6d',
          weight: 0.5
        }

        const germanshowStyle = {
          color: '#ff0000',
          weight: 0.5
        }
       
        document.getElementById('search').addEventListener('click', function() {

            const searched = document.getElementById('zipAdd').value;

          




          leftlayerGroup.clearLayers();
          rightlayerGroup.clearLayers();

            var zips1 = L.geoJSON(data[0], {

              style: usshowStyle,
              filter: function(feature, layer) {
                //console.log(searched)
                if (feature.properties.ZCTA5CE10 === searched) {
                 // console.log(feature.properties.NAME)
                  
                  document.getElementById('US-name').innerHTML = feature.properties.NAME + ' County, ' + fips[feature.properties.STATEFP];

                  return true

                } 
              }
            }).addTo(leftlayerGroup) 


            if (zips1.getLayers().length !== 0) {
              mapLeft.fitBounds(zips1.getBounds());
              document.getElementById('match').innerHTML = "<h3>It's a match!</h3>"
            } else {
              document.getElementById('match').innerHTML = "<b>No Match :( </b>"

              mapLeft.flyTo(usStartingView.latlng, usStartingView.zoom, {
                duration: 0.15
              });
              mapRight.flyTo(germanStartingView.latlng, germanStartingView.zoom, {
                duration: 0.15
              });
              
            }


            var zipsRight = L.geoJSON(data[1], {

              style: germanshowStyle,
              filter: function(feature, layer) {
                if (feature.properties.plz === searched) {
                  console.log(feature.properties.note)
                  
                  document.getElementById('german-note').innerHTML = feature.properties.note;

                  return true

                } 
              }
            }).addTo(rightlayerGroup)

            if (zipsRight.getLayers().length !== 0) {
              mapRight.fitBounds(zipsRight.getBounds());
            }


          
            
        })


      
  }




      
