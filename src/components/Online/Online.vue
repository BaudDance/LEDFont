<script setup>
import { ref, watch } from 'vue';
import useOnline from './useOnline';

const { online } = useOnline();
</script>

<template>
    <div class="text-sm ">当前有{{ online.led }}名小伙伴正在与你一起调试</div>
</template>