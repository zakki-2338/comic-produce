<template>
  <div>
    <!-- 現在のおすすめ -->
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
            <a @click="showExternalLinkConfirmationModal(comic.trialReadUrl)">
              <div>
                <img :src="comic.comicImage" alt="image">
                <h4>{{ comic.title }}</h4>
                <p>{{ comic.author }}</p>
              </div>
            </a>
          </div>
        </VueSlickCarousel>
        <link-transition-confirm-modal
          v-if="externalLinkConfirmationModal"
          :externalLinkUrl="selectedExternalLinkUrl"
          @confirm="externalLinkapproval"
          @cancel="cancelExternalLinkTransition">
        </link-transition-confirm-modal>
      </div>

      <!-- 国民的人気作 -->
      <div id="popular-comics">
        <h2>
          まず読むならこれ！国民的人気作5つ
        </h2>
        <div class="comics-wrapper">
          <button
            class="left-scroll-button" @click="scrollLeftPopular" v-show="canScrollLeftPopular"
          >
          </button>
          <button
            class="right-scroll-button" @click="scrollRightPopular" v-show="canScrollRightPopular"
          >
          </button>
          <ul class="d-flex justify-content-between" ref="scrollContainerPopular">
            <li
              v-for="comic in popularComics"
              :key="comic.id"
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
              <h4>{{ comic.title }}</h4>
              <p>{{ comic.author }}</p>
              <div v-if="currentUID === null">
              </div>
              <div v-else>
                <button
                  class="delete-button"
                  @click="showDeleteConfirmationModal(comic.id)"
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
            </li>
          </ul>
        </div>
      </div>

      <!-- ジャンル別 -->
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
          <li>
            <a
              @click="scrollToGenreSection('#area-7')"
              :class="{ 'is-current': currentSection === 7 }"
            >
              その他
            </a>
          </li>
        </ul>

        <div id="area-1" class="genre" >
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-hand-fist"></i>アクション</h3>
            <button
              class="to-each-genre-sp"
              @click="toEachGenre('action')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <div class="comics-wrapper">
            <button
              class="left-scroll-button" @click="scrollLeftArea1" v-show="canScrollLeftArea1"
            >
            </button>
            <button
              class="right-scroll-button" @click="scrollRightArea1" v-show="canScrollRightArea1"
            >
            </button>
            <div v-if = "actionComics.length > 0">
              <ul class="d-flex justify-content-between" ref="scrollContainerArea1">
                <li
                  v-for="comic in actionComics"
                  :key="comic.id"
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
                  <h4>{{ comic.title }}</h4>
                  <p>{{ comic.author }}</p>
                  <div v-if="currentUID === null">
                  </div>
                  <div v-else>
                    <button
                      class="delete-button"
                      @click="showDeleteConfirmationModal(comic.id)"
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
                </li>
              </ul>
            </div>
            <div v-else class="genre-result-zero">
              <p>アクションジャンルの作品が見つかりませんでした。</p>
            </div>
            <button
              class="to-each-genre-pc"
              @click="toEachGenre('action')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
        </div>
        <div id="area-2" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-magnifying-glass"></i>サスペンス</h3>
            <button
              class="to-each-genre-sp"
              @click="toEachGenre('suspense')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <div class="comics-wrapper">
            <button
              class="left-scroll-button" @click="scrollLeftArea2" v-show="canScrollLeftArea2"
            >
            </button>
            <button
              class="right-scroll-button" @click="scrollRightArea2" v-show="canScrollRightArea2"
            >
            </button>
            <div v-if = "suspenseComics.length > 0">
              <ul class="d-flex justify-content-between" ref="scrollContainerArea2">
                <li
                  v-for="comic in suspenseComics"
                  :key="comic.id"
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
                  <h4>{{ comic.title }}</h4>
                  <p>{{ comic.author }}</p>
                  <div v-if="currentUID === null">
                  </div>
                  <div v-else>
                    <button
                      class="delete-button"
                      @click="showDeleteConfirmationModal(comic.id)"
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
                </li>
              </ul>
            </div>
            <div v-else class="genre-result-zero">
              <p>サスペンスジャンルの作品が見つかりませんでした。</p>
            </div>
            <button
              class="to-each-genre-pc"
              @click="toEachGenre('suspense')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
        </div>
        <div id="area-3" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-person-running"></i>スポーツ</h3>
            <button
              class="to-each-genre-sp"
              @click="toEachGenre('sports')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <div class="comics-wrapper">
            <button
              class="left-scroll-button" @click="scrollLeftArea3" v-show="canScrollLeftArea3"
            >
            </button>
            <button
              class="right-scroll-button" @click="scrollRightArea3" v-show="canScrollRightArea3"
            >
            </button>
            <div v-if = "sportsComics.length > 0">
              <ul class="d-flex justify-content-between" ref="scrollContainerArea3">
                <li
                  v-for="comic in sportsComics"
                  :key="comic.id"
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
                  <h4>{{ comic.title }}</h4>
                  <p>{{ comic.author }}</p>
                  <div v-if="currentUID === null">
                  </div>
                  <div v-else>
                    <button
                      class="delete-button"
                      @click="showDeleteConfirmationModal(comic.id)"
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
                </li>
              </ul>
            </div>
            <div v-else class="genre-result-zero">
              <p>スポーツジャンルの作品が見つかりませんでした。</p>
            </div>
            <button
              class="to-each-genre-pc"
              @click="toEachGenre('sports')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
        </div>
        <div id="area-4" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-dragon"></i>ファンタジー</h3>
            <button
              class="to-each-genre-sp"
              @click="toEachGenre('fantasy')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <div class="comics-wrapper">
            <button
              class="left-scroll-button" @click="scrollLeftArea4" v-show="canScrollLeftArea4"
            >
            </button>
            <button
              class="right-scroll-button" @click="scrollRightArea4" v-show="canScrollRightArea4"
            >
            </button>
            <div v-if = "fantasyComics.length > 0">
              <ul class="d-flex justify-content-between" ref="scrollContainerArea4">
                <li
                  v-for="comic in fantasyComics"
                  :key="comic.id"
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
                  <h4>{{ comic.title }}</h4>
                  <p>{{ comic.author }}</p>
                  <div v-if="currentUID === null">
                  </div>
                  <div v-else>
                    <button
                      class="delete-button"
                      @click="showDeleteConfirmationModal(comic.id)"
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
                </li>
              </ul>
            </div>
            <div v-else class="genre-result-zero">
              <p>ファンタジージャンルの作品が見つかりませんでした。</p>
            </div>
            <button
              class="to-each-genre-pc"
              @click="toEachGenre('fantasy')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
        </div>
        <div id="area-5" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-solid fa-ghost"></i>ホラー</h3>
            <button
              class="to-each-genre-sp"
              @click="toEachGenre('horror')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <div class="comics-wrapper">
            <button
              class="left-scroll-button" @click="scrollLeftArea5" v-show="canScrollLeftArea5"
            >
            </button>
            <button
              class="right-scroll-button" @click="scrollRightArea5" v-show="canScrollRightArea5"
            >
            </button>
            <div v-if = "horrorComics.length > 0">
              <ul class="d-flex justify-content-between" ref="scrollContainerArea5">
                <li
                  v-for="comic in horrorComics"
                  :key="comic.id"
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
                  <h4>{{ comic.title }}</h4>
                  <p>{{ comic.author }}</p>
                  <div v-if="currentUID === null">
                  </div>
                  <div v-else>
                    <button
                      class="delete-button"
                      @click="showDeleteConfirmationModal(comic.id)"
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
                </li>
              </ul>
            </div>
            <div v-else class="genre-result-zero">
              <p>ホラージャンルの作品が見つかりませんでした。</p>
            </div>
            <button
              class="to-each-genre-pc"
              @click="toEachGenre('horror')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
        </div>
        <div id="area-6" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fa-brands fa-gratipay"></i>恋愛</h3>
            <button
              class="to-each-genre-sp"
              @click="toEachGenre('romance')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <div class="comics-wrapper">
            <button
              class="left-scroll-button" @click="scrollLeftArea6" v-show="canScrollLeftArea6"
            >
            </button>
            <button
              class="right-scroll-button" @click="scrollRightArea6" v-show="canScrollRightArea6"
            >
            </button>
            <div v-if = "romanceComics.length > 0">
              <ul class="d-flex justify-content-between" ref="scrollContainerArea6">
                <li
                  v-for="comic in romanceComics"
                  :key="comic.id"
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
                  <h4>{{ comic.title }}</h4>
                  <p>{{ comic.author }}</p>
                  <div v-if="currentUID === null">
                  </div>
                  <div v-else>
                    <button
                      class="delete-button"
                      @click="showDeleteConfirmationModal(comic.id)"
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
                </li>
              </ul>
            </div>
            <div v-else class="genre-result-zero">
              <p>恋愛ジャンルの作品が見つかりませんでした。</p>
            </div>
            <button
              class="to-each-genre-pc"
              @click="toEachGenre('romance')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
        </div>
        <div id="area-7" class="genre">
          <div class="d-flex justify-content-between align-items-center genre-headline">
            <h3><i class="fas fa-question-circle"></i>その他</h3>
            <button
              class="to-each-genre-sp"
              @click="toEachGenre('other')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
          <div class="comics-wrapper">
            <button
              class="left-scroll-button" @click="scrollLeftArea7" v-show="canScrollLeftArea7"
            >
            </button>
            <button
              class="right-scroll-button" @click="scrollRightArea7" v-show="canScrollRightArea7"
            >
            </button>
            <div v-if = "otherComics.length > 0">
              <ul class="d-flex justify-content-between" ref="scrollContainerArea7">
                <li
                  v-for="comic in otherComics"
                  :key="comic.id"
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
                  <h4>{{ comic.title }}</h4>
                  <p>{{ comic.author }}</p>
                  <div v-if="currentUID === null">
                  </div>
                  <div v-else>
                    <button
                      class="delete-button"
                      @click="showDeleteConfirmationModal(comic.id)"
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
                </li>
              </ul>
            </div>
            <div v-else class="genre-result-zero">
              <p>その他ジャンルの作品が見つかりませんでした。</p>
            </div>
            <button
              class="to-each-genre-pc"
              @click="toEachGenre('other')"
            >
              すべて見る <span>&gt;</span>
            </button>
          </div>
        </div>
      </div>

      <!-- コマで探す -->
      <div  ref="searchCartonFrame" id="search-carton-frame">
        <h2>
          コマで探す
        </h2>

        <div
          ref="masonryContainer"
          class="grid"
        >
          <div
            v-for="comic in comics20"
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
        <button
          class="to-comic-frames"
          @click="toComicFrames"
        >
          すべて見る <span>&gt;</span>
        </button>
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
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue';
import LinkTransitionConfirmModal from '@/components/LinkTransitionConfirmModal.vue';

