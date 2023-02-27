<template>
  <div class="row" @click="showDetails">
    <div class="col-12 col-lg-6">
      <div class="d-flex">
        <div class="order-lg-2 me-auto p-0 px-lg-2">
          <span :class="{ 'text-secondary': this.userVote?.importance == 0 }">
            {{ subject.name }}
          </span>
        </div>
        <div class="importance-cell">
          <ImportanceSymbol v-bind:importance="userVote?.importance" />
        </div>
        <div class="date-cell">
          <small class="datetext"
            >&nbsp;{{ ("0" + (subject.date.getMonth() + 1)).slice(-2) }}/{{
              subject.date.getFullYear().toString().substring(2)
            }}</small
          >
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6 order-3">
      <div class="row">
        <!-- Switzerland -->
        <div class="col svg-col" align="center" v-bind:class="classSwiss">
          <img :src="Ja" v-if="subject.outcome == Answer.Yes" class="svg-logo" />
          <img :src="Nein" v-else-if="subject.outcome == Answer.No" class="svg-logo" />
          <font-awesome-icon v-else class="neutral" :icon="['fas', 'question']" />
        </div>

        <!-- Me -->
        <div class="col svg-col" align="center">
          <font-awesome-icon
            v-if="userVote == undefined"
            class="neutral"
            :icon="['fas', 'question']"
          />
          <img :src="Ja" class="svg-logo" v-else-if="userVote.answer == Answer.Yes" />
          <img :src="Nein" class="svg-logo" v-else-if="userVote.answer == Answer.No" />
          <img
            :src="Abstention"
            class="svg-logo"
            v-else-if="userVote.answer == Answer.Abstention"
          />
          <font-awesome-icon v-else class="neutral" :icon="['fas', 'question']" />
        </div>

        <!-- Parties -->
        <!-- TODO: make sure they are in the right order -->
        <div
          class="col svg-col"
          align="center"
          v-for="(party, i) in this.subject.parties"
          v-bind:key="party"
          v-bind:class="partyAnswers[i].answerClass"
        >
          <img :src="Ja" class="svg-logo" v-if="partyAnswers[i].answer == Answer.Yes" />
          <img
            :src="Nein"
            class="svg-logo"
            v-else-if="partyAnswers[i].answer == Answer.No"
          />
          <img
            :src="Abstention"
            class="svg-logo"
            v-else-if="partyAnswers[i].answer == Answer.Abstention"
          />
          <font-awesome-icon
            v-else-if="partyAnswers[i].answer == Answer.Novote"
            class="neutral"
            :icon="['fas', 'times']"
          />
          <font-awesome-icon v-else :icon="['fas', 'question']" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Answer } from "../Answer.js";
import Novote from "@/assets/novote.svg";
import Ja from "@/assets/ja.svg";
import Abstention from "@/assets/abstention.svg";
import ImportanceSymbol from "@/components/ImportanceSymbol.vue";
import Nein from "@/assets/nein.svg";
import T0x from "@/assets/0x.svg";
import T1x from "@/assets/1x.svg";
import T2x from "@/assets/2x.svg";
import T4x from "@/assets/4x.svg";

export default {
  name: "VotesTableSubject",
  props: ["subject", "userVote", "term_hash", "loggedIn"],
  setup() {
    return {
      Answer,
      Novote,
      Ja,
      Abstention,
      Nein,
      T0x,
      T1x,
      T2x,
      T4x,
    };
  },
  components: {
    FontAwesomeIcon,
    ImportanceSymbol,
  },
  computed: {
    classSwiss() {
      return this.classAgreement(this.userVote?.answer, this.subject.outcome);
    },
    partyAnswers() {
      var answers = [];
      for (let vote of this.subject.parties) {
        var voteClass = this.classAgreement(this.userVote?.answer, vote.answer);
        answers.push({ answer: vote?.answer, answerClass: voteClass });
      }
      return answers;
    },
  },
  methods: {
    showDetails() {
      if (this.loggedIn) {
        this.$router.push({
          name: "showSubject",
          params: {
            term_hash: this.term_hash,
            subject_id: this.subject.id,
          },
        });
      }
    },
    classAgreement(userVote, otherVote) {
      if (otherVote == undefined || userVote == undefined) {
        return "neutral";
      } else if (otherVote == userVote) {
        return "agree";
      } else if (otherVote == Answer.Abstention || userVote == Answer.Abstention) {
        return "semiagree";
      } else {
        return "disagree";
      }
    },
  },
};
</script>

<style lang="scss">
@import "colors.scss";

// .votecard:hover {
//   cursor: pointer;
// }

.datetext {
  color: gray;
}

.subject-title {
  display: block !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.importance {
  color: $red;
}

.date-cell {
  flex-basis: 40px;
  flex-grow: 0;
  flex-shrink: 0;
}

.importance-cell {
  flex-basis: 20px;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
