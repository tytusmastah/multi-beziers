//copy from config to globals
var debugText =""; //text to display at timer.

var canvas;
var framesdiv;

//Objects: 
var method; 
var density=100;
var time=50; 
var resx=1024
var resy=800

var lines=[]; 
var points=[]; 
var bezierline=[];

var curClickedX; 
var curClickedY;

var draggedPoint = null;


function setup() {
    console.log("Setup");
    createCanvas(resx, resy);
    console.log("Canvas created");

    console.log("Finish setup");
}


//Main loooop
function draw() {
    if (false){
        clear();
    }else{
        background(0);
    }
    points.forEach((p)=>{
        drawPoint(p);
    })
    // lines.forEach((b)=>{
    //     drawDriverLine(b);
    // })
    if (points.length>1){
        recalculate();
    }
    drawBezier();
    time = Math.abs(Math.floor(millis()/100)%200-100);
    // console.log(time);
}

function addPoint(x, y){
    bezierline=[];
    points.push({x:x, y:y});
    recalculate();
}

function recalculate(){
    lines = [];
    var line1=Object.assign(points);
    // lines.push(line1);
    calculateLine(line1, 1);
    if (bezierline.length==0){
        calculateBezier();
    }
}

function calculateBezier(){
    bezierline=[];
    for (var i = 0; i<density; i++){
        calculatePoint(i, points);
    }
}

function calculatePoint(i, list){
    if (list.length<2){
        return;
    }
    // console.log("list lenght: ", list.length)
    var line = [];
    for (var j =0; j<list.length-1; j++){
        // console.log(j);
        var p1 = list[j];
        var p2 = list[j+1];
        var x = p1.x+(p2.x-p1.x)*i/density;
        var y = p1.y+(p2.y-p1.y)*i/density;
        if(list.length==2){
            bezierline.push({x:x, y:y})
            return; 
        }
        line.push({x:x, y:y});
    }
    calculatePoint(i, line);

}

function calculateLine(line, ratio){
    if (ratio<0.125){
        ratio =0.125;
    }
    drawDriverLine(line, ratio); //draw parent line
    //calculate child line and draw it. 
    if (line.length>2){
        var cline = [];
        for(var i = 0; i<line.length-1; i++){
            var p1 = line[i];
            var p2 = line[i+1];
            var x = p1.x+(p2.x-p1.x)*time/density;
            var y = p1.y+(p2.y-p1.y)*time/density;
            cline.push({x:x, y:y});
        }
        // lines.push(cline);
        calculateLine(cline, ratio*0.75)
    }
}

function drawPoint(p, ratio){
    if (!ratio){
        ratio=1;
    }
    // console.log("drawPoint");
    fill(0);
    stroke(255);
    strokeWeight(2);
    circle(p.x, p.y, 8*ratio);
}

function drawDriverLine(b, ratio){
    // console.log("drawDriverLine");
    strokeWeight(1);
    fill(1);
    drawPoint(b[0], ratio);
    for (var i =0; i<b.length-1; i++){
        var p1 = b[i];
        var p2 = b[i+1];
        stroke(255*ratio);
        line(p1.x, p1.y, p2.x, p2.y);
        drawPoint(p2, ratio);
    }
}

function drawBezier(){
    stroke(color("red"));
    strokeWeight(3);
    fill(1);
    var b = bezierline;
    for (var i =0; i<b.length-1; i++){
        var p1 = b[i];
        var p2 = b[i+1];
        line(p1.x, p1.y, p2.x, p2.y);
    }
    if (bezierline.length>0){
        stroke(color("red"));
        fill(0);
        strokeWeight(3);
        // console.log(b, time, b[time]);
        if (time==100){
            time=99;
        }
        circle(b[time].x, b[time].y, 8);
    }
}

function findPoint(x, y){
    for(var i=0; i<points.length; i++){
        var p = points[i];
        if (Math.abs(p.x - x)<8 && Math.abs(p.y-y)<8){
            return p;
        }
    }
}

//handle mouse dragging
function mouseDragged(event) {
    console.log("mouseDragged");
    if (!draggedPoint){
        var p = findPoint(event.clientX, event.clientY);
        if (p){
         draggedPoint=p;
        }else{
            return;
        }
    }
    draggedPoint.x = event.clientX; 
    draggedPoint.y = event.clientY; 
    bezierline = [];
    recalculate();
    

    // console.log(event);
    // if (time.curMouseX == 0) {
    //     time.curMouseX = event.clientX;
    // }
    // time.timeMove -= (event.clientX - time.curMouseX);
    // time.time = millis() * time.fast + time.timeMove;
    // time.curMouseX = event.clientX;
}

function mouseReleased(){
    console.log("mouseReleased");
    // time.curMouseX = 0;
    // draggedPoint=null;
}

function doubleClicked(){
    console.log("doubleClicked");
    points=[];
    lines=[];
    bezier=[];
    // time.curMouseX = 0; 
    // time.timeMove-=time.time;
}

function mouseClicked(event){
    console.log("mouseClicked: ", event.clientX, event.clientY);
    if (!draggedPoint){
        console.log("addPoint");
        addPoint(event.clientX, event.clientY);
    }else{
        draggedPoint = null;
    }
}