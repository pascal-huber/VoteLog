<template>
    <div class="container">
        <div v-if="!confirmedUserId" >
            <h2>Registrieren</h2>
            <div v-if="error">
                {{ error }}
            </div>
            <form class="row gy-2">
                <div class="col-12">
                    <div class="input-group">
                        <input id="userId" class="form-control"
                            v-model="userId" placeholder="Benutzername">
                    </div>
                </div>
                <div class="col-12">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-secondary" v-on:click="generatePassword">
                                    <font-awesome-icon class="fa" :icon="['fas', 'dice-three']"/>
                                </button>
                            </span>
                        </div>

                        <input id="password" class="form-control"
                        v-model="password" placeholder="Verschlüsselungspasswort">

                        <div class="input-group-append">
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-secondary" v-on:click="copyToClipboard">
                                    Copy
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <button type="button" class="btn btn-primary"
                            v-on:click="register">Registrieren</button>
                </div>
            </form>
        </div>
        <div class="row" v-else>
            <div class="col">
                <h2>Wilkommen!</h2>
                <p>
                    Die ID und das Passwort nicht verlieren!
                </p>
                <div class="row">
                    <div class="col-2">
                        ID:
                    </div>
                    <div class="col-10">
                        {{ this.userId  }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        Schlüssel:
                    </div>
                    <div class="col-10">
                        {{ this.password }}
                    </div>
                </div>
                <button type="button" class="btn btn-primary" @click="finalize">Verstanden</button>
            </div>
        </div>
    </div>
</template>

<script>

 import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

 export default {
     components: {
         FontAwesomeIcon,
     },
     data: function(){
         return {
            userId: undefined,
            password: undefined,
            localError: undefined,
         }
     },
     computed: {
         confirmedUserId(){
             // TODO: don't access state directly in navbar?
             return this.$store.state.user.id
         },
         error(){
            return this.localError || this.$store.getters.getError();
         },
     },
     methods: {
         async register(){
            this.localError = undefined;
            if(this.password && this.password.length >= 128){
                await this.$store.dispatch("register", {userId: this.userId, password: this.password});
            } else {
                this.localError = "Passwort muss mindestens 64 Zeichen haben.";
            }
         },
         finalize(){
             this.$router.push({name: 'login'});
         },
         generatePassword() {
             let CharacterSet = '';
             let password = '';
             CharacterSet += 'abcdefghijklmnopqrstuvwxyz';
             CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
             CharacterSet += '0123456789';
             CharacterSet += '![]{}()%&*$#^<>~@|';
             for(let i=0; i < 128; i++) {
                 password += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length));
             }
             this.password = password;
         },
         copyToClipboard() {
             navigator.clipboard.writeText(this.password);
         },
     },
 }
</script>

<style scoped lang="scss">
</style>
