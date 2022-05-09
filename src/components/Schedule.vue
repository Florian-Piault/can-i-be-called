<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }} </ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding content-column">
    <div class="calendar-wrapper">
      <div v-if="shopId === currentUserId" class="datepicker-wrapper">
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
          <template v-if="step === 0">
            <DatePicker
              disabled
              mode="date"
              v-model="date"
              :model-config="modelConfig"
            />
          </template>
          <template v-if="step === 1">
            <DatePicker
              mode="time"
              v-model="hours.start"
              :model-config="modelConfig"
              is24hr
            />
          </template>
          <template v-if="step === 2">
            <DatePicker
              mode="time"
              v-model="hours.end"
              :model-config="modelConfig"
              is24hr
            />
          </template>
          <div class="btn-side-by-side">
            <ion-button
              @click="addDate($event, true)"
              expand="block"
              :disabled="step === 0"
            >
              <ion-icon :icon="arrowBackCircleOutline" />
              <ion-label>Retour</ion-label>
            </ion-button>
            <ion-button @click="addDate" expand="block">
              <ion-label>Suivant</ion-label>
              <ion-icon :icon="arrowForwardCircleOutline" />
            </ion-button>
          </div>
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

        <!-- RESULTS DISPLAY -->
        <ScheduleDisplaySteps
          :modeId="mode.id"
          :dDate="displayedDate"
          :dHours="displayedHours"
          :dInterval="displayedInterval"
          :stepNum="step"
        />
      </div>

      <div class="schedule-display" v-if="allSchedules.length > 0">
        <IonLabel>
          <h2>Indisponibilité{{ allSchedules.length > 1 ? "s" : "" }}:</h2>
        </IonLabel>
        <ScheduleDisplay
          v-for="(s, idx) in allSchedules"
          :key="'schedule-' + idx"
          :data="s"
        />
      </div>
    </div>
  </ion-content>

  <!-- steps actions -->
  <ion-buttons class="btn-side-by-side">
    <ion-button @click="close('cancel')" color="danger">
      <ion-icon :icon="closeCircleOutline" />
      <ion-label v-if="shopId === currentUserId">Annuler</ion-label>
      <ion-label v-else>Fermer</ion-label>
    </ion-button>
    <ion-button
      v-if="shopId === currentUserId"
      @click="close('save')"
      color="success"
    >
      <ion-icon :icon="checkmarkCircleOutline" />
      <ion-label>Valider</ion-label>
    </ion-button>
  </ion-buttons>
</template>

<script lang="ts">
// todo -> feedback schedule added (toast?)
// todo -> calendar : see directly schedules
// todo -> profile page
// todo -> login : mail+password

