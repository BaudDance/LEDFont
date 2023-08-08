<script setup>
import ModeItem from '../components/ModeItem.vue';
import useSettingStore from '@/stores/useSettingStore';
import useFontCreator from '@/components/FontCreator/useFontCreator';
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { cpp } from '@codemirror/lang-cpp'
import { computed } from 'vue';
const { fontSize, modeList, mode, color, } = useSettingStore();
const { needText, fontTemplates, fontTemplate, fontFaces, fontFace } = useFontCreator();

const currentFontface = computed({
    get() {
        return fontFace.value;
    },
    set(v) {
        if (v.width) {
            fontSize.value = {
                width: v.width,
                height: v.height,
            }
        }
        fontFace.value = v;
    }
})
</script>

<template>
    <div class="flex items-baseline">
        <div class="font-bold ">字体: </div>
        <div class="w-3"></div>
        <div v-if="!currentFontface.width & (fontSize.width < 20 || fontSize.height < 20)" class="text-xs text-yellow-500">
            字符尺寸20以下推荐使用点阵字体
        </div>
    </div>
    <div class="h-2"></div>
    <div class="flex items-center gap-5">
        <select class="w-full max-w-xs select select-bordered select-sm" v-model="currentFontface">
            <option v-for="f in fontFaces" :value="f" :key="f.family">{{ f.name }}</option>
        </select>
        <div>宽:</div>
        <div v-if="currentFontface.width" class="w-full tooltip tooltip-bottom tooltip-warning" data-tip="点阵字体无法调节大小">
            <input type="number" v-model="fontSize.width" class="w-full max-w-xs input input-bordered input-sm" disabled />
        </div>
        <div v-else class="w-full">
            <input type="number" v-model="fontSize.width" class="w-full max-w-xs input input-bordered input-sm"
                :disabled="currentFontface.width" />
        </div>
        <div>高:</div>
        <div v-if="currentFontface.height" class="w-full tooltip tooltip-bottom tooltip-warning" data-tip="点阵字体无法调节大小">
            <input type="number" v-model="fontSize.height" class="w-full max-w-xs input input-bordered input-sm" disabled />
        </div>
        <div v-else class="w-full">
            <input type="number" v-model="fontSize.height" class="w-full max-w-xs input input-bordered input-sm" />
        </div>
    </div>
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
    <!-- <div class="font-bold ">取模走向:</div>
        <div class="h-2"></div>
        <form class="flex gap-10">
            <div class="flex w-40">
                <input type="radio" name="radio-5" class="radio radio-success" checked />
                <div class="mx-2">低位在前</div>
            </div>
            <div class="flex w-40">
                <input type="radio" name="radio-5" class="radio radio-success" />
                <div class="mx-2">高位在前</div>
            </div>
        </form> -->
    <div class="h-5"></div>
    <div class="font-bold ">需求文字:</div>
    <div class="h-2"></div>
    <textarea v-model="needText" class="textarea textarea-bordered"></textarea>
    <div class="h-5"></div>
    <div class="flex items-center font-bold ">
        <span>生成模板:</span>
        <div class="w-2"></div>
        <select class="w-full max-w-xs select select-bordered select-sm" v-model="fontTemplate">
            <option v-for="t in fontTemplates" :value="t" :key="t.name">{{ t.name }}</option>
        </select>
    </div>
    <div class="h-2"></div>
    <div style="width: 40rem;">
        <codemirror :style="{ height: '100%', width: '100%', }" ref="templatePanel" v-model="fontTemplate.template"
            :extensions="[cpp(), oneDark]" />
    </div>
    <div class="h-2"></div>
    <div class="text-xs underline cursor-pointer underline-offset-4" onclick="template_syntax_modal.showModal()">查看模板语法
    </div>
</template>