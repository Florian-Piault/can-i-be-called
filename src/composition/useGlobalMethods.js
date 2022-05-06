import { toastController } from "@ionic/vue";

export function useGlobalMethods() {
  const setToast = async ({ message, duration = 2000, color = "primary" }) => {
    const toast = await toastController.create({
      message,
      duration,
      color,
    });
    return toast.present();
  };

  return { setToast };
}
