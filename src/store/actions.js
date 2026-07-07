import { createClient, AuthType } from 'webdav';
import { Answer } from '@/Answer.js';
import router from '@/router.js';
import { fetchToken, computeExpiresAt, persistSession } from './token.js';

const actions = {
    restoreSession(context) {
        const userName = sessionStorage.getItem('userName');
        const webDav = sessionStorage.getItem('webDav');
        const idToken = sessionStorage.getItem('idToken');
        const expiresAt = Number(sessionStorage.getItem('tokenExpiresAt'));

        if (!userName || !webDav || !idToken || !expiresAt) return;

        console.log('Restoring Session (unless expired)');
        if (Date.now() >= expiresAt) {
            sessionStorage.clear();
            return;
        }

        const client = createClient(webDav, {
            authType: AuthType.Token,
            token: { token_type: 'Bearer', access_token: idToken },
        });

        context.commit('SET_CLIENT', client);
        context.commit('SET_USER_NAME', userName);
        context.commit('SET_WEBDAV', webDav);
        context.commit('SET_TOKEN_EXPIRES_AT', expiresAt);

        context.dispatch('getData');
    },
    async login(context, credentials) {
        const tokenData = await fetchToken(
            credentials.userName,
            credentials.password,
        );
        const expiresAt = computeExpiresAt(tokenData.expires_in);

        const client = createClient(credentials.webDav, {
            authType: AuthType.Token,
            token: {
                token_type: 'Bearer',
                access_token: tokenData.id_token, // JWT — locally verifiable by Apache
            },
        });

        context.commit('SET_CLIENT', client);
        context.commit('SET_USER_NAME', credentials.userName);
        context.commit('SET_WEBDAV', credentials.webDav);
        context.commit('SET_TOKEN_EXPIRES_AT', expiresAt);

        persistSession(
            credentials.userName,
            credentials.webDav,
            tokenData.id_token,
            expiresAt,
        );
    },
    async getData(context) {
        if (context.getters.isLoggedIn()) {
            try {
                const client = context.getters.getClient();
                const userName = context.getters.getUserName();
                const content = await client.getFileContents(
                    '/votelog_' + userName + '.json',
                    {
                        format: 'text',
                    },
                );
                context.commit('SET_DATA', { votes: JSON.parse(content) });
            } catch (error) {
                if (error.status == '404') {
                    console.log('Status 404, must be a new user! *excited*');
                    console.log('hi <3');
                    console.log(
                        'Let me create an empty file for you, just to ensure your WebDAV works.',
                    );
                    context.commit('SET_DATA', { votes: [] });
                    context.dispatch('sendData');
                } else {
                    console.log('Failed to fetch data.');
                    console.log(error);
                    throw new Error(
                        'Failed to fetch your data, sorry:' + error,
                    );
                }
            }
        }
    },
    async sendData(context) {
        const client = context.getters.getClient();
        let data = JSON.stringify(context.getters.getUserVotes());
        const userName = context.getters.getUserName();
        // FIXME: storing data can go wrong, handle different types of errors
        await client.putFileContents('/votelog_' + userName + '.json', data, {
            contentLength: false,
            overwrite: true,
        });
        context.commit('UNSET_UNSAVEDCHANGES');
    },
    setVote(context, vote) {
        console.log('set vote: ' + JSON.stringify(vote));
        const index = this.state.userVotes.findIndex((e) => e.id == vote.id);
        if (vote.answer == Answer.Novote && vote.reasoning == undefined) {
            if (index !== -1) {
                context.commit('DELETE_VOTE', index);
            } else {
                context.commit('SET_UNSAVEDCHANGES');
            }
            return;
        } else if (index !== -1) {
            context.commit('UPDATE_VOTE', { index: index, vote: vote });
        } else {
            console.log('ADD_VOTE');
            context.commit('ADD_VOTE', vote);
        }
        context.dispatch('sendData');
    },
    logout(context) {
        sessionStorage.clear();
        context.commit('LOGOUT');
        router.push({ path: '/' });
    },
};

export default actions;
