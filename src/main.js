import Vue from 'vue';
import './plugins/bootstrap-vue';
import firebase from 'firebase/app';
import App from './App.vue';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from './firebaseConfig';

Vue.config.productionTip = false;

firebase.initializeApp(firebaseConfig);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
