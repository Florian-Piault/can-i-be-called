import { toastController } from "@ionic/vue";

export function useGlobalMethods() {
  const setToast = async ({ msg, duration = 2000, color = "info" }) => {
    const toast = await toastController.create({
      message: msg,
      duration,
      color,
    });
    return toast.present();
  };

  return { setToast };
}
