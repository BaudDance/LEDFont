import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import useSettingStore from "@/stores/useSettingStore";
import { getFontGlyph } from "../../apis/font";
import { watchDebounced } from "@vueuse/core";
export default createGlobalState(() => {
  const needText = ref("波特律动");
  const { mode, color, fontSize, fontFace } = useSettingStore();
  const fontTemplates = ref([
    {
      name: "波特律动OLED驱动",
      template:
        "const unsigned char zh_/*_w_*/x/*_h_*/[][/*_font_len_*/] = {\n/*_font_data_utf8_*/\n};\nconst ZHFont zhfont/*_w_*/x/*_h_*/ = {/*_w_*/, /*_h_*/, (const unsigned char *)/*_w_*/x/*_h_*/, /*_len_*/, &font24x12};",
    },
    {
      name: "普通字模数据",
      template: "{\n/*_font_data_*/\n}",
    },
  ]);
  const fontTemplate = ref(fontTemplates.value[0]);
  const fonts = ref({});

  watchDebounced(
    [needText, fontSize, mode, color, fontFace],
    async () => {
      const res = await getFontGlyph(
        "Alibaba-PuHuiTi-Regular",
        fontSize.value.width,
        fontSize.value.height,
        needText.value,
        mode.value,
        color.value
      );
      console.log(res.data);
      const needList = [...new Set(needText.value.split(""))];
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
  return { needText, fonts, fontTemplates, fontTemplate };
});
