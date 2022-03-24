<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

import { useStore } from "vuex";
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    const firebaseConfig = {
      apiKey: "AIzaSyD5_UgA0JEDayMCgCCbMfOM3ngHUkDAL1c",
      authDomain: "can-i-be-called.firebaseapp.com",
      databaseURL:
        "https://can-i-be-called-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "can-i-be-called",
      storageBucket: "can-i-be-called.appspot.com",
      messagingSenderId: "784590767148",
      appId: "1:784590767148:web:063021c9ee27736a077d89",
      measurementId: "G-X1Y1F6RX0H",
    };

    const fbApp = initializeApp(firebaseConfig);
    const db = getFirestore(fbApp);

    const store = useStore();

    // store.dispatch("getUsers", { db }).then(d => console.log(d));

    return { firebaseConfig, fbApp, db, store };
  },
});
</script>
