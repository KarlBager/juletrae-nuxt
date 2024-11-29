<script setup>
import JuleTrae from './components/JuleTrae.vue';
import BallDesigner from './components/BallDesigner.vue';
import { ref, onMounted } from 'vue';




let ballExists = ref(false);
let designingBall = ref(false);
let shouldReload = ref(false);
let hoverBoxesEnabled = ref(true);


function triggerBallDesigner(){
  designingBall.value = true;
}

function finishBallDesign(){
  designingBall.value = false;
  ballExists.value = true;
  hoverBoxesEnabled.value = true;

  reloadJuletrae();
}

function disableHoverBoxes(){
  hoverBoxesEnabled.value = false;
}




function reloadJuletrae(){
  shouldReload.value = true;
  //console.log(shouldReload.value);
  //shouldReload.value = false;
}

function juletraeReloaded(){
  shouldReload.value = false;
}


onMounted(() => {

  function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let cookie of cookieArr) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) return value;
    }
    return null;
  }

  let isBallSubmitted = getCookie('ballSubmitted');
  if(isBallSubmitted){
    ballExists.value = true;
  }


  document.addEventListener('touchstart', {}); // in iframe

})



</script>

<template>
  <header>



    <JuleTrae @isReloaded="juletraeReloaded" :shouldReload="shouldReload" :hoverBoxesEnabled="hoverBoxesEnabled"/>

    <button class="start-buttons" id="start-button" v-if="!ballExists && !designingBall" @click="triggerBallDesigner">Tilføj din <br>julekugle</button>
    
    <BallDesigner @ballFinished="finishBallDesign" @placingBall="disableHoverBoxes" v-if="designingBall" />


  </header>

</template>










<style>


#start-button{
  top: 30vh;
  left: 10vh;
}

.start-buttons{
line-height: 1;
padding: 10px;
position: absolute;
z-index: 3;
font-size: 5vh;
background: #697C5C;
border: solid 3px #3D3D3D;
color: #F9ED7A;
font-family: space-grotesk-variable, sans-serif;
}

.start-buttons:hover{
background: #D17475;
border: solid 3px #697C5C;
color: #F9ED7A;
}

/* #D17475 #697C5C  #716053 */
main{
position: absolute;
top: 0;
left: 0;
width: 100vh;
height: 100vh;
overflow: hidden;
}

html{
  background-color: white;
  width: 100vh;
  height: 100vh;
  touch-action: none;
}

body{
width: 100vh;
height: 100vh;
background-color: #E9E0D3;
margin: 0;
touch-action: none;
}

canvas{
  width: 100% !important;
  height: 100% !important;
}



</style>
