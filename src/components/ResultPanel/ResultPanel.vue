<script setup>
import { onMounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core'
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { cpp } from '@codemirror/lang-cpp'
import useFontCreator from "@/components/FontCreator/useFontCreator";
import useSettingStore from "@/stores/useSettingStore";
import useResult from "./useResult";
const parent = ref(null)
const codePanel = ref(null)
const { width, height } = useElementSize(parent)
const { fonts, fontTemeplate } = useFontCreator();
const { fontSize } = useSettingStore();
const { glyphWithUTF8Array, fontGlyphWithUTF8Code, fontGlyphLen, fontGlyphWithUTF8Len, fontGlyphCode, } = useResult();
const code = ref("");

watch([width, height], () => {
    console.log('改变width.value', width.value);
    parent.value.style.width = width.value + 'px'
    parent.value.style.height = height.value + 'px'
})


watch([fonts, fontTemeplate], () => {
    let t = fontTemeplate.value.template;
    t = t.replaceAll('/*_w_*/', fontSize.value.width)
    t = t.replaceAll('/*_h_*/', fontSize.value.height)
    t = t.replaceAll('/*_font_len_*/', fontGlyphLen.value)
    t = t.replaceAll('/*_font_len_utf8_*/', fontGlyphWithUTF8Len.value)
    t = t.replaceAll('/*_font_data_*/', fontGlyphCode.value)
    t = t.replaceAll('/*_font_data_utf8_*/', fontGlyphWithUTF8Code.value)
    t = t.replaceAll('/*_len_*/', Object.keys(fonts.value).length)
    code.value = t;
})

</script>

<template>
    <div ref="parent" class="flex flex-row h-full overflow-auto bg-gray-400 ">
        <codemirror :style="{ height: '100%', width: '100%' }" class="flex-grow w-0" ref="codePanel" v-model="code"
            :extensions="[cpp(), oneDark]" />
    </div>
</template>

