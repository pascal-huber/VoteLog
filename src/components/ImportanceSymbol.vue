<template>
  <span class="importance" v-if="importance != undefined">
    <font-awesome-icon v-if="importance == 4" :icon="['fas', 'angle-double-up']" />
    <font-awesome-icon v-else-if="importance == 2" :icon="['fas', 'angle-up']" />
    <font-awesome-icon class="text-secondary" v-else-if="importance == 0" :icon="['fas', 'angle-down']" />
  </span>
  <span class="importance" v-else></span>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "VotesTableSubject",
  props: ["importance"],
  components: {
    FontAwesomeIcon,
  },
};
</script>