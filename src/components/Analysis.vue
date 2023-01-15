<template>
  <!-- TODO: This is copied from VotesTable.vue (minor changes) -->
  <div class="container">
    <div class="row">
      <div class="col col-12 col-md-6">
        <h2>Analysis</h2>
      </div>
      <div class="col col-12 col-md-6 d-flex justify-content-md-end">
        <!-- v-if="prevTermHash()" -->
        <div class="align-self-center p-2">
          <router-link
            :is="!prevTermHash() ? 'span' : 'router-link'"
            :to="{ name: 'analysis', params: { term_hash: prevTermHash() } }"
            href=""
          >
            <font-awesome-icon class="fa-2x" :icon="['fas', 'angle-left']" />
          </router-link>
        </div>
        <div class="align-self-center p-2">
          <span class="term_name">{{ this.termName() }}</span>
        </div>
        <div class="align-self-center p-2">
          <router-link
            :is="!nextTermHash() ? 'span' : 'router-link'"
            :to="{ name: 'analysis', params: { term_hash: nextTermHash() } }"
            href=""
          >
            <font-awesome-icon class="fa-2x" :icon="['fas', 'angle-right']" />
          </router-link>
        </div>
      </div>
    </div>

    <HeaderRow v-bind:parties="term.parties" />

    <div class="container">
      <div class="row votecard" @click="showDetails">
        <div class="col-12 col-lg-6 ">Übereinstimmung</div>
        <div class="col-12 col-lg-6 ">
          <div class="row">
            <!-- Switzerland -->
            <div class="col svg-col" align="center">{{ swissAgreement }}%</div>

            <!-- userVote -->
            <div class="col svg-col" align="center">
              {{ numberOfUserVotes }}/{{ numberOfUserVotes }}
            </div>

            <!-- Parties -->
            <div
              class="col svg-col"
              align="center"
              v-for="party in this.term.parties"
              v-bind:key="party"
            >
              {{ partyAgreement(party.name) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderRow from "@/components/HeaderRow.vue";
import { Answer } from "@/Answer.js";
import Ja from "@/assets/ja.svg";
import Nein from "@/assets/nein.svg";
import Abstention from "@/assets/abstention.svg";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Switzerland from "@/assets/switzerland_coat-of-arms.svg";
import DieMitte from "@/assets/diemitte.svg";
import SVP from "@/assets/party_svp.svg";
import FDP from "@/assets/party_fdp.svg";
import GLP from "@/assets/party_glp.svg";
import GP from "@/assets/party_gp.svg";
import SP from "@/assets/party_sp.svg";

export default {
  name: "Analysis",
  props: ["term_hash"],
  components: {
    FontAwesomeIcon,
    HeaderRow,
  },
  setup() {
    return {
      Abstention,
      Answer,
      Ja,
      Nein,
      Switzerland,
      DieMitte,
      SVP,
      FDP,
      GLP,
      GP,
      SP,
    };
  },
  computed: {
    // loggedIn() {
    //   return this.$store.getters.isLoggedIn();
    // },
    // unsavedChanges() {
    //   return this.$store.getters.unsavedChanges();
    // },
    // TODO: numberOfUserVotes, swissAgreement and partAgreement are highly redundant
    numberOfUserVotes() {
      let ctr = 0;
      for (var i = 0; i < this.term.subjects.length; i++) {
        let vote = this.term.subjects[i];
        let userVote = this.$store.getters.getUserVote(vote.id);
        if (!userVote) {
          continue;
        }
        ctr++;
      }
      return ctr;
    },
    swissAgreement() {
      let ctr = 0.0;
      let userVotes = 0;
      for (var i = 0; i < this.term.subjects.length; i++) {
        let vote = this.term.subjects[i];
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
  data: function () {
    return {
      term: this.$store.getters.getTerm(this.term_hash),
    };
  },
  methods: {
    partyAgreement(party) {
      let agreement = 0.0;
      let userVotes = 0;
      for (var i = 0; i < this.term.subjects.length; i++) {
        let vote = this.term.subjects[i];
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
    termName() {
      return (
        this.term.start_date.getFullYear() + " - " + this.term.end_date.getFullYear()
      );
    },
    nextTermHash() {
      return this.$store.getters.getNextTermHash(this.term.id);
    },
    prevTermHash() {
      return this.$store.getters.getPrevTermHash(this.term.id);
    },
  },
  // async beforeMount() {
  //   // TODO: make this nicer, it is really ugly
  //   if (!this.$store.getters.isLoggedIn()) {
  //     await this.$store.dispatch("init");
  //   }
  //   if (!this.$store.getters.fetchedData()) {
  //     await this.$store.dispatch("getData");
  //   }
  // },
};
</script>
