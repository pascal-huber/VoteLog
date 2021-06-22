<template>

    <h1>Abstimmungen</h1>

    <EditVoteModal
        v-if='editSubject != undefined'
        v-bind:subject="editSubject"
        v-bind:userVote="editUserVote"
        @changeVote="changeVote"
        @close="finishEdit"/>

    <table>
        <tr>
            <th></th>
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
            v-bind:key="subject.id">

            <!-- edit button -->
            <td>
                <font-awesome-icon
                    v-on:click="edit(subject)"
                    class="button"
                    :icon="['fas', 'edit']"/>
            </td>

            <!-- row content -->
            <VotesTableSubject
                v-bind:userVote="userVote(subject.id)"
                v-bind:subject="subject" />
        </tr>
    </table>
</template>

<script>

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VotesTableSubject from './VotesTableSubject.vue'
import EditVoteModal from './EditVoteModal.vue'

 export default {
     name: 'VotesTable',
     components: {
         FontAwesomeIcon,
         VotesTableSubject,
         EditVoteModal,
     },
     computed: {
         votesChanged(){
             return this.$store.state.votesChanged
         },
     },
     data: function(){
         return {
             editSubject: undefined,
             editUserVote: undefined,
         }
     },
     methods: {
         userVote(subject_id) {
             if(this.$store.state.votes == undefined){
                 return undefined
             }
             return this.$store.state.votes.find(e => e.id == subject_id)
         },
         edit(subject){
             this.editSubject = subject
             this.editUserVote = this.userVote(subject.id)
         },
         finishEdit(){
             this.editSubject = undefined
             this.editUserVote = undefined
         },
         changeVote(){
             alert("changin vote...")
         }

     },
 }

</script>

<style lang="scss">

$color1: #5EAAA8;
$color2: #CC7351;
$colorGood: #678A74;
$colorBad: #D45079;
$colorNeutral: #eee;

 .agree {
     color: $color1;
 }
 .disagree {
     color: $color2;
 }
 .neutral {
     color: $colorNeutral;
 }


 .success {
     color: $colorGood
 }
 .unsuccessful {
     color: $colorBad
 }

 td:nth-child(2) {
     text-align: left;
 }

 td:nth-child(5), th:nth-child(5) {
     border-right: 2px solid $colorNeutral;
 }

 .button:hover {
     color: $colorGood
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
