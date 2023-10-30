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
      class="general-button"
      type="button"
      @click="returnTopFromSearch"
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
            <a @click="showExternalLinkConfirmationModal(comic.trialReadUrl)">
              <img :src="comic.comicImage" alt="image">
            </a>
            <link-transition-confirm-modal
              v-if="externalLinkConfirmationModal"
              :externalLinkUrl="selectedExternalLinkUrl"
              @confirm="externalLinkapproval"
              @cancel="cancelExternalLinkTransition">
            </link-transition-confirm-modal>
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
                <delete-confirm-modal
                  v-if="deleteModal"
                  :id="selectedComicId"
                  @confirm="deleteComic"
                  @cancel="cancelDelete">
                </delete-confirm-modal>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else id="result-zero">
        <p>「{{ preSearch }}」を含む作品が見つかりませんでした。</p>
      </div>
    </section>
  </div>
</template>

<script>
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue';
import LinkTransitionConfirmModal from '@/components/LinkTransitionConfirmModal.vue';

export default {
  components: {
    DeleteConfirmModal,
    LinkTransitionConfirmModal,
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
      deleteModal: false,
      selectedComicId: null,
      externalLinkConfirmationModal: false,
      selectedExternalLinkUrl: null,
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
      this.deleteModal = true;
      this.$emit('show-modal-overlay');
    },

    deleteComic(comicId) {
      this.deleteModal = false;
      this.$emit('delete-comic', comicId);
    },

    cancelDelete() {
      this.deleteModal = false;
      this.$emit('hide-modal-overlay');
      console.log('キャンセルしました');
    },

    showExternalLinkConfirmationModal(linkUrl) {
      this.selectedExternalLinkUrl = linkUrl;
      this.externalLinkConfirmationModal = true;
      this.$emit('show-modal-overlay');
    },

    externalLinkapproval(externalLinkUrl) {
      window.open(externalLinkUrl, '_blank');
      this.externalLinkConfirmationModal = false;
      this.$emit('hide-modal-overlay');
    },

    cancelExternalLinkTransition() {
      this.externalLinkConfirmationModal = false;
      this.selectedExternalLinkUrl = null;
      this.$emit('hide-modal-overlay');
      console.log('キャンセルしました');
    },
  },

};
</script>

<style scoped>
/* 検索ページ個別 */
#search-result {
  width: 90%;
  max-width: 72rem;
  margin: 3rem auto 3rem;
}

#search-result h2 {
  text-align: center;
}

#search-result .search-box {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #E1E1E1;
  border-radius: 1rem;
  position: relative;
}
#search-result .search-box input {
  display: block;
  width: 100%;
  height: 3.2rem;
  border-radius: 0.5rem;
  border: 0.1rem solid black;
}
#search-result .search-box input:focus {
  border: 0.2rem solid black;
}
@media (min-width : 768px) {
  #search-result .search-box input::-webkit-search-cancel-button,
  #search-result .search-box input::-webkit-search-clear-button {
    position: absolute;
    right: 3.5%;
  }
}
#search-result .search-box button {
  position: absolute;
  right: 5%;
  outline: none;
  border: none;
  background: none;
  color: black;
}
#search-result .search-box button:focus {
  opacity: 0.5;
}
@media (min-width : 768px) {
  #search-result .search-box button {
    right: 2.5%;
  }
  #search-result .search-box button:hover {
    opacity: 0.5;
  }
}

#search-result #return-top-from-search {
  margin: 5rem 0 0 auto;
}

#search-result section {
  margin: 0 auto;
}
#search-result section li {
  padding: 1rem 0 1rem;
  border-top: 0.1rem solid #DCDCDC;
}
#search-result section li a{
  width: 20%;
}
#search-result section li a img {
  aspect-ratio: 3 / 5;
  width: 100%;
  object-fit: cover;
}
#search-result section li > div {
  width: 80%;
  margin-left: 1rem;
}
#search-result section li:last-child {
  border-bottom: 0.1rem solid #DCDCDC;
}
#search-result section #result-zero p {
  padding: 1rem 0 1rem;
  border-top: solid 1px #DCDCDC;
  border-bottom: solid 1px #DCDCDC;
  text-align: center;
}
</style>
