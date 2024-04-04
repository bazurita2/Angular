import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../types/User';

const URL = environment.UrlService;
const GETUSER = URL + '/usergetbykey/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user$: BehaviorSubject<User> = new BehaviorSubject<User>({ key: '', name: '' });

  constructor(private http: HttpClient) { }

  private _is_userLoaded: boolean = false;

  public get is_userLoaded() {
    return this._is_userLoaded;
  }

  public set is_userLoaded(is_userLoaded: boolean) {
    this._is_userLoaded = is_userLoaded;
  }

  public getUser(user: User): void {
    this.http.get<User>(GETUSER + user.key)
      .subscribe(res => this.user$.next(res));
  }

  public resetUser(): void {
    this.user$.next({ key: '', name: '' });
  }

  public setUser(user: User): void {
    this.user$.next(user);
  }
}
