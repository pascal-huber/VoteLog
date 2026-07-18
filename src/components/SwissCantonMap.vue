<template>
  <div ref="mapEl" class="canton-map"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Answer } from '@/Answer.js'
import { CANTON_GEOJSON } from '@/assets/cantonGeo.js'
import Ja from '@/assets/ja.svg'
import Nein from '@/assets/nein.svg'

// Keep in sync with $blue/$red in colors.scss -- Leaflet paints paths
// directly (SVG attributes via inline style), not via CSS classes.
const YES_FILL = '#abc8e1'
const NO_FILL = '#ea8677'
const NEUTRAL_FILL = '#e5e5e5'

export default {
  name: 'SwissCantonMap',
  props: {
    cantonResults: {
      type: Array,
      required: true,
    },
  },
  computed: {
    cantonByCode() {
      return Object.fromEntries(this.cantonResults.map((c) => [c.code, c]))
    },
  },
  mounted() {
    this.map = L.map(this.$refs.mapEl, {
      minZoom: 6,
      maxZoom: 10,
      attributionControl: false,
    })
    L.control.attribution({ prefix: false }).addTo(this.map)

    const layer = L.geoJSON(CANTON_GEOJSON, {
      attribution: this.$t('showSubject.mapCredit'),
      style: (feature) => this.cantonStyle(feature),
      onEachFeature: (feature, path) => {
        const canton = this.cantonByCode[feature.properties.code]
        path.bindTooltip(this.tooltipHtml(canton), { sticky: true, direction: 'top' })
      },
    }).addTo(this.map)

    const bounds = layer.getBounds()
    this.map.fitBounds(bounds)
    this.map.setMaxBounds(bounds.pad(0.2))
  },
  beforeUnmount() {
    this.map?.remove()
  },
  methods: {
    cantonStyle(feature) {
      const canton = this.cantonByCode[feature.properties.code]
      let fillColor = NEUTRAL_FILL
      if (canton?.answer == Answer.Yes) fillColor = YES_FILL
      else if (canton?.answer == Answer.No) fillColor = NO_FILL
      return {
        fillColor,
        fillOpacity: 1,
        color: '#fff',
        weight: 1,
      }
    },
    tooltipHtml(canton) {
      if (!canton) return ''
      let badge = '<span class="canton-tooltip-neutral">?</span>'
      if (canton.answer == Answer.Yes) badge = `<img src="${Ja}" class="svg-logo" />`
      else if (canton.answer == Answer.No) badge = `<img src="${Nein}" class="svg-logo" />`
      const percent = canton.percent
        ? `<small class="text-muted">${canton.percent}${this.$t('showSubject.yesPercent')}</small>`
        : ''
      return `<div class="canton-tooltip-content"><strong>${canton.name}</strong>${badge}${percent}</div>`
    },
  },
}
</script>

<style scoped>
.canton-map {
  width: 100%;
  max-width: 30rem;
  height: 20rem;
  border-radius: 0.25rem;
}
</style>

<style>
.canton-tooltip-content {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.canton-tooltip-neutral {
  color: #999;
}
</style>
