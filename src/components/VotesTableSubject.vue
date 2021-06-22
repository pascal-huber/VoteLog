<template>

    <td>{{ subject.name }}</td>

    <td>
        <font-awesome-icon
            v-if="subject.outcome"
            :icon="['fas', 'check']"/>
        <font-awesome-icon
            v-else
            :icon="['fas', 'times']"/>
    </td>

    <td>
        <font-awesome-icon
            v-if="answer == true"
            class="success"
            :icon="['fas', 'handshake']"/>
        <font-awesome-icon
            v-else-if="answer == false"
            class="unsuccessful"
            :icon="['fas', 'handshake-slash']"/>
    </td>

    <td>
        <font-awesome-icon
            v-if="answer == true"
            :icon="['fas', 'check']"/>
        <font-awesome-icon
            v-else-if="answer == false"
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
            :icon="['fas', 'check']"/>
        <font-awesome-icon
            v-else-if="partyVote(party.votes) == false"
            :icon="['fas', 'times']"/>
        <font-awesome-icon
            v-else
            :icon="['fas', 'question']"/>
    </td>

</template>

<script>

 import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

 export default {
     name: 'VotesTable',
     props: ['subject', 'userVote'],
     components: {
         FontAwesomeIcon,
     },
     computed: {
         answer(){
             if(this.userVote == undefined){
                 return undefined;
             }
             return this.userVote.vote;
         }
     },
     methods: {
         partyVote(party_votes) {
             var party_vote = undefined
             if(party_votes != undefined) {
                 party_vote = party_votes.find(e => e.id == this.subject.id)
                 if(party_vote != undefined){
                     party_vote = party_vote.vote
                 }
             }
             return party_vote
         },
         userVoteAnswer(){
             var user_vote = undefined
             if(this.userVote != undefined){
                 user_vote = this.userVote.vote
             }
             return user_vote
         },
         classParty(party_votes) {
             var party_vote = this.partyVote(party_votes)
             var user_vote = this.userVoteAnswer()
             return {
                 agree : party_vote == user_vote && party_vote != undefined,
                 disagree : party_vote != user_vote && user_vote != undefined && party_vote != undefined,
                 neutral : user_vote == undefined || party_vote == undefined
             }
         },
     },
 }
</script>
