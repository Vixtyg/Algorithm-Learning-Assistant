import '../App.css';
import LetterGlitch from '../LightPillar';
import React, { useState, useEffect } from "react";
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const loadWasm = async () => {
  const wasm = await import("../wasm/closest_pair.js");
  await wasm.default();
  return wasm;
}

export function Home() {
  let isMounted=false;
  const nav = useNavigate();
  const navigate = () => {
    nav('/closestpair');
  }
  const navigateToHeap = () => {
    nav('/heaps');
  }
  const [points, setPoints] = useState([]);
  const [order, setOrder] = useState([]);
  React.useEffect(() => {
    const section = document.querySelector("#overview");
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        entries[0].target.classList.add("onDisplay")
      }
    }, {});
    observer.observe(section);
    let eggRedirect = document.querySelector("#egg-card");
    eggRedirect.addEventListener("click", (e) => {
      window.location.href = "two_egg_tower_problem/index.html"
    });
  }, [])

  return (
    <div className="App">
      <div id="navbar">
        <div id="navbar-wrap">
          <svg id="logo" width="26" height="45" viewBox="0 0 26 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.3975 30L6.7015 7.6H10.5415L16.9095 30H14.1895L9.1335 11.632L8.8775 9.936C8.85617 9.808 8.7815 9.744 8.6535 9.744C8.54683 9.744 8.48283 9.808 8.4615 9.936L8.1735 11.632L3.1175 30H0.3975ZM3.8535 24.016L4.5575 21.648H12.7495L13.4535 24.016H3.8535ZM3.0535 9.936V7.6H7.5655V9.936H3.0535Z" fill="white" />
            <path d="M13.7342 33V16.2H15.7262V31.128H21.7022V33H13.7342Z" fill="white" />
          </svg>
          <div id="elements-wrapper">
            <div id="elements">
              <div id="nav-about">
                About
              </div>
              <div id="nav-contact">
                Contact Me!
              </div>
              <div id="nav-overview">
                Overview
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="hero">
        <div id="pillar" style={{ width: '100vw', height: '100vh', position: 'absolute' }}>
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth
            speed={10}
            colors={["#2b4539", "#61dca3", "#61b3dc"]}
            showCenterVignette
            showOuterVignette={false}
          />
        </div>
        <div id="header-container">
          <div id="title">
            Welcome to your Algorithm
            Learning Assistant!
          </div>
          <div id="logo-underbox">
            Completely open-source, and free!
          </div>
          <button id="get-started-button">
            Get Started!
          </button>
        </div>
      </div>
      <div id="overview">
        <div id="overview-title">
          Here are some of our interactive sandboxes!
        </div>
        <div id="card-deck">
          <div id="egg-card" class="card">

            <div class="card-contents">
              <div class="card-text">

                <svg id="house-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                  <path d="M0 0h16v16H0z" fill="none" />
                  <path fill="#d8ddf5" d="m7.83 1.03l-5.5 2c-.528.189-.391.971.17.97H3v9.5c0 .277.223.5.5.5H9v-1.5c0-.277.223-.5.5-.5h1c.277 0 .5.223.5.5V14h1.5c.277 0 .5-.223.5-.5V4h.5c.561.001.698-.781.17-.97l-5.5-2a.5.5 0 0 0-.34 0M5.475 4H6.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1m4 0H10.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1m-4 2H6.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1m4 0H10.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1m-4 2H6.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1m4 0H10.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1m-4 2H6.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1m4 0H10.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1m-4 2H6.5a.499.499 0 1 1 0 1h-1a.5.5 0 0 1-.025-1" />
                </svg>
                <div class="card-title">
                  The two egg problem

                  <div class="card-desc">
                    There is a house with n-stories. You are
                    given 2 eggs.
                    <br></br>
                    <br></br>
                    What is the most efficient way of
                    finding the floor after which the
                    eggs will break?
                    <br></br>
                    <br></br>
                  </div>
                </div>
              </div>
              <span class="card-difficulty-container">
                <span class="card-difficulty-easy">
                  Easy
                </span>
              </span>
            </div>
          </div>
          <div class="card" onClick={navigate}>
            <div class="card-contents">
              <div class="card-text">
                <svg id="house-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="#d8ddf5" d="M12 2C6.58 2 2 6.58 2 12s4.58 10 10 10s10-4.58 10-10S17.42 2 12 2m0 18c-4.34 0-8-3.66-8-8s3.66-8 8-8c1.82 0 3.51.65 4.87 1.71l-1.41 1.41A5.9 5.9 0 0 0 12 6c-1.58 0-3.09.63-4.23 1.77S6 10.41 6 12s.63 3.09 1.77 4.23S10.41 18 12 18s3.09-.63 4.23-1.77l-1.41-1.41c-1.53 1.53-4.1 1.53-5.63 0c-.76-.76-1.18-1.76-1.18-2.82s.42-2.05 1.18-2.82c1.28-1.28 3.3-1.47 4.82-.6l-1.49 1.49c-.16-.05-.33-.08-.51-.08c-1.08 0-2 .92-2 2s.92 2 2 2s2-.92 2-2c0-.18-.03-.34-.08-.51l4.36-4.36C19.36 8.48 20 10.17 20 11.99c0 4.34-3.66 8-8 8Z" />
                </svg>
                <div class="card-title">
                  The closest pair problem
                  <div class="card-desc">
                    Given n points in a coordinate system,
                    what is the most efficient way of finding
                    two closest points?
                    <br></br>
                    <br></br>
                  </div>
                </div>
              </div>
              <span class="card-difficulty-container">
                <span class="card-difficulty-intermediate">
                  Intermediate
                </span>
              </span>
            </div>
          </div>
          <div class="card" onClick={navigateToHeap}>
            <div class="card-contents">
              <div class="card-text">
                <svg id="house-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="#d8ddf5" d="M14 1a3 3 0 0 1 2.348 4.868l2 3.203Q18.665 9 19 9a3 3 0 1 1-2.347 1.132l-2-3.203a3 3 0 0 1-1.304 0l-2.001 3.203c.408.513.652 1.162.652 1.868s-.244 1.356-.653 1.868l2.002 3.203Q13.664 17 14 17a3 3 0 1 1-2.347 1.132L9.65 14.929a3 3 0 0 1-1.302 0l-2.002 3.203a3 3 0 1 1-1.696-1.06l2.002-3.204A3 3 0 0 1 9.65 9.07l2.002-3.202A3 3 0 0 1 14 1" />
                </svg>
                <div class="card-title">
                  Heaps, Binary trees, and AVLs!
                  <div class="card-desc">
                    Want to learn how heaps work? How heaps
                    are constructed?
                    <br></br>
                    <br></br>
                    What about Heapify? When should you use
                    Sift-up or Sift-down?
                    <br></br>
                    <br></br>
                  </div>
                </div>
              </div>
              <span class="card-difficulty-container">
                <span class="card-difficulty-easy">
                  Easy
                </span>
              </span>
            </div>
          </div>
          <div class="card">
            <div class="card-contents">
              <div class="card-text">
                <svg id="house-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="none" stroke="#d8ddf5" strokeWidth="2" d="M15 5h5v10c0 1.886 0 2.828-.586 3.414S17.886 19 16 19h-1M9 5H6a2 2 0 0 0-2 2v12h5" />
                </svg>

                <div class="card-title">
                  Mergesort and Quicksort!
                  <div class="card-desc">
                    Want to learn how sorting algorithms work,
                    beyond watching some lines get sorted
                    on a screen?
                    <br></br>
                    <br></br>
                    How do these algorithms work? Why are
                    they so fast? What exactly makes them so
                    fast?
                    <br></br>
                    <br></br>
                  </div>
                </div>
              </div>
              <span class="card-difficulty-container">
                <span class="card-difficulty-intermediate">
                  Intermediate
                </span>
              </span>
            </div>
          </div>
        </div>
        <div id="card-bottom">
          <div class="card-contents">
            <div class="card-text">
              <svg id="house-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="#d8ddf5" d="m19.85 8.14l-.46-2.32c-.33-1.63-1.77-2.81-3.43-2.81s-3 1.09-3.39 2.65L9.52 17.87c-.17.67-.76 1.14-1.45 1.14S6.74 18.5 6.6 17.8l-.41-2.03a3.01 3.01 0 0 0 1.83-2.76c0-1.65-1.35-3-3-3s-3 1.35-3 3c0 1.36.91 2.5 2.15 2.86l.46 2.32C4.96 19.82 6.4 21 8.06 21s3-1.09 3.39-2.65L14.5 6.14c.17-.67.76-1.14 1.45-1.14s1.33.51 1.47 1.21l.41 2.03A3.01 3.01 0 0 0 16 11c0 1.65 1.35 3 3 3s3-1.35 3-3c0-1.36-.91-2.5-2.15-2.86M5 12c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m14 0c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1" />
              </svg>
              <div class="card-title">
                Dijkstra (with priority queue)
                <div class="card-desc">
                  Given a map of points, and roads of different lengths, what is the fastest path? What is the fastest way of finding it?
                  <br></br>
                  <br></br>
                </div>
              </div>
            </div>
            <span class="card-difficulty-container">
              <span class="card-difficulty-hard">
                Hard
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

  );
}
function loaded_element() {
  console.log()
}

