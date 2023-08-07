import { ref } from "vue";
import {
  createGlobalState,
  useIntervalFn,
  useLocalStorage,
} from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";
import { getOnline } from "@/apis/online";

export default createGlobalState(() => {
  const uuid = useLocalStorage("uuid", uuidv4());
  const online = ref({ led: "n" });
  useIntervalFn(
    async () => {
      console.log("uuid:", uuid.value);
      const res = await getOnline(uuid.value);
      console.log("res:", res);
      online.value = res.data.data;
    },
    1000 * 60,
    { immediate: true, immediateCallback: true }
  );

  return { online };
});
