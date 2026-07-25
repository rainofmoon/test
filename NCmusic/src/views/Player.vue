<template>
    <div class="Player-page">
        <div class="Page-content">
            <div class="content">
                <div class="content-left">
                    <div class="song-cover">
                        <img class="Cover" :src="songInfo.cover || ''" style="object-fit: cover;">
                    </div>
                </div>
                <div class="content-right">
                    <div class="song-extra">
                        <h3 class="song-title">{{ songInfo.name || '未知曲目' }}</h3>
                        <div class="artist-ablum">
                            <div class="artistor">{{ songInfo.artist || '未知歌手' }}</div>
                            <div class="ablum">《{{ songInfo.ablum || '未知专辑' }}》</div>
                        </div>
                    </div>
                    <div class="lyric">
                        <div class="lyric-content" v-for="(item, index) in songLyric" :key="index">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import http from '@/http/axios';
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useAudioPlayerStore } from '@/stores/AudioJS';

const route = useRoute()
const usePlayer = useAudioPlayerStore()
const { PlayingSongUrl, isplaying, currentTime, duration, PlayingId, PlayingSong } = storeToRefs(usePlayer)
const routeId = computed(() => route.query?.id || PlayingId.value)
const songInfo = computed(() => PlayingSong.value || {})

//歌词信息
const songLyric = ref([])

const fetchSongDetail = async (id) => {
    if (!id) return
    try {
        const res = await http.get('/song/detail', {
            ids: id
        })
        const detial = (res.songs || [])[0] || {}
        usePlayer.setCurrentSong({
            id,
            name: detial.name || '未知曲目',
            artist: (detial.ar || detial.artists || []).map((a) => a.name).join('/'),
            ablum: detial.al?.name || '未知专辑',
            cover: detial.al?.picUrl || ''
        })
        usePlayer.play()
    } catch (error) {
        console.error(error)
    }
}

const fetchlyric = async (id) => {
    if (!id) return    
    try {
        const res = await http.get('/lyric', {
            id
        })
        const Lyric = res.lrc?.lyric || ''
        songLyric.value = parseLyric(Lyric)
    } catch (err) {
        console.error(err);
    }
}

const parseLyric = (raw = '') => {
    return raw.split('\n')
        .map((item) => item.trim())
        .filter((item) => item)
        .map((item) => {
            const text = item.replace(/\[.*?\]/g, '').trim().replace(/[""]/, '').trim()
            return text
        })
}

watch(PlayingId,(newPlayingId) => {
    fetchlyric(newPlayingId)
})


onMounted(() => {
    if (routeId.value) {
        fetchSongDetail(routeId.value)
        fetchlyric(routeId.value)
    }
})

</script>

<style scoped>
.Player-page {
    background-color: #3b3b3b;
    width: 100%;
    height: 90vh;
}

.Page-content {
    width: 900px;
    height: 500px;
    margin: 40px auto;
    background-color: #272727;
    border-radius: 10px;
}

.content {
    display: flex;
    align-items: center;
    color: white;
}

.content-left {
    width: 50%;
    margin: 50px 30px;
    text-align: center;
}

.song-cover {
    width: 350px;
    height: 350px;
    margin: 0 auto;
}

.Cover {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.content-right {
    text-align: center;
    width: 50%;
    margin: 50px 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.song-extra {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.song-title {
    width: 300px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.artist-ablum {
    font-size: 12px;
    display: flex;
    color: #dedede;
    justify-content: center;
    margin: 10px auto;
}

.artistor,
.ablum {
    margin: 0 10px;
    width: 100px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.lyric {
    font-size: 14px;
    height: 300px;
    margin-top: 20px;
    overflow-y: scroll;

}

::-webkit-scrollbar {
    display: none;
}

.lyric-content {
    margin: 10px 0;
}


</style>