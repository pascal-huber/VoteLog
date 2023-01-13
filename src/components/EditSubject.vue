<template>
  <div class="container">
    <!-- TODO: make this form nicer -->
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
            v-model="answer"
            :value="Answer.Yes"
          />
          <label for="yes">Ja</label><br />

          <input type="radio" id="no" name="answer" v-model="answer" :value="Answer.No" />
          <label for="no">Nein</label><br />

          <input
            type="radio"
            id="maybe"
            name="answer"
            v-model="answer"
            :value="Answer.Abstention"
          />
          <label for="maybe">Enthaltung</label><br />

          <input
            type="radio"
            id="nothing"
            name="answer"
            v-model="answer"
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
            v-model="reasoning"
            rows="4"
          ></textarea>
        </div>
      </div>

      <div class="col-12">
        <input
          v-model="agreementEnabled"
          class="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
          :checked="this.agreementEnabled"
        />
        <label for="volume">&nbsp;Einverstanden zu&nbsp;</label>
        <input
          v-model="agreement"
          type="range"
          id="agreement"
          name="agreement"
          min="0"
          max="100"
          step="5"
        />
        {{ this.agreement }}%
      </div>

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
      // TODO: this is highly redundant
      userVote: this.$store.getters.getUserVote(this.subject_id),
      answer: this.$store.getters.getUserVote(this.subject_id)?.answer,
      reasoning: this.userVote?.reasoning,
      agreement: this.userVote?.agreement,
      agreementEnabled: !!this.userVote?.agreement,
    };
  },
  setup() {
    return {
      Answer,
    };
  },
  methods: {
    changeVote() {
      // TODO: make this more interactive and intuitive
      if (!this.agreementEnabled) {
        this.agreement = undefined;
      }
      var vote = {
        id: this.subject.id,
        answer: this.answer,
        reasoning: this.reasoning,
        agreement: this.agreement,
      };
      this.$store.dispatch("setVote", vote);
      this.$router.go(-1);
    },
  },
};
</script>
