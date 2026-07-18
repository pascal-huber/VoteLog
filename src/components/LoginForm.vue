<template>
  <div class="d-flex align-items-center m-auto">
    <div class="row">
      <div class="col-12">
        <h2>{{ $t('login.title') }}</h2>
        <div v-if="loginFailed" class="alert alert-danger">{{ $t('login.failed') }}</div>
        <form @submit.prevent="login">
          <div v-if="!customWebDav">
            <span>{{ $t('login.server', { server: defaultWebDav }) }}&nbsp;</span><br />
            <small>
              <a class="link-primary" @click="toggleWebDav">{{ $t('login.useDifferentServer') }}</a>
            </small>
          </div>
          <div v-else>
            <small>
              <a class="link-primary" @click="toggleWebDav">{{ $t('login.useDefaultServer') }}</a>
            </small>
          </div>
          <div v-if="customWebDav" class="form-group">
            <input
              id="webDav"
              v-model="webDav"
              class="form-control"
              :placeholder="$t('login.webDavPlaceholder')"
            />
          </div>
          <div class="form-group">
            <input
              id="userName"
              v-model="userName"
              class="form-control"
              :placeholder="$t('login.usernamePlaceholder')"
            />
          </div>
          <div class="form-group">
            <input
              id="password"
              v-model="password"
              class="form-control"
              :placeholder="$t('login.passwordPlaceholder')"
              type="password"
            />
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary">
              {{ $t('login.submit') }}
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
    return {
      webDav: undefined,
      defaultWebDav: import.meta.env.VITE_WEBDAV_URI,
      userName: undefined,
      password: undefined,
      loginFailed: false,
      customWebDav: false,
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn()
    },
  },
  methods: {
    async login() {
      const payload = {
        webDav: this.customWebDav ? this.webDav : this.defaultWebDav,
        userName: this.userName,
        password: this.password,
      }
      try {
        await this.$store.dispatch('login', payload)
        await this.$store.dispatch('getData')
        this.$router.push({ name: 'localeHome', params: { locale: this.$route.params.locale } })
      } catch (error) {
        console.error(error)
        this.loginFailed = true
      }
    },
    toggleWebDav() {
      this.customWebDav = !this.customWebDav
    },
  },
}
</script>
