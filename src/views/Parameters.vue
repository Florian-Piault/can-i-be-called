<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item button @click="logOut" lines="full" color="danger">
        <ion-label> Se déconnecter </ion-label>
        <ion-icon :icon="decoIcon"></ion-icon>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
import { closeCircle } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonContent,
  IonItem,
  IonIcon,
} from "@ionic/vue";
import { useLogoutMethods } from "@/composition/useLogoutMethods";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "Parameters",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonLabel,
    IonIcon,
    IonItem,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const decoIcon = closeCircle;
    const { logOut } = useLogoutMethods(store, router);

    return { logOut, decoIcon };
  },
};
</script>
