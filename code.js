var rows = 24;
var cols = 24;

var playing = false;

// initialize
function initialize() {
    createTable();
    setupControlButtons();
}

// lay out the board
function createTable() {
    var gridContainer = document.getElementById("gridContainer");
    if (!gridContainer) {
        // throw error
        console.error("Problem: no div for the grid table!");
    }
    var table = document.createElement("table");

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    var classes = this.getAttribute("class");
    if (classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
    } else {
        this.setAttribute("class", "live");
    }
}

function setupControlButtons() {
    // button to start
    var startButton = document.getElementById("start");
    startButton.onclick = startButtonHandler;

    // button to clear
    var clearButton = document.getElementById("clear");
    clearButton.onclick = clearButtonHandler;
}

function startButtonHandler() {
    if (playing === false) {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "pause";
        play();
    } else {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "continue";
    }
}

function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    playing = false;
    var startButton = document.getElementById("start");
    startButton.innerHTML = "start";
}

// run the life game
function play() {
    console.log("Play the game");
}

// start everything
window.onload = initialize;