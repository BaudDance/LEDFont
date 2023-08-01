<script setup>
import { ref } from 'vue';
import ModeItem from '../components/ModeItem.vue';
import useSettingStore from '@/stores/useSettingStore';
import useFontCreator from '@/components/FontCreator/useFontCreator';
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { cpp } from '@codemirror/lang-cpp'
const { fontSize, modeList, mode, color, fontFaces, fontFace, template } = useSettingStore();
const { needText } = useFontCreator();
</script>

<template>
    <div class="font-bold ">字体:</div>
    <div class="h-2"></div>
    <div class="flex items-center gap-5">
        <select class="w-full max-w-xs select select-bordered select-sm" v-model="fontFace">
            <option v-for="f in fontFaces" :value="f" :key="f.family">{{ f.family }}</option>
        </select>
        <div>宽:</div>
        <input type="number" v-model="fontSize.width" class="w-full max-w-xs input input-bordered input-sm" />
        <div>高:</div>
        <input type="number" v-model="fontSize.height" class="w-full max-w-xs input input-bordered input-sm" />
    </div>
    <div class="h-5"></div>
    <div class="font-bold ">取模方式:</div>
    <div class="h-2"></div>
    <div class="flex justify-between">
        <ModeItem v-for="m in modeList" :mode="m" :color="color" :selected="m == mode" @click="mode = m" />
    </div>
    <div class="h-5"></div>
    <div class="font-bold ">阴阳码:</div>
    <div class="h-2"></div>
    <form class="flex gap-10">
        <div class="flex w-40" @click="color = '阴码'">
            <input type="radio" name="radio-5" class="radio radio-success" :checked="color == '阴码'" />
            <div class="mx-2">阴码</div>
        </div>
        <div class="flex w-40" @click="color = '阳码'">
            <input type="radio" name="radio-5" class="radio radio-success" :checked="color == '阳码'" />
            <div class="mx-2">阳码</div>
        </div>
    </form>
    <div class="h-5"></div>
    <div class="font-bold ">需求文字:</div>
    <div class="h-2"></div>
    <textarea v-model="needText" class="textarea textarea-bordered"></textarea>
    <div class="h-5"></div>
    <div class="font-bold ">生成模板:</div>
    <div class="h-2"></div>
    <div style="width: 40rem;">
        <codemirror :style="{ height: '100%', width: '100%', }" ref="templatePanel" v-model="template"
            :extensions="[cpp(), oneDark]" />
    </div>
</template>