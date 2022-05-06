<template>
  <IonItem>
    <IonCol>
      <IonLabel>
        <h2>Mode</h2>
        <p>{{ mode }}</p>
      </IonLabel>
      <IonLabel>
        <h2>Date</h2>
        <p>{{ date }}</p>
      </IonLabel>
      <IonLabel>
        <h2>Interval</h2>
        <p>{{ interval }}</p>
      </IonLabel>
      <IonLabel>
        <h2>Hours</h2>
        <p>{{ hours }}</p>
      </IonLabel>
      <IonLabel>
        <h2>Repeat</h2>
        <p>{{ repeat }}</p>
      </IonLabel>
    </IonCol>
  </IonItem>
</template>

<script lang="ts">
interface Schedule {
  mode: string;
  date?: Date;
  interval?: { start: Date; end: Date };
  hours?: Date[];
  repeat: string;
}
import { computed, defineComponent, Ref, toRefs } from "vue";
import { IonCol, IonLabel, IonItemDivider, IonItem } from "@ionic/vue";
export default defineComponent({
  name: "DisplayeSchedule",
  props: ["data", "step"],
  components: {
    IonCol,
    IonLabel,

    IonItem,
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
    };
  },
});
</script>

<style scoped></style>
