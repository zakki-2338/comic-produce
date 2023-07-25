<template>
  <div id="comic-registration">
    <button
      v-b-modal.comic-registration-modal
    >
      <i class="fa-solid fa-plus"></i>漫画登録
    </button>

    <b-modal
      id="comic-registration-modal"
      hide-footer
      title="漫画登録"
    >
      <b-form
        :validated="validated"
        @submit.prevent="onSubmit"
      >
        <b-form-group class="mb-8">
          <label for="title">タイトル</label>
          <b-form-input
            id="title"
            v-model="title"
            required
            :state="isValidTitle"
            type="text"
            aria-describedby="title-error"
          >
          </b-form-input>
          <b-form-invalid-feedback
            id="title-error"
            aria-label="タイトル入力エラー"
            role="alert"
          >
            タイトルを入力してください
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-8">
          <label for="author">著者</label>
          <b-form-input
            id="author"
            v-model="author"
            required
            :state="isValidAuthor"
            type="text"
            aria-describedby="author-error"
          >
          </b-form-input>
          <b-form-invalid-feedback
            id="author-error"
            aria-label="著者入力エラー"
            role="alert"
          >
            著者を入力してください
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-8">
          <label for="trial_read_url">試し読みページURL</label>
          <b-form-input
            id="trial_read_url"
            v-model="trial_read_url"
            required
            :state="isValidTrialReadUrl"
            type="text"
            aria-describedby="trial_read_url-error"
          >
          </b-form-input>
          <b-form-invalid-feedback
            id="trial_read_url-error"
            aria-label="試し読みページURL入力エラー"
            role="alert"
          >
            試し読みページURLを入力してください
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-8">
          <label for="recommendation">おすすめ度</label>
          <p v-if="!recommendationQuantity">※おすすめの登録は7件までです。現在7件なので普通のみ選択できます。</p>
            <b-form-select
              id="recommendation"
              v-model="recommendation"
              required
              :state="isValidRecommendation"
              aria-describedby="recommendation-error"
            >
              <option disabled value="">選択してください</option>
              <option v-if="recommendationQuantity" value="recommendation">おすすめ</option>
              <option value="normal">普通</option>
            </b-form-select>
          <b-form-invalid-feedback
            id="recommendation-error"
            aria-label="おすすめ度入力エラー"
            role="alert"
          >
            おすすめ度を選択してください
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-8">
          <label for="popularity">知名度</label>
          <p v-if="!popularityQuantity">※人気の登録は5件までです。現在5件なので普通のみ選択できます。</p>
            <b-form-select
              id="popularity"
              v-model="popularity"
              required
              :state="isValidPopularity"
              aria-describedby="popularity-error"
            >
              <option disabled value="">選択してください</option>
              <option v-if="popularityQuantity" value="major">人気</option>
              <option value="moderate">普通</option>
            </b-form-select>
          <b-form-invalid-feedback
            id="popularity-error"
            aria-label="知名度入力エラー"
            role="alert"
          >
            知名度を選択してください
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-8">
          <label for="genre">ジャンル</label>
            <b-form-select
              id="genre"
              v-model="genre"
              required
              :state="isValidGenre"
              aria-describedby="genre-error"
            >
              <option disabled value="">選択してください</option>
              <option value="action">アクション</option>
              <option value="suspense">サスペンス</option>
              <option value="sports">スポーツ</option>
              <option value="fantasy">ファンタジー</option>
              <option value="horror">ホラー</option>
              <option value="romance">恋愛</option>
            </b-form-select>
          <b-form-invalid-feedback
            id="genre-error"
            aria-label="ジャンル入力エラー"
            role="alert"
          >
            ジャンルを選択してください
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-8">
          <label for="quote">引用</label>
          <b-form-input
            id="quote"
            v-model="quote"
            required
            :state="isValidQuote"
            type="text"
            placeholder="例) ワンピースコミック1巻より"
            aria-describedby="quote-error"
          >
          </b-form-input>
          <b-form-invalid-feedback
            id="quote-error"
            aria-label="引用入力エラー"
            role="alert"
          >
            引用を入力してください
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-4">
          <label for="comic-file-uploader">
            表紙画像<br>
            <span>※登録可能なファイル形式は、「JPEG」のみです。</span>
          </label>
          <b-form-file
            id="comic-file-uploader"
            v-model="comicImageFile"
            accept="image/jpeg"
            browse-text="参照"
            class="mb-2"
            drop-placeholder="ファイルをここにドラッグ&ドロップしてください"
            placeholder="画像ファイルを選択してください"
            required
            :state="isValidComicImageFile"
            aria-describedby="comic-file-uploader-error"
          >
          </b-form-file>
          <b-form-invalid-feedback
            id="comic-file-uploader-error"
            :state="isValidComicImageFile"
            aria-label="画像ファイルのエラー"
            role="alert"
          >
            この画像ファイルは選択できません。
          </b-form-invalid-feedback>
          <b-img
            :blank="!comicImageFileEncoded"
            blank-color="#ccc"
            height="80"
            :src="comicImageFileEncoded"
            alt="アップロード画像"
          >
          </b-img>
        </b-form-group>
        <b-form-group class="mb-4">
          <label for="frame-file-uploader">
            コマ画像<br>
            <span>※登録可能なファイル形式は、「JPEG」のみです。</span>
          </label>
          <b-form-file
            id="frame-file-uploader"
            v-model="frameImageFile"
            accept="image/jpeg"
            browse-text="参照"
            class="mb-2"
            drop-placeholder="ファイルをここにドラッグ&ドロップしてください"
            placeholder="画像ファイルを選択してください"
            required
            :state="isValidFrameImageFile"
            aria-describedby="frame-file-uploader-error"
          >
          </b-form-file>
          <b-form-invalid-feedback
            id="frame-file-uploader-error"
            :state="isValidFrameImageFile"
            aria-label="画像ファイルのエラー"
            role="alert"
          >
            この画像ファイルは選択できません。
          </b-form-invalid-feedback>
          <b-img
            :blank="!frameImageFileEncoded"
            blank-color="#ccc"
            height="80"
            :src="frameImageFileEncoded"
            alt="アップロード画像"
          >
          </b-img>
        </b-form-group>
        <p
          v-if="isFailed"
          class="text-danger"
          role="alert"
        >
          登録に失敗しました。
        </p>
        <b-button
          block
          class="mt-3"
          :disabled="isPosting"
          type="submit"
          @click="onClick"
        >
          保存する
        </b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal,
  VBModal,
  BButton,
  BForm,
  BFormFile,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BImg,
  BFormSelect,
} from 'bootstrap-vue';
// import { postComic } from '@/services/comicService';
import { postComic } from '@/services/firebaseService';

