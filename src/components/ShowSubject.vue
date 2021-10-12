<template>

    <router-link :to="{name: 'editSubject', params: { hash: this.hash}}" type="button" class="btn btn-primary">
        Bearbeiten
    </router-link>


    <div class="row">
        <div class="col-2">
            Stimme:
        </div>
        <div class="col-10">
            <font-awesome-icon
                v-if="this.userVote == undefined"
                class="neutral"
                :icon="['fas', 'question']"/>
            <Ja class="ja-nein"
                v-else-if="this.userVote?.answer == Answer.Yes" />
            <Nein class="ja-nein"
                  v-else-if="this.userVote?.answer == Answer.No" />
            <Abstention class="ja-nein"
                        v-else-if="this.userVote?.answer == Answer.Abstention" />
            <font-awesome-icon
                v-else
                class="neutral"
                :icon="['fas', 'question']"/>
        </div>
    </div>

    <div class="row">
        <div class="col-2">
            Begründung:
        </div>
        <div class="col-10">
            {{this.userVote?.reasoning}}
        </div>
    </div>

</template>

<script>

 import {Answer} from '../Answer.js'

 import Ja from "@/assets/ja.svg"
 import Nein from "@/assets/nein.svg"
 import Abstention from "@/assets/abstention.svg"
 import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

 export default {
     name: 'ShowSubject',
     props: ['hash', 'subject', 'userVote'],
     components: {
         Ja,
         Nein,
         Abstention,
         FontAwesomeIcon,
     },
     computed: {
     },
     data: function(){
         return {
             Answer: Answer, // TODO: this can't be the way, right?
         }
     },
     methods: {
         edit(){
             this.view = false;
         },
         changeVote(){
             // var vote = {
             //     id: this.subject.id,
             //     answer: this.answer,
             //     reasoning: this.reasoning,
             // }
             this.$store.dispatch("setVote", this.userVote);
             this.$emit('close')
         },
         abort(){
         }
     },
 }
</script>
