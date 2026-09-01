import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';


export function Heap({ heapArray, width, max_nodes_bottom }) {
    const MAX_AMOUNT_OF_NODES = max_nodes_bottom;
    const DIAMETER_OF_NODE = Math.ceil(width / MAX_AMOUNT_OF_NODES);
    const RADIUS_OF_NODE = Math.ceil(DIAMETER_OF_NODE / 2);
    return (
        <div className='App'>
            <div style={{
                width: width + 10 + 'px',
                background: 'red',
                flexWrap: 'wrap',
                display: 'flex'
            }}>
                {heapArray.map((item, index) => {
                    // Math.log(2)
                    return (

                        <div className='node' style={{
                            marginLeft: calculate_margin(width, index, RADIUS_OF_NODE, max_nodes_bottom) + 'px',
                            marginRight: calculate_margin(width, index, RADIUS_OF_NODE, max_nodes_bottom) + 'px',
                            marginBottom: '20px',
                            background: 'purple',
                            display: 'flex',
                            flexDirection: 'row',
                            width: DIAMETER_OF_NODE + 'px',
                        }}>{item}</div>
                    )
                }
                )
                }
            </div>
        </div>
    )
}

//General formula of base conversion
function dual_logarithm(value) {
    return (Math.log(value) / Math.log(2));
}
function calculate_margin(width, index, radius, max_nodes_bottom) {
    //Special case for the root
    //bottom nodes must be squished together in a pixel perfect way.
    //so we handle this seperately
    if (index + 2 > max_nodes_bottom) {

        return 0;
    } else {
        //we have some rounding issues (due to division, pixel perfect behaviour..)
        // here so at the bottom stuff starts to get mushy...
        const INDEX_LEVEL = Math.floor(dual_logarithm(index + 1));
        const TOTAL_MARGIN = Math.ceil(width / (Math.pow(2, INDEX_LEVEL)))
        console.log("Margin: " + (TOTAL_MARGIN / 2 - radius))
        return Math.ceil(TOTAL_MARGIN / 2) - radius;
    }

}