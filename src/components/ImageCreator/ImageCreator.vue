<script setup>
import { onMounted, ref, watch } from "vue";
import * as ccv from "@techstark/opencv-js";
import useSettingStore from "@/stores/useSettingStore";
import useImageCreator from "./useImageCreator";
import { watchDebounced } from "@vueuse/core";
const canvasRef = ref(null);
const imgRef = ref(null);
const { mode, color, imageSize } = useSettingStore();
const { sourceImg, imgGlyph, imgThreshold } = useImageCreator();


async function getGlyph() {
    let img = sourceImg.value;
    if (!img) return;
    const width = imageSize.value.width;
    const height = imageSize.value.height;
    const canvas = canvasRef.value;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvasRef.value.getContext("2d");

    ctx.clearRect(0, 0, width, height) // 清除画布
    ctx.drawImage(img, 0, 0, width, height)

    let canvasImg = ctx.getImageData(0, 0, width, height);
    // 二值化
    for (let i = 0; i < canvasImg.data.length; i += 4) {
        const r = canvasImg.data[i];
        const g = canvasImg.data[i + 1];
        const b = canvasImg.data[i + 2];
        const gray = ~~(r * 0.3 + g * 0.59 + b * 0.11);
        const v = gray > imgThreshold.value ? 255 : 0;
        canvasImg.data[i] = v;
        canvasImg.data[i + 1] = v;
        canvasImg.data[i + 2] = v;
    }
    ctx.putImageData(canvasImg, 0, 0);

    const res = [];

    if (mode.value == '列行式') {
        const page = ~~((imageSize.value.height + 7) / 8);
        for (let i = 0; i < page; i++) {
            for (let j = 0; j < imageSize.value.width; j++) {
                let v = 0;
                for (let k = 0; k < 8; k++) {
                    v += canvasImg.data[(i * 8 + k) * width * 4 + j * 4] === 255 ? 1 << k : 0;
                }
                res.push(v);
            }
        }
    } else if (mode.value == '行列式') {
        const page = ~~((imageSize.value.width + 7) / 8);
        for (let i = 0; i < page; i++) {
            for (let j = 0; j < imageSize.value.height; j++) {
                let v = 0;
                for (let k = 0; k < 8; k++) {
                    v += canvasImg.data[j * width * 4 + (i * 8 + k) * 4] === 255 ? 1 << k : 0;
                }
                res.push(v);
            }
        }
    } else if (mode.value == '逐列式') {
        const page = ~~((imageSize.value.height + 7) / 8);
        for (let j = 0; j < imageSize.value.width; j++) {
            for (let i = 0; i < page; i++) {
                let v = 0;
                for (let k = 0; k < 8; k++) {
                    v += canvasImg.data[(i * 8 + k) * width * 4 + j * 4] === 255 ? 1 << k : 0;
                }
                res.push(v);
            }
        }
    } else if (mode.value == '逐行式') {
        const page = ~~((imageSize.value.width + 7) / 8);
        for (let j = 0; j < imageSize.value.height; j++) {
            for (let i = 0; i < page; i++) {
                let v = 0;
                for (let k = 0; k < 8; k++) {
                    v += canvasImg.data[j * width * 4 + (i * 8 + k) * 4] === 255 ? 1 << k : 0;
                }
                res.push(v);
            }
        }
    }

    if (color.value == '阳码') {
        res.forEach((v, i) => {
            res[i] = ~v & 0xff;
        });
    }
    imgGlyph.value = {
        width: imageSize.value.width,
        height: imageSize.value.height,
        data: res,
    };
    // const hex = res.map((v) => {
    //     let s = v.toString(16);
    //     if (s.length === 1) {
    //         s = "0" + s;
    //     }
    //     return "0x" + s;
    // });
    // console.log("hex2: ", hex.join(", "));

}

function canvasInit() {
    const dpr = window.devicePixelRatio;
    const canvas = canvasRef.value;
    // canvas.width = 16;
    // canvas.height = 16;
    canvas.width = 1000 * dpr;
    canvas.height = 1000 * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
}

onMounted(async () => {
    // canvasInit()
    watchDebounced([mode, color, sourceImg, imageSize, imgThreshold], async () => {
        getGlyph()
    }, { immediate: true, deep: true, debounce: 100, maxWait: 300 });

});
async function download() {
    // canvasRef.value.toBlob((blob) => {
    //     const a = document.createElement("a");
    //     a.href = URL.createObjectURL(blob);
    //     a.download = "font.bmp";
    //     a.click();
    // });
}
</script>

<template>
    <div class="flex items-center justify-center h-screen" @click="download">
        <img ref="imgRef" />
        <canvas ref="canvasRef" id="inputImgCanvas" class="border"></canvas>
        <canvas id="outputImgCanvas" style="width: 400px; height: 400px" class="border"></canvas>
    </div>
</template>
