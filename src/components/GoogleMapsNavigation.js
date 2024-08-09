import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Polyline,
  Autocomplete,
  InfoWindow
} from '@react-google-maps/api';
import Papa from 'papaparse';
import axios from 'axios';
import './styles.css'; // 引用CSS文件

const containerStyle = {
  margin: '40px',
  height: 'calc(100vh - 80px)'
};

const center = {
  lat: -37.8136,
  lng: 144.9631
};

// 将 libraries 数组定义为常量
const libraries = ['places'];

const GoogleMapsNavigation = () => {
  const [response, setResponse] = useState(null);
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [startLatLng, setStartLatLng] = useState(null);
  const [endLatLng, setEndLatLng] = useState(null);
  const [travelTime, setTravelTime] = useState('');
  const [distance, setDistance] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const startPointRef = useRef(null);
  const endPointRef = useRef(null);

  const handleDirectionsCallback = useCallback((res) => {
    if (res !== null) {
      if (res.status === 'OK') {
        setResponse(res);
        // 提取旅行时间和距离
        const { duration, distance } = res.routes[0].legs[0];
        setTravelTime(duration.text);
        setDistance(distance.text);
      } else {
        console.log('response: ', res);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = startPointRef.current.getPlace();
    const end = endPointRef.current.getPlace();
    if (start && end) {
      const startLocation = start.geometry.location;
      const endLocation = end.geometry.location;
      setStartLatLng({ lat: startLocation.lat(), lng: startLocation.lng() });
      setEndLatLng({ lat: endLocation.lat(), lng: endLocation.lng() });
    }
  };

  const handlePlaceChanged = (inputRef, setInput) => () => {
    const place = inputRef.current.getPlace();
    if (place && place.formatted_address) {
      setInput(place.formatted_address);
    }
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('https://melbournecyclingd5c933e62dbe4f748dd4f4b6f33d8b1d6a90-dev.s3.amazonaws.com/route.csv');
        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            console.log('Parsed Results:', results.data);
            const parsedRoutes = results.data.map(route => {
              if (route.geometry) {
                const match = route.geometry.match(/\(([^)]+)\)/);
                if (match) {
                  const coordinates = match[1]
                    .split(', ')
                    .map(coord => {
                      const [lng, lat] = coord.split(' ').map(Number);
                      if (isNaN(lat) || isNaN(lng)) {
                        console.warn(`Invalid coordinate found: ${coord}`);
                        return null;
                      }
                      return { lat, lng };
                    })
                    .filter(coord => coord !== null);

                  const count = parseInt(route.Count, 10);
                  console.log(`Route count: ${count}, coordinates: ${coordinates}`);
                  return { coordinates, count, direction: route.direction, type: route.type };
                } else {
                  console.warn('No coordinates found for route:', route);
                  return null;
                }
              } else {
                console.warn('Missing geometry for route:', route);
                return null;
              }
            }).filter(route => route !== null);
            setRoutes(parsedRoutes);
            setIsDataLoaded(true);  // 数据加载完成
          }
        });
      } catch (error) {
        console.error('Error fetching bicycle routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  const getColorByCount = (count) => {
    if (count >= 70) {
      return 'darkred';
    } else if (count >= 21) {
      return 'orange';
    } else {
      return 'green';
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyB0hHH4CoHsBoOcDoQpaNJCaZIf3VgKMuI" libraries={libraries}>
      <div className="top-container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <Autocomplete
              onLoad={(autocomplete) => (startPointRef.current = autocomplete)}
              onPlaceChanged={handlePlaceChanged(startPointRef, setStartPoint)}
            >
              <input
                type="text"
                placeholder="Choose starting point"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                style={{ width: '200px' }}
              />
            </Autocomplete>
            <Autocomplete
              onLoad={(autocomplete) => (endPointRef.current = autocomplete)}
              onPlaceChanged={handlePlaceChanged(endPointRef, setEndPoint)}
            >
              <input
                type="text"
                placeholder="Choose destination"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                style={{ width: '200px' }}
              />
            </Autocomplete>
            <button type="submit">Direction</button>
          </form>
        </div>
        {travelTime && distance && (
          <div className="info-container">
            <div>Estimated Travel Time: {travelTime}</div>
            <div>Estimated Distance: {distance}</div>
          </div>
        )}
      </div>
      <div className="legend-container">
        <div className="legend">
          <div><span style={{ backgroundColor: 'darkred' }}></span> 70+ accidents</div>
          <div><span style={{ backgroundColor: 'orange' }}></span> 21-69 accidents</div>
          <div><span style={{ backgroundColor: 'green' }}></span> 0-20 accidents</div>
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy',
          draggable: true,
          mapTypeId: 'roadmap'
        }}
      >
        {isDataLoaded && routes.map((route, index) => (  // 确保数据加载完成后渲染
          <Polyline
            key={index}
            path={route.coordinates}
            options={{
              strokeColor: getColorByCount(route.count),
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
            onClick={() => setSelectedRoute(route)}
          />
        ))}
        {selectedRoute && (
          <InfoWindow
            position={selectedRoute.coordinates[0]}
            onCloseClick={() => setSelectedRoute(null)}
          >
            <div style={{ fontSize: '16px' }}>
              <strong>Direction:</strong> {selectedRoute.direction} <br />
              <strong>Type:</strong> {selectedRoute.type} <br />
              <strong>Accident Count:</strong> {selectedRoute.count}
            </div>
          </InfoWindow>
        )}
        {startLatLng && endLatLng && (
          <DirectionsService
            options={{
              destination: endLatLng,
              origin: startLatLng,
              travelMode: 'DRIVING'
            }}
            callback={handleDirectionsCallback}
          />
        )}
        {response && (
          <DirectionsRenderer
            options={{
              directions: response,
              preserveViewport: true,
              draggable: true
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsNavigation;
