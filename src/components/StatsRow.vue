<template>
  <div class="row votecard">
    <div class="col-12 col-lg-6">Übereinstimmung</div>
    <div class="col-12 col-lg-6">
      <div class="row">
        <PercentageValue v-bind:percentage="swissAgreement" v-bind:color="true" />
        <PercentageValue v-bind:percentage="'-'" v-bind:color="false" />
        <PercentageValue
          v-for="party in parties"
          v-bind:key="party"
          v-bind:percentage="partyAgreement(party.name)"
          v-bind:color="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Answer } from "@/Answer.js";
import PercentageValue from "@/components/PercentageValue.vue";

export default {
  name: "VotesTable",
  props: ["parties", "subjects", "category"],
  components: {
    PercentageValue,
  },
  computed: {
    swissAgreement() {
      let ctr = 0.0;
      let userVotes = 0;
      for (var i = 0; i < this.subjects.length; i++) {
        let vote = this.subjects[i];
        // console.log(vote);
        let userVote = this.$store.getters.getUserVote(vote.id);
        if (!userVote) {
          continue;
        }
        if (userVote.answer == vote.outcome) {
          ctr++;
        }
        if (userVote.answer == Answer.Abstention) {
          ctr += 0.5;
        }
        if (userVote.answer != Answer.Novote) {
          userVotes++;
        }
      }
      return Math.round((ctr / userVotes) * 100);
    },
  },
  methods: {
    partyAgreement(party) {
      let agreement = 0.0;
      let userVotes = 0;
      for (var i = 0; i < this.subjects.length; i++) {
        let vote = this.subjects[i];
        let userVote = this.$store.getters.getUserVote(vote.id);
        if (!userVote) {
          continue;
        }
        let partyVote = vote.parties.find((partyVote) => partyVote.id == party);
        if (!partyVote) {
          continue;
        }
        if (userVote.answer == partyVote.answer) {
          agreement++;
        } else if (userVote.answer == Answer.Abstention) {
          agreement += 0.5;
        }

        if (userVote.answer != Answer.Novote) {
          userVotes++;
        }
      }
      return Math.round(100 * (agreement / userVotes));
    },
  },
};
</script>

<style>
/* .ja-nein {
    width: 40px;
    height: 30px;
    padding: 0;
    } */
.votecard:hover {
  cursor: pointer;
}

.datetext {
  color: gray;
}

.subject-title {
  display: block !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
