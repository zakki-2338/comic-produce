<template>
  <div class="main-container">
    <h1>ログイン</h1>
    <span v-if="hasError && mail && pass">メールアドレスまたはパスワードが間違っています</span>
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
      <button type="button" v-on:click="logIn" class="btn-submit">ログイン</button>
    </form>
  </div>
</template>

<script>
export default {
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
  },
};
</script>

<style scoped>
/* all */
h1 {
    font-size: 1.6rem;
}
label {
  display: block;
  margin: 0;
  font-size: 1rem;
}
span {
  font-size: 1rem;
  color: red;
}
input {
  display: block;
  padding: 0;
  height: 32px;
  width: 100%;
  border-radius: 5px;
  border: none;
}
input:focus {
  border: solid 0.1rem black;
}
button {
    display: block;
    padding: 0.5rem 2rem;
    font-size: 1rem;
    border-radius: 20px;
    border: none;
}
button:hover {
    cursor: pointer;
    opacity: 0.8;
}
.btn-submit {
    background-color: #4c586f;
    color: #fff;
}
.main-container {
  margin: 5rem auto;
  padding-bottom: 1rem;
  width: 320px;
  border-radius: 10px;
  background-color: #E1E1E1;
}
.main-container h1{
  padding-top: 1rem;
  text-align: center;
}
.main-container #login-form {
  margin: 2rem auto 0;
  width: 90%;
}
.main-container #login-form #pass {
  margin-top: 1rem;
}
span {
  white-space: pre-wrap;
}
.main-container #login-form button {
  margin: 2rem auto 0;
}
</style>
