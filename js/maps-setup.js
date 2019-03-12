// initialize the variables we need
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'
let my_map, // this will hold the map
    my_map_options, // this will hold the options we'll use to create the map
    my_center = new google.maps.LatLng(21.521757,-77.781166), // center of map
    my_markers = [], // we use this in the main loop below to hold the markers
    // this one is strange.  In google maps, there is usually only one
    // infowindow object -- its content and position change when you click on a
    // marker.  This is counterintuitive, but we need to live with it.  
    infowindow = new google.maps.InfoWindow({content: ""}),
    legendHTML = "";

// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
const blueURL = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      redURL = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
let red_markers = [],
    blue_markers = [];

// this is for fun, if you want it.  With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://developers.google.com/maps/documentation/javascript/datalayer#load_geojson
// but essentially: we can add all kinds of features here, including polygons and other shapes
// you can create geoJSON layers here: http://geojson.io/
// and learn more about the format here: https://en.wikipedia.org/wiki/GeoJSON
// to get a fill color, you will need to set the `myColor` property as below. 
let myGeoJSON= {
"type":"FeatureCollection",
"features":
 [{"type":"Feature",
    "properties":{myColor: 'red'},
     "geometry":{"type":"Polygon",
                 "coordinates":[[[-85.60546875,49.03786794532644],[-96.6796875,40.713955826286046],
                                 [-79.62890625,37.71859032558816],[-81.2109375,49.26780455063753],
                                 [-85.60546875,49.03786794532644]]]}},
    {"type":"Feature",
     "properties":{myColor: 'green'},
     "geometry":{"type":"Polygon",
                 "coordinates":[[[-113.203125,58.35563036280967],[-114.78515624999999,51.944264879028765],
                                 [-101.6015625,51.944264879028765],[-112.32421875,58.263287052486035],
                                 [-113.203125,58.35563036280967]]]
                }}]};



/* a function that will run when the page loads.  It creates the map
   and the initial marker.  If you want to create more markers, do it here. */
