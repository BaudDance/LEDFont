import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
export default createGlobalState(() => {
  const screenSize = ref({ width: 128, height: 64 });

  return { screenSize };
});
