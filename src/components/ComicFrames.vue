<template>
  <div id="comic-frames">
    <h2>コマで探す</h2>
    <div class="button-container">
      <button
        @click="returnTopFromComicFrames"
        id="return-top-from-comic-frames"
        class="general-button"
        type="button"
      >
        トップページへ戻る
      </button>
    </div>
    <div
      ref="masonryContainer"
      class="grid"
    >
      <div
        v-for="comic in comics"
        :key="comic.id"
        v-masonry-tile
        class="grid-item"
      >
        <div>
          <a @click="showExternalLinkConfirmationModal(comic.trialReadUrl)">
            <img
              :src="comic.frameImage"
              alt="image"
              class="frame-img"
            >
          </a>
          <link-transition-confirm-modal
            v-if="externalLinkConfirmationModal"
            :externalLinkUrl="selectedExternalLinkUrl"
            @confirm="externalLinkapproval"
            @cancel="cancelExternalLinkTransition">
          </link-transition-confirm-modal>
          <p>出展:{{ comic.quote }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import imagesLoaded from 'imagesloaded';
import { VueMasonryPlugin } from 'vue-masonry';
import Masonry from 'masonry-layout';
import LinkTransitionConfirmModal from '@/components/LinkTransitionConfirmModal.vue';

Vue.use(VueMasonryPlugin);

export default {
  components: {
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
    comicFramesWatch: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      externalLinkConfirmationModal: false,
      selectedExternalLinkUrl: null,
    };
  },

  methods: {
    returnTopFromComicFrames() {
      this.$emit('return-top-from-comic-frames');
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

  watch: {
    comicFramesWatch: {
      handler() {
        this.$nextTick(() => {
          const msnryContainer = this.$refs.masonryContainer;
          const msnry = new Masonry(msnryContainer, {
            itemSelector: '.grid-item',
          });
          imagesLoaded(msnryContainer, () => {
            msnry.reloadItems();
            msnry.layout();
          });
        });
      },
      deep: true,
    },
  },

  mounted() {
    this.scrollToTop();
  },
};
</script>

<style scoped>
/* コマで探すページ個別 */
#comic-frames {
  width: 90%;
  margin: 3rem auto 3rem;
}
#comic-frames h2 {
  text-align: center;
}
#comic-frames .button-container {
  margin: 5rem 0 0 auto;
  width: 50%;
}
@media (min-width : 768px) {
  #comic-frames .button-container {
    margin: 5rem 1% 0 auto;
    width: 33%;
  }
}
#comic-frames .button-container #return-top-from-comic-frames {
  margin: 0 auto;
  width: 90%;
}
@media (min-width : 768px) {
  #comic-frames .button-container #return-top-from-comic-frames {
    margin: 0 auto;
    width: 70%;
  }
}
#comic-frames .grid {
  margin: 5rem auto 0;
}
#comic-frames .grid .grid-item {
    padding-bottom: 1.5rem;
    width: 50%;
}
@media (min-width : 768px) {
  #comic-frames .grid .grid-item {
      padding-bottom: 2rem;
      width: 33%;
  }
}
#comic-frames .grid .grid-item div {
  margin: 0 auto;
  width: 90%;
}
@media (min-width : 768px) {
  #comic-frames .grid .grid-item div {
    width: 70%;
  }
}
#comic-frames .grid .grid-item div a {
  display: block;
  margin: 0 auto;
}
#comic-frames .grid .grid-item div a img {
  display: block;
  width: 100%;
}
</style>
