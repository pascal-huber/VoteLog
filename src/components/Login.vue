<template>
    <div class="row">
        <div class="col">
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
                            v-on:click="login">Anmelden</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
 import { generateKey } from '@/crypto.js'

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
         login(){
             generateKey(this.logPassword)
                 .then((aesKey) => {
                     this.$store.state.user.aesKey = aesKey
                     this.$store.dispatch("getData", {userId: this.userId, aesKey: aesKey});
                 }).then(() => {
                     this.$router.push({name: 'home'});
                 })
                 .catch(() => {
                     console.log("ERROR");
                 });
         },
     },
 }
</script>

<style scoped lang="scss">
</style>
