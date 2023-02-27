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
      <div class="col col-6 d-flex justify-content-end">
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
          <span class="term_name">{{ term.hash }}</span>
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
      <div v-if="!category" class="container vote-list">
        <div>
          <StatsRow
            v-bind:parties="term.parties"
            v-bind:subjects="filteredSubjects"
            v-bind:category="filter"
          />
        </div>
        <div v-for="subject in filteredSubjects" v-bind:key="subject.id">
          <VotesTableSubject
            v-bind:term_hash="this.term.hash"
            v-bind:loggedIn="this.loggedIn"
            v-bind:userVote="userVote(subject.id)"
            v-bind:subject="subject"
          />
        </div>
      </div>
      <div v-else class="category-list">
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
  name: "VotesTable",
  props: ["term", "category"],
  data: function () {
    return {
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
    userVote(subject_id) {
      return this.$store.getters.getUserVote(subject_id);
    },
    edit(subject) {
      this.editSubject = subject;
      this.editUserVote = this.userVote(subject.id);
    },
    finishEdit() {
      this.editSubject = undefined;
      this.editUserVote = undefined;
    },
  },
};
</script>

<style lang="scss">
@import "bootstrap/scss/_functions.scss";
@import "bootstrap/scss/_variables.scss";
@import "bootstrap/scss/_mixins.scss";
@import "@/colors.scss";

.agree > .svg-logo {
  background: $blue;
}
.disagree > .svg-logo {
  background: $red;
}
.semiagree > .svg-logo {
  background: $yellow;
}
.neutral {
  color: $colorNeutral;
}

.term_name {
  font-size: 1.2rem;
}

.button:hover {
  color: #8987f3;
}

.content-row {
  border-top: 1px solid #efefef;
}

.content-row:hover {
  background-color: #f3f3f3;
}

.vote-list > div:not(:last-child),
.category-list > div:not(:last-child) {
  border-bottom: 1px solid $colorNeutral;
  margin-top: 2px;
  padding-bottom: 2px;
}

.vote-list > div,
.category-list > div {
  cursor: pointer;
}

.svg-col {
  padding: 0;
  margin: 0 2px;
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

@include media-breakpoint-up(md) {
  /* NOTE: larger icons for large layout */
  .svg-logo {
    width: 35px;
    height: 25px;
  }
  .svg-party-logo {
    width: 35px;
    height: 30px;
  }
}
</style>
