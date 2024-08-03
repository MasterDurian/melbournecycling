import React from 'react';
import { Link } from 'react-router-dom';

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
};

const navStyle = {
    display: 'flex',
    listStyle: 'none',
};

const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    margin: '0 10px',
};

const Header = () => {
    return (
        <header style={headerStyle}>
            <div className="logo">
                <Link to="/" style={linkStyle}>CycleSecure</Link>
            </div>
            <nav>
                <ul style={navStyle}>
                    <li><Link to="/" style={linkStyle}>Home</Link></li>
                    <li><Link to="/accident-data" style={linkStyle}>Accident Data</Link></li>
                    <li><Link to="/route-plan" style={linkStyle}>Route Plan</Link></li>
                    <li><Link to="/about" style={linkStyle}>About</Link></li>
                    <li><Link to="/contact" style={linkStyle}>Contact</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
