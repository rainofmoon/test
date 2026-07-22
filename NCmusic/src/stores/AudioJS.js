import { defineStore } from "pinia";
import { ref, watch } from "vue";
import http from "@/http/axios";


export const useAudioPlayerStore = defineStore('audioplayerstore', () => {
    //
    const PlayList = ref([])
    //正在播放的歌曲
    const PlayingSong = ref()
    //
    const isplaying = ref(true)
    //
    const PlayListID = ref('')
    //
    const PlayingSongUrl = ref('')

    const setPlayList = (list) => {
        PlayList.value = list.song
        console.log(PlayList);

    }
    const setPlayingSong = (index) => {
        PlayingSong.value = PlayList.value[index]
        console.log(PlayingSong)
    }
    watch(PlayingSong,async (newSong) => {
        if(!newSong?.id) return
        const res = await http.get('/song/url',{
            id: newSong.id
        })
        console.log(res)
        PlayingSongUrl.value = res.data[0].url
        console.log(PlayingSongUrl)
    },{immediate:true})
    return {
        PlayingSong,
        PlayList,
        isplaying,
        PlayingSongUrl,
        setPlayList,
        setPlayingSong,
    }
})