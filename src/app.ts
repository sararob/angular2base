declare var require;
require('zone.js');
require('reflect-metadata');

import {Component, View, bootstrap, NgFor} from 'angular2/angular2';
import {FirebaseEventPipe} from './firebasepipe';
import {translations} from './translations';
@Component({
	selector: 'display',
	template: `
	  	<div>
		  <button [hidden]="isLoggedIn" class="twitter" (click)="authWithTwitter()">Sign in with Twitter</button>
		  <span class="radio">
			  <span class="pref">American English <input type="radio" value="american" name="pref" (click)="getLanguage($event)"/></span>
			  <span class="pref">British English <input type="radio" value="british" name="pref" checked="checked" (click)="getLanguage($event)"/></span>
		  </span>
		</div>
	  <div class="message-input">
	  	<input [hidden]="!isLoggedIn" #messagetext (keyup)="doneTyping($event)" placeholder="Enter a message...">
	  </div>
	  <ul class="messages-list">
		  <li *ng-for="#message of firebaseUrl | firebaseevent: 'child_added'">
		  	<strong>{{message.name}}</strong>: {{message.text}}
		  </li>
	  </ul>
	`,
	directives: [NgFor],
	pipes: [FirebaseEventPipe]
})
class MessageList {
	langPref: string;
	messagesRef: Firebase;
	isLoggedIn: boolean;
	authData: any;
	firebaseUrl: string;
	constructor() {
		this.langPref = "british";
		this.firebaseUrl = "https://angular-connect.firebaseio.com/messages";
		this.messagesRef = new Firebase(this.firebaseUrl);
		this.messagesRef.onAuth((user) => {
			if (user) {
				this.isLoggedIn = true;
				this.authData = user;
			}
		});
	}
	authWithTwitter() {
		this.messagesRef.authWithOAuthPopup("twitter", (error) => {
			if (error) {
				console.log(error);
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
		this.messagesRef.push({
			name: this.authData.twitter.username,
			text: newString
		});
	}
}
bootstrap(MessageList);