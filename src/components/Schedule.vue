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
          <template v-if="step === 0">
            <DatePicker
              disabled
              mode="date"
              v-model="date"
              :model-config="modelConfig"
            />
            <!-- <ion-button @click="addDate" expand="block">
              <ion-icon :icon="addCircleOutline" />
              <ion-label>Choisir le jour</ion-label>
            </ion-button> -->
          </template>
          <template v-if="step === 1">
            <DatePicker
              mode="time"
              v-model="hours.start"
              :model-config="modelConfig"
              is24hr
            />
            <!-- <ion-button @click="addDate" expand="block">
              <ion-icon :icon="addCircleOutline" />
              <ion-label>Choisir l'heure de début</ion-label>
            </ion-button> -->
          </template>
          <template v-if="step === 2">
            <DatePicker
              mode="time"
              v-model="hours.end"
              :model-config="modelConfig"
              is24hr
            />
            <!-- <ion-button @click="addDate" expand="block">
              <ion-icon :icon="addCircleOutline" />
              <ion-label>Choisir l'heure de fin</ion-label>
            </ion-button> -->
          </template>
          <div class="btn-side-by-side">
            <ion-button
              @click="addDate(event, true)"
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
        <IonItem>
          <div v-if="mode.id === 'ONE_DAY' && displayedDate">
            <div :class="step === 0 ? 'selected' : ''">
              {{ displayedDate.toLocaleString() }}
            </div>
            <div>
              <span :class="step === 1 ? 'selected' : ''">
                {{ displayedHours.start.toLocaleString() }} &rarr;
              </span>
              <span :class="step === 2 ? 'selected' : ''">
                {{ displayedHours.end.toLocaleString() }}
              </span>
            </div>
          </div>
          <div v-else-if="mode.id === 'RANGE' && displayedInterval">
            <span>
              <time>{{
                displayedInterval.start
                  ? displayedInterval.start.toLocaleString()
                  : "..."
              }}</time></span
            ><br />
            <span>
              <time>{{
                displayedInterval.end
                  ? displayedInterval.end.toLocaleString()
                  : "..."
              }}</time></span
            >
          </div>
        </IonItem>
      </div>
    </div>
  </ion-content>

  <!-- steps actions -->
  <ion-buttons class="btn-side-by-side">
    <ion-button @click="close('cancel')" color="danger">
      <ion-icon :icon="closeCircleOutline" />
      <ion-label>Annuler</ion-label>
    </ion-button>
    <ion-button @click="close('save')" color="success">
      <ion-icon :icon="checkmarkCircleOutline" />
      <ion-label>Valider</ion-label>
    </ion-button>
  </ion-buttons>
</template>

<script lang="ts">
// todo -> feedback schedule added (toast?)
// todo -> calendar : see directly schedules
// todo -> db get/post
// todo -> profile page

// todo -> login : get/post
// todo -> login : mail+password
// todo -> login : other providers
interface Schedule {
  mode: string;
  date?: Date;
  interval?: object;
  hours?: Date[];
  repeat: string;
}

interface Mode {
  id: string;
  name: string;
}

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
export default defineComponent({
  name: "Schedule",
  props: ["id", "title", "content", "schedule"],
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
  },
  setup(props) {
    // --- props
    const { schedule: actualSchedule } = toRefs(props);

    // --- data
    const tmpSchedule: Ref<Schedule[]> = ref([]);
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

    // --- methods
    const { setToast } = useGlobalMethods();

    const close = (mode: "save" | "cancel") => {
      try {
        if (mode === "save" && !tmpSchedule.value)
          return setToast("Veuillez choisir un horaire");
        if (mode === "cancel") modalController.dismiss();
        else modalController.dismiss(tmpSchedule.value);
      } catch (e) {
        console.error(e);
      } finally {
        //--- reset data
        interval.value = { start: null, end: null };
        step.value = 0;
        date.value = new Date();
        tmpSchedule.value = null;
      }
    };

    const addDate = (event, prev: boolean) => {
      if (step.value === 0) {
        if (!date.value) return setToast("Sélectionnez une date.");
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

        tmpSchedule.value.push({
          mode: mode.value.id,
          date: date.value,
          hours: tmpHours,
          repeat: null,
        });
        step.value = 0;
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
      if (!interval.value.start && !interval.value.end) return;
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
      repeats,
      repeat,
      date,
      hours,
      interval,
      actualSchedule,
      tmpSchedule,
      modelConfig,
      close,
      addDate,
      addInterval,
      modeChanged,
      displayedHours,
      displayedDate,
      displayedInterval,
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

.selected {
  font-weight: bold;
  font-size: 1.15em;
}

.btn-side-by-side {
  display: flex;
  justify-content: space-around;
}
</style>
