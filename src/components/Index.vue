<template>
    <NavBar v-bind:loggedIn="loggedIn" />
    <div class="container">
        <!-- TODO: Is this :key=... a hacky solution to force reloading on url change? -->
        <!-- source: https://laracasts.com/discuss/channels/vue/vue-2-reload-component-when-same-route-is-requested?page=1 -->
        <router-view :key="$route.fullPath"></router-view>
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
