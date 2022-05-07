<template v-if="user">
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Agendas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="shops.length > 0">
      <!-- SLIDES -->

      <div class="card-category">Category One</div>
      <ion-slides scrollbar="false" pager="true" :options="slideOpts">
        <ion-slide v-for="shop in shops" :key="shop">
          <ion-card class="card" @click.prevent="handleModal(shop)">
            <img class="bg" :src="shop.img" />
            <ion-card-content class="card-content">
              <ion-card-title> {{ shop.displayName }} </ion-card-title>
              <p v-if="shop.schedules">
                a <b>{{ shop.schedules.length }}</b> indisponibilité{{
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
  IonHeader,
  IonToolbar,
  IonTitle,
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
import store from "@/store";
import { Schedule, Shop } from "@/models/index";

export default defineComponent({
  name: "Agenda",
  components: {
    IonSlide,
    IonSlides,
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardTitle,
    IonCardContent,
  },
  setup() {
    const currentShop: Ref<Shop> = ref(null);
    const modal = ref(null);
    const slideOpts = ref({
      initialSlide: 0,
      speed: 400,
      loop: true,
      effect: "flip",
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
    });
    const shops: Ref<Array<Shop>> = ref([]);
    const user = computed(() => store.state.user);
    const handleModal = async (shop: Shop) => {
      currentShop.value = shop;
      const modal = await modalController.create({
        component: defineAsyncComponent(
          () => import("../components/Schedule.vue")
        ),
        cssClass: "my-custom-class",
        swipeToClose: false,
        backdropDismiss: false,
        componentProps: {
          shopId: shop.uid as Ref<string>,
          title: shop.displayName as Ref<string>,
          schedule: shop.schedules as Ref<Schedule[]>,
          currentUserId: user.value.uid as string,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      // push in database
      if (data) {
        const newSchedules = await store.dispatch("addSchedule", {
          userId: currentShop.value.uid,
          db: store.state.database,
          schedules: data,
        });
        console.log(newSchedules);
        shops.value.find(s => s.uid === currentShop.value.uid).schedules =
          newSchedules.find(s => s.uid === currentShop.value.uid).schedules;
      }
      currentShop.value = null;
    };

    onMounted(async () => {
      const _shops = await store.dispatch("getSchedules", {
        db: store.state.database,
      });
      _shops.forEach((shop: Shop) => {
        shops.value.push({
          schedules: ref(shop.schedules),
          displayName: ref(shop.displayName),
          uid: ref(shop.uid),
          img: "./assets/0" + Math.ceil(Math.random() * (4 - 1) + 1) + ".jpg",
        });
      });
    });

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
</style>
