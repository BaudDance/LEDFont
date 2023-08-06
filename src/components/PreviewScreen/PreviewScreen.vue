<script setup>
import { ref, onMounted, watch } from "vue";
import { useElementSize } from '@vueuse/core'
import useFontCreator from "../FontCreator/useFontCreator";
import useSettingStore from "@/stores/useSettingStore";
import useImageCreator from "@/components/ImageCreator/useImageCreator";
import usePreviewScreen from "./usePreviewScreen";
const showCanvas = ref(null);
const showCanvasParent = ref(null);
const { width, height } = useElementSize(showCanvasParent);

const { fonts, needText } = useFontCreator();
const { imgGlyph } = useImageCreator()
const { mode, source } = useSettingStore();

const { screenSize } = usePreviewScreen();

function showFontPreview() {
    console.log('showPreview:fonts', fonts.value);
    const ctx = showCanvas.value.getContext("2d");
    // 背景
    ctx.fillStyle = "#000";
    // ctx.fillStyle = "#495028";
    ctx.fillRect(0, 0, width.value, height.value);
    const size = width.value / screenSize.value.width;



    ctx.fillStyle = "#fff";
    // ctx.fillStyle = "#ff8040";
    function drawFont(font, x0, y0) {
        if (!font) return;
        const w = font.width;
        const h = font.height;
        if (mode.value == '列行式') {
            font.data.forEach((item, index) => {
                const page = Math.floor(index / w);
                const col = index % w;
                for (let i = 0; i < 8; i++) {
                    const bit = (item >> i) & 0x01;
                    if (bit && ((page * 8 + i) < h)) {
                        ctx.fillRect(x0 + col * size, y0 + (page * 8 + i) * size, size, size);
                    }
                }
            });
        } else if (mode.value == '行列式') {
            font.data.forEach((item, index) => {
                const page = Math.floor(index / h);
                const row = index % h;
                for (let i = 0; i < 8; i++) {
                    const bit = (item >> i) & 0x01;
                    if (bit && ((page * 8 + i) < w)) {
                        ctx.fillRect(x0 + (page * 8 + i) * size, y0 + row * size, size, size);
                    }
                }
            });
        } else if (mode.value == '逐列式') {
            const pageNum = Math.ceil(h / 8);
            font.data.forEach((item, index) => {
                const page = index % pageNum;
                const col = Math.floor(index / pageNum);
                for (let i = 0; i < 8; i++) {
                    const bit = (item >> i) & 0x01;
                    if (bit && ((page * 8 + i) < h)) {
                        ctx.fillRect(x0 + col * size, y0 + (page * 8 + i) * size, size, size);
                    }
                }
            });
        } else if (mode.value == '逐行式') {
            const pageNum = Math.ceil(w / 8);
            font.data.forEach((item, index) => {
                const page = index % pageNum;
                const row = Math.floor(index / pageNum);
                for (let i = 0; i < 8; i++) {
                    const bit = (item >> i) & 0x01;
                    if (bit && ((page * 8 + i) < w)) {
                        ctx.fillRect(x0 + (page * 8 + i) * size, y0 + row * size, size, size);
                    }
                }
            });
        }
    }

    let line = 0;
    let x0 = 0;
    let y0 = 0;
    console.log('needText', needText.value.split(""))
    needText.value.split("").forEach((key, index) => {
        const font = fonts.value[key];
        if (!font) return;
        drawFont(font, x0, y0);
        x0 += font.width * size;
        if (x0 + font.width * size > width.value) {
            line++;
            x0 = 0
            y0 += font.height * size;
        }
    });

    // 画网格
    ctx.fillStyle = "#000";
    for (let i = 0; i < width.value; i += size) {
        ctx.fillRect(i, 0, 1.6, height.value);
    }
    for (let i = 0; i < height.value; i += size) {
        ctx.fillRect(0, i, width.value, 1.6);
    }
}

function showImagePreview() {
    const ctx = showCanvas.value.getContext("2d");
    // 背景
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width.value, height.value);
    const size = width.value / screenSize.value.width;

    ctx.fillStyle = "#fff";
    function drawImage(image, x0, y0) {
        if (!image || !image.data) return;
        const w = image.width;
        const h = image.height;
        if (mode.value == '列行式') {
            image.data.forEach((item, index) => {
                const page = Math.floor(index / w);
                const col = index % w;
                for (let i = 0; i < 8; i++) {
                    const bit = (item >> i) & 0x01;
                    if (bit && ((page * 8 + i) < h)) {
                        ctx.fillRect(x0 + col * size, y0 + (page * 8 + i) * size, size, size);
                    }
                }
            });
        } else if (mode.value == '行列式') {
            image.data.forEach((item, index) => {
                const page = Math.floor(index / h);
                const row = index % h;
                for (let i = 0; i < 8; i++) {
                    const bit = (item >> i) & 0x01;
                    if (bit && ((page * 8 + i) < w)) {
                        ctx.fillRect(x0 + (page * 8 + i) * size, y0 + row * size, size, size);
                    }
                }
            });
        } else if (mode.value == '逐列式') {
            const pageNum = Math.ceil(h / 8);
            image.data.forEach((item, index) => {
                const page = index % pageNum;
                const col = Math.floor(index / pageNum);
                for (let i = 0; i < 8; i++) {
                    const bit = (item >> i) & 0x01;
                    if (bit && ((page * 8 + i) < h)) {
                        ctx.fillRect(x0 + col * size, y0 + (page * 8 + i) * size, size, size);
                    }
                }
            });
        } else if (mode.value == '逐行式') {
            const pageNum = Math.ceil(w / 8);
            image.data.forEach((item, index) => {
                const page = index % pageNum;
                const row = Math.floor(index / pageNum);
                for (let i = 0; i < 8; i++) {
                    const bit = (item >> i) & 0x01;
                    if (bit && ((page * 8 + i) < w)) {
                        ctx.fillRect(x0 + (page * 8 + i) * size, y0 + row * size, size, size);
                    }
                }
            });
        }
    }
    drawImage(imgGlyph.value, 0, 0)
    // 画网格
    ctx.fillStyle = "#000";
    for (let i = 0; i < width.value; i += size) {
        ctx.fillRect(i, 0, 1.6, height.value);
    }
    for (let i = 0; i < height.value; i += size) {
        ctx.fillRect(0, i, width.value, 1.6);
    }
}

watch([width, fonts, imgGlyph, source], () => {
    console.log(width.value, height.value);
    showCanvas.value.width = width.value;
    showCanvas.value.height = width.value / screenSize.value.width * screenSize.value.height;
    if (source.value == '字体取模') {
        showFontPreview();
    } else if (source.value == '图片取模') {
        showImagePreview();
    }
});
</script>

<template>
    <div ref="showCanvasParent">
        <canvas ref="showCanvas" id="showCanvas"></canvas>
    </div>
</template>