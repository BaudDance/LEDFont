import { ref, computed } from "vue";
import { createGlobalState } from "@vueuse/core";
import useFontCreator from "@/components/FontCreator/useFontCreator";
import useSettingStore from "@/stores/useSettingStore";
import useImageCreator from "@/components/ImageCreator/useImageCreator";

const utf8Encoder = new TextEncoder();

export default createGlobalState(() => {
  const { fonts } = useFontCreator();
  const { fontSize, imageSize } = useSettingStore();
  const { imgGlyph } = useImageCreator();

  // 字模占用的字节数
  const fontGlyphLen = computed(
    () => (fontSize.value.width * fontSize.value.height) / 8
  );
  // 字模占用的字节数
  const fontGlyphWithUTF8Len = computed(
    () => (fontSize.value.width * fontSize.value.height) / 8 + 4
  );

  const fontGlyphArray = computed(() => {
    const res = [];
    Object.keys(fonts.value).forEach((key, index) => {
      let codeLine = "";
      codeLine += `/* ${index} ${key} */ {`;
      const font = fonts.value[key];
      font.data.forEach((item) => {
        codeLine += `0x${item.toString(16).padStart(2, "0")},`;
      });
      codeLine += `}`;
      res.push(codeLine);
    });
    return res;
  });
  const fontGlyphCode = computed(() => fontGlyphArray.value.join(",\n"));
  const fontGlyphWithUTF8Array = computed(() => {
    const res = [];
    Object.keys(fonts.value).forEach((key, index) => {
      let codeLine = "";
      codeLine += `/* ${index} ${key} */ {`;
      const font = fonts.value[key];
      // 4位utf8编码
      const utf8 = utf8Encoder.encode(key);
      for (let i = 0; i < 4; i++) {
        codeLine += `0x${(utf8[i] || 0).toString(16).padStart(2, "0")},`;
      }
      font.data.forEach((item) => {
        codeLine += `0x${item.toString(16).padStart(2, "0")},`;
      });
      codeLine += `}`;
      res.push(codeLine);
    });
    return res;
  });

  const fontGlyphWithUTF8Code = computed(() =>
    fontGlyphWithUTF8Array.value.join(",\n")
  );

  const imgGlyphCode = computed(() => {
    let codeLine = "";
    if (!imgGlyph.value?.data) return codeLine;
    imgGlyph.value.data.forEach((item, index) => {
      codeLine += `0x${item.toString(16).padStart(2, "0")}, `;
      if (index % 24 == 23) {
        codeLine += `\n`;
      }
    });
    return codeLine;
  });

  return {
    glyphWithUTF8Array: fontGlyphWithUTF8Array,
    fontGlyphWithUTF8Code,
    fontGlyphLen,
    fontGlyphWithUTF8Len,
    fontGlyphCode,
    imgGlyphCode,
  };
});
