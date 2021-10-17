<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h2>Anmelden</h2>

                <div v-if="loginFailed" class="alert alert-danger">
                    Login fehlgeschlagen
                </div>

                <form>
                    <div class="form-group">
                        <input id="logUserId" class="form-control"
                               v-model="userId" placeholder="Benutzer ID">
                    </div>
                    <div class="form-group">
                        <input id="password" class="form-control"
                               v-model="password" placeholder="Verschlüsselungspasswort" type="password">
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
    </div>
</template>

<script>

 export default {
     data: function(){
         return {
             userId: undefined,
             password: undefined,
             loginFailed: false,
         }
     },
     computed: {
         loggedIn(){
             return this.$store.state.user.loggedIn;
         }
     },
     methods: {
         async login(){
             const payload = {
                 userId: this.userId,
                 password: this.password
             };
             try {
                 await this.$store.dispatch("getData", payload);
             } catch {
                 this.loginFailed = true;
             }
         },
     },
 }
</script>
