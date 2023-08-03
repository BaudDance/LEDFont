<script setup>
import { onMounted, ref, watch } from "vue";
import useFontCreator from "./useFontCreator";
import useSettingStore from "@/stores/useSettingStore";
import { watchDebounced } from "@vueuse/core";
const canvasRef = ref(null);
const debug = ref(true);
const { needText, fonts } = useFontCreator();
const { mode, fontSize, color, fontFace } = useSettingStore();



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
    // canvasInit();
    // watchDebounced([needText, fontSize, mode, color, fontFace], async () => {
    //     canvasInit()
    //     await fontFace.value.load();
    //     document.fonts.add(fontFace.value);
    //     const needList = [...new Set(needText.value.split(""))];
    //     const res = {};
    //     for await (let c of needList) {
    //         const font = await getGlyph(c);
    //         res[c] = {
    //             width: fontSize.value.width,
    //             height: fontSize.value.height,
    //             data: font,
    //         };
    //         console.log("res: ", res);
    //     }
    //     fonts.value = res;
    // }, { immediate: true, deep: true, debounce: 100, maxWait: 300 });

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
        <canvas ref="canvasRef" id="inputCanvas" style="width: 400px; height: 400px" class="border"></canvas>
        <canvas id="outputCanvas" style="width: 400px; height: 400px" class="border"></canvas>
    </div>
</template>
