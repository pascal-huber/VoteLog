<template>
  <!-- TODO: color percentage -->
  <div class="col svg-col" :style="{ 'background-color': colorHex }" align="center">
    <font-awesome-icon v-if="this.percentage == '-'" class="neutral" :icon="['fas', 'grip-lines-vertical']" />
    <font-awesome-icon v-else-if="isNaN(this.percentage)" class="neutral" :icon="['fas', 'question']" />
    <span v-else> {{ percentage }}% </span>
  </div>
</template>

<script>
import chroma from "chroma-js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const red = chroma.lab(67.27, 38.01, 25.63);
const yellow = chroma.lab(89.61, 2.04, 60.43);
const green = chroma.lab(82.92, -35.03, 29.72);

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
      let scale = chroma.scale([red, yellow, green]).mode("lab");
      let pct = Number(this.percentage / 100);
      return scale(pct).hex();
    },
  },
};
</script>
