<template>
  <div class="main-wrapper">
    <div class="main-container">
      <h1>ログイン</h1>
      <span v-if="mailOrPassError">メールアドレスまたはパスワードが間違っています</span>
      <form id="login-form">
        <div id="mail">
          <label for="mail">メールアドレス</label>
          <input type="email" v-model="mail" required>
          <span v-if="hasError && !mail">メールアドレスを入力してください</span>
        </div>
        <div id="pass">
          <label for="pass">パスワード</label>
          <input type="password" v-model="pass" required>
          <span v-if="hasError && !pass">パスワードを入力してください</span>
        </div>
        <button type="button" @click="logIn" class="general-button">ログイン</button>
      </form>
    </div>
    <button
      id="return-top-from-login"
      class="general-button"
      type="button"
      @click="returnTopFromLogin"
    >
      トップページへ戻る
    </button>
  </div>
</template>

<script>
export default {
  props: {
    mailOrPassError: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    // 初期値を設定
    return {
      mail: '',
      pass: '',
      hasError: false,
    };
  },

  methods: {
    logIn() {
      if (!this.mail || !this.pass) {
        this.hasError = true;
        return;
      }
      this.$emit('log-in', this.mail, this.pass);
    },

    returnTopFromLogin() {
      this.$emit('return-top-from-Login');
    },
  },
};
</script>

<style scoped>
/* ログインページ共通 */
.main-wrapper .main-container span {
  color: red;
}

/* ログインページ個別 */
.main-wrapper {
  margin: 10% auto 0;
  width: 90%;
  max-width: 32rem;
}

.main-wrapper .main-container {
  width: 100%;
  padding: 2rem;
  border-radius: 1rem;
  background-color: #E1E1E1;
}

.main-wrapper .main-container h1{
  text-align: center;
}

.main-wrapper .main-container #login-form {
  margin: 2rem auto 0;
  width: 100%;
}
.main-wrapper .main-container #login-form #pass {
  margin-top: 1rem;
}
.main-wrapper .main-container #login-form input {
  display: block;
  padding: 0.3rem 0.5rem;
  width: 100%;
  height: 3.2rem;
  border-radius: 0.5rem;
  border: none;
}
.main-wrapper .main-container #login-form input:focus {
  border: solid 0.1rem black;
}
.main-wrapper .main-container #login-form button {
  margin: 2rem auto 0;
}

.main-wrapper #return-top-from-login {
  margin: 0 0 0 auto;
}
</style>
