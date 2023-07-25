<template>
  <header>
    <div id="header-upper" class="d-flex align-items-center justify-content-between">
      <h1>
        <div v-if="!searching && !toGenre">
          <a href="#">漫画紹介サイト</a>
        </div>
        <div v-else-if="searching && !toGenre">
          <button id="header-logo" @click="returnTopFromSearch">漫画紹介サイト</button>
        </div>
        <div v-else-if="!searching && toGenre">
          <button id="header-logo" @click="returnTopFromGenre">漫画紹介サイト</button>
        </div>
      </h1>
      <div id="header-right" class="d-flex justify-content-between align-items-center">
        <div id="nav-bar">
          <div v-if="!searching && !toGenre">
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
    <div id="header-lower">
      <div id="header-lower-nav">
        <div v-if="!searching && !toGenre">
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
      <div id="header-lower-lower">
        <div v-if="currentUID === null">
          <button id="administrator-login" type="button" v-on:click="showLoginScreen">
            管理者ログイン
          </button>
        </div>
        <div v-else>
          <comic-registration-modal
            :comics="comics"
            @add-comic="addComic"
          >
          </comic-registration-modal>
          <button id="log-out" type="button" v-on:click="logOut">ログアウト</button>
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

    searchHandler() {
      if (!this.toGenre) {
        this.searchComic();
      } else if (this.toGenre) {
        this.genreToSearch();
      }
    },

    addComic(comic) {
      this.$emit('add-comic', comic);
    },

  },
};
</script>

<style scoped>
/* header */
header {
  height: 150px;
  background-color: #E1E1E1;
}
header #header-upper {
  height: 50%;
}
header #header-logo {
  padding: 0;
  border: none;
  background-color: transparent;
  font-weight: bold;
  text-decoration: none;
  color: black;
}
header #header-logo:hover{
  text-decoration: none;
  opacity: 0.5;
  cursor: pointer;
}
header h1 {
  white-space: nowrap;
  overflow: hidden;
}
header ul {
  margin: 0;
}
header li {
  margin-left: 0.3rem;
  padding-left: 0.3rem;
  border-left: solid 1px #B4B4B4;
}
header li:first-child {
  margin-left: 0;
  padding-left: 0;
  border-left: none;
}
header input {
  height: 32px;
  border-radius: 5px;
  border: solid 0.1rem black;
  position: relative;
}
header input:focus {
  border: solid 0.15rem black;
}
header .search-box button {
  position: absolute;
  border: none;
  background: none;
  color: black;
}
header #header-lower {
  height: 50%;
}
#header-lower #header-lower-lower {
  margin-top: 0.5rem;
}
#header-lower #header-lower-lower #log-out{
  margin-left: 1rem;
}
#header-lower-lower button {
  padding: 0.4rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  background-color: #4c586f;
  color: #fff;
}
#header-lower-lower #administrator-login {
  margin: 0;
}
#header-lower-lower button:hover {
  opacity: 0.8;
}
#header-lower-lower button i {
  margin-right: 0.1rem;
}
/* media query */
@media screen and (max-width: 991px) {
  ::-webkit-scrollbar {
    display: none;
  }
  /* header */
  header {
    padding: 0 0.5rem;
  }
  header #nav-bar {
    display: none;
  }
  header input {
    padding-right: 2rem;
  }
  header .search-box button {
    right: 10px;
  }
}
@media screen and (min-width: 992px) {
  /* header */
  header {
    padding: 0 1rem;
  }
  header input {
    margin-left: 1rem;
    padding-right: 1.5rem;
  }
  header button {
    right: 15px;
  }
  #header-lower-nav {
    display: none;
  }
}
</style>
