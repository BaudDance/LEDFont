import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";

export default createGlobalState(() => {
  // 生成字体大小
  const fontSize = ref({ width: 24, height: 24 });

  // 列行式 | 行列式 | 逐列式 | 逐行式
  const mode = ref("列行式");

  // 阴码 | 阳码
  const color = ref("阴码");

  // 低位在前 | 高位在前
  const endian = ref("低位在前");

  const template = ref("");

  const fontFaces = ref([
    new FontFace("文泉驿微米黑", "url(/fonts/WenQuanDengKuanWeiMiHei.ttf)"),
    new FontFace("思源黑体", "url(/fonts/SourceHanSansSC-VF.ttf)"),
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
