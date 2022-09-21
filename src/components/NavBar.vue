<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <div>
                <router-link to="/" class="navbar-brand" href="">Votelog</router-link>
                <router-link to="/agreement" type="button" class="btn" href="">agreement</router-link>
            </div>
            <div>
                <div>
                    <router-link type="button" class="btn" v-if="!this.loggedIn" to="/login">Login</router-link>
                    <router-link type="button" class="btn" v-if="!this.loggedIn" to="/register">Register</router-link>
                    <router-link type="button" class="btn" v-if="this.loggedIn" to="/settings">
                        <font-awesome-icon class="fa" :icon="['fas', 'cog']"/>
                    </router-link>
                    <a type="buton" class="btn" v-if="this.loggedIn" @click="logout">
                        <font-awesome-icon class="fa" :icon="['fas', 'power-off']"/>
                    </a>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>

 import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

 export default {
     name: 'NavBar',
     props: ['loggedIn'],
     components: {
         FontAwesomeIcon,
     },
     methods: {
         logout(){
             this.$store.dispatch("logout");
         },
     },
 }
</script>
