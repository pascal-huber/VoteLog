<template>
  <div class="container">
    <div class="row">
      <div class="col text-center mt-5">
        <h2>{{ $t('error.title') }}</h2>
        <p>{{ $t('error.message') }}</p>
        <button type="button" class="btn btn-primary" @click="retry">
          {{ $t('error.retry') }}
        </button>
        &nbsp;
        <router-link type="button" class="btn btn-outline-primary" :to="homeLink">
          {{ $t('error.home') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  computed: {
    homeLink() {
      return { path: '/' + this.$route.params.locale }
    },
  },
  methods: {
    retry() {
      this.$store.commit('CLEAR_ERROR')
      window.location.reload()
    },
  },
}
</script>
