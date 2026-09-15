import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import { array, div, linearDepth, positionGeometry } from 'three/tsl';
import { Line2NodeMaterial } from 'three/webgpu';
import { disposeShadowMaterial } from 'three/src/nodes/TSL.js';

const SPEED_IN_MS = 1000;

export function Heap({ heapArray, width, max_nodes_bottom, change_tracker, setHeapArray,
    input_bar_active, form_status, input_bar, extract_min, set_extract_min,
    heapifyStat, setHeapify
}) {
    const setOfNodes = useRef([]);

    const arrayOfAnimatedNodes = useRef([]);
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
        if (setOfNodes.current[heapArray.length - 1] != null) {
            setOfNodes.current[heapArray.length - 1].style.top = setOfNodes.current[heapArray.length - 1].offsetTop + 'px'
            setOfNodes.current[heapArray.length - 1].style.left = setOfNodes.current[heapArray.length - 1].offsetLeft + 'px'
        }
        var i = 0;
        for (i = 0; i < setOfNodes.current.length; i++) {
            setOfNodes.current[i].style.top = setOfNodes.current[i].offsetTop + 'px'
            setOfNodes.current[i].style.left = setOfNodes.current[i].offsetLeft + 'px'
        }
    }, [heapArray]);
    React.useEffect(() => {
        if (latestNode != null && arrayOfAnimatedNodes.current.includes(latestNode) == false) {
            arrayOfAnimatedNodes.current.push(latestNode)
            setOfNodes.current[latestNode].style.transformOrigin = `center`
            setOfNodes.current[latestNode].animate(
                [
                    {
                        // from
                        opacity: 0,
                        transform: 'scale(0)'
                    },
                    {
                        // to
                        opacity: 1,
                        transform: 'scale(1.2)'
                    },
                    {
                        // to
                        opacity: 1,
                        transform: 'scale(0.8)'
                    },
                    {
                        // to
                        opacity: 1,
                        transform: 'scale(1)'
                    },
                ],
                200,
            );
        }
    }, [latestNode]);
    React.useEffect(() => {

        setTimeout(function () {
            //     swap(lineIndex, lineIndex - 1, setOfNodes.current, RADIUS_OF_NODE, setHeapArray, heapArray)
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
                //  sift_up(setOfNodes, setOfNodes.current, lineIndex, input_bar, setHeapArray, heapArray)

            }
        }, 100)
    }, [latestLine]);
    React.useEffect(() => {
        if (extract_min == true) {
            pop(setOfNodes.current, 0, input_bar, setHeapArray, setOfNodes, heapArray, set_extract_min);
            //heapify(0, setOfNodes, heapArray, setHeapArray)
        }
    }, [extract_min]);
    React.useEffect(() => {
        if (heapifyStat == true) {
            //pop(setOfNodes.current, 0, input_bar, setHeapArray, setOfNodes, heapArray, set_extract_min);
            heapify(0, setOfNodes, heapArray, setHeapArray, setHeapify)
        }
    }, [heapifyStat]);

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
                                        position: 'static',
                                        fontSize: DIAMETER_OF_NODE / 3 + 'px'
                                    }}><div key={item + index} ref={ref => {
                                        if (ref != null) {
                                            if (setOfNodes.current.includes(ref) == false) {

                                                setOfNodes.current.push(ref)
                                            }
                                            setLatestNode(index)
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
    return [return_number(x1) + array_of_heaps[index_of_heap].getBoundingClientRect().width / 2,
    return_number(y1) + array_of_heaps[index_of_heap].getBoundingClientRect().width / 2];
}
function calculate_angle([x1, y1], [x2, y2]) {
    return Math.atan(Math.abs((y2 - y1)) / Math.abs((x2 - x1))) * 57.29
    //57.29 converts radians to degrees (180/pi)
}
function calculate_length([x1, y1], [x2, y2]) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
}
function set_to_array(set) {
    return 2
}

async function swap(setOfNodes, index, index_parent, array_of_heaps, setHeapArray, heapArray) {

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

    var i = 0

    var copyOfHeapArray = heapArray.slice()
    for (i = 0; i < array_of_heaps.length; i++) {
        copyOfHeapArray[i] = array_of_heaps[i].innerText
    }
    var intermediate2 = (array_of_heaps[index].innerText)
    copyOfHeapArray[index] = (array_of_heaps[index_parent].innerText)
    copyOfHeapArray[index_parent] = intermediate2;

    setOfNodes.current = []


    await sleep(SPEED_IN_MS);
    setHeapArray(copyOfHeapArray)

    await sleep(1);
    // setTimeout(function () {
    //setHeapArray([2, 1])
    //   }, 2000)
    //fix fullscreen
}
async function sift_up(setOfNodes, divArray, nodeIndex, input_bar, setHeapArray, heapArray) {
    if ((nodeIndex + 1) % 2 == 0) {
        var parent = (nodeIndex + 1) / 2 - 1

    } else {
        var parent = (nodeIndex) / 2 - 1
    }
    if (divArray[parent] && divArray[nodeIndex]) {
        input_bar.disabled = true;
        divArray[parent].style.background = "red"
        divArray[nodeIndex].style.background = "red"
        if (divArray[parent].innerText - divArray[nodeIndex].innerText >= 0) {
            await sleep(500);
            await swap(setOfNodes, nodeIndex, parent, divArray, setHeapArray, heapArray)
        } else {
            await sleep(1200);
            input_bar.disabled = false
            input_bar.focus()
        }
        await sleep(1200);
        divArray[parent].style.background = "purple"
        divArray[nodeIndex].style.background = "purple"
        await sleep(1200);
        await sift_up(setOfNodes, setOfNodes.current, parent, input_bar, setHeapArray, heapArray)

    } else {
        await sleep(1200);
        input_bar.disabled = false
        input_bar.focus()
    }
}

async function sleep(timeInMs) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve()
        }, timeInMs);
    });
}
async function sift_down(setOfNodes, divArray, nodeIndex, input_bar, setHeapArray, arrayHeap) {

    var leftChild = nodeIndex * 2 + 1
    var rightChild = nodeIndex * 2 + 2
    var maximumNodeIndex = rightChild;
    if (setOfNodes.current[leftChild] == null && setOfNodes.current[rightChild] != null) {
        setOfNodes.current[rightChild].style.background = 'red'
        maximumNodeIndex = rightChild;
    } else if (setOfNodes.current[leftChild] != null && setOfNodes.current[rightChild] == null) {
        setOfNodes.current[leftChild].style.background = 'red'
        maximumNodeIndex = leftChild
    } else if (setOfNodes.current[leftChild] != null && setOfNodes.current[rightChild] != null) {
        setOfNodes.current[rightChild].style.background = 'red'
        setOfNodes.current[leftChild].style.background = 'red'
        if (Math.round(setOfNodes.current[rightChild].innerText) > Math.round(setOfNodes.current[leftChild].innerText)) {
            maximumNodeIndex = leftChild
        }
    }
    console.log(divArray[nodeIndex])

    console.log(divArray[maximumNodeIndex])
    if (divArray[nodeIndex] != null && divArray[maximumNodeIndex] != null && divArray[maximumNodeIndex].innerText != null) {
        if (return_number(divArray[nodeIndex].innerText) > return_number(divArray[maximumNodeIndex].innerText)) {

            await swap(setOfNodes, nodeIndex, maximumNodeIndex, divArray, setHeapArray, arrayHeap)
            await sift_down(setOfNodes, setOfNodes.current, maximumNodeIndex, input_bar, setHeapArray, arrayHeap)
        }
    }
    if (setOfNodes.current[rightChild] != null) {
        setOfNodes.current[rightChild].style.background = 'purple'
    }
    if (setOfNodes.current[leftChild] != null) {
        setOfNodes.current[leftChild].style.background = 'purple'
    }
}
async function pop(divArray, nodeIndex, input_bar, setHeapArray, setOfNodes, arrayHeap, setDone) {
    var index = 0;
    var value = '∞';
    var i = 0;
    var newSetOfNodes = []
    divArray[nodeIndex].innerText = '∞'
    await sift_down(setOfNodes, divArray, nodeIndex, input_bar, setHeapArray, arrayHeap)
    for (i = 0; i < setOfNodes.current.length; i++) {
        if ((setOfNodes.current[i].innerText) == value) {
            index = i;
        }
    }
    var newArray = [];
    for (i = 0; i < setOfNodes.current.length; i++) {
        if ((setOfNodes.current[i].innerText) == value) {

            console.log(setOfNodes.current[i].innerText)
        } else {
            console.log(setOfNodes.current[i].innerText)
            newArray.push(setOfNodes.current[i].innerText)
        }
    }
    setOfNodes.current = []
    console.log(newArray)
    setHeapArray(newArray)
    for (i = 0; i < setOfNodes.current.length; i++) {
        if (return_number(setOfNodes.current[i].innerText) == value) {
            index = i;
        }

    }
    setDone(false)
}
function return_number(value) {
    if (value == "∞") {
        return 99999999
    } else {
        return Math.round(value)
    }
}
//test edge cases
async function heapify(index, setOfNodes, heapArray, setHeapArray, setHeapify) {
    var leftChild = 2 * index + 1
    var rightChild = 2 * index + 2
    var length = setOfNodes.current.length
    if (setOfNodes.current[leftChild] != null) {
        await heapify(leftChild, setOfNodes, heapArray, setHeapArray)
    }
    if (setOfNodes.current[rightChild] != null) {
        await heapify(rightChild, setOfNodes, heapArray, setHeapArray)
    }
    await sift_down(setOfNodes, setOfNodes.current, index, null, setHeapArray, heapArray)
    if (setHeapify != null) {

        setHeapify(false)
    }
}