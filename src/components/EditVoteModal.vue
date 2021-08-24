<template>
    <modal>
        <template v-slot:header>
            <h3>{{ subject.name }}</h3>
        </template>
        <template v-slot:body>

            <div class="form-group">
                <input type="radio" id="yes" name="answer" v-model="answer" :value=Answer.Yes>
                <label for="yes">Ja</label><br>

                <input type="radio" id="no" name="answer" v-model="answer" :value=Answer.No>
                <label for="no">Nein</label><br>

                <input type="radio" id="maybe" name="answer" :value=Answer.Abstention>
                <label for="maybe">Enthaltung</label><br>

                <input type="radio" id="nothing" name="answer" v-model="answer" :value=Answer.Novote>
                <label for="nothing">Nicht abgestimmt</label>
            </div>

            <div class="form-group">
                <textarea class="form-control" id="reasoning" placeholder="Begründung..."
                          v-model="reasoning" rows="4"></textarea>
            </div>

        </template>
        <template v-slot:footer>
            <button type="button" class="btn btn-secondary" @click='abort()'>Abbrechen</button>
            <button type="button" class="btn btn-primary" @click='changeVote'>Speichern</button>
        </template>
    </modal>
</template>

<script>

 import Modal from './Modal.vue'
 import {Answer} from '../Answer.js'

 export default {
     name: 'Meine Stimme',
     props: ['subject', 'userVote'],
     data: function(){
         return {
             answer: this.userVote == undefined ? Answer.Novote : this.userVote.answer,
             reasoning: this.userVote == undefined ? undefined : this.userVote.reasoning,
             Answer: Answer // TODO: this can't be the way, right?
         }
     },
     components: {
         Modal,
     },
     mutations: {
     },
     methods: {
         changeVote(){
             var vote = {
                 id: this.subject.id,
                 answer: this.answer,
                 reasoning: this.reasoning,
             }
             this.$store.dispatch("setVote", vote);
             this.$emit('close')
         },
         abort(){
             this.$emit('close')
         }
     },
 }
</script>
