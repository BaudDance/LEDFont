import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import { getU8g2Fonts } from "@/apis/font";

export default createGlobalState(() => {
  const fonts = ref([]);
  const error = ref(null);
  const loading = ref(false);

  async function loadFonts() {
    loading.value = true;
    error.value = null;
    try {
      const response = await getU8g2Fonts();
      fonts.value = response.data.data;
    } catch (requestError) {
      error.value = {
        error: requestError.response?.data?.error || "无法读取字体列表",
      };
    } finally {
      loading.value = false;
    }
  }

  loadFonts();

  return { fonts, error, loading, loadFonts };
});
