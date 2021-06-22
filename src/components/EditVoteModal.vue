<template>
    <modal>
        <template v-slot:header>
            <h3>{{ subject.name }}</h3>
        </template>
        <template v-slot:body>

            <input type="checkbox" id="checkbox" v-model="answer" />
            <label for="checkbox">Ja</label>

            <!-- <input type="radio" id="yes" name="answer" value="male">
                 <label for="yes">Ja</label><br>

                 <input type="radio" id="no" name="answer" value="female">
                 <label for="no">Nein</label><br>

                 <input type="radio" id="maybe" name="answer" value="other">
                 <label for="maybe">Enthaltung</label><br>

                 <input type="radio" id="nothing" name="answer" value="other">
                 <label for="nothing">Nicht abgestimmt</label>
            -->
        </template>
        <template v-slot:footer>
            <button @click='abort()'>Abbrechen</button>
            <button @click='changeVote'>Speichern</button>
        </template>
    </modal>
</template>

<script>

 import Modal from './Modal.vue'

 export default {
     name: 'Meine Stimme',
     props: ['subject', 'userVote'],
     data: function(){
         return {
             answer: this.userVote == undefined ? false : this.userVote.vote
         }
     },
     components: {
         Modal,
     },
     mutations: {
     },
     methods: {
         changeVote(){
             // TODO: don't change state in component method
             const index = this.$store.state.votes.findIndex(e => e.id == this.subject.id)
             const vote = {
                 id: this.subject.id,
                 vote: this.answer,
             }
             if(index !== -1) {
                 this.$store.state.votes.splice(index, 1, vote)
                 this.$store.state.unsavedChanges = true
             } else {
                 this.$store.state.votes.push(vote)
                 this.$store.state.unsavedChanges = true
             }
             this.$emit('close')
         },
         abort(){
             this.$emit('close')
         }
     },
 }
</script>
