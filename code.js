var rows = 50;
var cols = 128;

var playing = false;

var currentStateArray;
var nextStateArray;

var timer;
var reproductionTime = 1000;

// initialize
function initialize() {
    createTable();
    setupControlButtons();

    currentStateArray = createStateArray();
    nextStateArray = createStateArray();

    resetStateArrays();
}

function createStateArray() {
	var stateArray = new Array(rows);
	for (var i = 0; i < rows; i++) {
		stateArray[i] = new Array(cols);
	}
	return stateArray;
}

function resetStateArrays() {
	for (var row = 0; row < rows; row++) {
		for (var cell = 0; cell < cols; cell++) {
			currentStateArray[row][cell] = 0;
			nextStateArray[row][cell] = 0;
		}
	}
}


function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            currentStateArray[i][j] = nextStateArray[i][j];
            nextStateArray[i][j] = 0;
        }
    }
}

function computeNextGeneration() {
	for (var row = 0; row < rows; row++) {
		for (var col = 0; col < cols; col++) {
			var numberOfNeighbors = getNumberOfNeighbors(row, col);
			nextStateArray[row][col] = getNextStateForCell(currentStateArray[row][col], numberOfNeighbors);
		}
	}

	// copy nextGrid to grid, and reset nextGrid
	// copyAndResetGrid();
	var temp = currentStateArray;
	currentStateArray = nextStateArray;
	nextStateArray = temp;
	// copy all 1 values to "live" in the table
	updateView();
	timer = setTimeout(play, reproductionTime);
}

function getNextStateForCell(currentState, numberOfNeighbors) {
	if (currentState === 1) {
		// currently live cell
		if (numberOfNeighbors < 2 || numberOfNeighbors > 3) {
			// this cell dies
			return 0;
		} else {
			// this cell has either 2 or 3 live neighbors, so it survives
			return 1;
		}
	} else {
		// currently dead cell
		if (numberOfNeighbors === 3) {
			// this cell revives, as if by reproduction
			return 1;
		} else {
			// the dead cell remains as is
			return 0;
		}
	}
}

function getNumberOfNeighbors(row, col) {
	if (isCellOnBorder(row, col)) {
		return getNumberOfNeighborsForBorderCell(row, col);
	} else {
		return getNumberOfNeighborsForInteriorCell(row, col);
	}
}

function getNumberOfNeighborsForInteriorCell(row, col) {
	return (currentStateArray[row][col - 1] 
		+ currentStateArray[row - 1][col - 1] + currentStateArray[row - 1][col] + currentStateArray[row - 1][col + 1] 
		+ currentStateArray[row][col + 1]
		+ currentStateArray[row + 1][col - 1] + currentStateArray[row + 1][col] + currentStateArray[row + 1][col + 1]);
}

function isCellOnBorder(row, col) {
	 return (row === 0 || row === rows - 1 || col === 0 || col === cols - 1);
}

function getNumberOfNeighborsForBorderCell(row, col) {
	if (isCornerCell(row, col)) {
		return getCornerCellNumberOfNeighbors(row, col);
	} else {
		return getEdgeCellNumberOfNeighbors(row, col);
	}
}

function isCornerCell(row, col) {
	return ((row === 0 && col === 0) || (row === 0 && col === cols - 1) || (row === rows - 1 && col === 0) || (row === rows - 1 && col === cols - 1));
}

function getCornerCellNumberOfNeighbors(row, col) {
	if (row === 0 && col === 0) {
		// top left corner
		return (currentStateArray[row][col + 1] + currentStateArray[row + 1][col] + currentStateArray[row + 1][col + 1]);
	} else if (row === 0 && col === cols - 1) {
		// top right corner
		return currentStateArray[row][col - 1] + currentStateArray[row + 1][col] + currentStateArray[row + 1][col - 1];
	} else if (row === rows - 1 && col === 0) {
		// bottom left corner
		return (currentStateArray[row][col + 1] + currentStateArray[row - 1][col] + currentStateArray[row - 1][col + 1]);
	} else if (row === rows - 1 && col === cols - 1) {
		// bottom right corner
		return (currentStateArray[row][col - 1] + currentStateArray[row - 1][col] + currentStateArray[row - 1][col - 1]);
	}
}

function getEdgeCellNumberOfNeighbors(row, col) {
	if (row === 0) {
		// north border
		return (currentStateArray[row][col - 1] + currentStateArray[row + 1][col - 1] + currentStateArray[row + 1][col] + currentStateArray[row + 1][col + 1] + currentStateArray[row][col + 1]);
	} else if (row === rows - 1) {
		// south border
		return (currentStateArray[row][col - 1] + currentStateArray[row - 1][col - 1] + currentStateArray[row - 1][col] + currentStateArray[row - 1][col + 1] + currentStateArray[row][col + 1]);
	} else if (col === 0) {
		// west border
		return (currentStateArray[row - 1][col] + currentStateArray[row - 1][col + 1] + currentStateArray[row][col + 1] + currentStateArray[row + 1][col + 1] + currentStateArray[row + 1][col]);
	} else if (col === cols - 1) {
		// east border
		return (currentStateArray[row - 1][col] + currentStateArray[row - 1][col - 1] + currentStateArray[row][col - 1] + currentStateArray[row + 1][col - 1] + currentStateArray[row + 1][col]);
	}
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
    var rowcol = this.id.split("_");
    var row = rowcol[0];
    var col = rowcol[1];

    if (classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        currentStateArray[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        currentStateArray[row][col] = 1;
    }
}

function updateView() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (currentStateArray[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function setupControlButtons() {
    // button to start
    var startButton = document.getElementById("start");
    startButton.onclick = startButtonHandler;

    // button to clear
    var clearButton = document.getElementById("clear");
    clearButton.onclick = clearButtonHandler;

    // button for random cells
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function startButtonHandler() {
    if (playing === false) {
        console.log("Continue the game");
        document.getElementById("random").disabled = true;
        playing = true;
        this.innerHTML = "pause";
        play();
    } else {
    	clearTimeout(timer);
        console.log("Pause the game");
        document.getElementById("random").disabled = false;
        playing = false;
        this.innerHTML = "continue";
    }
}

function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    if (playing) {
    	playing = false;
    	clearTimeout(timer);
    }

    var startButton = document.getElementById("start");
    startButton.innerHTML = "start";

    resetStateArrays();
    updateView();

    document.getElementById("random").disabled = false;
}

function randomButtonHandler() {
	clearButtonHandler();

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			nextState = Math.round(Math.random());
			currentStateArray[i][j] = nextState;
		}
	}

	updateView();
}

// run the life game
function play() {
    console.log("Play the game");
    computeNextGeneration();
    
}

// start everything
window.onload = initialize;