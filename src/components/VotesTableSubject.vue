<template>


    <div class="row votecard" @click="showDetails">
        <div class="col-sm-2 col-lg-1">
            <small>{{("0" + (subject.date.getMonth() + 1)).slice(-2)}}/{{ subject.date.getFullYear().toString().substring(2) }}</small>
        </div>
        <div class="col-sm-10 col-lg-5">
            {{ subject.name }}
        </div>
        <div class="col-sm-12 col-lg-6">
            <div class="row">

                <!-- Switzerland -->
                <div class="col svg-col" align="center" v-bind:class="classSwiss">
                    <img :src="Ja" v-if="subject.outcome == Answer.Yes" class="svg-logo"/>
                    <img :src="Nein" v-else-if="subject.outcome == Answer.No" class="svg-logo"/>
                    <font-awesome-icon
                        v-else
                        class="neutral"
                        :icon="['fas', 'question']"/>
                </div>

                <!-- Me -->
                <div class="col svg-col" align="center">
                    <font-awesome-icon
                        v-if="userVote == undefined"
                        class="neutral"
                        :icon="['fas', 'question']"/>
                    <img :src="Ja" class="svg-logo"
                        v-else-if="userVote.answer == Answer.Yes" />
                    <img :src="Nein" class="svg-logo"
                          v-else-if="userVote.answer == Answer.No" />
                    <img :src="Abstention" class="svg-logo"
                                v-else-if="userVote.answer == Answer.Abstention" />
                    <font-awesome-icon
                        v-else
                        class="neutral"
                        :icon="['fas', 'question']"/>
                </div>


                <!-- Parties -->
                <div class="col svg-col" align="center" v-for="(party, i) in this.parties"
                     v-bind:key="party"
                     v-bind:class="partyAnswers[i].answerClass">
                    <img :src="Ja" class="svg-logo"
                        v-if="partyAnswers[i].answer == Answer.Yes" />
                    <img :src="Nein" class="svg-logo"
                          v-else-if="partyAnswers[i].answer == Answer.No" />
                    <img :src="Abstention" class="svg-logo"
                                v-else-if="partyAnswers[i].answer == Answer.Abstention" />
                    <font-awesome-icon
                        v-else-if="partyAnswers[i].answer == Answer.Novote"
                        class="neutral"
                        :icon="['fas', 'times']" />
                    <font-awesome-icon
                        v-else
                        :icon="['fas', 'question']"/>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
 // <tr class="content-row">
 //      <tr>
 //      <td colspan="10">
 //      <div class="detail-row collapse detail-content" :id="'collapse-row-' + subject.id">
 //      <div v-show="userVote?.reasoning">
 //      <small><b>Begründung: </b></small> {{ userVote?.reasoning }}
 //      </div>
 //      <router-link type="button" class="btn btn-primary btn-sm" :to="'/' + subject.hash + '/edit'">
 //      <font-awesome-icon
 //      :icon="['fas', 'edit']"/>
 //      </router-link>
 //      </div>
 //      </td>
 //      </tr>
 //
 import { Answer } from "@/Answer.js"
 import Ja from "@/assets/ja.svg"
 import Nein from "@/assets/nein.svg"
 import Abstention from "@/assets/abstention.svg"
 import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

 export default {
     name: 'VotesTable',
     props: [
         'subject',
         'userVote',
         'parties',
         'loggedIn',
     ],
     data: function(){
         return {
             Answer: Answer // TODO: this can't be the way, right?
         }
     },
     setup() {
         return {
             Ja,
             Nein,
             Abstention,
         };
     },
     components: {
         FontAwesomeIcon,
     },
     computed: {
         classSwiss(){
             return this.classAgreement(this.userVote?.answer, this.subject.outcome)
         },
         partyAnswers(){
             var answers = [];
             for (let party of this.parties){
                 var vote = party.votes?.find(e => e.id == this.subject.id);
                 var voteClass = this.classAgreement(this.userVote?.answer, vote?.answer);
                 answers.push({answer: vote?.answer, answerClass: voteClass});
             }
             return answers;
         }
     },
     methods: {
         edit(subject){
             this.$parent.edit(subject);
         },
         showDetails(){
             if(this.loggedIn){
                 this.$router.push({name: 'showSubject', params: {hash: this.subject.hash}});
             }
         },
         classAgreement(userVote, otherVote){
             if(otherVote == undefined || userVote == undefined){
                 return "neutral";
             } else if(otherVote == userVote){
                 return "agree";
             } else if(otherVote == Answer.Abstention || userVote == Answer.Abstention){
                 return "semiagree";
             } else {
                 return "disagree";
             }
         },
     },
 }
</script>

<style>
 /* .ja-nein {
    width: 40px;
    height: 30px;
    padding: 0;
    } */
 .votecard:hover {
     cursor:pointer;
 }
</style>
