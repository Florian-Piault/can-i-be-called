<template>
  <IonItem>
    {{ mode }} - {{ date }} - {{ interval }} - {{ hours }} - {{ repeat }}
  </IonItem>
</template>

<script lang="ts">
interface Schedule {
  mode: string;
  date?: Date;
  interval?: object;
  hours?: Date[];
  repeat: string;
}
import { defineComponent, Ref, toRefs } from "vue";
import { IonItem } from "@ionic/vue";
export default defineComponent({
  name: "DisplayeSchedule",
  props: ["data", "step"],
  components: {
    IonItem,
  },
  setup(props) {
    const { data: schedule } = toRefs(props) as { data: Ref<Schedule> };
    const { mode, date, interval, hours, repeat } = schedule.value;

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
