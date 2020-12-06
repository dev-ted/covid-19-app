import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { showMapData } from "./helper";

import './Map.css';

function Map( {countries,casesType,center ,zoom}) {
  return (
    <div className="map_component">
      <LeafletMap center={center} zoom={zoom}>
      <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* drqw circles  */}
        {showMapData (countries ,casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
