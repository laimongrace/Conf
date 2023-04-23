import { createStore } from "vuex";
import axios from "axios";
import Cookies from 'js-cookie';

const store = createStore({
  state() {
    return {
      token: Cookies.get('token') || "",
    };
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post("https://localhost:3000/login", {
          email,
          password,
        });

        const token = response.data.token;
        commit("setToken", token);

        Cookies.set('token', token, { expires: 7 });

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error in login action:", error);
        throw error;
      }
    },
    async register(_, user) {
        try {
          await axios.post('https://localhost:3000/register', user);
        } catch (error) {
          console.error('Error registering:', error);
          throw error;
        }
      },
    logout({ commit }) {
      commit("setToken", "");
      Cookies.remove('token');
      delete axios.defaults.headers.common["Authorization"];
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
  },
});

export default store;
