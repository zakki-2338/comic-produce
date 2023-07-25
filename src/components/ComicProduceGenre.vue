<template>
  <div id="genre-result">
    <h2>{{ genreText }}</h2>
    <button
      id="return-top-from-genre"
      type="button"
      v-on:click="returnTopFromGenre"
    >
      トップページへ戻る
    </button>
    <section>
      <div v-if = "genreComics.length > 0">
        <ul>
          <li
            v-for="comic in genreComics"
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
        <p>「スポーツ」ジャンル作品が見つかりませんでした。</p>
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
    genreWord: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      showModal: false,
      selectedComicId: null,
    };
  },

  computed: {
    genreComics() {
      // 検索キーワードとして使用する変数を定義します
      const genreTerm = this.genreWord;
      return this.comics.filter((comic) => comic.genre === genreTerm);
    },
    genreText() {
      if (this.genreWord === 'action') {
        return 'アクション';
      } if (this.genreWord === 'suspense') {
        return 'サスペンス';
      } if (this.genreWord === 'sports') {
        return 'スポーツ';
      } if (this.genreWord === 'fantasy') {
        return 'ファンタジー';
      } if (this.genreWord === 'horror') {
        return 'ホラー';
      } if (this.genreWord === 'romance') {
        return '恋愛';
      }
      return '';
    },
  },

  methods: {
    returnTopFromGenre() {
      this.$emit('return-top-from-genre');
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

    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },

  mounted() {
    this.scrollToTop();
  },

};
</script>

<style scoped>
#genre-result {
  width: 90%;
  max-width: 720px;
  margin: 3rem auto 3rem;
}
#genre-result h2 {
  text-align: center;
}
#genre-result #return-top-from-genre {
  display: block;
  margin: 3rem 0 0 auto;
  padding: 0.4rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  background-color: #4c586f;
  color: #fff;
}
#genre-result #return-top-from-genre:hover {
  opacity: 0.8;
}
#genre-result section {
  margin: 0 auto;
}
#genre-result section ul {
  margin: 0;
}
#genre-result section li {
  padding: 1rem 0 1rem;
  border-top: solid 1px #DCDCDC;
}
#genre-result section li a{
  width: 20%;
}
#genre-result section li a img {
  aspect-ratio: 3 / 5;
  width: 100%;
  object-fit: cover;
}
#genre-result section li div {
  width: 80%;
  padding-left: 1rem;
}
#genre-result section li div p {
  margin-top: 0.5;
}
#genre-result section li div div {
  padding-left: 0;
}
#genre-result section li:last-child {
  border-bottom: solid 1px #DCDCDC;
}
#genre-result section #resultZero p {
  padding: 1rem 0 1rem;
  border-top: solid 1px #DCDCDC;
  border-bottom: solid 1px #DCDCDC;
  text-align: center;
}
</style>
