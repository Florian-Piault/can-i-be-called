<template>
  <ion-page>
    <Toolbar title="Paramètres" />
    <ion-content>
      <ion-item button @click="logOut" lines="full" color="danger">
        <ion-label> Se déconnecter </ion-label>
        <ion-icon :icon="decoIcon"></ion-icon>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { closeCircle } from "ionicons/icons";
import { IonPage, IonLabel, IonContent, IonItem, IonIcon } from "@ionic/vue";
import { useLogoutMethods } from "@/composition/useLogoutMethods";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import Toolbar from "@/components/Toolbar.vue";

export default defineComponent({
  name: "Parameters",
  components: {
    IonContent,
    IonPage,
    IonLabel,
    IonIcon,
    IonItem,
    Toolbar,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const decoIcon = closeCircle;
    const { logOut } = useLogoutMethods(store, router);

    return { logOut, decoIcon };
  },
});
</script>
