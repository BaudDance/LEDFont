import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { createGlobalState } from "@vueuse/core";
import { getLibraries, getLibraryDetail } from "@/apis/library";

export default createGlobalState(() => {
  const libs = ref([]);
  const query = ref("");
  const selectedLib = ref(undefined);
  const libDetail = ref(undefined);
  const loadingDetail = ref(false);
  watchDebounced(
    query,
    async () => {
      const res = await getLibraries();
      libs.value = res.data.data;
    },
    { immediate: true, debounce: 100, maxWait: 300 }
  );
  watchDebounced(
    selectedLib,
    async () => {
      if (selectedLib.value) {
        loadingDetail.value = true;
        const res = await getLibraryDetail(selectedLib.value.id);
        libDetail.value = res.data.data;
        loadingDetail.value = false;
      } else {
        libDetail.value = undefined;
      }
    },
    {
      immediate: true,
      debounce: 100,
      maxWait: 300,
    }
  );
  return { libs, query, selectedLib, libDetail, loadingDetail };
});
