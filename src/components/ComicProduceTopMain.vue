<template>
  <div>
    <div v-if="comics.length === 0">
      <p class="text-center">登録された本はありません。</p>
    </div>
    <div v-else id="example" class="main-container">

      <div id="recommend-comics">
        <h2>現在のおすすめ</h2>
        <VueSlickCarousel
          ref="slickCarousel"
          v-bind="slickCarouselSettings"
          class="slide-items"
          @afterChange="handleSlideChange"
        >
          <div
            v-for="comic in recommendComics"
            :key="comic.id"
            class="slide-item"
            :class="['slide-item', { 'current': currentSlideId === comic.id }]"
          >
            <a :href="comic.trial_read_url" target="_blank">
              <div>
                <img :src="comic.comicImage" alt="image">
                <h4>{{ comic.title }}</h4>
                <p>{{ comic.author }}</p>
              </div>
            </a>
          </div>
        </VueSlickCarousel>
      </div>

      <div id="popular-comics">
        <h2>
          まず読むならこれ！国民的人気作5つ
        </h2>
        <ul class="d-flex justify-content-between">
          <li
            v-for="comic in popularComics"
            :key="comic.id"
          >
            <a :href="comic.trial_read_url" target="_blank">
              <img :src="comic.comicImage" alt="image">
            </a>
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
          </li>
        </ul>
      </div>

      <div id="by-genre">
        <h2>
          ジャンル別
        </h2>
        <ul
          ref="genreNav"
          id="genre-nav"
          class="d-flex justify-content-between align-items-center"
          :class="{ 'm_fixed': isFixed }"
        >
          <li>
            <a
              @click="scrollToGenreSection('#area-1')"
              :class="{ 'is-current': currentSection === 1 }"
            >
              アクション
            </a>
          </li>
          <li>
            <a
              @click="scrollToGenreSection('#area-2')"
              :class="{ 'is-current': currentSection === 2 }"
            >
              サスペンス
            </a>
          </li>
          <li>
            <a
              @click="scrollToGenreSection('#area-3')"
              :class="{ 'is-current': currentSection === 3 }"
            >
              スポーツ
            </a>
          </li>
          <li>
            <a
              @click="scrollToGenreSection('#area-4')"
              :class="{ 'is-current': currentSection === 4 }"
            >
              ファンタジー
            </a>
          </li>
          <li>
            <a
              @click="scrollToGenreSection('#area-5')"
              :class="{ 'is-current': currentSection === 5 }"
            >
              ホラー
            </a>
          </li>
          <li>
            <a
              @click="scrollToGenreSection('#area-6')"
              :class="{ 'is-current': currentSection === 6 }"
            >
              恋愛
            </a>
          </li>
        </ul>

        <div id="area-1" class="genre" >
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-hand-fist"></i>アクション</h3>
            <button
              class="to-each-genre"
              @click="toEachGenre('action')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <ul class="d-flex justify-content-between">
            <li
              v-for="comic in actionComics"
              :key="comic.id"
            >
              <a :href="comic.trial_read_url" target="_blank">
                <img :src="comic.comicImage" alt="image">
              </a>
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
            </li>
          </ul>
        </div>
        <div id="area-2" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-magnifying-glass"></i>サスペンス</h3>
            <button
              class="to-each-genre"
              @click="toEachGenre('suspense')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <ul class="d-flex justify-content-between">
            <li
              v-for="comic in suspenseComics"
              :key="comic.id"
            >
              <a :href="comic.trial_read_url" target="_blank">
                <img :src="comic.comicImage" alt="image">
              </a>
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
            </li>
          </ul>
        </div>
        <div id="area-3" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-person-running"></i>スポーツ</h3>
            <button
              class="to-each-genre"
              @click="toEachGenre('sports')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <ul class="d-flex justify-content-between">
            <li
              v-for="comic in sportsComics"
              :key="comic.id"
            >
              <a :href="comic.trial_read_url" target="_blank">
                <img :src="comic.comicImage" alt="image">
              </a>
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
            </li>
          </ul>
        </div>
        <div id="area-4" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-dragon"></i>ファンタジー</h3>
            <button
              class="to-each-genre"
              @click="toEachGenre('fantasy')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <ul class="d-flex justify-content-between">
            <li
              v-for="comic in fantasyComics"
              :key="comic.id"
            >
              <a :href="comic.trial_read_url" target="_blank">
                <img :src="comic.comicImage" alt="image">
              </a>
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
            </li>
          </ul>
        </div>
        <div id="area-5" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-ghost"></i>ホラー</h3>
            <button
              class="to-each-genre"
              @click="toEachGenre('horror')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <ul class="d-flex justify-content-between">
            <li
              v-for="comic in horrorComics"
              :key="comic.id"
            >
              <a :href="comic.trial_read_url" target="_blank">
                <img :src="comic.comicImage" alt="image">
              </a>
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
            </li>
          </ul>
        </div>
        <div id="area-6" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-brands fa-gratipay"></i>恋愛</h3>
            <button
              class="to-each-genre"
              @click="toEachGenre('romance')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <ul class="d-flex justify-content-between">
            <li
              v-for="comic in romanceComics"
              :key="comic.id"
            >
              <a :href="comic.trial_read_url" target="_blank">
                <img :src="comic.comicImage" alt="image">
              </a>
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
            </li>
          </ul>
        </div>
      </div>

      <div  ref="searchCartonFrame" id="search-carton-frame">
        <h2>
          コマで探す
        </h2>

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
              <a :href="comic.trial_read_url" target="_blank">
                <img
                  :src="comic.frameImage"
                  alt="image"
                  class="frame-img"
                >
              </a>
              <p>出展:{{ comic.quote }}</p>
            </div>
          </div>
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
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
import ConfirmModal from '@/components/ConfirmModal.vue';

