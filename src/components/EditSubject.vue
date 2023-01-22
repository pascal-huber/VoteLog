<template>
  <div class="container">
    <div class="row gy-2">
      <div class="col-sm-12 col-md-10">
        <h3 v-if="!subject">Vorlage nicht gefunden</h3>
        <h3 v-else>{{ subject.name }}</h3>
      </div>

      <div class="col-12">
        <div class="form-group">
          <input
            type="radio"
            id="yes"
            name="answer"
            v-model="userVote.answer"
            :value="Answer.Yes"
          />
          <label for="yes">Ja</label><br />

          <input
            type="radio"
            id="no"
            name="answer"
            v-model="userVote.answer"
            :value="Answer.No"
          />
          <label for="no">Nein</label><br />

          <input
            type="radio"
            id="maybe"
            name="answer"
            v-model="userVote.answer"
            :value="Answer.Abstention"
          />
          <label for="maybe">Enthaltung</label><br />

          <input
            type="radio"
            id="nothing"
            name="answer"
            v-model="userVote.answer"
            :value="Answer.Novote"
          />
          <label for="nothing">Nicht abgestimmt</label>
        </div>
      </div>

      <div class="col-12">
        <div class="form-group">
          <textarea
            class="form-control"
            id="reasoning"
            placeholder="Begründung..."
            v-model="userVote.reasoning"
            rows="4"
          ></textarea>
        </div>
      </div>

      <!-- TODO: add importance to userVote and scale agreements -->
      <!-- <div class="col-12">
        <label for="importance">Wichtigkeit:{{userVote.importance}} {{ importanceText }}</label><br />
        <input
          v-model="userVote.importance"
          type="range"
          id="importance"
          name="importance"
          min="0"
          max="4"
          step="1"
        /> 
      </div> -->

      <div class="col-12">
        <button @click="goBack" type="button" class="btn btn-primary">Abbrechen</button>
        &nbsp;
        <button @click="changeVote" type="button" class="btn btn-primary">Fertig</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Answer } from "../Answer.js";

export default {
  name: "EditSubject",
  props: ["term_hash", "subject_id"],
  data: function () {
    return {
      subject: this.$store.getters.getSubjectByHash(this.term_hash, this.subject_id),
      userVote: this.$store.getters.getUserVote(this.subject_id),
    };
  },
  setup() {
    return {
      Answer,
    };
  },
  computed: {
    // importanceText() {
    //   switch (true) {
    //     case this.userVote.importance == 0:
    //       return "irrelevant (x0)";
    //     case this.userVote.importance == 1:
    //       return "wenig (x0.5)";
    //     case this.userVote.importance == 2:
    //       return "normal (x1)";
    //     case this.userVote.importance == 3:
    //       return "wichtig (x2)";
    //     case this.userVote.importance == 4:
    //       return "extrem wichtig (x4)";
    //     default:
    //       return "fdsa";
    //   }
    // },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    changeVote() {
      var vote = {
        id: this.subject.id,
        answer: this.userVote.answer,
        reasoning: this.userVote.reasoning,
        importance: Number(this.userVote.importance),
      };
      this.$store.dispatch("setVote", vote);
      this.$router.go(-1);
    },
  },
};
</script>
