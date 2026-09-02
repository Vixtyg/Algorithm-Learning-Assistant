import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';


export function Heap({ heapArray, width, max_nodes_bottom, change_tracker }) {
    var refsMap = new Set()
    const refsArray = useRef(refsMap);
    const MAX_AMOUNT_OF_NODES = max_nodes_bottom;
    const DIAMETER_OF_NODE = (width / MAX_AMOUNT_OF_NODES);
    const RADIUS_OF_NODE = (DIAMETER_OF_NODE / 2);
    React.useEffect(() => {
        console.log(refsArray)
        //i have NO IDEA why this works LMAO
        //It rerenders and recreates...
        if (heapArray.length == 0) {
            reset_heap(refsArray)
        }
    }, [heapArray])
    return (
        <div className='App'>
            <div style={{
                width: width + 10 + 'px',
                flexWrap: 'wrap',
                display: 'flex'
            }}>
                {heapArray.map((item, index) => {
                    // Math.log(2)
                    return (
                        <div ref={ref => {
                            if (ref != null) {
                                refsArray.current.add(ref)
                            }
                        }} className='node node-visible' style={{
                            marginLeft: calculate_margin(width, index, RADIUS_OF_NODE, max_nodes_bottom) + 'px',
                            marginRight: calculate_margin(width, index, RADIUS_OF_NODE, max_nodes_bottom) + 'px',
                            marginBottom: '20px',
                            background: 'purple',
                            display: 'flex',
                            flexDirection: 'row',
                            width: DIAMETER_OF_NODE + 'px',
                            height: DIAMETER_OF_NODE + 'px'
                        }}>{item}</div>

                    )
                }
                )
                }
            </div>
            <div>
                {heapArray.slice(1, heapArray.length).map((item, index) => {
                    // Math.log(2)
                    return (
                        <div ref={ref => {
                            if (ref != null) {
                                refsArray.current.add(ref)
                            }
                        }} style={{
                            position: 'absolute',
                            height: '2px',
                            width: '2px',
                            background: 'white',
                        }}>{ }</div>

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
        const TOTAL_MARGIN = (width / (Math.pow(2, INDEX_LEVEL)))
        return (TOTAL_MARGIN / 2) - radius;
    }

}

function reset_heap(refsArray) {
    refsArray.current = new Set();
}

function connect_points(key_of_heap1, key_of_heap2) {
    var [x1, y1, x2, y2] = (0, 0, 0, 0)
    return ((x1, y1), (x2, y2))
}