<template>
    <div class="SongList">
        <ul class="list-ul">
            <li class="list-li" v-for="(song, index) in songs.song" :key="song.id" @click="PlaySong(song.id,index)">
                <div class="list-index">
                    <span>{{ index + 1 }}</span>
                </div>
                <div class="list-content">
                    <div class="songname">
                        <span class="name-span">{{ song.name }}</span>
                        <div class="singer">
                            <span class="singer-Name">{{ song.artist }}</span>
                        </div>
                    </div>
                    <div class="list-extre">
                        <span class="song-ablum">《{{ song.ablum }}》</span>
                        <span class="song-duration">{{ SongsMS(song.durationMs) }}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup name="SongList">
import { useRouter } from 'vue-router'
import {useAudioPlayerStore} from '@/stores/AudioJS'

const songs = defineProps(['song'])
const router = useRouter()
const useAudior = useAudioPlayerStore()

const SongsMS = (MS) => {
    if (!MS) return '00:00'
    const times = Math.floor(MS / 1000)
    const m = Math.floor(times / 60)
    const s = times % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
const PlaySong = (id,index) => {
    if(!id) return
    router.push({
        name:'player',
        query:{id}
    })
    useAudior.setPlayList(songs)
    useAudior.setPlayingSong(index)
}

</script>

<style>
.list-ul,.list-li {
    border-radius: 5px;
    background-color: white;
    border: 1px solid rgb(232, 232, 232);
    width: 100%;
    list-style-type: none;
    align-items: center;
}
.list-li{
    display:flex;
    padding:5px;
}

.list-index {
    font-size: 12px;
    color: #999;
    margin: 5px;
}

.list-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.songname {
    margin: 0 15px;
    font-size: 14px;
}

.name-span {
    width: 250px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.singer-Name {
    width: 150px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.singer {
    font-size: 12px;
    color: #999;
    margin: 5px;

}

.list-extre {
    font-size: 12px;
    color: #999;
    display: flex;
}
.song-ablum{
     width: 150px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-right: 30px;
}
.song-duration{
    margin: 0 10px;
}
</style>