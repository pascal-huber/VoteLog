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
        path: '/login',
        name: 'login',
        props: true,
        component: Login,
    },
    {
        path: '/terms/:term_hash',
        name: 'term',
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
                path: 'votes/:subject_id',
                name: 'showSubject',
                props: true,
                component: ShowSubject,
            },
            {
                path: 'votes/:subject_id/edit',
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
        // redirect to default Term
        path: '/:pathMatch(.*)*',
        redirect: (to) => {
            const defaultTermHash = store.getters.getDefaultTerm().hash;
            return {
                name: 'votesTable',
                params: {
                    term_hash: defaultTermHash,
                },
            };
        },
    },
];

const router = new createRouter({
    history: createWebHashHistory(),
    routes,
});

// Login redirection
router.beforeEach((to, from, next) => {
    store.dispatch('init').then(() => {
        if (to.name == 'login' && store.getters.isLoggedIn()) {
            next({ name: from.name });
        } else if (
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
