<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-title>placeholder: App name</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card class="wrapper">
        <!-- login -->
        <form @submit.prevent="onSumbit" action="post" v-show="toLogin">
          <ion-card-title class="card-title">Login</ion-card-title>
          <ion-card-content>
            <ion-item class="field">
              <ion-input
                clear-input="true"
                inputmode="email"
                type="email"
                v-model="mail"
                placeholder="Email"
              ></ion-input>
            </ion-item>
            <ion-item class="field">
              <ion-input
                clear-input="true"
                type="password"
                v-model="password"
                placeholder="Password"
              ></ion-input>
            </ion-item>
          </ion-card-content>
          <ion-item>
            <ion-button type="submit" fill="solid">Login</ion-button>
          </ion-item>
          <ion-card-subtitle class="card-subtitle">
            You already have an account ?
            <ion-button @click="swapMode" fill="clear">login here</ion-button>
          </ion-card-subtitle>
        </form>
        <!-- register -->
        <form @submit.prevent="onSumbit" action="post" v-show="!toLogin">
          <ion-card-title class="card-title">Register</ion-card-title>
          <ion-card-content>
            <ion-item class="field">
              <ion-input
                clear-input="true"
                inputmode="email"
                type="mail"
                v-model="mail"
                placeholder="Email"
                required
              ></ion-input>
            </ion-item>
            <ion-item class="field">
              <ion-input
                clear-input="true"
                type="password"
                v-model="password"
                placeholder="Password"
                required
              ></ion-input>
            </ion-item>
            <ion-item class="field">
              <ion-input
                clear-input="true"
                type="password"
                v-model="cPassword"
                placeholder="Confirm password"
                required
              ></ion-input>
            </ion-item>
          </ion-card-content>
          <ion-item>
            <ion-button type="submit" fill="solid">Register</ion-button>
          </ion-item>
          <ion-card-subtitle class="card-subtitle">
            You don't have an account yet ?
            <ion-button @click="swapMode" fill="clear"
              >register here</ion-button
            >
          </ion-card-subtitle>
        </form>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
} from "@ionic/vue";
export default {
  name: "Login",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
  },
  data() {
    return {
      mail: "",
      password: "",
      cPassword: "",
      toLogin: true,
    };
  },
  methods: {
    onSumbit(): void {
      console.log(this.mail, this.password);
      this.$root.setNotif();
    },
    swapMode(): void {
      this.password = "";
      this.cPassword = "";
      this.mail = "";
      this.toLogin = !this.toLogin;
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 700px) {
  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 540px;
    transform: translate(-50%, -50%);
  }
}

@media screen and (max-width: 699px) {
  .wrapper {
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    transform: translateY(-50%);
  }
}

.card-title {
  border-bottom: 1px solid var(--ion-color-medium);
  padding: 1em 0.5em;
  font-size: 1.2rem;
}

.card-subtitle {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
