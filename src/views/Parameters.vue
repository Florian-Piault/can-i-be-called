<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Parameters</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Item as a Button -->
      <ion-item button @click="logOut">
        <ion-label> Sign out </ion-label>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
// import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonContent,
} from "@ionic/vue";
import { useLogoutMethods } from "@/composition/useLogoutMethods";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "Parameters",
  components: {
    // ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonLabel,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { logOut } = useLogoutMethods(store, router);

    return { logOut };
  },
};
</script>
