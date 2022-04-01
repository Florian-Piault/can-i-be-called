<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding content-column">
    <div class="calendar-wrapper">
      <div class="datepicker-wrapper">
        <!--  MODE SELECTION -->
        <IonItem>
          <IonSelect
            interface="popover"
            v-model="mode.id"
            @ionChange="modeChanged"
          >
            <IonSelectOption v-for="m in modes" :key="m.id" :value="m.id">{{
              m.name
            }}</IonSelectOption>
          </IonSelect>
        </IonItem>
        <!-- MODE ONE DAY : DATETIME -->
        <template v-if="mode.id === 'ONE_DAY'">
          <DatePicker
            mode="dateTime"
            v-model="date"
            :model-config="modelConfig"
            is24hr
          />
          <ion-button v-if="step === 0" @click="addDate" expand="block">
            <ion-icon :icon="addCircleOutline" />
            <ion-label>Ajouter une date de début</ion-label>
          </ion-button>
          <ion-button v-else @click="addDate" expand="block">
            <ion-icon :icon="addCircleOutline" />
            <ion-label>Ajouter une date de fin</ion-label>
          </ion-button>
        </template>
        <!-- MODE RANGE : 2 DATES -->
        <template v-else-if="mode.id === 'RANGE'">
          <DatePicker
            mode="range"
            v-model="interval"
            :model-config="modelConfig"
            isRange
          />
          <ion-button @click="addInterval" expand="block">
            <ion-icon :icon="addCircleOutline" />
            <ion-label>Ajouter l'intervalle de date</ion-label>
          </ion-button>
        </template>
        <div v-if="mode.id === 'ONE_DAY' && displayedDate">
          {{ displayedDate.toLocaleString() }}
        </div>
        <div v-if="mode.id === 'RANGE' && displayedInterval">
          <span
            >Du
            <time>{{
              displayedInterval.start
                ? displayedInterval.start.toLocaleString()
                : "..."
            }}</time></span
          ><br />
          <span
            >au
            <time>{{
              displayedInterval.end
                ? displayedInterval.end.toLocaleString()
                : "..."
            }}</time></span
          >
        </div>
      </div>
    </div>
  </ion-content>
  <ion-button @click="close">
    <ion-icon :icon="closeCircleOutline" />
    <ion-label>Fermer</ion-label>
  </ion-button>
</template>

<script lang="ts">
import { closeCircleOutline, addCircleOutline } from "ionicons/icons";
import { Temporal } from "@js-temporal/polyfill";
import { DatePicker } from "v-calendar";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonIcon,
  IonLabel,
  IonSelect,
  IonSelectOption,
  modalController,
} from "@ionic/vue";
import { computed, ref, toRefs } from "@vue/reactivity";
import { useGlobalMethods } from "@/composition/useGlobalMethods";
import { defineComponent, Ref } from "vue";
export default defineComponent({
  name: "Schedule",
  props: ["id", "title", "content", "schedule"],
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    DatePicker,
  },
  setup(props) {
    // --- props
    const { schedule: tmpSchedule } = toRefs(props);

    // --- data
    const step: Ref<number> = ref(0);
    const modes: Ref<Array<{ id: string; name: string }>> = ref([
      {
        id: "ONE_DAY",
        name: "Sur un jour",
      },
      {
        id: "RANGE",
        name: "Sur un intervalle",
      },
    ]);
    const mode: Ref<{ id: string; name: string }> = ref({
      id: "ONE_DAY",
      name: "Sur un jour",
    });
    const date: Ref<Date> = ref(new Date());
    const interval: Ref<{ start: Date; end: Date }> = ref({
      start: null,
      end: null,
    });
    const tmpStart = ref(null);
    const tmpEnd = ref(null);
    const modelConfig = {
      type: "Date",
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
      if (!date.value) return setToast("Sélectionnez une date.");
      if (tmpSchedule.value.includes(date.value))
        return setToast("La date choisie est déjà prise.");

      // increment step and attribute values
      if (step.value === 0) tmpStart.value = date.value;
      else {
        if (tmpStart.value >= date.value)
          return setToast(
            "La date choisie doit être plus récente que la prmière",
            1500
          );
        tmpEnd.value = date.value;
      }
      step.value = (step.value + 1) % 2;
      if (tmpStart.value && tmpEnd.value) {
        tmpSchedule.value.push({
          mode: "ONE_DAY",
          start: tmpStart.value,
          end: tmpEnd.value,
        });
        tmpStart.value = null;
        tmpEnd.value = null;
      }
    };

    const addInterval = () => {
      // errors
      if (!interval.value.start || !interval.value.end)
        return setToast("Sélectionnez un intervalle.");

      tmpSchedule.value.push({
        mode: "INTERVAL",
        interval: interval.value,
        repeat: null,
      });
    };

    const modeChanged = () => {
      delete date.value;
      delete interval.value;
    };

    // --- computed

    const displayedDate = computed(() => {
      if (mode.value.id !== "ONE_DAY" || !date.value) return;
      return Temporal.PlainDateTime.from({
        year: date.value.getFullYear(),
        month: date.value.getUTCMonth(),
        day: date.value.getUTCDate(),
        hour: date.value.getHours(),
        minute: date.value.getMinutes(),
      });
    });

    const displayedInterval = computed(() => {
      if (
        mode.value.id !== "RANGE" ||
        (!interval.value.start && !interval.value.end)
      )
        return;
      const intervalStart = Temporal.PlainDate.from({
        year: interval.value.start.getFullYear(),
        month: interval.value.start.getUTCMonth(),
        day: interval.value.start.getUTCDate(),
      });

      let intervalEnd = null;
      if (interval.value) {
        intervalEnd = Temporal.PlainDate.from({
          year: interval.value.end.getFullYear(),
          month: interval.value.end.getUTCMonth(),
          day: interval.value.end.getUTCDate(),
        });
      }

      return {
        start: intervalStart,
        end: intervalEnd ? intervalEnd : null,
      };
    });

    return {
      step,
      mode,
      modes,
      date,
      interval,
      tmpStart,
      tmpEnd,
      tmpSchedule,
      modelConfig,
      close,
      addDate,
      addInterval,
      modeChanged,
      displayedDate,
      displayedInterval,
      closeCircleOutline,
      addCircleOutline,
    };
  },
});
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
  align-items: center;
}
</style>
