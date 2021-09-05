<template>

    <EditVoteModal
        v-if='editSubject != undefined'
        v-bind:subject="editSubject"
        v-bind:userVote="editUserVote"
        @changeVote="changeVote"
        @close="finishEdit"/>

    <div class="row">
        <div class="col">
            <h1>Abstimmungen</h1>
        </div>
        <div class="col-sm text-end">
            <button v-if="$store.state.unsavedChanges"
                    class="btn btn-danger"
                    @click="saveChanges"
                    type="submit">
                Save Changes
            </button>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th class="date-cell"></th>
                        <th class="title-cell"></th>
                        <th>
                            <Switzerland class="svg-logo"/>
                        </th>
                        <th>
                            <font-awesome-icon :icon="['fas', 'user']"/>
                        </th>
                        <th v-for="party in $store.state.parties"
                            v-bind:key="party.name"
                            class="party-cell">
                            {{ party.name }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <VotesTableSubject
                        v-for="subject in orderedSubjects"
                        v-bind:key="subject.id"
                        v-bind:parties="$store.state.parties"
                        v-bind:loggedIn="$store.state.user != undefined && $store.state.user.id != undefined"
                        v-bind:userVote="userVote(subject.id)"
                        v-bind:subject="subject" />
                </tbody>

            </table>
        </div>
    </div>
</template>

<script>

 import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
 import VotesTableSubject from '@/components/VotesTableSubject.vue'
 import EditVoteModal from '@/components/EditVoteModal.vue'
 import { encryptData }  from '@/crypto.js'
 import Switzerland from '@/assets/switzerland_coat-of-arms.svg'


 export default {
     name: 'VotesTable',
     components: {
         FontAwesomeIcon,
         VotesTableSubject,
         EditVoteModal,
         Switzerland,
     },
     computed: {
         orderedSubjects() {
             return [...this.$store.state.subjects].sort(
                 (a, b) => {
                     if(a.date.getTime() == b.date.getTime()){
                         return a.name > b.name
                     }
                     a.date < b.date
             });
         },
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
             // TODO: remove?
             alert("changin vote...")
         },
         saveChanges(){
             const data = this.$store.state.votes;
             const aesKey = this.$store.state.user.aesKey;
             encryptData(aesKey, data)
                 .then((encryptedData) => {
                     const payload = {
                         uuid: this.$store.state.user.id,
                         data: encryptedData,
                     }
                     this.$store.dispatch("sendData", payload);
                 });
         },
     },
 }

</script>

<style lang="scss">

 $colorNeutral: #eee;

 .agree > .ja-nein {
     background: #86e074;
 }
 .disagree > .ja-nein {
     background: #eb6778;
 }
 .semiagree > .ja-nein {
     background: #fad35c;
 }
 .neutral {
     color: $colorNeutral;
 }

 /* .success {
    color: $colorGood
    }
    .unsuccessful {
    color: $colorBad
    }
  */

 td:nth-child(2) {
     width: 100px;
 }

 td:nth-child(5), th:nth-child(5), td:nth-child(4), th:nth-child(4) {
     border-right: 2px solid $colorNeutral;
 }

 .button:hover {
     color: #8987f3;
 }


 table {
     border-collapse: collapse;
     width: 100%;
     display: block;
     overflow-x: auto;
     overflow-y: hidden;
     white-space: nowrap;
 }

 tr {
     border: none;
 }

 td, th {
     text-align: center;
     padding-left: 2px;
     padding-right: 5px;
 }

 .svg-logo {
     width: 22px;
     height: 22px;
     padding: 0;
     margin: 0;
     margin-bottom: 5px;
 }

 .content-row {
     border-top: 1px solid #efefef;
 }

 .content-row:hover {
     background-color: #f3f3f3;
 }

 .date-cell {
 }

 .party-cell {
     width: 45px;
     text-align: center;
 }

 .title-cell, .title-cell > div {
     max-width: 400px;
 }

 .title-cell > div {
     text-align: left;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
 }

 .detail-content {
     text-align: left;

     white-space: -moz-pre-wrap !important;  /* Mozilla, since 1999 */
     white-space: -pre-wrap;      /* Opera 4-6 */
     white-space: -o-pre-wrap;    /* Opera 7 */
     white-space: pre-wrap;       /* css-3 */
     word-wrap: break-word;       /* Internet Explorer 5.5+ */
     white-space: -webkit-pre-wrap; /* Newer versions of Chrome/Safari*/
     word-break: break-all;
     white-space: normal;
 }
</style>
