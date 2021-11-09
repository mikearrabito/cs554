<template>
  <nav>
    <router-link to="/">Main Page</router-link>
    <router-link to="/characters/page/0">Characters</router-link>
    <router-link to="/comics/page/0">Comics</router-link>
    <router-link to="/series/page/0">Series</router-link>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
