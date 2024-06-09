<template>
    <div class="container">
        <div class="row gy-2">
            <div class="col-sm-12 col-md-10">
                <h3 v-if="!subject">Vorlage nicht gefunden</h3>
                <h3 v-else>{{ subject.name }}</h3>
            </div>

            <div class="col-12">
                <div class="form-group">
                    <label>Stimme:</label><br />
                    <img
                        :src="Novote"
                        class="svg-logo-huge"
                        role="button"
                        :class="{
                            active:
                                userVote.answer == Answer.Novote ||
                                userVote.answer == undefined,
                        }"
                        @click="setAnswer(Answer.Novote)"
                    />
                    <img
                        :src="Ja"
                        class="svg-logo-huge"
                        role="button"
                        :class="{ active: userVote.answer == Answer.Yes }"
                        @click="setAnswer(Answer.Yes)"
                    />
                    <img
                        :src="Abstention"
                        class="svg-logo-huge"
                        role="button"
                        :class="{
                            active: userVote.answer == Answer.Abstention,
                        }"
                        @click="setAnswer(Answer.Abstention)"
                    />
                    <img
                        :src="Nein"
                        class="svg-logo-huge"
                        role="button"
                        :class="{ active: userVote.answer == Answer.No }"
                        @click="setAnswer(Answer.No)"
                    />
                </div>
            </div>

            <div class="col-12">
                <div class="form-group">
                    <label>Begründung:</label><br />
                    <textarea
                        id="reasoning"
                        v-model="userVote.reasoning"
                        class="form-control"
                        rows="4"
                    ></textarea>
                </div>
            </div>

            <!-- TODO: add importance to userVote and scale agreements -->
            <div class="col-12">
                <label>Gewichtung:</label><br />
                <img
                    :src="T0x"
                    class="svg-logo-huge"
                    role="button"
                    :class="{ active: userVote.importance == 0 }"
                    @click="setImportance(0)"
                />
                <img
                    :src="T1x"
                    class="svg-logo-huge"
                    role="button"
                    :class="{
                        active: userVote.importance == undefined,
                    }"
                    @click="setImportance(undefined)"
                />
                <img
                    :src="T2x"
                    class="svg-logo-huge"
                    role="button"
                    :class="{ active: userVote.importance == 2 }"
                    @click="setImportance(2)"
                />
                <img
                    :src="T4x"
                    class="svg-logo-huge"
                    role="button"
                    :class="{ active: userVote.importance == 4 }"
                    @click="setImportance(4)"
                />
            </div>

            <div class="col-12">
                <button type="button" class="btn btn-primary" @click="goBack">
                    Abbrechen
                </button>
                &nbsp;
                <button
                    type="button"
                    class="btn btn-primary"
                    @click="changeVote"
                >
                    Fertig
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { Answer } from '../Answer.js';
import Novote from '@/assets/novote.svg';
import Ja from '@/assets/yes.svg';
import Abstention from '@/assets/abstention.svg';
import Nein from '@/assets/no.svg';
import T0x from '@/assets/0x.svg';
import T1x from '@/assets/1x.svg';
import T2x from '@/assets/2x.svg';
import T4x from '@/assets/4x.svg';

export default {
    name: 'EditSubject',
    props: ['term_hash', 'subject_id'],
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
    data: function () {
        return {
            subject: this.$store.getters.getSubjectByHash(
                this.term_hash,
                this.subject_id,
            ),
            userVote: this.$store.getters.getUserVote(this.subject_id) || {},
        };
    },
    computed: {
        importanceText() {
            switch (true) {
                case this.userVote.importance == 0:
                    return 'irrelevant (x0)';
                case this.userVote.importance == 1:
                    return 'normal (x1)';
                case this.userVote.importance == 2:
                    return 'wichtig (x2)';
                case this.userVote.importance == 3:
                    return 'sehr wichtig (x4)';
                default:
                    return 'fdsa';
            }
        },
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        setAnswer(answer) {
            this.userVote.answer = answer;
        },
        setImportance(importance) {
            this.userVote.importance = importance;
        },
        changeVote() {
            var vote = {
                id: this.subject.id,
                answer: this.userVote.answer,
                reasoning: this.userVote.reasoning
                    ? this.userVote.reasoning
                    : undefined,
                importance: this.userVote.importance,
            };
            if (
                this.userVote.answer != undefined ||
                this.userVote.reasoning ||
                this.userVote.importance != undefined
            ) {
                this.$store.dispatch('setVote', vote);
            }
            this.$router.go(-1);
        },
    },
};
</script>

<style lang="scss">
@import '@/colors.scss';
.svg-logo-huge {
    width: 60px;
    height: 40px;
    padding: 0;
    margin: 1rem;
}

.svg-logo-huge.active {
    background-color: $blue;
}
</style>
