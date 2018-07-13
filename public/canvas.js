/**
 * @fileOverview public/canvas.js
 * Functionality that draws on the canvas and storage of points
 */

// Array of arrays with points for a shape
const shapeLibrary = [];
let canvas = undefined;
let ctx = undefined;

// set canvas and add listeners once content has loaded
document.addEventListener("DOMContentLoaded", function(){
    setTimeout(function(){
        // set canvas size to full screen
        canvas = document.getElementById("canvas");
        canvas.height = document.documentElement.clientHeight;
        canvas.width = document.documentElement.clientWidth;

        // setting draw styles
        ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 20;

        initCanvas();
        console.log("--xx--xx--xx--");
    }, 100);
}, false );

// initCanvas adds listeners and drawing functionality
const initCanvas = function(){
    let clicked = false; // {Boolean} tracking whether click has started
    let shape = []; // collection of points for a single shape

    // on mouse down start drawing a shape
    let start = function(e) {
        clicked = true;
        let x = e.clientX;
        let y = e.clientY;
        moveTo(x, y, ctx);
        shape.push([x, y]); // add point to shape
    };

    // tracking mouse move while mouse down for path
    let move = function(e) {
        if(clicked){
            let x = e.clientX;
            let y = e.clientY;
            lineTo(x, y, ctx);
            shape.push([x, y]);
        }
    };

    // end shape once mouse up and clear shape
    let stop = function() {
        // close shape
        lineTo(shape[0][0], shape[0][1], ctx);
        shape.push([shape[0][0], shape[0][1]]);

        // end shape drawing
        clicked = false;
        shapeLibrary.push(shape);

        sendShape(shape);
        console.log(shape);
        shape = [];
    };

    // execute functions on event execution
    // pointer functions for touch events; mouse for mouse
    canvas.addEventListener("pointerdown", start, false);
    canvas.addEventListener("pointermove", move, false);
    document.addEventListener("pointerup", stop, false);
    canvas.addEventListener("mousedown", start, false);
    canvas.addEventListener("mousemove", move, false);
    document.addEventListener("mouseup", stop, false);
};

// draws on canvas with canvas functions
function moveTo(x, y, ctx){
    ctx.beginPath();
    ctx.moveTo(x,y);
}

function lineTo(x,y, ctx){
    ctx.lineTo(x,y);
    ctx.stroke();
}