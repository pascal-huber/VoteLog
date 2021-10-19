<template>


    <div class="row">
        <div class="col-sm-12 col-md-10">
            <h3 v-if="!subject">Vorlage nicht gefunden</h3>
            <h3 v-else>{{ subject.name }}</h3>
        </div>
    </div>

    <div class="form-group">
        <input type="radio" id="yes" name="answer" v-model="answer" :value=Answer.Yes>
        <label for="yes">Ja</label><br>

        <input type="radio" id="no" name="answer" v-model="answer" :value=Answer.No>
        <label for="no">Nein</label><br>

        <input type="radio" id="maybe" name="answer" v-model="answer" :value=Answer.Abstention>
        <label for="maybe">Enthaltung</label><br>

        <input type="radio" id="nothing" name="answer" v-model="answer" :value=Answer.Novote>
        <label for="nothing">Nicht abgestimmt</label>
    </div>

    <div class="form-group">
        <textarea class="form-control" id="reasoning" placeholder="Begründung..."
                  v-model="reasoning" rows="4"></textarea>
    </div>


    <button @click="goBack" type="button" class="btn btn-primary">Abbrechen</button>
    <button @click="changeVote" type="button" class="btn btn-primary">Fertig</button>


</template>
<script>

 import {Answer} from '../Answer.js'

 export default {
     name: 'ShowSubject',
     props: ['hash', 'subject', 'userVote'],
     data: function(){
         return {
             answer: this.userVote?.answer,
             reasoning: this.userVote?.reasoning,
         }
     },
     setup() {
         return {
             Answer,
         };
     },
     methods: {
         changeVote(){
             var vote = {
                 id: this.subject.id,
                 answer: this.answer,
                 reasoning: this.reasoning,
             }
             this.$store.dispatch("setVote", vote);
             this.ab
             this.goBack();
         },
         goBack(){
             this.$router.go(-1);
         },
     },
 }
</script>
