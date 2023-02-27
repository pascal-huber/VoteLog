<template>
  <div :id="accordionId">
    <span :id="headerCategory">
      <span
        data-bs-toggle="collapse"
        :data-bs-target="htCategory"
        aria-expanded="false"
        :aria-controls="categoryId"
      >
        <div class="row">
          <div class="col-12 col-lg-6">{{ category }}</div>
          <div class="col-12 col-lg-6">
            <div class="row">
              <div class="col svg-col">
                <PercentageValue
                  v-bind:percentage="swissAgreementCategory(category)"
                  v-bind:color="true"
                />
              </div>
              <div class="col svg-col">
                <PercentageValue v-bind:percentage="'-'" v-bind:color="false" />
              </div>
              <div class="col svg-col" v-for="party in this.parties" v-bind:key="party">
                <PercentageValue
                  v-bind:percentage="partyAgreementCategory(party.name, category)"
                  v-bind:color="true"
                />
              </div>
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
      <div class="vote-list">
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
  </div>
</template>

<script>
import { Answer, swissAgreement, partyAgreement } from "@/Answer.js";
import PercentageValue from "@/components/PercentageValue.vue";
import VotesTableSubject from "@/components/VotesTableSubject.vue";

const regex = /[^A-Za-z0-9]/g;

export default {
  name: "VotesTableCategory",
  props: ["category", "parties", "subjects", "term_hash", "loggedIn"],
  components: {
    PercentageValue,
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
      let userVotes = this.$store.getters.getUserVotes();
      let subjects = this.subjects.filter((s) =>
        s.categories?.find((cat) => cat[0] == category)
      );
      return partyAgreement(party, userVotes, subjects);
    },
    swissAgreementCategory(category) {
      let userVotes = this.$store.getters.getUserVotes();
      let subjects = this.subjects.filter((s) =>
        s.categories?.find((cat) => cat[0] == category)
      );
      return swissAgreement(subjects, userVotes);
    },
    userVote(subject_id) {
      return this.$store.getters.getUserVote(subject_id);
    },
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
.votecard-category:hover {
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

.category > * {
  /* margin: 0; */
  /* padding: 0; */
  /* background: #eee; */
  /* transition-delay: background 1s; */
  /* padding: 0rem; */
}

.accordion-collapse {
  border-top: 1px solid #ddd;
}

</style>
