<script setup>
import useLibraryStore from '@/stores/useLibraryStore';
import { watch } from 'vue';
const { libs, selectedLib } = useLibraryStore();

</script>

<template>
    <div class="flex flex-col h-full gap-5 p-5 overflow-auto">
        <div class="flex flex-row items-center flex-shrink-0 w-full min-h-25 p-2 rounded-lg shadow-lg cursor-default relative overflow-clip"
            v-for="item in libs" @click="selectedLib = item" :class="selectedLib == item ? 'neutral-focus' : 'bg-neutral'">
            <img v-if="item.img.startsWith('data:image')" :src="item.img" class="w-10 h-10 rounded-md" />
            <div v-else class="flex items-center justify-center w-10 h-10 text-lg text-white bg-orange-400 rounded-md">
                {{ item.img }}
            </div>
            <div class="w-3"></div>
            <div class="flex flex-col">
                <div class="text-lg text-white">{{ item.name }}</div>
                <div>{{ item.desc }}</div>
                <div>
                </div>
            </div>
            <div v-if="item.official" class="w-[4rem] h-[4rem] bg-orange-500 absolute right-[-2rem] top-[-2rem] transform rotate-45 flex items-end justify-center">
                <span class="text-white text-sm font-bold absolute ">官方</span>
            </div>
        </div>
    </div>
</template>