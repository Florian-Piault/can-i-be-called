<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Profil</ion-title>
        </ion-toolbar>
      </ion-header>

      <IonCard v-if="user">
        <IonCardHeader class="profile-header">
          <img class="bg" :src="user.profilePic" alt="profile picture" />
          <IonCardTitle>
            <h1>{{ user.displayName }}</h1>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          images:
          <img v-for="(pic, idx) in profilePics" :key="idx" :src="pic" />
        </IonCardContent>
      </IonCard>

      <IonCard v-else-if="isAnonymous">
        <IonCardTitle>
          <h1>Invité</h1>
        </IonCardTitle>
        <IonCardContent>
          images:
          <img v-for="(pic, idx) in profilePics" :key="idx" :src="pic" />
        </IonCardContent>
      </IonCard>

      <IonCard v-else>
        <IonCardContent>
          <IonSpinner name="crescent" />
        </IonCardContent>
      </IonCard>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
} from "@ionic/vue";
import store from "@/store";
import { computed, ref } from "@vue/reactivity";
import { onBeforeMount, onUnmounted } from "@vue/runtime-core";
import { getAuth } from "@firebase/auth";

export default {
  name: "Profile",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonSpinner,
  },
  setup() {
    const user = ref(null);
    const profilePics = ref([]);
    const isAnonymous = ref(false);

    onBeforeMount(async () => {
      const pics = await store.dispatch("getProfilePictures");
      const auth = getAuth();
      isAnonymous.value = auth.currentUser.isAnonymous;

      const _user = await store.dispatch("getUser", {
        db: store.state.database,
        id: computed(() => store.state.user).value.uid,
      });
      user.value = _user;
      profilePics.value = pics;
    });

    onUnmounted(() => {
      user.value = null;
      isAnonymous.value = false;
      profilePics.value = [];
    });

    return { user, profilePics, isAnonymous };
  },
};
</script>

<style scoped>
.profile-header {
  display: flex;
}

.profile-picture {
  position: relative;
}

.profile-picture > IonInput {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.schedule-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
