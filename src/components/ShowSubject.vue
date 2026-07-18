<template>
  <div class="container">
    <div class="row gy-2">
      <div class="col-sm-12 col-md-10">
        <h2 v-if="!subject">Vorlage nicht gefunden</h2>
        <h2 v-else>{{ subject.name }}</h2>
      </div>
      <div class="col-sm-12 col-md-2 md-text-end"></div>

      <div class="col-2">ID:</div>
      <div class="col-10">
        {{ subject.id }}
      </div>

      <div class="col-2">Datum:</div>
      <div class="col-10">
        {{ subject.date.toLocaleDateString('de-CH') }}
      </div>

      <div v-if="subject?.raw?.titel?.kurz?.d" class="col-2">Kurztitel:</div>
      <div v-if="subject?.raw?.titel?.kurz?.d" class="col-10">
        {{ subject.raw.titel.kurz.d }}
      </div>

      <div v-if="subject?.raw?.titel?.off?.d" class="col-2">Offizieller Titel:</div>
      <div v-if="subject?.raw?.titel?.off?.d" class="col-10">
        {{ subject.raw.titel.off.d }}
      </div>

      <div v-if="subject.categories?.length" class="col-2">Kategorien:</div>
      <div v-if="subject.categories?.length" class="col-10">
        <ul>
          <li v-for="category in uniqueCategories" :key="category">
            <span>
              {{ category }}
            </span>
          </li>
        </ul>
      </div>

      <template v-if="loggedIn">
        <div class="col-12 col-md-6 mt-4">
          <h4>Deine Stimme</h4>
        </div>
        <div class="col-12 col-md-6 mt-4">
          <router-link
            :to="{
              name: 'editSubject',
              params: {
                term_hash: term_hash,
                subject_id: subject_id,
              },
            }"
            type="button"
            class="btn btn-primary"
          >
            Bearbeiten
          </router-link>
        </div>

        <div class="col-3">Stimme:</div>
        <div class="col-9">
          <font-awesome-icon
            v-if="userVote == undefined"
            class="neutral"
            :icon="['fas', 'question']"
          />
          <img v-else-if="userVote?.answer == Answer.Yes" :src="Ja" class="svg-logo" />
          <img v-else-if="userVote?.answer == Answer.No" :src="Nein" class="svg-logo" />
          <img
            v-else-if="userVote?.answer == Answer.Abstention"
            :src="Abstention"
            class="svg-logo"
          />
          <font-awesome-icon v-else class="neutral" :icon="['fas', 'question']" />
        </div>

        <div class="col-3">Gewichtung:</div>
        <div v-if="userVote?.importance == 0" class="col-9">0</div>
        <div v-else class="col-9">{{ userVote?.importance || 1 }}x</div>

        <div class="col-3">Begründung:</div>
        <div class="col-9">
          <span class="text-wrap" style="white-space: pre">
            {{ userVote?.reasoning }}
          </span>
        </div>
      </template>

      <div class="col-12 mt-4">
        <details>
          <summary>Kantone</summary>
          <ul class="list-unstyled mt-2">
            <li v-for="canton in cantonResults" :key="canton.code" class="canton-row">
              <span class="canton-name">{{ canton.name }}</span>
              <img v-if="canton.answer == Answer.Yes" :src="Ja" class="svg-logo" />
              <img v-else-if="canton.answer == Answer.No" :src="Nein" class="svg-logo" />
              <font-awesome-icon v-else class="neutral" :icon="['fas', 'question']" />
              <small v-if="canton.percent" class="text-muted ms-2">{{ canton.percent }}% Ja</small>
            </li>
          </ul>
        </details>
      </div>

      <div class="col-12 mt-2">
        <details>
          <summary>Alle Parteien</summary>
          <ul class="list-unstyled mt-2">
            <li v-for="party in partyResults" :key="party.key" class="canton-row">
              <span class="canton-name">{{ party.label }}</span>
              <img v-if="party.answer == Answer.Yes" :src="Ja" class="svg-logo" />
              <img v-else-if="party.answer == Answer.No" :src="Nein" class="svg-logo" />
              <img v-else-if="party.answer == Answer.Abstention" :src="Abstention" class="svg-logo" />
            </li>
          </ul>
        </details>
      </div>

      <div class="col-12 mt-4">
        <h4>Weitere Resourcen</h4>
        <ul>
          <li>
            <a :href="swissvotesURL" target="_blank">Vorlage auf swissvotes.ch</a>
          </li>
          <li>
            <a :href="adminCantonResultsURL" target="_blank">Resultate auf admin.ch</a>
          </li>
          <li v-if="subject?.raw?.anneepolitique">
            <a :href="subject.raw.anneepolitique" target="_blank">Année Politique Suisse</a>
          </li>
          <li v-if="subject?.raw?.bkchrono?.de">
            <a :href="subject.raw.bkchrono.de" target="_blank">Chronologie (admin.ch)</a>
          </li>
          <li v-if="subject?.raw?.curiavista?.de">
            <a :href="subject.raw.curiavista.de" target="_blank">Curia Vista (Parlament)</a>
          </li>
          <li v-if="subject?.raw?.info?.br?.de">
            <a :href="subject.raw.info.br.de" target="_blank">Information des Bundesrats</a>
          </li>
          <li v-if="subject?.raw?.info?.amt?.de">
            <a :href="subject.raw.info.amt.de" target="_blank">Information des zuständigen Amts</a>
          </li>
          <li v-if="subject?.raw?.easyvideo?.de">
            <a :href="subject.raw.easyvideo.de" target="_blank">Erklärvideo</a>
          </li>
          <li v-for="link in webArgumentLinks" :key="link.label">
            <a :href="link.url" target="_blank">{{ link.label }}</a>
          </li>
        </ul>
      </div>

      <div class="col-12 mt-2 mb-4">
        <details>
          <summary>Rohdaten</summary>
          <pre class="rohdaten mt-2">{{ JSON.stringify(subject?.raw, null, 2) }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script>
import { Answer } from '../Answer.js'
import { CANTONS, paroleAnswer, hasParoleValue } from '@/api.js'

import Ja from '@/assets/ja.svg'
import Nein from '@/assets/nein.svg'
import Abstention from '@/assets/abstention.svg'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'ShowSubject',
  components: {
    FontAwesomeIcon,
  },
  props: ['term_hash', 'subject_id'],
  setup() {
    return {
      Abstention,
      Answer,
      Ja,
      Nein,
    }
  },
  data: function () {
    return {
      subject: this.$store.getters.getSubjectByHash(this.term_hash, this.subject_id),
      userVote: this.$store.getters.getUserVote(this.subject_id),
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn()
    },
    uniqueCategories() {
      let categories = new Set()
      for (var i = 0; i < this.subject.categories.length; i++) {
        categories.add(this.subject.categories[i][0])
      }
      return [...categories]
    },
    swissvotesURL() {
      return (
        this.subject?.raw?.swissvoteslink || 'https://swissvotes.ch/vote/' + this.subject.id + '.00'
      )
    },
    adminCantonResultsURL() {
      return (
        'https://www.bk.admin.ch/ch/d/pore/va/' +
        this.subject.date.getFullYear() +
        ('0' + (this.subject.date.getMonth() + 1)).slice(-2) +
        ('0' + this.subject.date.getDate()).slice(-2) +
        '/index.html'
      )
    },
    cantonResults() {
      return CANTONS.map((canton) => {
        const data = this.subject?.raw?.[canton.code]
        const annahme = data?.annahme
        const percent = data?.japroz && data.japroz !== '.' ? data.japroz : undefined
        return {
          code: canton.code,
          name: canton.name,
          answer: annahme === '1' ? Answer.Yes : annahme === '0' ? Answer.No : undefined,
          percent,
        }
      })
    },
    // Every "p.*" entry with an actual recommendation (excludes "9999" =
    // organisation didn't exist yet, "." = unset, and "others", which is a
    // free-text list of supporting organisations rather than a code).
    partyResults() {
      const p = this.subject?.raw?.p
      if (!p) return []
      return Object.entries(p)
        .filter(([key, code]) => key !== 'others' && hasParoleValue(code))
        .map(([key, code]) => ({ key, label: key.toUpperCase(), answer: paroleAnswer(code) }))
        .sort((a, b) => a.label.localeCompare(b.label))
    },
    webArgumentLinks() {
      const web = this.subject?.raw?.web
      if (!web) return []
      const links = []
      for (const side of ['yes', 'no']) {
        for (const n of [1, 2, 3]) {
          const url = web[side]?.[n]?.de
          if (url) {
            links.push({ label: `${side === 'yes' ? 'Pro' : 'Kontra'}-Argumente ${n}`, url })
          }
        }
      }
      return links
    },
  },
}
</script>

<style scoped>
.canton-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.15rem 0;
}

.canton-name {
  width: 12rem;
}

.rohdaten {
  max-height: 30rem;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  background: #f6f6f6;
  padding: 0.75rem;
  font-size: 0.8rem;
}
</style>
