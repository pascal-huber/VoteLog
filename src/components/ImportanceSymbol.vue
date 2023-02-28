<template>
    <span v-if="importance != undefined" class="importance">
        <font-awesome-icon v-if="importance == 4" :icon="['fas', 'angle-double-up']" />
        <font-awesome-icon v-else-if="importance == 2" :icon="['fas', 'angle-up']" />
        <font-awesome-icon v-else-if="importance == 0" class="text-secondary" :icon="['fas', 'angle-down']" />
    </span>
    <span v-else class="importance"></span>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
export default {
    name: 'VotesTableSubject',
    components: {
        FontAwesomeIcon,
    },
    props: ['importance'],
};
</script>
