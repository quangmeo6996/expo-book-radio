import {
  DocumentData,
  Query,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
} from 'firebase/firestore'
import { firebaseDB as db } from './index'
import { EQueryOperator } from './type'
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage'
import uuid from 'react-native-uuid'

// Document: https://firebase.google.com/docs/firestore/manage-data/structure-data
export interface IAddDocumentParams {
  collectionName: string
  documentId: string
}

const addDocument = async (collectionName: string, documentId: string | null, data: any) => {
  try {
    if (documentId) {
      await setDoc(doc(db, collectionName, documentId), {
        ...data,
        id: documentId,
      })
      return
    } else {
      const newRef = doc(collection(db, collectionName))
      // later...
      await setDoc(newRef, { ...data, id: newRef.id })
    }
  } catch (err) {
    console.log(err)
  }
}

const deleteDocument = async (collectionName: string, documentId: string) => {
  try {
    const docRef = doc(db, collectionName, documentId)
    await deleteDoc(docRef)
    console.log(`Document with ID ${documentId} has been deleted.`)
  } catch (err) {
    console.error('Error deleting document:', err)
  }
}

const updateDocument = async (collectionName: string, documentId: string, data: any) => {
  try {
    const currentRef = doc(db, collectionName, documentId)
    if (currentRef) {
      await updateDoc(currentRef, data)
    }
    // Set the "capital" field of the city 'DC'
  } catch (err) {
    console.log(err)
  }
}

const getOneDocument = async <T>(collectionName: string, documentId: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, documentId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as T
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!')
    return null
  }
}

const getAllDocuments = async <T>(collectionName: string): Promise<T | null> => {
  try {
    const allDocs: any = []
    const querySnapshot = await getDocs(collection(db, collectionName))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      allDocs.push(doc.data())
    })
    return allDocs
  } catch (err) {
    console.log(err)
    return null
  }
}

export interface IQueryOptions {
  property: string
  queryOperator: EQueryOperator
  value: any
}

const queryDocuments = async <T>(
  collectionName: string,
  options: IQueryOptions,
): Promise<T | null> => {
  try {
    const allDocs: any = []
    const q = query(
      collection(db, collectionName),
      where(options.property, options.queryOperator, options.value),
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      allDocs.push(doc.data())
    })
    return allDocs
  } catch (err) {
    console.log(err)
    return null
  }
}
const customQueryDocuments = async (q: Query<DocumentData, DocumentData>) => {
  try {
    const allDocs: any = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      allDocs.push(doc.data())
    })
    return allDocs
  } catch (err) {
    console.log(err)
    return null
  }
}

const uploadImagesToStorage = async (uri: string): Promise<string> => {
  const imgName = uuid.v4() as string

  const storage = getStorage()
  const storageRef = ref(storage, `images/${imgName}`)

  // Convert the image URI to a blob
  const response = await fetch(uri)
  const blob: any = await response.blob()

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, blob)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optional: Handle upload progress here
      },
      (error) => {
        // Handle unsuccessful uploads
        blob.close?.() // Ensure blob is closed even if there's an error
        reject(new Error(`Upload failed: ${error.message}`))
      },
      async () => {
        try {
          // When the upload is complete, get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          blob.close?.() // Release blob memory after successful upload
          resolve(downloadURL)
        } catch (error: any) {
          blob.close?.()
          reject(new Error(`Failed to get download URL: ${error.message}`))
        }
      },
    )
  })
}

export {
  addDocument,
  updateDocument,
  getOneDocument,
  getAllDocuments,
  queryDocuments,
  customQueryDocuments,
  uploadImagesToStorage,
  deleteDocument,
}
