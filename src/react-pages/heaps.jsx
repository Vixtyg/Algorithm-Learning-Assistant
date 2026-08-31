import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import { Heap } from './heap.jsx';


//Add positon tracker // Keys // IDs // Class //Auto resize //Form submit


export function Heaps(){
    return(
        <div className='App'>
            <div id="heap-container">
                <Heap  heapArray={[1,2,3]} width={100}/>
            </div>
            <div>
                
            </div>
        </div>
    )
}
