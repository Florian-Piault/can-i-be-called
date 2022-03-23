<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Screen_2</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- SLIDES -->

      <div class="card-category">Category One</div>
      <ion-slides scrollbar="false" pager="true" :options="slideOpts">
        <ion-slide v-for="shop in shops" :key="shop">
          <ion-card class="card" @click.prevent="handleModal(shop)">
            <img class="bg" :src="shop.path" />
            <ion-card-content class="card-content">
              <ion-card-title> {{ shop.name }} </ion-card-title>
              <p>{{ shop.description }}</p>
              <p v-if="shop.schedule">{{ shop.schedule }}</p>
            </ion-card-content>
          </ion-card>
        </ion-slide>
      </ion-slides>

      <div class="card-category">Category Two</div>
      <ion-slides scrollbar="false" pager="true" :options="slideOpts">
        <ion-slide v-for="shop in shops" :key="shop">
          <ion-card class="card" @click.prevent="handleModal(shop)">
            <img class="bg" :src="shop.path" />
            <ion-card-content class="card-content">
              <ion-card-title> {{ shop.name }} </ion-card-title>
              <p>{{ shop.description }}</p>
            </ion-card-content>
          </ion-card>
        </ion-slide>
      </ion-slides>
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
  modalController,
} from "@ionic/vue";
import { IonSlides, IonSlide } from "@ionic/vue";
import Schedule from "../components/Schedule.vue";

interface Shop {
  id: number;
  name: string;
  path: string;
  description: string;
  schedule: string[];
}

export default {
  name: "Screen_2",
  components: {
    IonSlide,
    IonSlides,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardTitle,
    IonCardContent,
  },
  data() {
    return {
      currentShop: null,
      modal: null,
      slideOpts: {
        initialSlide: 0,
        speed: 400,
        loop: true,
        effect: "flip",
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
      },
      shops: [
        {
          id: 0,
          name: "Shop 1",
          path: "./assets/01.jpg",
          schedule: [],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo",
        },
        {
          id: 1,
          name: "Shop 2",
          path: "./assets/02.jpg",
          schedule: [],
          description:
            "Non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Architecto beatae vitae dicta sunt explicabo. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat. Cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia.",
        },
        {
          id: 2,
          name: "Shop 3",
          path: "./assets/03.jpg",
          schedule: [],
          description:
            "Architecto beatae vitae dicta sunt explicabo. Qui officia deserunt",
        },
        {
          id: 3,
          name: "Shop 4",
          path: "./assets/04.jpg",
          schedule: [],
          description:
            "Non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.Architecto beatae vitae dicta sunt explicabo. Qui officia deserunt mollit anim id est laborum. Fugiat quo voluptas nulla pariatur? Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam. Esse cillum dolore eu fugiat nulla pariatur. Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat. Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque. Fugiat quo voluptas nulla pariatur? Nihil molestiae consequatur, vel illum qui dolorem eum. Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo. At vero eos et accusamus. Eaque ipsa quae ab illo inventore veritatis et quasi. Itaque earum rerum hic tenetur a sapiente delectus. Do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        },
      ],
    };
  },
  methods: {
    async handleModal(shop: Shop) {
      this.currentShop = shop;
      const modal = await modalController.create({
        component: Schedule,
        cssClass: "my-custom-class",
        swipeToClose: false,
        backdropDismiss: false,
        componentProps: {
          id: shop.id,
          title: shop.name,
          content: shop.description,
          schedule: shop.schedule,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data) this.currentShop.schedule.push(data.schedule).flat();
      this.currentShop = null;
    },
  },
};
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
