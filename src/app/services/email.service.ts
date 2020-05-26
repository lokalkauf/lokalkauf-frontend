import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { EMail } from '../models/email';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class EMailService {
  errorData: {};

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private analytics: AngularFireAnalytics
  ) {
    this.analytics.logEvent('email_service');
  }

  send(formdata: EMail, templateVars: {}) {
    // TODO update if firebase function changes

    const data = {
      fromName: formdata.fromName,
      fromEmail: formdata.fromEMail,
      toEmail: formdata.toEMail,
      toName: formdata.toName,
      title: formdata.title,
      templateId: formdata.tempalteId,
      templateIdCopy: formdata.templateIdCopy,
      teplateVars: templateVars,
    };
    try {
      const sendMailFunction = firebase.functions().httpsCallable(`sendGrid`);
      sendMailFunction.call('Send Mail', data);
    } catch (e) {
      console.error('Mail could not be send: ' + e);
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.

      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.

      // The response body may contain clues as to what went wrong.

      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    // return an observable with a user-facing error message

    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.',
    };
    return throwError(this.errorData);
  }
}
