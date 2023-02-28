<template>
    <div class="row g-0">
        <div class="col-12 col-lg-6">Übereinstimmung</div>
        <div class="col-12 col-lg-6">
            <div class="row g-0">
                <div class="col svg-col">
                    <PercentageValue :percentage="swissAgreementX" :color="true" />
                </div>
                <div class="col svg-col">
                    <PercentageValue :percentage="'-'" :color="false" />
                </div>
                <div v-for="party in parties" :key="party" class="col svg-col">
                    <PercentageValue :percentage="partyAgreementX(party.name)" :color="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { agreement } from '@/Answer.js';
import PercentageValue from '@/components/PercentageValue.vue';

export default {
    name: 'VotesTable',
    components: {
        PercentageValue,
    },
    props: ['parties', 'subjects'],
    computed: {
        // TODO: if possible, get rid of this function
        swissAgreementX() {
            let userVotes = this.$store.getters.getUserVotes();
            return agreement(this.subjects, userVotes);
        },
    },
    methods: {
        // TODO: if possible, get rid of this function
        partyAgreementX(party) {
            let userVotes = this.$store.getters.getUserVotes();
            return agreement(this.subjects, userVotes, party);
        },
    },
};
</script>

<style>
.votecard:hover {
    cursor: pointer;
}

.datetext {
    color: gray;
}

.subject-title {
    display: block !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
