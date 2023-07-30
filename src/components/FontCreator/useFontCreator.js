import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import useSettingStore from "@/stores/useSettingStore";
export default createGlobalState(() => {
  const needText = ref("波特律动");
  const { mode, color, fontSize } = useSettingStore();
  const fonts = ref({});
  return { needText, fonts };
});
