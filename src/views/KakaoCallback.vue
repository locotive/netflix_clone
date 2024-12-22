<template>
  <div>로그인 처리중...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

onMounted(async () => {
  const code = new URL(window.location.href).searchParams.get('code');

  if (code) {
    try {
      // 카카오 토큰 받기
      const response = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
          redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
          code: code,
        }),
      });

      const tokenData = await response.json();

      // 사용자 정보 가져오기
      const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      // store에 로그인 정보 저장
      authStore.kakaoLogin(tokenData.access_token, userData);

      toast.success('카카오 로그인 성공!');
      router.push('/');
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      toast.error('로그인 처리 중 오류가 발생했습니다.');
      router.push('/signin');
    }
  } else {
    toast.error('인증 코드가 없습니다.');
    router.push('/signin');
  }
});
</script>
