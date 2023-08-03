<script setup>
import { onMounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core'
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
const { fontSize, source, imageSize } = useSettingStore();
const { fontGlyphWithUTF8Code, fontGlyphLen, fontGlyphWithUTF8Len, fontGlyphCode, imgGlyphCode } = useResult();
const { imgTemplate, imgGlyph, imgName } = useImageCreator();

const code = ref("");

const { copy } = useClipboard({ code })


watch([width, height], () => {
    console.log('改变width.value', width.value);
    parent.value.style.width = width.value + 'px'
    parent.value.style.height = height.value + 'px'
})


watch([source, fonts, fontTemplate, imgTemplate, imgGlyph, imgName], () => {
    if (source.value == '字体取模') {
        showFontCode()
    } else {
        showImageCode()
    }
})


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
        <button class="absolute lowercase bottom-5 right-5 btn btn-circle btn-sm btn-success" @click="copy(code)">
            <span class="text-xs">复制</span>
        </button>
    </div>
</template>

