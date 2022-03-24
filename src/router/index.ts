import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "../views/Tabs.vue";
import {
  getAuth,
  setPersistence,
  signInWithRedirect,
  inMemoryPersistence,
  GoogleAuthProvider,
} from "firebase/auth";

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
        redirect: "/tabs/tab2",
      },
      {
        path: "tab1",
        component: () => import("@/views/Inventory.vue"),
      },
      {
        path: "tab2",
        component: () => import("@/views/Screen_2.vue"),
      },
      {
        path: "tab3",
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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !getAuth().currentUser)
    return router.push({ name: "login" });
  next();
});

export default router;
