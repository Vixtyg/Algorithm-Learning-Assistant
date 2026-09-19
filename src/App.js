import logo from './logo.svg';
import './App.css';
import LetterGlitch from './LightPillar';
import React, { useState, useEffect } from "react";
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { Home } from './react-pages/home.jsx';
import { ClosestPair } from './react-pages/closest-pair.jsx';
import { Heaps } from './react-pages/heaps.jsx';
import { Sorting } from './react-pages/mergesort_quicksort.jsx';
import { Graphs } from './react-pages/graphs.jsx';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/closestpair" element={<ClosestPair />} />

        <Route path="/" element={<Home />} />
        <Route path="/heaps" element={<Heaps />} />
        <Route path="/mergesort_quicksort" element={<Sorting />} />
        <Route path="/graphs" element={<Graphs />} />
      </Routes>
    </Router>
  );
}
function loaded_element() {
  console.log()
}

export default App;
