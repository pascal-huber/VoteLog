<template>
    <NavBar v-bind:userId="this.$store.state.user?.id" />
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
 }
</script>

<style>
 nav {
     margin-bottom: 1rem;
 }
</style>