Vue.use(VueMasonryPlugin);

export default {
  components: {
    VueSlickCarousel,
    DeleteConfirmModal,
    LinkTransitionConfirmModal,
  },

  props: {
    currentUID: {
      type: String,
      default: '',
    },
    loginWatch: {
      type: Boolean,
      default: false,
    },
    searchWatch: {
      type: Boolean,
      default: false,
    },
    genreWatch: {
      type: Boolean,
      default: false,
    },
    comicFramesWatch: {
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
        pauseOnHover: true,
        pauseOnDotsHover: true,
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
      deleteModal: false,
      selectedComicId: null,
      externalLinkConfirmationModal: false,
      selectedExternalLinkUrl: null,
      // スクロール領域の横方向のスクロール量
      scrollLeftAmountPopular: 0,
      // スクロール領域の横方向の幅
      containerWidthPopular: 0,
      // スクロール領域の表示領域の幅
      viewportWidthPopular: 0,
      // スクロール領域の横方向のスクロール量
      scrollLeftAmountArea1: 0,
      // スクロール領域の横方向の幅
      containerWidthArea1: 0,
      // スクロール領域の表示領域の幅
      viewportWidthArea1: 0,
      // スクロール領域の横方向のスクロール量
      scrollLeftAmountArea2: 0,
      // スクロール領域の横方向の幅
      containerWidthArea2: 0,
      // スクロール領域の表示領域の幅
      viewportWidthArea2: 0,
      // スクロール領域の横方向のスクロール量
      scrollLeftAmountArea3: 0,
      // スクロール領域の横方向の幅
      containerWidthArea3: 0,
      // スクロール領域の表示領域の幅
      viewportWidthArea3: 0,
      // スクロール領域の横方向のスクロール量
      scrollLeftAmountArea4: 0,
      // スクロール領域の横方向の幅
      containerWidthArea4: 0,
      // スクロール領域の表示領域の幅
      viewportWidthArea4: 0,
      // スクロール領域の横方向のスクロール量
      scrollLeftAmountArea5: 0,
      // スクロール領域の横方向の幅
      containerWidthArea5: 0,
      // スクロール領域の表示領域の幅
      viewportWidthArea5: 0,
      // スクロール領域の横方向のスクロール量
      scrollLeftAmountArea6: 0,
      // スクロール領域の横方向の幅
      containerWidthArea6: 0,
      // スクロール領域の表示領域の幅
      viewportWidthArea6: 0,
      // スクロール領域の横方向のスクロール量
      scrollLeftAmountArea7: 0,
      // スクロール領域の横方向の幅
      containerWidthArea7: 0,
      // スクロール領域の表示領域の幅
      viewportWidthArea7: 0,
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
    otherComics() {
      return this.comics.filter((comic) => comic.genre === 'other').slice(0, 5);
    },
    comics20() {
      return this.comics.slice(0, 20);
    },
    // 左にスクロールする余地があるかどうかを計算
    canScrollLeftPopular() {
      return this.scrollLeftAmountPopular > 0;
    },
    // 右にスクロールする余地があるかどうかを計算
    canScrollRightPopular() {
      return this.scrollLeftAmountPopular + this.viewportWidthPopular + 1
      < this.containerWidthPopular;
    },
    // 左にスクロールする余地があるかどうかを計算
    canScrollLeftArea1() {
      return this.scrollLeftAmountArea1 > 0;
    },
    // 右にスクロールする余地があるかどうかを計算
    canScrollRightArea1() {
      return this.scrollLeftAmountArea1 + this.viewportWidthArea1 + 1
      < this.containerWidthArea1;
    },
    // 左にスクロールする余地があるかどうかを計算
    canScrollLeftArea2() {
      return this.scrollLeftAmountArea2 > 0;
    },
    // 右にスクロールする余地があるかどうかを計算
    canScrollRightArea2() {
      return this.scrollLeftAmountArea2 + this.viewportWidthArea2 + 1
      < this.containerWidthArea2;
    },
    // 左にスクロールする余地があるかどうかを計算
    canScrollLeftArea3() {
      return this.scrollLeftAmountArea3 > 0;
    },
    // 右にスクロールする余地があるかどうかを計算
    canScrollRightArea3() {
      return this.scrollLeftAmountArea3 + this.viewportWidthArea3 + 1
      < this.containerWidthArea3;
    },
    // 左にスクロールする余地があるかどうかを計算
    canScrollLeftArea4() {
      return this.scrollLeftAmountArea4 > 0;
    },
    // 右にスクロールする余地があるかどうかを計算
    canScrollRightArea4() {
      return this.scrollLeftAmountArea4 + this.viewportWidthArea4 + 1
      < this.containerWidthArea4;
    },
    // 左にスクロールする余地があるかどうかを計算
    canScrollLeftArea5() {
      return this.scrollLeftAmountArea5 > 0;
    },
    // 右にスクロールする余地があるかどうかを計算
    canScrollRightArea5() {
      return this.scrollLeftAmountArea5 + this.viewportWidthArea5 + 1
      < this.containerWidthArea5;
    },
    // 左にスクロールする余地があるかどうかを計算
    canScrollLeftArea6() {
      return this.scrollLeftAmountArea6 > 0;
    },
    // 右にスクロールする余地があるかどうかを計算
    canScrollRightArea6() {
      return this.scrollLeftAmountArea6 + this.viewportWidthArea6 + 1
      < this.containerWidthArea6;
    },
    // 左にスクロールする余地があるかどうかを計算
    canScrollLeftArea7() {
      return this.scrollLeftAmountArea7 > 0;
    },
    // 右にスクロールする余地があるかどうかを計算
    canScrollRightArea7() {
      return this.scrollLeftAmountArea7 + this.viewportWidthArea7 + 1
      < this.containerWidthArea7;
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
      } else if (this.horrorHeight <= scrollPos && scrollPos < this.otherHeight) {
        this.currentSection = 6;
      } else if (this.otherHeight <= scrollPos) {
        this.currentSection = 7;
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
        this.otherHeight = document.querySelector('#area-7').offsetTop - this.navHeight - 1;
        this.handleScroll();
      }, 100);
    },

    showDeleteConfirmationModal(id) {
      this.selectedComicId = id;
      this.deleteModal = true;
      this.$emit('show-modal-overlay');
    },

    deleteComic(comicId) {
      this.$emit('delete-comic', comicId);
      this.deleteModal = false;
    },

    cancelDelete() {
      this.deleteModal = false;
      this.selectedComicId = null;
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

    toEachGenre(genreName) {
      this.$emit('to-each-genre', genreName);
    },

    toComicFrames() {
      this.$emit('to-comic-frames');
    },

    scrollLeftPopular() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#popular-comics > .comics-wrapper > ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft -= comicsWrapperUl.clientWidth * 0.6;
    },
    scrollRightPopular() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#popular-comics > .comics-wrapper > ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft += comicsWrapperUl.clientWidth * 0.6;
    },
    // スクロール領域の状態を更新
    updateScrollStatePopular() {
      this.scrollLeftAmountPopular = this.$refs.scrollContainerPopular.scrollLeft;
      this.containerWidthPopular = this.$refs.scrollContainerPopular.scrollWidth;
      this.viewportWidthPopular = this.$refs.scrollContainerPopular.clientWidth;
    },
    scrollLeftArea1() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-1 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft -= comicsWrapperUl.clientWidth * 0.6;
    },
    scrollRightArea1() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-1 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft += comicsWrapperUl.clientWidth * 0.6;
    },
    // スクロール領域の状態を更新
    updateScrollStateArea1() {
      this.scrollLeftAmountArea1 = this.$refs.scrollContainerArea1.scrollLeft;
      this.containerWidthArea1 = this.$refs.scrollContainerArea1.scrollWidth;
      this.viewportWidthArea1 = this.$refs.scrollContainerArea1.clientWidth;
    },
    scrollLeftArea2() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-2 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft -= comicsWrapperUl.clientWidth * 0.6;
    },
    scrollRightArea2() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-2 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft += comicsWrapperUl.clientWidth * 0.6;
    },
    // スクロール領域の状態を更新
    updateScrollStateArea2() {
      this.scrollLeftAmountArea2 = this.$refs.scrollContainerArea2.scrollLeft;
      this.containerWidthArea2 = this.$refs.scrollContainerArea2.scrollWidth;
      this.viewportWidthArea2 = this.$refs.scrollContainerArea2.clientWidth;
    },
    scrollLeftArea3() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-3 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft -= comicsWrapperUl.clientWidth * 0.6;
    },
    scrollRightArea3() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-3 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft += comicsWrapperUl.clientWidth * 0.6;
    },
    // スクロール領域の状態を更新
    updateScrollStateArea3() {
      this.scrollLeftAmountArea3 = this.$refs.scrollContainerArea3.scrollLeft;
      this.containerWidthArea3 = this.$refs.scrollContainerArea3.scrollWidth;
      this.viewportWidthArea3 = this.$refs.scrollContainerArea3.clientWidth;
    },
    scrollLeftArea4() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-4 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft -= comicsWrapperUl.clientWidth * 0.6;
    },
    scrollRightArea4() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-4 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft += comicsWrapperUl.clientWidth * 0.6;
    },
    // スクロール領域の状態を更新
    updateScrollStateArea4() {
      this.scrollLeftAmountArea4 = this.$refs.scrollContainerArea4.scrollLeft;
      this.containerWidthArea4 = this.$refs.scrollContainerArea4.scrollWidth;
      this.viewportWidthArea4 = this.$refs.scrollContainerArea4.clientWidth;
    },
    scrollLeftArea5() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-5 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft -= comicsWrapperUl.clientWidth * 0.6;
    },
    scrollRightArea5() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-5 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft += comicsWrapperUl.clientWidth * 0.6;
    },
    // スクロール領域の状態を更新
    updateScrollStateArea5() {
      this.scrollLeftAmountArea5 = this.$refs.scrollContainerArea5.scrollLeft;
      this.containerWidthArea5 = this.$refs.scrollContainerArea5.scrollWidth;
      this.viewportWidthArea5 = this.$refs.scrollContainerArea5.clientWidth;
    },
    scrollLeftArea6() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-6 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft -= comicsWrapperUl.clientWidth * 0.6;
    },
    scrollRightArea6() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-6 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft += comicsWrapperUl.clientWidth * 0.6;
    },
    // スクロール領域の状態を更新
    updateScrollStateArea6() {
      this.scrollLeftAmountArea6 = this.$refs.scrollContainerArea6.scrollLeft;
      this.containerWidthArea6 = this.$refs.scrollContainerArea6.scrollWidth;
      this.viewportWidthArea6 = this.$refs.scrollContainerArea6.clientWidth;
    },
    scrollLeftArea7() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-7 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft -= comicsWrapperUl.clientWidth * 0.6;
    },
    scrollRightArea7() {
      // 右にスクロールする処理を記述
      const comicsWrapperUl = document.querySelector('#area-7 .comics-wrapper ul');
      // 60%スクロール
      comicsWrapperUl.scrollLeft += comicsWrapperUl.clientWidth * 0.6;
    },
    // スクロール領域の状態を更新
    updateScrollStateArea7() {
      this.scrollLeftAmountArea7 = this.$refs.scrollContainerArea7.scrollLeft;
      this.containerWidthArea7 = this.$refs.scrollContainerArea7.scrollWidth;
      this.viewportWidthArea7 = this.$refs.scrollContainerArea7.clientWidth;
    },

    scrollToTop() {
      window.scrollTo(0, 0);
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
            this.otherHeight = document.querySelector('#area-7').offsetTop - this.navHeight - 1;
            this.handleScroll();
            // コンポーネントがマウントされたときに初期表示を設定し、
            // スクロール領域の状態を監視
            this.updateScrollStatePopular();
            this.$refs.scrollContainerPopular.addEventListener('scroll', this.updateScrollStatePopular);
            this.updateScrollStateArea1();
            this.$refs.scrollContainerArea1.addEventListener('scroll', this.updateScrollStateArea1);
            this.updateScrollStateArea2();
            this.$refs.scrollContainerArea2.addEventListener('scroll', this.updateScrollStateArea2);
            this.updateScrollStateArea3();
            this.$refs.scrollContainerArea3.addEventListener('scroll', this.updateScrollStateArea3);
            this.updateScrollStateArea4();
            this.$refs.scrollContainerArea4.addEventListener('scroll', this.updateScrollStateArea4);
            this.updateScrollStateArea5();
            this.$refs.scrollContainerArea5.addEventListener('scroll', this.updateScrollStateArea5);
            this.updateScrollStateArea6();
            this.$refs.scrollContainerArea6.addEventListener('scroll', this.updateScrollStateArea6);
            this.updateScrollStateArea7();
            this.$refs.scrollContainerArea7.addEventListener('scroll', this.updateScrollStateArea7);
          });
        });
      },
      deep: true,
    },

    loginWatch: {
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
            this.otherHeight = document.querySelector('#area-7').offsetTop - this.navHeight - 1;
            this.handleScroll();
            this.updateScrollStatePopular();
            this.$refs.scrollContainerPopular.addEventListener('scroll', this.updateScrollStatePopular);
            this.updateScrollStateArea1();
            this.$refs.scrollContainerArea1.addEventListener('scroll', this.updateScrollStateArea1);
            this.updateScrollStateArea2();
            this.$refs.scrollContainerArea2.addEventListener('scroll', this.updateScrollStateArea2);
            this.updateScrollStateArea3();
            this.$refs.scrollContainerArea3.addEventListener('scroll', this.updateScrollStateArea3);
            this.updateScrollStateArea4();
            this.$refs.scrollContainerArea4.addEventListener('scroll', this.updateScrollStateArea4);
            this.updateScrollStateArea5();
            this.$refs.scrollContainerArea5.addEventListener('scroll', this.updateScrollStateArea5);
            this.updateScrollStateArea6();
            this.$refs.scrollContainerArea6.addEventListener('scroll', this.updateScrollStateArea6);
            this.updateScrollStateArea7();
            this.$refs.scrollContainerArea7.addEventListener('scroll', this.updateScrollStateArea7);
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
            this.otherHeight = document.querySelector('#area-7').offsetTop - this.navHeight - 1;
            this.handleScroll();
            this.updateScrollStatePopular();
            this.$refs.scrollContainerPopular.addEventListener('scroll', this.updateScrollStatePopular);
            this.updateScrollStateArea1();
            this.$refs.scrollContainerArea1.addEventListener('scroll', this.updateScrollStateArea1);
            this.updateScrollStateArea2();
            this.$refs.scrollContainerArea2.addEventListener('scroll', this.updateScrollStateArea2);
            this.updateScrollStateArea3();
            this.$refs.scrollContainerArea3.addEventListener('scroll', this.updateScrollStateArea3);
            this.updateScrollStateArea4();
            this.$refs.scrollContainerArea4.addEventListener('scroll', this.updateScrollStateArea4);
            this.updateScrollStateArea5();
            this.$refs.scrollContainerArea5.addEventListener('scroll', this.updateScrollStateArea5);
            this.updateScrollStateArea6();
            this.$refs.scrollContainerArea6.addEventListener('scroll', this.updateScrollStateArea6);
            this.updateScrollStateArea7();
            this.$refs.scrollContainerArea7.addEventListener('scroll', this.updateScrollStateArea7);
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
            this.otherHeight = document.querySelector('#area-7').offsetTop - this.navHeight - 3;
            this.handleScroll();
            this.updateScrollStatePopular();
            this.$refs.scrollContainerPopular.addEventListener('scroll', this.updateScrollStatePopular);
            this.updateScrollStateArea1();
            this.$refs.scrollContainerArea1.addEventListener('scroll', this.updateScrollStateArea1);
            this.updateScrollStateArea2();
            this.$refs.scrollContainerArea2.addEventListener('scroll', this.updateScrollStateArea2);
            this.updateScrollStateArea3();
            this.$refs.scrollContainerArea3.addEventListener('scroll', this.updateScrollStateArea3);
            this.updateScrollStateArea4();
            this.$refs.scrollContainerArea4.addEventListener('scroll', this.updateScrollStateArea4);
            this.updateScrollStateArea5();
            this.$refs.scrollContainerArea5.addEventListener('scroll', this.updateScrollStateArea5);
            this.updateScrollStateArea6();
            this.$refs.scrollContainerArea6.addEventListener('scroll', this.updateScrollStateArea6);
            this.updateScrollStateArea7();
            this.$refs.scrollContainerArea7.addEventListener('scroll', this.updateScrollStateArea7);
          });
        });
      },
      deep: true,
    },

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
            this.otherHeight = document.querySelector('#area-7').offsetTop - this.navHeight - 1;
            this.handleScroll();
            this.updateScrollStatePopular();
            this.$refs.scrollContainerPopular.addEventListener('scroll', this.updateScrollStatePopular);
            this.updateScrollStateArea1();
            this.$refs.scrollContainerArea1.addEventListener('scroll', this.updateScrollStateArea1);
            this.updateScrollStateArea2();
            this.$refs.scrollContainerArea2.addEventListener('scroll', this.updateScrollStateArea2);
            this.updateScrollStateArea3();
            this.$refs.scrollContainerArea3.addEventListener('scroll', this.updateScrollStateArea3);
            this.updateScrollStateArea4();
            this.$refs.scrollContainerArea4.addEventListener('scroll', this.updateScrollStateArea4);
            this.updateScrollStateArea5();
            this.$refs.scrollContainerArea5.addEventListener('scroll', this.updateScrollStateArea5);
            this.updateScrollStateArea6();
            this.$refs.scrollContainerArea6.addEventListener('scroll', this.updateScrollStateArea6);
            this.updateScrollStateArea7();
            this.$refs.scrollContainerArea7.addEventListener('scroll', this.updateScrollStateArea7);
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

  mounted() {
    this.scrollToTop();
    // 画面のリサイズイベントを監視
    window.addEventListener('resize', this.updateScrollStatePopular);
    window.addEventListener('resize', this.updateScrollStateArea1);
    window.addEventListener('resize', this.updateScrollStateArea2);
    window.addEventListener('resize', this.updateScrollStateArea3);
    window.addEventListener('resize', this.updateScrollStateArea4);
    window.addEventListener('resize', this.updateScrollStateArea5);
    window.addEventListener('resize', this.updateScrollStateArea6);
    window.addEventListener('resize', this.updateScrollStateArea7);
  },

  beforeDestroy() {
    // コンポーネントが破棄される前に、イベントリスナーを削除
    this.$refs.scrollContainerPopular.removeEventListener('scroll', this.updateScrollStatePopular);
    window.removeEventListener('resize', this.updateScrollStatePopular);
    this.$refs.scrollContainerArea1.removeEventListener('scroll', this.updateScrollStateArea1);
    window.removeEventListener('resize', this.updateScrollStateArea1);
    this.$refs.scrollContainerArea2.removeEventListener('scroll', this.updateScrollStateArea2);
    window.removeEventListener('resize', this.updateScrollStateArea2);
    this.$refs.scrollContainerArea3.removeEventListener('scroll', this.updateScrollStateArea3);
    window.removeEventListener('resize', this.updateScrollStateArea3);
    this.$refs.scrollContainerArea4.removeEventListener('scroll', this.updateScrollStateArea4);
    window.removeEventListener('resize', this.updateScrollStateArea4);
    this.$refs.scrollContainerArea5.removeEventListener('scroll', this.updateScrollStateArea5);
    window.removeEventListener('resize', this.updateScrollStateArea5);
    this.$refs.scrollContainerArea6.removeEventListener('scroll', this.updateScrollStateArea6);
    window.removeEventListener('resize', this.updateScrollStateArea1);
    this.$refs.scrollContainerArea7.removeEventListener('scroll', this.updateScrollStateArea7);
    window.removeEventListener('resize', this.updateScrollStateArea7);
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
.main-container #recommend-comics .slide-items {
  position: relative;
}

