<template>
    <div class="row">
        <h2>Anmelden</h2>
        <input v-model="userId" placeholder="user-id"><br>
        <input v-model="logPassword" placeholder="encryption password" type="password"><br>
        <button v-on:click="submit">Anmelden</button>
    </div>

    <div class="row">
        <h2>Registrieren</h2>
        <input v-model="regPassword" placeholder="encryption password" type="password"><br>
        <button v-on:click="register">Registrieren</button>
    </div>

</template>

<script>
 import { generateKey } from './../crypto.js'

 export default {
     data: function(){
         return {
             userId: undefined,
             regPassword: undefined,
             logPassword: undefined,
         }
     },
     methods: {
         submit(){
             generateKey(this.logPassword)
                 .then((aesKey) => {
                     this.$store.state.user.aesKey = aesKey
                     this.$store.dispatch("getData", {userId: this.userId, aesKey: aesKey});
                 })
                 .catch(() => {
                     console.log("ERROR");
                 });
         },
         register(){
             generateKey(this.regPassword)
                 .then((aesKey) => {
                     this.$store.state.user.aesKey = aesKey
                 });
             this.$store.dispatch("register");
         }
     },
 }
</script>

<style scoped lang="scss">
</style>
