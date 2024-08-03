import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import melbourneGeoJson from './melbourneGeoJson.geojson'; // Ensure you have the correct GeoJSON file for Melbourne LGAs
import 'leaflet/dist/leaflet.css';

const ChoroplethMapComponent = () => {
    const [data, setData] = useState([]);
    const [lgaCounts, setLgaCounts] = useState({});

    useEffect(() => {
        // Fetch accident data from the server
        axios.get('http://localhost:5003/api/accidents')
            .then(response => {
                console.log('Fetched data:', response.data);
                const fetchedData = response.data.map(accident => ({
                    lga_name: accident.lga_name,
                    no_persons: parseInt(accident.no_persons, 10)
                }));
                console.log('Processed fetched data:', fetchedData);
                setData(fetchedData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        if (data.length === 0) {
            console.log('No data available yet.');
            return;
        }

        // Aggregate data by LGA_NAME
        const counts = {};
        data.forEach(accident => {
            if (accident.lga_name && !isNaN(accident.no_persons)) {
                if (!counts[accident.lga_name]) {
                    counts[accident.lga_name] = 0;
                }
                counts[accident.lga_name] += accident.no_persons;
            }
        });

        // Log the counts for debugging
        console.log('LGA Counts:', counts);

        setLgaCounts(counts);
    }, [data]);

    const getColor = (d) => {
        return d > 20 ? '#800026' :
            d > 15 ? '#BD0026' :
                d > 10 ? '#E31A1C' :
                    d > 5 ? '#FC4E2A' :
                        d > 0 ? '#FD8D3C' :
                            '#FFEDA0';
    };

    const style = feature => {
        const lgaName = feature.properties.LGA_NAME;
        const count = lgaCounts[lgaName] || 0;
        const color = getColor(count);
        console.log(`LGA: ${lgaName}, Count: ${count}, Color: ${color}`);
        return {
            fillColor: color,
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    if (Object.keys(lgaCounts).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <MapContainer center= { [-37.8136, 144.9631]} zoom = { 10} style = {{ height: '600px', width: '800px' }
}>
    <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
attribution = "&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
    <GeoJSON data={ melbourneGeoJson } style = { style } />
        </MapContainer>
    );
};

export default ChoroplethMapComponent;
