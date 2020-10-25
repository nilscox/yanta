import { createWebHistory, createRouter } from 'vue-router';

import Home from './views/Home/Home.vue';
import Note from './views/Note/Note.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:path(.*)',
    name: 'Note',
    component: Note,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
