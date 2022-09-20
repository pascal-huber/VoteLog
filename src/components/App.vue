<template>
    <VotesTable/>
</template>

<script>
 import VotesTable from '@/components/VotesTable.vue'

 export default {
     name: 'App',
     components: {
         VotesTable,
     },
     async beforeMount(){
         let userId = this.$store.getters.getUserId();
         if(!userId){
            await this.$store.dispatch("init");
            let userId = this.$store.getters.getUserId();
            if(userId){
                await this.$store.dispatch("getData", {
                    userId: userId,
                });
            }
         }
     },
 }
</script>