Vue.use(VueMasonryPlugin);

export default {
  components: {
    VueSlickCarousel,
    ConfirmModal,
  },

  props: {
    currentUID: {
      type: String,
      default: '',
    },
    searchWatch: {
      type: Boolean,
      default: false,
    },
    genreWatch: {
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
      slickCarouselSettings: {
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 6000,
        speed: 1000,
        infinite: true,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
      },
      // 現在のスライドのIDを保持するデータプロパティ
      currentSlideId: null,
      // ジャンル別ナビゲーションバー固定関係
      isFixed: false,
      navPos: 0,
      framePos: 0,
      navHeight: 0,
      actionHeight: 0,
      suspenseHeight: 0,
      sportsHeight: 0,
      fantasyHeight: 0,
      horrorHeight: 0,
      romanceHeight: 0,
      currentSection: 1,
      showModal: false,
      selectedComicId: null,
    };
  },

  computed: {
    recommendComics() {
      return this.comics.filter((comic) => comic.recommendation === 'recommendation').slice(0, 7);
    },
    popularComics() {
      return this.comics.filter((comic) => comic.popularity === 'major').slice(0, 5);
    },
    actionComics() {
      return this.comics.filter((comic) => comic.genre === 'action').slice(0, 5);
    },
    suspenseComics() {
      return this.comics.filter((comic) => comic.genre === 'suspense').slice(0, 5);
    },
    sportsComics() {
      return this.comics.filter((comic) => comic.genre === 'sports').slice(0, 5);
    },
    fantasyComics() {
      return this.comics.filter((comic) => comic.genre === 'fantasy').slice(0, 5);
    },
    horrorComics() {
      return this.comics.filter((comic) => comic.genre === 'horror').slice(0, 5);
    },
    romanceComics() {
      return this.comics.filter((comic) => comic.genre === 'romance').slice(0, 5);
    },
  },

  methods: {
    scrollToGenreSection(sectionId) {
      const target = document.querySelector(sectionId);
      const targetPos = target.offsetTop;
      const position = targetPos - this.navHeight;

      document.documentElement.style.scrollBehavior = 'smooth';
      window.scrollTo(0, position);

      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
      }, 100);
    },

    handleSlideChange(currentSlide) {
      this.currentSlideId = this.recommendComics[currentSlide].id;
    },

    handleNavFix() {
      const scrollPos = window.pageYOffset;

      if (scrollPos > this.navPos && scrollPos < this.framePos - 1) {
        document.body.style.paddingTop = `${this.navHeight}px`;
        this.isFixed = true;
      } else {
        document.body.style.paddingTop = '0';
        this.isFixed = false;
      }
    },

    handleResizeNavFix() {
      setTimeout(() => {
        this.isFixed = false;
      }, 100);
      setTimeout(() => {
        this.navPos = this.$refs.genreNav.offsetTop;
        this.framePos = this.$refs.searchCartonFrame.offsetTop;
        this.handleNavFix();
      }, 100);
    },

    handleScroll() {
      const scrollPos = window.pageYOffset;

      if (scrollPos < this.suspenseHeight) {
        this.currentSection = 1;
      } else if (this.suspenseHeight <= scrollPos && scrollPos < this.sportsHeight) {
        this.currentSection = 2;
      } else if (this.sportsHeight <= scrollPos && scrollPos < this.fantasyHeight) {
        this.currentSection = 3;
      } else if (this.fantasyHeight <= scrollPos && scrollPos < this.horrorHeight) {
        this.currentSection = 4;
      } else if (this.horrorHeight <= scrollPos && scrollPos < this.romanceHeight) {
        this.currentSection = 5;
      } else if (this.romanceHeight <= scrollPos) {
        this.currentSection = 6;
      }
    },

    handleResizeScroll() {
      this.currentSection = null;
      setTimeout(() => {
        this.actionHeight = document.querySelector('#area-1').offsetTop - this.navHeight - 1;
        this.suspenseHeight = document.querySelector('#area-2').offsetTop - this.navHeight - 1;
        this.sportsHeight = document.querySelector('#area-3').offsetTop - this.navHeight - 1;
        this.fantasyHeight = document.querySelector('#area-4').offsetTop - this.navHeight - 1;
        this.horrorHeight = document.querySelector('#area-5').offsetTop - this.navHeight - 1;
        this.romanceHeight = document.querySelector('#area-6').offsetTop - this.navHeight - 1;
        this.handleScroll();
      }, 100);
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

    toEachGenre(genreName) {
      this.$emit('to-each-genre', genreName);
    },
  },

  watch: {
    comics: {
      handler() {
        this.$nextTick(() => {
          const msnryContainer = this.$refs.masonryContainer;
          const msnry = new Masonry(msnryContainer, {
            itemSelector: '.grid-item',
          });
          imagesLoaded(msnryContainer, () => {
            msnry.reloadItems();
            msnry.layout();
            // genre-navナビゲーションバー固定
            // 初期表示時にスクロール位置をチェック
            this.navPos = this.$refs.genreNav.getBoundingClientRect().top + window.pageYOffset;
            this.framePos = this.$refs.searchCartonFrame.offsetTop;
            this.navHeight = this.$refs.genreNav.offsetHeight;
            this.handleNavFix();
            this.actionHeight = document.querySelector('#area-1').offsetTop - this.navHeight - 1;
            this.suspenseHeight = document.querySelector('#area-2').offsetTop - this.navHeight - 1;
            this.sportsHeight = document.querySelector('#area-3').offsetTop - this.navHeight - 1;
            this.fantasyHeight = document.querySelector('#area-4').offsetTop - this.navHeight - 1;
            this.horrorHeight = document.querySelector('#area-5').offsetTop - this.navHeight - 1;
            this.romanceHeight = document.querySelector('#area-6').offsetTop - this.navHeight - 1;
            this.handleScroll();
          });
        });
      },
      deep: true,
    },

    searchWatch: {
      handler() {
        this.$nextTick(() => {
          const msnryContainer = this.$refs.masonryContainer;
          const msnry = new Masonry(msnryContainer, {
            itemSelector: '.grid-item',
          });
          imagesLoaded(msnryContainer, () => {
            msnry.reloadItems();
            msnry.layout();
            // genre-navナビゲーションバー固定
            // 初期表示時にスクロール位置をチェック
            this.navPos = this.$refs.genreNav.getBoundingClientRect().top + window.pageYOffset;
            this.framePos = this.$refs.searchCartonFrame.offsetTop;
            this.navHeight = this.$refs.genreNav.offsetHeight;
            this.handleNavFix();
            this.actionHeight = document.querySelector('#area-1').offsetTop - this.navHeight - 1;
            this.suspenseHeight = document.querySelector('#area-2').offsetTop - this.navHeight - 1;
            this.sportsHeight = document.querySelector('#area-3').offsetTop - this.navHeight - 1;
            this.fantasyHeight = document.querySelector('#area-4').offsetTop - this.navHeight - 1;
            this.horrorHeight = document.querySelector('#area-5').offsetTop - this.navHeight - 1;
            this.romanceHeight = document.querySelector('#area-6').offsetTop - this.navHeight - 1;
            this.handleScroll();
          });
        });
      },
      deep: true,
    },

    genreWatch: {
      handler() {
        this.$nextTick(() => {
          const msnryContainer = this.$refs.masonryContainer;
          const msnry = new Masonry(msnryContainer, {
            itemSelector: '.grid-item',
          });
          imagesLoaded(msnryContainer, () => {
            msnry.reloadItems();
            msnry.layout();
            // genre-navナビゲーションバー固定
            // 初期表示時にスクロール位置をチェック
            this.navPos = this.$refs.genreNav.getBoundingClientRect().top + window.pageYOffset;
            this.framePos = this.$refs.searchCartonFrame.offsetTop;
            this.navHeight = this.$refs.genreNav.offsetHeight;
            this.handleNavFix();
            this.actionHeight = document.querySelector('#area-1').offsetTop - this.navHeight - 1;
            this.suspenseHeight = document.querySelector('#area-2').offsetTop - this.navHeight - 1;
            this.sportsHeight = document.querySelector('#area-3').offsetTop - this.navHeight - 1;
            this.fantasyHeight = document.querySelector('#area-4').offsetTop - this.navHeight - 1;
            this.horrorHeight = document.querySelector('#area-5').offsetTop - this.navHeight - 1;
            this.romanceHeight = document.querySelector('#area-6').offsetTop - this.navHeight - 1;
            this.handleScroll();
          });
        });
      },
      deep: true,
    },

    recommendComics: {
      handler() {
        // 現在のスライドのIDを更新
        this.currentSlideId = this.recommendComics[0].id;
      },
      deep: true,
    },
  },

  updated() {
    window.addEventListener('scroll', this.handleNavFix);
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResizeNavFix);
    window.addEventListener('resize', this.handleResizeScroll);
  },

};
</script>

