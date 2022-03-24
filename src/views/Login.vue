<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Can I Be Called</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card class="wrapper">
        <!-- login -->
        <form
          @submit.prevent="onSubmit('login')"
          action="post"
          v-show="toLogin"
        >
          <ion-card-title class="card-title">Login</ion-card-title>
          <ion-card-content>
            <ion-item class="field">
              <ion-label position="floating" color="primary">E-mail</ion-label>
              <ion-input
                clear-input="true"
                inputmode="email"
                type="email"
                v-model="mail"
                required
              ></ion-input>
            </ion-item>
            <ion-item class="field">
              <ion-label position="floating" color="primary"
                >Password</ion-label
              >
              <ion-input
                clear-input="true"
                type="password"
                v-model="password"
                required
              ></ion-input>
            </ion-item>
          </ion-card-content>
          <ion-item>
            <ion-button type="submit" fill="solid">Login</ion-button>
          </ion-item>
          <ion-item>
            <div class="google-btn" @click="authWithGoogle">
              <div class="google-icon-wrapper">
                <img
                  class="google-icon"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                />
              </div>
              <p class="btn-text"><b>Sign in with google</b></p>
            </div>
          </ion-item>
          <ion-card-subtitle class="card-subtitle">
            You don't have an account yet ?
            <ion-button @click="swapMode" fill="clear"
              >register here</ion-button
            >
          </ion-card-subtitle>
        </form>
        <!-- register -->
        <form
          @submit.prevent="onSubmit('register')"
          action="post"
          v-show="!toLogin"
        >
          <ion-card-title class="card-title">Register</ion-card-title>
          <ion-card-content>
            <ion-item class="field">
              <ion-label position="floating" color="primary">E-mail</ion-label>
              <ion-input
                clear-input="true"
                inputmode="email"
                type="email"
                v-model="mail"
                required
              ></ion-input>
            </ion-item>
            <ion-item class="field">
              <ion-label position="floating" color="primary"
                >Password</ion-label
              >
              <ion-input
                clear-input="true"
                type="password"
                v-model="password"
                required
              ></ion-input>
            </ion-item>
            <ion-item class="field">
              <ion-label position="floating" color="primary"
                >Confirm password</ion-label
              >
              <ion-input
                clear-input="true"
                type="password"
                v-model="cPassword"
                required
              ></ion-input>
            </ion-item>
          </ion-card-content>
          <ion-item>
            <ion-button type="submit" fill="solid">Register</ion-button>
          </ion-item>
          <ion-card-subtitle class="card-subtitle">
            You already have an account ?
            <ion-button @click="swapMode" fill="clear">login here</ion-button>
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
  IonLabel,
  IonButton,
} from "@ionic/vue";
import { useGlobalMethods } from "@/composition/useGlobalMethods";
import { useLoginMethods } from "@/composition/useLoginMethods";
import { Ref, ref } from "vue";
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
    IonLabel,
    IonButton,
  },
  setup() {
    const mail: Ref<string> = ref("");
    const password: Ref<string> = ref("");
    const cPassword: Ref<string> = ref("");
    const toLogin: Ref<boolean> = ref(true);
    const { setToast } = useGlobalMethods();

    return {
      mail,
      password,
      cPassword,
      toLogin,
      ...useLoginMethods({ mail, password, cPassword, toLogin }, setToast),
    };
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

@media screen and (min-width: 700px) {
  .google-btn {
    cursor: pointer;
    width: 184px;
    height: 42px;
    background-color: #4285f4;
    border-radius: 2px;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
  }

  .google-btn:hover {
    box-shadow: 0 0 6px #4285f4;
  }
  .google-btn:active {
    background: #1669f2;
  }
  .google-icon-wrapper {
    position: absolute;
    margin-top: 1px;
    margin-left: 1px;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    background-color: #fff;
  }
  .google-icon {
    position: absolute;
    margin-top: 11px;
    margin-left: 11px;
    width: 18px;
    height: 18px;
  }
  .btn-text {
    float: right;
    margin: 11px 11px 0 0;
    color: #fff;
    font-size: 14px;
    letter-spacing: 0.2px;
  }
}
@media screen and (max-width: 699px) {
  .google-btn {
    cursor: pointer;
    width: 42px;
    height: 42px;
    background-color: #4285f4;
    border-radius: 1000px;
    box-shadow: 4px 2px 5px 0 rgba(0, 0, 0, 0.25);
  }

  .google-btn:hover {
    box-shadow: 4px 2px 5px 0px #4285f4;
  }
  .google-btn:active {
    background: #1669f2;
  }
  .google-icon-wrapper {
    position: absolute;
    margin-top: 1px;
    margin-left: 1px;
    width: 40px;
    height: 40px;
    border-radius: 1000px;
    background-color: #fff;
  }
  .google-icon {
    position: absolute;
    margin-top: 11px;
    margin-left: 11px;
    width: 18px;
    height: 18px;
  }
  .btn-text {
    display: none;
  }
}
</style>
