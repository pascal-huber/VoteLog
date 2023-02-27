
export const Answer = Object.freeze({
  No: 0,
  Yes: 1,
  Abstention: 2,
  Novote: 3,
});


export function partyAgreement(party, userVotes, subjects) {
  if(!userVotes){
    return undefined;
  }
  var ctr = 0;
  var agreement = 0.0;
  for (var i = 0; i < subjects.length; i++) {
    let userVote = userVotes.find((v) => v.id == subjects[i].id);
    if (!userVote || userVote.answer == Answer.Novote) {
      continue;
    }
    let partyVote = subjects[i].parties.find((p) => p.id == party);
    if (!partyVote) {
      continue;
    }
    let importance = userVote.importance || 1;
    ctr += importance;
    if (userVote.answer == partyVote.answer) {
      agreement += importance;
    } else if (userVote.answer == Answer.Abstention) {
      agreement += 0.5 * importance;
    }
  }
  if(ctr == 0){
    return undefined;
  }
  return Math.round(100 * (agreement / ctr));
}

export function swissAgreement(subjects, userVotes) {
  if(!userVotes){
    return undefined;
  }
  let agreement = 0.0;
  let ctr = 0;
  for (var i = 0; i < subjects.length; i++) {
    let vote = subjects[i];
    let userVote = userVotes.find((v) => v.id == subjects[i].id);
    if (!userVote) {
      continue;
    }
    if (userVote.answer == vote.outcome) {
      agreement++;
    }
    if (userVote.answer == Answer.Abstention) {
      agreement += 0.5;
    }
    if (userVote.answer != Answer.Novote) {
      ctr++;
    }
  }
  if(ctr == 0){
    return undefined;
  }
  return Math.round(100 * (agreement / ctr));
}