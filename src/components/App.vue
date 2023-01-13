<template>
  <VotesTable v-bind:term="term" />
</template>

<script>
import VotesTable from "@/components/VotesTable.vue";

export default {
  name: "App",
  props: ["term_hash"],
  components: {
    VotesTable,
  },
  data: function(){
    return {
      term: this.$store.getters.getTerm(this.term_hash),
    }
  },
  async beforeMount() {
    // TODO: make this nicer, it is really ugly
    if (!this.$store.getters.isLoggedIn()) {
      await this.$store.dispatch("init");
    }
    if (!this.$store.getters.fetchedData()) {
      await this.$store.dispatch("getData");
    }
  },
};
</script>
