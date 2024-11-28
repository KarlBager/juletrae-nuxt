<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['ballFinished']);

let isMounted = ref(false);

let isPainting = ref(false);

let isFillingForm = ref(false);

let userName = ref('');
let userClass = ref('');

let ballXGlobal = ref();
let ballYGlobal = ref();

onMounted(() => {

isMounted.value = true;
isPainting.value = true;

})



let isPlacing = ref(false);

let ballBackgroundColor = ref('#D17475'); // Initial background color
let brushColor = ref('#F9ED7A');

let isErasing = ref(false);

let drawingCode = ref('');


// Define a ref for the container
const drawingCanvas = ref(null);
const placingCanvas = ref(null);
let p5Instance = null;
let p5PlacingInstance = null;

const { $p5 } = useNuxtApp();


function clearDrawing(){
    drawLayer.clear();
    drawingCode.value = '';
}



function finishDrawing(){
    isPainting.value = false;
    isPlacing.value = true;

    if(isMounted){
        const p5DrawingCanvasEl = document.querySelector('#defaultCanvas1');
        p5DrawingCanvasEl.classList.add('hidden');
    }

//Tillad brugeren at placere sin kugle
buildPlacementSketch();
}


function backToDraw(){
    isPainting.value = true;
    isPlacing.value = false;

    // if(isMounted){
    //     const p5DrawingCanvasEl = document.querySelector('#defaultCanvas1');
    //     p5DrawingCanvasEl.classList.remove('hidden');
    // }
}


function triggerForm(){
    isPlacing.value = false;
    isFillingForm = true;


    // if(isMounted){
    //     const p5PlacingCanvasEl = document.querySelector('#defaultCanvas2');
    //     p5PlacingCanvasEl.classList.add('hidden');
    // }
}

function backToPlacing(){
    isPlacing.value = true;
    isFillingForm = false;




    if(isMounted){
        const p5PlacingCanvasEl = document.querySelector('#defaultCanvas2');
        p5PlacingCanvasEl.classList.remove('hidden');
    }
}




function drawDrawing(p, ballX, ballY){

    ballXGlobal.value = ballX;
    ballYGlobal.value = ballY;

    const drawingCodeConst = drawingCode.value;
    p.push();
    p.translate(ballX-100, ballY-100);
    p.scale(0.1);
    //console.log(drawingCodeConst);
    eval(drawingCodeConst);
    p.pop();

}



//PUSH BALL TIL MYSQL
async function addBall(ballData) {
  try {
    const response = await fetch('/api/add-ball', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ballData),
    });

    const result = await response.json();

    if (result.success) {
      //console.log('Ball added successfully with ID:', result.id);
    } else {
      console.error('Failed to add ball:', result);
    }

    emit('ballFinished');
  } catch (error) {
    console.error('Error adding ball:', error);
  }
}


function insertBall(){

    const newBall = {
        name: userName.value,
        student_class: userClass.value,
        style: 1,
        color: ballBackgroundColor.value,
        artwork: drawingCode.value,
        x: ballXGlobal.value,
        y: ballYGlobal.value,   
    };

    addBall(newBall);


    isFillingForm = false;
   

    p5Instance.remove();
    p5PlacingInstance.remove();
}






//PLACERINGS SKETCH

function buildPlacementSketch(){

    const sketch = (p) => {

        let ballImg1;
        let mouseDown;

        let ballX = 1000;
        let ballY = 1400;
        

p.preload = () => {
    ballImg1 = p.loadImage('/kugle_1.png');

}

  p.setup = () => {
    p.createCanvas(2000, 2000);
  };

  p.draw = () => {
    
    //Definer costumizations
    const ballStyle = 1;
    
    const ballColor = ballBackgroundColor.value;


    if(ballStyle==1){
    p.clear();
    p.noStroke();
    p.fill('#F9ED7A');
    p.circle(ballX, ballY + 15, 180, 180);
    p.filter(p.BLUR, 3);
    p.fill(ballColor);
    p.circle(ballX, ballY + 15, 140, 140);

    //Læg tegning på
    drawDrawing(p, ballX, ballY);

    //Læg billedet på
    p.imageMode(p.CENTER);
    p.image(ballImg1, ballX, ballY);
    }

    if(mouseDown && isPlacing.value && !(p.mouseX > 194 && p.mouseX < 691 && p.mouseY > 600 && p.mouseY < 1072)){

        //console.log(p.mouseX, p.mouseY);
        ballX = p.mouseX;
        ballY = p.mouseY;
    }


  };


  p.mousePressed = () => {
    mouseDown = true;
  }

  p.mouseReleased = () => {
    mouseDown = false;
  }


};

    p5PlacingInstance = new $p5(sketch, placingCanvas.value);


}







