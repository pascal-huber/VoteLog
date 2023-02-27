<template>
  <div class="row">
    <div class="col-12 col-lg-6">Übereinstimmung</div>
    <div class="col-12 col-lg-6">
      <div class="row">
        <div class="col svg-col">
          <PercentageValue v-bind:percentage="swissAgreementX" v-bind:color="true" />
        </div>
        <div class="col svg-col">
          <PercentageValue v-bind:percentage="'-'" v-bind:color="false" />
        </div>
        <div class="col svg-col" v-for="party in parties" v-bind:key="party">
          <PercentageValue
            v-bind:percentage="partyAgreementX(party.name)"
            v-bind:color="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { partyAgreement, swissAgreement } from "@/Answer.js";
import PercentageValue from "@/components/PercentageValue.vue";

export default {
  name: "VotesTable",
  props: ["parties", "subjects"],
  components: {
    PercentageValue,
  },
  computed: {
    // TODO: if possible, get rid of this function
    swissAgreementX() {
      let userVotes = this.$store.getters.getUserVotes();
      return swissAgreement(this.subjects, userVotes);
    },
  },
  methods: {
    // TODO: if possible, get rid of this function
    partyAgreementX(party) {
      let userVotes = this.$store.getters.getUserVotes();
      return partyAgreement(party, userVotes, this.subjects);
    },
  },
};
</script>

<style>
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
