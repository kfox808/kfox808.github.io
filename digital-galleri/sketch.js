// Portrait builder: p5.js sketch
// Layers: a transparent paint layer (your brush strokes) under the line-art features.
// History: every paint stroke, feature change, and "Clear paint" can be undone and redone.

const W = 400, H = 400, MAX_UNDO = 50;

const PARTS = [
    { key: 'brow',  label: 'Brow', blank: [0],       fns: [drawbrows1, drawbrows2, drawbrows3, drawbrows4, drawbrows5] },
    { key: 'eye',   label: 'Eye',  blank: [5],       fns: [draweyes1, draweyes2, draweyes3, draweyes4, draweyes5, draweyes6] },
    { key: 'nose',  label: 'Nose', blank: [5],       fns: [drawnoses1, drawnoses2, drawnoses3, drawnoses4, drawnoses5, drawnoses6] },
    { key: 'mouth', label: 'Lip',  blank: [3, 4, 5], fns: [drawmouths1, drawmouths2, drawmouths3, drawmouths4, drawmouths5, drawmouths6] },
    { key: 'face',  label: 'Face', blank: [5],       fns: [drawfaces1, drawfaces2, drawfaces3, drawfaces4, drawfaces5, drawfaces6] }
];

const $ = (id) => document.getElementById(id);
let sel = {};
PARTS.forEach((p) => (sel[p.key] = 0));

let cnv, paintLayer;
let undoStack = [], redoStack = [];
let painting = false, last = null;

function setup() {
    pixelDensity(1);
    cnv = createCanvas(W, H);
    cnv.parent('canvas-holder');
    cnv.elt.setAttribute('aria-label', 'Portrait canvas. Draw with a mouse, finger, or pen.');
    angleMode(DEGREES);
    paintLayer = createGraphics(W, H);
    noLoop(); // only redraw when something changes

    bindControls();
    bindPointer();
    updateUI();
}

function draw() {
    background(255);
    image(paintLayer, 0, 0);
    // Line art always sits on top of the paint, and never inherits the brush fill.
    for (const p of PARTS) {
        push();
        noFill();
        stroke(0);
        strokeWeight(1);
        p.fns[sel[p.key]]();
        pop();
    }
}

/* ---------- History ---------- */
function snapshot() { return { sel: { ...sel }, paint: paintLayer.get() }; }

function restore(s) {
    sel = { ...s.sel };
    paintLayer.clear();
    paintLayer.image(s.paint, 0, 0, W, H);
}

function commit() { // call BEFORE a change so it can be undone
    undoStack.push(snapshot());
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack = [];
}

function undo() {
    if (!undoStack.length) return;
    redoStack.push(snapshot());
    restore(undoStack.pop());
    refresh();
}

function redo() {
    if (!redoStack.length) return;
    undoStack.push(snapshot());
    restore(redoStack.pop());
    refresh();
}

function refresh() { redraw(); updateUI(); }

/* ---------- UI ---------- */
function updateUI() {
    PARTS.forEach((p) => {
        const i = sel[p.key];
        document.querySelector(`[data-part="${p.key}"]`).textContent =
            `${p.label} ${i + 1}/${p.fns.length}` + (p.blank.includes(i) ? ' (none)' : '');
    });
    $('undo').disabled = !undoStack.length;
    $('redo').disabled = !redoStack.length;
}

