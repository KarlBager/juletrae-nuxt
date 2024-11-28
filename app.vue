<script setup>
import JuleTrae from './components/JuleTrae.vue';
import BallDesigner from './components/BallDesigner.vue';
import { ref } from 'vue';


let ballExists = ref(false);
let designingBall = ref(false);

let shouldReload = ref(false);


function triggerBallDesigner(){
  designingBall.value = true;
}

function finishBallDesign(){
  designingBall.value = false;
  ballExists.value = true;

  reloadJuletrae();
}




function reloadJuletrae(){
  shouldReload.value = true;
  //console.log(shouldReload.value);
  //shouldReload.value = false;
}

function juletraeReloaded(){
  shouldReload.value = false;
}


</script>

<template>
  <header>



    <JuleTrae @isReloaded="juletraeReloaded" :shouldReload="shouldReload" />

    <button class="start-buttons" v-if="!ballExists && !designingBall" @click="triggerBallDesigner">Tilføj din <br>julekugle</button>
    
    <BallDesigner @ballFinished="finishBallDesign" v-if="designingBall" />


  </header>

</template>










<style>

.start-buttons{
position: absolute;
top: 30vh;
left: 10vh;
font-size: 5vh;
background: #FFF7EA;
border: solid 3px #3D3D3D;
color: #3D3D3D;
font-family: 'Space Grotesk';
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
}

body{
width: 100vh;
height: 100vh;
background-color: #E9E0D3;
margin: 0;
}

canvas{
  width: 100% !important;
  height: 100% !important;
}



</style>
