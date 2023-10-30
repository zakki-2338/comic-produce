<template>
  <div id="genre-result">
    <h2>{{ genreText }}</h2>
    <button
      id="return-top-from-genre"
      class="general-button"
      type="button"
      @click="returnTopFromGenre"
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
        <p>{{ genreText }}ジャンルの作品が見つかりませんでした。</p>
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
    genreWord: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      deleteModal: false,
      selectedComicId: null,
      externalLinkConfirmationModal: false,
      selectedExternalLinkUrl: null,
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
      } if (this.genreWord === 'other') {
        return 'その他';
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
/* ジャンルページ個別 */
#genre-result {
  width: 90%;
  max-width: 72rem;
  margin: 3rem auto 3rem;
}

#genre-result h2 {
  text-align: center;
}

#genre-result #return-top-from-genre {
  margin: 5rem 0 0 auto;
}

#genre-result section {
  margin: 0 auto;
}
#genre-result section li {
  padding: 1rem 0 1rem;
  border-top: 0.1rem solid #DCDCDC;
}
#genre-result section li a{
  width: 20%;
}
#genre-result section li a img {
  aspect-ratio: 3 / 5;
  width: 100%;
  object-fit: cover;
}
#genre-result section li > div {
  width: 80%;
  margin-left: 1rem;
}
#genre-result section li:last-child {
  border-bottom: 0.1rem solid #DCDCDC;
}

#genre-result section #result-zero p {
  padding: 1rem 0 1rem;
  border-top: 0.1rem solid #DCDCDC;
  border-bottom: 0.1rem solid #DCDCDC;
  text-align: center;
}
</style>
