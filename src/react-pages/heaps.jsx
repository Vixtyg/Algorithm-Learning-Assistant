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

    const [inputBar, setInputBar] = useState();
    const [inputBarValue, inputBarValueSet] = useState(0);
    const [arrayOfHeap, arraySet] = useState([]);
    const [extractMin, setExtractMin] = useState(false);
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
    const requestFullScreen = () => {
        heapRef.current.requestFullscreen()

    }
    const popHeap = () => {
        setExtractMin(true)

    }
    React.useEffect(() => {
        if (heapRef != null) {
            if (extractMin == true) {
                //  heapRef.current.style.background = "red"
            }
        }
    }, [extractMin]);
    return (
        <div className='App'>
            <div id="heap-container">
                <div id="inner-heap-container">
                    <div id="heap-wrapper" ref={heapRef}>
                        <Heap id="heap" heapArray={arrayOfHeap} width={Math.round(// Source - https://stackoverflow.com/a/3437825
                            window.screen.width / 4)} max_nodes_bottom={8} setHeapArray={arraySet}
                            input_bar={inputBar}
                            extract_min={extractMin} set_extract_min={setExtractMin} />

                    </div>

                    <form autoComplete='off' onSubmit={async (e) => {
                        e.preventDefault()
                        submitted(e)
                    }}>
                        <input ref={ref => {
                            setInputBar(ref)
                        }} onKeyDown={(e) => {
                            if (isNaN(e.key / 2) && e.key != "Backspace" && e.key != "Enter"
                                || arrayOfHeap.length >= 15) {
                                e.preventDefault()
                            }


                        }} id="form" onChange={(e) => { }} />
                        <button type='submit'>Submit</button>
                    </form>
                    <button onClick={emptyArray}>Reset</button>
                    <button onClick={requestFullScreen}>Fullscreen</button>
                    <button onClick={popHeap}>Extract-Max</button>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}
