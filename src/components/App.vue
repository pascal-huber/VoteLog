<template>
    <div>
        {{ $route.params[$route.meta.watchParam] }}
        <!-- redraw navBar when fullPath changes -->
        <NavBar
            :key="$route.fullPath"
            :logged-in="loggedIn()"
            :unsaved-changes="unsavedChanges()"
            :term_hash="term_hash"
        />
        <!-- redraw view when term_hash changes -->
        <router-view :key="term_hash" :term="term"></router-view>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
export default {
    name: 'App',
    components: {
        NavBar,
    },
    props: ['term_hash'],
    data: function () {
        return {
            term: this.$store.getters.getTerm(this.term_hash),
        };
    },
    beforeMount() {
        console.log('mounting App.vue');
    },
    methods: {
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
@include media-breakpoint-up(md) {
    body {
        margin: 0px;
    }
}
</style>
