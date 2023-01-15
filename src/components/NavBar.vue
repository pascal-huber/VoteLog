<template>
  <nav class="navbar navbar-light navbar-expand bg-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand" href="">Votey</router-link>
      <ul v-if="this.termHash()" class="navbar-nav me-auto">
        <li class="nav-item">
          <router-link
            :to="{
              name: 'votesTable',
              params: { term_hash: termHash() },
            }"
            type="a"
            :class="{ 'nav-link': true, active: this.$route.name == 'votesTable' }"
            href=""
          >
            votelog
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{
              name: 'analysis',
              params: { term_hash: termHash() },
            }"
            type="a"
            :class="{ 'nav-link': true, active: this.$route.name == 'analysis' }"
            href=""
          >
            analysis
          </router-link>
        </li>
      </ul>
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
  props: ["loggedIn", "unsavedChanges", "term_hash"],
  // loggedIn: Boolean,
  // unsavedChanges: Boolean,
  // term_hash: String,
  // },
  components: {
    FontAwesomeIcon,
  },
  computed: {},
  methods: {
    // term(){
    //   return this.$store.getters.getTerm(this.term_hash);
    // },
    termHash() {
      // TODO: make this nicer
      return this.$store.getters.getTerm(this.term_hash)?.hash; // || this.$store.getters.getTerm(undefined)?.term_hash;
    },
    logout() {
      this.$store.dispatch("logout");
    },
    saveChanges() {
      this.$store.dispatch("sendData");
    },
  },
};
</script>
