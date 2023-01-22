<template>
  <div class="container">
    <div class="row" v-if="!this.term">
      <div class="col">
        <h2>Legislaturperiode nicht gefunden</h2>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col col-6 col-md-6">
        <h2>Abstimmungen</h2>
      </div>
      <div class="col col-6 d-flex justify-content-md-end">
        <div class="align-self-center p-2">
          <!-- TODO: find a nicer way if prevTermHash is undefined -->
          <span v-if="prevTermHash">
            <router-link :to="{ params: { term_hash: prevTermHash } }" href="">
              <font-awesome-icon class="fa-2x" :icon="['fas', 'angle-left']" />
            </router-link>
          </span>
          <font-awesome-icon v-else class="fa-2x" :icon="['fas', 'angle-left']" />
        </div>
        <div class="align-self-center p-2">
          <span class="term_name">{{ this.termName() }}</span>
        </div>
        <div class="align-self-center p-2">
          <!-- TODO: find a nicer way if nextTermHash is undefined -->
          <span v-if="nextTermHash">
            <router-link :to="{ params: { term_hash: nextTermHash } }" href="">
              <font-awesome-icon class="fa-2x" :icon="['fas', 'angle-right']" />
            </router-link>
          </span>
          <font-awesome-icon v-else class="fa-2x" :icon="['fas', 'angle-right']" />
        </div>
      </div>

      <div v-if="!category" class="col col-6 my-4">
        <select v-model="filter" class="form-select" aria-label="Default select example">
          <option value="all" selected>Alle</option>
          <option v-for="category in categories" v-bind:key="category" :value="category">
            {{ formatCategory(category) }}
          </option>
        </select>
      </div>

      <HeaderRow v-bind:parties="term.parties" />
      <div v-if="!category" class="container">
        <StatsRow
          v-bind:parties="term.parties"
          v-bind:subjects="filteredSubjects"
          v-bind:category="filter"
        />
        <div v-for="subject in filteredSubjects" v-bind:key="subject.id">
          <VotesTableSubject
            v-bind:term_hash="this.term.hash"
            v-bind:loggedIn="this.loggedIn"
            v-bind:userVote="userVote(subject.id)"
            v-bind:subject="subject"
          />
        </div>
      </div>
      <div v-else>
        <div v-for="category in categories" v-bind:key="category">
          <VotesTableCategory
            v-bind:category="category"
            v-bind:subjects="categorySubjects(category)"
            v-bind:parties="term.parties"
            v-bind:term_hash="this.term.hash"
            v-bind:loggedIn="this.loggedIn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VotesTableSubject from "@/components/VotesTableSubject.vue";
