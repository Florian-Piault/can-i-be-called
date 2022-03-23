<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div class="calendar-wrapper">
      <div class="datepicker-wrapper">
        <DatePicker
          mode="dateTime"
          v-model="date"
          :model-config="modelConfig"
          is24hr
        />
        <ion-button v-if="step === 0" @click="addDate" expand="block">
          Add a start date
        </ion-button>
        <ion-button v-else @click="addDate" expand="block">
          Add an end date
        </ion-button>
      </div>
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
  <ion-button @click="close">Close</ion-button>
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
import { computed, ref, toRefs } from "@vue/reactivity";
import { useGlobalMethods } from "@/composition/useGlobalMethods";
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
  setup(props) {
    // --- props
    const { schedule: tmpSchedule } = toRefs(props);

    // --- data
    const step = ref(0);
    const date = ref(null);
    const tmpStart = ref(null);
    const tmpEnd = ref(null);
    const modelConfig = {
      type: "number",
      mask: "iso",
    };

    // --- methods
    const { setToast } = useGlobalMethods();

    const close = () => {
      if (!tmpStart.value || !tmpEnd.value) return modalController.dismiss();
      else modalController.dismiss(tmpSchedule.value);
    };

    const addDate = () => {
      // errors
      if (!date.value) return setToast("Select a date.");
      if (tmpSchedule.value.includes(date.value))
        return setToast("This date is already set.");

      // increment step and attribute values
      if (step.value === 0) tmpStart.value = date.value;
      else {
        if (tmpStart.value >= date.value)
          return setToast(
            "The chosen date has to be more recent that the first one",
            1500
          );
        tmpEnd.value = date.value;
      }
      step.value = (step.value + 1) % 2;
      if (tmpStart.value && tmpEnd.value) {
        tmpSchedule.value.push({ start: tmpStart.value, end: tmpEnd.value });
        tmpStart.value = null;
        tmpEnd.value = null;
      }
    };

    // --- computed
    const displayedSchedule = computed(() => {
      if (!tmpSchedule.value) return [];
      return Date.now();
    });

    return {
      step,
      date,
      tmpStart,
      tmpEnd,
      tmpSchedule,
      modelConfig,
      close,
      addDate,
      displayedSchedule,
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

.datepicker-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
