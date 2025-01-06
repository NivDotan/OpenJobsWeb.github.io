import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './App.css'; // Import the CSS file
import MyComponent from './MyComponent/MyComponent.js'; // Import your components
import ScraperListings from './Analytics/Analytics.js'; // The new Analytics component



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/InternQuest" element={<MyComponent />} />
        <Route path="/InternQuest/analytics" element={<ScraperListings />} />
      </Routes>
    </Router>
  );
};


export default App;

