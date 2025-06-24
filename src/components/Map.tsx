"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { FeatureCollection } from "geojson";

// Dummy GeoJSON data for now. Replace with your actual data.
const geoJsonData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Dummy Area 1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.0, -6.5],
            [108.0, -6.5],
            [108.0, -7.0],
            [107.0, -7.0],
            [107.0, -6.5],
          ],
        ],
      },
    },
  ],
};

const Map = () => {
  return (
    <MapContainer
      center={[-6.914744, 107.609810]} // Center on West Java for now
      zoom={8}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/css-filter/grayscale/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geoJsonData} />
    </MapContainer>
  );
};

export default Map; 