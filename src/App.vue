<script setup>
import SettingPanel from "./components/SettingPanel/SettingPanel.vue";
import FontCreator from "./components/FontCreator/FontCreator.vue";
import PreviewScreen from "./components/PreviewScreen/PreviewScreen.vue";
import ResultPanel from "./components/ResultPanel/ResultPanel.vue";
import ImageCreator from "./components/ImageCreator/ImageCreator.vue";
import TemplateSyntaxModal from "./modals/TemplateSyntaxModal.vue";

</script>

<template>
  <TemplateSyntaxModal />
  <!-- <FontCreator class="absolute top-0 invisible" /> -->
  <ImageCreator class="absolute top-0 invisible" />
  <div class="flex items-center justify-center h-screen">
    <div class="container relative flex 2xl:mx-56 aspect-video flex-nowrap" style="max-height: 90%;">
      <div class="overflow-y-auto border-2 border-gray-400 border-solid rounded-xl basis-1/2">
        <SettingPanel />
      </div>
      <div class="w-7"></div>
      <div class="p-5 border-2 border-gray-400 border-solid rounded-xl basis-1/2">
        <div class="flex flex-col h-full">
          <PreviewScreen class="basis-2/4" />
          <ResultPanel class="basis-2/4" />
        </div>
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
