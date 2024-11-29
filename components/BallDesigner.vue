<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['ballFinished', 'placingBall']);

let isMounted = ref(false);

let isPainting = ref(false);
let isPlacing = ref(false);
let isFillingForm = ref(false);

let userName = ref('');
let userClass = ref('');

let ballXGlobal = ref();
let ballYGlobal = ref();


console.log(window);


onMounted(() => {

isMounted.value = true;
isPainting.value = true;

})




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


function clearSelection(){
    if(isMounted.value){
 if (window.getSelection) {window.getSelection().removeAllRanges();}
 else if (document.selection) {document.selection.empty();}
}
}


function finishDrawing(){
    emit('placingBall');
    clearSelection();

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
    isFillingForm.value = false;

    if(isMounted){
        const p5DrawingCanvasEl = document.querySelector('#defaultCanvas1');
        p5DrawingCanvasEl.classList.remove('hidden');
    }
}


function triggerForm(){
    isPlacing.value = false;
    isFillingForm.value = true;


    // if(isMounted){
    //     const p5PlacingCanvasEl = document.querySelector('#defaultCanvas2');
    //     p5PlacingCanvasEl.classList.add('hidden');
    // }
}

function backToPlacing(){
    isPlacing.value = true;
    isFillingForm.value = false;




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
    setCookie('ballSubmitted', 'true', 30);


    isFillingForm = false;

   

    p5Instance.remove();
    p5PlacingInstance.remove();
}



function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}


//PLACERINGS SKETCH

