import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessService } from '../../processes/services/process.service';

@Injectable()
export class FlowLoadService {
  constructor(private http: HttpClient, private processService: ProcessService) { }

  headers = new HttpHeaders().set('Content-Type', 'text/xml');

  load(url) {
    return this.http.get(url,
      { headers: this.headers, responseType: 'text' }
    );
  }
}
