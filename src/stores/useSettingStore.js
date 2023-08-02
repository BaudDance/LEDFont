import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";

export default createGlobalState(() => {
  const sourceList = ["字体取模", "图片取模"];
  // 字体取模 or 图片取模
  const source = ref("字体取模");
  // 生成字体大小
  const fontSize = ref({ width: 16, height: 16 });

  // 生成图片的大小
  const imageSize = ref({ width: 128, height: 64 });

  const modeList = ["列行式", "行列式", "逐列式", "逐行式"];
  // 列行式 | 行列式 | 逐列式 | 逐行式
  const mode = ref("列行式");

  // 阴码 | 阳码
  const color = ref("阴码");

  // 低位在前 | 高位在前
  const endian = ref("低位在前");

  const fontFaces = ref([
    new FontFace("文泉驿微米黑", "url(/fonts/WenQuanDengKuanWeiMiHei.ttf)"),
    new FontFace("阿里巴巴普惠体", "url(/fonts/Alibaba-PuHuiTi-Regular.ttf)"),
    new FontFace("阿里巴巴黑体", "url(/fonts/AlibabaSans-Medium.otf)"),
  ]);

  const fontFace = ref(fontFaces.value[0]);

  return {
    sourceList,
    source,
    fontSize,
    imageSize,
    modeList,
    mode,
    color,
    endian,
    fontFaces,
    fontFace,
  };
});
