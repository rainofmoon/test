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
        <div class="SongList">
            <ul class="list-ul">
                <li class="list-li" v-for="(song, index) in songs" :key="song.id">
                    <div class="list-index">
                        <span>{{ index + 1 }}</span>
                    </div>
                    <div class="list-content">
                        <div class="songname">
                            <span>{{ song.name }}</span>
                            <div class="singer">
                                <span>{{ song.artist }}</span>
                            </div>
                        </div>
                        <div class="list-extre">
                            <span class="song-ablum">《{{ song.bend }}》</span>
                            <span>{{ SongsMS(song.durationMs) }}</span>
                        </div>
<<<<<<< HEAD
=======
                    </div>
                    <div class="list-extre">
                        <span>《{{ song.bend }}》</span>
                        <span>{{ SongsMS(song.durationMs) }}</span>
>>>>>>> 713a6a3b7cdb0b59e0d8312693b13e2ccb7bb9a5
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, computed, ref, watch } from 'vue';
import http from '@/http/axios';

const route = useRoute();

const playListId = route.query.id;

const playListDetail = ref({})
const songs = ref([])
const creator = ref({})
const songMS = ref()


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
<<<<<<< HEAD
            durationMs: t.dt || t.duration || 0,
=======
            durationMs: t.dt || t.duration || 0,
>>>>>>> 713a6a3b7cdb0b59e0d8312693b13e2ccb7bb9a5
            bend: t.al?.name || []
        })) || []
        console.log(res.playlist.tracks)
    } catch (err) {
        console.error(err)
    }
}

const SongsMS = (MS) => {
    if (!MS) return '00:00'
    const times = Math.floor(MS / 1000)
<<<<<<< HEAD
    const m = Math.floor(times / 60)
    const s = times % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
=======
    const m = Math.floor( times / 60)
    const s = times % 60
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
>>>>>>> 713a6a3b7cdb0b59e0d8312693b13e2ccb7bb9a5
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

ul li {
    border-radius: 5px;
    background-color: white;
    border: 1px solid rgb(232, 232, 232);
    width: 100%;
    list-style-type: none;
    padding: 5px 10px;
    display: flex;
    align-items: center;
}

.list-index {
    font-size: 12px;
    color: #999;
    margin: 5px;
}

.list-content{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.songname {
    margin: 0 15px;
    font-size: 14px;
}

.singer {
    font-size: 10px;
    color: #999;
    margin: 5px;
}

.list-extre {
    font-size: 12px;
    color: #999;
}
</style>