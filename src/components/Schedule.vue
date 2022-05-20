<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }} </ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding content-column">
    <div class="datepicker-wrapper">
      <!--  MODE SELECTION -->
      <IonItem v-if="canEdit">
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
      <h2 v-else>Indisponibilités</h2>
      <!-- MODE ONE DAY : DATETIME -->
      <template v-if="mode.id === 'ONE_DAY'">
        <template v-if="step === 0">
          <DatePicker
            mode="date"
            v-model="date"
            is-expanded
            :model-config="modelConfig"
            :is-dark="isDarkTheme"
            :attributes="unavailability"
          >
            <template
              #day-popover="{ day, masks, format, attributes, customData }"
            >
              {{ customData }}
              <span class="popover">
                <IonButton
                  v-if="canEdit"
                  @click="deleteDate(attributes)"
                  size="small"
                  color="danger"
                  fill="solid"
                >
                  <IonIcon :icon="trashOutline"></IonIcon>
                </IonButton>
                {{ format(day.date, masks.dayPopover) }} <br />
              </span>
              <p class="popover-hours" v-if="attributes[0].customData">
                <IonIcon :icon="timeOutline"></IonIcon>
                {{ attributes[0].customData[0] }} &rarr;
                {{ attributes[0].customData[1] }}
              </p>
            </template>
          </DatePicker>
        </template>
        <template v-if="step === 1">
          <DatePicker
            mode="time"
            v-model="hours.start"
            is-expanded
            is24hr
            :model-config="modelConfig"
            :is-dark="isDarkTheme"
            :attributes="unavailability"
          />
        </template>
        <template v-if="step === 2">
          <DatePicker
            mode="time"
            v-model="hours.end"
            is-expanded
            :model-config="modelConfig"
            is24hr
            :is-dark="isDarkTheme"
            :attributes="unavailability"
          />
        </template>
        <div class="btn-side-by-side" v-if="canEdit">
          <ion-button
            @click="addDate($event, true)"
            expand="block"
            color="primary"
            fill="solid"
            :disabled="step === 0"
          >
            <ion-icon :icon="arrowBackCircleOutline" />
            <ion-label>Retour</ion-label>
          </ion-button>
          <ion-button
            @click="addDate"
            color="primary"
            expand="block"
            fill="solid"
          >
            <ion-label>Suivant</ion-label>
            <ion-icon :icon="arrowForwardCircleOutline" />
          </ion-button>
        </div>
      </template>
      <!-- MODE RANGE : 2 DATES -->
      <template v-else-if="mode.id === 'RANGE'">
        <DatePicker
          mode="range"
          isRange
          is-expanded
          v-model="interval"
          :model-config="modelConfig"
          :is-dark="isDarkTheme"
          :attributes="unavailability"
        >
          <template #day-popover="{ day, format, masks, attributes }">
            <span class="popover">
              <IonButton
                v-if="canEdit"
                @click="deleteDate(attributes)"
                size="small"
                color="danger"
                fill="solid"
              >
                <IonIcon :icon="trashOutline"></IonIcon>
              </IonButton>
              {{ format(day.date, masks.dayPopover) }} <br />
            </span>
            <p class="popover-hours" v-if="attributes[0].customData">
              <IonIcon :icon="timeOutline"></IonIcon>
              {{ attributes[0].customData[0] }} &rarr;
              {{ attributes[0].customData[1] }}
            </p>
          </template>
        </DatePicker>
        <ion-button @click="addInterval" expand="block">
          <ion-icon :icon="addCircleOutline" />
          <ion-label>Ajouter l'intervalle de date</ion-label>
        </ion-button>
      </template>

      <!-- RESULTS DISPLAY -->
      <ScheduleDisplaySteps
        v-if="
          (canEdit && date && mode.id === 'ONE_DAY') ||
          (interval.start && mode.id === 'RANGE')
        "
        :modeId="mode.id"
        :dDate="displayedDate"
        :dHours="displayedHours"
        :dInterval="displayedInterval"
        :stepNum="step"
      />
    </div>
    <!-- IN PROFILE -->
    <ion-buttons class="btn-side-by-side" v-if="notModal">
      <ion-button
        v-if="shopId === currentUserId"
        @click="close('save')"
        color="success"
        :disabled="changes < 1"
      >
        <ion-icon :icon="checkmarkCircleOutline" />
        <ion-label>Valider</ion-label>
      </ion-button>
    </ion-buttons>
  </ion-content>
  <!-- IN MODAL -->
  <ion-buttons class="btn-side-by-side" v-if="!notModal">
    <ion-button @click="close('cancel')" color="danger">
      <ion-icon :icon="closeCircleOutline" />
      <ion-label v-if="canEdit">Annuler</ion-label>
      <ion-label v-else>Fermer</ion-label>
    </ion-button>
    <ion-button
      v-if="canEdit"
      @click="close('save')"
      color="success"
      :disabled="changes < 1"
    >
      <ion-icon :icon="checkmarkCircleOutline" />
      <ion-label>Valider</ion-label>
    </ion-button>
  </ion-buttons>
