<template>
    <div class="d-flex align-items-center m-auto">
        <div class="row">
            <div class="col-12">
                <h2>Anmelden</h2>
                <div v-if="loginFailed" class="alert alert-danger">
                    Anmeldung fehlgeschlagen
                </div>
                <form>
                    <div class="form-group">
                        <input
                            id="webDav"
                            v-model="webDav"
                            class="form-control"
                            value="VUE_APP_WEBDAV_URI"
                            placeholder="https://your.dav.server.xyz"
                        />
                    </div>
                    <div class="form-group">
                        <input
                            id="userName"
                            v-model="userName"
                            class="form-control"
                            placeholder="Benutzername"
                        />
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
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="login"
                        >
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
