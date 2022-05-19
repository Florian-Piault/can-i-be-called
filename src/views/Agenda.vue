<template v-if="user">
  <ion-page>
    <Toolbar title="Agenda" />

    <ion-content :fullscreen="true" v-if="shops.length > 0">
      <!-- SLIDES -->
      <ion-slides scrollbar="false" pager="true" :options="slideOpts">
        <ion-slide v-for="shop in shops" :key="shop">
          <ion-card class="card" @click.prevent="handleModal(shop)">
            <img class="bg" :src="shop.img" />
            <ion-card-content class="card-content">
              <ion-card-title> {{ shop.displayName }} </ion-card-title>
              <hr />
              <p v-if="shop.isAvailable" class="isAvailable">
                Actuellement disponible
              </p>
              <p v-else class="isNotAvailable">N'est pas disponible</p>
              <p>
                Il y a <b>{{ shop.schedules.length }}</b> indisponibilité{{
                  shop.schedules.length > 1 ? "s" : ""
                }}
              </p>
            </ion-card-content>
          </ion-card>
        </ion-slide>
      </ion-slides>
    </ion-content>

    <ion-content :fullscreen="true" v-else>
      <IonSpinner name="crescent" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  modalController,
} from "@ionic/vue";
import { IonSlides, IonSlide } from "@ionic/vue";
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  onMounted,
  Ref,
  ref,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";
import { Schedule, Shop } from "@/models/index";
import Toolbar from "@/components/Toolbar.vue";

export default defineComponent({
  name: "Agenda",
  components: {
    IonSlide,
    IonSlides,
    IonSpinner,
    IonContent,
    IonPage,
    IonCard,
    IonCardTitle,
    IonCardContent,
    Toolbar,
  },
  setup() {
    const currentShop: Ref<Shop> = ref(null);
    const modal = ref(null);
    const slideOpts = ref({
      initialSlide: 0,
      speed: 400,
      loop: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
    });
    const shops: Ref<Array<Shop>> = ref([]);
    const user = computed(() => store.state.user);

    const setIsAvailable = (schedules: Schedule[]) => {
      if (!schedules || schedules.length === 0) return true;
      const now = new Date();
      const isAvailable = schedules.some(schedule => {
        if (schedule.date) {
          const start = new Date(schedule.hours[0]);
          const end = new Date(schedule.hours[1]);
          return now >= start && now <= end;
        } else if (schedule.interval) {
          const start = new Date(schedule.interval.start);
          const end = new Date(schedule.interval.end);
          return now >= start && now <= end;
        }
      });
      return !isAvailable;
    };

    const initShops = async () => {
      shops.value = [];
      const _shops = await store.dispatch("getSchedules", {
        db: store.state.database,
      });
      const promiseShops = await Promise.all([..._shops]);
      for (const shop of promiseShops) {
        shops.value.push({
          schedules: computed(() => shop.schedules),
          displayName: ref(shop.displayName),
          uid: ref(shop.uid),
          img: "./assets/0" + Math.ceil(Math.random() * (4 - 1) + 1) + ".jpg",
          isAvailable: computed(() => setIsAvailable(shop.schedules)),
        });
      }
    };

    const handleModal = async (shop: Shop) => {
      currentShop.value = shop;
      const modal = await modalController.create({
        component: defineAsyncComponent(
          () => import("../components/Schedule.vue")
        ),
        cssClass: "my-custom-class",
        swipeToClose: true,
        backdropDismiss: true,
        componentProps: {
          shopId: shop.uid as Ref<string>,
          title: shop.displayName as Ref<string>,
          schedule: shop.schedules as Ref<Schedule[]>,
          currentUserId: user.value.uid as string,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data) {
        if (data.schedule) {
          const newSchedules = await store.dispatch("addSchedule", {
            userId: currentShop.value.uid,
            db: store.state.database,
            schedules: data.schedule,
          });
          shops.value.find(s => s.uid === currentShop.value.uid).schedules =
            newSchedules.find(s => s.uid === currentShop.value.uid).schedules;
        }
        currentShop.value = null;
        await initShops();
      }
    };

    const router = useRouter();
    const route = useRoute();
    router.afterEach(async () => {
      if (route.name === "agenda") await initShops();
    });

    onMounted(async () => await initShops());

    return {
      currentShop,
      modal,
      slideOpts,
      shops,
      user,
      handleModal,
    };
  },
});
</script>

<style scoped>
.card-category {
  text-align: center;
  margin: 8px 0;
  font-size: 1.2rem;
}
.card {
  width: 256px;
  height: 512px;
  margin-bottom: 40px;
}

.card:hover {
  opacity: 0.8;
  cursor: pointer;
}

.card-content {
  padding-bottom: 8px;
  height: 256px;
  overflow-y: scroll;
}

.bg {
  width: 256px;
  height: 256px;
}

.isAvailable {
  color: #00c853;
}
.isNotAvailable {
  color: #ff3d00;
}
</style>