<style>
#recommend-comics .slide-items .slick-prev, #recommend-comics .slide-items .slick-next {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: black;
  z-index: 1;
  opacity: 1;
}
#recommend-comics .slide-items .slick-prev:hover, #recommend-comics .slide-items .slick-next:hover {
  background-color: #646464;
}
#recommend-comics .slide-items .slick-prev:before,
#recommend-comics .slide-items .slick-next:before{
  display: block;
  content: '';
  width: 16px;
  height: 16px;
  border: solid 2px white;
  opacity: 1;
}
#recommend-comics .slide-items .slick-prev:before{
  border-width: 0 0 3px 3px;
  transform: translate(20px, 0) rotate(45deg);
}
#recommend-comics .slide-items .slick-next:before{
  border-width: 3px 3px 0 0;
  transform: translate(12.5px, 0) rotate(45deg);
}
@media screen and (max-width: 991px) {
  #recommend-comics .slide-items .slick-prev {
    left: 10%;
  }
  #recommend-comics .slide-items .slick-next {
    right: 10%;
  }
}
</style>

<style scoped>
/* container */
img {
  border: solid 1px #DCDCDC;
}
img:not(.frame-img) {
  aspect-ratio: 3 / 5;
  object-fit: cover;
}
.main-container h2 {
  padding-left: 0.5rem;
  border-bottom: solid 5px #C8C8C8;
}
.main-container h3 {
  margin-top: 1rem;
  padding-left: 0.5rem;
}
#recommend-comics {
  margin-top: 3rem;
}
#recommend-comics h2 {
  border-bottom: none;
}
#recommend-comics .slide-items {
  margin-top: 1rem;
}
#recommend-comics .slide-items div div .slide-item {
  margin: 0 1rem;
  transition-duration: 1s;
  transform: scale(0.8);
}
#recommend-comics .slide-items div div .current {
  transition-duration: 1s;
  transform: scale(1.0);
}
#popular-comics {
  margin-top: 3rem;
}
#by-genre {
  margin-top: 3rem;
}
#genre-nav {
  margin: 0 auto;
  padding: 0;
  width: 100%;
  height: 48px;
  background-color: #E1E1E1;
}
#genre-nav.m_fixed {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
}
#genre-nav li {
  margin: 0 1rem;
  width: 100%;
  height: 100%;
  display: table;
  /* nowrapにすることで表示崩れを防ぐ */
  /* 設定しないと縦に折り返される */
  white-space: nowrap;
}
#genre-nav li a {
  width: 90%;
  /* table-cellが指定された要素はheightは自動的に100%となり、指定できない */
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
#genre-nav li a.is-current {
  background-color: #AAAAAA;
  border-radius: 20px;
}
.genre {
  border-bottom: solid 1px #DCDCDC;
}
.genre:last-child{
  border-bottom: none;
}
.genre .genre-headline {
  margin-top: 1rem;
}
.genre .genre-headline h3 {
  margin: 0;
}
.genre .genre-headline i {
  margin-right: 0.2rem;
}
.genre .genre-headline .to-each-genre {
  margin-right: 0.5rem;
  border: none;
  background-color: transparent;
  font-weight: bold;
  color: #0000cd;
}
.genre .genre-headline .to-each-genre:hover {
  opacity: 0.5;
}
#search-carton-frame {
  margin-top: 3rem;
  margin-bottom: 3rem;
}
#search-carton-frame main {
  width: 100%;
}
#search-carton-frame .grid {
  margin: 1rem auto 0;
  width: 90%;
}
#search-carton-frame .grid .grid-item a {
  display: block;
  margin: 0 auto;
}
#search-carton-frame .grid .grid-item a img {
  display: block;
  width: 100%;
}
/* media query */
@media screen and (max-width: 991px) {
  /* main-container */
  #recommend-comics .slide-items .slide-item a,
  #recommend-comics .slide-items .slide-item h4,
  #recommend-comics .slide-items .slide-item p
  {
    display: block;
    width: 45vw;
  }
  .main-container #popular-comics ul, .main-container .genre ul {
    margin: 1rem 0;
    overflow-x: auto;
  }
  .main-container li:not(.dot) {
    width: 45vw;
  }
  .main-container #popular-comics li, .main-container .genre li {
    margin-left: 1.5rem;
  }
  .main-container #popular-comics li:last-child, .main-container .genre li:last-child {
    margin-right: 1.5rem;
  }
  img:not(.frame-img) {
    width: 45vw;
  }
  #genre-nav {
    overflow-x: auto;
  }
  .grid-item {
    padding-bottom: 1.5rem;
    width: 50%;
  }
  .grid-item div {
    margin: 0 auto;
    width: 90%;
  }
}
@media screen and (min-width: 992px) {
  /* main-container */
  .main-container #recommend-comics>div {
    margin: 1rem auto 0;
    width: 90%;
  }
  #recommend-comics .slide-items .slide-item a,
  #recommend-comics .slide-items .slide-item h4,
  #recommend-comics .slide-items .slide-item p
  {
    display: block;
    width: 15vw;
  }
  .main-container ul:not(.slick-dots) {
    margin: 1rem auto 0;
    width: 90%;
  }
  .main-container .genre ul {
    margin-bottom: 1rem;
  }
  .main-container li:not(.dot) {
    width: 15vw;
  }
  img:not(.frame-img) {
    width: 15vw;
  }
  #search-carton-frame .grid-item {
    padding-bottom: 2rem;
    width: 33%;
  }
  .grid-item div {
    margin: 0 auto;
    width: 70%;
  }
}
</style>
