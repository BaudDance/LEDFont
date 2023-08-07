<script setup>
import SettingPanel from "./components/SettingPanel/SettingPanel.vue";
import FontCreator from "./components/FontCreator/FontCreator.vue";
import PreviewScreen from "./components/PreviewScreen/PreviewScreen.vue";
import ResultPanel from "./components/ResultPanel/ResultPanel.vue";
import ImageCreator from "./components/ImageCreator/ImageCreator.vue";
import TemplateSyntaxModal from "./modals/TemplateSyntaxModal.vue";
import useSettingStore from "./stores/useSettingStore";
import { watch } from "vue";
import LibListPanel from "./components/LibListPanel/LibListPanel.vue";
import LibDetailPanel from "./components/LibDetailPanel/LibDetailPanel.vue";

const { software } = useSettingStore();
watch(software, () => {
  console.log('software', software.value);

})
</script>

<template>
  <TemplateSyntaxModal />
  <!-- <FontCreator class="absolute top-0 invisible" /> -->
  <ImageCreator class="absolute top-0 invisible" />
  <div class="flex items-center justify-center h-screen ">
    <div class="container relative flex 2xl:mx-56 aspect-video flex-nowrap" style="max-height: 90%;">
      <div class="absolute -top-8 tabs ">
        <a class="tab tab-lifted" :class="software == '取模助手' ? 'tab-active' : ''" @click="software = '取模助手'">取模助手</a>
        <div class="tooltip tooltip-error" data-tip="这可是个好东西">
          <a class="tab tab-lifted" :class="software == '驱动库' ? 'tab-active' : ''" @click="software = '驱动库'">驱动库</a>
        </div>
      </div>
      <div v-if="software == '取模助手'" class="overflow-y-auto border-2 border-gray-400 border-solid rounded-xl basis-1/2">
        <SettingPanel />
      </div>
      <div v-if="software == '取模助手'" class="w-7"></div>
      <div v-if="software == '取模助手'" class="p-5 border-2 border-gray-400 border-solid rounded-xl basis-1/2">
        <div class="flex flex-col h-full">
          <PreviewScreen class="basis-2/4" />
          <ResultPanel class="basis-2/4" />
        </div>
      </div>
      <div v-if="software == '驱动库'" class="overflow-y-auto border-2 border-gray-400 border-solid rounded-xl basis-1/3">
        <LibListPanel />
      </div>
      <div v-if="software == '驱动库'" class="w-7"></div>
      <div v-if="software == '驱动库'" class="p-5 border-2 border-gray-400 border-solid rounded-xl basis-2/3">
        <LibDetailPanel />
      </div>

    </div>
  </div>
</template>

<style>
body {
  height: 100vh;
  overflow: hidden;
}
</style>
