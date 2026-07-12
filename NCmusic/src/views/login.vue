<template>
    <div class="loginpage">
        <div class="login-box">
            <div class="login-header">
                <h2>扫码登录网易云音乐</h2>
                <p>请使用网易云音乐APP扫码登录</p>
            </div>
            <div class="login-body">
                <div class="qrcode-box">
                    <template v-if="qrImg">
                        <img :src="qrImg" alt="二维码" />
                    </template>
                    <template v-else>
                        <span>正在加载二维码.....</span>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="loginpage">
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue';
import http from '@/http/axios';
import { useUserStore } from '@/stores/user';
import router from '@/router';

//创建useUserStore实例
const userStore = useUserStore();

const qrImg = ref('');

//二维码key值
const qr_key = ref('');

//设置二维码状态轮询
const qrCheckInterval = ref(null);

//获取二维码登录的key
const getQRkey = async () => {
    try {
        const res = await http.get('/login/qr/key')
        qr_key.value = res.data?.unikey || '';
        console.log(res)
    } catch (error) {
        console.error('获取二维码Key失败', error)
        qr_key.value = '';
    }
}

//获取二维码图片
const getQRcode = async (key) => {
    if (!key) return;

    try {
        const res = await http.get('/login/qr/create', {
            key: qr_key.value,
            qrimg: true,
            timestamp: Date.now(),
            ua: 'pc'
        })
        console.log(res)
        qrImg.value = res.data?.qrimg || '';
    } catch (err) {
        console.error(err)
        qrimg.value = ''
    }
}

//获取二维码扫码状态
const getQRcodeStatus = async (key) => {
    if (!key) return;
    if (qrCheckInterval.value) {
        clearInterval(qrCheckInterval.value)
    }
    qrCheckInterval.value = setInterval(async () => {
        try {
            const res = await http.get('login/qr/check', {
                key: qr_key.value,
                qrimg: true,
                timestamp: Date.now(),
                ua: 'pc'
            })
            console.log(res)

            //判断二维码扫描状态，800为二维码过期，801为待扫描，802为待确认，803为授权登陆成功
            if (res.code === 803) {
                clearInterval(qrCheckInterval.value)
                qrCheckInterval.value = null;
                //通过 ‘登录状态’接口 可以获取登录之后的用户信息
                const LoginStatus = await http.get('/login/status', {
                    timestamp: Date.now(),
                    ua: 'pc'
                })
                console.log(LoginStatus)
                //将用户信息存储到pinia中
                const profile = LoginStatus.data?.profile || {};
                console.log(profile)
                if (profile) {
                    userStore.setUser({
                        id:profile.userId,
                        nickname:profile.nickname,
                        avatar:profile.avatarUrl
                    })
                    router.go(-1)
                }
            }
        } catch (err) {
            console.error(err);
        }
    },4000)
}


//监听是否获取二维码key值，如果获取则调用getQRcode方法
watch(() => qr_key.value, (val) => {
    if (val) {
        getQRcode(val)
    }
})

watch(() => qrImg.value,(val) => {
    if(val && qr_key.value){
        getQRcodeStatus(qr_key.value)
    }
})

onBeforeMount(() => {
    getQRkey()
})
onUnmounted(() => {
    if(qrCheckInterval.value){
        clearInterval(qrCheckInterval.value);
        qrCheckInterval.value = null
    }
})

</script>

<style scoped>
.loginpage {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #959494;
}

.login-box {
    width: 400px;
    height: 300px;
}

.login-form {
    margin: auto;
    width: 300px;
    height: 200px;

}
</style>