import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import useSettingStore from "@/stores/useSettingStore";
import { getFontGlyph } from "../../apis/font";
import { watchDebounced } from "@vueuse/core";
export default createGlobalState(() => {
  const needText = ref("波特律动");
  const { mode, color, fontSize } = useSettingStore();
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

  const fontFaces = ref([
    { name: "文泉驿·点阵字16", font: "wenquanyi_12pt", width: 16, height: 16 },
    { name: "文泉驿·点阵字15", font: "wenquanyi_11pt", width: 15, height: 15 },
    { name: "文泉驿·点阵字14", font: "wenquanyi_13px", width: 14, height: 14 },
    { name: "文泉驿·点阵字13", font: "wenquanyi_10pt", width: 13, height: 13 },
    { name: "文泉驿·点阵字12", font: "wenquanyi_9pt", width: 12, height: 12 },
    { name: "文泉驿·微米黑", font: "WenQuanDengKuanWeiMiHei" },
    { name: "阿里巴巴·普惠体", font: "Alibaba-PuHuiTi-Regular" },
  ]);

  const fontFace = ref(fontFaces.value[0]);

  watchDebounced(
    [needText, fontSize, mode, color, fontFace],
    async () => {
      const needList = [...new Set(needText.value.split(""))];
      const res = await getFontGlyph(
        fontFace.value.font,
        fontSize.value.width,
        fontSize.value.height,
        needList.join(),
        mode.value,
        color.value
      );
      console.log(res.data);
      const a = {};
      needList.forEach((item) => {
        a[item] = {
          width: fontSize.value.width,
          height: fontSize.value.height,
          data: res.data.data[item],
        };
      });
      fonts.value = a;
    },
    { immediate: true, deep: true, debounce: 100, maxWait: 300 }
  );
  return { needText, fonts, fontTemplates, fontTemplate, fontFaces, fontFace };
});
