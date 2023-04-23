<template>
  <div>
    <h1>Комната {{roomId }}</h1>
<!-- Интерфейс конференции -->

  </div>
</template>
<script>
export default {
  name: 'RoomPage',
  props: ['id'],
  computed: {
    roomId() {
      return this.id;
    }
  },
  components: {
    
  },
  
};
</script>