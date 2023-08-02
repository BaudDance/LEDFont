import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import useSettingStore from "@/stores/useSettingStore";
export default createGlobalState(() => {
  const needText = ref("波特律动");
  const { mode, color, fontSize } = useSettingStore();
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
  return { needText, fonts, fontTemplates, fontTemplate };
});
