<template>
    <div class="container">
        <div class="row gy-2">
            <div class="col-12">
                <h2>Agreement</h2>
            </div>
            <div class="col-12">
                to be written
            </div>
        </div>
    </div>
</template>

<script>

 export default {
     name: 'Agreement',
     components: {
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
             editSubject: undefined,
             editUserVote: undefined,
         }
     },
     methods: {
     },
 }

</script>


