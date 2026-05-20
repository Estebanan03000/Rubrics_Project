import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { firebaseAuth } from "../config/firebase";
import { STORAGE_KEYS } from "../storage/storageKeys";

type SocialProvider = "google" | "microsoft" | "github";

class FirebaseAuthService {
  private async saveSocialSession(
    credential: UserCredential,
    provider: SocialProvider
  ) {
    const firebaseToken = await credential.user.getIdToken();

    const socialUser = {
      uid: credential.user.uid,
      name: credential.user.displayName,
      email: credential.user.email,
      photoURL: credential.user.photoURL,
      provider,
    };

    localStorage.setItem(STORAGE_KEYS.SOCIAL_TOKEN, firebaseToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN, firebaseToken);
    localStorage.setItem(STORAGE_KEYS.SOCIAL_USER, JSON.stringify(socialUser));
    localStorage.setItem(STORAGE_KEYS.AUTH_PROVIDER, provider);

    return socialUser;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(firebaseAuth, provider);

    return this.saveSocialSession(credential, "google");
  }

  async loginWithMicrosoft() {
    const provider = new OAuthProvider("microsoft.com");
    const credential = await signInWithPopup(firebaseAuth, provider);

    return this.saveSocialSession(credential, "microsoft");
  }

  async loginWithGithub() {
    const provider = new GithubAuthProvider();
    const credential = await signInWithPopup(firebaseAuth, provider);

    return this.saveSocialSession(credential, "github");
  }
}

export const firebaseAuthService = new FirebaseAuthService();