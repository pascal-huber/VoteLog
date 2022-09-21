<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h2>Einstellungen</h2>
            </div>
        </div>
        <form class="row gy-2">
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
            <!-- <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="logRemember" v-model="logRemember" />
                    <label class="form-check-label" for="logRemember">Angemeldet beleiben</label>
                    </div>
            -->
            <div class="col-12">
                <div class="form-group">
                    <button type="button" class="btn btn-primary"
                            v-on:click="login">Anmelden</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>

 import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

 export default {
     name: 'Agreement',
     components: {
         FontAwesomeIcon,
     },
     computed: {
         loggedIn(){
             return !!this.$store.state.user.encryptionKey;
         },
         orderedSubjects() {
             return [...this.$store.state.subjects].sort(
                 (a, b) => {
                     if(a.date.getTime() == b.date.getTime()){
                         return a.name > b.name
                     }
                     a.date < b.date
             });
         },
     },
     data: function(){
         return {
            password: undefined,
         }
     },
     methods: {
         // FIXME: redundant method generatePassword()
         generatePassword() {
             let CharacterSet = '';
             let password = '';
             CharacterSet += 'abcdefghijklmnopqrstuvwxyz';
             CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
             CharacterSet += '0123456789';
             CharacterSet += '![]{}()%&*$#^<>~@|';
             for(let i=0; i < 64; i++) {
                 password += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length));
             }
             this.password = password;
         },
     },
 }

</script>


