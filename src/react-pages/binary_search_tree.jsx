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

class BinarySearchTree {
    constructor(width) {
        this.width = width
        this.array = []
        return this
    }
    setRoot(root) {
        this.root = root
        root.depth = 0
        root.x = this.width / 2
        root.container_width = this.width
        this.array.push(root)
    }
    getRoot() {
        return this.root
    }
    getWidth() {
        return this.width
    }
    insert(root, newNode) {


        if (root.getValue() > newNode.getValue()) {

            if (root.getLeft() == null) {
                if (this.array.includes(newNode) == false) {
                    this.array.push(newNode)
                }

                newNode.x = root.x - root.container_width / 4
                newNode.container_width = root.container_width / 2
                newNode.depth += 1
                root.setLeft(newNode)
            } else {

                newNode.x = root.x + root.container_width / 4
                newNode.container_width = root.container_width / 2
                newNode.depth += 1
                this.insert(root.getLeft(), newNode)
            }
        } else if ((root.getValue() < newNode.getValue())) {
            if (root.getRight() == null) {
                if (this.array.includes(newNode) == false) {
                    this.array.push(newNode)
                }
                newNode.x = root.x + root.container_width / 4
                newNode.container_width = root.container_width / 2
                newNode.depth += 1
                root.setRight(newNode)
            } else {

                newNode.x = root.x - root.container_width / 4
                newNode.container_width = root.container_width / 2
                newNode.depth += 1
                this.insert(root.getRight(), newNode)
            }
        }
        return this
    }
    getArray() {
        return this.array
    }
}

class Node {
    constructor(value) {
        this.value = value
        this.left = null
        this.right = null
        this.x = 0
        this.container_width = 0
        this.depth = 0
        return this
    }
    setLeft(left) {
        this.left = left
    }
    setRight(right) {
        this.right = right
    }
    getRight() {
        return this.right;
    }
    getValue() {
        return this.value;
    }
    getLeft() {
        return this.left;
    }
    getHeigh() {
        return this.depth * 50
    }
    getX() {
        return this.x
    }
}

export function BST({ new_entry_bst, set_new_entry_bst, max_nodes_bottom, width
}) {
    const div_array_BST = useRef([])
    var treeRef = useRef(new BinarySearchTree(512))

    const [tree_of_BST, set_tree_bst] = useState([]);

    const [dummystate, set_dummystate] = useState();
    const MAX_AMOUNT_OF_NODES = max_nodes_bottom;
    const DIAMETER_OF_NODE = (width / MAX_AMOUNT_OF_NODES);
    const RADIUS_OF_NODE = (DIAMETER_OF_NODE / 2);

    React.useEffect(() => {
        if (treeRef.current.getRoot() == null) {
            treeRef.current.setRoot(new Node(2))
        }
        if (new_entry_bst != null && new_entry_bst != "RESET" && treeRef.current.getRoot() != null) {
            treeRef.current = treeRef.current.insert(treeRef.current.getRoot(), new Node(new_entry_bst))
            set_tree_bst(treeRef.current.getArray())
            set_dummystate(Math.random())
        console.log(treeRef.current.getArray())
        }
        if (new_entry_bst == "RESET") {
            set_tree_bst([])
        }
    }, [new_entry_bst])
    return (
        <div className='App' style={{
            position: 'relative'
        }}>
            {tree_of_BST.map((node) => {
                return <div style={{
                    position: "static",
                    width: `${DIAMETER_OF_NODE}px`,
                    height: `${DIAMETER_OF_NODE}px`
                }}><div id="inner" style={{

                    left: `${node.x}px`,
                    position: 'absolute',
                    background: "purple",
                    width: `${DIAMETER_OF_NODE}` + 'px',
                    height: `${DIAMETER_OF_NODE}` + 'px',
                    fontSize: `${Math.round(DIAMETER_OF_NODE / 3)}px`,
                    borderRadius: '99999px'
                }} ref={ref => {
                    if (ref != null) {
                        if (div_array_BST.current.includes(ref) == false) {
                            div_array_BST.current.push(ref)
                        }
                    }
                }}>
                        {node.value}
                    </div>
                </div>
            })}
        </div >
    )
}
async function place_new_node(index, div_array_BST, tree_of_BST, x1, x2) {

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

async function sleep(timeInMs) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve()
        }, timeInMs);
    });
}
//test edge cases
function return_number(value) {
    if (value == "∞") {
        return 99999999
    } else {
        return Math.round(value)
    }
}