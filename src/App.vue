<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, toastController } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  methods: {
    async setNotif() {
      const toast = await toastController.create({
        message: "Your settings have been saved.",
        duration: 2000,
      });
      return toast.present();
    },
  },
});
</script>