.main-container #recommend-comics .slide-items .slick-prev,
.main-container #recommend-comics .slide-items .slick-next {
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  width: 5rem;
  height: 5rem;
  border-radius: 2.5rem;
  background-color: #000000;
  opacity: 1;
}
#recommend-comics .slide-items .slick-prev {
  left: 10%;
}
#recommend-comics .slide-items .slick-next {
  right: 10%;
}
@media (min-width : 768px) {
  #recommend-comics .slide-items .slick-prev {
    left: 5%;
  }
  #recommend-comics .slide-items .slick-next {
    right: 5%;
  }
}
@media (min-width : 768px) {
  .main-container #recommend-comics .slide-items .slick-prev:hover,
  .main-container #recommend-comics .slide-items .slick-next:hover {
    opacity: 0.5;
  }
}
#recommend-comics .slide-items .slick-prev:before,
#recommend-comics .slide-items .slick-next:before{
  display: block;
  content: "";
  width: 1.6rem;
  height: 1.6rem;
  border: 0.2rem solid #ffffff;
}
#recommend-comics .slide-items .slick-prev:before{
  border-width: 0 0 0.3rem 0.3rem;
  transform: translate(2rem, 0) rotate(45deg);
}
#recommend-comics .slide-items .slick-next:before{
  border-width: 0.3rem 0.3rem 0 0;
  transform: translate(1.25rem, 0) rotate(45deg);
}
</style>

