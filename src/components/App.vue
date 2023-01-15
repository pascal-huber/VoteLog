<template>
    <NavBar
      v-bind:key="term_hash"
      v-bind:loggedIn="loggedIn"
      v-bind:term_hash="term_hash"
      v-bind:unsavedChanges="unsavedChanges"
    />
  <router-view :key="$route.fullPath" v-bind:term="term"></router-view>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  props: ["term_hash"],
  components: {
    NavBar,
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn();
    },
    unsavedChanges() {
      return this.$store.getters.unsavedChanges();
    },
  },
  data: function () {
    return {
      term: this.$store.getters.getTerm(this.term_hash),
    };
  },
  // async beforeMount() {
  //   // TODO: make this nicer, it is really ugly
  //   if (!this.$store.getters.isLoggedIn()) {
  //     await this.$store.dispatch("init");
  //   }
  //   if (!this.$store.getters.fetchedData()) {
  //     await this.$store.dispatch("getData");
  //   }
  // },
};
</script>
