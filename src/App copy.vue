<script setup>
import { onMounted, ref } from "vue";
import * as ccv from "@techstark/opencv-js";
const canvasRef = ref(null);
const canvasCtx = ref(null);
async function draw() {
  const ctx = canvasRef.value.getContext("2d");
  ctx.fillStyle = "#FFF";
  ctx.font = "normal 400px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const c = "律";
  let text = ctx.measureText(c);
  const textWidth = text.actualBoundingBoxLeft + text.actualBoundingBoxRight;
  const textHeight =
    text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
  const fontHeight = text.fontBoundingBoxAscent + text.fontBoundingBoxDescent;
  console.log(
    `textWidth: ${textWidth}, textHeight: ${textHeight}, fontHeight: ${fontHeight}`
  ); // 56, 56
  ctx.fillText(
    c,
    200,
    200 + (text.actualBoundingBoxAscent - text.actualBoundingBoxDescent) / 2
  );
  const cv = await ccv;
  let mat = cv.imread("inputCanvas");
  let imgScaled = new cv.Mat();
  const to = { h: 24, w: 12 };
  // cv.threshold(imgScaled, imgScaled, 127, 255, cv.THRESH_BINARY);
  cv.resize(mat, imgScaled, new cv.Size(to.w, to.h), cv.INTER_AREA);
  cv.threshold(imgScaled, imgScaled, 127, 255, cv.THRESH_BINARY);
  console.log(imgScaled.data);
  console.log(imgScaled.col(0));
  console.log(mat.size(), imgScaled.size());
  const res = [];
  // 列行式
  const page = ~~((to.h + 7) / 8);
  for (let i = 0; i < page; i++) {
    for (let j = 0; j < to.w; j++) {
      let v = 0;
      for (let k = 0; k < 8; k++) {
        // v = v << 1;
        v += imgScaled.ucharPtr(i * 8 + k, j)[0] === 255 ? 1 << k : 0;
      }
      res.push(v);
    }
  }
  console.log("res: ", res);
  // hex console 类似0xff
  const hex = res.map((v) => {
    let s = v.toString(16);
    if (s.length === 1) {
      s = "0" + s;
    }
    return "0x" + s;
  });
  console.log("hex: ", hex.join(", "));
  cv.imshow("outputCanvas", imgScaled);
  mat.delete();
  imgScaled.delete();
}

function canvasInit() {
  const dpr = window.devicePixelRatio;
  const canvas = canvasRef.value;
  canvas.width = 400 * dpr;
  canvas.height = 400 * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
}

onMounted(() => {
  canvasInit();
  draw();
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <canvas
      ref="canvasRef"
      id="inputCanvas"
      style="width: 400px; height: 400px"
      class="border"
    ></canvas>
    <canvas
      id="outputCanvas"
      style="width: 400px; height: 400px"
      class="border"
    ></canvas>
  </div>
</template>
