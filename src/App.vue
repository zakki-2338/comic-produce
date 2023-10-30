/* globals $, firebase */
<template>
  <div id="app">
    <a id="scroll-to-top"></a>
    <div v-if="modalOverlay" id="modal-overlay"></div>
    <div v-if="loginScreen">
      <comic-produce-login
        :mailOrPassError="mailOrPassError"
        @log-in="logIn"
        @return-top-from-Login="returnTopFromLogin"
      >
      </comic-produce-login>
    </div>
    <div v-else-if="!loginScreen">
      <comic-produce-top-header
        :currentUID="currentUID"
        :searching="searching"
        :toGenre="toGenre"
        :comicFrames="comicFrames"
        :comics="comics"
        @return-top-from-search="returnTopFromSearch"
        @return-top-from-genre="returnTopFromGenre"
        @return-top-from-comic-frames="returnTopFromComicFrames"
        @show-login-screen="showLoginScreen"
        @scroll-to="scrollToSection"
        @search-comic="searchComic"
        @genre-to-search="genreToSearch"
        @comic-frames-to-search="comicFramesToSearch"
        @add-comic="addComic"
      >
      </comic-produce-top-header>
      <div v-if="!searching && !toGenre && !comicFrames">
        <comic-produce-top-main
          :currentUID="currentUID"
          :loginWatch="loginWatch"
          :searchWatch="searchWatch"
          :genreWatch="genreWatch"
          :comicFramesWatch="comicFramesWatch"
          :comics="comics"
          @show-modal-overlay="showModalOverlay"
          @hide-modal-overlay="hideModalOverlay"
          @delete-comic="deleteComic"
          @to-each-genre="toEachGenre"
          @to-comic-frames="toComicFrames"
        >
        </comic-produce-top-main>
      </div>
      <div v-else-if="searching && !toGenre && !comicFrames">
        <comic-produce-search
          :currentUID="currentUID"
          :comics="comics"
          :comicOrAuthor="comicOrAuthor"
          @return-top-from-search="returnTopFromSearch"
          @show-modal-overlay="showModalOverlay"
          @hide-modal-overlay="hideModalOverlay"
          @delete-comic="deleteComic"
        >
        </comic-produce-search>
      </div>
      <div v-else-if="!searching && toGenre && !comicFrames">
        <comic-produce-genre
          :currentUID="currentUID"
          :comics="comics"
          :genreWord="genreWord"
          @return-top-from-genre="returnTopFromGenre"
          @show-modal-overlay="showModalOverlay"
          @hide-modal-overlay="hideModalOverlay"
          @delete-comic="deleteComic"
        >
        </comic-produce-genre>
      </div>
      <div v-else-if="!searching && !toGenre && comicFrames">
        <comic-frames
          :currentUID="currentUID"
          :comics="comics"
          :comicFramesWatch="comicFramesWatch"
          @return-top-from-comic-frames="returnTopFromComicFrames"
          @show-modal-overlay="showModalOverlay"
          @hide-modal-overlay="hideModalOverlay"
        >
        </comic-frames>
      </div>
    </div>
  </div>
</template>

<script>
import ComicProduceLogin from '@/components/ComicProduceLogin.vue';
import ComicProduceTopHeader from '@/components/ComicProduceTopHeader.vue';
import ComicProduceTopMain from '@/components/ComicProduceTopMain.vue';
import firebase from 'firebase/app';
import ComicProduceSearch from '@/components/ComicProduceSearch.vue';
import { getComics, deleteComic } from '@/services/firebaseService';
import ComicProduceGenre from '@/components/ComicProduceGenre.vue';
import ComicFrames from '@/components/ComicFrames.vue';
// import { getComics } from '@/services/comicService';

