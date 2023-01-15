<template>
  <div class="container">
    <div class="row" v-if="!this.term">
      <div class="col">
        <h2>Legislaturperiod nicht gefunden</h2>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col col-12 col-md-6">
        <h2>Abstimmungen</h2>
      </div>
      <div class="col col-12 col-md-6 d-flex justify-content-md-end">
        <!-- v-if="prevTermHash()" -->
        <div class="align-self-center p-2">
          <router-link
            :is="!prevTermHash() ? 'span' : 'router-link'"
            :to="{ name: 'votesTable', params: { term_hash: prevTermHash() } }"
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
            :to="{ name: 'votesTable', params: { term_hash: nextTermHash() } }"
            href=""
          >
            <font-awesome-icon class="fa-2x" :icon="['fas', 'angle-right']" />
          </router-link>
        </div>
      </div>
      <HeaderRow v-bind:parties="term.parties" />
      <div class="container" v-for="subject in term.subjects" v-bind:key="subject.id">
        <VotesTableSubject
          v-bind:term_hash="this.term.hash"
          v-bind:loggedIn="this.loggedIn"
          v-bind:userVote="userVote(subject.id)"
          v-bind:subject="subject"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VotesTableSubject from "@/components/VotesTableSubject.vue";
import HeaderRow from "@/components/HeaderRow.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  // TODO: remove beforeUpdate
  beforeUpdate() {
    // console.log("beforeUpdate");
  },
  name: "VotesTable",
  props: ["term"],
  data: function () {
    return {
      // term: this.$store.getters.getTerm(),
      editSubject: undefined,
      editUserVote: undefined,
    };
  },
  components: {
    VotesTableSubject,
    HeaderRow,
    FontAwesomeIcon,
  },
  computed: {
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
  },
  methods: {
    termName() {
      return (
        this.term.start_date.getFullYear() + " - " + this.term.end_date.getFullYear()
      );
    },
    nextTermHash() {
      return this.$store.getters.getNextTermHash(this.term?.id);
    },
    prevTermHash() {
      return this.$store.getters.getPrevTermHash(this.term?.id);
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
