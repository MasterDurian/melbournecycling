import React from 'react';
import './Homepage.css';

const HomePage = () => {
    return (
        <div className="homepage">
            <header className="homepage-header">
                <h1>We care about your <span>cycling safety</span> in Melbourne.</h1>
            </header>
            <section className="popular-pages">
                <h2>Popular pages</h2>
                <div className="page-cards">
                    <div className="page-card">
                        <img src="../images/2312829.jpg" alt="Accident Data" />
                        <h3>Accident Data</h3>
                        <p>Contains geographic distribution maps, severity distribution maps, and time trend maps to analyze bicycle accident data and trends within the city of Melbourne.</p>
                    </div>
                    <div className="page-card">
                        <img src="../images/Screenshot 2024-08-01 at 4.33.11 pm.png" alt="Route Map" />
                        <h3>Route Map</h3>
                        <p>An interactive map of designated cycle routes in Melbourne, showing recommended routes with start and end points and their risk assessment.</p>
                    </div>
                    <div className="page-card">
                        <img src="../../public/images/road.jpeg" alt="News" />
                        <h3>Calls mount to fix dangerous West Melbourne intersection</h3>
                        <p>On May 8, a cyclist was struck and killed at the intersection and the truck driver fled the scene.</p>
                        <p><strong>Brendan Rees | 15th May, 2024</strong></p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
