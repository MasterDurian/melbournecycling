import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Homepage';
import AccidentData from './components/AccidentData';
import Header from './components/Header';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accident-data" element={<AccidentData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
