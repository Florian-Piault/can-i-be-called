<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-title></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="wrapper">
      <!-- mettre au milieu + bouton style -->
      <ion-card class="card">
        <form @submit.prevent="onSumbit" class="login-card" action="post">
          <!-- login -->
          <div v-show="toLogin">
            <ion-card-title>Log in</ion-card-title>
            <ion-card-content>
              <ion-item class="field">
                <ion-input
                  clear-input="true"
                  inputmode="email"
                  type="email"
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
            </ion-card-content>
            <ion-item>
              <button type="submit">Log in</button>
            </ion-item>
          </div>
          <!-- register -->
          <div v-show="!toLogin">
            <ion-card-title>Register</ion-card-title>
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
              <button type="submit">Register</button>
            </ion-item>
          </div>

          <!-- switch mode login/register -->
          <ion-card-subtitle v-if="toLogin">
            You already have an account ?
            <button @click="swapMode">login here</button>
          </ion-card-subtitle>
          <ion-card-subtitle v-else>
            You don't have an account yet ?
            <button @click="swapMode">register here</button>
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

<style scoped></style>
