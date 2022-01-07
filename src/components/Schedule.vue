<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <!-- <Calendar /> -->
    <div class="calendar-wrapper">
      <DatePicker
        mode="dateTime"
        v-model="date"
        :model-config="modelConfig"
        is24hr
      />
      <ion-button @click="addDate()"> + </ion-button>
    </div>
  </ion-content>
  <ion-button @click="close()">Close</ion-button>
</template>

<script>
import { Calendar, DatePicker } from "v-calendar";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
export default {
  name: "Schedule",
  props: ["title", "content"],
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    // Calendar,
    DatePicker,
  },
  methods: {
    addDate() {
      console.log(this.date);
    },
    close() {
      const mc = modalController;
      mc.dismiss();
    },
  },
  data() {
    return {
      date: new Date(),
      modelConfig: {
        type: "number",
        mask: "iso",
      },
    };
  },
};
</script>

<style scoped>
.calendar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
