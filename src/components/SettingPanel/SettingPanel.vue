<script setup>
import { ref } from 'vue';
import ModeItem from './components/ModeItem.vue';
import useSettingStore from '@/stores/useSettingStore';
import useFontCreator from '@/components/FontCreator/useFontCreator';
const { fontSize, mode, color } = useSettingStore();
const { needText } = useFontCreator();
const modes = ['列行式', '行列式', '逐列式', '逐行式'];


</script>

<template>
    <div class="flex flex-col h-full px-5 pt-5">
        <div class="font-bold ">字体大小:</div>
        <div class="h-2"></div>
        <div class="flex gap-5">
            <div>宽:</div>
            <input type="number" v-model="fontSize.width" class="w-full max-w-xs input input-bordered input-sm" />
            <div>高:</div>
            <input type="number" v-model="fontSize.height" class="w-full max-w-xs input input-bordered input-sm" />
        </div>
        <div class="h-5"></div>
        <div class="font-bold ">取模方式:</div>
        <div class="h-2"></div>
        <div class="flex justify-between">
            <ModeItem v-for="m in modes" :mode="m" :color="color" :selected="m == mode" @click="mode = m" />
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
    </div>
</template>