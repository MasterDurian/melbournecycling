import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

// 使用 import 导入图片资源
import accidentDataImage from '../data.png';
import routeMapImage from '../map.png';
import acImage from '../cyclists.jpg'; 

const HomePage = () => {
    return (
        <div className="homepage">
            <header className="homepage-header">
                <div className="header-content">
                    <h1>We care about your <br /><span>cycling safety</span> <br />in Melbourne.</h1>
                    <img src={acImage} alt="AC" className="header-image" />
                </div>
            </header>
            <section className="popular-pages">
                <h2>The City of Melbourne is committed to becoming a cycling city, with a safe and connected bicycle network for cyclists of all ages and abilities.</h2>
                <div className="page-cards">
                    <div className="page-card">
                        <img src={accidentDataImage} alt="Accident Data" />
                        <Link to="/accident-data">
                            <button className="card-button">Accident Data</button>
                        </Link>
                        <p>Contains geographic distribution maps, severity distribution maps, and time trend maps to analyze bicycle accident data and trends within the city of Melbourne.</p>
                    </div>
                    <div className="page-card">
                        <img src={routeMapImage} alt="Route Map" />
                        <Link to="/route-plan">
                            <button className="card-button">Route Map</button>
                        </Link>
                        <p>An interactive map of designated cycle routes in Melbourne, showing recommended routes and their risk assessment.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
