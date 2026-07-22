<template>
    <div class="ListPage">
        <div class="ListDescription">
            <div class="ListImg">
                <img :src="playListDetail.coverImgUrl">
            </div>
            <div class="ListDetail">
                <div class="listname">
                    <h2>{{ playListDetail.name }}</h2>
                </div>
                <div class="Listcreator">
                    <img :src="creator.avatarUrl">
                    <div>{{ creator.nickname }}</div>
                </div>
                <div class="description">{{ playListDetail.description }}</div>
            </div>
        </div>
        <!-- SongList组件，可以在 搜索 页面中复用 -->
        <SongList :song="songs"/>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, computed, ref, watch } from 'vue';
import http from '@/http/axios';
import SongList from '@/components/SongList.vue'

const route = useRoute();

const playListId = route.query.id;

const playListDetail = ref({})
const songs = ref([])
const creator = ref({})


const getListDetail = async () => {
    try {
        const res = await http.get('/playlist/detail', {
            id: playListId,
        })
        playListDetail.value = res.playlist
        creator.value = res.playlist.creator
        songs.value = res.playlist.tracks?.map((t) => ({
            id: t.id,
            name: t.name,
            artist: (t.ar || t.artist || []).map((a) => a.name).join('/'),
            durationMs: t.dt || t.duration || 0,
            ablum: t.al?.name || [],
            cover:t.al?.picUrl || []
        })) || []
    } catch (err) {
        console.error(err)
    }
}



onMounted(() => {
    getListDetail()
})

</script>

<style>
.ListPage {
    width: 800px;
    margin: 0 auto;
}

.ListDescription {
    width: 800px;
    display: flex;
    margin: 20px auto;
}

.ListImg img {
    width: 200px;
    height: 200px;
    margin: 0 20px;
}

.ListDetail {
    margin: 20px 0;
}

.Listcreator {
    display: flex;
    align-items: center;

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
}


</style>