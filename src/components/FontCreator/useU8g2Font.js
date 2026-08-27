import { computed, ref, watch } from "vue";
import { createGlobalState, watchDebounced } from "@vueuse/core";
import { generateU8g2Font, getU8g2Fonts } from "@/apis/font";
import useFontCreator from "./useFontCreator";
import useSettingStore from "@/stores/useSettingStore";

export default createGlobalState(() => {
  const { needText } = useFontCreator();
  const { fontFormat, source } = useSettingStore();
  const fonts = ref([]);
  const font = ref(null);
  const size = ref(16);
  const sizeInput = ref("16");
  const arrayName = ref("");
  const result = ref(null);
  const error = ref(null);
  const loading = ref(false);
  let controller = null;
  let requestSequence = 0;

  const fixedSize = computed(() => font.value?.sizes?.[0] ?? null);
  const sizeRange = computed(() => font.value?.size ?? null);

  function clearOutput() {
    result.value = null;
  }

  function commitSize() {
    if (fixedSize.value !== null) {
      size.value = fixedSize.value;
      sizeInput.value = String(fixedSize.value);
      return;
    }
    const value = Number(sizeInput.value);
    if (
      Number.isInteger(value) &&
      sizeRange.value &&
      value >= sizeRange.value.min &&
      value <= sizeRange.value.max
    ) {
      size.value = value;
      error.value = null;
    } else {
      clearOutput();
      error.value = {
        error: `字号必须是 ${sizeRange.value?.min ?? 8}–${sizeRange.value?.max ?? 64} 的整数`,
      };
    }
  }

  watch(font, () => {
    if (fixedSize.value !== null) {
      size.value = fixedSize.value;
      sizeInput.value = String(fixedSize.value);
    } else if (sizeRange.value) {
      const current = Number(sizeInput.value);
      const next = Number.isInteger(current)
        ? Math.min(sizeRange.value.max, Math.max(sizeRange.value.min, current))
        : 16;
      size.value = next;
      sizeInput.value = String(next);
    }
  });

  async function loadFonts() {
    try {
      const response = await getU8g2Fonts();
      fonts.value = response.data.data;
      if (!font.value && fonts.value.length) {
        font.value = fonts.value[0];
      }
    } catch (requestError) {
      error.value = { error: requestError.response?.data?.error || "无法读取压缩字模字体列表" };
    }
  }

  watchDebounced(
    [font, size, needText, arrayName, fontFormat, source],
    async () => {
      if (fontFormat.value !== "u8g2" || source.value !== "字体取模" || !font.value) return;
      controller?.abort();
      controller = new AbortController();
      const sequence = ++requestSequence;
      loading.value = true;
      error.value = null;
      clearOutput();
      try {
        const response = await generateU8g2Font(
          {
            font: font.value.id,
            size: size.value,
            text: needText.value,
            array_name: arrayName.value || undefined,
          },
          controller.signal
        );
        if (sequence === requestSequence) result.value = response.data.data;
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED" || sequence !== requestSequence) return;
        error.value = requestError.response?.data || { error: "压缩字模生成失败" };
        clearOutput();
      } finally {
        if (sequence === requestSequence) loading.value = false;
      }
    },
    { debounce: 400, maxWait: 1200, deep: true }
  );

  loadFonts();

  return {
    fonts,
    font,
    size,
    sizeInput,
    arrayName,
    result,
    error,
    loading,
    fixedSize,
    sizeRange,
    commitSize,
    clearOutput,
  };
});
