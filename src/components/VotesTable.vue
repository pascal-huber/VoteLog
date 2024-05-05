<template>
    <div class="container">
        <div v-if="!term" class="row">
            <div class="col">
                <h2>Legislaturperiode nicht gefunden</h2>
            </div>
        </div>
        <div v-else class="row">
            <div class="col col-6 col-md-6">
                <h2>Abstimmungen</h2>
            </div>
            <div class="col col-6 d-flex justify-content-end">
                <div class="align-self-center p-2">
                    <span v-if="prevTermHash">
                        <router-link
                            :to="{ params: { term_hash: prevTermHash } }"
                            href=""
                        >
                            <font-awesome-icon
                                class="fa-2x"
                                :icon="['fas', 'angle-left']"
                            />
                        </router-link>
                    </span>
                    <font-awesome-icon
                        v-else
                        class="fa-2x"
                        :icon="['fas', 'angle-left']"
                    />
                </div>
                <div class="align-self-center p-2">
                    <span class="term_name">{{ term.hash }}</span>
                </div>
                <div class="align-self-center p-2">
                    <span v-if="nextTermHash">
                        <router-link
                            :to="{ params: { term_hash: nextTermHash } }"
                            href=""
                        >
                            <font-awesome-icon
                                class="fa-2x"
                                :icon="['fas', 'angle-right']"
                            />
                        </router-link>
                    </span>
                    <font-awesome-icon
                        v-else
                        class="fa-2x"
                        :icon="['fas', 'angle-right']"
                    />
                </div>
            </div>

            <HeaderRow :parties="term.parties" />
            <div class="container vote-list">
                <div>
                    <StatsRow
                        :parties="term.parties"
                        :subjects="term.subjects"
                    />
                </div>
                <div v-for="subject in term.subjects" :key="subject.id">
                    <VotesTableSubject
                        :term_hash="term.hash"
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
import VotesTableSubject from '@/components/VotesTableSubject.vue';
import HeaderRow from '@/components/HeaderRow.vue';
import StatsRow from '@/components/StatsRow.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    name: 'VotesTable',
    components: {
        VotesTableSubject,
        HeaderRow,
        StatsRow,
        FontAwesomeIcon,
    },
    props: ['term'],
    // data: function () {},
    computed: {
        loggedIn() {
            return this.$store.getters.isLoggedIn();
        },
        votesChanged() {
            return this.$store.state.votesChanged;
        },
        nextTermHash() {
            return this.$store.getters.getNextTermHash(this.term?.id);
        },
        prevTermHash() {
            return this.$store.getters.getPrevTermHash(this.term?.id);
        },
    },
    methods: {
        categorySubjects(category) {
            let subjects = new Array();
            for (var i = 0; i < this.term.subjects.length; i++) {
                let categories = this.term.subjects[i].categories;
                for (var ii = 0; ii < categories.length; ii++) {
                    if (categories[ii][0] == category) {
                        subjects.push(this.term.subjects[i]);
                        break;
                    }
                }
            }
            return subjects;
        },
        userVote(subject_id) {
            return this.$store.getters.getUserVote(subject_id);
        },
    },
};
</script>

<style lang="scss">
@import 'bootstrap/scss/_functions.scss';
@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/_mixins.scss';
@import '@/colors.scss';

.agree > .svg-logo {
    background: $blue;
}
.disagree > .svg-logo {
    background: $red;
}
.semiagree > .svg-logo {
    background: $yellow;
}
.neutral {
    color: $colorNeutral;
}

.term_name {
    font-size: 1.2rem;
}

.button:hover {
    color: #8987f3;
}

.content-row {
    border-top: 1px solid #efefef;
}

.content-row:hover {
    background-color: #f3f3f3;
}

.vote-list > div:not(:last-child),
.category-list > div:not(:last-child) {
    border-bottom: 1px solid $colorNeutral;
    margin-top: 2px;
    padding-bottom: 2px;
}

.vote-list > div,
.category-list > div {
    cursor: pointer;
}

.svg-col {
    padding: 0;
    margin: 0 2px;
}

.svg-logo-swiss {
    height: 30px;
    width: 30px;
}

.svg-logo {
    width: 30px;
    height: 20px;
    padding: 0;
    margin: 0;
}

.svg-party-logo {
    width: 30px;
    height: 30px;
    padding: 0;
    margin: 0;
}

@include media-breakpoint-up(md) {
    /* NOTE: larger icons for large layout */
    .svg-logo {
        width: 35px;
        height: 25px;
    }
    .svg-party-logo {
        width: 35px;
        height: 30px;
    }
}
</style>
