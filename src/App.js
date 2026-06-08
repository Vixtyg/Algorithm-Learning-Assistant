import logo from './logo.svg';
import './App.css';
import LetterGlitch from './LightPillar';
import React, { useState, useEffect } from "react";
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { Home } from './react-pages/home.jsx';
import {closestPair} from './react-pages/closest-pair.jsx';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  );
}
function loaded_element() {
  console.log()
}

export default App;
