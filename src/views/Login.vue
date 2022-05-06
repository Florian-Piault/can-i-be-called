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
          action="post"
          v-show="toLogin"
          @keyup.enter="authPassword"
          @submit.prevent="authPassword"
        >
          <ion-card-title class="card-title">Connexion</ion-card-title>
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
                >Mot de passe</ion-label
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
            <ion-button type="submit" fill="solid">Se connecter</ion-button>
          </ion-item>
          <ion-card-subtitle class="card-subtitle">
            Vous n'avez pas encore de compte ?
            <ion-button @click="swapMode" fill="clear"
              >s'inscrire ici</ion-button
            >
          </ion-card-subtitle>
        </form>
        <!-- register -->
        <form
          action="post"
          v-show="!toLogin"
          @keyup.enter="register"
          @submit.prevent="register"
        >
          <ion-card-title class="card-title">S'enregistrer</ion-card-title>
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
                >Mot de passe</ion-label
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
            <ion-button type="submit" fill="solid">S'inscrire</ion-button>
          </ion-item>
          <ion-card-subtitle class="card-subtitle">
            Vous avez déjà un compte ?
            <ion-button @click="swapMode" fill="clear"
              >se connecter ici</ion-button
            >
          </ion-card-subtitle>
        </form>
        <template v-if="plateforms.includes('desktop')">
          <ion-buttons>
            <ion-button @click="authWithGoogle" fill="solid" color="medium"
              >Se connecter avec Google</ion-button
            >
            <ion-button @click="authAnonymous" fill="solid" color="medium"
              >Se connecter en invité</ion-button
            >

            <!-- <ion-button @click="authMobile" fill="solid" color="medium"
              >IOS</ion-button
            > -->
          </ion-buttons>
        </template>
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
  IonButtons,
} from "@ionic/vue";
import { useGlobalMethods } from "@/composition/useGlobalMethods";
import { useLoginMethods } from "@/composition/useLoginMethods";
import { Ref, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getPlatforms } from "@ionic/vue";
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
    IonButtons,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const mail: Ref<string> = ref("");
    const password: Ref<string> = ref("");
    const toLogin: Ref<boolean> = ref(true);
    const { setToast } = useGlobalMethods();
    const plateforms = getPlatforms();
    return {
      mail,
      password,
      toLogin,
      plateforms,
      ...useLoginMethods({ mail, password, toLogin, store, router }, setToast),
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

.anonymous-btn {
  background: var(--ion-color-medium);
  color: var(--ion-color-light);
  padding: 0.5em 1em;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
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
