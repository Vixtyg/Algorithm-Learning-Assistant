import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';


export function Heap({heapArray, width}){
    const MAX_AMOUNT_OF_NODES = 8;
    const DIAMETER_OF_NODE = Math.round(width/MAX_AMOUNT_OF_NODES);
    const RADIUS_OF_NODE = Math.round(DIAMETER_OF_NODE/2);
    return(
        <div className='App'>
            <div style={{
                width: width+'px',
                background: 'red',
                flexWrap: 'wrap',
                display: 'flex'
            }}>  
                {heapArray.map((item,index)=>{Math.log(2)
                return (
                    
                    <div className='node' style={{
                        marginLeft: calculate_margin(width, index,RADIUS_OF_NODE)-RADIUS_OF_NODE+'px',
                        marginRight: calculate_margin(width, index,RADIUS_OF_NODE)+'px',
                        background: 'purple',
                        display: 'flex',
                        flexDirection: 'row',
                        width: RADIUS_OF_NODE+'px',
                    }}>{item}</div>
                        )}
                    )
                }
            </div>
        </div>
    )
}

//General formula of base conversion
function dual_logarithm(value){
    return (Math.log(value)/Math.log(2));
}
function calculate_margin(width, index,radius){
    console.log("RADIUS "+radius)
    //Special case for the root
    if (index==0){
        return width/2
    }else{
        const INDEX_LEVEL = Math.floor(dual_logarithm(index+1));
        const TOTAL_MARGIN = (width/(Math.pow(2,INDEX_LEVEL)))
        console.log("Margin: "+TOTAL_MARGIN)
        return TOTAL_MARGIN/2;
    }
}