<style scoped>
/* トップページ 共通 */
.main-container img:not(.frame-img) {
  width: 45vw;
  aspect-ratio: 3 / 5;
  object-fit: cover;
}
@media (min-width : 768px) {
  .main-container img:not(.frame-img) {
    width: 15vw;
  }
}

.main-container h2 {
  padding-left: 0.5rem;
  border-bottom: 0.5rem solid #54AFB2;
}

.main-container #popular-comics .comics-wrapper ul,
.main-container #by-genre .genre .comics-wrapper ul {
  overflow-x: auto;
  scroll-behavior: smooth;
}
.main-container #popular-comics .comics-wrapper ul li,
.main-container #by-genre .genre .comics-wrapper ul li
{
  margin-left: 1.5rem;
  width: 45vw;
}
@media (min-width : 768px) {
  .main-container #popular-comics .comics-wrapper ul li,
  .main-container #by-genre .genre .comics-wrapper ul li {
    margin-left: 0;
    width: 15vw;
  }
}
.main-container #popular-comics .comics-wrapper ul li:first-child,
.main-container #by-genre .genre .comics-wrapper ul li:first-child {
  margin-left: 0;
}
.main-container #popular-comics .comics-wrapper ul::-webkit-scrollbar,
.main-container #by-genre .genre .comics-wrapper ul::-webkit-scrollbar {
  display: none;
}

