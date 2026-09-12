let chosenFloors = [];
let coloredDivs = [];
let dropCounter = 0;
let amountOfFloors = 49;

const house = document.querySelector("#house-display");
const dropCounterDiv = document.querySelector("#drop-counter");
const restart = document.querySelector("#restart-icon");
const restartFloors = document.querySelector("#restart-button");
const inputBar = document.querySelector("input");
const hints = document.querySelector("#hint1");
const resultDiv = document.querySelector("#result-div");
let success = false;
let inputBarError = document.querySelector("#input-bar-error");

function createHouse(floors) {
    deadlyFloor = Math.ceil(Math.random() * floors);
    createFloors(floors, deadlyFloor, 0);
}
function floorIsSafe(floor, deadlyFloor) {
    return floor < deadlyFloor;
}
function createFloors(floors, deadlyFloor, droppedCount) {
    for (let i = 0; i < floors; i++) {
        var div = document.createElement("div");
        div.textContent = `${floors - i}`;
        div.setAttribute("id", "floor");
        div.onclick = function () {
            if (chosenFloors.includes(parseInt(this.textContent)) == false) {
                if (droppedCount < 2) {
                    if (floorIsSafe(this.textContent, deadlyFloor) == true) {
                        dropCounter++;
                        dropCounterDiv.textContent = `Drops: ${dropCounter}`;
                        this.setAttribute("id", "floor-chosen");
                        chosenFloors.push(parseInt(this.textContent));
                        coloredDivs.push(this);
                    } else {
                        dropCounter++
                        dropCounterDiv.textContent = `Drops: ${dropCounter}`
                        droppedCount += 1;
                        chosenFloors.push(parseInt(this.textContent));
                        coloredDivs.push(this);
                        this.setAttribute("id", "floor-chosen-deadly");
                    }
                }
                if (droppedCount >= 2) {
                    disabled = true;
                    document.querySelector("#floor-container").style.filter = "opacity(20%)";
                    let childernOfFloorContainer = document.querySelectorAll("#floor");
                    console.log(childernOfFloorContainer)
                    for (element of childernOfFloorContainer) {
                        element.removeAttribute("id", "floor");
                        element.setAttribute("id", "floor-static")
                    }
                    if (success == false) {
                        resultDiv.textContent = `Result: You have broken all the eggs! Try again!`
                    }
                }
                if (chosenFloors.includes(deadlyFloor)
                    && chosenFloors.includes(deadlyFloor - 1)) {
                    success = true;
                    resultDiv.textContent = `Result: You have found the deadly floor! The deadly floor is: ${deadlyFloor}`
                }
            }
        };
        document.querySelector("#floor-container").appendChild(div);
    }

}
function resetFloors() {
    success = false;
    document.querySelector("#floor-container").style.filter = "opacity(100%)";
    let childernOfFloorContainer = document.querySelectorAll("#floor");
    console.log(childernOfFloorContainer)
    for (element of childernOfFloorContainer) {
        element.remove()
    }
    childernOfFloorContainer = document.querySelectorAll("#floor-chosen");
    console.log(childernOfFloorContainer)
    for (element of childernOfFloorContainer) {
        element.remove()
    }
    childernOfFloorContainer = document.querySelectorAll("#floor-static");
    console.log(childernOfFloorContainer)
    for (element of childernOfFloorContainer) {
        element.remove()
    }
    childernOfFloorContainer = document.querySelectorAll("#floor-chosen-deadly");
    console.log(childernOfFloorContainer)
    for (element of childernOfFloorContainer) {
        element.remove()
    }
    resultDiv.textContent = `Result:`
    droppedCount = 0;
    dropCounter = 0;
    coloredDivs = [];
    chosenFloors = [];
    dropCounterDiv.textContent = `Drops:`
    createHouse(amountOfFloors);
}
restart.addEventListener("click", (e) => {
    resetFloors()
});
restartFloors.addEventListener("click", (e) => {
    e.preventDefault();
    amountOfFloors = inputBar.value;
    inputBarError.style.opacity = "0";
    resetFloors();
});
inputBar.addEventListener("input", (e) => {
    if (isNaN(e.key) == true) {
        e.preventDefault()
    }
    if (inputBar.value > 9999) {
        inputBarError.style.opacity = "1";
        inputBar.value = ""
    }

});
inputBar.addEventListener("keypress", (e) => {
    if (isNaN(e.key) == true) {
        e.preventDefault()
    }

})
createHouse(amountOfFloors);