// 状態の定数
const IS_DEFAULT = 'IS_DEFAULT';
const IS_POSTING = 'IS_POSTING'; // データを送信中
const IS_FAILED = 'IS_FAILED'; // データを送信できなかった

const encodeImage = (file) => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  });
};

export default {
  components: {
    BModal,
    BButton,
    BForm,
    BFormFile,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BImg,
    BFormSelect,
  },

  directives: { 'b-modal': VBModal },

  props: {
    comics: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      currentState: IS_DEFAULT,
      title: '',
      author: '',
      trial_read_url: '',
      recommendation: '',
      popularity: '',
      genre: '',
      quote: '',
      comicImageFile: null,
      comicImageFileEncoded: '',
      isValidComicImageFile: null,
      frameImageFile: null,
      frameImageFileEncoded: '',
      isValidFrameImageFile: null,
      postComicError: null,
      validated: false,
    };
  },

  computed: {
    isValidTitle() {
      /*
      <template></template>内の:stateと���び����いている
        validatedプロパティがfalse、またはtitle���ロパティが偽の場合にtrueを返す
        validatedプロパティが偽であるか、titleプロパティが未定義またはnullである場合にnullを返す
          上記の条件が満たされない場合、this.title.trim().length > 0 が評価される
          これは、titleプロパティの値をトリムして、その長さが 0 より大きい場合にtrueを返す
      */
      if (!this.validated || !this.title) return null;
      return this.title.trim().length > 0;
    },
    isValidAuthor() {
      if (!this.validated || !this.author) return null;
      return this.author.trim().length > 0;
    },
    isValidTrialReadUrl() {
      if (!this.validated || !this.trial_read_url) return null;
      return this.trial_read_url.trim().length > 0;
    },
    recommendationQuantity() {
      const recommendationCount = this.comics.filter((comic) => comic.recommendation === 'recommendation').length;
      if (recommendationCount < 7) return true;
      if (recommendationCount >= 7) return false;
      return '';
    },
    isValidRecommendation() {
      if (!this.validated || !this.recommendation) return null;
      return this.recommendation.trim().length > 0;
    },
    popularityQuantity() {
      const majorCount = this.comics.filter((comic) => comic.popularity === 'major').length;
      if (majorCount < 5) return true;
      if (majorCount >= 5) return false;
      return '';
    },
    isValidPopularity() {
      if (!this.validated || !this.popularity) return null;
      return this.popularity.trim().length > 0;
    },
    isValidGenre() {
      if (!this.validated || !this.genre) return null;
      return this.genre.trim().length > 0;
    },
    isValidQuote() {
      if (!this.validated || !this.quote) return null;
      return this.quote.trim().length > 0;
    },
    isValidInputs() {
      return this.isValidTitle
      && this.isValidAuthor
      && this.isValidTrialReadUrl
      && this.isValidRecommendation
      && this.isValidPopularity
      && this.isValidGenre
      && this.isValidQuote
      && this.isValidComicImageFile
      && this.isValidFrameImageFile;
    },
    isPosting() {
      return this.currentState === IS_POSTING;
    },
    isFailed() {
      return this.currentState === IS_FAILED;
    },
  },

  watch: {
    comicImageFile() {
      if (this.comicImageFile) {
        encodeImage(this.comicImageFile)
          .then((res) => {
            this.comicImageFileEncoded = res;
            this.isValidComicImageFile = true;
          })
          .catch((err) => {
            this.isValidComicImageFile = false;
            console.error(err.message);
          });
      } else {
        this.isValidComicImageFile = null;
      }
    },
    frameImageFile() {
      if (this.frameImageFile) {
        encodeImage(this.frameImageFile)
          .then((res) => {
            this.frameImageFileEncoded = res;
            this.isValidFrameImageFile = true;
          })
          .catch((err) => {
            this.isValidFrameImageFile = false;
            console.error(err.message);
          });
      } else {
        this.isValidFrameImageFile = null;
      }
    },
  },

  methods: {
    // 状態を変更する
    toDefault() {
      this.currentState = IS_DEFAULT;
    },
    toPosting() {
      this.currentState = IS_POSTING;
    },
    toFailed() {
      this.currentState = IS_FAILED;
    },

    onClick() {
      this.validated = true;
    },

    async onSubmit() {
      if (!this.isValidInputs) {
        return;
      }

      this.toPosting();

      // 書籍データをFirebaseに送信する
      let response = null;
      await postComic(
        this.title,
        this.author,
        this.trial_read_url,
        this.recommendation,
        this.popularity,
        this.genre,
        this.quote,
        this.comicImageFile,
        this.comicImageFileEncoded,
        this.frameImageFile,
        this.frameImageFileEncoded,
      ).then((data) => {
        response = data;

        this.toDefault();

        // TODO: カスタムイベントを発行する
        const {
          id,
          title,
          author,
          trialReadUrl,
          recommendation,
          popularity,
          genre,
          quote,
          comicImage,
          frameImage,
        } = response;
        this.$emit('add-comic', {
          id,
          title,
          author,
          trialReadUrl,
          recommendation,
          popularity,
          genre,
          quote,
          comicImage,
          frameImage,
        });

        this.hideModal();
        this.title = '';
        this.author = '';
        this.trial_read_url = '';
        this.recommendation = '';
        this.popularity = '';
        this.genre = '';
        this.quote = '';
        this.comicImageFile = null;
        this.comicImageFileEncoded = '';
        this.frameImageFile = null;
        this.frameImageFileEncoded = '';
        this.validated = false;
      })
        .catch((err) => {
          this.toFailed();
          console.error(err.message);
        });
    },

    hideModal() {
      this.$bvModal.hide('comic-registration-modal');
    },
  },
};
</script>

<style scoped>
::placeholder {
  color: #969696;
}
#comic-registration {
  display: inline;
}
button {
  padding: 0.4rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  background-color: #4c586f;
  color: #fff;
}
button:hover {
    opacity: .8;
}
button i {
  margin-right: 0.1rem;
}
</style>
