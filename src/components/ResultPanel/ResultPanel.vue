<script setup>
import { onMounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core'
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { cpp } from '@codemirror/lang-cpp'
import useFontCreator from "@/components/FontCreator/useFontCreator";
import useSettingStore from "@/stores/useSettingStore";
const parent = ref(null)
const codePanel = ref(null)
const { width, height } = useElementSize(parent)
const { fonts } = useFontCreator();
const { fontSize, template } = useSettingStore();
const code = ref("");



watch([width, height], () => {
    console.log('改变width.value', width.value);
    parent.value.style.width = width.value + 'px'
    parent.value.style.height = height.value + 'px'
})

const utf8Encoder = new TextEncoder();

watch(fonts, () => {
    let t = template.value;
    t = t.replaceAll('/*_w_*/', fontSize.value.width)
    t = t.replaceAll('/*_h_*/', fontSize.value.height)
    const fontlen = (fontSize.value.width * fontSize.value.height) / 8 + 4;
    t = t.replaceAll('/*_font_len_*/', fontlen)
    let data1 = ""
    Object.keys(fonts.value).forEach(key => {
        data1 += `/* ${key} */ {`
        const font = fonts.value[key];
        // 4位utf8编码
        const utf8 = utf8Encoder.encode(key);
        for (let i = 0; i < 4; i++) {
            data1 += `0x${(utf8[i] || 0).toString(16).padStart(2, '0')},`;
        }
        font.data.forEach((item) => {
            data1 += `0x${item.toString(16).padStart(2, '0')},`;
        });
        data1 += `},\n`;
    });
    t = t.replaceAll('/*_data1_*/', data1)
    t = t.replaceAll('/*_len_*/', Object.keys(fonts.value).length)
    code.value = t;
})

watch(fonts, () => {
    code.value = "";
    Object.keys(fonts.value).forEach(key => {
        code.value += '{'
        const font = fonts.value[key];
        // 4位utf8编码
        const utf8 = utf8Encoder.encode(key);
        for (let i = 0; i < 4; i++) {
            code.value += `0x${(utf8[i] || 0).toString(16).padStart(2, '0')},`;
        }
        font.data.map(i => `0x${i.toString(16).padStart(2, '0')}`).join(', ')
        code.value += font.data.map(i => `0x${i.toString(16).padStart(2, '0')}`).join(', ');

        code.value += `},//${key} \n`;
    });
}, { immediate: true })

</script>

<template>
    <div ref="parent" class="flex flex-row h-full overflow-auto bg-gray-400 ">
        <codemirror :style="{ height: '100%', width: '100%' }" class="flex-grow w-0" ref="codePanel" v-model="code"
            :extensions="[cpp(), oneDark]" />
    </div>
</template>

