<script setup>
import { onMounted, ref, watch } from "vue";
import * as ccv from "@techstark/opencv-js";
import useFontCreator from "./useFontCreator";
import useSettingStore from "@/stores/useSettingStore";
const canvasRef = ref(null);
const debug = ref(true);
const { needText, fonts } = useFontCreator();
const { mode, fontSize, color, fontFace } = useSettingStore();



async function getFont(c) {
    console.log("getFont: ", c);
    const ctx = canvasRef.value.getContext("2d");
    const width = canvasRef.value.width;
    const height = canvasRef.value.height;

    // 清屏
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#FFF";
    ctx.font = `400px ${fontFace.value.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let text = ctx.measureText(c);
    ctx.fillText(c, 200, 200 + (text.actualBoundingBoxAscent - text.actualBoundingBoxDescent) / 2);

    const cv = await ccv;
    let mat = cv.imread("inputCanvas");
    let imgScaled = new cv.Mat();

    cv.resize(mat, imgScaled, new cv.Size(fontSize.value.width, fontSize.value.height), cv.INTER_AREA);
    cv.threshold(imgScaled, imgScaled, 127, 255, cv.THRESH_BINARY);

    const res = [];
    // 列行式
    if (mode.value == '列行式') {
        const page = ~~((fontSize.value.height + 7) / 8);
        for (let i = 0; i < page; i++) {
            for (let j = 0; j < fontSize.value.width; j++) {
                let v = 0;
                for (let k = 0; k < 8; k++) {
                    v += imgScaled.ucharPtr(i * 8 + k, j)[0] === 255 ? 1 << k : 0;
                }
                res.push(v);
            }
        }
    } else if (mode.value == '行列式') {
        const page = ~~((fontSize.value.width + 7) / 8);
        for (let i = 0; i < page; i++) {
            for (let j = 0; j < fontSize.value.height; j++) {
                let v = 0;
                for (let k = 0; k < 8; k++) {
                    v += imgScaled.ucharPtr(j, i * 8 + k)[0] === 255 ? 1 << k : 0;
                }
                res.push(v);
            }
        }
    } else if (mode.value == '逐列式') {
        const page = ~~((fontSize.value.height + 7) / 8);
        for (let j = 0; j < fontSize.value.width; j++) {
            for (let i = 0; i < page; i++) {
                let v = 0;
                for (let k = 0; k < 8; k++) {
                    v += imgScaled.ucharPtr(i * 8 + k, j)[0] === 255 ? 1 << k : 0;
                }
                res.push(v);
            }
        }
    } else if (mode.value == '逐行式') {
        const page = ~~((fontSize.value.width + 7) / 8);
        for (let j = 0; j < fontSize.value.height; j++) {
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

    return res;
}

function canvasInit() {
    const dpr = window.devicePixelRatio;
    const canvas = canvasRef.value;
    canvas.width = 400 * dpr;
    canvas.height = 400 * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
}

onMounted(async () => {
    canvasInit();
    watch([needText, fontSize, mode, color, fontFace], async () => {
        await fontFace.value.load();
        document.fonts.add(fontFace.value);
        const needList = [...new Set(needText.value.split(""))];
        const res = {};
        for (let i = 0; i < needList.length; i++) {
            const c = needList[i];
            const font = await getFont(c);
            res[c] = {
                width: fontSize.value.width,
                height: fontSize.value.height,
                data: font,
            };
            console.log("res: ", res);
        }
        fonts.value = res;
    }, { immediate: true, deep: true });
    // getFont('A')
    // draw();
});
</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <canvas ref="canvasRef" id="inputCanvas" style="width: 400px; height: 400px" class="border"></canvas>
        <canvas id="outputCanvas" style="width: 400px; height: 400px" class="border"></canvas>
    </div>
</template>
