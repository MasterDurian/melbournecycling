

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const RoutePlan = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/bicycle-routes-including-informal-on-road-and-off-road-routes/records?limit=20');
        const data = response.data.results.map(route => {
          return route.geo_shape.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
        });
        setRoutes(data);
      } catch (error) {
        console.error('Error fetching bicycle routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {routes.map((route, index) => (
        <Polyline key={index} positions={route} color="blue" />
      ))}
    </MapContainer>
  );
};

export default RoutePlan;
