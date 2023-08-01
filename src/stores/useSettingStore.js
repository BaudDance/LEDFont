import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";

export default createGlobalState(() => {
  // 生成字体大小
  const fontSize = ref({ width: 16, height: 16 });

  // 列行式 | 行列式 | 逐列式 | 逐行式
  const mode = ref("列行式");

  // 阴码 | 阳码
  const color = ref("阴码");

  // 低位在前 | 高位在前
  const endian = ref("低位在前");

  const template = ref(
    "const unsigned char zh_/*_w_*/x/*_h_*/[][/*_font_len_*/] = {\n/*_data1_*/\n};\nconst ZHFont zhfont/*_w_*/x/*_h_*/ = {/*_w_*/, /*_h_*/, (const unsigned char *)/*_w_*/x/*_h_*/, /*_len_*/, &font24x12};"
  );

  const fontFaces = ref([
    new FontFace("文泉驿微米黑", "url(/fonts/WenQuanDengKuanWeiMiHei.ttf)"),
    new FontFace("阿里巴巴普惠体", "url(/fonts/Alibaba-PuHuiTi-Regular.ttf)"),
    new FontFace("阿里巴巴黑体", "url(/fonts/AlibabaSans-Medium.otf)"),
  ]);

  const fontFace = ref(fontFaces.value[0]);

  return {
    fontSize,
    mode,
    color,
    endian,
    template,
    fontFaces,
    fontFace,
  };
});
