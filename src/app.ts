/// <reference path="../node_modules/angular2/bundles/typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap, NgFor} from 'angular2/angular2';
import {FirebaseEventPipe} from './firebasepipe';
@Component({
	selector: 'display'
})
@View({
	template: `
	  	<div>
		  <button [hidden]="loggedIn" class="twitter" (click)="authWithTwitter()">Sign in with Twitter</button>
		  <span class="radio">
			  <span class="pref">American English <input type="radio" value="american" name="pref" (click)="getLanguage($event)")/></span>
			  <span class="pref">British English <input type="radio" value="british" name="pref" checked="checked" (click)="getLanguage($event)")/></span>
		  </span>
		</div>
	  <div class="message-input">
	  	<input [hidden]="!loggedIn" #messagetext (keyup)="doneTyping($event)" placeholder="Enter a message...">
	  </div>
	  <ul class="messages-list">
		  <li *ng-for="#key of 'https://angular-connect.firebaseio.com/messages' | firebaseevent: 'child_added'">
		  	<strong>{{key.name}}</strong>: {{key.text}}
		  </li>
	  </ul>
	`,
	directives: [NgFor],
	pipes: [FirebaseEventPipe]
})

class MessageList {
	authData: Object;
	langPref: string;
	loggedIn: boolean;
	translations: Object;
	messagesRef: Firebase;
	constructor() {
		this.messages = {};
		this.langPref = "british";
		this.messagesRef = new Firebase("https://angular-connect.firebaseio.com/messages");
		this.messagesRef.onAuth((user) => {
			if (user) {
				this.authData = user;
				this.loggedIn = true;
			}
		});
	}
	translate(message: string): string {
		var translatedString = message;
		var startLang = this.langPref;
		var endLang;
		if (startLang === "british") {
			endLang = "american";
		} else {
			endLang = "british";
		}
		for (var word in translations) {
			var entry = translations[word];
			var wordToReplace = entry[startLang];
			var indexOfString = translatedString.indexOf(wordToReplace);
			if (indexOfString > -1) {
				var newTranslation = entry[endLang];
				var reg = new RegExp(wordToReplace, "gi");
				var newString = translatedString.replace(reg, newTranslation);
				translatedString = newString;
			}

		}
		return translatedString;
	}
	getLanguage($event) {
		var selectedLanguage = $event.target.value;
		this.langPref = selectedLanguage;
	}
	doneTyping($event) {
	  if($event.which === 13) {
	    this.addMessage($event.target.value);
	    $event.target.value = null;
	  }
	}
	addMessage(message: string) {
		var newString = this.translate(message);
		if (this.authData) {
			this.messagesRef.push({
				name: this.authData.twitter.username,
				text: newString
			});
		} else {
			console.log("You must login to post");
		}
	}
	authWithTwitter() {
		this.messagesRef.authWithOAuthPopup("twitter", () => {});
	}
}
bootstrap(MessageList);