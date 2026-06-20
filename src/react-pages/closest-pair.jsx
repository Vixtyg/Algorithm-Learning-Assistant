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
  const refArray = useRef([]);
  const canvasRef = useRef(null);
  const nav = useNavigate();
  const navigate = () => {
    nav('/closestpair')
  }

  const [pointState, setPointState] = useState("point");
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [lineState, setLineState] = useState("line");
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
        //cant passs order as argument of parselines due to re-render
        setLines(parseLines(canvasStruct.returnOperation()))
      }

      isMounted = true;

      return () => {
        cleanup();
      }
    };

    getPoint();

  }, [])
  React.useEffect(() => {
    console.log(lines)
    console.log("S" + parseOrder(order)[0])
  })
  return (
    <div className="App" ref={canvasRef}>
      <div id="canvas" key={"canvas"}>
        <div>
          {
            points.map((point, index) => (
              <div
                ref={ref => {
                  pointerMap.set(`${stringToPointsAndLines(points, 10)[0][index][0]}x${stringToPointsAndLines(points, 10)[0][index][1]}y`, ref)
                }}
                className={`${pointState}`}
                id={`${stringToPointsAndLines(points, 10)[0][index][0]}x${stringToPointsAndLines(points, 10)[0][index][1]}y`}
                key={`${stringToPointsAndLines(points, 10)[0][index][0]}x${stringToPointsAndLines(points, 10)[0][index][1]}y`}
                style={{
                  position: "absolute",
                  left: `${stringToPointsAndLines(points, 10)[0][index][0]}px`,
                  top: `${400 - stringToPointsAndLines(points, 10)[0][index][1]}px`
                }}>
                <div id="point-text" style={{
                  position: "relative",
                  left: `${10}px`,
                  top: `${10}px`
                }}>
                  {
                    point
                  }
                </div>

              </div>
            ))

          }

        </div>
        {
          lines.map((line, index) => (
            <div className={`line-hide`} id={`${line}x`}
              ref={ref => {
                pointerMap.set(`${line}x`, ref)
              }}
              style={{
                position: "absolute",
                height: `400px`,
                left: `${line}px`,
              }}>
              { }
            </div>
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
  let delay = 1;
  for (let iter = 0; iter < orderOfOperation.length; iter++) {
    setTimeout(function () {
      let element = orderOfOperation[iter]
      let firstLetter = element[0][0][0]

      switch (firstLetter) {
        case ("n"):
          pointerMap.get(element[1]).setAttribute("class", "colored-point");
          pointerMap.get(element[2]).setAttribute("class", "colored-point");
          delay += 1;
          break;
        case ("N"):
          pointerMap.get(element[1]).setAttribute("class", "colored-point");
          pointerMap.get(element[2]).setAttribute("class", "colored-point");
          pointerMap.get(element[3]).setAttribute("class", "colored-point");
          delay += 1;
          break;
        case ("d"):
          break
        case ("l"):
          pointerMap.get(element[1]).setAttribute("class", "line-show");
          break
      }
    }, iter * 900)

    console.log(pointerMap.get(orderOfOperation[0][0]))
  }
}
function stringToPointsAndLines(inputString, elements, order) {
  let containerArray = [];
  let lineArray = [];
  let firstParantheses = 1;
  let i = 0;

  for (i = 0; i < elements; i++) {
    let arrayCell = [];
    let cellX = []
    let cellY = []

    if (i > inputString.length - 1) {
      break
    }
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
  return [containerArray, stringToLines(order)]
}
function stringToLines(order) {
  return null;
}
//This function is just for parsin a string into  an array, so that we can access the array elements easily
function parseOrder(order) {
  let element = 0;
  let cellX = [];
  let cellY = [];
  let keyOne = "";
  let keyTwo = "";
  let keyThree = "";
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
      case ("N"):
        operation = [[], [], [], []]
        cellX = [];
        cellY = [];
        keyOne = "";
        keyTwo = "";
        keyThree = "";
        //Note: According to our format, points start after  chars, e.g
        //n: (x,y) has 3 chars between x and n, so i will start late.

        operation[0] = "N"

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

        cellX = [];
        cellY = [];
        operation[2] = (keyTwo)

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

        keyThree = `${cellX}x${cellY.replace(" ", "")}y`
        operation[3] = keyThree;
        cellAll.push(operation)
        break;
      case ("d"):

        console.log(cellAll)

        break;
      case ("l"):
        operation = [[], []]
        cellX = [];
        keyOne = "";
        //Note: According to our format, points start after  chars, e.g
        //n: (x,y) has 3 chars between x and n, so i will start late.

        operation[0] = "l"

        i = 4;
        while (element[i] != "," && element[i] != ")") {
          cellX += element[i]
          i++;
        }
        keyOne = `${cellX}x`
        operation[1] = keyOne;

        cellAll.push(operation)
        break;
    }
  }
  return cellAll
}
function parseLines(order) {
  let element = 0;
  let cellX = [];
  let cellY = [];
  let keyOne = "";
  let keyTwo = "";
  let keyThree = "";
  //Note: According to our format, points start after  chars, e.g
  //n: (x,y) has 3 chars between x and n, so i will start late.
  let i = 4;
  let newOrder = [];
  let cellAll = [];
  let operation = []
  for (element of order) {
    switch (element[0]) {
      case ("l"):
        operation = []
        cellX = [];
        keyOne = "";
        //Note: According to our format, points start after  chars, e.g
        //n: (x,y) has 3 chars between x and n, so i will start late.


        i = 4;
        while (element[i] != "," && element[i] != ")") {
          cellX += element[i]
          i++;
        }
        keyOne = `${cellX}`
        cellAll.push(cellX);
    }
  }
  return cellAll
}
function timeout(delay) {
  return
}
//Idea: Loop through items, each item is one operation,
//match / switch case against first letters

//canvasref.current gives error. Careful