import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "../views/Tabs.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
        name: "profil",
        path: "profil",
        component: () => import("@/views/Profile.vue"),
      },
      {
        name: "agenda",
        path: "agenda",
        component: () => import("@/views/Agenda.vue"),
      },
      {
        name: "params",
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
  try {
    onAuthStateChanged(auth, user => {
      if (auth.currentUser) {
        store.commit("setAuthentication", user);
      }
      const isLogged = computed(() => store.getters.isLogged);
      if (to.meta.requiresAuth && !isLogged.value) {
        return router.push({ name: "login" });
      }
    });
  } catch (error) {
    console.error(error);
  }
});
export default router;
