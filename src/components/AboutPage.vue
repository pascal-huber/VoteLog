<template>
    <div class="container">
        <div class="d-flex align-items-center m-auto">
            <div class="row">
                <div class="col-12">
                    <h2>VoteLog</h2>
                    <a href="https://github.com/pascal-huber/votelog"
                        >source code</a
                    >
                </div>
            </div>
        </div>
    </div>
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
        /* margin: 0px; */
    }
}
</style>
