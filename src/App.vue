<script setup>
import { ref, onMounted, watch } from "vue";
import { useElementSize } from '@vueuse/core'

const testData = [
  0x00, 0x80, 0x60, 0xF8, 0x07, 0x40, 0x20, 0x18, 0x0F, 0x08, 0xC8, 0x08, 0x08, 0x28, 0x18, 0x00, 0x01, 0x00, 0x00, 0xFF, 0x00, 0x10, 0x0C, 0x03, 0x40, 0x80, 0x7F, 0x00, 0x01, 0x06, 0x18, 0x00
];
const showCanvas = ref(null);
const showCanvasParent = ref(null);
const { width, height } = useElementSize(showCanvasParent);

function showPreview() {
  const ctx = showCanvas.value.getContext("2d");
  // 背景
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width.value, height.value);
  // 写字
  ctx.fillStyle = "#fff";
  ctx.font = "20px serif";
  // ctx.fillText("Hello world", 10, 50);

  ctx.fillStyle = "#f00";
  const x0 = 10;
  const y0 = 10;
  const h = 16;
  const w = 16;
  const size = 2;
  testData.forEach((item, index) => {
    const page = Math.floor(index / w);
    // console.log('page: ', page);
    const col = index % w;
    for (let i = 0; i < 8; i++) {
      const bit = (item >> i) & 0x01;
      if (bit) {
        ctx.fillRect(x0 + col * size, y0 + (page * 8 + i) * size, size, size);
      }
    }
  });

}

watch([width, height], () => {
  console.log(width.value, height.value);
  showCanvas.value.width = width.value;
  showCanvas.value.height = height.value;
  showPreview();
});

</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="container relative flex 2xl:mx-56 aspect-video flex-nowrap">
      <div class="p-5 border-2 border-gray-400 border-solid rounded-xl basis-1/2">
        <div class="flex flex-col h-full">
          <div class="bg-red-500 basis-2/4" ref="showCanvasParent">
            <canvas ref="showCanvas" id="showCanvas"></canvas>
          </div>
          <div class="bg-green-500 basis-2/4"></div>
        </div>

      </div>
      <div class="w-7"></div>
      <div class="border-2 border-gray-400 border-solid rounded-xl basis-1/2">
        <div class="flex flex-col h-full">
          <div class="bg-red-500 basis-2/4">
            <!-- <canvas ref="showCanvas2" id="showCanvas2"></canvas> -->
          </div>
          <div class="bg-green-500 basis-2/4"></div>
        </div>
      </div>
    </div>
  </div>
</template>
