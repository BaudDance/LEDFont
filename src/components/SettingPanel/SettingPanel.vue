<script setup>
import useSettingStore from '@/stores/useSettingStore';
import FontSettingPanel from './panels/FontSettingPanel.vue';
import ImageSettingPanel from './panels/ImageSettingPanel.vue';
const { sourceList, source, mode } = useSettingStore();
</script>

<template>
    <div class="flex flex-col h-full px-5 pt-5">
        <div class="tabs tabs-boxed">
            <a class="tab" v-for="s in sourceList" :class="s == source ? 'tab-active' : ''" @click="source = s">{{ s
            }}</a>
        </div>
        <div class="h-4"></div>
        <FontSettingPanel v-if="source == '字体取模'" />
        <ImageSettingPanel v-else-if="source == '图片取模'" />
        <div class="flex-1"></div>
        <div class="flex mb-3 gap-x-2">
            <a href="https://github.com/BaudDance/LEDFont" target="_blank">
                <label class="btn btn-square btn-ghost">
                    <img src="/github.svg" class="w-7 h-7" />
                </label>
            </a>
            <a href="https://space.bilibili.com/6100925" target="_blank">
                <label class="btn btn-square btn-ghost">
                    <img src="/bilibili.svg" class="w-7 h-7" />
                </label>
            </a>
        </div>
    </div>
</template>