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


function generateP5Balls(){

generateBallCode(balls.value);
//console.log(ballsCode.value);

// Define the p5 sketch function
const sketch = (p) => {

let ballImg1;

p.preload = () => {
    ballImg1 = p.loadImage('./kugle_1.png');
}

  p.setup = () => {
    p.createCanvas(2000, 2000);
  };

  p.draw = () => {

    p.fill('#D17475');
    p.noStroke();
    //p.circle(100,20,20,20);

    p.imageMode(p.CENTER);

    console.log(ballsCode.value);
    eval(ballsCode.value);

  };
};


if (p5Container.value) {
    p5Instance = new $p5(sketch, p5Container.value);
  } else {
    console.error('p5Container is not initialized');
  }

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