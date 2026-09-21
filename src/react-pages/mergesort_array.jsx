import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import { BST } from './binary_search_tree.jsx';
import { eventWrapper } from '@testing-library/user-event/dist/utils/index.js';
import { update } from 'three/examples/jsm/libs/tween.module.js';


//Add positon tracker // Keys // IDs // Class //Auto resize //Form submit


export function Mergesort({ elements }) {
    const number = elements
    const input_bar_array = []
    const input_bar_ref = useRef([])
    const submit_button_ref = useRef()
    const [update_counter, set_update_counter] = useState(0);
    var i
    for (i = 0; i < elements; i++) {
        if (i < (elements - 1)) {
            input_bar_array.push(',')
        } else {
            input_bar_array.push('')
        }
    }
    const go_to_next_input_bar = (e, index) => {
        if ((index + 2) <= elements) {
            input_bar_ref.current[index + 1].focus()
        }
    }
    const go_to_previous_input_bar = (e, index) => {
        if ((index) > 0) {
            input_bar_ref.current[index - 1].focus()
        }
    }
    const check_if_full = () => {
        var is_full = false
        var filled_containers = 0
        var index
        for (index = 0; index < elements; index++) {
            if (input_bar_ref.current[index].value != "") {
                filled_containers += 1;
            }
            if (filled_containers == elements) {
                unlock_submit()
            } else {
                lock_submit()
            }
        }
    }
    const unlock_submit = () => {
        submit_button_ref.current.style.opacity = 1
        submit_button_ref.current.disabled = false
    }
    const lock_submit = () => {
        submit_button_ref.current.style.opacity = 0
        submit_button_ref.current.disabled = true
    }
    const create_animation_matrix = () => {

    }
    const mergesort = (arr) => {
        var start = 0
        var end = arr.length
        if (arr.length == 1) {
            return [arr[start]]
        }
        var midpoint = Math.floor((end + start) / 2)
        var arr1 = mergesort(arr.slice(0, midpoint))
        var arr2 = mergesort(arr.slice(midpoint, end))
        return merge(arr1, arr2)
    }
    const concatenate = (array_original, index, array_inside) => {
        var length_of_original = array_original.length
        var i = 0
        while (true) {
            array_original.push(array_inside[index])
            index += 1
            if (array_inside[index] == null) {
                break
            }
        }
        return array_original
    }
    const merge = (arr1, arr2) => {
        var arr_length1 = arr1.length
        var arr_length2 = arr2.length
        let merged_array = []
        var i = 0;
        var j = 0;
        var k = 0;
        while (true) {
            if (arr1[i] <= arr2[j]) {
                merged_array.push(arr1[i])
                i += 1
            } else {
                merged_array.push(arr2[j])
                j += 1
            }
            if ((i) >= arr_length1) {
                return merged_array = concatenate(merged_array, j, arr2)
                break
            } else if ((j) >= arr_length2) {
                return merged_array = concatenate(merged_array, i, arr1)
                break
            }
        }
    }

    console.log(mergesort([5, 4, 6, 9, 10, 9, 8, 7, 6, 5, 5, 4, 3, 2, 1, 1, 1, 0, 0]

    ))
    return (
        <div className='App'>
            <div id='array-form'>
                <div id="input-bars">
                    [{input_bar_array.map((value, index) => {
                        return <div id="outer-input-bar-container">
                            <div id="input-bar-container">
                                <input onChange={check_if_full} onKeyDown={e => {
                                    if (e.key == "Enter"
                                        || e.key == "ArrowRight"
                                    ) {
                                        //Note to self - track caret position
                                        //to improve navigation here!
                                        go_to_next_input_bar(e, index)
                                    }
                                    if (e.key == "ArrowLeft"
                                    ) {
                                        //Note to self - track caret position
                                        //to improve navigation here!
                                        go_to_previous_input_bar(e, index)
                                    }
                                }} id="cell-inputbar" type="text"
                                    ref={ref => {
                                        input_bar_ref.current.push(ref)
                                    }} />
                                {value}
                            </div>
                        </div>
                    })}]


                </div>

                <button disabled="disabled" style={{
                    opacity: 0
                }} id="submit-array-form"
                    onSubmit={create_animation_matrix}
                    ref={submit_button_ref}>Submit!</button>
            </div>
        </div>
    )
}
