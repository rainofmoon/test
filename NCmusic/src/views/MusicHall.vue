<template>
  <main class="content">
    <div class="personalized">
      <h4>推荐歌单</h4>
      <Listcard :list="List" />
    </div>
    <div class="topList">
      <h4>热门榜单</h4>
      <div class="topList-nav">
        <nav class="nav-content">
          <div class="nav-container">
            <ul class="nav-types">
              <li class="nav-type" @click="change(index)" :class='currentIndex == index ? "active" : ""'
                v-for="(item, index) in topList" :key="item.id">{{ item.name }}</li>
              <li class="more">更多>></li>
            </ul>
            <div class="topList-SongList">
              <Songlist :song="songList[currentIndex]" />
              <div class="topList-bottm">
                <span class="moresong" @click="toPlayer()">全部歌曲</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </main>
</template>
<script setup>
import Listcard from '@/components/Listcard.vue';
import { onBeforeMount, onMounted, ref } from 'vue';
import http from '../http/axios';
import Songlist from '@/components/SongList.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

//推荐歌单
const List = ref([])
//榜单
const topList = ref([])
const currentIndex = ref(0)
const songList = ref([])
const ListID = ref()

const fetchPersonalized = async () => {
  try {
    const res = await http.get('personalized', {
      limit: 5
    })
    List.value = res.result.map((item) => ({
      id: item.id,
      name: item.name,
      coverImgUrl: item.picUrl,
    }))
    console.log(List)
  } catch (err) {
    console.error(err)
  }
}

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
    await Promise.allSettled(topList.value.map((item) => fetchPlaylistDetail(item.id)))
  } catch (err) {
    console.error(err)
  }
}

const change = (index) => {
  console.log(index)
  currentIndex.value = index
  ListID.value = topList.value[index].id
}

const fetchPlaylistDetail = async (id) => {
  if (!id) return null
  try {
    const res = await http.get('/playlist/track/all', {
      id,
      limit: 10
    })
    const data = res.songs
    const songs = data.map((item) => ({
      id: item.id,
      name: item.name,
      artist: item.ar.map((ar) => ar.name).join('/'),
      durationMs: item.dt,
      ablum: item.al.name,
      cover: item.al.picUrl
    }))
    songList.value.push(songs)
  } catch (err) {
    console.error(err)
    return null
  }
}
const toPlayer = () => {
  console.log(ListID.value)
  if (!ListID.value) return
  router.push({
    name: 'musiclist',
    query: { id: ListID.value }
  })
}
onMounted(() => {
  fetchPersonalized()
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
  padding: 10px;
}

.topList-nav {
  margin: 10px 0;
  background-color: none;
}

.nav-container {
  width: 100%;
}

.nav-types,
.nav-type {
  font-size: 14px;
  width: auto;
  padding: 10px;
  border-radius: 5px;
}

.nav-types {
  list-style-type: none;
  background-color: white;
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
  display: inline;
  padding: 10px;

}

.nav-type:hover:not(.active) {
  background-color: #848383;
  color: white;
}

.active {
  background-color: #e70000;
  color: white;
}

.topList-bottm {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #ffffff;
  display: flex;
}

.moresong {
  width: 100%;
  text-align: center;
}
</style>
