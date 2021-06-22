<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="">Votey</a>
            <span class="navbar-text small" v-if="userId">
                ID: {{ userId }}
            </span>
            <button v-if="$store.state.unsavedChanges"
                    class="btn btn-outline-success"
                    @click="saveChanges"
                    type="submit">
                Save
            </button>
            <span v-else class="navbar-text small"></span>
        </div>
    </nav>
</template>

<script>

 import { encryptData }  from '../crypto.js'


 export default {
     name: 'NavBar',
     computed: {
         userId(){
             return this.$store.state.user.id
         },
     },
     methods: {
         saveChanges(){
             const data = this.$store.state.votes;
             const aesKey = this.$store.state.user.aesKey;
             encryptData(aesKey, data)
                 .then((encryptedData) => {
                     const payload = {
                         uuid: this.$store.state.user.id,
                         data: encryptedData,
                     }
                     this.$store.dispatch("sendData", payload);
                 });
         }
     }
 }
</script>
