import { createApp } from 'vue';

import router from './router';
import App from './App.vue';

import 'milligram';
import 'normalize.css';

import 'fontsource-roboto';
import 'fontsource-source-code-pro';

import './index.css';
import './github-markdown.css';

createApp(App)
  .use(router)
  .mount('#app');
