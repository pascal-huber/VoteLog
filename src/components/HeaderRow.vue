<template>
    <div id="headerrow" class="container">
        <div class="row g-0">
            <div class="col-lg-6 d-none d-lg-block"></div>
            <div class="col-lg-6 fixed-header">
                <div class="row g-0">
                    <div class="col svg-col" align="center">
                        <img :src="Switzerland" class="svg-logo-swiss" />
                    </div>
                    <div class="col svg-col" align="center">
                        <font-awesome-icon
                            class="fa-2x"
                            :icon="['fas', 'user']"
                        />
                    </div>
                    <div
                        v-for="party in parties"
                        :key="party.name"
                        class="col svg-col"
                        align="center"
                    >
                        <img
                            v-if="party.name == 'CVP'"
                            :src="DieMitte"
                            class="svg-party-logo"
                        />
                        <img
                            v-else-if="party.name == 'SVP'"
                            :src="SVP"
                            class="svg-party-logo"
                        />
                        <img
                            v-else-if="party.name == 'FDP'"
                            :src="FDP"
                            class="svg-party-logo"
                        />
                        <img
                            v-else-if="party.name == 'GLP'"
                            :src="GLP"
                            class="svg-party-logo"
                        />
                        <img
                            v-else-if="party.name == 'GP'"
                            :src="GP"
                            class="svg-party-logo"
                        />
                        <img
                            v-else-if="party.name == 'SP'"
                            :src="SP"
                            class="svg-party-logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Switzerland from '@/assets/switzerland_coat-of-arms.svg';
import DieMitte from '@/assets/diemitte.svg';
import SVP from '@/assets/party_svp.svg';
import FDP from '@/assets/party_fdp.svg';
import GLP from '@/assets/party_glp.svg';
import GP from '@/assets/party_gp.svg';
import SP from '@/assets/party_sp.svg';
export default {
    name: 'VotesTable',
    components: {
        FontAwesomeIcon,
    },
    props: ['parties'],
    setup() {
        return {
            Switzerland,
            DieMitte,
            SVP,
            FDP,
            GLP,
            GP,
            SP,
        };
    },
    data: function () {
        return {
            header: undefined,
            scroll: undefined,
        };
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        this.header = document.getElementById('headerrow');
        this.sticky = this.header?.offsetTop; // FIXME: why ?
    },
    unmounted() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        getOffsetTop(element) {
            let offsetTop = 0;
            while (element) {
                offsetTop += element.offsetTop;
                element = element.offsetParent;
            }
            return offsetTop;
        },
        handleScroll() {
            if (window.pageYOffset > this.sticky - 4) {
                this.header.classList.add('sticky');
            } else {
                this.header.classList.remove('sticky');
            }
        },
    },
};
</script>

<style>
.sticky {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    /* NOTE: background generated with https://cssgradient.io/ */
    background: rgb(255, 255, 255);
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 67%,
        rgba(255, 255, 255, 0.4254742547425474) 100%
    );
}

#headerrow > div {
    padding-top: 4px;
    padding-bottom: 10px;
}
</style>
