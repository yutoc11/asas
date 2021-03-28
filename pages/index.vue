<template lang="pug">
  .audio-upload-test 音声アップロードのテスト
    section.tw-mx-auto.tw-my-5(v-if="!isAuthenticated")
      .quick-start-message.tw-text-center ＼Googleアカウントではじめてみる／
      .tw-flex.tw-justify-center
        button.login-button.align-center.tw-bg-blue-500.tw-text-white.tw-px-4.tw-py-2.tw-my-2.tw-rounded-full.tw-select-none(
            class="hover:tw-opacity-75"
            @click="googleLogin"
            ) グーグルでログイン
    section.tw-mx-auto.tw-my-5
      div(v-if="isAuthenticated")
        .tw-text-center ログインしているユーザー
        .tw-text-center {{ $store.state.user.uid }}
        .tw-text-center {{ $store.state.user.email }}
        .tw-flex.tw-justify-center
          button.login-button.align-center.tw-bg-blue-500.tw-text-white.tw-px-4.tw-py-2.tw-my-2.tw-rounded-full.tw-select-none(
              class="hover:tw-opacity-75"
              @click="logOut"
              ) ログアウト
      div(v-else)
        .tw-text-center ログインしていません
    //- .cover-loading-wrapperaudio-upload(v-if="isLoadingCover")
      content-loader(:width="100" :height="52.5")
        rect(width="100%" height="100%")

    //- .cover-change-wrapper(v-show="coverImage")
      user-cover(:coverImage="coverImage" :isDashbord="isDashbord" v-on:coverChange="fileInput" @loadedCover="loadedCover")
      .change-button-wrapper
        .change-button.underline-link.confirm-button(v-if="coverPreviewImage" @click="fileUpload('cover')") 変更確定

    section.tw-mx-auto.tw-my-5
      .audio-upload-wrapper
        .audio-upload(v-if="!inputFile")
          //- (v-if="!coverImage && !isLoadingCover")
          .audio-upload-icon-wrapper
            .audio-upload-icon
              span
                svg(viewBox="0 0 24 24")
                  path(:d="iconFileMusic")
          input.input-file(@change="fileInput($event)" type="file")
        .cancel-button.tw-mx-auto.tw-flex.tw-justify-center(v-else)
            button.tw-bg-blue-500.tw-text-white.tw-px-4.tw-py-2.tw-my-2.tw-rounded-full.tw-select-none(
              class="hover:tw-opacity-75"
              v-if="isSetFile" @click="cancelFile()"
              ) ファイルをリセット
      .change-button.tw-mx-auto.tw-flex.tw-justify-center
        button.tw-bg-blue-500.tw-text-white.tw-px-4.tw-py-2.tw-my-2.tw-rounded-full.tw-select-none(
          class="hover:tw-opacity-75"
          v-if="isSetFile" @click="fileUpload()"
          ) Cloud Storageに保存、何分割？
    section.tw-mx-auto.tw-my-5
      .no-split-length(v-if="currentData.splitLength == 0") 分割してないよ！
      div(v-else).tw-mx-auto
        .split-length.tw-text-center 分割数：{{ currentData.splitLength }}
        .split-sst-button.tw-mx-auto.tw-flex.tw-justify-center
          button.tw-bg-blue-500.tw-text-white.tw-px-4.tw-py-2.tw-my-2.tw-rounded-full.tw-select-none(
            class="hover:tw-opacity-75"
            @click="splitStt()"
            ) この分割数で文字起こしする
    section.tw-mx-auto.tw-my-5
      .tw-mx-auto(v-for="(item, index) in splitDataArray" :key="index")
        .test {{ item.description }}
        a.test(:href="item.splitFileUrl" target="_blank") {{ item.splitFileUrl }}
    section.tw-mx-auto.tw-my-5
      .tw-mx-auto(v-for="(item, index) in splitDataArray" :key="index")
        .test.tw-mb-2.tw-text-center {{ item.description }}

    .bar-wrapper
      .moving-bar.tw-mx-auto.tw-py-20.tw-px-20
        vue-slider(v-model="value" :min-range="0" :tooltip="'none'" )
          template(v-slot:process="{ start, end, style, index }")
            .vue-slider-process(:style="style")
              .merge-tooltip.vue-slider-dot-tooltip-inner.vue-slider-dot-tooltip-inner-top(v-if="index==0") {{ value[index+1] }} - {{ value[index] }}
      //- .test-audio-source
        audio(controls autoplay type="audio/mpeg" src="https://firebasestorage.googleapis.com/v0/b/asas-50dbf.appspot.com/o/output4.mp3?alt=media")

    av-waveform(
      v-if="writeWave"
      caps-color="#FFF"
      canv-class="audio-canvas"
      audio-class="audio-control"
      :bar-color="['#f00', '#ff0', '#0f0']"
      canv-fill-color="#000"
      :caps-height="2"
      :audio-src="waveAudio"
      canv-width="600"
      canv-height="50"
      )
    section
      .test#audio-canvas うふふ
