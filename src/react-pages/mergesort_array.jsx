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
    const array_unsorted = useRef([])
    const array_merge_sequence = useRef([])

    const array_sorted_merge_sequence = useRef([])
    const [array_unsorted_state, set_array_unsorted_state] = useState([])
    const [array_sorted_state, set_array_sorted_state] = useState([])
    const [finished_render, set_finished_render] = useState(false)
    const submit_button_ref = useRef()
    const [update_counter, set_update_counter] = useState(0);

    const [latest_array,set_latest_array] = useState()

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
    const recursive_LR_traversal = (result_arr, arr, index) => {
        if (arr[index - 1] == null) {
            return
        }
        result_arr.push(arr[index - 1])
        recursive_LR_traversal(result_arr, arr, 2 * index)
        recursive_LR_traversal(result_arr, arr, 2 * index + 1)

    }
    const order_of_LR_traversal = (length) => {
        var order_of_LR_traversal = []
        var ascending_array = []
        var i
        for (i = 0; i < length; i++) {
            ascending_array.push(i)
        }
        recursive_LR_traversal(order_of_LR_traversal, ascending_array, 1)
        return order_of_LR_traversal
    }
    const reverse_LR_order = (merge_sequence) => {
        var copy_of_merge_sequence = merge_sequence.slice()
        var length_of_merge_sequence = merge_sequence.length
        var i
        var index_of_next
        var order_of_LR = order_of_LR_traversal(length_of_merge_sequence)
        for (i = 0; i < length_of_merge_sequence; i++) {
            index_of_next = order_of_LR[i]
            console.log(index_of_next)
            copy_of_merge_sequence[index_of_next] = (merge_sequence[i])
        }

        return copy_of_merge_sequence
    }
    const create_animation_matrix = () => {
        var i;
        array_unsorted.current = []
        for (i = 0; i < input_bar_ref.current.length; i++) {
            console.log("SAD")
            array_unsorted.current.push(Math.round(input_bar_ref.current[i].value))
        }
        //parent child relationship
        console.log(array_unsorted.current)
        mergesortInitiate(array_unsorted.current)
        array_sorted_merge_sequence.current = reverse_LR_order(array_sorted_merge_sequence.current.reverse())

        array_merge_sequence.current = (reverse_LR_order(array_merge_sequence.current))
        //      console.log(array_sorted_merge_sequence.current)
        console.log("LOG" + flip_heap_array_horizontally(array_sorted_merge_sequence.current))
        console.log(array_sorted_merge_sequence.current)
        set_array_unsorted_state(array_merge_sequence.current)
        set_array_sorted_state(array_sorted_merge_sequence.current.reverse())
    }
    const mergesortInitiate = (arr) => {
        array_merge_sequence.current = []
        array_sorted_merge_sequence.current = []
        return mergesort(arr)
    }

    const mergesort = (arr) => {
        var start = 0
        var end = arr.length
        array_merge_sequence.current.push(arr)
        if (arr.length == 1) {
            //console.log(arr)
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
        array_sorted_merge_sequence.current.push(array_original)
        return array_original
    }
    const merge = (arr1, arr2) => {
        var arr_length1 = arr1.length
        var arr_length2 = arr2.length
        let merged_array = []
        var i = 0;
        var j = 0;
        var k = 0;
        //presort
        //console.log(arr1, arr2)
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
        //postsort
    }
    const calculate_coordinate = (width, index) => {
        var x
        var y
        var depth = Math.floor(Math.log(index + 1) / Math.log(2))
        var spacing_gaps = width / (Math.pow(2, depth + 1))
        var index_in_depth = ((index + 2) - Math.pow(2, depth))
        x = (spacing_gaps) * (index_in_depth - 1) + spacing_gaps / 2
        y = depth * 100
        return [x, y]
    }
    const calculate_coordinate_upside_down = (width, index) => {
        var x
        var y
        var depth = Math.floor(Math.log(index + 1) / Math.log(2))
        var spacing_gaps = width / (Math.pow(2, depth + 1))
        var index_in_depth = (Math.pow(2, depth + 1) - (index + 1))
        x = (spacing_gaps) * (index_in_depth - 1) + spacing_gaps / 2
        y = depth * (-100)
        return [x, y]
    }
    const flip_heap_array_horizontally = (array) => {

        var i
        var flipped_array = []
        for (i = 0; i < Math.floor(Math.log(array.length) / Math.log(2)); i++) {
            var lower_end = Math.pow(2, i) - 1
            var higher_end = Math.pow(2, i + 1) - 1
            var sliced = array.slice(lower_end, higher_end)
            var flipped = sliced.slice(sliced.length / 2).concat(sliced.slice(0, sliced.length / 2))

            flipped_array.push(flipped)
        }
        return flipped_array
    }
    return (
        <div className='App'>
            <div id='array-form'>
                <div id="input-bars">
                    [{input_bar_array.map((comma, index) => {
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
                                        if (ref != null && input_bar_ref.current.includes(ref) == false) {
                                            input_bar_ref.current.push(ref)
                                        }

                                    }} />
                                {comma}
                            </div>
                        </div>
                    })}]


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
                        
                        {array_unsorted_state.map((value, index) => {
                            return <div class="array-cell"
                                style={{
                                    transformOrigin: 'center',
                                    transform: 'translateX(-50%)',
                                    //transform halfway left
                                    position: 'absolute',
                                    left: `${calculate_coordinate(1000, index)[0]}px`,
                                    top: `${calculate_coordinate(1000, index)[1]}px`
                                }}>[{`${value}`}]</div>
                        })}
                        
                    </div>
                    <div class="array-branch-merged" style={{
                        position: 'absolute'
                    }}>
                        
                        {array_sorted_state.map((value, index) => {
                            return <div class="array-cell"
                                style={{
                                    transformOrigin: 'center',
                                    transform: 'translateX(-50%)',
                                    //transform halfway left
                                    position: 'absolute',
                                    left: `${calculate_coordinate_upside_down(1000, 6 - index)[0]}px`,
                                    top: `${calculate_coordinate_upside_down(1000, 6 - index)[1] + 550}px`
                                }}>[{`${value}`}]</div>
                        })}
                        
                    </div>
                </div>
            </div>
        </div >
    )
}