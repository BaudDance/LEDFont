<script setup>
import { computed, ref, watch } from 'vue';
import ModeItem from '../components/ModeItem.vue';
import useSettingStore from '@/stores/useSettingStore';
import useImageCreator from '@/components/ImageCreator/useImageCreator';
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { cpp } from '@codemirror/lang-cpp'
import { watchDebounced } from '@vueuse/core'
import usePreviewScreen from '@/components/PreviewScreen/usePreviewScreen';
const { imageSize, modeList, mode, color } = useSettingStore();
const { sourceImg, imgThreshold, imgTemplates, imgTemplate, imgName } = useImageCreator();
const { screenSize } = usePreviewScreen();
const threshold = ref(imgThreshold.value)
const proportional = ref(true) // 等比缩放
const width = computed({
    get() {
        return imageSize.value.width
    },
    set(v) {
        if (proportional.value) {
            imageSize.value.height = Math.round(v / sourceImg.value.width * sourceImg.value.height)
        }
        imageSize.value.width = v;
    }
})
const height = computed({
    get() {
        return imageSize.value.height
    },
    set(v) {
        if (proportional.value) {
            imageSize.value.width = Math.round(v / sourceImg.value.height * sourceImg.value.width)
        }
        imageSize.value.height = v;
    }
})

async function onUploadImg(event) {
    let file = event.target.files[0]
    console.log('file:', file)
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async (e) => {
        let image = new Image();
        image.onload = function () {
            // 缩放到预览屏幕大小
            if (image.width > screenSize.value.width || image.height > screenSize.value.height) {
                const scale = Math.min(screenSize.value.width / image.width, screenSize.value.height / image.height)
                imageSize.value = {
                    width: Math.round(image.width * scale),
                    height: Math.round(image.height * scale),
                }
            } else {
                imageSize.value = {
                    width: image.width,
                    height: image.height,
                }
            }
            sourceImg.value = image;
        }
        image.src = e.target.result;
        imgName.value = file.name.split('.')[0]
        console.log('image:', file.name)
    }
}
watchDebounced(threshold, async () => {
    imgThreshold.value = parseInt(threshold.value)
}, { debounce: 100, maxWait: 300 });


</script>

<template>
    <div class="flex">
        <div class="flex flex-col w-full">
            <div class="font-bold ">目标图片:</div>
            <div class="h-2"></div>
            <input type="file" class="w-full max-w-xs file-input file-input-sm file-input-bordered file-input-success"
                @change="onUploadImg" accept="image/gif,image/jpeg,image/jpg,image/png" />
        </div>
        <div class="w-10"></div>
        <div class="flex flex-col w-full">
            <div class="font-bold ">图片名称:</div>
            <div class="h-2"></div>
            <input type="text" class="w-full max-w-xs input input-bordered input-sm" v-model="imgName" />
        </div>
    </div>
    <div class="h-5"></div>

    <div class="flex items-baseline">
        <div class="font-bold ">生成大小: </div>
        <div class="w-3"></div>
        <div v-if="imageSize.width > screenSize.width || imageSize.height > screenSize.height"
            class="text-xs text-yellow-500">
            生成尺寸已超过屏幕尺寸
        </div>
    </div>
    <div class="h-2"></div>
    <div class="flex items-center gap-5">
        <div>宽:</div>
        <input type="number" v-model="width" class="w-full max-w-xs input input-bordered input-sm" />
        <div>高:</div>
        <input type="number" v-model="height" class="w-full max-w-xs input input-bordered input-sm" />
        <div class="flex-shrink-0 form-control">
            <label class="cursor-pointer label">
                <span class="label-text">等比缩放</span>
                <div class="w-2"></div>
                <input type="checkbox" v-model="proportional" class="checkbox checkbox-success checkbox-sm" />
            </label>
        </div>
    </div>

    <div class="h-5"></div>
    <div class="flex justify-between font-bold"><span>二值化阈值:</span><span>{{ threshold }}</span></div>
    <div class="h-2"></div>
    <input type="range" min="0" max="256" class="range range-xs" v-model="threshold" />
    <div></div>

    <div class="h-5"></div>
    <div class="font-bold ">取模方式:</div>
    <div class="h-2"></div>
    <div class="flex justify-between">
        <ModeItem v-for="m in modeList" :mode="m" :color="color" :selected="m == mode" @click="mode = m" :key="m + color" />
    </div>
    <div class="h-5"></div>
    <div class="font-bold ">阴阳码:</div>
    <div class="h-2"></div>
    <form class="flex gap-10">
        <div class="flex w-40" @click="color = '阳码'">
            <input type="radio" name="radio-5" class="radio radio-success" :checked="color == '阳码'" />
            <div class="mx-2">阳码</div>
        </div>
        <div class="flex w-40" @click="color = '阴码'">
            <input type="radio" name="radio-5" class="radio radio-success" :checked="color == '阴码'" />
            <div class="mx-2">阴码</div>
        </div>
    </form>
    <div class="h-5"></div>
    <div class="flex items-center font-bold ">
        <span>生成模板:</span>
        <div class="w-2"></div>
        <select class="w-full max-w-xs select select-bordered select-sm" v-model="imgTemplate">
            <option v-for="t in imgTemplates" :value="t" :key="t.name">{{ t.name }}</option>
        </select>
    </div>
    <div class="h-2"></div>
    <div style="width: 40rem;">
        <codemirror :style="{ height: '100%', width: '100%', }" ref="templatePanel" v-model="imgTemplate.template"
            :extensions="[cpp(), oneDark]" />
    </div>
    <div class="h-2"></div>
    <div class="text-xs underline cursor-pointer underline-offset-4" onclick="template_syntax_modal.showModal()">查看模板语法
    </div>
</template>