</template>
<script lang="js">
import { mdiFileMusicOutline } from '@mdi/js';
import firebase from '~/plugins/firebase'
// import store from '~/store/index.js'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {

  name: 'Index',

  props: {
    mdiFileMusicOutline: {
      type: String,
      required:  false,
    }
  },

  components: {
  },

  data(){
      return{
        isOpenPage: true,
        isLoadingCover: true,
        iconFileMusic: mdiFileMusicOutline,
        isSetFile: false,
        inputFile: '',
        currentData: {
          splitLength: 0,
          userId: '',
          inputFileName: '',
          inputFileUrl: '',
          splitData: ''
        },
        // vue-slider-component
        splitDataArray: [],
        value: [0, 100],
        // process: val => [ [val[0], val[1]] ]
        // wavesurferのテスト
        options: {
        },
        // file: 'output9.mp3',
        waveAudio: null,
        writeWave: false,
      }
  },

  computed:{
    ...mapState(['user']),
    ...mapGetters(['isAuthenticated']),

  },

  created: function() {
    const db = firebase.firestore()
    db.collection("test").doc("test")
    .onSnapshot((doc) => {
        const currentData = doc.data()
        this.currentData = currentData
        console.log(this.currentData)
        let split_data_json = this.currentData['splitData']
        this.splitDataArray = JSON.parse(split_data_json)
    });
  },

  beforeMount(){
    firebase.auth().onAuthStateChanged((user)=> {
      if (user) {
        this.setUser(user)
        console.log(this.$store.state.user);
        // this.$router.push('/dashbord')
      }
    })
  },

  mounted(){

    const storage = firebase.storage()
    const storageRef = storage.ref()

    // storageRef.child('output4.mp3').getDownloadURL().then((url) => {
    //   console.log("中はいった！")
    //   // `url` is the download URL for 'images/stars.jpg'

    //   // This can be downloaded directly:
    //   var xhr = new XMLHttpRequest();
    //   xhr.responseType = 'blob';
    //   xhr.onload = function(event) {
    //     var blob = xhr.response;
    //   };
    //   xhr.open('GET', url);
    //   xhr.send();

    //   // Or inserted into an <img> element:
    //   this.waveAudio = url;
    //   console.log(url)
    //   this.nextTick(() => {
    //     console.log('再描写');  // hello   DOM更新後にこのコードに到達する 
    //   });
    // }).catch((error) => {
    //   // Handle any errors
    //   console.log('エラー')
    // });
  },

  methods: {

    cancelFile() {
      this.inputFile = ''
      this.waveAudio = null
      this.isSetFile = false
      this.writeWave = false
    },

    fileInput(e){

      // アップロード対象は1件のみとする
      console.log('fileInput発火なう')
      this.isSetFile = true;
      this.inputFile = (e.target.files || e.dataTransfer.files)[0];
      console.log(this.inputFile);
      this.waveAudio = URL.createObjectURL(this.inputFile)
      console.log(this.waveAudio)
      this.writeWave = true
      console.log(this.writeWave)
    },

    fileUpload() {

      // const userId = this.$store.state.user.uid;

          const inputFile = this.inputFile;
          if (inputFile != null) {
            const fileName = inputFile.name
            console.log('ファイルネームは？')
            console.log(fileName)
            this.$store.dispatch('persona/uploadFile', {
              fileName: fileName,
              file: inputFile,
              // userId: userId,
            })
            // this.isChangeUserData = true;
            // this.coverPreviewImage = false;
          //this.coverImage = false;
          }
    },

    splitStt() {
      this.$store.dispatch('callApi', {
        url: 'split_and_stt',
        method: 'post',
        params: {
            userId: 'test'
        }
      })
    },

    ...mapActions(['setUser']),

    googleLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
      .then(user => {
        this.setUser(user)
        console.log(this.$store.state.user);
        // this.$router.push('/dashbord')
      }).catch((error) => {
        alert(error)
      });
    },

    //ログアウト
    logOut(){
      //this.isSetuserData =  false;
      firebase.auth().signOut()
      .then(() => {
        this.setUser(null) 
        //this.$router.push('/?flash=logout')
        this.$router.push('/')
      }).catch((error) => {
        alert(error)
      })
    },

  }

}
</script>

<style lang="scss">

.merge-tooltip {
  position: absolute;
  left: 50%;
  bottom: 45px;
  transform: translate(-50%, -15px);
}

.vue-slider-dot-handle::after {
  content:"";
  width: 2px;
  height: 45px;
  position: absolute;
  background: rgba(14, 165, 233, 0.5);
  bottom: 14px;
  left: 6px;
}
.vue-slider::after {
  content:"";
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 11px;
  background: rgba(14, 165, 233, 0.1);
}

.audio-control {
  display: none;
}




.cover-image.input-label {
  color: $white;
  @include font-size(12);
}

.test-icon {
  width: 30px;
}

.audio-upload-icon{
  position: absolute;
  top: 100px;
  width: 30px;
  height: 30px;
}

.audio-upload-icon-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}

.audio-upload{
  position: relative;
  margin: 10px auto;
  border: 2px dotted $gray;
  width: 432px;
  height: 226.8px;

  input.input-file{
    opacity: 0;
    width: 432px;
    height: 226.8px;
    cursor: pointer;
  }

}

.cover-loading-wrapper.audio-upload{
  border: none;
}
</style>
