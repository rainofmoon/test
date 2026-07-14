<template>
  <main class="content">
    <h4>推荐歌单</h4>
    <Listcard />
</main>
</template>
<script setup>
import Listcard from '@/components/Listcard.vue';
// import { onBeformount } from 'vue';
import http from '../http/axios';
//  onBeforeMount(() => {
//     http.get('/personalized', {
//         limit: 5
//     }
//     ).then(res => {
//         List.value = res.result;
//         console.log(List.value)
//     })
// })
</script>
<style scoped>
.content{
  height:100%;
  margin:0 auto;
  width:800px;
}
</style>