export default {
  components: {
    ComicProduceLogin,
    ComicProduceTopHeader,
    ComicProduceTopMain,
    ComicProduceSearch,
    ComicProduceGenre,
    ComicFrames,
  },

  data() {
    // 初期値を設定
    return {
      loginScreen: false,
      loginWatch: false,
      mail: '',
      pass: '',
      mailOrPassError: false,
      currentUID: null,
      comics: [],
      modalOverlay: false,
      searching: false,
      searchWatch: false,
      comicOrAuthor: '',
      toGenre: false,
      genreWatch: false,
      genreWord: '',
      comicFrames: false,
      comicFramesWatch: false,
    };
  },

  methods: {
    showLoginScreen() {
      this.loginScreen = true;
      this.loginWatch = true;
    },

    returnTopFromLogin() {
      this.loginScreen = false;
      setTimeout(() => {
        this.loginWatch = false;
      }, 100);
    },

    async logIn(mailInfo, passInfo) {
      try {
        this.mail = mailInfo;
        this.pass = passInfo;
        const { user } = await firebase.auth().signInWithEmailAndPassword(this.mail, this.pass);

        // ログインに成功したときの処理
        this.currentUID = user.uid;
        this.loginScreen = false;
        console.log('ログインしました', user);
      } catch (error) {
        // ログインに失敗したときの処理
        console.error('ログインエラー', error);
        this.mailOrPassError = true;
      }
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

    makeToast(title, msg) {
      this.$bvToast.toast(msg, {
        autoHideDelay: 5000,
        title,
        variant: 'danger',
      });
    },

    addComic(comic) {
      this.comics.push(comic);
    },

    async onGetComics() {
      this.comics = await getComics().catch((err) => {
        console.error(err.message);
        this.makeToast('エラーの発生', 'コミックデータを取得できませんでした。');
      });
    },

    showModalOverlay() {
      this.modalOverlay = true;
    },

    hideModalOverlay() {
      this.modalOverlay = false;
    },

    async deleteComic(comicId) {
      try {
        await deleteComic(comicId);
      } catch (err) {
        console.error(err.message);
        this.makeToast('エラーの発生', 'コミックを削除できませんでした。');
      }
      this.modalOverlay = false;
      this.comics = this.comics.filter((comic) => comic.id !== comicId);
    },

    scrollToSection(sectionId) {
      // スクロール処理を実行
      const target = document.querySelector(sectionId);
      const targetPos = target.offsetTop;

      document.documentElement.style.scrollBehavior = 'smooth';
      window.scrollTo(0, targetPos);

      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
      }, 600);
    },

    searchComic(searchWord) {
      this.searching = true;
      this.comicOrAuthor = searchWord;
      this.searchWatch = true;
    },

    returnTopFromSearch() {
      this.searching = false;
      setTimeout(() => {
        this.searchWatch = false;
      }, 100);
    },

    toEachGenre(genreName) {
      this.toGenre = true;
      this.genreWord = genreName;
      this.genreWatch = true;
    },

    returnTopFromGenre() {
      this.toGenre = false;
      setTimeout(() => {
        this.genreWatch = false;
      }, 100);
    },

    genreToSearch(searchWord) {
      this.returnTopFromGenre();
      this.searching = true;
      this.comicOrAuthor = searchWord;
      this.searchWatch = true;
    },

    toComicFrames() {
      this.comicFrames = true;
      setTimeout(() => {
        this.comicFramesWatch = true;
      }, 100);
    },

    returnTopFromComicFrames() {
      this.comicFrames = false;
      setTimeout(() => {
        this.comicFramesWatch = false;
      }, 100);
    },

    comicFramesToSearch(searchWord) {
      this.returnTopFromComicFrames();
      this.searching = true;
      this.comicOrAuthor = searchWord;
      this.searchWatch = true;
    },
  },

  async created() {
    // ログイン状態の変化を監視する
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log('状態：ログイン中');
        this.currentUID = user.uid;
        this.onGetComics();
      } else {
        console.log('状態：ログアウト');
        this.currentUID = null;
        this.onGetComics();
      }
    });
  },

  mounted() {
    // ボタンの要素を取得
    const scrollButton = document.getElementById('scroll-to-top');
    // ボタンの表示／非表示を切り替える関数
    const updateScrollButton = () => {
      // 現在のスクロール位置を取得
      const currentScroll = window.scrollY;
      if (currentScroll >= 500) {
        // 500px以上スクロールされた場合、ボタンを表示
        scrollButton.style.display = 'block';
      } else {
        // それ以外の場合、ボタンを非表示
        scrollButton.style.display = 'none';
      }
    };

    // スクロールイベントを監視してupdateScrollButtonを実行
    window.addEventListener('scroll', updateScrollButton);

    // ボタンをクリックしたらページトップにスクロールする
    scrollButton.addEventListener('click', (e) => {
      // ボタンのデフォルトの動作を無効にする
      e.preventDefault();
      // トップに戻る
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ページの途中でリロード（再読み込み）された場合でも、ボタンが表示されるようにする
    updateScrollButton();
  },
};

</script>

<style>
/* 全体共通 */
html {
    font-size: 62.5%;
}

::-webkit-search-cancel-button,
::-webkit-search-clear-button {
  display: none;
}
@media (min-width : 768px) {
  ::-webkit-search-cancel-button,
  ::-webkit-search-clear-button {
    display: block;
  }
  ::-webkit-search-cancel-button:hover,
  ::-webkit-search-clear-button:hover {
    cursor: pointer;
    opacity: 0.5;
  }
}

label, h1, h2, h3, h4, p {
  margin: 0;
}
h1, h2, h3, h4 {
  font-weight: bold;
}

ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
  color: #000000;
}
a:hover {
  text-decoration: none;
  color: #000000;
  opacity: 0.5;
  cursor: pointer;
}
img {
  border: 0.1rem solid #DCDCDC;
}

