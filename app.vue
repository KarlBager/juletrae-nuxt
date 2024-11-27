<script setup>
import JuleTrae from './components/JuleTrae.vue'
</script>

<template>
  <header>
      
    <JuleTrae />

  </header>


</template>

<style>

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
