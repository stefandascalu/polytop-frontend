import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class MainService {

  constructor(private httpClient: HttpClient) {
  }

  public fetchFirstTable(): Observable<String> {
    return this.httpClient.get('./assets/statics/TabelLitere.txt', {responseType: 'text'});
  }

  public fetchHeader(filename: String): Observable<String> {
    return this.httpClient.get('./assets/statics/headers/' + filename, {responseType: 'text'});
  }

  public fetchFeedback(fileName: String): Observable<String> {
    return this.httpClient.get('./assets/statics/feedbacks/' + fileName, {responseType: 'text'});
  }
}
