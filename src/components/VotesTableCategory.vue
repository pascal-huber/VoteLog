<template>
  <div :id="accordionId">
    <span :id="headerCategory">
      <span
        data-bs-toggle="collapse"
        :data-bs-target="htCategory"
        aria-expanded="false"
        :aria-controls="categoryId"
      >
        <div class="row votecard">
          <div class="col-12 col-lg-6">{{ category }}</div>
          <div class="col-12 col-lg-6">
            <div class="row">
              <Percentage
                v-bind:percentage="swissAgreementCategory(category)"
                v-bind:color="true"
              />
              <Percentage v-bind:percentage="'-'" v-bind:color="false" />
              <Percentage
                v-for="party in this.parties"
                v-bind:key="party"
                v-bind:percentage="partyAgreementCategory(party.name, category)"
                v-bind:color="true"
              />
            </div>
          </div>
        </div>
      </span>
    </span>
    <div
      :id="categoryId"
      class="accordion-collapse collapse"
      :aria-labelledby="headerCategory"
      :data-bs-parent="htAccordionId"
    >
      <div class="row votecard">
        <div v-for="subject in subjects" v-bind:key="subject.id">
          <VotesTableSubject
            v-bind:term_hash="term_hash"
            v-bind:loggedIn="this.loggedIn"
            v-bind:userVote="userVote(subject.id)"
            v-bind:subject="subject"
          />
        </div>
      </div>
    </div>

    <!-- <div class="col-12 col-lg-6">{{ category }}</div>
    <div class="col-12 col-lg-6">
      <div class="row">
        <div class="col svg-col" align="center">some</div>
        <div class="col svg-col" align="center">
          100%
        </div>
        <div
          class="col svg-col"
          align="center"
          v-for="party in this.parties"
          v-bind:key="party"
        >
          some
        </div>
      </div>
    </div>
    <div v-for="subject in subjects" v-bind:key="subject.id">
      <VotesTableSubject
        v-bind:term_hash="term_hash"
        v-bind:loggedIn="this.loggedIn"
        v-bind:userVote="userVote(subject.id)"
        v-bind:subject="subject"
      />
    </div> -->
  </div>
</template>

<script>
import { Answer } from "@/Answer.js";
import Percentage from "@/components/Percentage.vue";
// import Ja from "@/assets/ja.svg";
// import Nein from "@/assets/nein.svg";
// import Abstention from "@/assets/abstention.svg";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VotesTableSubject from "@/components/VotesTableSubject.vue";

const regex = /[^A-Za-z0-9]/g;

export default {
  name: "VotesTableCategory",
  props: ["category", "parties", "subjects", "term_hash", "loggedIn"],
  // setup() {
  //   return {
  //     Abstention,
  //     Answer,
  //     Ja,
  //     Nein,
  //   };
  // },
  components: {
    // FontAwesomeIcon,
    Percentage,
    VotesTableSubject,
  },
  computed: {
    // TODO: redundant function userVote
    htCategory() {
      return "#" + this.category.replace(regex, "");
    },
    headerCategory() {
      return "heading" + this.category.replace(regex, "");
    },
    accordionId() {
      return "accordion" + this.category.replace(regex, "");
    },
    htAccordionId() {
      return "#accordion" + this.category.replace(regex, "");
    },
    categoryId() {
      return this.category.replace(regex, "");
    },

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
    partyAgreementCategory(party, category) {
      let agreement = 0.0;
      let userVotes = 0;
      for (var i = 0; i < this.subjects.length; i++) {
        let vote = this.subjects[i];
        if (!vote.categories?.find((cat) => cat[0] == category)) {
          continue;
        }

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
    swissAgreementCategory(category) {
      // TODO: merge with swissAgreement()
      let ctr = 0.0;
      let userVotes = 0;
      for (var i = 0; i < this.subjects.length; i++) {
        let vote = this.subjects[i];
        if (!vote.categories?.find((cat) => cat[0] == category)) {
          continue;
        }

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
    userVote(subject_id) {
      // TODO: remove this
      return this.$store.getters.getUserVote(subject_id);
      // console.log(subject_id);
      // return undefined;
      // if(this.$store.state.votes == undefined){
      //     return undefined
      // }
      // return this.$store.state.votes.find(e => e.id == subject_id)
    },
    // NOTE: might need this when refactoring
    // edit(subject) {
    //   this.$parent.edit(subject);
    // },
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
