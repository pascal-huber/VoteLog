const getters = {
  fetchedData: (state) => () => state.fetchedData,
  getClient: (state) => () => state.client,
  getSubjectByHash: (state) => (term_hash, subject_id) => {
    let term = state.terms.find((term) => term.hash == term_hash)
    return term?.subjects.find((subject) => subject.id == subject_id)
  },
  getTerm: (state) => (term_hash) => state.terms.find((term) => term.hash == term_hash),
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
  getNextTermHash: (state) => (term_hash) => state.terms.find((term) => term.hash == term_hash)?.nextHash,
  getPrevTermHash: (state) => (term_hash) => state.terms.find((term) => term.hash == term_hash)?.prevHash,
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