label {
  font-size: clamp(1.2rem, 3.8vw, 1.6rem);
}
button {
  font-size: clamp(1.2rem, 3.8vw, 1.6rem);
}
button:hover {
  cursor: pointer;
}
input {
  font-size: clamp(1.2rem, 3.8vw, 1.6rem);
}
::placeholder {
  font-size: clamp(1.2rem, 3.8vw, 1.6rem);
  color: #969696;
}
a {
  font-size: clamp(1.6rem, 5.8vw, 2.4rem);
}
h1 {
  font-size: clamp(1.6rem, 5.8vw, 2.4rem);
}
h2 {
  font-size: clamp(1.6rem, 5.8vw, 2.4rem);
}
h3 {
  font-size: clamp(1.4rem, 5vw, 2rem);
}
h4 {
  font-size: clamp(1.4rem, 5vw, 2rem);
}
p {
  font-size: clamp(1.2rem, 3.8vw, 1.6rem);
}
span {
  font-size: clamp(1.2rem, 3.8vw, 1.6rem);
}

.general-button {
  display: block;
  padding: 0.4rem 1rem;
  border-radius: 1rem;
  border: none;
  background-color: #4682B4;
  color: #fff;
}
.general-button:hover {
  opacity: 0.8;
}

.delete-button {
  margin-top: 0.2rem;
  background-color: transparent;
  color: #E63C64;
  border: 0.2rem solid #E63C64;
  border-radius: 0.4rem;
}
.delete-button:hover {
  background-color: #E63C64;
  color: #ffffff;
}

#app #scroll-to-top {
  position: fixed;
  z-index: 2;
  bottom: 2%;
  right: 2%;
  width: 10vw;
  min-width: 3rem;
  max-width: 5rem;
  aspect-ratio: 1/1;
  background-color: #4f4f71;
  border-radius: 50%;
  display: none;
  opacity: 1;
}
#app #scroll-to-top.active {
  display: block;
}
#app #scroll-to-top:before {
  content: "";
  position: absolute;
  top: 40%;
  left: 31%;
  transform: rotate(45deg);
  width: 40%;
  height: 40%;
  border-top: 0.3rem solid #ffffff;
  border-left: 0.3rem solid #ffffff;
}
@media (min-width : 768px) {
  #app #scroll-to-top:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}

#app #modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  background-color: #000000;
  opacity: 0.5;
}
</style>
