import { createStore } from "vuex";
import { collection, getDocs } from "firebase/firestore/lite";

const store = createStore({
  state: () => ({
    database: null,
    isLogged: false,
  }),
  mutations: {
    setAuthentication(state, log) {
      state.isLogged = log;
    },
  },
  actions: {
    async getUsers({ commit }, { db }) {
      console.log(db);
      const usersCol = collection(db, "users");
      const usersDoc = await getDocs(usersCol);
      const data = usersDoc.docs.map(d => d.data());
      return data;
    },
  },
});

export default store;
