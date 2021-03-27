import firebase from '@/plugins/firebase'
const firestorage = firebase.storage()
const db = firebase.firestore()
const storageBucket = process.env.FB_STORAGE_BUCKET

export const actions = {

 uploadFile: async (context, payload) => {
      console.log('uploadFileなう')
      console.log(payload.fileName)
      console.log(payload.file)

      const uploadTask = await firestorage.ref(payload.fileName).put(payload.file)
                                    .then((snapshot) =>{
                                      // const card = db.collection("users").doc(payload.userId)
                                      const card = db.collection("test").doc("test")

                                      card.set({
                                        userId: "test",
                                        inputFileName: payload.fileName,
                                        inputFileUrl: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(payload.fileName)}?alt=media`,
                                      }, { merge: true })
                                    })
      return uploadTask
  },
}
