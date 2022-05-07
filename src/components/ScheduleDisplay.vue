<template>
  <!-- RANGE -->
  <IonItem v-if="mode === 'Sur un interval'">
    Du {{ interval.start }} au {{ interval.end }}
  </IonItem>

  <!-- IonChip -->
  <!-- ONE_DAY -->
  <IonItem v-else>
    <IonIcon :icon="calendarOutline" />
    <b>{{ date }}</b> :
    <div>{{ hours[0] }} &rarr; {{ hours[1] }}</div>
  </IonItem>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, toRefs } from "vue";
import { IonCol, IonLabel, IonItem, IonIcon } from "@ionic/vue";
import { timeOutline, calendarOutline } from "ionicons/icons";
import { Schedule } from "@/models";
import { DatePicker } from "v-calendar";
export default defineComponent({
  name: "DisplayedSchedule",
  props: ["data", "step"],
  components: {
    // IonCol,
    // IonLabel,
    IonItem,
    // DatePicker,
    IonIcon,
  },
  setup(props) {
    const { data: schedule } = toRefs(props) as { data: Ref<Schedule> };
    const repeat = schedule.value.repeat;

    const mode = computed(() => {
      return schedule.value.mode === "ONE_DAY"
        ? "Sur un jour"
        : "Sur un interval";
    });
    const date = computed(() => {
      const d = schedule.value.date;
      if (!d) return;
      return schedule.value.date.toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    });
    const interval = computed(() => {
      const i = schedule.value.interval;
      if (!i) return null;
      return {
        start: i.start.toLocaleString([], {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
        end: i.end.toLocaleString([], {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      };
    });
    const hours = computed(() => {
      const h = schedule.value.hours;
      if (!h) return null;
      return h.map(_h =>
        _h.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    });

    return {
      mode,
      date,
      interval,
      hours,
      repeat,
      timeOutline,
      calendarOutline,
    };
  },
});
</script>

<style scoped></style>