</template>

<script lang="ts">
import {
  closeCircleOutline,
  addCircleOutline,
  checkmarkCircleOutline,
  arrowForwardCircleOutline,
  arrowBackCircleOutline,
  trashOutline,
  timeOutline,
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
import store from "@/store";
import { useGlobalMethods } from "@/composition/useGlobalMethods";
import { defineComponent, Ref } from "vue";
import ScheduleDisplaySteps from "./ScheduleDisplaySteps.vue";
import { Schedule, Mode } from "@/models/index";
import { useCalendarMethods } from "@/composition/useCalendarMethods";
export default defineComponent({
  name: "Schedule",
  props: ["schedule", "title", "currentUserId", "shopId", "notModal"],
  emits: ["addschedules", "deleteschedule"],
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
  },
  setup(props, { emit }) {
    // --- props
    const { schedule: actualSchedule, notModal: notOverlay } = toRefs(
      props
    ) as {
      schedule: Ref<Schedule[]>;
      notModal: Ref<boolean>;
    };

    // --- data
    const canEdit = computed(
      () => props.currentUserId === props.shopId && notOverlay.value
    );
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
    const date: Ref<Date> = ref(null);
    const hours: Ref<{ start: Date; end: Date }> = ref({
      start: computed(() => (date.value ? date.value : new Date())),
      end: computed(() => (date.value ? date.value : new Date())),
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
    const close = async (mode: "save" | "cancel") => {
      try {
        if (mode === "save" && changes.value < 1)
          return setToast({ message: "Veuillez choisir un horaire" });
        if (mode === "cancel") return modalController.dismiss();
        // Saving
        if (notOverlay.value) {
          await store.dispatch("addSchedule", {
            userId: props.currentUserId,
            db: store.state.database,
            schedules: tmpSchedule.value,
          });
          return emit("addschedules", props.shopId);
        } else modalController.dismiss({ schedule: tmpSchedule.value });
      } catch (e) {
        console.error(e);
      } finally {
        //--- resets data
        interval.value = { start: null, end: null };
        step.value = 0;
        date.value = null;
        tmpSchedule.value = [];
      }
    };

    const deleteDate = async (attributes: object) => {
      const key: string = attributes[0]["key"];
      await store.dispatch("deleteSchedule", {
        db: store.state.database,
        userId: props.currentUserId,
        scheduleId: key,
      });
      if (notOverlay.value) emit("deleteschedule", props.shopId, key);
      else modalController.dismiss({ shopId: props.shopId, scheduleId: key });
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
        month: date.value.getUTCMonth() + 1,
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
        month: interval.value.start.getUTCMonth() + 1,
        day: interval.value.start.getUTCDate(),
      });

      let intervalEnd = null;
      if (interval.value) {
        intervalEnd = Temporal.PlainDate.from({
          year: interval.value.end.getFullYear(),
          month: interval.value.end.getUTCMonth() + 1,
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

    const { isDarkTheme, unavailability } = useCalendarMethods(allSchedules);

    return {
      canEdit,
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
      unavailability,
      modelConfig,
      isDarkTheme,
      changes,
      close,
      deleteDate,
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
      trashOutline,
      timeOutline,
    };
  },
});
</script>

<style scoped>
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

.popover {
  display: flex;
  align-items: center;
  gap: 4px;
}

.popover-text {
  text-align: center;
}
</style>
