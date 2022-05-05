<template>
  <IonItem>
    <div v-if="mode === 'ONE_DAY' && dates">
      <div :class="step === 0 ? 'selected' : ''">
        {{ dates.toLocaleString() }}
      </div>
      <div>
        <span :class="step === 1 ? 'selected' : ''">
          {{ hours.start.toLocaleString() }} &rarr;
        </span>
        <span :class="step === 2 ? 'selected' : ''">
          {{ hours.end.toLocaleString() }}
        </span>
      </div>
    </div>
    <div v-else-if="mode === 'RANGE' && interval">
      <span>
        <time>{{
          interval.start ? interval.start.toLocaleString() : "..."
        }}</time></span
      ><br />
      <span>
        <time>{{
          interval.end ? interval.end.toLocaleString() : "..."
        }}</time></span
      >
    </div>
  </IonItem>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { IonItem } from "@ionic/vue";
export default defineComponent({
  name: "DisplayeScheduleSteps",
  props: ["stepNum", "modeId", "dDate", "dHours", "dInterval"],
  components: {
    IonItem,
  },
  setup(props) {
    const {
      stepNum: step,
      modeId: mode,
      dDate: dates,
      dHours: hours,
      dInterval: interval,
    } = toRefs(props);

    return {
      mode,
      dates,
      hours,
      interval,
      step,
    };
  },
});
</script>

<style scoped>
.selected {
  font-weight: bold;
  font-size: 1.15em;
}
</style>
