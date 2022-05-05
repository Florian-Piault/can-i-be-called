import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "../views/Tabs.vue";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  inMemoryPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import store from "@/store/index.js";
import { computed } from "vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/tabs/",
    component: Tabs,
    meta: { requiresAuth: true },
    children: [
      {
        name: "tabs",
        path: "",
        redirect: "/tabs/agenda",
      },
      {
        path: "profil",
        component: () => import("@/views/Profile.vue"),
      },
      {
        path: "agenda",
        component: () => import("@/views/Agenda.vue"),
      },
      {
        path: "params",
        component: () => import("@/views/Parameters.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  const auth = getAuth();
  onAuthStateChanged(auth, user => {
    if (auth.currentUser) {
      store.commit("setAuthentication", user);
    }

    const isLogged = computed(() => store.getters.isLogged);
    if (to.meta.requiresAuth && !isLogged.value) {
      return router.push({ name: "login" });
    }
  });
});
export default router;
