<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>
        <div class="flexed">
          <div>
            <img :src="logo" alt="" class="logo" />
          </div>
          {{ headerTitle }}
        </div>
      </ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { IonToolbar, IonHeader, IonTitle } from "@ionic/vue";
export default defineComponent({
  name: "Toolbar",
  components: { IonToolbar, IonHeader, IonTitle },
  props: ["title"],
  setup(props) {
    const { title: headerTitle } = toRefs(props);
    const logo = "./assets/logo.png";
    return { logo, headerTitle };
  },
});
</script>

<style scoped>
.flexed {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
}
.logo {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  box-shadow: 1px 3px 3px 0px #3b3b3bba;
}
</style>
