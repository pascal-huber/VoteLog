import { createRouter, createWebHashHistory } from 'vue-router';

import App from '@/components/App.vue';
import VotesTable from '@/components/VotesTable.vue';
import VotesTableCategories from '@/components/VotesTableCategories.vue';
import Login from '@/components/LoginForm.vue';
import NotFound from '@/components/NotFound.vue';
import ShowSubject from '@/components/ShowSubject.vue';
import EditSubject from '@/components/EditSubject.vue';
import store from '@/store/';

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
];

const router = new createRouter({
    history: createWebHashHistory(),
    routes,
});

let defaultTerm = () => {
    const now = new Date();
    let terms = store.getters.getTerms();
    terms.sort((a, b) => a.start_date > b.start_date);
    let i = 0;
    let currentTerm = terms[i];
    while (i + 1 < terms.length && currentTerm.end_date < now)
        currentTerm = terms[++i];
    return currentTerm?.hash;
};

router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        next('/' + defaultTerm());
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    store.dispatch('init').then(() => {
        if (
            to.matched.some((record) => record.meta.requiresAuth) &&
            !store.getters.isLoggedIn()
        ) {
            next({ name: 'login' });
        } else {
            next();
        }
    });
});

export default router;
