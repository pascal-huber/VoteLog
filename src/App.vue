<template>
    <NavBar/>
    <div class="container">
        <br>&nbsp; <!-- TODO: fix spacing hack-->
        <Login v-if="!loggedIn"/>
        <VotesTable v-else/>
    </div>
</template>

<script>
 import Login from './components/Login.vue'
 import NavBar from './components/NavBar.vue'
 import VotesTable from './components/VotesTable.vue'

 export default {
     name: 'App',
     computed: {
         loggedIn(){
             return this.$store.state.user.id &&
                    this.$store.state.user.aesKey
         },
     },
     components: {
         NavBar,
         VotesTable,
         Login,
     },
 }
</script>
