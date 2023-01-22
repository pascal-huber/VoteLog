<template>
  <!-- TODO: This is copied from VotesTable.vue (minor changes) -->
  <div class="container">
    <div class="row" v-if="!this.term">
      <div class="col">
        <h2>Legislaturperiode nicht gefunden</h2>
      </div>
    </div>
    <div v-else class="row">
      <div class="col col-12 col-md-6">
        <h2>Analysis</h2>
      </div>
      <div class="col col-12 col-md-6 d-flex justify-content-md-end">
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

      <HeaderRow v-bind:parties="term.parties" />

      <div class="container">
        <div class="row votecard">
          <div class="col-12 col-lg-6">Alle Vorlagen</div>
          <div class="col-12 col-lg-6">
            <div class="row">
              <!-- Switzerland -->
              <div class="col svg-col" align="center">{{ swissAgreement }}%</div>

              <!-- userVote -->
              <div class="col svg-col" align="center">
                <!-- {{ numberOfUserVotes }}/{{ numberOfUserVotes }} -->
                100%
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

        <div class="row votecard" v-for="category in categories" v-bind:key="category">
          <div class="col-12 col-lg-6">{{ category }}</div>
          <div class="col-12 col-lg-6">
            <div class="row">
              <!-- userVote -->
              <Percentage v-bind:percentage="swissAgreementCategory(category)" />
              <Percentage v-bind:percentage="100" />
              <Percentage
                v-for="party in this.term.parties"
                v-bind:key="party"
                v-bind:percentage="partyAgreementCategory(party.name, category)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderRow from "@/components/HeaderRow.vue";
import Percentage from "@/components/Percentage.vue";
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
    Percentage,
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

    categories() {
      let categories = new Set();
      for (var i = 0; i < this.term.subjects.length; i++) {
        let vote = this.term.subjects[i];
        if (vote.categories) {
          for (var ii = 0; ii < vote.categories.length; ii++) {
            categories.add(vote.categories[ii][0]);
            // for (var iii = 0; iii < vote.categories[ii].length - 1; iii++) {
            //   categories.add(vote.categories[ii].slice(0, iii + 1).join("###"));
            // }
          }
        }
      }
      return Array.from(categories).sort();
    },
    // categories() {
    //   let categories = new Map();
    //   for (var i = 0; i < this.term.subjects.length; i++) {
    //     let vote = this.term.subjects[i];
    //     if (vote.categories) {
    //       for (var ii = 0; ii < vote.categories.length; ii++) {
    //         let ctr = categories.get(vote.categories[ii]) || 0;
    //         ctr++;
    //         categories.set(vote.categories[ii], ctr);
    //       }
    //     }
    //   }
    //   console.log(categories);
    //   return categories;
    // },
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
    numberOfUserVotesCategory(category) {
      // TODO: merge with numberOfUserVotes
      let ctr = 0;
      for (var i = 0; i < this.term.subjects.length; i++) {
        let vote = this.term.subjects[i];
        if (!vote.categories || !vote.categories.includes(category)) {
          continue;
        }
        let userVote = this.$store.getters.getUserVote(vote.id);
        if (!userVote) {
          continue;
        }
        ctr++;
      }
      return ctr;
    },
    // swissAgreementCate() {
    //   let ctr = 0.0;
    //   let userVotes = 0;
    //   for (var i = 0; i < this.subjects.length; i++) {
    //     let vote = this.subjects[i];
    //     // console.log(vote);
    //     let userVote = this.$store.getters.getUserVote(vote.id);
    //     if (!userVote) {
    //       continue;
    //     }
    //     if (userVote.answer == vote.outcome) {
    //       ctr++;
    //     }
    //     if (userVote.answer == Answer.Abstention) {
    //       ctr += 0.5;
    //     }
    //     if (userVote.answer != Answer.Novote) {
    //       userVotes++;
    //     }
    //   }
    //   return Math.round((ctr / userVotes) * 100);
    // },
    swissAgreementCategory(category) {
      // TODO: merge with swissAgreement()
      let ctr = 0.0;
      let userVotes = 0;
      for (var i = 0; i < this.term.subjects.length; i++) {
        let vote = this.term.subjects[i];
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
    partyAgreementCategory(party, category) {
      let agreement = 0.0;
      let userVotes = 0;
      for (var i = 0; i < this.term.subjects.length; i++) {
        let vote = this.term.subjects[i];
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
