import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
export default createGlobalState(() => {
  const sourceImg = ref();
  const imgGlyph = ref({});
  const imgThreshold = ref(127);
  const imgName = ref("");
  const imgTemplates = ref([
    {
      name: "波特律动OLED驱动",
      template:
        "const uint8_t /*_img_name_*/Data[] = {\n/*_img_data_*/\n};\nconst Image /*_img_name_*/Img = {/*_w_*/, /*_h_*/, /*_img_name_*/Data};",
    },
    {
      name: "普通图模数据",
      template: "{\n/*_img_data_*/\n}",
    },
  ]);
  const imgTemplate = ref(imgTemplates.value[0]);
  return {
    sourceImg,
    imgGlyph,
    imgThreshold,
    imgTemplates,
    imgTemplate,
    imgName,
  };
});
