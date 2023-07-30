<script setup>
import { ref, onMounted, defineProps } from "vue";
import { delay } from "@/utils/time";
// 模式选项: 列行式 | 行列式 | 逐列式 | 逐行式 
const { mode, selected, color } = defineProps({ mode: String, selected: Boolean, color: String })
const emit = defineEmits(['click'])
const canvas = ref(null);
const lineWidth = 0.3;

async function draw() {
    const ctx = canvas.value.getContext("2d");
    const width = canvas.value.width;
    const height = canvas.value.height;
    const cubeSize = width / 12;
    console.log(width, height);
    // 背景
    ctx.fillStyle = color == '阴码' ? "#000" : "#fff";
    ctx.fillRect(0, 0, 60, 60);
    // 画网格
    ctx.fillStyle = "#0F0";
    for (let i = 0; i < width; i += cubeSize) {
        ctx.fillRect(i - (lineWidth / 2), 0, lineWidth, height);
    }
    for (let i = 0; i < height; i += cubeSize) {
        ctx.fillRect(0, i - (lineWidth / 2), width, lineWidth);
    }
    ctx.fillStyle = color == '阴码' ? "#fff" : "#000";
    const y0 = 0;
    const x0 = 0;
    if (mode == "列行式") {
        for (let y0 = 0; y0 < height; y0 += cubeSize * 8) {
            for (let x = 0; x < width; x += cubeSize) {
                for (let y = y0; y < y0 + 8 * cubeSize && y < height; y += cubeSize) {
                    ctx.fillRect(x, y, cubeSize - lineWidth, cubeSize - lineWidth);
                    await delay(150);
                }
            }
        }
    } else if (mode == '行列式') {
        for (let x0 = 0; x0 < width; x0 += cubeSize * 8) {
            for (let y = 0; y < height; y += cubeSize) {
                for (let x = x0; x < x0 + 8 * cubeSize && x < width; x += cubeSize) {
                    ctx.fillRect(x, y, cubeSize - lineWidth, cubeSize - lineWidth);
                    await delay(150);
                }
            }
        }
    } else if (mode == '逐列式') {
        for (let x = 0; x < width; x += cubeSize) {
            for (let y = 0; y < height; y += cubeSize) {
                ctx.fillRect(x, y, cubeSize - lineWidth, cubeSize - lineWidth);
                await delay(150);
            }
        }
    } else if (mode == '逐行式') {
        for (let y = 0; y < height; y += cubeSize) {
            for (let x = 0; x < width; x += cubeSize) {
                ctx.fillRect(x, y, cubeSize - lineWidth, cubeSize - lineWidth);
                await delay(150);
            }
        }
    }
    draw();
}


function choose() {
    emit('click', mode);
}

onMounted(() => {
    draw();
});



</script>
<template>
    <div class="flex flex-col items-center p-1 rounded cursor-default" :class="selected ? 'bg-slate-600' : ''"
        @click="choose">
        <div>
            <canvas ref="canvas" width="60" height="60"></canvas>
        </div>
        <div class="h-1"></div>
        <div>{{ mode }}</div>
    </div>
</template>