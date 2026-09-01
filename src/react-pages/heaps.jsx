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


export function Heaps(){

    const [inputBarValue, inputBarValueSet] = useState(0);
    const [arrayOfHeap, arraySet] = useState([]);
    const submitted = function (e) {
        var formValue = e.target.querySelector("#form").value;
        //This merely creates a copy lol..?
     
        arraySet([...arrayOfHeap,formValue])
        console.log("Array "+arrayOfHeap)
        e.target.querySelector("#form").value = ""
    }
    return(
        <div className='App'>
            <div id="heap-container">
                <div id="inner-heap-container">
                    
                <Heap  heapArray={arrayOfHeap} width={100}/>
                <form  onSubmit={(e) => {
                    submitted(e)}}>
                    <input onKeyDown={(e)=>{
                        if (isNaN(e.key/2)&&e.key!="Backspace"&&e.key!="Enter"){
                            e.preventDefault()
                        }
                      
                      
                    }} id="form" onChange={(e)=>{}} />
                    <button type='submit'>Submit</button>
                </form>

                </div>
            </div>
            <div>
                
            </div>
        </div>
    )
}
