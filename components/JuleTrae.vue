<script setup>
import { watch, defineProps, ref, onMounted, onUnmounted } from 'vue';
import { useNuxtApp } from '#app';

const emit = defineEmits(['isReloaded']);


// Define a ref for the container
const p5Container = ref(null);
let p5Instance = null;

let ballsCode = ref('');
let hoverBoxesEnabled = ref(true);

const balls = ref([]);



// Define the prop
const props = defineProps({
  shouldReload: {
    type: Boolean,
    default: false
  },
  hoverBoxesEnabled: {
    type: Boolean,
    default: true
  }
});


watch(() => props.shouldReload, (newValue) => {
  if (newValue) {
    
    reloadBalls();
  }
});








function reloadBalls() {

  //console.log('Kører Funktionen');
  // Declare the newBalls variable here to ensure it's accessible
  let newBalls;

  // Define the async function correctly and call it
  const fetchBalls = async () => {
    try {
      newBalls = await $fetch('/api/balls');
      balls.value = newBalls;
      generateP5Balls();  // Only call generateP5Balls after data is fetched
      emit('isReloaded');  // Emit after everything is done
    } catch (error) {
      console.error('Failed to fetch balls:', error);
    }
  };

  // Call the async function immediately
  fetchBalls();
}




// function generateBallCode(ballArray){
   
//     //global ballscode variabel
//     ballsCode.value = "";

//     //gem længden på array ned i konstant
//     const ballCount = ballArray.length;



//     for(let i = 0; i < ballCount; i++){
//     let newBallCode;

//     //Definer costumizations
//     const ballStyle = ballArray[i].style;
//     const ballX = ballArray[i].x;
//     const ballY = ballArray[i].y;
//     const ballColor = ballArray[i].color;


//     if(ballStyle==1){
//     newBallCode = `p.fill('${ballColor}'); p.circle(${ballX}, ${ballY + 15}, 140, 140);`;
//     }

//     //Læg billedet på
//     newBallCode += `p.image(ballImg${ballStyle}, ${ballX}, ${ballY});`;

//     newBallCode += ``;


//     ballsCode.value+= newBallCode;

//     }

// }




const { $p5 } = useNuxtApp();

let ballImg1;
let banner;


function generateP5Balls(){
  //console.log('Så langt så godt', balls.value)
  

//generateBallCode(balls.value);
//console.log(ballsCode.value);

// Define the p5 sketch function
const sketch = (p) => {



p.preload = () => {
    ballImg1 = p.loadImage('/kugle_1.png');

    banner = p.loadImage('/banner.png');
}


  p.setup = () => {
    p.createCanvas(2000, 2000);
  };

  p.draw = () => {
    if(!props.hoverBoxesEnabled){
      p.frameRate(1);
    }


    p.clear();
    p.fill('#D17475');
    p.noStroke();
    //p.circle(100,20,20,20);

    //console.log(`${p.mouseX}, ${p.mouseY}`);

    p.imageMode(p.CENTER);

    const ballsArrayVar = balls.value;
    generateBalls(p, ballsArrayVar);

    

    if(props.hoverBoxesEnabled){
    hoverBox(p, balls.value, p.mouseX, p.mouseY);
    }
  };
};


if (p5Container.value) {
    p5Instance = new $p5(sketch, p5Container.value);
  } else {
    console.error('p5Container is not initialized');
  }


}


function hoverBox(p, ballArray, mouseX, mouseY){
  let ballCount = ballArray.length;

//console.log(`${mouseX}, ${mouseY}`);

  //tjek om musen hover over kugle
  for(let i = 0; i < ballCount; i++){
    const ballX = ballArray[i].x;
    const ballY = ballArray[i].y;
    const ballName = ballArray[i].name;
    const ballColor = ballArray[i].color;
    const ballClass = ballArray[i].student_class;
    const ballTime = new Date(ballArray[i].time);
   
    // Extract the day, month, and year
    const day = String(ballTime.getDate()).padStart(2, '0'); // Ensure 2-digit day
    const month = String(ballTime.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = ballTime.getFullYear(); // Get the full year

    const ballTimeFormatted = `${day}/${month}-${year}`;

    let zoneRadius = 40;

    function isNear(x1, y1, x2, y2){
      
      if(x1 > x2 - zoneRadius && x1 < x2 + zoneRadius && y1 > y2 - zoneRadius && y1 < y2 + zoneRadius){
        return true;
      } else{
        return false;
      }
    }

    if(isNear(mouseX, mouseY, ballX, ballY)){
      //console.log("Kugle: " + ballName);
      p.image(banner, mouseX + 300, mouseY);
      p.fill("#3D3D3D");
      p.textSize(42);
      p.textAlign(p.CENTER);
      p.text(`${ballName}, ${ballClass}`, mouseX + 300, mouseY - 12);
      p.textSize(28);
      p.text(`${ballTimeFormatted}`, mouseX + 300, mouseY + 30);
    }
  }
}





function drawDrawing(p, drawingCode, ballX, ballY){

const drawingCodeConst = drawingCode;
p.push();
p.translate(ballX-100, ballY-100);
p.scale(0.1);
//console.log(drawingCodeConst);
eval(drawingCodeConst);
p.pop();

}




function generateBalls(p, ballArray){

    //gem længden på array ned i konstant
    let ballCount = ballArray.length;
    //console.log(ballCount);



    for(let i = 0; i < ballCount; i++){
    
    //Definer costumizations
    const ballStyle = ballArray[i].style;
    const ballX = ballArray[i].x;
    const ballY = ballArray[i].y;
    const ballColor = ballArray[i].color;
    const drawingCode = ballArray[i].artwork;

    if(ballStyle==1){
    p.fill(ballColor);
    p.circle(ballX, ballY + 15, 140, 140);

    
    //Læg tegning på
    drawDrawing(p, drawingCode, ballX, ballY);


    //Læg billedet på
    p.image(ballImg1, ballX, ballY);
    }

};
}



onMounted(
async () => {
  try {
    balls.value = await $fetch('/api/balls');
  } catch (error) {
    console.error('Failed to fetch balls:', error);
  }

  generateP5Balls();
  //console.log(balls.value[0]);

}

);



onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove();
    //console.log('p5 instance removed');
  }
});


</script>

<template>

  <div id="juletrae">

  <img src="/juletrae.png" />

  </div>



  <main ref="p5Container"></main>

</template>


<style>

#defaultCanvas0{
    position: absolute;
    z-index: 0;
}

#defaultCanvas2{
  position: absolute;
  z-index: 1;
}

#juletrae{
    width: 100vh;
    height: 100vh;
}

#juletrae img{
    height: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
}


</style>