.main-container #popular-comics .comics-wrapper .left-scroll-button,
.main-container #by-genre .genre .comics-wrapper .left-scroll-button {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  padding: 0;
  width: 13vw;
  height: 100%;
  background-color: #000000;
  border-radius: 0 0.5rem 0.5rem 0;
  border: none;
  outline: none;
  opacity: 0.5;
}
.main-container #popular-comics .comics-wrapper .left-scroll-button:before,
.main-container #by-genre .genre .comics-wrapper .left-scroll-button:before {
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translateY(-50%) rotate(45deg);
  content: "";
  width: 80%;
  aspect-ratio: 1/1;
  border-left: 0.4rem solid #ffffff;
  border-bottom: 0.4rem solid #ffffff;
}
.main-container #popular-comics .comics-wrapper .right-scroll-button,
.main-container #by-genre .genre .comics-wrapper .right-scroll-button {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  padding: 0;
  width: 13vw;
  height: 100%;
  background-color: #000000;
  border-radius: 0.5rem 0 0 0.5rem;
  border: none;
  outline: none;
  opacity: 0.5;
}
.main-container #popular-comics .comics-wrapper .right-scroll-button:before,
.main-container #by-genre .genre .comics-wrapper .right-scroll-button:before {
  position: absolute;
  top: 50%;
  right: 30%;
  transform: translateY(-50%) rotate(45deg);
  content: "";
  width: 80%;
  aspect-ratio: 1/1;
  border-top: 0.4rem solid #ffffff;
  border-right: 0.4rem solid #ffffff;
}

