<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <div>
        <router-link to="/" class="navbar-brand" href="">Votelog</router-link>
        <!-- <router-link to="/agreement" type="button" class="btn" href="">agreement</router-link> -->
      </div>
      <div v-if="!this.loggedIn">
        <div>
          <router-link type="button" class="btn" to="/login">Anmelden</router-link>
        </div>
      </div>
      <div v-if="this.loggedIn">
        <div>
          <a type="buton" class="btn" v-if="this.unsavedChanges" @click="saveChanges">
            <font-awesome-icon class="fa" :icon="['fas', 'save']" />
          </a>
          <a type="buton" class="btn" @click="logout">
            <font-awesome-icon class="fa" :icon="['fas', 'power-off']" />
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "NavBar",
  props: ["loggedIn", "unsavedChanges"],
  components: {
    FontAwesomeIcon,
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    saveChanges() {
      this.$store.dispatch("sendData");
    },
  },
};
</script>
