<template>
  <header>
    <!-- ヘッダー上部 -->
    <div id="header-upper" class="d-flex align-items-center justify-content-between">
      <!-- ヘッダーロゴ -->
      <h1>
        <div v-if="!searching && !toGenre &&!comicFrames">
          <a href="#">漫画紹介サイト</a>
        </div>
        <div v-else-if="searching && !toGenre && !comicFrames">
          <button id="header-logo" @click="returnTopFromSearch">漫画紹介サイト</button>
        </div>
        <div v-else-if="!searching && toGenre && !comicFrames">
          <button id="header-logo" @click="returnTopFromGenre">漫画紹介サイト</button>
        </div>
        <div v-else-if="!searching && !toGenre && comicFrames">
          <button id="header-logo" @click="returnTopFromComicFrames">漫画紹介サイト</button>
        </div>
      </h1>

      <!-- ヘッダー上部右側 -->
      <div
        id="header-right"
        :class="{ 'searching-or-to-genre-upper': searching || toGenre }"
        class="d-flex justify-content-end align-items-center"
      >
        <!-- 検索orジャンル別表示時ヘッダー上部ボタン -->
        <div v-if="searching || toGenre || comicFrames" id="header-right-buttons">
          <div v-if="currentUID === null">
            <button
              class="general-button"
              type="button"
              @click="showLoginScreen"
            >
              管理者ログイン
            </button>
          </div>
          <div v-else class="d-flex justify-content-between align-items-center">
            <comic-registration-modal
              :comics="comics"
              @add-comic="addComic"
            >
            </comic-registration-modal>
            <button
              id="log-out"
              class="general-button"
              type="button"
              @click="logOut"
            >
              ログアウト
            </button>
          </div>
        </div>

        <!-- 検索ボックス -->
        <nav id="nav-right" class="d-flex">
          <form
            @submit.prevent="searchHandler"
            class="search-box d-flex align-items-center"
          >
            <input
              id="header-search-field"
              v-model="comicOrAuthor"
              type="search"
              name="search"
              placeholder="作品・作家を検索"
              required
            >
            <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
          </form>
        </nav>
      </div>
    </div>

    <!-- ヘッダー下部 -->
    <div
      id="header-lower"
      :class="{ 'searching-or-to-genre-lower': searching || toGenre || comicFrames }"
      class="d-flex justify-content-between align-items-center flex-wrap"
    >
      <div class="header-lower-buttons">
        <div v-if="currentUID === null">
          <button
            class="general-button"
            type="button"
            @click="showLoginScreen"
          >
            管理者ログイン
          </button>
        </div>
        <div
          v-else
          class="lower-buttons-at-login d-flex justify-content-between align-items-center flex-wrap"
        >
          <comic-registration-modal
            :comics="comics"
            @add-comic="addComic"
          >
          </comic-registration-modal>
          <button
            id="log-out"
            class="general-button"
            type="button"
            @click="logOut"
          >
            ログアウト
          </button>
        </div>
      </div>
      <div v-if="!searching && !toGenre && !comicFrames" id="header-lower-nav">
        <div>
          <ul class="d-flex align-items-center">
            <li><a @click="handleClick('#popular-comics')">人気作</a></li>
            <li><a @click="handleClick('#by-genre')">ジャンル別</a></li>
            <li>
              <a @click="handleClick('#search-carton-frame')">
                コマで探す
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import firebase from 'firebase/app';
import ComicRegistrationModal from '@/components/ComicRegistrationModal.vue';

