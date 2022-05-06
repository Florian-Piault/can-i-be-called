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
                :type="passwordType"
                v-model="password"
                required
              ></ion-input>
              <ion-icon
                v-if="password"
                @click="togglePassword"
                slot="end"
                class="passwordIcon"
                :icon="passwordIcon"
              ></ion-icon>
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
            <ion-item>
              <ion-label position="floating" color="primary">E-mail</ion-label>
              <ion-input
                clear-input="true"
                inputmode="email"
                type="email"
                v-model="mail"
                required
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" color="primary"
                >Mot de passe</ion-label
              >
              <ion-input
                clear-input="true"
                :type="passwordType"
                v-model="password"
                required
              ></ion-input>
              <ion-icon
                v-if="password"
                @click="togglePassword"
                slot="end"
                class="passwordIcon"
                :icon="passwordIcon"
              ></ion-icon>
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
        <ion-buttons>
          <template v-if="plateforms.includes('desktop')">
            <ion-button @click="authWithGoogle" fill="solid" color="medium"
              >Se connecter avec Google</ion-button
            >
          </template>
          <ion-button @click="authAnonymous" fill="solid" color="medium"
            >Se connecter en invité</ion-button
          >
        </ion-buttons>
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
  IonIcon,
} from "@ionic/vue";
import { useGlobalMethods } from "@/composition/useGlobalMethods";
import { useLoginMethods } from "@/composition/useLoginMethods";
import { Ref, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getPlatforms } from "@ionic/vue";
import { eyeOutline as eye, eyeOffOutline as eyeOff } from "ionicons/icons";

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
    IonIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const mail: Ref<string> = ref("");
    const password: Ref<string> = ref("");
    const passwordType: Ref<string> = ref("password");
    const passwordIcon: Ref<string> = ref(eyeOff);
    const toLogin: Ref<boolean> = ref(true);
    const { setToast } = useGlobalMethods();
    const plateforms = getPlatforms();

    /**
     * Show or hide the password
     *
     * Changes the **input:password** to an **input:text**
     *
     * Changes the icon aswell
     */
    const togglePassword = () => {
      passwordType.value = passwordType.value === "text" ? "password" : "text";
      passwordIcon.value = passwordIcon.value === eyeOff ? eye : eyeOff;
    };

    return {
      mail,
      password,
      passwordType,
      passwordIcon,
      toLogin,
      plateforms,
      eye,
      eyeOff,
      togglePassword,
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

.passwordIcon {
  cursor: pointer;
  font-size: 1.5rem !important;
  position: relative !important;
  top: 2rem !important;
  margin: 0 auto !important;
}
</style>
