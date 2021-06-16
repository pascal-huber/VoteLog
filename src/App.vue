<template>
    <NavBar/>
    <VotesTable/>
</template>

<script>
import NavBar from './components/NavBar.vue'
import VotesTable from './components/VotesTable.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    VotesTable,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
