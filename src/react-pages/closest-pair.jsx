import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { cleanup } from '@testing-library/react';

const loadWasm = async () => {
  const wasm = await import("../wasm/closest_pair.js");
  await wasm.default();
  return wasm;
}

const pointerMap = new Map();

let isMounted = false;

export function ClosestPair() {

  let isMounted = false;
  const [pointState, setPointState] = useState("point");
  const refArray = useRef([]);
  const canvasRef = useRef(null);
  const nav = useNavigate();
  const navigate = () => {
    nav('/closestpair')
  }
  const [points, setPoints] = useState([]);
  const [order, setOrder] = useState([]);
  React.useEffect(() => {
    const getPoint = async () => {
      const closestPair = await loadWasm();
      let canvasStruct = closestPair.instantiateStruct();
      let instance = canvasStruct.initializeCanvas(10, 400, 400);
      await instance;
      if (isMounted == false) {
        setPoints(canvasStruct.returnPointsX());
        setOrder(canvasStruct.returnOperation())
      }
      isMounted = true;

      return () => {
        cleanup();
      }
    };

    getPoint();

  }, [])
  React.useEffect(() => {
    console.log("S" + parseOrder(order)[0])
  })
  return (
    <div className="App" ref={canvasRef}>
      <div id="canvas" key={"canvas"}>
        {
          points.map((point, index) => (
            <div
              ref={ref => {
                pointerMap.set(`${parseStringToArray(points, 10)[index][0]}x${parseStringToArray(points, 10)[index][1]}y`, ref)
              }}
              className={`${pointState}`}
              id={`${parseStringToArray(points, 10)[index][0]}x${parseStringToArray(points, 10)[index][1]}y`}
              key={`${parseStringToArray(points, 10)[index][0]}x${parseStringToArray(points, 10)[index][1]}y`} style={{
                position: "absolute",
                left: `${parseStringToArray(points, 10)[index][0]}px`,
                top: `${400 - parseStringToArray(points, 10)[index][1]}px`
              }}>{

              }</div>
          ))
        }
        <div style={
          {
            position: "relative",
            top: "450px",
          }
        }>
          {order}
          <div>
            {
              parseOrder(order)
            }
          </div>
          <div>
            <button id="animate-button" onClick={() => scanPoints(order)}>
              Animate this bitch!
            </button>
          </div>
        </div>
      </div>
    </div >

  );
}
function scanPoints(param) {
  let orderOfOperation = parseOrder(param);
  let element = 0;
  let index = 1;
  for (let iter = 0; iter < orderOfOperation.length; iter++) {
    setTimeout(function () {
      let element = orderOfOperation[iter]
      let firstLetter = element[0][0][0]
      switch (firstLetter) {
        case ("n"):
          pointerMap.get(element[1]).setAttribute("class", "colored-point")

          pointerMap.get(element[2]).setAttribute("class", "colored-point")
          break;
        case ("d"):
          break
        case ("l"):
          break
      }
    }, iter * 900)

    console.log(pointerMap.get(orderOfOperation[0][0]))
  }
} 
  function parseStringToArray(inputString, elements) {
    let containerArray = [];
    let firstParantheses = 1;

    let i = 0;
    for (i = 0; i < elements; i++) {
      let arrayCell = [];
      let cellX = []
      let cellY = []
      while (inputString[i][firstParantheses] != ',') {
        cellX += inputString[i][firstParantheses];
        firstParantheses++;

      }
      firstParantheses++;
      while (inputString[i][firstParantheses] != ')') {
        cellY += inputString[i][firstParantheses];
        firstParantheses++;
      }
      if (cellX[0] != undefined) {
        arrayCell[0] = cellX;
        arrayCell[1] = cellY;
        if (arrayCell[0] != []) {
          containerArray.push(arrayCell);
        }
      }
      cellX = []
      cellY = []
      firstParantheses = 1;

    }
    return containerArray
  }

  function parseOrder(order) {
    let element = 0;
    let cellX = [];
    let cellY = [];
    let keyOne = "";
    let keyTwo = "";
    //Note: According to our format, points start after  chars, e.g
    //n: (x,y) has 3 chars between x and n, so i will start late.
    let i = 4;
    let newOrder = [];
    let cellAll = [];
    let operation = [[], [], []]
    for (element of order) {
      switch (element[0]) {
        case ("n"):
          operation = [[], [], []]
          cellX = [];
          cellY = [];
          keyOne = "";
          keyTwo = "";
          //Note: According to our format, points start after  chars, e.g
          //n: (x,y) has 3 chars between x and n, so i will start late.

          operation[0] = "n"

          i = 4;
          while (element[i] != "," && element[i] != "(") {
            cellX += element[i]
            i++;
          }
          i++;
          while (element[i] != "," && element[i] != ")") {
            cellY += element[i]
            i++;
          }
          keyOne = `${cellX}x${cellY.replace(" ", "")}y`

          cellX = [];
          cellY = [];
          operation[1] = (keyOne)
          i++;
          i++;
          i++;
          i++;
          while (element[i] != ",") {
            cellX += element[i]
            i++;
          }
          i++;
          while (element[i] != "," && element[i] != ")" && element[i] != "(") {
            cellY += element[i]
            i++;
          }
          keyTwo = `${cellX}x${cellY.replace(" ", "")}y`
          operation[2] = (keyTwo)

          cellAll.push(operation)
          break;
        case ("d"):

          console.log(cellAll)

          break;
        case ("S"):
          break;
      }
    }
    return cellAll
  }
  function timeout(delay) {
    return
  }
//Idea: Loop through items, each item is one operation,
//match / switch case against first letters