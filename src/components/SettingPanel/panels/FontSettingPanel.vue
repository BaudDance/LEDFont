<script setup>
import { computed } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { cpp } from '@codemirror/lang-cpp';
import ModeItem from '../components/ModeItem.vue';
import useSettingStore from '@/stores/useSettingStore';
import useFontCreator from '@/components/FontCreator/useFontCreator';
import useU8g2Font from '@/components/FontCreator/useU8g2Font';

const { fontSize, modeList, mode, color, fontFormat } = useSettingStore();
const { needText, fontTemplates, fontTemplate, fontFaces, fontFace } = useFontCreator();
const {
    fonts: u8g2Fonts,
    font: u8g2Font,
    sizeInput,
    arrayName,
    error,
    loading,
    fixedSize,
    sizeRange,
    commitSize,
} = useU8g2Font();

const currentFontface = computed({
    get() {
        return fontFace.value;
    },
    set(value) {
        if (value.width) {
            fontSize.value = { width: value.width, height: value.height };
        }
        fontFace.value = value;
    },
});
</script>

<template>
    <div class="tabs tabs-boxed mb-5">
        <a class="tab" :class="fontFormat === 'traditional' ? 'tab-active' : ''"
            @click="fontFormat = 'traditional'">传统字模</a>
        <a class="tab" :class="fontFormat === 'u8g2' ? 'tab-active' : ''" @click="fontFormat = 'u8g2'">压缩字模</a>
    </div>

    <template v-if="fontFormat === 'traditional'">
        <div class="flex items-baseline">
            <div class="font-bold">字体: </div>
            <div class="w-3"></div>
            <div v-if="!currentFontface.width && (fontSize.width < 20 || fontSize.height < 20)"
                class="text-xs text-yellow-500">
                字符尺寸20以下推荐使用点阵字体
            </div>
        </div>
        <div class="h-2"></div>
        <div class="flex items-center gap-5">
            <select class="w-full max-w-xs select select-bordered select-sm" v-model="currentFontface">
                <option v-for="fontItem in fontFaces" :value="fontItem" :key="fontItem.font">{{ fontItem.name }}</option>
            </select>
            <div>宽:</div>
            <div v-if="currentFontface.width" class="w-full tooltip tooltip-bottom tooltip-warning" data-tip="点阵字体无法调节大小">
                <input type="number" v-model="fontSize.width" class="w-full max-w-xs input input-bordered input-sm" disabled />
            </div>
            <div v-else class="w-full">
                <input type="number" v-model="fontSize.width" class="w-full max-w-xs input input-bordered input-sm" />
            </div>
            <div>高:</div>
            <div v-if="currentFontface.height" class="w-full tooltip tooltip-bottom tooltip-warning" data-tip="点阵字体无法调节大小">
                <input type="number" v-model="fontSize.height" class="w-full max-w-xs input input-bordered input-sm" disabled />
            </div>
            <div v-else class="w-full">
                <input type="number" v-model="fontSize.height" class="w-full max-w-xs input input-bordered input-sm" />
            </div>
        </div>
        <div class="h-5"></div>
        <div class="font-bold">取模方式:</div>
        <div class="h-2"></div>
        <div class="flex justify-between">
            <ModeItem v-for="modeItem in modeList" :mode="modeItem" :color="color" :selected="modeItem === mode"
                @click="mode = modeItem" :key="modeItem + color" />
        </div>
        <div class="h-5"></div>
        <div class="font-bold">阴阳码:</div>
        <div class="h-2"></div>
        <form class="flex gap-10">
            <div class="flex w-40" @click="color = '阳码'">
                <input type="radio" name="radio-5" class="radio radio-success" :checked="color === '阳码'" />
                <div class="mx-2">阳码</div>
            </div>
            <div class="flex w-40" @click="color = '阴码'">
                <input type="radio" name="radio-5" class="radio radio-success" :checked="color === '阴码'" />
                <div class="mx-2">阴码</div>
            </div>
        </form>
        <div class="h-5"></div>
        <div class="font-bold">需求文字:</div>
        <div class="h-2"></div>
        <textarea v-model="needText" class="textarea textarea-bordered"></textarea>
        <div class="h-5"></div>
        <div class="flex items-center font-bold">
            <span>生成模板:</span>
            <div class="w-2"></div>
            <select class="w-full max-w-xs select select-bordered select-sm" v-model="fontTemplate">
                <option v-for="template in fontTemplates" :value="template" :key="template.name">{{ template.name }}</option>
            </select>
        </div>
        <div class="h-2"></div>
        <div style="width: 40rem;">
            <codemirror :style="{ height: '100%', width: '100%' }" ref="templatePanel" v-model="fontTemplate.template"
                :extensions="[cpp(), oneDark]" />
        </div>
        <div class="h-2"></div>
        <div class="text-xs underline cursor-pointer underline-offset-4" onclick="template_syntax_modal.showModal()">
            查看模板语法
        </div>
    </template>

    <template v-else>
        <div class="font-bold">字体:</div>
        <div class="h-2"></div>
        <select class="w-full select select-bordered select-sm" v-model="u8g2Font">
            <option v-for="fontItem in u8g2Fonts" :value="fontItem" :key="fontItem.id">{{ fontItem.name }}</option>
        </select>
        <div class="h-5"></div>
        <div class="flex items-center gap-4">
            <div class="font-bold whitespace-nowrap">字号:</div>
            <input type="number" v-model="sizeInput" class="w-full input input-bordered input-sm"
                :disabled="fixedSize !== null" :min="sizeRange?.min" :max="sizeRange?.max" step="1"
                @change="commitSize" @blur="commitSize" @keyup.enter="commitSize" />
            <div v-if="sizeRange" class="text-xs text-gray-500 whitespace-nowrap">{{ sizeRange.min }}–{{ sizeRange.max }}</div>
        </div>
        <div class="h-5"></div>
        <div class="font-bold">需求文字:</div>
        <div class="h-2"></div>
        <textarea v-model="needText" class="w-full textarea textarea-bordered" maxlength="4096"></textarea>
        <div class="h-5"></div>
        <div class="font-bold">C 数组名（可选）:</div>
        <div class="h-2"></div>
        <input v-model="arrayName" class="w-full input input-bordered input-sm" maxlength="64"
            placeholder="留空则由服务端生成" />

        <div v-if="loading" class="mt-4 text-sm text-info">
            正在生成压缩字模；首次使用该字体变体时会先建立完整缓存，请稍候…
        </div>
        <div v-if="error" class="p-3 mt-4 text-sm rounded-lg bg-error/10 text-error">
            <div>{{ error.error || '压缩字模生成失败' }}</div>
            <ul v-if="error.details?.missing" class="mt-2 ml-5 list-disc">
                <li v-for="item in error.details.missing" :key="item.codepoint">
                    {{ item.character }}（{{ item.codepoint }}，{{ item.reason }}）
                </li>
            </ul>
        </div>
    </template>
</template>
