import { createStore } from "vuex";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  where,
  query,
  setDoc,
  Timestamp,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore/lite";
import { getStorage, listAll, ref, getDownloadURL } from "firebase/storage";

const store = createStore({
  state: () => ({
    database: null,
    user: null,
  }),
  mutations: {
    /**
     *
     * @param {*} state the instance of the state
     * @param {*} log the instance if the user
     */
    setAuthentication(state, log) {
      state.user = log;
    },
  },
  getters: {
    /**
     * @return true if the user is logged
     */
    isLogged(state) {
      return !!state.user;
    },
  },
  actions: {
    async createUserWithGoogle({ commit }, { db, user }) {
      const userDoc = doc(db, "user", user.uid);
      const _user = await setDoc(userDoc, {
        firstname: null,
        lastname: null,
        email: user.email,
        displayName: user.displayName,
        phone: user.phoneNumber,
        uid: user.uid,
        schedules: [],
        isShop: false,
      });
      return !!_user;
    },
    async createUserWithEmail({ commit }, { db, user }) {
      const userDoc = doc(db, "user", user.uid);
      const _user = await setDoc(userDoc, {
        firstname: null,
        lastname: null,
        email: user.email,
        displayName: user.email.split("@")[0],
        phone: user.phoneNumber,
        uid: user.uid,
        schedules: [],
        isShop: false,
      });
      return !!_user;
    },
    async getUsers({ commit }, { db }) {
      const users = await getDocs(collection(db, "user"));
      const _users = [];
      users.forEach(user => {
        _users.push(user.data());
      });
      return _users;
    },
    async getUser({ commit }, { db, id }) {
      const userRequest = query(collection(db, "user"), where("uid", "==", id));
      const users = await getDocs(userRequest);
      const _users = [];
      users.forEach(user => _users.push(user.data()));
      return _users[0];
    },
    async updateUserSchedule({ commit }, { db, userId, schedule }) {
      const userDoc = doc(db, "user", userId);
      await updateDoc(userDoc, { schedules: arrayUnion(schedule) });
    },
    async addSchedule({ commit }, { db, userId, schedules }) {
      schedules.forEach(async schedule => {
        const scheduleRef = collection(db, "schedule");
        const _schedule = {
          date: schedule.date ? Timestamp.fromDate(schedule.date, 0) : null,
          hours: schedule.hours
            ? schedule.hours.map(h => Timestamp.fromDate(h, 0))
            : null,
          interval: schedule.interval
            ? {
                start: Timestamp.fromDate(schedule.interval.start, 0),
                end: Timestamp.fromDate(schedule.interval.end, 0),
              }
            : null,
          mode: schedule.mode,
          repeat: schedule.repeat,
        };
        const scheduleCreated = await addDoc(scheduleRef, _schedule);

        // update user
        await this.dispatch("updateUserSchedule", {
          db,
          userId,
          schedule: doc(db, "schedule", scheduleCreated.id),
        });
      });

      const allSchedules = await this.dispatch("getSchedules", {
        db: store.state.database,
      });

      return allSchedules;
    },
    async getSchedules({ commit }, { db }) {
      const shopRef = query(
        collection(db, "user"),
        where("isShop", "==", true)
      );
      const shops = await getDocs(shopRef);

      const _shops = shops.docs.map(shop => {
        const _shop = shop.data();
        const schedules = [];
        _shop.schedules.forEach(async scheduleRef => {
          const schedule = await getDoc(scheduleRef);
          const data = schedule.data();

          // formats : Firestore.Timestamp -> Date
          let d = null;
          if (data.date) {
            d = new Date(
              data.date.seconds * 1000 + data.date.nanoseconds / 1000000
            );
            data.date = d;
          }

          let i = null;
          if (data.interval) {
            i = {
              start: new Date(
                data.interval.start.seconds * 1000 +
                  data.interval.start.nanoseconds / 1000000
              ),
              end: new Date(
                data.interval.end.seconds * 1000 +
                  data.interval.end.nanoseconds / 1000000
              ),
            };
            data.interval = i;
          }
          let h = null;
          if (data.hours) {
            h = data.hours.map(
              h => new Date(h.seconds * 1000 + h.nanoseconds / 1000000)
            );
            data.hours = h;
          }

          schedules.push(data);
        });

        return { ..._shop, schedules: schedules };
      });
      console.log(_shops);
      return _shops;
    },
    async getProfilePictures() {
      const storage = getStorage();
      const picsRef = ref(storage, "/profile-pictures");
      const pics = await listAll(picsRef);
      const _pics = [];
      pics.items.forEach(async pic => {
        const url = await getDownloadURL(pic);
        _pics.push(url);
      });
      return _pics;
    },
  },
});

export default store;
