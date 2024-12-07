<script setup>
import useLibraryStore from '@/stores/useLibraryStore';
import { computed, watch } from 'vue';
import { Marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import { downloadLibrary } from '@/apis/library'
const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);
const { libs, libDetail, loadingDetail } = useLibraryStore();
const readme = computed(() => {
    if (!libDetail) return '';
    return marked.parse(libDetail.value.readme);
})

</script>

<template>
    <div class="w-full h-full">
        <div v-if="loadingDetail" class="flex items-center justify-center h-full">
            <span class="loading loading-infinity loading-lg text-success"></span>
        </div>
        <div v-else-if="!libDetail" class="flex items-center justify-center h-full text-lg"> 👈在左侧列表选择库以查看 </div>
        <div v-else class="flex flex-col w-full h-full">
            <div class="flex items-center w-full h-32">
                <img v-if="libDetail.img.startsWith('data:image')" :src="libDetail.img" class="w-20 h-20 rounded-md" />
                <div v-else class="flex items-center justify-center w-20 h-20 text-4xl text-white bg-orange-400 rounded-md">
                    {{ libDetail.img }}
                </div>
                <div class="w-5"></div>
                <div class="flex flex-col w-full gap-1 ">
                    <div class="flex items-center gap-3">
                        <div class="text-3xl ">{{ libDetail.name }}</div>
                        <kbd class="kbd">{{ libDetail.version }}</kbd>
                    </div>
                    <div class="flex justify-between w-full ">
                        <div>
                            <div>{{ libDetail.desc }}</div>
                            <div>作者: {{ libDetail.author.join(' ') }}</div>
                            <div v-for="l in libDetail.label" class="badge badge-outline mr-2">{{ l }}</div>

                        </div>
                        <div class="flex items-center gap-2">
                            <button class="w-24 btn btn-success btn-sm" @click="downloadLibrary(libDetail.id)">下载</button>
                            <a :href="libDetail.url" target="_blank" v-if="libDetail.url">
                                <label class="btn btn-square btn-ghost">
                                    <img src="/github.svg" class="w-7 h-7" />
                                </label>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
            <div class="tabs">
                <a class="tab tab-lifted tab-active">Readme</a>
                <!-- <a class="tab tab-lifted">font.c</a> -->
            </div>
            <div class="w-full h-full overflow-auto prose max-w-none" v-html="readme"></div>
        </div>
    </div>
</template>

<style>
@import "highlight.js/styles/atom-one-dark.css";
</style>