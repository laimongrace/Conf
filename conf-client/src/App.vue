<template>
  <div id="app">
    <nav>
      <router-link v-if="!userLoggedIn" to="/login" :key="$route.fullPath">Login</router-link>
      <router-link v-if="!userLoggedIn" to="/register" :key="$route.fullPath">Register</router-link>
      <router-link v-if="userLoggedIn" to="/rooms" :key="$route.fullPath">Rooms</router-link>
      <router-link v-if="userLoggedIn" to="/vid" :key="$route.fullPath">vid</router-link>
      <button v-if="userLoggedIn" @click="logout">Logout</button>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'App',
  components: {
    
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  data() {
    return {
      userLoggedIn: false,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.userLoggedIn = false;
      this.$router.push('/login');
    },
    checkUserStatus() {
      this.userLoggedIn = !!Cookies.get('token');
    },
  },
  mounted() {
    this.checkUserStatus();
  },
};

</script>

<style>
nav {
  display: flex;
  gap: 1rem;
}
</style>
