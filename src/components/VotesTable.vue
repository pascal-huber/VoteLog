<template>

    <EditVoteModal
        v-if='editSubject != undefined'
        v-bind:subject="editSubject"
        v-bind:userVote="editUserVote"
        @changeVote="changeVote"
        @close="finishEdit"/>

    <!-- <EditVote v-show="true"/>
    -->

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
                        <th class="date-cell"></th>
                        <th class="title-cell"></th>
                        <th>
                            <Switzerland class="svg-logo"/>
                        </th>
                        <th>
                            <font-awesome-icon class="fa-2x" :icon="['fas', 'user']"/>
                        </th>
                        <th v-for="party in $store.state.parties"
                            v-bind:key="party.name"
                            class="party-cell">
                            <DieMitte v-if="party.name == 'CVP'" class="svg-party-logo"/>
                            <SVP v-else-if="party.name == 'SVP'" class="svg-party-logo"/>
                            <FDP v-else-if="party.name == 'FDP'" class="svg-party-logo"/>
                            <GLP v-else-if="party.name == 'GLP'" class="svg-party-logo"/>
                            <GP v-else-if="party.name == 'GP'" class="svg-party-logo-gp"/>
                            <SP v-else-if="party.name == 'SP'" class="svg-party-logo"/>
                            <!-- <span v-else>
                                 {{ party.name }}
                                 </span>
                            -->
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <VotesTableSubject
                        v-for="subject in orderedSubjects"
                        v-bind:key="subject.id"
                        v-bind:parties="$store.state.parties"
                        v-bind:loggedIn="this.loggedIn"
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
 import Switzerland from '@/assets/switzerland_coat-of-arms.svg'
 import DieMitte from "@/assets/diemitte.svg"
 import SVP from "@/assets/party_svp.svg"
 import FDP from "@/assets/party_fdp.svg"
 import GLP from "@/assets/party_glp.svg"
 import GP from "@/assets/party_gp.svg"
 import SP from "@/assets/party_sp.svg"

 // import EditVote from '@/components/EditVote.vue'
 //

 export default {
     name: 'VotesTable',
     components: {
         FontAwesomeIcon,
         VotesTableSubject,
         EditVoteModal,
         Switzerland,
         DieMitte,
         SVP,
         FDP,
         GLP,
         GP,
         SP,
         // EditVote,
     },
     computed: {
         loggedIn(){
             return !!this.$store.state.user.encryptionKey;
         },
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
             var x = this.$store.getters.getUserVote(subject_id);
             return x;
             // if(this.$store.state.votes == undefined){
             //     return undefined
             // }
             // return this.$store.state.votes.find(e => e.id == subject_id)
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
             this.$store.dispatch("sendData");
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

 td:nth-child(3), th:nth-child(3), td:nth-child(4), th:nth-child(4) {
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
     width: 40px;
     height: 40px;
     padding: 0;
     margin: 0;
     margin-bottom: 5px;
 }

 .svg-party-logo {
     width: 40px;
     height: 40px;
     padding: 0;
     margin: 0;
     margin-bottom: 0px;
 }

 .svg-party-logo-gp {
     width: 40px;
     height: 40px;
     padding: 0;
     margin: 0;
     margin-bottom: 0px;
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
     width: 100%; /* TODO: css, wtf? */
 }

 .title-cell {
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