//TEGNESKETCH

let drawLayer; // Off-screen graphics layer

// Define the p5 sketch function
const sketch = (p) => {

    let ballImg1;
    let mouseDown;
    
    
p.preload = () => {
    ballImg1 = p.loadImage('/kugle_1_hi.png');
}

  p.setup = () => {
    p.createCanvas(2000, 2000);

    p.frameRate(240);

    // Create an off-screen graphics layer
    drawLayer = p.createGraphics(2000, 2000);
    drawLayer.noStroke();

  };

  p.draw = () => {

    p.clear();

    p.push()
    p.translate(1000,1000);
    p.scale(5);
    p.fill(ballBackgroundColor.value);
    p.noStroke();
    p.circle(2, 28, 285, 285);
    p.pop();


    // Draw the user's custom drawing from the off-screen layer
    p.image(drawLayer, 0, 0);

   //Læg billedet på
   p.push()
    p.translate(1000,1000);
    p.scale(3.333);
    p.imageMode(p.CENTER);
    p.image(ballImg1, 0, 0);
    p.pop();

      // If the mouse is down, draw on the off-screen layer
      if (mouseDown && isPainting.value && p.mouseY>450 && p.mouseX < 1720 && p.mouseX > 320 && p.mouseY < 1850) {
            if(isErasing.value){
            drawLayer.clearRect(20, 20, p.mouseX, p.mouseY);
            }  else {
            drawLayer.fill(brushColor.value); // Change this color as needed
            drawLayer.noStroke();
            drawLayer.circle(p.mouseX, p.mouseY, 50);

            drawingCode.value += `
            p.fill('${brushColor.value}');
            p.noStroke();
            p.circle(${p.mouseX}, ${p.mouseY}, 50);
            `
           
            }
        }

  };


  p.mousePressed = () => {
    mouseDown = true;
  }

  p.mouseReleased = () => {
    mouseDown = false;
    
  }
};


p5Instance = new $p5(sketch, drawingCanvas.value);
 

</script>



<template>

<div v-if="isPainting" class="canvas-container">
    <div class="overlay">
            <div class="drawing-io">
                <input type="color" v-model="ballBackgroundColor"></input>
                <input type="color" v-model="brushColor"></input>
                <button @click="clearDrawing">Ny tegning</button>
                <button @click="finishDrawing">Gem kugle</button>
                
                <!-- <input type="radio" v-model="isErasing" name="brush" value="false" checked>
                <input type="radio" v-model="isErasing" name="brush" value="true"> -->
            </div>
        <div ref="drawingCanvas"></div>
    </div>
</div>


<button class="start-buttons" id="trigger-form-button" v-if="isPlacing" @click="triggerForm">Gem din<br>julekugle</button>
<button class="start-buttons" id="back-button" v-if="isPlacing" @click="backToDraw">Tilbage</button>


<div class="form" v-if="isFillingForm">
    <div class="overlay">
        <div class="form-container">
            
            <input type="text" name="name" v-model="userName" placeholder="Dit navn" required></input>
            <input type="text" name="student-class" v-model="userClass" placeholder="Evt. din klasse"></input>
            <button class="start-buttons" id="save-ball-button" @click="insertBall">Gem din<br>julekugle</button>
            <button class="start-buttons" id="back-to-placing-button" @click="backToPlacing">Tilbage</button>


        </div>
    </div>
</div>

</template>



<style>
#trigger-form-button{
    background-color: #697C5C;
    color: #F9ED7A;
}

#trigger-form-button:hover{
    background-color: #757b71;
    border-color: #ffffff;
}


#save-ball-button{
    background-color: #697C5C;
    color: #F9ED7A;
}

#save-ball-button:hover{
    background-color: #757b71;
    border-color: #ffffff;
}


#back-to-placing-button{
    background-color: #D17475;
    top: 46vh;
}

#back-to-placing-button:hover{
    background-color: #cc9393;
    border-color: #ffffff;
    color: #3D3D3D;
}


/* #D17475 #697C5C  #716053 */
#back-button{
    background-color: #D17475;
    top: 46vh;
}

#back-button:hover{
    background-color: #cc9393;
    border-color: #ffffff;
    color: #3D3D3D;
}

.hidden{
    display: none;
}

.drawing-io{
    position: absolute;
    z-index: 2;
}

#defaultCanvas1{
    position: absolute;
    z-index: 1;
}

.canvas-container{
    position: absolute;
    top: 0;
    height: 100vh;
    width: 100vh;
}

.form{
    position: absolute;
    top: 0;
    height: 100vh;
    width: 100vh;
}

.overlay{
    background-color: rgba(0,0,0,0.8);
    width: 100%;
    height: 100%;
}


</style>