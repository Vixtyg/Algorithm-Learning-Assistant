import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import { array, linearDepth, positionGeometry } from 'three/tsl';


export function Heap({ heapArray, width, max_nodes_bottom, change_tracker }) {
    const refsNodesArray = useRef(new Set());
    const [stateNodesArray, setStateNodesArray] = useState([]);

    const [lineArray, setLineArray] = useState();
    const [lineIndex, setLineIndex] = useState();
    const refsPointsArray = useRef(new Set());

    const MAX_AMOUNT_OF_NODES = max_nodes_bottom;
    const DIAMETER_OF_NODE = (width / MAX_AMOUNT_OF_NODES);
    const RADIUS_OF_NODE = (DIAMETER_OF_NODE / 2);
    React.useEffect(() => {
        //i have NO IDEA why this works LMAO
        //It rerenders and recreates...

        if (heapArray.length == 0) {
            console.log(refsNodesArray.current)
            reset_heap(refsNodesArray);
        }
        setStateNodesArray([...refsPointsArray.current]);
    }, [heapArray]);
    React.useEffect(() => {
        if (lineArray != null) {
            lineArray.style.background = 'white'
            lineArray.style.height = '2px'
            console.log(lineIndex)
            if ((lineIndex + 1) % 2 == 0) {
                lineArray.style.width = calculate_length(calculate_coordinate(Math.floor(lineIndex / 2), refsNodesArray),
                    calculate_coordinate(lineIndex, refsNodesArray)) + 'px'
                lineArray.style.transform = `rotate(${-calculate_angle(
                    calculate_coordinate(Math.floor(lineIndex / 2), refsNodesArray),
                    calculate_coordinate(lineIndex, refsNodesArray)
                )}deg)`
            } else {
                lineArray.style.width = calculate_length(calculate_coordinate(lineIndex / 2 - 1, refsNodesArray),
                    calculate_coordinate(lineIndex, refsNodesArray)) + 'px'
                lineArray.style.transform = `scaleX(-1) rotate(${- calculate_angle(calculate_coordinate(lineIndex / 2 - 1, refsNodesArray),
                    calculate_coordinate(lineIndex, refsNodesArray))}deg)`
            }
            lineArray.style.left = calculate_coordinate(lineIndex, refsNodesArray)[0] + 'px';
            lineArray.style.top = calculate_coordinate(lineIndex, refsNodesArray)[1] + 'px';
            swap(lineIndex, [...refsNodesArray.current]);
        }
    }, [lineArray]);
    return (
        <div className='App'>
            <div>
                {heapArray.slice(1).map((item, index) => {
                    return (
                        <div className='animated-line' style={
                            {
                                width: '0px',
                                zIndex: '-1',
                                position: 'absolute',
                                transformOrigin: 'top left'
                            }
                        } ref={ref => {
                            if (ref != null) {
                                refsPointsArray.current.add(ref)
                                setLineIndex(index + 1)
                                setLineArray(ref)
                            }
                        }}
                        >{ }</div>
                    )
                }
                )
                }
            </div>
            <div style={{
                width: width + 10 + 'px',
                flexWrap: 'wrap',
                display: 'flex'
            }}>
                {heapArray.map((item, index) => {
                    return (
                        <div key={index + item}
                            ref={ref => {
                                if (ref != null) {
                                    refsNodesArray.current.add(ref)
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
                            }}><span id='inner'>{item}</span></div>
                    )
                }
                )
                }
            </div>

        </div >
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
        const TOTAL_MARGIN = (width / (Math.pow(2, INDEX_LEVEL)));
        return (TOTAL_MARGIN / 2) - radius;
    }
}

function reset_heap(refsNodesArray) {
    refsNodesArray.current = new Set();
}

function calculate_coordinate(index_of_heap, refsNodesArray) {
    const array_of_heaps = [...refsNodesArray.current];

    var x1 = array_of_heaps[index_of_heap].getBoundingClientRect().x;
    var y1 = array_of_heaps[index_of_heap].getBoundingClientRect().y;
    return [Math.round(x1) + array_of_heaps[index_of_heap].getBoundingClientRect().width / 2,
    Math.round(y1) + array_of_heaps[index_of_heap].getBoundingClientRect().width / 2];
}
function calculate_angle([x1, y1], [x2, y2]) {

    console.log("Angle " + Math.atan((y2 - y1) / (x2 - x1)))
    console.log("Angle " + Math.atan(Math.abs((y2 - y1)) / Math.abs((x2 - x1))) * 57.29)
    return Math.atan(Math.abs((y2 - y1)) / Math.abs((x2 - x1))) * 57.29
}
function calculate_length([x1, y1], [x2, y2]) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
}
function set_to_array(set) {
    return 2
}

function swap(index, array_of_heaps) {
    var x1 = array_of_heaps[index].getBoundingClientRect().x;
    var y1 = array_of_heaps[index].getBoundingClientRect().y;
    console.log("Sifting " + array_of_heaps[index].getBoundingClientRect().y)
    index += 1;
    if (index % 2 == 0) {
        var x2 = array_of_heaps[index / 2 - 1].getBoundingClientRect().x;
        var y2 = array_of_heaps[index / 2 - 1].getBoundingClientRect().y;

        array_of_heaps[index - 2].style.transformOrigin = `${array_of_heaps[index / 2].getBoundingClientRect().width / 2
            + (x1 - x2) / 2
            }px 
        ${array_of_heaps[index / 2].getBoundingClientRect().width / 2
            + (y1 - y2) / 2
            }px`

        array_of_heaps[index - 2].style.transform = `rotate(180deg)`
        array_of_heaps[index - 2].querySelector("#inner").style.transform = `rotate(-180deg)`

        array_of_heaps[index - 1].style.transformOrigin = `${array_of_heaps[index / 2].getBoundingClientRect().width / 2
            - (x1 - x2) / 2
            }px 
        ${array_of_heaps[index - 1].getBoundingClientRect().width / 2
            - (y1 - y2) / 2
            }px`

        array_of_heaps[index - 1].style.transform = `rotate(180deg)`
    } else {

    }
}