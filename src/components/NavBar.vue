<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="">Votey</a>
            <span class="navbar-text small" v-if="userId">
                ID: {{ userId }}
            </span>
            <button v-if="$store.state.user.id"
                    class="btn btn-success"
                    @click="logout"
                    type="submit">
                Logout
            </button>
            <span v-else class="navbar-text small"></span>
        </div>
    </nav>
</template>

<script>


 export default {
     name: 'NavBar',
     computed: {
         userId(){
             return this.$store.state.user.id
         },
     },
     methods: {
         logout(){
             this.$store.dispatch("logout");
         },
     },
 }
</script>
