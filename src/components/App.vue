<template>
  <VotesTable />
</template>

<script>
import VotesTable from "@/components/VotesTable.vue";

export default {
  name: "App",
  components: {
    VotesTable,
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
