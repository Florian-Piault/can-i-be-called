import { Ref } from "vue";

export interface Schedule {
  mode: string;
  date?: Date;
  interval?: { start: Date; end: Date };
  hours?: Date[];
  repeat: string;
}

export interface Shop {
  displayName: Ref<string>;
  schedules: Ref<Schedule[]>;
  uid: Ref<string>;
  img: string;
}

export interface Mode {
  id: string;
  name: string;
}
