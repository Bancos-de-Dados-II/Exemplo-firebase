import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, sendPasswordResetEmail, 
    sendEmailVerification, updateProfile, signOut} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import fs from 'fs';
import {} from 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);

async function criarUsuario(email, password){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      updateProfile(user, {emailVerified:false});
      sendEmailVerification(user).then(()=>{
        console.log('E-mail enviado');
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

// criarUsuario('f.freitas@ifpb.edu.br', '123456');

async function fazerLogin(email, password){
    await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    if(!user.emailVerified){
        console.log('Verificar e-mail');
        signOut(auth);
    }else{
        console.log('Bem vindo');
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });

  if(auth.currentUser != null){
    console.log('Há usuário ativo');
  }else{
    console.log("Não há usuário ativo");
  }

}

// fazerLogin('f.freitas@ifpb.edu.br', '123456');

async function recuperarSenha(email){
    sendPasswordResetEmail(auth, email)
  .then(() => {
    console.log('E-mail enviado');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage, errorCode);
  });
}

// recuperarSenha('f.freitas@ifpb.edu.br');

async function salvarImagem(){
  const imagemRef = ref(storage, 'imagens/logo.png');
  fs.readFile('ifpb.png', async (err, data)=>{
    uploadBytes(imagemRef, data).then((snapshot) => {
      console.log('Inserido');
    });
  });  
}

// salvarImagem();

async function baixaImagem(){
  const imagemRef = ref(storage, 'imagens/logo.png');
  getDownloadURL(imagemRef).then((url)=>{
    console.log(url);
  });
}

baixaImagem();