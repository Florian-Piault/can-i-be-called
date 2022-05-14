import { Ref } from "vue";

/**
 * Schedule attached to a user
 *
 * **id** firebase document id
 *
 * if mode is **ONE_DAY** : date & hours
 *
 * if mode is **RANGE** : interval
 *
 * @beta repeat is not used yet
 */
export interface Schedule {
  id?: string;
  mode: string;
  date?: Date;
  interval?: { start: Date; end: Date };
  hours?: Date[];
  repeat: string;
}

/**
 * A user that can have schedules
 */
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
