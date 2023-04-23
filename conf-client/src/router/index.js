import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/home-page.vue')
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: () => import('@/views/register-page.vue')
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/login-page.vue')
  },
  {
    path: '/rooms',
    name: 'RoomsPage',
    component: () => import('@/views/rooms-page.vue')
  },
  {
    path: '/room/:id',
    name: 'RoomPage',
    component: () => import('@/views/room-page.vue')
  },
  {
    path: '/vid',
    name: 'VideoConference',
    component: () => import('@/views/VideoConference.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
