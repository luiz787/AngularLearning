import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey = environment.apiKey;

  user = new BehaviorSubject<User>(null);
  token: string = null;
  tokenExpirationTimer = null;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((authResponseData) => {
          this.handleAuthentication(
            authResponseData.email,
            authResponseData.localId,
            authResponseData.idToken,
            Number(authResponseData.expiresIn)
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((authResponseData) => {
          this.handleAuthentication(
            authResponseData.email,
            authResponseData.localId,
            authResponseData.idToken,
            Number(authResponseData.expiresIn)
          );
        })
      );
  }

  autoLogin() {
    const loadedUser = this.getUserFromStorage();

    if (loadedUser !== null && loadedUser.token) {
      this.user.next(loadedUser);
      this.autoLogout(loadedUser);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(user: User) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, user.millisecondsUntilTokenExpiration);
  }

  private getUserFromStorage(): User {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return null;
    }
    return new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ): void {
    console.log('Handling auth');
    const expirationInMillis = expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expirationInMillis);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.user.next(user);
    console.log('user nexted');
    this.autoLogout(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'An unknown error ocurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'The provided password is invalid!';
        break;
      case 'USER_DISABLED':
        break;
    }
    return throwError(errorMessage);
  }
}