/*トップページ個別 */
/* 現在のおすすめ */
.main-container #recommend-comics {
  margin-top: 3rem;
}
.main-container #recommend-comics h2 {
  border-bottom: none;
}
.main-container #recommend-comics .slide-items {
  margin-top: 1rem;
}
@media (min-width : 768px) {
  .main-container #recommend-comics .slide-items {
    margin: 1rem auto 0;
    width: 90%;
  }
}
#recommend-comics .slide-items div div .slide-item {
  margin: 0 1rem;
  transition-duration: 1s;
  transform: scale(0.8);
}
#recommend-comics .slide-items div div .current {
  transform: scale(1.0);
}
#recommend-comics .slide-items .slide-item a
{
  display: block;
  width: 45vw;
}
@media (min-width : 768px) {
  #recommend-comics .slide-items .slide-item a
  {
    display: block;
    width: 15vw;
  }
}

/* 国民的人気作5つ */
.main-container #popular-comics {
  margin-top: 4.5rem;
}
.main-container #popular-comics .comics-wrapper {
  position: relative;
  padding: 1rem 0 0;
}
@media (min-width : 768px) {
  .main-container #popular-comics .comics-wrapper {
    padding: 1rem 1.5rem;
  }
}

/* ジャンル別 */
.main-container #by-genre {
  margin-top: 3rem;
}
.main-container #by-genre h2 {
  border-bottom: none;
}
.main-container #by-genre #genre-nav {
  padding: 0 1.5rem;
  width: 100%;
  height: 4.8rem;
  background-color: #54AFB2;
  overflow-x: auto;
}
.main-container #by-genre #genre-nav.m_fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
}
.main-container #by-genre #genre-nav li {
  margin-left: 1rem;
  width: 100%;
  height: 100%;
  /* nowrapにすることで表示崩れを防ぐ */
  /* 設定しないと縦に折り返される */
  white-space: nowrap;
}
.main-container #by-genre #genre-nav li:first-child {
  margin-left: 0;
}
.main-container #by-genre #genre-nav li a {
  display: block;
  text-align: center;
  font-size: clamp(1.2rem, 3.8vw, 1.6rem);
  line-height: 4.8rem;
  color: #ffffff;
  opacity: 0.6;
}
.main-container #by-genre #genre-nav li a.is-current {
  font-weight: bold;
  opacity: 1;
}
.main-container #by-genre #genre-nav li a:hover {
  font-weight: bold;
  opacity: 1;
}

