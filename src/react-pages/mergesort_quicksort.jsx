import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import { Mergesort } from './mergesort_array.jsx';
import { BST } from './binary_search_tree.jsx';
import { eventWrapper } from '@testing-library/user-event/dist/utils/index.js';


//Add positon tracker // Keys // IDs // Class //Auto resize //Form submit


export function Sorting() {

    return (
        <div className='App'>
            <Mergesort elements={8} />
        </div>
    )
}
