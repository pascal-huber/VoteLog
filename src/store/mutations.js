const mutations = {
  SET_DATA(state, payload) {
    state.userVotes = payload.votes
    state.fetchedData = true
  },
  SET_TOKEN_EXPIRES_AT(state, expiresAt) {
    state.tokenExpiresAt = expiresAt
  },
  SET_USER_NAME(state, payload) {
    state.userName = payload
  },
  SET_WEBDAV(state, payload) {
    state.webDav = payload
  },
  SET_CLIENT(state, client) {
    state.client = client
  },
  SET_UNSAVEDCHANGES(state) {
    state.unsavedChanges = true
  },
  UNSET_UNSAVEDCHANGES(state) {
    state.unsavedChanges = false
  },
  UPDATE_VOTE(state, payload) {
    state.userVotes.splice(payload.index, 1, payload.vote)
    state.unsavedChanges = true
  },
  ADD_VOTE(state, vote) {
    state.userVotes = [...state.userVotes, vote]
    state.unsavedChanges = true
  },
  DELETE_VOTE(state, index) {
    state.userVotes.splice(index, 1)
    state.unsavedChanges = true
  },
  LOGOUT(state) {
    console.log('LOGOUT')
    state.client = undefined
    state.webDav = undefined
    state.userName = undefined
    state.error = undefined
    state.fetchedData = false
    state.userVotes = undefined
    state.unsavedChanges = false
  },
}

export default mutations
