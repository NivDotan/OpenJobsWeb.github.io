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
        <Route path="/OpenJobsWeb.github.io" element={<MyComponent />} />
        <Route path="/OpenJobsWeb.github.io/analytics" element={<ScraperListings />} />
      </Routes>
    </Router>
  );
};


/* <Router>
<div className="app-container">
<Routes>
  <Route path="/" element={<MyComponent />} />
  <Route path="/analytics" element={<Analytics />} />
</Routes>
</div>
</Router> 


<div className="app-container">
        <MyComponent />
      </div>*/

export default App;

