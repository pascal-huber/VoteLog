<template>
  <!-- TODO: color percentage -->
  <div class="col" :style="{ 'background-color': colorHex }" align="center">
    <font-awesome-icon v-if="this.percentage == '-'" class="neutral" :icon="['fas', 'grip-lines-vertical']" />
    <font-awesome-icon v-else-if="isNaN(this.percentage)" class="neutral" :icon="['fas', 'question']" />
    <span v-else> {{ percentage }}% </span>
  </div>
</template>

<script>
import chroma from "chroma-js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const red = chroma.lab(67, 38, 26);
const yellow = chroma.lab(95, 12, 40);
const blue = chroma.lab(79, -6, -16);

export default {
  name: "PercentageValue",
  props: ["percentage", "color"],
  components: {
    FontAwesomeIcon,
  },
  computed: {
    colorHex() {
      if (!this.color || isNaN(this.percentage)) {
        return "";
      }
      let scale = chroma.scale([red, yellow, blue]).mode("lab");
      let pct = Number(this.percentage / 100);
      return scale(pct).hex();
    },
  },
};
</script>
