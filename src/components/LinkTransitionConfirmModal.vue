<template>
  <div class="modal">
    <!-- モーダルの表示内容やボタンなどのUIを記述 -->
    <h4>外部リンク遷移の確認</h4>
    <p>
      外部試し読みサイトへ遷移します。<br>
      本当にいいですか？
    </p>
    <div class="d-flex justify-content-between button-wrapper">
      <button @click="confirm" class="modal-button-approval">はい</button>
      <button @click="cancel" class="modal-button-cancel">いいえ</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    externalLinkUrl: {
      type: String,
      required: true,
    },
  },

  methods: {
    confirm() {
      this.$emit('confirm', this.externalLinkUrl);
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
/* モーダル個別 */
.modal {
  z-index: 4;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  background-color: #ffffff;
  border: 0.1rem solid #E1E1E1;
  border-radius: 0.5rem;
  width: 80%;
  max-width: 30rem;
  height: 15rem;
}
.modal h4 {
  padding: 0.5rem 0 0.5rem 0.5rem;
  border-bottom: 0.1rem solid #969696;
}
.modal p {
  margin-top: 1rem;
  text-align: center;
}
.modal .button-wrapper {
  width: 22rem;
  margin: 1rem auto 0;
}
.modal button {
  width: 10rem;
  border-radius: 0.4rem;
}
.modal .modal-button-approval {
  background-color: transparent;
  border: 0.1rem solid #6C757D;
  color: #6C757D;
}
@media (min-width : 768px) {
  .modal .modal-button-approval:hover{
    background-color: #6C757D;
    color: white;
  }
}
.modal .modal-button-cancel {
  background-color: transparent;
  border: 0.1rem solid #6C757D;
  color: #6C757D;
}
@media (min-width : 768px) {
  .modal .modal-button-cancel:hover{
    background-color: #6C757D;
    color: white;
  }
}
</style>