export default {
  components: {
    ComicRegistrationModal,
  },

  props: {
    currentUID: {
      type: String,
      default: '',
    },
    searching: {
      type: Boolean,
      default: false,
    },
    toGenre: {
      type: Boolean,
      default: false,
    },
    comicFrames: {
      type: Boolean,
      default: false,
    },
    comics: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      comicOrAuthor: '',
    };
  },

  methods: {
    returnTopFromSearch() {
      this.$emit('return-top-from-search');
    },

    returnTopFromGenre() {
      this.$emit('return-top-from-genre');
    },

    returnTopFromComicFrames() {
      this.$emit('return-top-from-comic-frames');
    },

    showLoginScreen() {
      this.$emit('show-login-screen');
    },

    logOut() {
      firebase
        .auth()
        .signOut() // ログアウト実行
        .then(() => {
          // ログアウトに成功したときの処理
          console.log('ログアウトしました');
        })
        .catch((error) => {
          // ログアウトに失敗したときの処理
          console.error('ログアウトエラー', error);
        });
    },

    handleClick(sectionId) {
      this.$emit('scroll-to', sectionId);
    },

    searchComic() {
      this.$emit('search-comic', this.comicOrAuthor);
      this.comicOrAuthor = '';
    },

    genreToSearch() {
      this.$emit('genre-to-search', this.comicOrAuthor);
      this.comicOrAuthor = '';
    },

    comicFramesToSearch() {
      this.$emit('comic-frames-to-search', this.comicOrAuthor);
      this.comicOrAuthor = '';
    },

    searchHandler() {
      if (!this.toGenre && !this.comicFrames) {
        this.searchComic();
      } else if (this.toGenre && !this.comicFrames) {
        this.genreToSearch();
      } else if (!this.toGenre && this.comicFrames) {
        this.comicFramesToSearch();
      }
    },

    addComic(comic) {
      this.$emit('add-comic', comic);
    },

  },
};
</script>

<style scoped>
/* ヘッダー共通 */
header li {
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 0.1rem solid #000000;
}
header li:first-child {
  margin-left: 0;
  padding-left: 0;
  border-left: none;
}

/* ヘッダー個別 */
/* ヘッダー */
header {
  padding: 2rem 0.5rem;
  background-color: #A8DADC;
}

/* ヘッダー上部 */
/* ヘッダー上部ヘッダーロゴ */
header #header-upper h1 {
  white-space: nowrap;
  overflow: hidden;
}

/* ヘッダー上部トップページ以外ヘッダーロゴ */
header #header-upper h1 #header-logo {
  padding: 0;
  border: none;
  background-color: transparent;
  color: #000000;
  font-size: clamp(1.6rem, 5.8vw, 2.4rem);
  font-weight: bold;
  text-decoration: none;
}
@media (min-width : 768px) {
  header #header-upper h1 #header-logo:hover{
    text-decoration: none;
    opacity: 0.5;
  }
}

/* ヘッダー上部右側 */
header #header-upper #header-right {
  width: 50%;
}
@media (min-width : 768px) {
  header #header-upper #header-right.searching-or-to-genre-upper {
    width: 70%;
  }
}

header #header-upper #header-right #header-right-buttons {
  display: none;
}
@media (min-width : 768px) {
  header #header-upper #header-right #header-right-buttons {
    display: block;
    margin-right: 1rem;
  }
}
header #header-upper #header-right #header-right-buttons > div {
  column-gap: 1rem;
}

/* ヘッダー上部検索ボックス */
header #header-upper #header-right .search-box {
  position: relative;
}
header #header-upper #header-right .search-box #header-search-field {
  width: 100%;
  height: 3.2rem;
  border-radius: 0.5rem;
  border: 0.1rem solid #000000;
}
header #header-upper #header-right .search-box #header-search-field:focus {
  border: 0.2rem solid #000000;
}
@media (min-width : 768px) {
  header #header-upper #header-right .search-box #header-search-field::-webkit-search-cancel-button,
  header #header-upper #header-right .search-box #header-search-field::-webkit-search-clear-button {
    position: absolute;
    right: 10%;
  }
}
header #header-upper #header-right .search-box button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  outline: none;
  border: none;
  background: none;
  color: #000000;
}
header #header-upper #header-right .search-box button:focus {
  opacity: 0.5;
}
@media (min-width : 768px) {
  header #header-upper #header-right .search-box button:hover {
    opacity: 0.5;
  }
}

/* ヘッダー下部 */
header #header-lower {
  margin-top: 0.5rem;
  column-gap: 0.5rem;
  row-gap: 0.5rem;
}

header #header-lower .header-lower-buttons .lower-buttons-at-login {
  column-gap: 0.5rem;
  row-gap: 0.5rem;
}

@media (min-width : 768px) {
  header #header-lower.searching-or-to-genre-lower .header-lower-buttons {
    display: none;
  }
}

header #header-lower #header-lower-nav ul li a{
  font-size: clamp(1.2rem, 3.8vw, 1.6rem);
  font-weight: bold;
}
</style>
