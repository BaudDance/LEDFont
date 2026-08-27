import { computed, ref, watch } from "vue";
import { createGlobalState, watchDebounced } from "@vueuse/core";
import useSettingStore from "@/stores/useSettingStore";
import { getFontGlyph } from "@/apis/font";
import useFontCatalog from "./useFontCatalog";

export default createGlobalState(() => {
  const needText = ref("波特律动");
  const { mode, color, fontSize, fontFormat, source } = useSettingStore();
  const { fonts: fontFaces, error: catalogError } = useFontCatalog();
  const fontTemplates = ref([
    {
      name: "波特律动OLED驱动",
      template:
        "const uint8_t zh/*_w_*/x/*_h_*/[][/*_font_len_utf8_*/] = {\n/*_font_data_utf8_*/\n};\nconst Font font/*_w_*/x/*_h_*/ = {.w =/*_w_*/, .h = /*_h_*/, .chars = (const uint8_t *)zh/*_w_*/x/*_h_*/,.len = sizeof(zh/*_w_*/x/*_h_*/)//*_font_len_utf8_*/, .ascii = &afont16x8};",
    },
    {
      name: "普通字模数据",
      template: "{\n/*_font_data_*/\n}",
    },
  ]);
  const fontTemplate = ref(fontTemplates.value[0]);
  const fonts = ref({});
  const fontFace = ref(null);
  const sizeInput = ref("16");
  const error = ref(null);
  const loading = ref(false);
  const sizeRevision = ref(0);
  let controller = null;
  let requestSequence = 0;

  const fixedSize = computed(() => fontFace.value?.sizes?.[0] ?? null);
  const sizeRange = computed(() => fontFace.value?.size ?? null);

  function clearOutput() {
    fonts.value = {};
  }

  function commitSize() {
    if (fixedSize.value !== null) {
      fontSize.value = fixedSize.value;
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
      fontSize.value = value;
      sizeRevision.value += 1;
      error.value = null;
    } else {
      controller?.abort();
      controller = null;
      requestSequence += 1;
      loading.value = false;
      clearOutput();
      error.value = {
        error: `字号必须是 ${sizeRange.value?.min ?? 8}–${sizeRange.value?.max ?? 64} 的整数`,
      };
    }
  }

  watch(
    fontFaces,
    (available) => {
      if (!fontFace.value && available.length) fontFace.value = available[0];
    },
    { immediate: true }
  );

  watch(fontFace, () => {
    if (fixedSize.value !== null) {
      fontSize.value = fixedSize.value;
      sizeInput.value = String(fixedSize.value);
    } else if (sizeRange.value) {
      const current = Number(sizeInput.value);
      const next = Number.isInteger(current)
        ? Math.min(sizeRange.value.max, Math.max(sizeRange.value.min, current))
        : 16;
      fontSize.value = next;
      sizeInput.value = String(next);
    }
  });

  watch(catalogError, (value) => {
    if (value) {
      error.value = value;
      clearOutput();
    }
  });

  watchDebounced(
    [needText, fontSize, sizeRevision, mode, color, fontFace, fontFormat, source],
    async () => {
      controller?.abort();
      controller = null;
      const sequence = ++requestSequence;
      if (fontFormat.value !== "traditional" || source.value !== "字体取模" || !fontFace.value) {
        loading.value = false;
        return;
      }

      const normalized = needText.value.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
      const needList = [...new Set(Array.from(normalized).filter((char) => char !== "\n"))];
      clearOutput();
      error.value = null;
      if (!needList.length) {
        loading.value = false;
        return;
      }

      const requestController = new AbortController();
      controller = requestController;
      loading.value = true;
      try {
        const response = await getFontGlyph(
          fontFace.value.id,
          fontSize.value,
          needList.join(""),
          mode.value,
          color.value,
          requestController.signal
        );
        if (sequence !== requestSequence) return;
        if (response.data.code !== 200) {
          error.value = { error: response.data.error || "传统字模生成失败" };
          return;
        }
        const generated = {};
        needList.forEach((char) => {
          generated[char] = {
            width: fontSize.value,
            height: fontSize.value,
            data: response.data.data[char],
          };
        });
        fonts.value = generated;
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED" || sequence !== requestSequence) return;
        error.value = requestError.response?.data || { error: "传统字模生成失败" };
        clearOutput();
      } finally {
        if (sequence === requestSequence) loading.value = false;
      }
    },
    { immediate: true, deep: true, debounce: 400, maxWait: 1200 }
  );

  return {
    needText,
    fonts,
    fontTemplates,
    fontTemplate,
    fontFaces,
    fontFace,
    sizeInput,
    fixedSize,
    sizeRange,
    error,
    loading,
    commitSize,
    clearOutput,
  };
});
