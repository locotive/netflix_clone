<template>
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <div>로그인 처리중...</div>
  </div>
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
  console.log('=== 카카오 로그인 콜백 시작 ===');
  const code = new URL(window.location.href).searchParams.get('code');
  console.log('인증 코드:', code);
  console.log('Redirect URI:', import.meta.env.VITE_KAKAO_REDIRECT_URI);
  console.log('Client ID:', import.meta.env.VITE_KAKAO_CLIENT_ID);

  if (code) {
    try {
      console.log('토큰 요청 시작...');
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('토큰 요청 실패:', errorText);
        throw new Error('토큰 요청 실패');
      }

      const tokenData = await response.json();
      console.log('토큰 발급 성공');

      const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('사용자 정보 요청 실패');
      }

      const userData = await userResponse.json();
      await authStore.kakaoLogin(tokenData.access_token, userData);

      toast.success('카카오 로그인 성공!');
      router.push('/');
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      console.error('에러 상세:', error.message);
      toast.error(error.message || '로그인 처리 중 오류가 발생했습니다.');
      router.push('/signin');
    }
  } else {
    console.error('인증 코드 없음');
    toast.error('인증 코드가 없습니다.');
    router.push('/signin');
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2069ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
