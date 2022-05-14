<template>
  <IonItem>
    <div v-if="mode === 'ONE_DAY' && dates">
      <div :class="step === 0 ? 'selected' : ''">
        {{ displayedDate }}
      </div>
      <div class="centered">
        <span :class="step === 1 ? 'selected' : ''">
          {{ hours.start }} &rarr;
        </span>
        <span :class="step === 2 ? 'selected' : ''">
          {{ hours.end }}
        </span>
      </div>
    </div>
    <div v-else-if="mode === 'RANGE' && interval">
      <span>
        <time>{{ displayedInterval.start }}</time>
        &rarr;
        <time>{{ displayedInterval.end }}</time>
      </span>
    </div>
  </IonItem>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
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

    // FORMAT
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const displayedDate = computed(() => {
      return dates.value.toLocaleString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    const displayedInterval = computed(() => {
      return {
        start: interval.value.start
          ? interval.value.start.toLocaleString([], options)
          : "...",
        end: interval.value.end
          ? interval.value.end.toLocaleString([], options)
          : "...",
      };
    });

    return {
      mode,
      dates,
      displayedDate,
      hours,
      interval,
      displayedInterval,
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
.centered {
  text-align: center;
}
</style>
