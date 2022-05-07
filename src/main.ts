import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { IonicVue } from "@ionic/vue";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import {
  setPersistence,
  browserLocalPersistence,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

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
if (Capacitor.isNativePlatform()) {
  initializeAuth(fbApp, {
    persistence: indexedDBLocalPersistence,
  });
} else getAuth(fbApp);

store.state.database = getFirestore(fbApp);

const app = createApp(App).use(IonicVue).use(store).use(router);

router.isReady().then(() => {
  app.mount("#app");
});
