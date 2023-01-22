<template>
  <div class="d-flex align-items-cente m-auto">
    <div class="row">
      <div class="col-12">
        <h2>Anmelden</h2>
        <div v-if="loginFailed" class="alert alert-danger">Anmeldung fehlgeschlagen</div>
        <form>
          <div class="form-group">
            <input
              id="webDav"
              class="form-control"
              v-model="webDav"
              placeholder="https://your.dav.server.xyz"
            />
          </div>
          <div class="form-group">
            <input
              id="userName"
              class="form-control"
              v-model="userName"
              placeholder="Benutzername"
            />
          </div>
          <div class="form-group">
            <input
              id="password"
              class="form-control"
              v-model="password"
              placeholder="Passwort"
              type="password"
            />
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-primary" v-on:click="login">
              Anmelden
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    // TODO: Add environment variable for default webDav server
    return {
      webDav: process.env.VUE_APP_WEBDAV_URI,
      userName: undefined,
      password: undefined,
      loginFailed: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn();
    },
  },
  methods: {
    async login() {
      const payload = {
        webDav: this.webDav,
        userName: this.userName,
        password: this.password,
      };
      try {
        await this.$store.dispatch("login", payload);
        await this.$store.dispatch("getData");
        this.$router.push({ path: '/' });
      } catch(error) {
        console.error(error);
        this.loginFailed = true;
      }
    },
  },
};
</script>