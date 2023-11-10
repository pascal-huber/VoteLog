<template>
    <div :id="accordionId" class="category">
        <div :id="headerCategory">
            <div
                data-bs-toggle="collapse"
                :data-bs-target="htCategory"
                aria-expanded="false"
                :aria-controls="categoryId"
            >
                <div class="row g-0">
                    <div class="col-12 col-lg-6">
                        {{ category }}&nbsp;({{ agreement['subjects'].length }})
                    </div>
                    <div class="col-12 col-lg-6">
                        <div class="row g-0">
                            <div class="col svg-col">
                                <PercentageValue
                                    :percentage="agreement['swiss']"
                                    :color="true"
                                />
                            </div>
                            <div class="col svg-col">
                                <PercentageValue
                                    :percentage="'-'"
                                    :color="false"
                                />
                            </div>
                            <div
                                v-for="party in parties"
                                :key="party"
                                class="col svg-col"
                            >
                                <PercentageValue
                                    :percentage="
                                        agreement['parties'][party.name]
                                    "
                                    :color="true"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            :id="categoryId"
            class="accordion-collapse collapse"
            :aria-labelledby="headerCategory"
            :data-bs-parent="htAccordionId"
        >
            <div class="vote-list">
                <div v-for="subject in agreement['subjects']" :key="subject.id">
                    <VotesTableSubject
                        :term_hash="term_hash"
                        :logged-in="loggedIn"
                        :user-vote="userVote(subject.id)"
                        :subject="subject"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { agreementValue } from '@/Answer.js';
import PercentageValue from '@/components/PercentageValue.vue';
import VotesTableSubject from '@/components/VotesTableSubject.vue';

const regex = /[^A-Za-z0-9]/g;

export default {
    name: 'VotesTableCategory',
    components: {
        PercentageValue,
        VotesTableSubject,
    },
    props: ['category', 'agreement', 'parties', 'term_hash', 'loggedIn'],
    computed: {
        htCategory() {
            return '#' + this.category.replace(regex, '');
        },
        headerCategory() {
            return 'heading' + this.category.replace(regex, '');
        },
        accordionId() {
            return 'accordion' + this.category.replace(regex, '');
        },
        htAccordionId() {
            return '#accordion' + this.category.replace(regex, '');
        },
        categoryId() {
            return this.category.replace(regex, '');
        },
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
        userVote(subject_id) {
            return this.$store.getters.getUserVote(subject_id);
        },
    },
};
</script>

<style>
/* ?? where */
.votecard-category:hover {
    cursor: pointer;
}

/* .category {
  border: 1px solid red;
} */

.datetext {
    color: gray;
}

.subject-title {
    display: block !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.accordion-collapse {
    border-top: 1px solid #ddd;
}
</style>
