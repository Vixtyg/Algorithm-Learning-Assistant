import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import { array, div, linearDepth, positionGeometry } from 'three/tsl';


export function Heap({ heapArray, width, max_nodes_bottom, change_tracker }) {
    const setOfNodes = useRef([]);
    const [stateNodesArray, setStateNodesArray] = useState([]);
    const [latestNode, setLatestNode] = useState();

    const [latestNodeWrapper, setLatestNodWrapper] = useState();
    const [mainWrapper, setMainWrapper] = useState();
    const [container, setContainer] = useState();
    const [latestLine, setlatestLine] = useState();
    const [lineIndex, setLineIndex] = useState();
    const refsPointsArray = useRef(new Set());

    const MAX_AMOUNT_OF_NODES = max_nodes_bottom;
    const DIAMETER_OF_NODE = (width / MAX_AMOUNT_OF_NODES);
    const RADIUS_OF_NODE = (DIAMETER_OF_NODE / 2);
    React.useEffect(() => {
        //i have NO IDEA why this works LMAO
        //It rerenders and recreates...
        if (heapArray.length == 0) {
            setStateNodesArray([])
            reset_heap(setOfNodes);
        }
    }, [heapArray]);
    React.useEffect(() => {
        if (latestNode != null) {
            latestNode.style.top = latestNode.offsetTop + 'px'
            latestNode.style.left = latestNode.offsetLeft + 'px'
        }
    }, [latestNode]);
    React.useEffect(() => {
        if (latestNode != null) {

            if (stateNodesArray[0] == null) {
                setStateNodesArray([latestNode])

            }
        }
        if (latestNode != null) {

        }
        //console.log("Latest " + stateNodesArray)
        if (latestLine != null) {
            latestLine.style.background = 'white'
            latestLine.style.height = '2px'
            //    console.log(lineIndex)
            if ((lineIndex + 1) % 2 == 0) {
                latestLine.style.width = calculate_length(calculate_coordinate(Math.floor(lineIndex / 2), setOfNodes),
                    calculate_coordinate(lineIndex, setOfNodes)) + 'px'
                latestLine.style.transform = `rotate(${-calculate_angle(
                    calculate_coordinate(Math.floor(lineIndex / 2), setOfNodes),
                    calculate_coordinate(lineIndex, setOfNodes)
                )}deg)`
            } else {
                latestLine.style.width = calculate_length(calculate_coordinate(lineIndex / 2 - 1, setOfNodes),
                    calculate_coordinate(lineIndex, setOfNodes)) + 'px'
                latestLine.style.transform = `scaleX(-1) rotate(${- calculate_angle(calculate_coordinate(lineIndex / 2 - 1, setOfNodes),
                    calculate_coordinate(lineIndex, setOfNodes))}deg)`
            }
            latestLine.style.left = calculate_coordinate(lineIndex, setOfNodes)[0] - mainWrapper.offsetLeft + 'px';
            latestLine.style.top = calculate_coordinate(lineIndex, setOfNodes)[1] - mainWrapper.offsetTop + 'px';
            setTimeout(function () {
                swap(lineIndex, lineIndex - 1, setOfNodes.current, RADIUS_OF_NODE)

            }, 2000)


        }
    }, [latestLine]);


    return (
        <div className='App'>
            <div id="container-heap">

                <div ref={ref => {
                    setMainWrapper(ref)
                }} style={{
                    width: width + 10 + 'px',
                    flexWrap: 'wrap',
                    display: 'flex',
                    position: 'relative'
                }}>
                    {heapArray.map((item, index) => {
                        return (
                            <div style={{
                            }}>
                                <div key={index + item}
                                    ref={ref => {
                                        setLatestNodWrapper(ref)
                                    }}
                                    className='node node-visible' style={{
                                        marginLeft: calculate_margin(width, index, RADIUS_OF_NODE, max_nodes_bottom) + 'px',
                                        marginRight: calculate_margin(width, index, RADIUS_OF_NODE, max_nodes_bottom) + 'px',
                                        marginBottom: '20px',
                                        width: DIAMETER_OF_NODE + 'px',
                                        height: DIAMETER_OF_NODE + 'px',
                                        position: 'static'
                                    }}><div ref={ref => {
                                        if (ref != null) {
                                            if (setOfNodes.current.includes(ref) == false) {

                                                setOfNodes.current.push(ref)
                                            }
                                            setLatestNode(ref)
                                        }
                                    }} style={{

                                        position: 'absolute',
                                        background: 'purple',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: DIAMETER_OF_NODE + 'px',
                                        height: DIAMETER_OF_NODE + 'px'
                                    }} id='inner'>{item}</div></div>
                            </div>
                        )
                    }
                    )
                    }
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
                                        setlatestLine(ref)
                                    }
                                }}
                                >{ }</div>
                            )
                        }
                        )
                        }
                    </div>
                </div>
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

function reset_heap(setOfNodes) {
    setOfNodes.current = [];
}

function calculate_coordinate(index_of_heap, setOfNodes) {
    const array_of_heaps = [...setOfNodes.current];

    var x1 = array_of_heaps[index_of_heap].getBoundingClientRect().x;
    var y1 = array_of_heaps[index_of_heap].getBoundingClientRect().y;
    return [Math.round(x1) + array_of_heaps[index_of_heap].getBoundingClientRect().width / 2,
    Math.round(y1) + array_of_heaps[index_of_heap].getBoundingClientRect().width / 2];
}
function calculate_angle([x1, y1], [x2, y2]) {
    return Math.atan(Math.abs((y2 - y1)) / Math.abs((x2 - x1))) * 57.29
}
function calculate_length([x1, y1], [x2, y2]) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
}
function set_to_array(set) {
    return 2
}

function swap(index, index_parent, array_of_heaps, width, heapArray) {

    var x1 = array_of_heaps[index].getBoundingClientRect().x;
    var y1 = array_of_heaps[index].getBoundingClientRect().y;

    var x2 = array_of_heaps[index_parent].getBoundingClientRect().x;
    var y2 = array_of_heaps[index_parent].getBoundingClientRect().y;

    var dx = x2 - x1;
    var dy = y2 - y1;


    array_of_heaps[index].style.top = `${dy + array_of_heaps[index].offsetTop}px`
    array_of_heaps[index].style.left = `${dx + array_of_heaps[index].offsetLeft}px`

    array_of_heaps[index_parent].style.left = `${-dx + array_of_heaps[index_parent].offsetLeft}px`
    array_of_heaps[index_parent].style.top = `${-dy + array_of_heaps[index_parent].offsetTop}px`



    var intermediate = array_of_heaps[index]
    array_of_heaps[index] = array_of_heaps[index_parent]
    array_of_heaps[index_parent] = intermediate;
    console.log(array_of_heaps)


}