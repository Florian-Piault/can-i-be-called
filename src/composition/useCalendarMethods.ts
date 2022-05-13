import { Schedule } from "@/models";
import { Ref, ref, onUnmounted, computed } from "vue";

export function useCalendarMethods(schedules = null) {
  //#region DarkTheme
  const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  const isDarkTheme: Ref<boolean> = ref(mediaQueryList.matches);
  mediaQueryList.addEventListener("change", () => {
    if (mediaQueryList.matches) isDarkTheme.value = true;
    else isDarkTheme.value = false;
  });
  onUnmounted(() => mediaQueryList.dispatchEvent);
  //#endregion

  //#region Preloaded Schedules
  const setOneDay = (schedule: Schedule) => {
    return {
      highlight: "red",
      dates: schedule.date,
      popover: {
        visibility: "hover",
      },
    };
  };
  const setRange = (schedule: Schedule) => {
    return {
      highlight: {
        start: { fillMode: "outline", color: "red" },
        base: { fillMode: "light", color: "red" },
        end: { fillMode: "outline", color: "red" },
      },
      dates: {
        start: schedule.interval.start,
        end: schedule.interval.end,
      },
      popover: {
        visibility: "hover",
      },
    };
  };

  const initDatePicker = () => {
    if (!schedules.value) return [];
    const initState = [];
    schedules.value.forEach((schedule: Schedule) => {
      if (schedule.mode === "ONE_DAY") initState.push(setOneDay(schedule));
      else if (schedule.mode === "INTERVAL") initState.push(setRange(schedule));
    });
    return initState;
  };
  const unavailability = computed(() => initDatePicker());
  //#endregion

  return { isDarkTheme, unavailability };
}
