import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import axios from 'axios';

const RoutePlan = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('https://raw.githubusercontent.com/MasterDurian/melbournecycling/main/public/route.csv'); // 确保路径是根目录的相对路径
        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            console.log('Parsed Results:', results.data); // 调试信息
            const parsedRoutes = results.data.map(route => {
              if (route.geometry) {
                // 使用正则表达式提取坐标
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
                      return [lat, lng];
                    })
                    .filter(coord => coord !== null); // 过滤掉无效坐标

                  // 解析 Count 字段
                  const count = parseInt(route.Count, 10); // 修改为使用 Count 字段
                  console.log(`Route count: ${count}, coordinates: ${coordinates}`); // 调试信息
                  return { coordinates, count, direction: route.direction, type: route.type };
                } else {
                  console.warn('No coordinates found for route:', route);
                  return null;
                }
              } else {
                console.warn('Missing geometry for route:', route);
                return null;
              }
            }).filter(route => route !== null); // 过滤掉无效的路线
            setRoutes(parsedRoutes);
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
      console.log(`Count ${count} is dark red`);
      return 'darkred';
    } else if (count >= 21) {
      console.log(`Count ${count} is orange`);
      return 'orange';
    } else {
      console.log(`Count ${count} is green`);
      return 'green';
    }
  };

  return (
    <div style={{ margin: '40px', height: 'calc(100vh - 80px)' }}> {/* 添加 margin 和高度 */}
      <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '95%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {routes.map((route, index) => (
          <Polyline key={index} positions={route.coordinates} color={getColorByCount(route.count)}>
            <Popup>
              <div style={{ fontSize: '16px' }}> {/* 在这里设置字体大小 */}
                <strong>Direction:</strong> {route.direction} <br />
                <strong>Type:</strong> {route.type} <br />
                <strong>Accident Count:</strong> {route.count}
              </div>
            </Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};

export default RoutePlan;
