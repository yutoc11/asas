import firebase from '~/plugins/firebase'
import { firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const statusRef = db.collection("test")

export const state = () => ({
  statuses: []
})

export const actions = {

    init: firestoreAction(({ bindFirestoreRef }) => {
        bindFirestoreRef('statuses', statusRef)
    }),

    popup: firestoreAction((context) => {
        statusRef.onSnapshot(function(snapshot){
            snapshot.docChanges().forEach(function(doc){
                console.log('けんち！')
                console.log(doc.data)
            })
        })
    })
}