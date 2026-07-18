import { createRouter, createWebHashHistory } from 'vue-router'

import App from '@/components/App.vue'
import VotesTable from '@/components/VotesTable.vue'
import VotesTableCategories from '@/components/VotesTableCategories.vue'
import Login from '@/components/LoginForm.vue'
import NotFound from '@/components/NotFound.vue'
import ErrorPage from '@/components/ErrorPage.vue'
import ShowSubject from '@/components/ShowSubject.vue'
import EditSubject from '@/components/EditSubject.vue'
import store from '@/store/'
import i18n, { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/'

const routes = [
  {
    // No term_hash yet: resolved to the current legislatur (or the error
    // page) by the guard below, see the 'localeHome' branch.
    path: '/:locale',
    name: 'localeHome',
    component: NotFound,
  },
  {
    path: '/:locale/:term_hash',
    name: 'home',
    props: true,
    component: App,
    children: [
      {
        path: '',
        name: 'votesTable',
        props: true,
        component: VotesTable,
      },
      {
        path: 'categories',
        name: 'votesTableCategory',
        props: true,
        component: VotesTableCategories,
      },
      {
        path: ':subject_id',
        name: 'showSubject',
        props: true,
        component: ShowSubject,
      },
      {
        path: ':subject_id/edit',
        name: 'editSubject',
        props: true,
        component: EditSubject,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/:locale/login',
    name: 'login',
    props: true,
    component: Login,
  },
  {
    path: '/:locale/error',
    name: 'error',
    props: true,
    component: ErrorPage,
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
  },
]

const router = new createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const locale = to.params.locale
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    // Also catches pre-i18n bookmarks (e.g. "/52"), which lack a locale
    // segment entirely: re-resolving "/<default-locale><old-path>" lines
    // the remaining segments back up with the routes below.
    const suffix = to.fullPath === '/' ? '' : to.fullPath
    return '/' + DEFAULT_LOCALE + suffix
  }
  i18n.global.locale.value = locale

  if (to.matched.some((record) => record.meta.requiresAuth) && !store.getters.isLoggedIn()) {
    return { name: 'login', params: { locale } }
  }
  if (to.name === 'localeHome') {
    const hash = await store.dispatch('ensureCurrentTerm')
    if (store.getters.getError()) {
      return { name: 'error', params: { locale } }
    }
    return hash ? { name: 'votesTable', params: { locale, term_hash: hash } } : true
  }
  if (to.params.term_hash) {
    await store.dispatch('ensureTerm', to.params.term_hash)
    if (store.getters.getError()) {
      return { name: 'error', params: { locale } }
    }
  }
  return true
})

export default router
