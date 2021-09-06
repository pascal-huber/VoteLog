<template>
    <NavBar v-bind:loggedIn="loggedIn" />
    <div class="container">
        <router-view></router-view>
    </div>
</template>

<script>
 import NavBar from '@/components/NavBar.vue'

 export default {
     name: 'App',
     components: {
         NavBar,
     },
     computed: {
         loggedIn(){
             return !!this.$store.state.user.encryptionKey;
         }
     }
 }
</script>

<style>
 nav {
     margin-bottom: 1rem;
 }
</style>
