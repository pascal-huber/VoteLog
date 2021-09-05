<template>
    <div class="row">
        <div v-if="!userId" class="col">
            <h2>Registrieren</h2>
            <div v-if="error">
                {{ error }}
            </div>
            <form>
                <div class="form-group">
                    <input id="password" class="form-control" aria-describedby="passwordHelp"
                           v-model="password" placeholder="Verschlüsselungspasswort" type="password">
                    <small id="passwordHelp" class="form-text text-muted"></small>
                    <input id="password2" class="form-control" aria-describedby="password2Help"
                           v-model="password2" placeholder="nochmals das Verschlüsselungspasswort" type="password">
                </div>

                <button type="button" class="btn btn-primary"
                        v-on:click="register">Registrieren</button>
            </form>
        </div>
        <div v-else>
            <h2>Welcome!</h2>
            <p>
                Do not loose your ID and password. They cannot be recovered.
            </p>
            <button type="button" class="btn btn-primary" @click="finalize">Understood</button>
        </div>
    </div>
</template>

<script>
 import { generateKey } from '@/crypto.js'

 export default {
     data: function(){
         return {
             password: undefined,
             password2: undefined,
             error: undefined,
         }
     },
     computed: {
         userId(){
             // TODO: don't access state directly in navbar?
             return this.$store.state.user.id
         },
     },
     methods: {
         register(){
             this.error = undefined;
             if(this.password != this.password2){
                 this.error = "Passwörter müssen übereinstimmen"
             } else if(this.password.length < 12){
                 // TODO: increase password strength?
                 this.error = "Das Passwort sollte schon etwas länger sein..."
             } else {
                 // TODO: don't change state here
                 generateKey(this.password)
                     .then((aesKey) => {
                         this.$store.state.user.aesKey = aesKey
                         this.$store.dispatch("register");
                     });
             }
         },
         finalize(){
             this.$router.push({name: 'home'});
         },
     },
 }
</script>

<style scoped lang="scss">
</style>
