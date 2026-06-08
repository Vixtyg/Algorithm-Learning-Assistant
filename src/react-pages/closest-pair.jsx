import '../App.css';
import React, { useState, useEffect } from "react";

const loadWasm = async () =>{
  const wasm = await import("../wasm/closest_pair.js");
  await wasm.default();
  return wasm;
}


export function ClosestPair() {
  const [points, setPoints] = useState([]);
  React.useEffect(() => {
    const init = async () => {
    try {
      const wasm = await loadWasm();
      const results = wasm.returnClosestPoints(); // Fetch the array
      setPoints(results); // Update state with the array
    } catch (e) {
      console.error("Failed to load WASM:", e);
    }
  };

  init();
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
        {points}
        Hello World
    </div>

  );
}
function loaded_element() {
  console.log()
}