function buildPlacementSketch(){

    const sketch = (p) => {

        let ballImg1;
        let mouseDown;

        let ballX = 1000;
        let ballY = 1000;
        

p.preload = () => {
    ballImg1 = p.loadImage('/kugle_1.png');

}

  p.setup = () => {
    p.pixelDensity(1);
    p.createCanvas(2000, 2000, p.P2D);
  };

  p.draw = () => {

    p.frameRate(24);
    
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
    p.noStroke();
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

  p.touchStarted = () => {
    mouseDown = true;
  }

  p.touchEnded = () => {
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
    p.pixelDensity(1);
    p.createCanvas(2000, 2000, p.P2D);


    // Create an off-screen graphics layer
    drawLayer = p.createGraphics(2000, 2000);
    drawLayer.noStroke();

  };

  p.draw = () => {
    p.frameRate(60);

    if(isPlacing.value || isFillingForm.value){
        p.frameRate(1);
    }

    p.clear();

    p.push()
    p.translate(1000,1000);
    p.scale(5);
    p.noStroke();
    p.fill(ballBackgroundColor.value);
    p.circle(2, 29, 285, 285);
    p.pop();


    // Draw the user's custom drawing from the off-screen layer
    p.image(drawLayer, 0, 0);

   //Læg billedet på
   p.push()
    p.translate(1000,1000);
    p.scale(2.5);
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

            drawingCode.value += `p.fill('${brushColor.value}');
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

  p.touchStarted = () => {
    mouseDown = true;
  }

  p.touchEnded = () => {
    mouseDown = false;
  }

};


p5Instance = new $p5(sketch, drawingCanvas.value);
 

</script>



<template>

<Transition name="fade">
<div v-if="isPainting" class="canvas-container">
    <div class="overlay">
            <div class="drawing-io">
                <div id="ball-color-selector-container" class="color-selector-container">
                    <label for="ballColorSelector">Baggrundsfarve</label>
                    <div name="ballColorSelector" class="color-selectors"><input class="color-selectors" id="ballColorSelector" type="color" v-model="ballBackgroundColor"></input></div>
                </div>

                <div id="brush-color-selector-container" class="color-selector-container">
                    <label for="brushColorSelector">Tegnefarve</label>
                    <div name="brushColorSelector" class="color-selectors"><input class="color-selectors" id="brushColorSelector" type="color" v-model="brushColor"></input></div>
                </div>
                
                <button class="drawing-buttons" id="clear-drawing-button" @click="clearDrawing">Slet tegning</button>
                <button class="drawing-buttons" id="finish-drawing-button" @click="finishDrawing">Gem kugle</button>
                
                <!-- <input type="radio" v-model="isErasing" name="brush" value="false" checked>
                <input type="radio" v-model="isErasing" name="brush" value="true"> -->
            </div>
        <div ref="drawingCanvas"></div>
    </div>
</div>
</Transition>


<button class="start-buttons" id="trigger-form-button" v-if="isPlacing" @click="triggerForm">Gem din<br>julekugle</button>
<button class="start-buttons" id="back-button" v-if="isPlacing" @click="backToDraw">Tilbage</button>

<div id="place-guide" v-if="isPlacing">
    <div>    
        <h2>Placér din julekugle</h2>
        <p>Vælg med omhu – kuglen kan ikke<br> ændres igen</p>
    </div>
</div>



<Transition name="fade">
<div class="form" v-if="isFillingForm">
    <div class="overlay">
        <div class="form-container">
            <div>
                <input class="input-fields" type="text" name="name" v-model="userName" placeholder="Dit navn" required></input>
                <input class="input-fields" type="text" name="student-class" v-model="userClass" placeholder="Evt. din klasse"></input>
            
                <div>
                <button class="start-buttons" id="back-to-placing-button" @click="backToPlacing">Tilbage</button>
                <div id="save-ball-button-container">
                    <button class="start-buttons" id="save-ball-button" @click="insertBall">Gem din<br>julekugle</button>
                    <p>Den vil ikke længere <br> kunne ændres</p>
                </div>
                </div>
            </div>
            <p id="cookienotice"><i>Ved at trykke 'Gem din julekugle' accepterer du brugen af en enkelt cookie,<br> der blot registrerer at du har hængt en julekugle på træet.</i></p>
        </div>
    </div>
</div>
</Transition>



</template>



<style>
#cookienotice{
    text-align: center;
    color: rgb(147, 146, 146);
    font-size: 1.2vh;
    position: absolute;
    top: 93vh
}

#save-ball-button-container{
    display: flex;
    flex-direction: column;
    column-gap: 0;
    gap: 0;
}

#save-ball-button-container p{
    margin: 0;
    margin-top: 10px;
    text-align: center;
    line-height: 1;
    font-family: space-grotesk-variable, sans-serif;
    color: red;
}


.drawing-buttons{
    line-height: 1.1;
    padding: 1vh;
    background-color: rgba(0,0,0,0);
    font-size: 5vh;
    font-family: space-grotesk-variable, sans-serif;
    border: solid 3px;
    position: absolute;
    top: 84.8vh;
}

#finish-drawing-button{
    left: 82.4vh;
    background-color: #697C5C;
    border-color: #3D3D3D;
    color: #F9ED7A;
}

#finish-drawing-button:hover{
    background-color: #757b71;
    border-color: #eeeeee;
    color: #F9ED7A;
}

#clear-drawing-button:hover{
    background-color: #777777;
    border-color: #eeeeee;
    color: #eeeeee;
}

#clear-drawing-button{
    left: 1vh;
    background-color: #777777;
    color: #3D3D3D;
}


#ball-color-selector-container{
    position: absolute;
    align-items: start;
    left: 1vh;
    top: 1vh;
}

#brush-color-selector-container{
    align-items: end;
    position: absolute;
    left: 79vh;
    top: 1vh;
}


.color-selector-container{
display: flex;
flex-direction: column;
color: #3D3D3D;
font-family: space-grotesk-variable, sans-serif;
font-size: 3.4vh;
}


div.color-selectors{
    border: solid 3px #3D3D3D;
    border-radius: 100%;
    overflow: hidden;
    height: 19.3vh;
    width: 19.3vh;  
}

input.color-selectors{
    position: relative;
    left: -21vh;
    top: -15vh;
    background-color: rgba(0,0,0,0);
    height: 100vh;
    width: 100vh;  
    padding: 0px -0px;
    overflow: hidden;
}


.overlay{
    background-color: #E9E0D3;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  z-index: 3;
}


.input-fields{
    display: block;
    font-size: 5vh;
    font-family: space-grotesk-variable, sans-serif;
    margin: 40px 0;
    background-color: rgba(0,0,0,0);
    border: solid 3px #697C5C;
    color: #3D3D3D;
}

.form-container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
}

.form-container div div{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
}


#place-guide{
    position: absolute;
    top: 0;
    font-family: space-grotesk-variable, sans-serif;
    line-height: 0;
    background-image: url('/banner.png');
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    padding: 9vh;
    left: 50vh;
    top: 36vh;
    width: 31vh;
}

#place-guide h2{
    color: #3D3D3D;
    line-height: 1.2;
    margin: 0;
    font-size: 3vh;
}

#place-guide p{
    color: red;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    font-size: 1.9vh;
}


#trigger-form-button{
    top: 30vh;
    left: 10vh;
    background-color: #697C5C;
    color: #F9ED7A;
}

#trigger-form-button:hover{
    background-color: #757b71;
    border-color: #ffffff;
}


#save-ball-button{
    position: relative;
    background-color: #697C5C;
    color: #F9ED7A;
}

#save-ball-button:hover{
    background-color: #757b71;
    border-color: #ffffff;
}


#back-to-placing-button{
    position: relative;
    background-color: #D17475;
}

#back-to-placing-button:hover{
    background-color: #cc9393;
    border-color: #ffffff;
    color: #3D3D3D;
}


/* #D17475 #697C5C  #716053 */
#back-button{
    background-color: #D17475;
    left: 10vh;
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


#defaultCanvas1{
    position: absolute;
    z-index: 4;
    pointer-events: none;
}

#defaultCanvas2{
    position: absolute;
    z-index: 2;
}

.drawing-io{
    position: absolute;
    z-index: 5;
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




</style>