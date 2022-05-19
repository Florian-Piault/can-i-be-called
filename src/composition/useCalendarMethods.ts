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
      key: schedule.id,
      highlight: "red",
      dates: schedule.date,
      popover: {
        visibility: "hover",
        hideIndicator: true,
      },
      customData: schedule.hours.map(hour => hour.toLocaleTimeString()),
    };
  };
  const setRange = (schedule: Schedule) => {
    return {
      key: schedule.id,
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
        hideIndicator: true,
      },
    };
  };

  const setToday = () => {
    return {
      key: "today",
      dates: Date.now(),
      bar: true,
    };
  };

  const initDatePicker = () => {
    if (!schedules.value) return [];
    const initState = [];
    schedules.value.forEach((schedule: Schedule) => {
      if (schedule.mode === "ONE_DAY") initState.push(setOneDay(schedule));
      else if (schedule.mode === "INTERVAL") initState.push(setRange(schedule));
    });
    initState.push(setToday());
    return initState;
  };
  const unavailability = computed(() => initDatePicker());
  //#endregion

  return { isDarkTheme, unavailability };
}
