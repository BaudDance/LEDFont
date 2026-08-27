<script setup>
import { ref, onMounted, watch } from "vue";
import { useElementSize } from '@vueuse/core'
import useFontCreator from "../FontCreator/useFontCreator";
import useU8g2Font from "../FontCreator/useU8g2Font";
import useSettingStore from "@/stores/useSettingStore";
import useImageCreator from "@/components/ImageCreator/useImageCreator";
import usePreviewScreen from "./usePreviewScreen";
const showCanvas = ref(null);
const showCanvasParent = ref(null);
const { width, height } = useElementSize(showCanvasParent);

const { fonts, needText } = useFontCreator();
const { result: u8g2Result } = useU8g2Font();
const { imgGlyph, mask } = useImageCreator()
const { mode, source, fontFormat } = useSettingStore();

const { screenSize } = usePreviewScreen();

function showFontPreview() {
    if (fontFormat.value === 'u8g2') {
        showU8g2Preview();
        return;
    }
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

function showU8g2Preview() {
    const ctx = showCanvas.value.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width.value, height.value);
    const preview = u8g2Result.value?.preview;
    if (!preview) return;

    const scale = width.value / screenSize.value.width;
    const glyphs = new Map(preview.glyphs.map((glyph) => [glyph.char, glyph]));
    const decoded = new Map();
    ctx.fillStyle = "#fff";

    function bitmap(glyph) {
        if (!decoded.has(glyph.codepoint)) {
            const binary = atob(glyph.bitmap);
            decoded.set(glyph.codepoint, Uint8Array.from(binary, (char) => char.charCodeAt(0)));
        }
        return decoded.get(glyph.codepoint);
    }

    let x = 0;
    let baseline = preview.ascent;
    for (const character of preview.text) {
        if (character === '\n') {
            x = 0;
            baseline += preview.line_height;
            continue;
        }
        const glyph = glyphs.get(character);
        if (!glyph) continue;
        const advance = Math.max(0, glyph.advance);
        if (x > 0 && x + Math.max(advance, glyph.x_offset + glyph.width) > screenSize.value.width) {
            x = 0;
            baseline += preview.line_height;
        }
        const left = x + glyph.x_offset;
        const top = baseline - glyph.y_offset - glyph.height;
        const data = bitmap(glyph);
        for (let row = 0; row < glyph.height; row++) {
            for (let col = 0; col < glyph.width; col++) {
                const bit = row * glyph.width + col;
                if ((data[Math.floor(bit / 8)] >> (7 - bit % 8)) & 1) {
                    ctx.fillRect((left + col) * scale, (top + row) * scale, scale, scale);
                }
            }
        }
        x += advance;
    }

    ctx.fillStyle = "#000";
    for (let index = 0; index < width.value; index += scale) {
        ctx.fillRect(index, 0, 1.6, height.value);
    }
    for (let index = 0; index < height.value; index += scale) {
        ctx.fillRect(0, index, width.value, 1.6);
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

watch([width, height, fonts, imgGlyph, source, fontFormat, u8g2Result], () => {
    console.log(width.value, height.value);
    showCanvas.value.width = width.value;
    showCanvas.value.height = width.value / screenSize.value.width * screenSize.value.height;
    if (source.value == '字体取模') {
        showFontPreview();
    } else if (source.value == '图片取模') {
        showImagePreview();
    }
});

async function canvasClicked(e) {
    if (source.value == '图片取模') {
        const x = Math.floor(e.offsetX / width.value * screenSize.value.width);
        const y = Math.floor(e.offsetY / showCanvas.value.height * screenSize.value.height);
        console.log(mask.value)
        mask.value[`${x},${y}`] = !mask.value[`${x},${y}`];
        console.log('clicled', x, y)
        console.log('aaaa', y, e.offsetY, height.value, screenSize.value.height)
        console.log('mask', mask.value);
    }
}
// let isMouseDown = false;
// let last;
// async function canvasMouseDown(e) {
//     isMouseDown = true;
// }
// async function canvasMouseUp(e) {
//     isMouseDown = false;
// }
// async function canvasMouseMove(e) {
//     if (isMouseDown) {
//         const x = Math.floor(e.offsetX / width.value * screenSize.value.width);
//         const y = Math.floor(e.offsetY / showCanvas.value.height * screenSize.value.height);
//         if (last && last.x == x && last.y == y) return;
//         last = { x, y };
//         console.log(mask)
//         mask[`${x},${y}`] = !mask[`${x},${y}`];
//         console.log('clicled', x, y)
//         console.log('aaaa', y, e.offsetY, height.value, screenSize.value.height)
//         console.log('mask', mask);
//     }
// }
</script>

<template>
    <div ref="showCanvasParent">
        <canvas ref="showCanvas" id="showCanvas" @click="canvasClicked" @mousedown="canvasMouseDown"
            @mouseup="canvasMouseUp" @mousemove="canvasMouseMove"></canvas>
        <!-- <canvas ref="showCanvas" id="showCanvas" @click="canvasClicked" @mousedown="canvasMouseDown"
            @mouseup="canvasMouseUp" @mousemove="canvasMouseMove"></canvas> -->
    </div>
</template>
