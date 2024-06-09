const getters = {
    fetchedData: (state) => () => state.fetchedData,
    getClient: (state) => () => state.client,
    getSubjectByHash: (state) => (term_hash, subject_id) => {
        let term = state.terms.find((term) => term.hash == term_hash);
        return term?.subjects.find((subject) => subject.id == subject_id);
    },
    getTerms: (state) => () => state.terms,
    getTerm: (state) => (termHash) => {
        const term = state.terms.find((term) => term.hash == termHash);
        return term;
    },
    getTermHash: (state) => () => state.termHash,
    getDefaultTerm: (state) => () => {
        return state.terms.sort((a, b) => a.id < b.id)[0];
    },
    getNextTermHash: (state) => (term_id) =>
        state.terms.find((term) => term.id == term_id + 1)?.hash,
    getPrevTermHash: (state) => (term_id) =>
        state.terms.find((term) => term.id == term_id - 1)?.hash,
    getConnection: (state) => () => state.connection,
    getUserVotes: (state) => () => state.userVotes,
    getUserVote: (state) => (subjectId) =>
        state.userVotes?.find((vote) => vote.id == subjectId),
    getError: (state) => () => state.error,
    hasFetchedData: (state) => () => !!state.fetchedData,
    isLoggedIn: (state) => () => state.client != undefined,
    unsavedChanges: (state) => () => state.unsavedChanges,
};

export default getters;
