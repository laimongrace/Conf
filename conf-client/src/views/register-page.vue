<template>
  <v-container class="register-page" fluid>
    <v-row align="center">
      <v-col cols="12" md="">
        <v-card class="pa-5" outlined>
          <h1 class="mb-6">Register</h1>
          <v-form @submit.prevent="register">
            <v-text-field
              v-model="name"
              label="Name"
              id="name"
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="Email"
              id="email"
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              id="password"
              type="password"
            ></v-text-field>
            <v-btn color="primary" type="submit">Register</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template> 

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
      try {
        await this.$store.dispatch('register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        this.$router.push('/');
        this.$root.$data.userLoggedIn = true; 
      } catch (error) {
        console.error('Error registering:', error);
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

