const mutations = {
    SET_DATA(state, payload) {
        state.userVotes = payload.votes;
        state.fetchedData = true;
    },
    SET_CONNECTION(state, payload) {
        state.connection = payload;
    },
    SET_CLIENT(state, client) {
        state.client = client;
    },
    SET_UNSAVEDCHANGES(state) {
        state.unsavedChanges = true;
    },
    UNSET_UNSAVEDCHANGES(state) {
        state.unsavedChanges = false
    },
    UPDATE_VOTE(state, payload) {
        state.userVotes.splice(payload.index, 1, payload.vote)
        state.unsavedChanges = true
    },
    ADD_VOTE(state, vote) {
        state.userVotes = [...state.userVotes, vote];
        state.unsavedChanges = true
    },
    // SET_PERIOD(state, i){
    //   state.period.setFullYear(state.period.getFullYear() + i);
    // },
    DELETE_VOTE(state, index) {
        state.userVotes.splice(index, 1);
        state.unsavedChanges = true;
    },
    LOGOUT(state) {
        state.client = undefined;
        state.userVotes = undefined;
        state.connection = undefined;
    },
};

export default mutations;