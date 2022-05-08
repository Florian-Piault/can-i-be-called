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

      <!-- USER -->
      <IonCard v-if="user">
        <IonCardHeader class="profile-header">
          <img class="bg" :src="user.profilePic" alt="profile picture" />
          <IonCardTitle>
            <h1>{{ user.displayName }}</h1>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <template v-if="schedules.length < 1">
            Vous n'avez pas d'indisponibilités de renseignées</template
          >
          <div v-else class="schedule-display">
            <IonLabel>
              <h2>Indisponibilité{{ schedules.length > 1 ? "s" : "" }}:</h2>
            </IonLabel>
            <ScheduleDisplay
              v-for="(s, idx) in schedules"
              :key="'schedule-' + idx"
              :data="s"
            />
          </div>
        </IonCardContent>
      </IonCard>

      <!-- ANONYMOUS -->
      <IonCard v-else-if="isAnonymous">
        <IonCardTitle>
          <h1>Invité</h1>
        </IonCardTitle>
        <IonCardContent> </IonCardContent>
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
  IonLabel,
} from "@ionic/vue";
import store from "@/store";
import { computed, ref, Ref } from "@vue/reactivity";
import {
  onBeforeMount,
  watch,
  onMounted,
  watchEffect,
} from "@vue/runtime-core";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { Schedule } from "@/models";
import ScheduleDisplay from "@/components/ScheduleDisplay.vue";
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
    ScheduleDisplay,
    IonLabel,
  },
  setup() {
    const user = ref(null);
    const profilePics = ref([]);
    const isAnonymous = ref(false);
    const schedules: Ref<Schedule[]> = ref([]);

    onMounted(() => {
      onAuthStateChanged(getAuth(), async _user => {
        isAnonymous.value = store.state.user.isAnonymous;
        const userSchedules = await store.dispatch("getUserSchedules", {
          db: store.state.database,
          userId: _user.uid,
        });
        schedules.value = userSchedules;
        user.value = _user;
      });
    });

    return { user, profilePics, isAnonymous, schedules };
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
