<script setup>
import { onMounted, ref, watch } from "vue";
import * as ccv from "@techstark/opencv-js";
import useSettingStore from "@/stores/useSettingStore";
import useImageCreator from "./useImageCreator";
import { watchDebounced } from "@vueuse/core";
const canvasRef = ref(null);
const imgRef = ref(null);
const { mode, color, imageSize } = useSettingStore();
const { sourceImg, ledImg } = useImageCreator();


async function getGlyph() {
    console.log("getGlyph: ", sourceImg.value);
    const ctx = canvasRef.value.getContext("2d");
    const width = canvasRef.value.width;
    const height = canvasRef.value.height;

    // 清屏
    // ctx.fillStyle = "#000";
    // ctx.fillRect(0, 0, width, height);

    // 将sourceImg文件绘制到canvas上
    // ctx.drawImage(sourceImg.value, 0, 0, width, height);
    let img = document.createElement('img')
    img.src = sourceImg.value;

    img.onload = async () => {
        const canvas = canvasRef.value;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, img.width, img.height) // 清除画布
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const cv = await ccv;
        let mat = cv.imread("inputImgCanvas");
        let imgScaled = new cv.Mat();
        cv.resize(mat, imgScaled, new cv.Size(imageSize.value.width, imageSize.value.height), cv.INTER_CUBIC);
        cv.threshold(imgScaled, imgScaled, 157, 255, cv.THRESH_BINARY);
        cv.imshow("outputImgCanvas", imgScaled);
        const res = [];

        if (mode.value == '列行式') {
            const page = ~~((imageSize.value.height + 7) / 8);
            for (let i = 0; i < page; i++) {
                for (let j = 0; j < imageSize.value.width; j++) {
                    let v = 0;
                    for (let k = 0; k < 8; k++) {
                        v += imgScaled.ucharPtr(i * 8 + k, j)[0] === 255 ? 1 << k : 0;
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
                        v += imgScaled.ucharPtr(j, i * 8 + k)[0] === 255 ? 1 << k : 0;
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
                        v += imgScaled.ucharPtr(i * 8 + k, j)[0] === 255 ? 1 << k : 0;
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
                        v += imgScaled.ucharPtr(j, i * 8 + k)[0] === 255 ? 1 << k : 0;
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
        ledImg.value = {
            width: imageSize.value.width,
            height: imageSize.value.height,
            data: res,
        };
        const hex = res.map((v) => {
            let s = v.toString(16);
            if (s.length === 1) {
                s = "0" + s;
            }
            return "0x" + s;
        });
        console.log("hex: ", hex.join(", "));
        mat.delete();
        imgScaled.delete();
    };
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
    canvasInit();
    watchDebounced([mode, color, sourceImg], async () => {
        canvasInit()
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