function bindControls() {
    document.querySelectorAll('[data-part]').forEach((btn) =>
        btn.addEventListener('click', () => {
            const p = PARTS.find((x) => x.key === btn.dataset.part);
            commit();
            sel[p.key] = (sel[p.key] + 1) % p.fns.length;
            refresh();
        })
    );
    $('undo').addEventListener('click', undo);
    $('redo').addEventListener('click', redo);
    $('clear').addEventListener('click', () => { commit(); paintLayer.clear(); refresh(); });
    $('save').addEventListener('click', () => saveCanvas(cnv, 'my_art', 'png'));

    window.addEventListener('keydown', (e) => {
        if (!(e.ctrlKey || e.metaKey)) return;
        const k = e.key.toLowerCase();
        if (k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
        else if (k === 'y') { e.preventDefault(); redo(); }
    });
}

/* ---------- Painting (pointer events: mouse, touch and pen; works when the canvas is scaled) ---------- */
function canvasPos(e) {
    const r = cnv.elt.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
}

function stamp(a, b) {
    paintLayer.stroke($('brush-color').value);
    paintLayer.strokeWeight(Number($('brush-size').value));
    if (a.x === b.x && a.y === b.y) paintLayer.point(a.x, a.y);
    else paintLayer.line(a.x, a.y, b.x, b.y);
}

function bindPointer() {
    const el = cnv.elt;
    el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        commit(); // one stroke = one undo step
        painting = true;
        last = canvasPos(e);
        stamp(last, last);
        refresh();
    });
    el.addEventListener('pointermove', (e) => {
        if (!painting) return;
        const p = canvasPos(e);
        stamp(last, p);
        last = p;
        redraw();
    });
    const stop = () => { painting = false; };
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
}

/* ---------- Feature drawings (unchanged from your original) ---------- */
//brows

function drawbrows1(){

}

function drawbrows2(){
    noFill()
    stroke(0)  
    angleMode(DEGREES)
    arc(120,50,50,40,180,0)

    arc(280,50,50,40,180,0)
}

function drawbrows3(){
    noFill()
    stroke(0)
    angleMode(DEGREES)
    arc(120,50,70,25,170,20)
    arc(115,59,60,30,190,0)

    arc(280,50,70,25,160,10)
    arc(285,59,60,30,185,350)
}

function drawbrows4(){
    noFill()
    stroke(0)
    quad(100,50, 160,60, 160,65, 90,55)
    triangle(90,55, 100,57, 85,65)

    quad(240,60, 300,50, 310,55, 240,65)
    triangle(310,55, 315,65,300,57)
}

function drawbrows5(){
    noFill()
    stroke(0)
    ellipse(110,55,65,25)//ellipse(110,425,65,25)
    line(138,50,138,60)//line(138,420,138,430)
    line(140,51,140,60)//line(140,421,140,430)
    line(141,51,141,60)//line(141,421,141,430)
    line(142,52,142,62)//line(142,422,142,432)
    line(143,53,143,63)//line(143,423,143,433)
    line(146,55,146,65)//line(146,425,146,435)
    angleMode(DEGREES)
    arc(110,57,65,25,10,230,CHORD)//arc(110,427,65,25,10,230,CHORD)

    ellipse(290,55,65,25)  
    line(250,55,250,69)
    line(252,54,252,67)
    line(255,53,255,65)
    line(257,52,257,63)
    line(259,51,259,61)
    angleMode(DEGREES)
    arc(290,57,65,25,320,170,CHORD)  
}
//eyes
function draweyes1() {
    //background(220);
    noFill();
    stroke(0)
    //eyes
    ellipse(200,50,50,40)
    ellipse(200,50,50,20)
    ellipse(200,50,25,20)
    ellipse(200,48,15,14)

    ellipse(120, 100, 50, 40)
    ellipse(122, 100, 55, 20)
    ellipse(120, 100, 25, 20)
    ellipse(120, 98, 15, 14)

    ellipse(280, 100, 50, 40)
    ellipse(278, 100, 55, 20)
    ellipse(280, 100, 25, 20)
    ellipse(280, 98, 15, 14)
    
}

function draweyes2(){
    //eyes2
    noFill()
    stroke(0)
    angleMode(DEGREES)
    push()
    rotate(5)
    ellipse(130, 100, 50, 40)
    ellipse(130, 105, 60, 30)
    ellipse(130, 100, 20, 20)

    rotate(-10)
    ellipse(260, 132, 50, 40)
    ellipse(260, 137, 60, 30)
    ellipse(260, 132, 20, 20)
    pop()
}

