<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- TODO: Is this :key=... a hacky solution to force reloading on url change? -->
    <!-- source: https://laracasts.com/discuss/channels/vue/vue-2-reload-component-when-same-route-is-requested?page=1 -->
    <router-view :key="$route.fullPath"></router-view>
    <footer id="footer" class="pb-2 pt-4 mt-auto text-center">
      <a href="https://github.com/pascal-huber/VoteLog" target="_blank">VoteLog</a> by
      Pascal Huber
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  props: ["term_hash"],
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn();
    },
    unsavedChanges() {
      return this.$store.getters.unsavedChanges();
    },
  },
};
</script>

<style>
nav {
  margin-bottom: 1rem;
}
</style>
