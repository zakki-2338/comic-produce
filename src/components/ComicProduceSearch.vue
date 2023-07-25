<template>
  <div id="search-result">
    <h2>作品・作家を探す</h2>
    <form
      @submit.prevent="reSearchResults"
      class="search-box d-flex align-items-center"
    >
      <input
        id="header-search-field"
        type="search"
        name="search"
        v-model="searchWord"
        required
      >
      <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
    </form>
    <button
      id="return-top-from-search"
      type="button"
      v-on:click="returnTopFromSearch"
    >
      トップページへ戻る
    </button>
    <section>
      <h3>「{{ preSearch }}」の検索結果</h3>
      <div v-if = "searchComics.length > 0">
        <ul>
          <li
            v-for="comic in searchComics"
            :key="comic.id"
            class="d-flex"
          >
            <a :href="comic.trial_read_url" target="_blank">
              <img :src="comic.comicImage" alt="image">
            </a>
            <div>
              <h4>{{ comic.title }}</h4>
              <p>{{ comic.author }}</p>
              <div v-if="currentUID === null">
              </div>
              <div v-else>
                <button
                  class="delete-button"
                  @click="showConfirmationModal(comic.id)"
                >
                  削除
                </button>
                <confirm-modal
                  v-if="showModal"
                  :id="selectedComicId"
                  @confirm="deleteComic"
                  @cancel="cancelDelete">
                </confirm-modal>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else id="resultZero">
        <p>「{{ preSearch }}」を含む作品が見つかりませんでした。</p>
      </div>
    </section>
  </div>
</template>

<script>
import ConfirmModal from '@/components/ConfirmModal.vue';

export default {
  components: {
    ConfirmModal,
  },

  props: {
    currentUID: {
      type: String,
      default: '',
    },
    comics: {
      type: Array,
      required: true,
    },
    comicOrAuthor: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      searchWord: this.comicOrAuthor,
      preSearch: this.comicOrAuthor,
      showModal: false,
      selectedComicId: null,
    };
  },

  computed: {
    searchComics() {
      // 検索キーワードとして使用する変数を定義します
      const searchTerm = this.preSearch || this.searchWord;

      // comics配列をフィルタリングして結果を返します
      return this.comics.filter((comic) => (
        comic.author.includes(searchTerm) || comic.title.includes(searchTerm)
      ));
    },
  },

  methods: {
    returnTopFromSearch() {
      this.$emit('return-top-from-search');
    },

    reSearchResults() {
      this.preSearch = this.searchWord;
    },

    showConfirmationModal(id) {
      this.selectedComicId = id;
      this.showModal = true;
    },

    deleteComic(comicId) {
      this.showModal = false;
      this.$emit('delete-comic', comicId);
    },

    cancelDelete() {
      this.showModal = false;
      console.log('キャンセルしました');
    },
  },

};
</script>

<style scoped>
#search-result {
  width: 90%;
  max-width: 720px;
  margin: 3rem auto 3rem;
}
#search-result h2 {
  text-align: center;
}
#search-result form {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #C8C8C8;
  border-radius: 10px;
  position: relative;
}
#search-result form input {
  display: block;
  padding-right: 2rem;
  width: 100%;
  height: 32px;
  border-radius: 5px;
}
#search-result form input:focus {
  outline: solid 0.1rem black;
}
#search-result .search-box button {
  border: none;
  outline: none;
  background: none;
  position: absolute;
  right: 30px;
}
#search-result #return-top-from-search {
  display: block;
  margin: 0 0 0 auto;
  padding: 0.4rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  background-color: #4c586f;
  color: #fff;
}
#search-result #return-top-from-search:hover {
  opacity: 0.8;
}
#search-result section {
  margin: 3rem auto 0;
}
#search-result section ul {
  margin: 0;
}
#search-result section li {
  padding: 1rem 0 1rem;
  border-top: solid 1px #DCDCDC;
}
#search-result section li a{
  width: 20%;
}
#search-result section li a img {
  aspect-ratio: 3 / 5;
  width: 100%;
  object-fit: cover;
}
#search-result section li div {
  width: 80%;
  padding-left: 1rem;
}
#search-result section li div p {
  margin-top: 0.5;
}
#search-result section li div div {
  padding: 0;
}
#search-result section li:last-child {
  border-bottom: solid 1px #DCDCDC;
}
#search-result section #resultZero p {
  padding: 1rem 0 1rem;
  border-top: solid 1px #DCDCDC;
  border-bottom: solid 1px #DCDCDC;
  text-align: center;
}
</style>
