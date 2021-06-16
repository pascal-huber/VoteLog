<template>
    <table>
        <tr>
            <th></th>
            <th>
                <font-awesome-icon :icon="['fas', 'users']"/>
            </th>
            <th></th>
            <th>
                <font-awesome-icon :icon="['fas', 'user']"/>
            </th>
            <th v-for="party in $store.state.parties"
                v-bind:key="party.name">
                {{ party.name }}
            </th>
        </tr>
        <tr v-for="subject in $store.state.subjects"
            v-bind:key="subject">


            <!-- subject -->
            <td>{{ subject.name }}</td>

            <!-- result -->
            <td>
                <font-awesome-icon
                    v-if="subject.outcome"
                    :icon="['fas', 'check']"/>
                <font-awesome-icon
                    v-else
                    :icon="['fas', 'times']"/>
            </td>

            <!-- agreement -->
            <td>
                <font-awesome-icon
                    v-if="win(subject) == true"
                    :icon="['fas', 'equals']"/>
                <font-awesome-icon
                    v-if="win(subject) == false"
                    :icon="['fas', 'not-equal']"/>
            </td>

            <!-- me -->
            <td>
                <font-awesome-icon
                    v-if="vote($store.state, subject.id) == true"
                    class="me"
                    :icon="['fas', 'check']"/>
                <font-awesome-icon
                    v-else-if="vote($store.state, subject.id) == false"
                    class="me"
                    :icon="['fas', 'times']"/>
                <font-awesome-icon
                    v-else
                    :icon="['fas', 'question']"/>
            </td>

            <!-- parties -->
            <td v-for="party in $store.state.parties"
                v-bind:key="party"
                v-bind:class="classParty(party.votes, subject.id)">
                <font-awesome-icon
                    v-if="partyVote(subject.id, party) == true"
                    :icon="['fas', 'check']"/>
                <font-awesome-icon
                    v-else-if="partyVote(subject.id, party) == false"
                    :icon="['fas', 'times']"/>
                <font-awesome-icon
                    v-else
                    :icon="['fas', 'question']"/>
            </td>
        </tr>
    </table>
</template>

<script>

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

 export default {
     name: 'VotesTable',
     methods: {
         win(subject){
             var vote = this.$store.state.votes.find(e => e.id == subject.id)
             if(vote == undefined){
                 return vote
             } else {
                 return vote.vote == subject.outcome
             }
         },
         vote(state, subject_id) {
             var vote = state.votes.find(e => e.id == subject_id)
             if(vote == undefined){
                 return vote
             } else {
                 return vote.vote
             }
         },
         partyVote(subject_id, party) {
             var votes = party.votes
             if(votes == undefined){
                 return undefined
             } else {
                 var vote = votes.find(e => e.id == subject_id)
                 if(vote == undefined){
                     return vote
                 } else {
                     return vote.vote
                 }
             }
         },
         // classObject: function(subject) {
         //     var vote = this.$store.state.votes.find(e => e.id == subject.id)
         //     var agree = undefined
         //     if(vote != undefined){
         //         agree = vote.vote == subject.outcome
         //     }
         //     return {
         //         novote : agree == undefined,
         //         agree : agree,
         //         disagree : agree == false
         //     }
         // },
         classParty(party_votes, subject_id) {

             var party_vote = undefined
             if(party_votes != undefined) {
                 var tmp = party_votes.find(e => e.id == subject_id)
                 if(tmp != undefined){
                     party_vote = tmp.vote
                 }
             }

             var user_vote = this.$store.state.votes.find(e => e.id == subject_id)
             if(user_vote != undefined){
                 user_vote = user_vote.vote
             }

             return {
                 agree : party_vote == user_vote && party_vote != undefined,
                 disagree : party_vote != user_vote && user_vote != undefined && party_vote != undefined,
                 neutral : user_vote == undefined || party_vote == undefined
             }
         },
     },
     computed: {
     },
     components: {
         FontAwesomeIcon
     }
 }

</script>

<style scoped lang="scss">

$color1: #34626C;
$color2: #CC7351;
$colorGood: green;
$colorBad: red;
$colorNeutral: gray;

 .agree, .me {
     color: $color1;
 }

 .disagree {
     color: $color2;
 }

 .neutral {
     color: $colorNeutral;
 }

 .fa-question {
     color: $colorNeutral;
 }

 .fa-not-equal {
     color: $colorBad;
 }

 .fa-equals {
     color: $colorGood;
 }

 th {
     text-align: left;
 }

 td:nth-child(4), th:nth-child(4) {
     border-right: 2px solid $colorNeutral;
 }



 tr { border: none; }
 table { border-collapse: collapse; }

 th, td {
     padding-left: 5px;
     padding-right: 5px;
 }
 td + td,  th + th {
     text-align: center;
 }

</style>
