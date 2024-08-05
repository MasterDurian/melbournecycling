import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo1.jpg'; // 确保使用正确的路径导入图片

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#000',
    color: '#fff',
};

const logoStyle = {
    display: 'flex',
    alignItems: 'center',
};

const logoImageStyle = {
    height: '70px', // 调整图片高度
    marginRight: '2px', // 调整图片和文本之间的间距
};

const navStyle = {
    display: 'flex',
    listStyle: 'none',
};

const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    margin: '0 18px',
    fontSize: '23px', // 调整字体大小
};

const Header = () => {
    return (
        <header style={headerStyle}>
            <div style={logoStyle}>
                <img src={logo} alt="CycleSecure Logo" style={logoImageStyle} />
                <Link to="/" style={{ ...linkStyle, fontSize: '34px', fontWeight: 'bold' }}>CycleSecure</Link>
            </div>
            <nav>
                <ul style={navStyle}>
                    <li><Link to="/" style={linkStyle}>Home</Link></li>
                    <li><Link to="/accident-data" style={linkStyle}>Accident Data</Link></li>
                    <li><Link to="/route-plan" style={linkStyle}>Route Plan</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