.main-container #by-genre .genre .genre-headline {
  margin: 1rem 0.5rem 0;
}
@media (min-width : 768px) {
  .main-container #by-genre .genre .genre-headline {
    margin: 1rem 1.5rem 0;
  }
}
.main-container #by-genre .genre .genre-headline .to-each-genre-sp {
  padding: 0;
  border: none;
  background-color: transparent;
  font-weight: bold;
  color: #0000cd;
}
@media (min-width : 768px) {
  .main-container #by-genre .genre .genre-headline .to-each-genre-sp {
    display: none;
  }
}
.main-container #by-genre .genre .comics-wrapper {
  position: relative;
  padding: 0.5rem 0;
}
@media (min-width : 768px) {
  .main-container #by-genre .genre .comics-wrapper {
    padding: 0.5rem 1.5rem 3rem;
    border-bottom: 0.1rem solid #DCDCDC;
  }
}
@media (min-width : 768px) {
  .main-container #by-genre .genre:last-child .comics-wrapper {
    border-bottom: none;
  }
}
.main-container #by-genre .genre .comics-wrapper .genre-result-zero {
  padding: 1rem 1.5rem;
}
.main-container #by-genre .genre .comics-wrapper .genre-result-zero p {
  text-align: center;
}
.main-container #by-genre .genre .comics-wrapper .to-each-genre-pc {
  display: none;
  padding: 0;
  border: none;
  background-color: transparent;
  font-size: clamp(1.4rem, 5vw, 2rem);
  font-weight: bold;
  color: #0000cd;
}
@media (min-width : 768px) {
  .main-container #by-genre .genre .comics-wrapper .to-each-genre-pc {
    display: block;
    margin: 2rem auto 0;
  }
  .main-container #by-genre .genre .comics-wrapper .to-each-genre-pc:hover {
    opacity: 0.5;
  }
}

