const canvasHeight = 500;
const canvasWidth = 500;
var cols = 15;
var rows = 15;
var grid = new Array(cols);
var path = [];
var noSolution = false;
var population = 2;

var unvisited = [];
var visited = [];

var start;
var end;

function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < (population / 10)) {
        this.wall = true;
    }

    this.show = function(col) {
        fill(col);
        if (this.wall) {
            fill(0);
        }
        stroke(0);
        rect(this.x * (canvasWidth / cols), this.y * (canvasHeight / rows), canvasWidth / cols, canvasHeight / rows);
    }

    this.addNeighbours = function(grid) {
        if (i < cols-1) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (j < rows-1) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbours.push(grid[i][j - 1]);
        }
    }
}

function removeFromArray(arr, el) {
    for (var i = arr.length-1; i>= 0; i--) {
        if (arr[i] == el) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {

    // Euclidian
    // var d = dist(a.i, a.j, b.i, b.j);

    var d = abs(a.i-b.i) + abs(a.j -b.j);
    return d;
}

function setup() {
    createCanvas(canvasHeight, canvasWidth);
    
    // 2D array

    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols-1][rows-1];
    start.wall = false;
    end.wall = false;

    unvisited.push(start);
}

function draw() {
    background(255);

    if (unvisited.length > 0) {
        var lowestIndex = 0;
        for (var i = 0; i < unvisited.length; i++) {
            if (unvisited[i].f < unvisited[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        var current = unvisited[lowestIndex];

        if (current == end) {
            noLoop();
            console.log("Found solution!");
        } else {

        removeFromArray(unvisited, current);
        visited.push(current);

        var neighbours = current.neighbours;

        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];

            if (!visited.includes(neighbour) && !neighbour.wall) {
                var tempG = current.g + 1;
            
                if (unvisited.includes(neighbour)) {
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG;
                    }
                } else {
                    neighbour.g = tempG;
                    unvisited.push(neighbour);
                }

                neighbour.h = heuristic(neighbour, end);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.previous = current;
            }
        }
    }

    } else {
        // no solution, end program
        noSolution = true;
        noLoop();
        console.log("No solution");
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (var i = 0; i < visited.length; i++) {
        visited[i].show(color(255, 0, 0));
    }

    for (var i = 0; i < unvisited.length; i++) {
        unvisited[i].show(color(0, 255, 0));
    }

    path = [];
    var temp = current;
    path.push(temp);
    if (!noSolution) {
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
    

        for (var i = 0; i < path.length; i ++) {
            path[i].show(color(0, 0, 255));
        }
    }

    if (mouseIsPressed && (mouseX)) {
        
    }
}