import { defineStore } from "pinia";
import { ref, watch } from "vue";
import http from "@/http/axios";

export const useAudioPlayerStore = defineStore('audioplayerstore', () => {
    const PlayList = ref([])
    const PlayingSong = ref({})
    const PlayingId = ref('')
    const isplaying = ref(true)
    const PlayingSongUrl = ref('')
    const currentTime = ref(0)
    const duration = ref(0)
    const currentIndex = ref(-1)

    const setPlayList = (list) => {
        const songs = Array.isArray(list?.song) ? list.song : Array.isArray(list) ? list : []
        PlayList.value = songs

        if (!songs.length) {
            currentIndex.value = -1
            PlayingSong.value = null
            return
        }

        currentIndex.value = 0
        PlayingSong.value = songs[0]
        PlayingId.value = songs[0].id
    }

    const setPlayingSong = (index) => {
        if (!PlayList.value.length) return

        const safeIndex = (index + PlayList.value.length) % PlayList.value.length
        currentIndex.value = safeIndex
        PlayingSong.value = PlayList.value[safeIndex]
        PlayingId.value = PlayList.value[safeIndex]?.id || ''
    }

    const setCurrentSong = (song) => {
        if (!song?.id) return
        PlayingSong.value = song
        PlayingId.value = song.id
    }

    const play = () => {
        isplaying.value = true
    }

    const pause = () => {
        isplaying.value = false
    }

    const togglePlay = () => {
        isplaying.value = !isplaying.value
    }

    const playNext = () => {
        if (!PlayList.value.length) return
        const nextIndex = currentIndex.value + 1 >= PlayList.value.length ? 0 : currentIndex.value + 1
        setPlayingSong(nextIndex)
        play()
    }

    const playPrev = () => {
        if (!PlayList.value.length) return
        const prevIndex = currentIndex.value - 1 < 0 ? PlayList.value.length - 1 : currentIndex.value - 1
        setPlayingSong(prevIndex)
        play()
    }

    const setProgress = (time) => {
        currentTime.value = time
    }

    const setDuration = (time) => {
        duration.value = time
    }

    watch(PlayingSong, async (newSong) => {
        if (!newSong?.id) return

        currentTime.value = 0
        duration.value = 0
        PlayingSongUrl.value = ''

        try {
            const res = await http.get('/song/url', {
                id: newSong.id
            })
            const url = res?.data?.[0]?.url || res?.data?.url || ''
            PlayingSongUrl.value = url
        } catch (error) {
            console.error(error)
        }
    }, { immediate: true })

    return {
        PlayingSong,
        PlayList,
        isplaying,
        PlayingSongUrl,
        PlayingId,
        currentTime,
        duration,
        currentIndex,
        setPlayList,
        setPlayingSong,
        setCurrentSong,
        play,
        pause,
        togglePlay,
        playNext,
        playPrev,
        setProgress,
        setDuration,
    }
})