<template>
  <div class="container">
    <div class="row gy-2">
      <div class="col-sm-12 col-md-10">
        <h2 v-if="!subject">Vorlage nicht gefunden</h2>
        <h2 v-else>{{ subject.name }}</h2>
      </div>
      <div class="col-sm-12 col-md-2 md-text-end">
        <router-link
          :to="{
            name: 'editSubject',
            params: { term_hash: this.term_hash, subject_id: this.subject_id },
          }"
          type="button"
          class="btn btn-primary"
        >
          Bearbeiten
        </router-link>
      </div>

      <div class="col-2">ID:</div>
      <div class="col-10">
        {{ this.subject.id }}
      </div>

      <div class="col-2">Datum:</div>
      <div class="col-10">
        {{ this.subject.date.toLocaleDateString("de-CH") }}
      </div>

      <div v-if="this.subject.categories?.length" class="col-2">Kategorien:</div>
      <div v-if="this.subject.categories?.length" class="col-10">
        <ul>
          <li v-for="category in uniqueCategories" v-bind:key="category">
            <span>
              {{ category }}
            </span>
          </li>
        </ul>
      </div>

      <div class="col-12 mt-4">
        <h4>Deine Stimme</h4>
      </div>

      <div class="col-3">Stimme:</div>
      <div class="col-9">
        <font-awesome-icon
          v-if="this.userVote == undefined"
          class="neutral"
          :icon="['fas', 'question']"
        />
        <img :src="Ja" class="svg-logo" v-else-if="this.userVote?.answer == Answer.Yes" />
        <img
          :src="Nein"
          class="svg-logo"
          v-else-if="this.userVote?.answer == Answer.No"
        />
        <img
          :src="Abstention"
          class="svg-logo"
          v-else-if="this.userVote?.answer == Answer.Abstention"
        />
        <font-awesome-icon v-else class="neutral" :icon="['fas', 'question']" />
      </div>

      <!-- <div class="col-3">Einverstanden zu:</div>
      <div class="col-9" v-if="!!this.userVote?.agreement">
        {{ this.userVote?.agreement }}%
      </div>
      <div class="col-9" v-else>
        <font-awesome-icon
          v-if="this.userVote == undefined"
          class="neutral"
          :icon="['fas', 'question']"
        />
      </div> -->

      <div class="col-3">Begründung:</div>
      <div class="col-9">
        {{ this.userVote?.reasoning }}
      </div>
      <div class="col-12 mt-4">
        <h4>Weitere Resourcen</h4>
        <ul>
          <li>
            <a :href="swissvotesURL" target="_blank">Vorlage auf swissvotes.ch</a>
          </li>
          <li>
            <a :href="adminCantonResultsURL" target="_blank">Resultate auf admin.ch</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Answer } from "../Answer.js";

import Ja from "@/assets/ja.svg";
import Nein from "@/assets/nein.svg";
import Abstention from "@/assets/abstention.svg";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "ShowSubject",
  props: ["term_hash", "subject_id"],
  components: {
    FontAwesomeIcon,
  },
  data: function () {
    return {
      subject: this.$store.getters.getSubjectByHash(this.term_hash, this.subject_id),
      userVote: this.$store.getters.getUserVote(this.subject_id),
    };
  },
  setup() {
    return {
      Abstention,
      Answer,
      Ja,
      Nein,
    };
  },
  computed: {
    uniqueCategories() {
      let categories = new Set();
      for(var i = 0; i < this.subject.categories.length; i++){
        categories.add(this.subject.categories[i][0]);
      }
      return [...categories];
    },
    swissvotesURL() {
      return "https://swissvotes.ch/vote/" + this.subject.id + ".00";
    },
    adminCantonResultsURL() {
      return (
        "https://www.bk.admin.ch/ch/d/pore/va/" +
        this.subject.date.getFullYear() +
        ("0" + (this.subject.date.getMonth() + 1)).slice(-2) +
        ("0" + this.subject.date.getDate()).slice(-2) +
        "/index.html"
      );
    },
  },
};
</script>
