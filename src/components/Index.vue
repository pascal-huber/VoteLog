<template>
    <div class="d-flex flex-column min-vh-100">
        <!-- TODO: Is this :key=... a hacky solution to force reloading on url change? -->
        <!-- source: https://laracasts.com/discuss/channels/vue/vue-2-reload-component-when-same-route-is-requested?page=1 -->
        <router-view :key="$route.fullPath"></router-view>
        <footer id="footer" class="pb-2 pt-4 mt-auto text-center">
            <a href="https://github.com/pascal-huber/votelog">VoteLog</a>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'TheIndex',
};
</script>

<style>
nav {
    margin-bottom: 1rem;
}
</style>
