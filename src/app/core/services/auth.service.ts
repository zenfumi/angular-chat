import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  create(email: string, password: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        const { user } = credential;
        const actionCodeSettings = {
          url: `http://localhost:4200/?newAccount=true&email=${user.email}`
        };

        user.sendEmailVerification(actionCodeSettings);
      });
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential | void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => console.error(error));
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
