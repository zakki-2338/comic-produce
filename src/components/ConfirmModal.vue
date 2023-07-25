<template>
  <div class="modal">
    <!-- モーダルの表示内容やボタンなどのUIを記述 -->
    <h4>削除の確認</h4>
    <p>本当に削除してよろしいでしょうか？</p>
    <div class="d-flex justify-content-between button-wrapper">
      <button @click="confirm">削除</button>
      <button @click="cancel">キャンセル</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  methods: {
    confirm() {
      this.$emit('confirm', this.id);
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.modal {
  display: block;
  background-color: #F5F5F5;
  border: solid 1px #969696;
  border-radius: 2px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 300px;
  height: 150px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modal h4 {
  padding: 0.2rem 0 0 0.2rem;
  border-bottom: solid 1px #969696;
}
.modal p {
  margin-top: 1rem;
  text-align: center;
}
.modal .button-wrapper {
  width: 220px;
  margin: 1rem auto 0;
}
.modal button {
  border: solid 1px black;
  border-radius: 4px;
  width: 100px;
}
.modal button:hover{
  background-color: #C8C8C8;
}
</style>
