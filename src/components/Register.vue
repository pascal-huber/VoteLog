<template>
    <div class="row" v-if="!userId" >
        <div class="col">
            <h2>Registrieren</h2>
            <div v-if="error">
                {{ error }}
            </div>
            <form>
                <!-- <div class="form-group">
                     <input id="password" class="form-control" aria-describedby="passwordHelp"
                     v-model="password" placeholder="Schlüsselmaterial" type="password">
                     <small id="passwordHelp" class="form-text text-muted"></small>
                     <input id="password2" class="form-control" aria-describedby="password2Help"
                     v-model="password2" placeholder="nochmals das Schlüsselmaterial" type="password">
                     </div>
                -->
                <button type="button" class="btn btn-primary"
                        v-on:click="register">Registrieren</button>
            </form>
        </div>
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
                    {{ userId  }}
                </div>
            </div>
            <div class="row">
                <div class="col-2">
                    Passwort:
                </div>
                <div class="col-10">
                    {{ password  }}
                </div>
            </div>
            <button type="button" class="btn btn-primary" @click="finalize">Verstanden</button>
        </div>
    </div>
</template>

<script>

 export default {
     data: function(){
         return {
             error: undefined,
         }
     },
     computed: {
         userId(){
             // TODO: don't access state directly in navbar?
             return this.$store.state.user.id
         },
         password(){
             return this.$store.state.user.password
         },
     },
     methods: {
         async register(){
             this.password = await this.$store.dispatch("register");
         },
         finalize(){
             this.$router.push({name: 'login'});
         },
     },
 }
</script>

<style scoped lang="scss">
</style>
