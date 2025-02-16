<template>
  <head>
    <title>Tvheadend Web Interface</title>
  </head>
  <div id="app">
    <h1 class="title">Tvheadend Web Interface</h1>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
}

.title {
  text-align: center;
  color: #fff;
}
</style>
