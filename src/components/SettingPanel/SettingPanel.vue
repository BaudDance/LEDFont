<script setup>
import useSettingStore from '@/stores/useSettingStore';
import FontSettingPanel from './panels/FontSettingPanel.vue';
import ImageSettingPanel from './panels/ImageSettingPanel.vue';
const { sourceList, source, mode } = useSettingStore();
</script>

<template>
    <div class="flex flex-col px-5 pt-5">
        <div class="tabs tabs-boxed">
            <a class="tab" v-for="s in sourceList" :class="s == source ? 'tab-active' : ''" @click="source = s">{{ s
            }}</a>
        </div>
        <div class="h-4"></div>
        <FontSettingPanel v-if="source == '字体取模'" />
        <ImageSettingPanel class="" v-else-if="source == '图片取模'" />
    </div>
</template>