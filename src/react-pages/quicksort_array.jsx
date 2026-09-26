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

const ANIMATION_SPEED = 500
export function Quicksort({ elements }) {

    const input_array_div = useRef([])

    const number = elements
    const input_bar_array = []
    const input_bar_ref = useRef([])
    const array_unsorted = useRef([])
    const array_merge_sequence = useRef([])

    const array_merge_sequence_div = useRef([])

    const array_sorted_merge_sequence_div = useRef([])

    const array_sorted_merge_sequence = useRef([])
    const [array_unsorted_state, set_array_unsorted_state] = useState([])
    const [array_sorted_state, set_array_sorted_state] = useState([])


    const [finished_render, set_finished_render] = useState(false)
    const submit_button_ref = useRef()
    const [update_counter, set_update_counter] = useState(0);

    const [latest_array, set_latest_array] = useState()

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
        //console.log(input_bar_ref.current[0].value)
        var is_full = false
        var filled_containers = 0
        var index
        for (index = 0; index < elements; index++) {
            if (input_bar_ref.current[index].value != "") {
                filled_containers += 1;
            }
            if (filled_containers == elements) {
                console.log("unlock")
                unlock_submit()
            } else {
                console.log("Lock")
            }
        }
    }
    const unlock_submit = () => {
        submit_button_ref.current.style.opacity = 1
        submit_button_ref.current.removeAttribute('disabled')
        console.log(submit_button_ref.current.disabled)
    }
    const lock_submit = () => {
        submit_button_ref.current.style.opacity = 0
        submit_button_ref.current.disabled = true
    }


    const create_animation_matrix = () => {
        var i;
        array_unsorted.current = []
        for (i = 0; i < input_bar_ref.current.length; i++) {
            console.log("SAD")
            array_unsorted.current.push(Math.round(input_bar_ref.current[i].value))
        }
        //parent child relationship
        trigger_animation()
    }
    const trigger_animation = async () => {
        quicksort(input_bar_ref, 0, 7)
    }
    const quicksort = async (arr, low, high) => {

        console.log(arr)
        if (low < high) {
            var midpoint = Math.floor((low + high) / 2)
            var pivot_index = await partition(arr, low, high)

            await quicksort(arr, low, pivot_index-1)
            await quicksort(arr, pivot_index + 1, high)
        }
    }
    const partition = async (arr, low, high) => {
        console.log("Partition",low,high)

        var pivot = high
        arr.current[pivot].style.background = "orange"
        var i = low - 1
        var j

        for (j = low; j <= high + 1; j++) {
            if (j == high + 1) {

                console.log("Final swap")
                await swap(arr, i + 1, high)
                break
            }
            if (Math.round(arr.current[j].value) < Math.round(arr.current[pivot].value)) {
                i += 1
                await swap(arr, j, i)
                console.log(i)
            }
        }
        return i+1
    }
    const swap = async (arr, i, j) => {

        var x1 = arr.current[i].offsetLeft
        var x2 = arr.current[j].offsetLeft
        arr.current[i].style.left = `${x2 - 200}px`
        arr.current[j].style.left = `${x1 - 200}px`

        var temp = arr.current[i]
        arr.current[i] = arr.current[j]
        arr.current[j] = temp
        await sleep(2000)
    }
    async function sleep(timeInMs) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                resolve()
            }, timeInMs);
        });
    }
    return (
        <div className='App'>
            <div id='array-form'>
                <div id="input-bars">
                    {input_bar_array.map((comma, index) => {
                        return <div id="outer-input-bar-container">
                            <div id="input-bar-container">
                                <input style={{
                                    marginLeft: '200px',
                                    position: 'absolute',
                                    transition: 'all 0.3s',
                                    left: `${index * 70}px`
                                }} onChange={check_if_full} onKeyDown={e => {
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
                                        if (ref != null && input_bar_ref.current.includes(ref) == false) {
                                            input_bar_ref.current.push(ref)
                                        }

                                    }} />
                                {comma}
                            </div>
                        </div>
                    })}


                </div>

                <button style={{
                    opacity: 0
                }} id="submit-array-form"
                    onClick={create_animation_matrix}
                    ref={ref => {
                        submit_button_ref.current = ref
                        set_finished_render(true)
                    }
                    }>Submit!</button>
            </div >
            <div class='animation-container'>
                <div class='inner-animation-container'>
                    <div class="array-branch" style={{
                        position: 'absolute'
                    }}>


                    </div>
                    <div class="array-branch-merged" style={{
                        position: 'absolute'
                    }}>


                    </div>
                </div>
            </div>
        </div >
    )
}