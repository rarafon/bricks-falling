var map = [];

var controller = {
	timerID: 0, // ID of the interval funct being run. Cancel when game ends.
	timerStatus: false,
	startTimer() {
		// setInterval works in the global context, so a function wrapping the actual function is needed in order to
		// correctly call on the method and to have this set appropriately.
		function timerFunc() {
			controller.brickIterator()
		}
		this.timerID = setInterval(timerFunc , 50);
		this.timerStatus = true;
	},

	stopTimer() {
		clearInterval(this.timerID);
		this.timerStatus = false;
	},
	brickLoc: [],
	clicked(y, x) {
		this.makeBrick(y, x);
		if (this.timerStatus === false) {
			this.startTimer();
		}
	},

	makeBrick(y, x) {
		if (map[0][x] === 0) {
			var ele = this.getCell(0, x);

			map[0][x] = 1;
			ele.style.backgroundColor = "red";
			this.brickLoc.push([0, x]);
		}
		
	},

	changeFallingBrick(y, x, value) { 
	  // Changes values in Map and class of bricks that'll fall one space down (i.e. bricks still falling = 1)
	  // returns an array of the new coordinates (for replacing old ones in brickLoc);

		var y1 = y + 1;

		var oldValue = map[y1][x];

		if (oldValue === 0) {
			var topCell = this.getCell(y, x);
			var botCell = this.getCell(y1, x);

			oldColor = botCell.style.backgroundColor;

			if (value === undefined) {
				map[y1][x] = 1;
			} else {
				map[y1][x] = value;
			}

			map[y][x] = oldValue;
			botCell.style.backgroundColor = topCell.style.backgroundColor;
			topCell.style.backgroundColor = oldColor;

			return [y1, x];
		} else {
			throw new Error("changeFallingBrick: error: " + y + " " + x + " " + value);
		}
	},

	brickIterator() {
		var loc = null, y = null, x = null;
		if (this.brickLoc.length <= 0) {
			this.stopTimer();
		} else {
			for ( var i = 0; i < this.brickLoc.length; i++) {
				loc = this.brickLoc;
				y = loc[i][0];
				x = loc[i][1];


				if (this.reachEnd(y, x)) {
					map[y][x] = 2;
					deleteFromArray(loc, i, 1);
				} else {
					loc[i] = this.changeFallingBrick(y, x, 1);
				}

			}
		}

	},

	reachEnd(y, x) { // if the brick has reached the bottom or another brick
		if (this.reachBottom(y)) { // reached bottom
			return true;
		} else if (map[y+1][x] === 2) { // brick below it has reached bottom or is on top of another brick reached bottom, etc
			return true;
		} else {
			return false;
		}
	},

	reachBottom(y) {
		if (y === map.length - 1) {
			return true;
		} else {
			return false;
		}
	},

	getCell(y, x) {
		return document.getElementById(y + "_" + x);
	}
};

function init() {
	var cols = Math.floor((window.innerWidth / 9) );
	var rows = Math.floor(window.innerHeight / 9 - 2);

	makeTable(rows, cols);

	function clicky(event) {
		var target = event.target;

		var str = /(\d*)_(\d*)/.exec(target.id);
		if (str) {
			var y = Number(str[1]); 
			var x = Number(str[2]);

			controller.clicked(y, x);
		}
	}

	table.addEventListener("click", clicky, false);

}

window.onload = init;