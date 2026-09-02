import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import { Heap } from './heap.jsx';
import { eventWrapper } from '@testing-library/user-event/dist/utils/index.js';


//Add positon tracker // Keys // IDs // Class //Auto resize //Form submit


export function Heaps() {
    const heapRef = useRef();
    const [inputBarValue, inputBarValueSet] = useState(0);
    const [arrayOfHeap, arraySet] = useState([]);
    const submitted = function (e) {
        var formValue = e.target.querySelector("#form").value;
        //This merely creates a copy lol..?
        if (formValue != "") {
            arraySet([...arrayOfHeap, formValue])
        }
        e.target.querySelector("#form").value = ""
    }
    const emptyArray = () => {
        heapRef.current.style.opacity = 0;
        setTimeout(() => {
            arraySet([]);

            heapRef.current.style.opacity = 1;
        }, 500);
    }
    return (
        <div className='App'>
            <div id="heap-container">
                <div id="inner-heap-container">
                    <div id="heap-wrapper" ref={heapRef}>
                        <Heap id="apparently-i-need-to-wrap-this-in-a-div-lol" heapArray={arrayOfHeap} width={250} max_nodes_bottom={8} />

                    </div>

                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        submitted(e)
                    }}>
                        <input onKeyDown={(e) => {
                            if (isNaN(e.key / 2) && e.key != "Backspace" && e.key != "Enter"
                                || arrayOfHeap.length >= 15) {
                                e.preventDefault()
                            }


                        }} id="form" onChange={(e) => { }} />
                        <button type='submit'>Submit</button>
                    </form>
                    <button onClick={emptyArray}>Reset</button>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}