function initializeMap() {
  my_map_options = {
    center:  my_center, // to change this value, change my_center above
    zoom: 4.5,  // higher is closer-up
    mapTypeId: google.maps.MapTypeId.HYBRID // you can also use TERRAIN, STREETMAP, SATELLITE
  };

  // this one line creates the actual map
  my_map = new google.maps.Map(document.getElementById("map_canvas"),
                               my_map_options);
  // this is an *array* that holds all the marker info
  ///////////////////////////////
  // YOU NEED TO CHANGE THESE! //
  ///////////////////////////////

  let all_my_markers =
      [{position: new google.maps.LatLng(22.9166667,-82.98333333333333),
        map: my_map,
        icon: redURL, // this sets the image that represents the marker in the map to the one
        // located at the URL which is given by the variable blueURL, see above
        title: "Guanajay site",
        window_content: '<h1>Guanajay site</h1><p> IRBM site. Photo taken in 1962. Zoom in to see what the site looks like now.</p><img title="Guanajay Site. Src: in 1962"  src="https://www.militaryimages.net/media/guanajay-irbm-launch-site.1957/full/">'
       },
       {position: new google.maps.LatLng(22.6666667, -83.2666663888889),
        map: my_map,
        icon: redURL, // this sets the image that represents the marker in the map
        title: "Los Palacios site at San Cristobal",
        window_content: '<h1>Los Palacios at San Cristobal</h1><p> MRBM site. Photo taken in 1962. Zoom in to see what the site looks like now.</p><img title="Los Palacios. Src: in 1962" src="https://nsarchive2.gwu.edu/nsa/cuba_mis_cri/26.jpg">'
        //<p> and <a href='http://something'>this would</a> be the extended description</p>"
       },
       {position: new google.maps.LatLng(22.4166667,-79.58333333333333),
        map: my_map,
        icon: redURL, // this sets the image that represents the marker in the map
        title: "Remedios site",
        window_content: '<h1>Remedios site</h1><p> IRBM site. Photo taken in 1962. Zoom in to see what the site looks like now.</p><img title="Remedios site. Src: 1962"  src="https://jfk14thday.com/wp-content/uploads/2013/11/074-10295613.jpg"/>' //+
        //'<blockquote>quote quote quote quote</blockquote>'
       },
       {position: new google.maps.LatLng(22.7166667,-80.03333305555556),
        map: my_map,
        icon: redURL, // this sets the image that represents the marker in the map
        title: "Sagua la Grande",
        window_content: '<h1>Sagua la Grande site</h1><p> MRBM site. Photo taken in 1962. Zoom in to see what the site looks like now.</p><img title="Sagua la Grande. Src: in 1962" src="https://nsarchive2.gwu.edu/nsa/cuba_mis_cri/14.jpg">'
       },
       {position: new google.maps.LatLng(38.907192,-77.036873),
        map: my_map,
        icon: blueURL, // this sets the image that represents the marker in the map
        title: "Washington DC",
        window_content: "<h1>Washington, DC</h1><p> The MRBM's could reach the United States Capital. IRBM's could reach as far as San Francisco. </p>"
       }
      ];

  // iterate over the marker array, adding to map
  for (j = 0; j < all_my_markers.length; j++) {
    let marker =  new google.maps.Marker({
      position: all_my_markers[j].position,
      map: my_map,
      icon: all_my_markers[j].icon,
      title: all_my_markers[j].title,
      window_content: all_my_markers[j].window_content});

    
    // these next lines are ugly, and you could change it to be prettier.
    // be careful not to introduce syntax errors though.  
    legendHTML +=
      "<div class=\"pointer\" onclick=\"locateMarker(my_markers[" + j + "])\"> " +
      marker.window_content + "</div>";
    marker.info = new google.maps.InfoWindow({content: marker.window_content});
    let listener = google.maps.event.addListener(marker, 'click', function() {
      // if you want to allow multiple info windows, uncomment the next line
      // and comment out the two lines that follow it
      
      //this.info.open(this.map, this);
      infowindow.setContent (this.window_content);
      infowindow.open(my_map, this);
    });
    my_markers.push({marker:marker, listener:listener});
    if (all_my_markers[j].icon === blueURL ) {
      blue_markers.push({marker:marker, listener:listener});
    } else if (all_my_markers[j].icon === redURL ) {
      red_markers.push({marker:marker, listener:listener});
    }
    
  }
  // actually set the legend HTML
  $('#map_legend').html(legendHTML);

  // for fun, add some geoJSON from above
  my_map.data.addGeoJson(myGeoJSON);

  // here we use the myColor attributes of the geoJSON objects from above
  // to actually set the color of the jeogson features
  // strokeWeight "5" is awfully thick and probalby not what you want!
  my_map.data.setStyle(function (feature) {
   let thisColor = feature.getProperty("myColor");
    return {
      fillColor: thisColor,
      strokeColor: thisColor,
      strokeWeight: 5
    };

  });
  // create a rectangle and a circle
  // for more info on shapes you can draw, look at the
  // API docs: https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
  // https://developers.google.com/maps/documentation/javascript/examples/rectangle-simple
  // etc. 
  //let romeRectangle = new google.maps.Rectangle({
  //  strokeColor: 'maroon',
  //  strokeOpacity: 0.8,
  //  strokeWeight: 2,
  //  fillColor: 'saddlebrown',
  //  fillOpacity: 0.35,
    // in general, we always have to *set the map* when we
    // add features. 
  //  map: my_map,
  //  bounds: {
  //    north: 41.920,
  //    south: 41.900,
  //    east: 12.501,
  //    west: 12.485
  //  }
//  });

  let MRBMCircle = new google.maps.Circle({
    strokeColor: 'red',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: 'red',
    fillOpacity: 0.10,
    // in general, we always have to *set the map* when we
    // add features. 
    map: my_map,
    center: {"lat": 22.6666667, "lng":-83.2666663888889},
    radius: 1970000
  });  

  let IRBMCircle = new google.maps.Circle({
      strokeColor: 'red',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: 'red',
      fillOpacity: 0.10,
      // in general, we always have to *set the map* when we
      // add features. 
      map: my_map,
      center: {"lat": 22.6666667, "lng":-83.2666663888889},
      radius: 3970000
 
  });  

}

// this hides all markers in the array
// passed to it, by attaching them to
// an empty object (instead of a real map)
function hideMarkers (marker_array) {
  for (let j in marker_array) {
    marker_array[j].marker.setMap(null);
  }
}
// by contrast, this attaches all the markers to
// a real map object, so they reappear
function showMarkers (marker_array, map) {
  for (let j in marker_array) {
    marker_array[j].marker.setMap(map);
  }
}

// probably always want to use this toggle function instead!!
function toggleMarkers (marker_array, map) {
  for (let j in marker_array) {
    if (markersHidden) {
      marker_array[j].marker.setMap(map);
    } else {
      marker_array[j].marker.setMap(null);
    }
  }
  markersHidden = !markersHidden;
}

//global variable to track state of markers
let markersHidden = false;


// I added this for fun.  It allows you to trigger the infowindow
// from outside the map.  
function locateMarker (marker) {
  console.log(marker);
  my_map.panTo(marker.marker.position);
  google.maps.event.trigger(marker.marker, 'click');
}
