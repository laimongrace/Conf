<template>
  <div>
    <h1>Rooms</h1>
    <p v-if="isAuthenticated">Вы вошли в систему</p>
  </div>
</template>

<script>
export default {
  name: 'RoomsPage',
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
};
</script>
