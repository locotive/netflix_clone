# 🎬 Movie Streaming Demo Site

Vue.js를 사용하여 제작한 영화 스트리밍 데모 사이트입니다. TMDB API를 활용하여 영화 정보를 제공하며, Netflix와 유사한 UI/UX를 구현했습니다.

## 🚀 주요 기능

- **메인 페이지**
  - 배너 섹션 (Featured Movie)
  - 인기 영화 목록
  - 현재 상영작 목록
  - 평점 높은 영화 목록
  - 개봉 예정작 목록
  - 장르별 영화 목록

- **영화 검색 및 필터링**
  - 장르별 필터링
  - 평점 기반 필터링
  - 개봉년도 필터링

- **영화 상세 정보**
  - 포스터 및 배경 이미지
  - 영화 제목 및 설명
  - 평점 및 개봉일
  - 장르 정보

- **위시리스트**
  - 영화 찜하기/해제
  - Local Storage를 활용한 데이터 저장

## 🛠 기술 스택

- **Frontend**: Vue 3
- **상태 관리**: Pinia
- **API 통신**: Axios
- **스타일링**: SCSS, CSS
- **라우팅**: Vue Router
- **API**: TMDB API

## 📦 설치 및 실행

1. 저장소 클론
```bash
git clone [repository-url]
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 로그인
- http://localhost:5173/netflix_clone/
- 회원가입 시 입력한 비밀번호가 TMDB API 키로 사용됩니다
- 유효한 TMDB API 키를 비밀번호로 사용해주세요

5. 빌드
```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── assets/                    # 정적 파일
│   ├── styles/               # 스타일 파일
│   │   ├── components/      # 컴포넌트별 스타일
│   │   └── wishlist.scss    # 위시리스트 스타일
│   ├── base.css             # 기본 스타일
│   └── main.css             # 메인 스타일
│
├── components/               # Vue 컴포넌트
│   ├── home/                # 홈 페이지 컴포넌트
│   │   ├── BannerComponent.vue
│   │   ├── HomeComponent.vue
│   │   ├── HomeMainComponent.vue
│   │   ├── HomePopularComponent.vue
│   │   └── MovieRowComponent.vue
│   ├── search/              # 검색 관련 컴포넌트
│   │   ├── HomeSearchComponent.vue
│   │   └── MovieSearchComponent.vue
│   ├── sign-in/             # 로그인 관련 컴포넌트
│   │   └── SignInComponent.vue
│   └── views/               # 뷰 컴포넌트
│       ├── MovieGridComponent.vue
│       ├── MovieInfiniteScrollComponent.vue
│       ├── MovieTableView.vue
│       └── MovieWishlistComponent.vue
│
├── composables/              # 재사용 가능한 로직
│   ├── useMovieGrid.js
│   └── useMovieUtils.js
│
├── layouts/                  # 레이아웃 컴포넌트
│   └── HeaderComponent.vue
│
├── router/                   # 라우터 설정
│   └── index.js
│
├── services/                 # API 서비스
│   ├── api/
│   │   └── movieService.js
│   ├── cache/
│   │   └── cacheService.js
│   ├── apiService.js
│   ├── authService.js
│   ├── urlService.js
│   └── wishlistService.js
│
├── stores/                   # Pinia 스토어
│   └── movies.js
│
├── App.vue                   # 루트 컴포넌트
└── main.js                   # 앱 엔트리 포인트
├── ...
└── main.js
docs/
├── API.md          # API 문서
└── USER_GUIDE.md   # 사용자 가이드
```

## 🔒 환경 변수

프로젝트 실행을 위해 다음 환경 변수가 필요합니다:

- `VITE_TMDB_API_KEY`: TMDB API 키

## 📱 반응형 디자인

- 모바일 (< 768px)
- 태블릿 (768px - 1024px)
- 데스크톱 (> 1024px)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

MIT License

## 📚 문서
- [API 문서](docs/API.md)
- [사용자 가이드](docs/USER_GUIDE.md)