function draweyes3(){
    noFill()
    stroke(0)
    //eyes3
    quad(90,100, 145,100, 170,140, 120,140)
    rect(115,100,35,30, 10)
    rect(122.5,100,20,20, 10)

    quad(255,100, 310,100, 280,140, 230,140)
    rect(250,100,35,30, 10)
    rect(258,100,20,20, 10)

}

function draweyes4(){
    //eyes4
    noFill()
    stroke(0)
    angleMode(DEGREES)
    push()
    rotate(-5)
    ellipse(120, 120, 50, 40)
    ellipse(120, 125, 60, 30)
    ellipse(120, 120, 20, 20)

    rotate(10)
    ellipse(280, 85, 50, 40)
    ellipse(280, 90, 60, 30)
    ellipse(280, 85, 20, 20)
    pop()
}

function draweyes5(){
    //push()
    //rotate(-5)
    //eyes5
    noFill()
    angleMode(DEGREES)
    stroke(0)
    ellipse(120,100, 60,20)
    arc(120,93, 35,32, 0,180, CHORD)
    arc(120,93, 20,20, 0,180, CHORD)

    ellipse(280,100, 60,20)
    arc(280,93, 35,32, 0,180,CHORD)
    arc(280,93, 20,20, 0,180,CHORD)
    //pop()
}

function draweyes6(){

}

function drawnoses1(){
    noFill()
    stroke(0)
    ellipse(200,160,50,80)  
    ellipse(191,155,30,50)
    ellipse(190,180,40,30)
    ellipse(220,180,25,20)
}

function drawnoses2(){
    noFill()
    noStroke()
    triangle(165,200,185,140,200,200)
    triangle(175,200,195,140,210,200)
    stroke(0)
    line(165,200,185,140)
    line(175,200,195,140)
    line(165,200,175,200)
    line(175,200,185,202)
    line(188,195,195,197)
}

function drawnoses3(){
    noFill()
    stroke(0)
    quad(170,120,200,120,190,200,150,200)
    triangle(200,120,200,200,190,200)
    quad(200,200,205,180,215,180,220,200)
    triangle(150,200,200,200,200,210)
}

function drawnoses4(){
    noFill()
    stroke(0)
    triangle(170,180,210,180,210,200)
}

function drawnoses5(){
    noFill()
    stroke(0)
    quad(200,100,200,200,160,200,175,140)
    quad(200,200,205,180,215,180,220,200)
}

function drawnoses6(){

}

function drawmouths1(){
    stroke(0)
    ellipse(200,250,80,50) // (-65, -30)
    ellipse(200,250,70,55)
    ellipse(200,250,70,25) 
    rect(174,237,6,7,10)
    rect(180,235,15,10,10)
    rect(195,235,15,10,10)
    rect(210,237,10,7,10)

    ellipse(180,230,20,20)
    ellipse(200,230,30,20)
    ellipse(200,260,65,25)

}

function drawmouths2(){
    angleMode(DEGREES)
    noFill()
    stroke(0)
    arc(185,240,30,40, 180,0, CHORD)
    arc(215,240,30,40, 180,0, CHORD)
    arc(200, 240, 90,90, 0, 180, CHORD)
    arc(200, 240, 80, 50, 0, 180,CHORD)
    rect(165,240,70,10, 2)
}

function drawmouths3(){
    noFill()
    stroke(0)
    ellipse(200,250,60,40)
    line(150,250,250,250)
}

function drawmouths4(){
    noFill()
    //triangle()
    //triangle()
}

function drawmouths5(){

}
function drawmouths6(){

}

//faces
function drawfaces1(){
    ellipse(200,100,300,500)
}

function drawfaces2(){
    rect(50,-100,300,430,95)
}

function drawfaces3(){
    rect(50,-100,300,300,10)
    triangle(60,200,340,200,200,330)
}

function drawfaces4(){
    rect(50,-100,300,300,30)
    quad(70,200,330,200,240,320,160,320)
}

function drawfaces5(){
    ellipse(200,125,350,400)
}

function drawfaces6(){

}
