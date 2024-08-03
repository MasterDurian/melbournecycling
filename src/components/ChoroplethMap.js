import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import axios from 'axios';
import './ChoroplethMap.css';

const ChoroplethMap = () => {
    const mapRef = useRef(null);
    const [geoJsonData, setGeoJsonData] = useState(null);

    useEffect(() => {
        // Fetch GeoJSON data
        axios.get('http://localhost:5003/api/geojson')
            .then(response => {
                console.log('Fetched GeoJSON data:', response.data);
                setGeoJsonData(response.data);
            })
            .catch(error => {
                console.error('Error fetching GeoJSON data:', error);
            });
    }, []);

    useEffect(() => {
        if (!geoJsonData) return;

        const map = L.map(mapRef.current).setView([-37.8136, 144.9631], 12);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const getColor = (d) => {
            return d > 1500 ? '#800026' :
                d > 1000 ? '#BD0026' :
                    d > 700 ? '#E31A1C' :
                        d > 500 ? '#FC4E2A' :
                            d > 200 ? '#FD8D3C' :
                                d > 100 ? '#FEB24C' :
                                    '#00FF00';
        };

        const style = (feature) => {
            return {
                fillColor: getColor(feature.properties.Count),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        };

        const highlightFeature = (e) => {
            const layer = e.target;

            layer.setStyle({
                weight: 3,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        };

        const resetHighlight = (e) => {
            geoJson.resetStyle(e.target);
        };

        const onEachFeature = (feature, layer) => {
            const { LGA_NAME, Count } = feature.properties;
            layer.bindPopup(`<strong>LGA Name:</strong> ${LGA_NAME}<br><strong>Number of Accidents:</strong> ${Count}`);
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight
            });
        };

        const geoJson = L.geoJson(geoJsonData, {
            style,
            onEachFeature
        }).addTo(map);

        // Clean up on unmount
        return () => {
            map.remove();
        };
    }, [geoJsonData]);

    return (
        <div className="accident-data-page">
            <div className="search-section">
                <button className="search-button">
                    <i className="fas fa-search"></i> Region
                </button>
            </div>
            <div className="content-section">
                <div className="map-container">
                    <div ref={mapRef} style={{ height: '600px' }}></div>
                </div>
                <div className="charts-container">
                    <div className="chart risk-assessment-chart">
                        <h3>Risk Assessment Of Bicycle Routes</h3>
                        <img src="/path/to/risk-assessment-chart.png" alt="Risk Assessment Chart" />
                    </div>
                    <div className="chart pie-chart">
                        <h3>Description</h3>
                        <img src="/path/to/pie-chart.png" alt="Pie Chart" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChoroplethMap;
