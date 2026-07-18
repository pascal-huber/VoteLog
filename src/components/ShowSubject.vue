<template>
  <div class="container">
    <div v-if="!subject" class="row">
      <div class="col">
        <h2>{{ $t('showSubject.notFound') }}</h2>
      </div>
    </div>
    <div v-else>
      <!-- Vote title -->
      <div>
        <h2>{{ subject.name }}</h2>
        <dl class="row mb-0 mt-3">
          <dt class="col-sm-3 fw-normal">{{ $t('showSubject.id') }}</dt>
          <dd class="col-sm-9">{{ subject.id }}</dd>

          <dt class="col-sm-3 fw-normal">{{ $t('showSubject.date') }}</dt>
          <dd class="col-sm-9">{{ subject.date.toLocaleDateString('de-CH') }}</dd>

          <template v-if="subject?.raw?.titel?.kurz?.d">
            <dt class="col-sm-3 fw-normal">{{ $t('showSubject.shortTitle') }}</dt>
            <dd class="col-sm-9">{{ subject.raw.titel.kurz.d }}</dd>
          </template>

          <template v-if="subject?.raw?.titel?.off?.d">
            <dt class="col-sm-3 fw-normal">{{ $t('showSubject.officialTitle') }}</dt>
            <dd class="col-sm-9">{{ subject.raw.titel.off.d }}</dd>
          </template>

          <template v-if="subject.categories?.length">
            <dt class="col-sm-3 fw-normal">{{ $t('showSubject.categories') }}</dt>
            <dd class="col-sm-9">{{ uniqueCategories.join(', ') }}</dd>
          </template>
        </dl>
      </div>

      <!-- My vote -->
      <template v-if="loggedIn">
        <hr class="my-4" />
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="mb-0">{{ $t('showSubject.yourVote') }}</h3>
          <router-link
            :to="{
              name: 'editSubject',
              params: {
                locale: $route.params.locale,
                term_hash: term_hash,
                subject_id: subject_id,
              },
            }"
            type="button"
            class="btn btn-primary btn-sm"
          >
            {{ $t('showSubject.edit') }}
          </router-link>
        </div>
        <dl class="row mb-0 mt-2">
          <dt class="col-sm-3 fw-normal">{{ $t('showSubject.vote') }}</dt>
          <dd class="col-sm-9">
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
          </dd>

          <dt class="col-sm-3 fw-normal">{{ $t('showSubject.weight') }}</dt>
          <dd class="col-sm-9">
            <img :src="importanceIcon" class="svg-logo" />
          </dd>

          <dt class="col-sm-3 fw-normal">{{ $t('showSubject.reasoning') }}</dt>
          <dd class="col-sm-9">
            <span class="text-wrap" style="white-space: pre">{{ userVote?.reasoning }}</span>
          </dd>
        </dl>
      </template>

      <!-- Results -->
      <hr class="my-4" />
      <h3>{{ $t('showSubject.results') }}</h3>
      <div>
        <div class="canton-row">
          <span class="canton-name">{{ $t('showSubject.overallResult') }}</span>
          <img v-if="subject.outcome == Answer.Yes" :src="Ja" class="svg-logo" />
          <img v-else-if="subject.outcome == Answer.No" :src="Nein" class="svg-logo" />
          <font-awesome-icon v-else class="neutral" :icon="['fas', 'question']" />
          <small v-if="nationalPercent" class="text-muted ms-2"
            >{{ nationalPercent }}{{ $t('showSubject.yesPercent') }}</small
          >
        </div>

        <div
          class="accordion-toggle"
          data-bs-toggle="collapse"
          data-bs-target="#cantons-collapse"
          aria-expanded="false"
          aria-controls="cantons-collapse"
        >
          {{ $t('showSubject.cantons') }}
          <font-awesome-icon :icon="['fas', 'angle-down']" class="chevron" />
        </div>
        <div id="cantons-collapse" class="collapse">
          <div v-for="canton in cantonResults" :key="canton.code" class="canton-row">
            <span class="canton-name">{{ canton.name }}</span>
            <img v-if="canton.answer == Answer.Yes" :src="Ja" class="svg-logo" />
            <img v-else-if="canton.answer == Answer.No" :src="Nein" class="svg-logo" />
            <font-awesome-icon v-else class="neutral" :icon="['fas', 'question']" />
            <small v-if="canton.percent" class="text-muted ms-2"
              >{{ canton.percent }}{{ $t('showSubject.yesPercent') }}</small
            >
          </div>
        </div>

        <div
          class="accordion-toggle"
          data-bs-toggle="collapse"
          data-bs-target="#parties-collapse"
          aria-expanded="false"
          aria-controls="parties-collapse"
        >
          {{ $t('showSubject.allParties') }}
          <font-awesome-icon :icon="['fas', 'angle-down']" class="chevron" />
        </div>
        <div id="parties-collapse" class="collapse">
          <div v-for="party in partyResults" :key="party.key" class="canton-row">
            <span class="canton-name">{{ party.label }}</span>
            <img v-if="party.answer == Answer.Yes" :src="Ja" class="svg-logo" />
            <img v-else-if="party.answer == Answer.No" :src="Nein" class="svg-logo" />
            <img v-else-if="party.answer == Answer.Abstention" :src="Abstention" class="svg-logo" />
          </div>
        </div>
      </div>

      <!-- Resources -->
      <hr class="my-4" />
      <h3>{{ $t('showSubject.moreResources') }}</h3>
      <ul class="list-unstyled mb-0">
        <li>
          <a :href="swissvotesURL" target="_blank">{{ $t('showSubject.linkSwissvotes') }}</a>
        </li>
        <li>
          <a :href="adminCantonResultsURL" target="_blank">{{
            $t('showSubject.linkAdminResults')
          }}</a>
        </li>
        <li v-if="subject?.raw?.anneepolitique">
          <a :href="subject.raw.anneepolitique" target="_blank">{{
            $t('showSubject.linkAnneePolitique')
          }}</a>
        </li>
        <li v-if="subject?.raw?.bkchrono?.de">
          <a :href="subject.raw.bkchrono.de" target="_blank">{{
            $t('showSubject.linkChronologie')
          }}</a>
        </li>
        <li v-if="subject?.raw?.curiavista?.de">
          <a :href="subject.raw.curiavista.de" target="_blank">{{
            $t('showSubject.linkCuriaVista')
          }}</a>
        </li>
        <li v-if="subject?.raw?.info?.br?.de">
          <a :href="subject.raw.info.br.de" target="_blank">{{ $t('showSubject.linkInfoBr') }}</a>
        </li>
        <li v-if="subject?.raw?.info?.amt?.de">
          <a :href="subject.raw.info.amt.de" target="_blank">{{
            $t('showSubject.linkInfoAmt')
          }}</a>
        </li>
        <li v-if="subject?.raw?.easyvideo?.de">
          <a :href="subject.raw.easyvideo.de" target="_blank">{{
            $t('showSubject.linkErklaervideo')
          }}</a>
        </li>
        <li v-for="link in webArgumentLinks" :key="link.label">
          <a :href="link.url" target="_blank">{{ link.label }}</a>
        </li>
      </ul>

      <!-- Raw data -->
      <hr class="my-4" />
      <h3
        class="accordion-toggle"
        data-bs-toggle="collapse"
        data-bs-target="#rawdata-collapse"
        aria-expanded="false"
        aria-controls="rawdata-collapse"
      >
        {{ $t('showSubject.rawData') }}
        <font-awesome-icon :icon="['fas', 'angle-down']" class="chevron" />
      </h3>
      <div id="rawdata-collapse" class="collapse">
        <pre class="rohdaten mb-4">{{ JSON.stringify(subject?.raw, null, 2) }}</pre>
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
import T0x from '@/assets/0x.svg'
import T1x from '@/assets/1x.svg'
import T2x from '@/assets/2x.svg'
import T4x from '@/assets/4x.svg'
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
    importanceIcon() {
      switch (this.userVote?.importance) {
        case 0:
          return T0x
        case 2:
          return T2x
        case 4:
          return T4x
        default:
          return T1x
      }
    },
    nationalPercent() {
      const proz = this.subject?.raw?.volkja?.proz
      return proz && proz !== '.' ? proz : undefined
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
            const key =
              side === 'yes' ? 'showSubject.linkArgumentsPro' : 'showSubject.linkArgumentsContra'
            links.push({ label: this.$t(key, { n }), url })
          }
        }
      }
      return links
    },
  },
}
</script>

<style scoped>
.accordion-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-top: 1px solid #ddd;
  cursor: pointer;
}

.canton-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.15rem 0;
}

.canton-name {
  width: 12rem;
}

.chevron {
  transition: transform 0.2s ease;
}

[aria-expanded='true'] .chevron {
  transform: rotate(180deg);
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