import {
  closeCircleOutline,
  addCircleOutline,
  checkmarkCircleOutline,
  arrowForwardCircleOutline,
  arrowBackCircleOutline,
} from "ionicons/icons";
import { Temporal } from "@js-temporal/polyfill";
import { DatePicker } from "v-calendar";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButtons,
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
import ScheduleDisplaySteps from "./ScheduleDisplaySteps.vue";
import ScheduleDisplay from "./ScheduleDisplay.vue";
import { Schedule, Mode } from "@/models/index";
export default defineComponent({
  name: "Schedule",
  props: ["schedule", "title", "currentUserId", "shopId", "notModal"],
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    DatePicker,
    ScheduleDisplaySteps,
    ScheduleDisplay,
  },
  setup(props) {
    // --- props
    const { schedule: actualSchedule } = toRefs(props) as {
      schedule: Ref<Schedule[]>;
    };

    // --- data
    const tmpSchedule: Ref<Schedule[]> = ref([]);
    const allSchedules: Ref<Schedule[]> = ref([]);
    allSchedules.value.push(...actualSchedule.value);
    const step: Ref<number> = ref(0);
    const modes: Ref<Mode[]> = ref([
      {
        id: "ONE_DAY",
        name: "Sur un jour",
      },
      {
        id: "RANGE",
        name: "Sur un intervalle",
      },
    ]);
    const mode: Ref<Mode> = ref({
      id: "ONE_DAY",
      name: "Sur un jour",
    });
    const repeats = [
      {
        id: "EVERY",
        name: "Chaque",
        children: [
          {
            id: "DAY",
            name: "jour",
          },
        ],
      },
    ];
    const repeat = null;
    const date: Ref<Date> = ref(new Date());
    const hours: Ref<{ start: Date; end: Date }> = ref({
      start: new Date(Date.now()),
      end: new Date(Date.now()),
    });
    const interval: Ref<{ start: Date; end: Date }> = ref({
      start: null,
      end: null,
    });
    const modelConfig = {
      type: "Date",
      mask: "iso",
    };
    const changes: Ref<number> = ref(0);

    // --- methods
    const { setToast } = useGlobalMethods();

    /**
     * Closes the modale
     *
     * If there are no changes, and the **save** mode is selected, nothing is done
     *
     * @param mode {string} "save" | "cancel"
     */
    const close = (mode: "save" | "cancel") => {
      try {
        if (mode === "save" && changes.value < 1)
          return setToast({ message: "Veuillez choisir un horaire" });
        if (mode === "cancel") modalController.dismiss();
        else modalController.dismiss(tmpSchedule.value);
      } catch (e) {
        console.error(e);
      } finally {
        //--- resets data
        interval.value = { start: null, end: null };
        step.value = 0;
        date.value = new Date();
        tmpSchedule.value = [];
      }
    };

    const addDate = (event: Event, prev: boolean) => {
      if (step.value === 0) {
        if (!date.value) return setToast({ message: "Sélectionnez une date." });
        return step.value++;
      }
      if (step.value === 1) {
        if (prev) return step.value--;
        return step.value++;
      }
      if (step.value === 2) {
        if (prev) return step.value--;
        // if start is more recent than end => swap both
        let tmpHours = [hours.value.start, hours.value.end];
        if (hours.value.start >= hours.value.end)
          tmpHours = [hours.value.end, hours.value.start];

        const _schedule = {
          mode: mode.value.id,
          date: date.value,
          hours: tmpHours,
          repeat: null,
        };
        tmpSchedule.value.push(_schedule);
        allSchedules.value.push(_schedule);
        step.value = 0;
        changes.value++;
      }
    };

    const addInterval = () => {
      // errors
      if (!interval.value.start || !interval.value.end)
        return setToast({ message: "Sélectionnez un intervalle." });
      const _interval = {
        mode: "INTERVAL",
        interval: interval.value,
        repeat: null,
      };
      tmpSchedule.value.push(_interval);
      allSchedules.value.push(_interval);
      changes.value++;
    };

    const modeChanged = () => {
      delete date.value;
      delete interval.value;
    };

    // --- computed
    const displayedDate = computed(() => {
      if (!date.value) return;
      return Temporal.PlainDate.from({
        year: date.value.getFullYear(),
        month: date.value.getMonth(),
        day: date.value.getDate(),
      });
    });

    const displayedHours = computed(() => {
      const HOUR_START: Temporal.PlainTime = Temporal.PlainTime.from({
        hour: hours.value.start.getHours(),
        minute: hours.value.start.getMinutes(),
      });

      const HOUR_END: Temporal.PlainTime = Temporal.PlainTime.from({
        hour: hours.value.end.getHours(),
        minute: hours.value.end.getMinutes(),
      });

      return {
        start: HOUR_START,
        end: HOUR_END,
      };
    });

    const displayedInterval = computed(() => {
      if (!interval.value.start && !interval.value.end)
        return { start: null, end: null };
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

    const displayedData = computed(() => {
      return {
        mode: mode,
        displayedDate: displayedDate,
        displayedHours: displayedHours,
        displayedInterval: displayedInterval,
      };
    });

    return {
      step,
      mode,
      modes,
      repeats,
      repeat,
      date,
      hours,
      interval,
      actualSchedule,
      tmpSchedule,
      allSchedules,
      modelConfig,
      close,
      addDate,
      addInterval,
      modeChanged,
      displayedHours,
      displayedDate,
      displayedInterval,
      displayedData,
      closeCircleOutline,
      addCircleOutline,
      checkmarkCircleOutline,
      arrowForwardCircleOutline,
      arrowBackCircleOutline,
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

.btn-side-by-side {
  display: flex;
  justify-content: space-around;
}

.schedule-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
