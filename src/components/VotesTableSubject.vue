<template>

    <tr class="content-row">
        <td>
            <font-awesome-icon
                v-if="this.loggedIn"
                v-on:click="edit(subject)"
                class="button"
                :icon="['fas', 'edit']"/>
        </td>

        <td class="date-cell">
            <small>{{("0" + (subject.date.getMonth() + 1)).slice(-2)}}/{{ subject.date.getFullYear().toString().substring(2) }}</small>
        </td>

        <td class="title-cell">
            <div data-bs-toggle="collapse"
               :href="'#collapse-row-' + subject.id"
               aria-expanded="false"
               :aria-controls="'collapse-row-' + subject.id">
                {{ subject.name }}
            </div>
        </td>

        <td v-bind:class="classSwiss">
            <Ja v-if="subject.outcome == Answer.Yes" class="ja-nein"/>
            <Nein v-else-if="subject.outcome == Answer.No" class="ja-nein"/>
            <font-awesome-icon
                v-else
                class="neutral"
                :icon="['fas', 'question']"/>
        </td>

        <td>
            <font-awesome-icon
                v-if="userVote == undefined"
                class="neutral"
                :icon="['fas', 'question']"/>
            <Ja class="ja-nein"
                v-else-if="userVote.answer == Answer.Yes" />
            <Nein class="ja-nein"
                v-else-if="userVote.answer == Answer.No" />
            <Abstention class="ja-nein"
                v-else-if="userVote.answer == Answer.Abstention" />
            <font-awesome-icon
                v-else
                class="neutral"
                :icon="['fas', 'question']"/>
        </td>

        <td v-for="(party, i) in this.parties"
            v-bind:key="party"
            v-bind:class="partyAnswers[i].answerClass">
            <Ja class="ja-nein"
                v-if="partyAnswers[i].answer == Answer.Yes" />
            <Nein class="ja-nein"
                v-else-if="partyAnswers[i].answer == Answer.No" />
            <Abstention class="ja-nein"
                v-else-if="partyAnswers[i].answer == Answer.Abstention" />
            <font-awesome-icon
                v-else-if="partyAnswers[i].answer == Answer.Novote"
                class="neutral"
                :icon="['fas', 'times']" />
            <font-awesome-icon
                v-else
                :icon="['fas', 'question']"/>
        </td>
    </tr>
    <tr class="detail-row">
        <td></td>
        <td></td>
        <td colspan="9">
            <div v-if="userVote && userVote.reasoning"
                 class="detail-content collapse"
                 :id="'collapse-row-' + subject.id">
                <small><b>Begründung: </b></small> {{ userVote.reasoning }}
            </div>
        </td>
    </tr>

</template>

<script>

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
     components: {
         FontAwesomeIcon,
         Ja,
         Nein,
         Abstention
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
 .ja-nein {
     width: 30px;
     height: 22px;
     padding: 0;
 }
</style>
