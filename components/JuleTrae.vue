<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useNuxtApp } from '#app';


// Define a ref for the container
const p5Container = ref(null);
let p5Instance = null;

let ballsCode = ref('');

const balls = ref([]);



function generateBallCode(ballArray){
   
    //global ballscode variabel
    ballsCode.value = "";

    //gem længden på array ned i konstant
    const ballCount = ballArray.length;



    for(let i = 0; i < ballCount; i++){
    let newBallCode;

    //Definer costumizations
    const ballStyle = ballArray[i].style;
    const ballX = ballArray[i].x;
    const ballY = ballArray[i].y;
    const ballColor = ballArray[i].color;


    if(ballStyle==1){
    newBallCode = `p.fill('${ballColor}'); p.circle(${ballX}, ${ballY + 15}, 140, 140);`;
    }

    //Læg billedet på
    newBallCode += `p.image(ballImg${ballStyle}, ${ballX}, ${ballY});`;

    newBallCode += ``;


    ballsCode.value+= newBallCode;

    }

}

const { $p5 } = useNuxtApp();

let ballImg1;

function generateP5Balls(){

generateBallCode(balls.value);
//console.log(ballsCode.value);

// Define the p5 sketch function
const sketch = (p) => {



p.preload = () => {
    ballImg1 = p.loadImage('/kugle_1.png');
}


  p.setup = () => {
    p.createCanvas(2000, 2000);
  };

  p.draw = () => {
    p.clear();
    p.fill('#D17475');
    p.noStroke();
    //p.circle(100,20,20,20);

    //console.log(`${p.mouseX}, ${p.mouseY}`);

    p.textSize(56);
    p.imageMode(p.CENTER);

    generateBalls(p, balls.value);

    hoverBox(p, balls.value, p.mouseX, p.mouseY);


  };
};


if (p5Container.value) {
    p5Instance = new $p5(sketch, p5Container.value);
  } else {
    console.error('p5Container is not initialized');
  }


}


function hoverBox(p, ballArray, mouseX, mouseY){
  const ballCount = ballArray.length;

//console.log(`${mouseX}, ${mouseY}`);

  //tjek om musen hover over kugle
  for(let i = 0; i < ballCount; i++){
    const ballX = ballArray[i].x;
    const ballY = ballArray[i].y;
    const ballName = ballArray[i].name;
    const ballColor = ballArray[i].color;

    let zoneRadius = 40;

    function isNear(x1, y1, x2, y2){
      
      if(x1 > x2 - zoneRadius && x1 < x2 + zoneRadius && y1 > y2 - zoneRadius && y1 < y2 + zoneRadius){
        return true;
      } else{
        return false;
      }
    }

    if(isNear(mouseX, mouseY, ballX, ballY)){
      console.log("Kugle: " + ballName);
      p.fill("#ffffff");
      p.text(ballName, mouseX + 100, mouseY);
    }
  }
}


function generateBalls(p, ballArray){

    //gem længden på array ned i konstant
    const ballCount = ballArray.length;



    for(let i = 0; i < ballCount; i++){
    
    //Definer costumizations
    const ballStyle = ballArray[i].style;
    const ballX = ballArray[i].x;
    const ballY = ballArray[i].y;
    const ballColor = ballArray[i].color;


    if(ballStyle==1){
    p.fill(ballColor);
    p.circle(ballX, ballY + 15, 140, 140);

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

});


onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove();
    console.log('p5 instance removed');
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