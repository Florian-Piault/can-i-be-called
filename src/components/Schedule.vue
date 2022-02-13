<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div class="calendar-wrapper">
      <DatePicker
        mode="dateTime"
        v-model="date"
        :model-config="modelConfig"
        is24hr
      />
      <ion-button @click="addDate"> + </ion-button>
      <div v-if="displayedSchedule.length > 0">
        <p>Schedule:</p>
        <ul>
          <li v-for="(dispSch, idx) in displayedSchedule" :key="idx">
            {{ dispSch }}
          </li>
        </ul>
      </div>
    </div>
  </ion-content>
  <ion-button @click="close()">Close</ion-button>
</template>

<script>
import { DatePicker } from "v-calendar";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  modalController,
} from "@ionic/vue";
export default {
  name: "Schedule",
  props: ["id", "title", "content", "schedule"],
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    DatePicker,
  },
  emits: ["addDate"],
  methods: {
    addDate() {
      if (!this.date) return this.$root.setNotif("Select a date.");
      if (this.tmpSchedule.includes(this.date))
        this.$root.setNotif("This date is already set.");
      this.tmpSchedule.push(this.date);
    },
    close() {
      modalController.dismiss({
        id: this.id,
        schedule: this.tmpSchedule,
      });
    },
  },
  data() {
    return {
      date: "",
      tmpSchedule: this.schedule,
      modelConfig: {
        type: "number",
        mask: "iso",
      },
    };
  },
  computed: {
    displayedSchedule() {
      if (!this.tmpSchedule) return [];
      return this.tmpSchedule.map(timestamp => {
        const now = new Date(timestamp);
        // return `${now.getDate()}/${now.getMonth()}/${now.getDay()} ${now.getHours()} ${now.getMinutes()}`;
        return now.toLocaleString();
      });
    },
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
