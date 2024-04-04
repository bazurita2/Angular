import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Interview } from 'src/app/types/Interview';
import { UserService } from '../user.service';

const URL = environment.UrlService;
const GETINTERVIEW = URL + '/interviewgetbykey/';
const SETINTERVIEW = URL + '/interviewset';

@Injectable({
  providedIn: 'root'
})
export class DataBaseApiService {

  constructor(private http: HttpClient,
    private userService: UserService) {
    this.userService.user$.subscribe(user => this._userKey = user.key);
  }

  private _userKey?: string = '';

  public get userKey() {
    return this._userKey;
  }

  private _interview: Interview = {
    _id: '',
    key: '',
    name: '',
    questions: [],
    result: '',
    date_start: '',
    date_finish: ''
  };

  public get interview() {
    return this._interview;
  }

  public set interview(interview: Interview) {
    this._interview = interview;
  }

  public getInterview(): Observable<Interview> {
    return this.http.get<Interview>(GETINTERVIEW + this._userKey);
  }

  public setInterview(object: Interview): void {
    this.http.post<Interview>(`${SETINTERVIEW}`, object).subscribe(
      response => { }, error => { }
    );
  }
}
