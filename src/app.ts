/// <reference path="../node_modules/angular2/bundles/typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap, NgFor} from 'angular2/angular2';
import {FirebaseOnValuePipe} from './firebasepipe';
@Component({
	selector: 'display'
})
@View({
	template: `
	  	<div class="toolbar">
		  <button class="md-raised md-primary" (click)="authWithTwitter()">Sign in with Twitter</button>
		  <span flex></span>
		  <span class="radio">
			  American <input type="radio" value="american" name="pref" (click)="getLanguage($event)")/>
			  British <input type="radio" value="british" name="pref" checked="checked" (click)="getLanguage($event)")/>
		  </span>
		</div>
	  <div class="message-input">
	  	<input #todotext>
	  	<button (click)="addMessage(todotext.value, authData.twitter.username)">Add Message</button>
	  </div>
	  <ul>
	  	<li <li *ng-for="#key of 'https://angular-connect.firebaseio.com/messages' | firebasevalue:'child_added'">
	  		<strong>{{ key.name }}</strong>: {{ key.text }}
	  	</li>
	  </ul>
	`,
	directives: [NgFor],
  pipes: [FirebaseOnValuePipe]
})

class TodoList {
	todos: Dictionary;
	todoDatabase: Firebase;
	translations: Firebase;
	authData: Object;
	langPref: string;
	constructor() {
		var self = this;
		self.todos = {};
		self.langPref = "british";
		self.todoDatabase = new Firebase("https://angular-connect.firebaseio.com/messages");
		self.translations = new Firebase("https://angular-connect.firebaseio.com/translations")
		self.authData = null;
		self.todoDatabase.on("child_added", function(snapshot) {
			var key = snapshot.key();
			self.todos[key] = snapshot.val();
		});
		self.todoDatabase.onAuth(function(user) {
			if (user) {
				self.authData = user;
			}
		});
	}
	keys(): Array<string> {
		return Object.keys(this.todos);
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
	addMessage(message: string, user: string) {
		var newString = this.translate(message);
		this.todoDatabase.push({
			name: user,
			text: newString
		});
	}
	doneTyping($event) {
		if ($event.which === 13) {
			this.addMessage($event.target.value);
			$event.target.value = null;
		}
	}
	authWithTwitter() {
		this.todoDatabase.authWithOAuthPopup("twitter", function(error, user) {
			this.authData = user;
		});
	}
}

interface Dictionary {
	[ index: string ]: string
}

bootstrap(TodoList);