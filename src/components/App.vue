<template>
    <div>
        <NavBar
            :key="term_hash"
            :logged-in="loggedIn"
            :term_hash="term_hash"
            :unsaved-changes="unsavedChanges"
        />
        <router-view :key="$route.fullPath" :term="term"></router-view>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
    name: 'App',
    components: {
        NavBar,
    },
    props: ['term_hash', 'subject_id'],
    data: function () {
        return {
            term: this.$store.getters.getTerm(this.term_hash),
        };
    },
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
@include media-breakpoint-up(md) {
    body {
        margin: 0px;
    }
}
</style>
