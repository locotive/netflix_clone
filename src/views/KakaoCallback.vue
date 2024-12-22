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
  console.log('=== 카카오 콜백 디버깅 ===');
  console.log('현재 URL:', window.location.href);
  console.log('현재 pathname:', window.location.pathname);
  console.log('현재 search:', window.location.search);

  const code = new URL(window.location.href).searchParams.get('code');
  console.log('인증 코드:', code);

  if (code) {
    try {
      console.log('토큰 요청 시작...');
      console.log('요청 파라미터:', {
        client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
        code: code
      });

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

      console.log('토큰 응답 상태:', response.status);

      const responseData = await response.json();
      console.log('토큰 응답 데이터:', {
        token_type: responseData.token_type,
        expires_in: responseData.expires_in
      });

      if (!response.ok) {
        throw new Error(`토큰 요청 실패: ${response.status}`);
      }

      const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${responseData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`사용자 정보 요청 실패: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      console.log('사용자 정보 받음:', {
        id: userData.id,
        hasEmail: !!userData.kakao_account?.email
      });

      await authStore.kakaoLogin(responseData.access_token, userData);
      console.log('로그인 처리 완료');

      toast.success('카카오 로그인 성공!');
      router.push('/');
    } catch (error) {
      console.error('카카오 로그인 에러 상세:', {
        message: error.message,
        stack: error.stack
      });
      toast.error(error.message || '로그인 처리 중 오류가 발생했습니다.');
      router.push('/signin');
    }
  } else {
    console.error('인증 코드 없음. 현재 URL:', window.location.href);
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
