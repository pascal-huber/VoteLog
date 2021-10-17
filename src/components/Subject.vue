<template>

    <div class="container">

        <router-view v-if="!!subject"
                     :hash="this.hash"
                     :subject="this.subject"
                     :userVote="this.userVote"></router-view>
    </div>

</template>

<script>

 export default {
     name: 'Subject',
     // props: ['subject', 'userVote'],
     props: ['hash'],
     data: function(){
         return {
             subject: undefined,
             userVote: undefined,
         }
     },
     mounted: function(){
         this.subject = this.$store.getters.getSubjectByHash(this.hash);
         this.userVote = this.$store.getters.getUserVote(this.subject.id);
     },
 }
</script>
