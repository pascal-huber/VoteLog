<template>
  <div class="col" :style="{ 'background-color': colorHex }" align="center">
    <font-awesome-icon
      v-if="percentage == '-'"
      class="neutral"
      :icon="['fas', 'grip-lines-vertical']"
    />
    <font-awesome-icon v-else-if="isNaN(percentage)" class="neutral" :icon="['fas', 'question']" />
    <span v-else> {{ percentage }}% </span>
  </div>
</template>

<script>
import { agreementColor } from '@/Answer.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'PercentageValue',
  components: {
    FontAwesomeIcon,
  },
  props: ['percentage', 'color'],
  computed: {
    colorHex() {
      if (!this.color || isNaN(this.percentage)) {
        return ''
      }
      return agreementColor(Number(this.percentage))
    },
  },
}
</script>
