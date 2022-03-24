import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useStore } from "vuex";
const store = useStore();

export function useLoginMethods(
  { password, cPassword, mail, toLogin },
  setToast
) {
  // a changer
  const checkLoginFields = () => {
    return mail.value && password.value;
  };
  // a changer
  const checkRegisterFields = () => {
    return password.value === cPassword.value;
  };

  const swapMode = () => {
    password.value = "";
    cPassword.value = "";
    mail.value = "";
    toLogin.value = !toLogin.value;
  };

  const onSubmit = mode => {
    if (mode === "register") {
      if (!checkRegisterFields()) return setToast("register failed");
      return setToast("register OK");
    }
    if (!checkLoginFields) return setToast("login failed");
    return setToast("login OK");
  };

  const authWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(token, user);
    } catch (e) {
      const errorCode = e.code;
      const errorMessage = e.message;
      const email = e.email;
      const credential = GoogleAuthProvider.credentialFromError(e);
      console.error(
        `error code : ${errorCode}\nmessage : ${errorMessage}\nmail: ${email}\n credential: ${credential}`
      );
    }
  };

  return { swapMode, onSubmit, authWithGoogle };
}
