export const Answer = Object.freeze({
    No: 0,
    Yes: 1,
    Abstention: 2,
    Novote: 3,
});

function agreementValue(otherAnswer, userAnswer, factor) {
    if (userAnswer == otherAnswer) return factor;
    if (userAnswer == Answer.Abstention || otherAnswer == Answer.Abstention)
        return 0.5 * factor;
    return 0.0;
}

export function categoryAgreement(userVotes, subjects) {
    if (!subjects) return undefined;
    var ctr = {};
    var agreement = {};
    for (var i = 0; i < subjects.length; i++) {
        const userVote = userVotes?.find((v) => v.id == subjects[i].id);
        const importance = userVote?.importance || 1;
        const categories = [
            ...new Set(subjects[i].categories?.map((cat) => cat[0])),
        ];
        for (var ii = 0; ii < categories.length; ii++) {
            updateCategorySubject(categories[ii]);
            updateAgreementCount(categories[ii], importance, userVote);
        }
    }
    computePercentages();
    return agreement;

    function computePercentages() {
        for (var category in agreement) {
            for (var party in agreement[category]['parties']) {
                agreement[category]['parties'][party] = Math.round(
                    100 *
                        (agreement[category]['parties'][party] / ctr[category])
                );
            }
            agreement[category]['swiss'] = Math.round(
                100 * (agreement[category]['swiss'] / ctr[category])
            );
        }
    }

    function updateCategorySubject(category) {
        agreement[category] ??= {};
        agreement[category]['subjects'] ??= [];
        agreement[category]['subjects'].push(subjects[i]);
    }

    function updateAgreementCount(category, importance, userVote) {
        agreement[category]['parties'] ??= {};
        ctr[category] ??= 0;
        ctr[category] +=
            userVote && userVote.answer != Answer.Novote ? importance : 0;
        for (var iii = 0; iii < subjects[i].parties.length; iii++) {
            const partyVote = subjects[i].parties[iii];
            agreement[category]['parties'][partyVote.id] ??= 0;
            agreement[category]['parties'][partyVote.id] +=
                userVote && userVote.answer != Answer.Novote
                    ? agreementValue(
                          partyVote.answer,
                          userVote?.answer,
                          importance
                      )
                    : 0;
        }
        agreement[category]['swiss'] ??= 0;
        agreement[category]['swiss'] += agreementValue(
            userVote?.answer,
            subjects[i].outcome,
            importance
        );
    }
}

export function agreement(subjects, userVotes, party = undefined) {
    if (!userVotes || !subjects) return undefined;
    var ctr = 0;
    var agreement = 0.0;
    for (var i = 0; i < subjects.length; i++) {
        const [sctr, sagreement] = agreementChange(
            subjects[i],
            userVotes,
            party
        );
        agreement += sagreement;
        ctr += sctr;
    }
    if (ctr == 0) return undefined;
    return Math.round(100 * (agreement / ctr));

    function agreementChange(subject, userVotes, party) {
        let userVote = userVotes.find((v) => v.id == subject.id);
        if (!userVote || userVote.answer == Answer.Novote) return [0, 0];
        let otherAnswer = party
            ? subject.parties.find((p) => p.id == party)?.answer
            : subject.outcome;
        if (otherAnswer == undefined) return [0, 0];
        let importance = userVote.importance || 1;
        return [
            importance,
            agreementValue(otherAnswer, userVote.answer, importance),
        ];
    }
}
