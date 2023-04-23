<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-5" outlined>
          <h1 class="text-center">Login</h1>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
            ></v-text-field>
            <v-btn color="primary" block type="submit">Login</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });

        this.$router.push("/");
        this.$root.checkUserStatus();
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  },
};
</script>
