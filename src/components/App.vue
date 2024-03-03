<template>
    <router-view :key="$route.fullPath" :term="term"></router-view>
</template>

<script>
export default {
    name: 'App',
    props: ['term_hash', 'subject_id'],
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
