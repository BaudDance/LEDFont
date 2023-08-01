import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import useSettingStore from "@/stores/useSettingStore";
export default createGlobalState(() => {
  const sourceImg = ref();
  const { mode, color } = useSettingStore();
  const ledImg = ref({});
  return { sourceImg, ledImg };
});
