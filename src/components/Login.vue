<template>
    <div class="row">
        <h2>Anmelden</h2>

        <form>
            <div class="form-group">
                <input id="logUserId" class="form-control"
                       v-model="userId" placeholder="Benutzer ID">
            </div>
            <div class="form-group">
                <input id="logPassword" class="form-control"
                       v-model="logPassword" placeholder="Verschlüsselungspasswort" type="password">
            </div>
            <!-- <div class="form-check">
                 <input class="form-check-input" type="checkbox" id="logRemember" v-model="logRemember" />
                 <label class="form-check-label" for="logRemember">Angemeldet beleiben</label>
                 </div>
            -->
            <div class="form-group">
                <button type="button" class="btn btn-primary"
                        v-on:click="submit">Anmelden</button>
            </div>
        </form>
    </div>


    <div class="row">
        <h2>Registrieren</h2>
        <form>
            <div class="form-group">
                <input id="regUserId" class="form-control" aria-describedby="regPasswordHelp"
                       v-model="regPassword" placeholder="Verschlüsselungspasswort" type="password">
                <small id="regPasswordHelp" class="form-text text-muted"></small>
            </div>

            <button type="button" class="btn btn-primary"
                    v-on:click="register">Registrieren</button>
        </form>
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
         // TODO: don't change state here
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
                     this.$store.dispatch("register");
                 });
         }
     },
 }
</script>

<style scoped lang="scss">
</style>
