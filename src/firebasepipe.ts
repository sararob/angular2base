import {ChangeDetectorRef, Component, ON_PUSH, Inject, Pipe, View, WrappedValue, bind, bootstrap} from 'angular2/angular2';

export const ALLOWED_FIREBASE_EVENTS = ['value', 'child_added'];

//TODO: create new reference if input string changes
//TODO: support once instead of on
//TODO: handle different events differently (like child_added)
//TODO: Should event be allowed to change?
@Pipe({
  name: 'firebasevalue'
})
export class FirebaseOnValuePipe {
  private _cdRef:ChangeDetectorRef;
  private _fbRef:Firebase;
  private _latestValue:any;
  private _latestReturnedValue:any;
  constructor(@Inject(ChangeDetectorRef) cdRef:ChangeDetectorRef) {
    this._cdRef = cdRef;
  }
  transform(value:string, args:string[]):any {
    if (!this._fbRef) {
      this._fbRef = new Firebase(value);
      this._fbRef.on(this._getEventFromArgs(args), snapshot => {
        this._latestValue = snapshot.val();
        this._cdRef.requestCheck();
      })
      return null;
    }

    if (this._latestValue === this._latestReturnedValue) {
      return this._latestValue;
    } else {
      this._latestReturnedValue = this._latestValue;
      return (<any>WrappedValue).wrap(this._latestReturnedValue);
    }

    return null;
  }
  onDestroy() {
    if (this._fbRef) {
      this._fbRef.off();
    }
  }

  _getEventFromArgs(args?:string[]) {
    //TODO(jeffbcross): fix this when args parsing doesn't add stupid quotes
    if (args[0] && args[0][0] === '"') {
      args[0] = args[0].replace(/"/g, '');
    }
    if (args && ALLOWED_FIREBASE_EVENTS.indexOf(args[0]) > -1) {
      return args[0];
    }
    throw `Not a valid event to listen to: ${args[0]}.
      Please provide a valid event, such as "child_added", by adding it as an
      argument to the pipe: "value | firebase:child_added".
      See https://www.firebase.com/docs/web/api/query/on.html for supported events.`

  }
}
