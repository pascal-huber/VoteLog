<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand" href="">Votelog</router-link>
            <div>
                <div>
                    <router-link type="button" class="btn" v-if="!this.userId" to="/login">Login</router-link>
                    <router-link type="button" class="btn" v-if="!this.userId" to="/register">Register</router-link>
                    <a type="buton" class="btn" v-if="this.userId" @click="logout">Logout</a>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>


 export default {
     name: 'NavBar',
     props: ['userId'],
     methods: {
         logout(){
             this.$store.dispatch("logout");
         },
     },
 }
</script>
