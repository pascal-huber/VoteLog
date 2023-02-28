<template>
    <div class="d-flex align-items-center m-auto">
        <div class="row">
            <div class="col-12">
                <h2>Anmelden</h2>
                <div v-if="loginFailed" class="alert alert-danger">Anmeldung fehlgeschlagen</div>
                <form>
                    <div v-if="!customWebDav">
                        <span>server: {{ defaultWebDav }}&nbsp;</span><br />
                        <small>
                            <a class="link-primary" @click="toggleWebDav">use different server</a>
                        </small>
                    </div>
                    <div v-else>
                        <small>
                            <a class="link-primary" @click="toggleWebDav">use default server</a>
                        </small>
                    </div>
                    <div v-if="customWebDav" class="form-group">
                        <input
                            id="webDav"
                            v-model="webDav"
                            class="form-control"
                            placeholder="https://your.dav.server.xyz"
                        />
                    </div>
                    <div class="form-group">
                        <input id="userName" v-model="userName" class="form-control" placeholder="Benutzername" />
                    </div>
                    <div class="form-group">
                        <input
                            id="password"
                            v-model="password"
                            class="form-control"
                            placeholder="Passwort"
                            type="password"
                        />
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-primary" @click="login">Anmelden</button>
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
            defaultWebDav: process.env.VUE_APP_WEBDAV_URI,
            userName: undefined,
            password: undefined,
            loginFailed: false,
            customWebDav: false,
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
                webDav: this.customWebDav ? this.webDav : this.defaultWebDav,
                userName: this.userName,
                password: this.password,
            };
            try {
                await this.$store.dispatch('login', payload);
                await this.$store.dispatch('getData');
                this.$router.push({ path: '/' });
            } catch (error) {
                console.error(error);
                this.loginFailed = true;
            }
        },
        toggleWebDav() {
            this.customWebDav = !this.customWebDav;
        },
    },
};
</script>
