<template>

    <div class="row">
        <div class="col-sm-12 col-md-10">
            <h3 v-if="!subject">Vorlage nicht gefunden</h3>
            <h3 v-else>{{ subject.name }}</h3>
        </div>
        <div class="col-sm-12 col-md-2 md-text-end">
            <router-link :to="{name: 'editSubject', params: { hash: this.hash}}" type="button" class="btn btn-primary">
                Bearbeiten
            </router-link>
        </div>
    </div>

    <div class="row">
        <div class="col-2">
            Stimme:
        </div>
        <div class="col-10">
            <font-awesome-icon
                v-if="this.userVote == undefined"
                class="neutral"
                :icon="['fas', 'question']"/>
            <img :src="Ja" class="svg-logo"
                v-else-if="this.userVote?.answer == Answer.Yes" />
            <img :src="Nein" class="svg-logo"
                  v-else-if="this.userVote?.answer == Answer.No" />
            <img :src="Abstention" class="svg-logo"
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
         FontAwesomeIcon,
     },
     setup() {
         return {
             Abstention,
             Answer,
             Ja,
             Nein,
         };
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
