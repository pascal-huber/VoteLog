<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBar v-bind:loggedIn="loggedIn" v-bind:unsavedChanges="unsavedChanges" />
    <!-- TODO: Is this :key=... a hacky solution to force reloading on url change? -->
    <!-- source: https://laracasts.com/discuss/channels/vue/vue-2-reload-component-when-same-route-is-requested?page=1 -->
    <router-view :key="$route.fullPath"></router-view>
    <footer id="footer" class="py-2 mt-auto bg-light text-center">
      <a href="https://github.com/pascal-huber/votey-vue" target="_blank">Votey</a> by
      Pascal Huber
    </footer>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  computed: {
    // TODO: this is probably not the nice way to do stuff
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
