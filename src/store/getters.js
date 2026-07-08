const getters = {
  fetchedData: (state) => () => state.fetchedData,
  getClient: (state) => () => state.client,
  getSubjectByHash: (state) => (term_hash, subject_id) => {
    let term = state.terms.find((term) => term.hash == term_hash)
    return term?.subjects.find((subject) => subject.id == subject_id)
  },
  getTerms: (state) => () => state.terms,
  getTerm: (state) => (term_hash) => {
    let thash = term_hash
    if (!thash) {
      // FIXME: compute defaultTermHash
      thash = '2019_23'
    }
    return state.terms.find((term) => term.hash == thash)
  },
  // FIXME: check expired tokens
  // isTokenExpired(state) {
  //     if (!state.tokenExpiresAt) return true;
  //     return Date.now() >= state.tokenExpiresAt;
  // },
  // tokenExpiresSoon:
  //     (state) =>
  //     (marginMs = 30_000) => {
  //         if (!state.tokenExpiresAt) return true;
  //         return Date.now() >= state.tokenExpiresAt - marginMs;
  //     },
  getNextTermHash: (state) => (term_id) => state.terms.find((term) => term.id == term_id + 1)?.hash,
  getPrevTermHash: (state) => (term_id) => state.terms.find((term) => term.id == term_id - 1)?.hash,
  getTermHash: (state) => () => state.votes[2].hash,
  getUserName: (state) => () => state.userName,
  getUserVotes: (state) => () => state.userVotes,
  getUserVote: (state) => (subjectId) => state.userVotes?.find((vote) => vote.id == subjectId),
  getError: (state) => () => state.error,
  hasFetchedData: (state) => () => !!state.fetchedData,
  isLoggedIn: (state) => () => state.client != undefined,
  unsavedChanges: (state) => () => state.unsavedChanges,
}

export default getters