import VotesTableCategory from "@/components/VotesTableCategory.vue";
import HeaderRow from "@/components/HeaderRow.vue";
import StatsRow from "@/components/StatsRow.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  // TODO: remove beforeUpdate
  beforeUpdate() {
    // console.log("beforeUpdate");
  },
  name: "VotesTable",
  props: ["term", "category"],
  data: function () {
    return {
      // term: this.$store.getters.getTerm(),
      // category: this.category,
      editSubject: undefined,
      editUserVote: undefined,
      filter: "all",
    };
  },
  components: {
    VotesTableSubject,
    VotesTableCategory,
    HeaderRow,
    StatsRow,
    FontAwesomeIcon,
  },
  computed: {
    // TODO: redundant with analysis
    categories() {
      let categories = new Set();
      for (var i = 0; i < this.term.subjects.length; i++) {
        let vote = this.term.subjects[i];
        if (vote.categories) {
          for (var ii = 0; ii < vote.categories.length; ii++) {
            categories.add(vote.categories[ii][0]);
          }
        }
      }
      return Array.from(categories).sort();
    },
    filteredSubjects() {
      if (this.filter == "all") {
        return this.term.subjects;
      }
      return this.term.subjects.filter((subject) => {
        if (!subject.categories) {
          return false;
        }
        for (var i = 0; i < subject.categories.length; i++) {
          let subject_str = subject.categories[i].join("###");
          if (subject_str.startsWith(this.filter)) {
            return true;
          }
        }
        return false;
      });
    },
    // TODO: move this somewhere else
    // period() {
    //   return this.$store.state.period;
    // },
    // periodSubjects(){
    //   let x = this.$store.getters.getSubjectsForPeriod();
    //   console.log(x);
    //   return x;
    // },
    loggedIn() {
      return this.$store.getters.isLoggedIn();
    },
    orderedSubjects() {
      return [...this.subjects].sort((a, b) => {
        if (a.date.getTime() == b.date.getTime()) {
          return a.name > b.name;
        }
        a.date < b.date;
      });
    },
    votesChanged() {
      return this.$store.state.votesChanged;
    },
    nextTermHash() {
      return this.$store.getters.getNextTermHash(this.term?.id);
    },
    prevTermHash() {
      return this.$store.getters.getPrevTermHash(this.term?.id);
    },
  },
  methods: {
    categorySubjects(category) {
      let subjects = new Array();
      for (var i = 0; i < this.term.subjects.length; i++) {
        let categories = this.term.subjects[i].categories;
        for (var ii = 0; ii < categories.length; ii++) {
          if (categories[ii][0] == category) {
            subjects.push(this.term.subjects[i]);
            break;
          }
        }
      }
      return subjects;
    },
    toggleCategory() {
      // this.category = !this.category;
      if (this.category) {
        this.$router.push({ name: "votesTable" });
      } else {
        this.$router.push({ name: "votesTableCategory" });
      }
    },
    formatCategory(category) {
      let arr = category.split("###");
      let prefix = "\xa0".repeat((arr.length - 1) * 5);
      return prefix + arr[arr.length - 1];
    },
    termName() {
      return (
        this.term.start_date.getFullYear() + " - " + this.term.end_date.getFullYear()
      );
    },
    userVote(subject_id) {
      // TODO: remove this
      return this.$store.getters.getUserVote(subject_id);
      // if(this.$store.state.votes == undefined){
      //     return undefined
      // }
      // return this.$store.state.votes.find(e => e.id == subject_id)
    },
    edit(subject) {
      this.editSubject = subject;
      this.editUserVote = this.userVote(subject.id);
    },
    finishEdit() {
      this.editSubject = undefined;
      this.editUserVote = undefined;
    },
    changeVote() {
      // TODO: remove?
      alert("changin vote...");
    },
  },
};
</script>

<style lang="scss">
@import "bootstrap/scss/_functions.scss";
@import "bootstrap/scss/_variables.scss";
@import "bootstrap/scss/_mixins.scss";

$colorNeutral: #ddd;

.agree > .svg-logo {
  background: #96e094;
}
.disagree > .svg-logo {
  background: #eb8778;
  // background: #428bca;
}
.semiagree > .svg-logo {
  background: #fad38c;
}
.neutral {
  color: $colorNeutral;
}

.term_name {
  font-size: 1.2rem;
}

/* .success {
    color: $colorGood
    }
    .unsuccessful {
    color: $colorBad
    }
  */

td:nth-child(2) {
  width: 100px;
}

td:nth-child(3),
th:nth-child(3),
td:nth-child(4),
th:nth-child(4) {
  border-right: 2px solid $colorNeutral;
}

.button:hover {
  color: #8987f3;
}

table {
  border-collapse: collapse;
  width: 100%;
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

tr {
  border: none;
}

td,
th {
  text-align: center;
  padding-left: 2px;
  padding-right: 5px;
}

/* .svg-party-logo-gp {
    width: 40px;
    height: 40px;
    padding: 0;
    margin: 0;
    margin-bottom: 0px;
    }
  */
.content-row {
  border-top: 1px solid #efefef;
}

.content-row:hover {
  background-color: #f3f3f3;
}

.date-cell {
}

.party-cell {
  width: 45px;
  text-align: center;
}

.title-cell,
.title-cell > div {
  width: 100%; /* TODO: css, wtf? */
}

.title-cell {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-content {
  text-align: left;

  white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  white-space: pre-wrap; /* css-3 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  white-space: -webkit-pre-wrap; /* Newer versions of Chrome/Safari*/
  word-break: break-all;
  white-space: normal;
}

.votecard {
  border-bottom: 1px solid #ddd;
  margin-top: 10px;
  padding-bottom: 10px;
}

.svg-logo-swiss {
  height: 30px;
  width: 30px;
}

.svg-logo {
  width: 30px;
  height: 20px;
  padding: 0;
  margin: 0;
}

.svg-party-logo {
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
}

@include media-breakpoint-up(lg) {
  /* larger icons for large layout */
  .svg-logo {
    width: 35px;
    height: 25px;
  }
  .svg-party-logo {
    width: 35px;
    height: 30px;
  }

  /* spacing between votes */
  .votecard {
    margin-top: 2px;
    padding-bottom: 2px;
  }
}

.svg-col {
  padding: 0;
  margin: 0;
}
</style>
