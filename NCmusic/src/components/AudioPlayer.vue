<template>
    <audio :src="PlayingSongUrl" autoplay controls></audio>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAudioPlayerStore } from '@/stores/AudioJS'

const usePlayer = useAudioPlayerStore()
const { PlayingSongUrl } = storeToRefs(usePlayer)
</script>
