import { start } from 'qiankun';
import { createApp } from 'vue';
import App from './App.vue';
import './styles.css';

// Install routing notifications before the first MicroAppLink click, even on the dashboard.
start();

createApp(App).mount('#app');
