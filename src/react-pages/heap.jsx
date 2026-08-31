import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';


export function Heap({heapArray, width}){
    return(
        <div className='App'>
            <div style={{
                width: width+'px',
                background: 'red',
                flexWrap: 'wrap',
                display: 'flex'
            }}>  
                {heapArray.map((item,index)=>(
                    <div className='node' style={{
                        background: 'purple',
                        display: 'flex',
                        flexDirection: 'row',
                        width: '50px',
                    }}>{item}</div>
                ))}
            </div>
        </div>
    )
}