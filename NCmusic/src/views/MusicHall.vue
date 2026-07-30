<template>
  <main class="content">
    <div class="personalized">
      <h4>推荐歌单</h4>
      <Listcard />
    </div>
    <div class="topList">
      <h4>热门榜单</h4>
      <div class="topList-nav">
        <nav class="nav-content">
          <div class="nav-container">
            <ul class="nav-types">
              <li class="nav-type" @click="change(index)" :class='currentIndex == index ? "active" : ""'
                v-for="(item, index) in topList" :key="item.id">{{ item.name }}</li>
              <div>
                <li class="more">更多>></li>
              </div>
            </ul>
          </div>
        </nav>
      </div>
      <div class="topList-SongList">
        <Songlist :song="songList" />
      </div>
    </div>
  </main>
</template>
<script setup>
import Listcard from '@/components/Listcard.vue';
import SongList from '@/components/SongList.vue';
import { onMounted, ref } from 'vue';
import http from '../http/axios';
import Songlist from '@/components/SongList.vue';

const topList = ref([])
const currentIndex = ref(0)
const songList = ref([])
const playlistDetails = ref([])

const fetchTopList = async () => {
  try {
    const res = await http.get('/toplist')
    const data = res.list.slice(0, 6)
    topList.value = data.map((item) => ({
      id: item.id,
      name: item.name,
      coverImgUrl: item.coverImgUrl,
      description: item.description
    }))
    await fetchPlaylistDetails(topList.value.map((item) => item.id))
  } catch (err) {
    console.error(err)
  }
}

const change = (index) => {
  currentIndex.value = index
}

const fetchPlaylistDetail = async (id) => {
  if (!id) return null
  try {
    const res = await http.get('/playlist/track/all', {
      id,
      limit: 10
    })
    console.log(res);
    const data = res.songs
    songList.value = data.map((item) => ({
      id: item.id,
      name:item.name,
      artist:(item.ar || item.artist || []).map((t) => t.name).join('/'),
      ablum:item.al?.name || [],
      durationMs:item.dt || 0,
      cover:item.al?.picUrl || []
    })
  )
  } catch (err) {
    console.error(err)
    return null
  }
}

const fetchPlaylistDetails = async (ids) => {
  if (!ids?.length) return
  const results = await Promise.allSettled(ids.map((id) => fetchPlaylistDetail(id)))
  playlistDetails.value = results.map((result, index) => ({
    id: ids[index],
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }))
  console.log('playlistDetails', playlistDetails.value)
}

onMounted(() => {
  fetchTopList()
})
</script>
<style scoped>
.content {
  height: 100%;
  margin: 0 auto;
  width: 800px;
}

h4 {
  margin: 8px 0;
}

.topList {
  width: 100%;
  margin-top: 10px;
}

.topList-nav {
  margin: 10px 0;
}

.nav-container {
  width: 100%;
  padding: 10px 0;
}

.nav-types,
.nav-type {
  font-size: 14px;
  width: auto;
}

.nav-types {
  list-style-type: none;
  background-color: white;
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
}

.nav-type {
  display: inline;
  border: none;
}

.more {
  border: none;
  color: rgb(102, 103, 103);
  float: right;
}

.nav-type:hover:not(.active) {
  background-color: #848383;
  color: white;
}

.active {
  background-color: #e70000;
  color: white;
}
</style>
