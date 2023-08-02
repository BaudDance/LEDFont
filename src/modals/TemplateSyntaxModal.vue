<script setup>
import useSettingStore from '@/stores/useSettingStore';
import useResult from '@/components/ResultPanel/useResult';
const { fontSize, imageSize, source } = useSettingStore();
const { glyphWithUTF8Array, fontGlyphWithUTF8Code, fontGlyphLen, fontGlyphWithUTF8Len, fontGlyphCode, } = useResult();

</script>

<template>
    <dialog id="template_syntax_modal" class="modal">
        <form method="dialog" class="modal-box">
            <h3 class="text-lg font-bold">模板语法</h3>
            <p class="py-4">模板为标准C/C++代码, 其中以 /*_ 开头 _*/ 结尾的注释会被替换为对应的数据, 注释与数据的对应关系如下:</p>
            <div class="overflow-x-auto">
                <table class="table">
                    <!-- head -->
                    <thead>
                        <tr>
                            <th>注释</th>
                            <th>含义</th>
                            <th>当前值</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>/*_w_*/</td>
                            <td>生成字/图模的像素宽度</td>
                            <td>
                                {{ source == '字体取模' ? fontSize.width : imageSize.width }}
                            </td>
                        </tr>
                        <tr>
                            <td>/*_h_*/</td>
                            <td>生成字/图模的像素高度</td>
                            <td> {{ source == '字体取模' ? fontSize.height : imageSize.height }}
                            </td>
                        </tr>
                        <tr v-if="source == '字体取模'">
                            <td>/*_font_len_*/</td>
                            <td>一个字模占用的字节长度</td>
                            <td>{{ fontGlyphLen }}</td>
                        </tr>
                        <tr v-if="source == '字体取模'">
                            <td>/*_font_len_utf8_*/</td>
                            <td>带utf8编码的字模的字节长度</td>
                            <td>{{ fontGlyphWithUTF8Len }}</td>
                        </tr>
                        <tr v-if="source == '字体取模'">
                            <td>/*_font_data_*/</td>
                            <td>普通字模数据</td>
                            <td></td>
                        </tr>
                        <tr v-if="source == '字体取模'">
                            <td>/*_font_data_utf8_*/</td>
                            <td>带utf8编码的字模数据</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>