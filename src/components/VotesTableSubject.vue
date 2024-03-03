<template>
    <div class="row g-0" @click="showDetails">
        <div class="col-12 col-lg-6">
            <div class="d-flex">
                <div class="order-lg-2 me-auto p-0 px-lg-2">
                    <span
                        :class="{ 'text-secondary': userVote?.importance == 0 }"
                    >
                        {{ subject.name }}
                    </span>
                </div>
                <div class="importance-cell">
                    <ImportanceSymbol :importance="userVote?.importance" />
                </div>
                <div class="date-cell">
                    <small class="datetext"
                        >&nbsp;{{
                            ('0' + (subject.date.getMonth() + 1)).slice(-2)
                        }}/{{
                            subject.date.getFullYear().toString().substring(2)
                        }}</small
                    >
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-6 order-3">
            <div class="row g-0">
                <!-- Switzerland -->
                <div class="col svg-col" align="center" :class="classSwiss">
                    <img
                        v-if="subject.outcome == Answer.Yes"
                        :src="Ja"
                        class="svg-logo"
                    />
                    <img
                        v-else-if="subject.outcome == Answer.No"
                        :src="Nein"
                        class="svg-logo"
                    />
                    <font-awesome-icon
                        v-else
                        class="neutral"
                        :icon="['fas', 'question']"
                    />
                </div>

                <!-- Me -->
                <div class="col svg-col" align="center">
                    <font-awesome-icon
                        v-if="userVote == undefined"
                        class="neutral"
                        :icon="['fas', 'question']"
                    />
                    <img
                        v-else-if="userVote.answer == Answer.Yes"
                        :src="Ja"
                        class="svg-logo"
                    />
                    <img
                        v-else-if="userVote.answer == Answer.No"
                        :src="Nein"
                        class="svg-logo"
                    />
                    <img
                        v-else-if="userVote.answer == Answer.Abstention"
                        :src="Abstention"
                        class="svg-logo"
                    />
                    <font-awesome-icon
                        v-else
                        class="neutral"
                        :icon="['fas', 'question']"
                    />
                </div>

                <!-- Parties -->
                <div
                    v-for="(party, i) in subject.parties"
                    :key="party"
                    class="col svg-col"
                    align="center"
                    :class="partyAnswers[i].answerClass"
                >
                    <img
                        v-if="partyAnswers[i].answer == Answer.Yes"
                        :src="Ja"
                        class="svg-logo"
                    />
                    <img
                        v-else-if="partyAnswers[i].answer == Answer.No"
                        :src="Nein"
                        class="svg-logo"
                    />
                    <img
                        v-else-if="partyAnswers[i].answer == Answer.Abstention"
                        :src="Abstention"
                        class="svg-logo"
                    />
                    <font-awesome-icon
                        v-else-if="partyAnswers[i].answer == Answer.Novote"
                        class="neutral"
                        :icon="['fas', 'times']"
                    />
                    <font-awesome-icon v-else :icon="['fas', 'question']" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { agreementValue, Answer } from '../Answer.js';
import Novote from '@/assets/novote.svg';
import Ja from '@/assets/ja.svg';
import Abstention from '@/assets/abstention.svg';
import ImportanceSymbol from '@/components/ImportanceSymbol.vue';
import Nein from '@/assets/nein.svg';
import T0x from '@/assets/0x.svg';
import T1x from '@/assets/1x.svg';
import T2x from '@/assets/2x.svg';
import T4x from '@/assets/4x.svg';

export default {
    name: 'VotesTableSubject',
    components: {
        FontAwesomeIcon,
        ImportanceSymbol,
    },
    props: ['subject', 'userVote', 'term_hash', 'loggedIn'],
    setup() {
        return {
            Answer,
            Novote,
            Ja,
            Abstention,
            Nein,
            T0x,
            T1x,
            T2x,
            T4x,
        };
    },
    computed: {
        classSwiss() {
            return this.classAgreement(
                this.userVote?.answer,
                this.subject.outcome,
            );
        },
        partyAnswers() {
            var answers = [];
            for (let vote of this.subject.parties) {
                var voteClass = this.classAgreement(
                    this.userVote?.answer,
                    vote.answer,
                );
                answers.push({ answer: vote?.answer, answerClass: voteClass });
            }
            return answers;
        },
    },
    methods: {
        showDetails() {
            if (true) {
                this.$router.push({
                    name: 'showSubject',
                    params: {
                        term_hash: this.term_hash,
                        subject_id: this.subject.id,
                    },
                });
            }
        },
        classAgreement(userVote, otherVote) {
            if (otherVote == undefined || userVote == undefined) {
                return 'neutral';
            }
            let agreement = agreementValue(otherVote, userVote, 1);
            if (agreement >= 1.0) {
                return 'agree';
            } else if (agreement >= 0.5) {
                return 'semiagree';
            } else {
                return 'disagree';
            }
        },
    },
};
</script>

<style lang="scss">
@import '@/colors.scss';

.datetext {
    color: gray;
}

.subject-title {
    display: block !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.importance {
    color: $red;
}

.date-cell {
    flex-basis: 40px;
    flex-grow: 0;
    flex-shrink: 0;
}

.importance-cell {
    flex-basis: 20px;
    flex-grow: 0;
    flex-shrink: 0;
}
</style>
