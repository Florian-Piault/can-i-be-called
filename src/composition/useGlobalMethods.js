import { toastController } from "@ionic/vue";

export function useGlobalMethods() {
  const setToast = async (msg, duration = 2000) => {
    const toast = await toastController.create({
      message: msg,
      duration: duration,
    });
    return toast.present();
  };

  return { setToast };
}
