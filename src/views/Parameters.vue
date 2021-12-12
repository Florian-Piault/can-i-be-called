<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Parameters</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Item as a Button -->
      <template v-for="param in params" :key="param.label">
        <ion-item button @click="buttonClick()">
          <ion-label> {{ param.label }} </ion-label>
        </ion-item>
      </template>
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
  IonContent,
} from "@ionic/vue";
// import ExploreContainer from "@/components/ExploreContainer.vue";

export default {
  name: "Parameters",
  components: {
    // ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
  },
  data() {
    return {
      params: [
        { label: "param1", fct: "paramFct" },
        { label: "param1", fct: "paramFct" },
        { label: "param3", fct: "paramFct" },
      ],
    };
  },
  methods: {
    buttonClick() {
      this.params.push({ label: "param", fct: "paramFct" });
    },
  },
};
</script>
