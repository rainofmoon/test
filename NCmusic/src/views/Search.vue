<template>
    <SongList :song="songs"/>
</template>
<script setup>
import SongList from '@/components/SongList.vue';
import http from '@/http/axios';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()

const keyword = route.query.keyword
const songs = ref([])

const getSearch = async () => {
    if (!keyword) return
    try {
        const res = await http.get('/cloudsearch', {
            keywords: keyword
        })
        songs.value = res.result.songs?.map((t) => ({
            id: t.id,
            name: t.name,
            artist: (t.ar || t.artist || []).map((a) => a.name).join('/'),
            durationMs: t.dt || t.duration || 0,
            ablum: t.al?.name || []
        })) || []
        console.log(res)
    }catch(err){
        console.error(err)
    }
}
onBeforeMount(() => {
    getSearch()
})

</script>
<style>
.SongList{
    width: 800px;
}
</style>