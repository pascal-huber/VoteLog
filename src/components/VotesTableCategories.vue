<template>
    <div class="container">
        <div v-if="!term" class="row">
            <div class="col">
                <h2>Legislaturperiode nicht gefunden</h2>
            </div>
        </div>
        <div v-else class="row">
            <div class="col col-6 col-md-6">
                <h2>Kategorien</h2>
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
            <div class="category-list">
                <div
                    v-for="(agreement, category) in agreementCategories"
                    :key="category"
                >
                    <VotesTableCategory
                        :category="category"
                        :agreement="agreement"
                        :parties="term.parties"
                        :term_hash="term.hash"
                        :logged-in="loggedIn"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { categoryAgreement } from '@/Answer.js';
import VotesTableCategory from '@/components/VotesTableCategory.vue';
import HeaderRow from '@/components/HeaderRow.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    name: 'VotesTable',
    components: {
        VotesTableCategory,
        HeaderRow,
        FontAwesomeIcon,
    },
    props: ['term'],
    data: function () {
        return {
            editSubject: undefined,
            editUserVote: undefined,
            filter: 'all',
        };
    },
    computed: {
        agreementCategories() {
            const userVotes = this.$store.getters.getUserVotes();
            const agreement = categoryAgreement(userVotes, this.term.subjects);
            const ordered = Object.keys(agreement)
                .sort()
                .reduce((obj, key) => {
                    obj[key] = agreement[key];
                    return obj;
                }, {});
            return ordered;
        },
        categories() {
            let categories = new Set();
            for (var i = 0; i < this.term.subjects.length; i++) {
                let vote = this.term.subjects[i];
                if (vote.categories) {
                    for (var ii = 0; ii < vote.categories.length; ii++) {
                        categories.add(vote.categories[ii][0]);
                    }
                }
            }
            return Array.from(categories).sort();
        },
        filteredSubjects() {
            if (this.filter == 'all') {
                return this.term.subjects;
            }
            return this.term.subjects.filter((subject) => {
                if (!subject.categories) {
                    return false;
                }
                for (var i = 0; i < subject.categories.length; i++) {
                    let subject_str = subject.categories[i].join('###');
                    if (subject_str.startsWith(this.filter)) {
                        return true;
                    }
                }
                return false;
            });
        },
        loggedIn() {
            return this.$store.getters.isLoggedIn();
        },
        orderedSubjects() {
            return [...this.subjects].sort((a, b) => {
                if (a.date.getTime() == b.date.getTime()) {
                    return a.name > b.name;
                }
                a.date < b.date;
            });
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
        edit(subject) {
            this.editSubject = subject;
            this.editUserVote = this.userVote(subject.id);
        },
        finishEdit() {
            this.editSubject = undefined;
            this.editUserVote = undefined;
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
