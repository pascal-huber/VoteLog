import { createRouter, createWebHashHistory } from 'vue-router'

import App from '@/components/App.vue'
import VotesTable from '@/components/VotesTable.vue'
import VotesTableCategories from '@/components/VotesTableCategories.vue'
import Login from '@/components/LoginForm.vue'
import NotFound from '@/components/NotFound.vue'
import ShowSubject from '@/components/ShowSubject.vue'
import EditSubject from '@/components/EditSubject.vue'

const routes = [
    {
        path: '/',
        // FIXME: compute redirection
        redirect: '/2019_23',
    },
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
            }, {
                path: 'categories',
                name: 'votesTableCategory',
                props: true,
                component: VotesTableCategories,
            }, {
                path: ':subject_id',
                name: 'showSubject',
                props: true,
                component: ShowSubject,
                meta: {
                    requiresAuth: true,
                },
            }, {
                path: ':subject_id/edit',
                name: 'editSubject',
                props: true,
                component: EditSubject,
                meta: {
                    requiresAuth: true,
                },
            }],
    }, {
        path: '/login',
        name: 'login',
        component: Login,
    }, {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
];

const router = new createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
