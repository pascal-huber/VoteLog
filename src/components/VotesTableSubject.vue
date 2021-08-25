<template>

    <tr>
        <td>
            <font-awesome-icon
                v-on:click="edit(subject)"
                class="button"
                :icon="['fas', 'edit']"/>
        </td>

        <td>
            <div class="subject-title" data-bs-toggle="collapse"
               :href="'#collapse-row-' + subject.id"
               aria-expanded="false"
               :aria-controls="'collapse-row-' + subject.id">
                {{ subject.name }}
            </div>
        </td>

        <td>
            <font-awesome-icon
                v-if="subject.outcome == Answer.Yes"
                :icon="['fas', 'check']"/>
            <font-awesome-icon
                v-else-if="subject.outcome == Answer.No"
                :icon="['fas', 'times']"/>
            <font-awesome-icon
                v-else
                class="neutral"
                :icon="['fas', 'question']"/>
        </td>

        <td>
            <font-awesome-icon
                v-if="agree == true"
                class="success"
                :icon="['fas', 'handshake']"/>
            <font-awesome-icon
                v-else-if="agree == false"
                class="unsuccessful"
                :icon="['fas', 'handshake-slash']"/>
        </td>

        <td>
            <font-awesome-icon
                v-if="userVote == undefined"
                class="neutral"
                :icon="['fas', 'question']"/>
            <font-awesome-icon
                v-else-if="userVote.answer == Answer.Yes"
                :icon="['fas', 'check']"/>
            <font-awesome-icon
                v-else-if="userVote.answer == Answer.No"
                :icon="['fas', 'times']"/>
            <font-awesome-icon
                v-else
                class="neutral"
                :icon="['fas', 'question']"/>
        </td>

        <td v-for="party in $store.state.parties"
            v-bind:key="party"
            v-bind:class="classParty(party.votes, subject.id)">
            <font-awesome-icon
                v-if="partyVote(party.votes) == true"
                :icon="['fas', 'circle']"/>
            <font-awesome-icon
                v-else-if="partyVote(party.votes) == false"
                :icon="['fas', 'circle']"/>
            <font-awesome-icon
                v-else
                :icon="['fas', 'question']"/>
        </td>
    </tr>
    <tr>
        <td></td>
        <td colspan="10">
            <div class="collapse" :id="'collapse-row-' + subject.id">
                <span v-if="userVote && userVote.reasoning">
                    <small><b>Begründung: </b></small> {{ userVote.reasoning }}
                </span>
            </div>
        </td>
    </tr>

</template>

<script>

 import { Answer } from "../Answer.js"
 import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

 export default {
     name: 'VotesTable',
     props: ['subject', 'userVote'],
     data: function(){
         return {
             Answer: Answer // TODO: this can't be the way, right?
         }
     },
     components: {
         FontAwesomeIcon,
     },
     computed: {
         agree(){
             if(this.userVote == undefined
                || this.userVote.answer == undefined
                || this.subject.outcome == undefined){
                 return undefined;
             }
             return this.userVote.answer == this.subject.outcome;
         },
     },
     methods: {
         edit(subject){
             this.$parent.edit(subject);
         },
         partyVote(party_votes) {
             var party_vote = undefined
             if(party_votes != undefined) {
                 party_vote = party_votes.find(e => e.id == this.subject.id)
                 if(party_vote != undefined){
                     party_vote = party_vote.answer
                 }
             }
             return party_vote
         },
         classParty(party_votes) {
             var party_vote = this.partyVote(party_votes)
             var user_vote = this.userVote == undefined ? undefined : this.userVote.answer
             return {
                 agree : party_vote == user_vote && party_vote != undefined,
                 disagree : party_vote != user_vote && user_vote != undefined && party_vote != undefined,
                 neutral : user_vote == undefined || party_vote == undefined
             }
         },
     },
 }
</script>

<style>
 .subject-title {
     max-width: 400px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
 }
</style>
