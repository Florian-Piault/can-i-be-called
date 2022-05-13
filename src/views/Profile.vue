<template>
  <ion-page>
    <Toolbar title="Profil" />
    <ion-content :fullscreen="true">
      <!-- USER -->
      <IonCard v-if="user">
        <IonCardHeader class="profile-header">
          <!-- <img class="bg" :src="user.profilePic" alt="profile picture" /> -->
          <IonCardTitle>
            <h1>{{ user.displayName }}</h1>
          </IonCardTitle>
        </IonCardHeader>
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
      <!-- if shop only -->
      <IonCard v-if="!isAnonymous" class="full">
        <template v-if="user && !isLoading">
          <IonItem>
            <IonLabel> Je suis un commercial</IonLabel>
            <IonToggle :checked="user.isShop" @ionChange="toggleIsShop" />
          </IonItem>
          <Schedule
            v-if="user.isShop"
            :schedule="schedules"
            title="Ajouter une indisponibilité"
            :currentUserId="user.uid"
            :shopId="user.uid"
            :notModal="true"
            @addschedules="addSchedules"
          ></Schedule>
        </template>
        <IonSpinner v-else name="crescent" />
      </IonCard>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonItem,
  IonToggle,
  IonLabel,
} from "@ionic/vue";
import store from "@/store";
import { ref, Ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { Schedule as MSchedule } from "@/models";
import Schedule from "@/components/Schedule.vue";
import Toolbar from "@/components/Toolbar.vue";

export default {
  name: "Profile",
  components: {
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonSpinner,
    IonLabel,
    IonItem,
    IonToggle,
    Schedule,
    Toolbar,
  },
  setup() {
    const user = ref(null);
    const profilePics = ref([]);
    const isAnonymous = ref(false);
    const schedules: Ref<MSchedule[]> = ref([]);
    const isLoading = ref(true);

    const addSchedules = (userId: string) => {
      isLoading.value = true;
      schedules.value = [];
      onAuthStateChanged(getAuth(), async _user => {
        const userSchedules: MSchedule[] = await store.dispatch(
          "getUserSchedules",
          {
            db: store.state.database,
            userId: userId,
          }
        );
        schedules.value = userSchedules;
        isAnonymous.value = _user.isAnonymous;
        isLoading.value = false;
      });
    };

    const toggleIsShop = async () => {
      await store.dispatch("updateUserIsShop", {
        db: store.state.database,
        userId: user.value.uid,
        isShop: !user.value.isShop,
      });

      user.value = await store.dispatch("getUser", {
        db: store.state.database,
        id: user.value.uid,
      });
    };

    onMounted(() => {
      onAuthStateChanged(getAuth(), async _user => {
        user.value = await store.dispatch("getUser", {
          db: store.state.database,
          id: _user.uid,
        });
        if (!user.isAnonymous) {
          const userSchedules: MSchedule[] = await store.dispatch(
            "getUserSchedules",
            {
              db: store.state.database,
              userId: _user.uid,
            }
          );
          schedules.value = userSchedules;
          isAnonymous.value = _user.isAnonymous;
          isLoading.value = false;
        }
      });
    });

    return {
      user,
      profilePics,
      isAnonymous,
      schedules,
      isLoading,
      addSchedules,
      toggleIsShop,
    };
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

.full {
  height: 100%;
}
</style>