/* コマで探す */
.main-container #search-carton-frame {
  margin-top: 3rem;
  margin-bottom: 10rem;
}
.main-container #search-carton-frame .grid {
  margin: 1rem auto 0;
  width: 90%;
}
.main-container #search-carton-frame .grid .grid-item {
    padding-bottom: 1.5rem;
    width: 50%;
}
@media (min-width : 768px) {
  .main-container #search-carton-frame .grid .grid-item {
      padding-bottom: 2rem;
      width: 33%;
  }
}
.main-container #search-carton-frame .grid .grid-item div {
  margin: 0 auto;
  width: 90%;
}
@media (min-width : 768px) {
  .main-container #search-carton-frame .grid .grid-item div {
    width: 70%;
  }
}
.main-container #search-carton-frame .grid .grid-item div a {
  display: block;
  margin: 0 auto;
}
.main-container #search-carton-frame .grid .grid-item div a img {
  display: block;
  width: 100%;
}
.main-container #search-carton-frame .to-comic-frames {
  display: block;
  margin: 1rem auto 0;
  padding: 0;
  border: none;
  background-color: transparent;
  font-weight: bold;
  color: #0000cd;
}
@media (min-width : 768px) {
  .main-container #search-carton-frame .to-comic-frames {
    font-size: clamp(1.4rem, 5vw, 2rem);
  }
  .main-container #search-carton-frame .to-comic-frames:hover {
    opacity: 0.5;
  }
}
</style>
