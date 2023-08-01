import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import useSettingStore from "@/stores/useSettingStore";
export default createGlobalState(() => {
  const sourceImg = ref();
  const ledImg = ref({});
  const imgThreshold = ref(128);
  return { sourceImg, ledImg, imgThreshold };
});
