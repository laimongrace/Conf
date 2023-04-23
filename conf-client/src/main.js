import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { io } from 'socket.io-client';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
  })

const app = createApp(App);

// Установите соединение с Socket.IO сервером
const socket = io('https://localhost:3000');

// Добавьте сокет в глобальное пространство вашего приложения, чтобы он был доступен в компонентах
app.provide('socket', socket);

app.use(store).use(vuetify).use(router).mount('#app');
