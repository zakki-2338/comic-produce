/* globals $, firebase */
<template>
  <div id="app">
    <div v-if="loginScreen">
      <comic-produce-login @log-in="logIn"></comic-produce-login>
    </div>
    <div v-else-if="!loginScreen">
      <comic-produce-top-header
        :currentUID="currentUID"
        :searching="searching"
        :toGenre="toGenre"
        :comics="comics"
        @return-top-from-search="returnTopFromSearch"
        @return-top-from-genre="returnTopFromGenre"
        @show-login-screen="showLoginScreen"
        @scroll-to="scrollToSection"
        @search-comic="searchComic"
        @genre-to-search="genreToSearch"
        @add-comic="addComic"
      >
      </comic-produce-top-header>
      <div v-if="!searching && !toGenre">
        <comic-produce-top-main
          :currentUID="currentUID"
          :searchWatch="searchWatch"
          :genreWatch="genreWatch"
          :comics="comics"
          @delete-comic="deleteComic"
          @to-each-genre="toEachGenre"
        >
        </comic-produce-top-main>
      </div>
      <div v-else-if="searching && !toGenre">
        <comic-produce-search
          :currentUID="currentUID"
          :comics="comics"
          :comicOrAuthor="comicOrAuthor"
          @return-top-from-search="returnTopFromSearch"
          @delete-comic="deleteComic"
        >
        </comic-produce-search>
      </div>
      <div v-else-if="!searching && toGenre">
        <comic-produce-genre
          :currentUID="currentUID"
          :comics="comics"
          :genreWord="genreWord"
          @return-top-from-genre="returnTopFromGenre"
          @delete-comic="deleteComic"
        >
        </comic-produce-genre>
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
// import { getComics } from '@/services/comicService';

export default {
  components: {
    ComicProduceLogin,
    ComicProduceTopHeader,
    ComicProduceTopMain,
    ComicProduceSearch,
    ComicProduceGenre,
  },

  data() {
    // 初期値を設定
    return {
      loginScreen: false,
      mail: '',
      pass: '',
      currentUID: null,
      comics: [],
      searching: false,
      searchWatch: false,
      comicOrAuthor: '',
      toGenre: false,
      genreWatch: false,
      genreWord: '',
    };
  },

  methods: {
    showLoginScreen() {
      this.loginScreen = true;
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

    async deleteComic(comicId) {
      try {
        await deleteComic(comicId);
      } catch (err) {
        console.error(err.message);
        this.makeToast('エラーの発生', 'コミックを削除できませんでした。');
      }
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
};

</script>

<style>
/* all */
h1, h2, h3, h4 {
  margin: 0;
  font-weight: bold;
}
h1 {
  font-size: 1.4rem;
}
h2 {
  font-size: 1.4rem;
}
h3 {
  font-size: 1.3rem;
}
h4 {
  font-size: 1.2rem;
}
p {
  margin: 0;
  font-size: 1rem;
}
ul {
  padding: 0;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
  color: black;
}
a:hover {
  text-decoration: none;
  color: black;
  opacity: 0.5;
  cursor: pointer;
}
.delete-button {
  margin-top: 0.2rem;
  background-color: transparent;
  color: #E63C64;
  border: solid 2px #E63C64;
  border-radius: 4px;
}
.delete-button:hover{
  background-color: #E63C64;
  color: white;
}
::placeholder {
  color: #969696;
}
@media screen and (max-width: 991px) {
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
