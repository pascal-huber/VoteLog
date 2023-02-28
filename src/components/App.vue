<template>
  <div>
    <NavBar
      v-bind:key="term_hash"
      v-bind:loggedIn="loggedIn"
      v-bind:term_hash="term_hash"
      v-bind:unsavedChanges="unsavedChanges"
    />
    <router-view :key="$route.fullPath" v-bind:term="term"></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  props: ["term_hash", "subject_id"],
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
};
</script>

<style>

@include media-breakpoint-up(md) {
  body {
    margin: 0px;
  }
}
</style>
