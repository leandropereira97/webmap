import 'ol/ol.css';
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import {getLayerByName} from './customFunctions';

/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */

const map=$('#map').data('map');
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var key = 'Get your own API key at https://www.maptiler.com/cloud/';
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
map.addOverlay(overlay);

/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function (evt) {
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));

  // Getting the layer source: getting the layer itself, and then getting its source
  // Create a function to get the layer by name

  const parcelsLayer=getLayerByName('Parcels');
  const parcelsSource=parcelsLayer.getSource();
  const view=map.getView();
  const resolution=view.getResolution();
  const projection=view.getProjection();

  const parcelUrl=parcelsSource.getFeatureInfoUrl(coordinate,resolution,projection,
     {'INFO_FORMAT':'application/json'});

     if(parcelUrl)
     {
         $.ajax({
             url:parcelUrl,
             method:'Get',
             success:function(result){
                 const parcel=result[0];
                 const parcelNumber=parcel.parcel_n;
                 const blocknumber=parcel.block_n;
                 const parcelArea=parcel.shape_area;
             }
         })
     }
  content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
  overlay.setPosition(coordinate);
});
