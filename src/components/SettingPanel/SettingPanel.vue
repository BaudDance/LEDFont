<script setup>
import useSettingStore from '@/stores/useSettingStore';
import FontSettingPanel from './panels/FontSettingPanel.vue';
import ImageSettingPanel from './panels/ImageSettingPanel.vue';
const { sourceList, source, mode } = useSettingStore();
</script>

<template>
    <div class="flex flex-col px-5 pt-5">
        <div class="tabs tabs-boxed">
            <a class="tab" v-for="s in sourceList" :class="s == source ? 'tab-active' : ''" @click="source = s">{{ s }}</a>
        </div>
        <div class="h-4"></div>
        <FontSettingPanel v-if="source == '字体取模'" />
        <ImageSettingPanel v-else-if="source == '图片取模'" />
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