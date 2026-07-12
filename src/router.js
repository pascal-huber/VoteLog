import { createRouter, createWebHashHistory } from 'vue-router'

import App from '@/components/App.vue'
import VotesTable from '@/components/VotesTable.vue'
import VotesTableCategories from '@/components/VotesTableCategories.vue'
import Login from '@/components/LoginForm.vue'
import NotFound from '@/components/NotFound.vue'
import ShowSubject from '@/components/ShowSubject.vue'
import EditSubject from '@/components/EditSubject.vue'
import store from '@/store/'

const routes = [
  {
    path: '/:term_hash',
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
        meta: {
          requiresAuth: true,
        },
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
    path: '/login',
    name: 'login',
    component: Login,
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

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth) && !store.getters.isLoggedIn()) {
    next({ name: 'login' })
    return
  }
  if (to.path == '/') {
    // no route actually matches bare '/': if the fetch fails and hash is
    // undefined, next() falls through to the catch-all NotFound route.
    const hash = await store.dispatch('ensureCurrentTerm')
    next(hash ? '/' + hash : undefined)
    return
  }
  if (to.params.term_hash) {
    await store.dispatch('ensureTerm', to.params.term_hash)
  }
  next()
})

export default router
