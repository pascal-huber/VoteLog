import { createApp } from 'vue';
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap';

import Index from '@/components/Index.vue';
import store from '@/store/';
import router from '@/router.js';
import '@/icons.js';

const app = createApp(Index);
app.use(store);
app.use(router);
router.app = app;
app.mount('#app');
