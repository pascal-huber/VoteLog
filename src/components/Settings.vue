<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h2>Download Votes</h2>
            </div>
        </div>
        <form class="row gy-2">
            <div class="col col-12">
                <button type="button" class="btn btn-secondary" v-on:click="downloadVotes">
                    Download
                </button>
            </div>
        </form>
    </div>
</template>

<script>

 export default {
     name: 'Agreement',
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
         downloadVotes() {
            // credit: https://www.bitdegree.org/learn/javascript-download
            let votes = this.$store.getters.getUserVotes();
            let text = JSON.stringify(votes);
            let filename = 'votes.json';

            let element = document.createElement('a');
            element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();
            document.body.removeChild(element);     
        }
     },
 }

</script>


