<script setup>
import { onMounted, ref, watch } from 'vue';
import { useElementSize, watchDebounced } from '@vueuse/core'
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { cpp } from '@codemirror/lang-cpp'
import useFontCreator from "@/components/FontCreator/useFontCreator";
import useSettingStore from "@/stores/useSettingStore";
import useImageCreator from "@/components/ImageCreator/useImageCreator";
import useResult from "./useResult";
import { useClipboard } from "@vueuse/core";
const parent = ref(null)
const codePanel = ref(null)
const { width, height } = useElementSize(parent)
const { fonts, fontTemplate } = useFontCreator();
const { fontSize, source, imageSize, software } = useSettingStore();
const { fontGlyphWithUTF8Code, fontGlyphLen, fontGlyphWithUTF8Len, fontGlyphCode, imgGlyphCode } = useResult();
const { imgTemplate, imgGlyph, imgName } = useImageCreator();

const code = ref("");

const { copy } = useClipboard({ code })


watch([width, height], () => {
    parent.value.style.width = width.value + 'px'
    parent.value.style.height = height.value + 'px'
})


watchDebounced([source, fonts, fontTemplate, imgTemplate, imgGlyph, imgName], () => {
    if (source.value == '字体取模') {
        showFontCode()
    } else {
        showImageCode()
    }
}, { immediate: true, deep: true, debounce: 100, maxWait: 300 })


function showFontCode() {
    let t = fontTemplate.value.template;
    t = t.replaceAll('/*_w_*/', fontSize.value.width)
    t = t.replaceAll('/*_h_*/', fontSize.value.height)
    t = t.replaceAll('/*_font_len_*/', fontGlyphLen.value)
    t = t.replaceAll('/*_font_len_utf8_*/', fontGlyphWithUTF8Len.value)
    t = t.replaceAll('/*_font_data_*/', fontGlyphCode.value)
    t = t.replaceAll('/*_font_data_utf8_*/', fontGlyphWithUTF8Code.value)
    t = t.replaceAll('/*_len_*/', Object.keys(fonts.value).length)
    code.value = t;
}
function showImageCode() {
    let t = imgTemplate.value.template;
    t = t.replaceAll('/*_w_*/', imageSize.value.width)
    t = t.replaceAll('/*_h_*/', imageSize.value.height)
    t = t.replaceAll('/*_img_name_*/', imgName.value)
    t = t.replaceAll('/*_img_data_*/', imgGlyphCode.value)
    code.value = t;
}
</script>

<template>
    <div ref="parent" class="relative flex flex-row h-full overflow-auto bg-gray-400">
        <codemirror :style="{ height: '100%', width: '100%' }" class="flex-grow w-0" ref="codePanel" v-model="code"
            :extensions="[cpp(), oneDark]" />
        <button class="absolute lowercase bottom-5 right-5 btn btn-circle btn-success" @click="copy(code)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                class="w-6 h-6 stroke-white">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
            </svg>

        </button>
    </div>
</template>

