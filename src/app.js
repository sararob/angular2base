var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/// <reference path="../node_modules/angular2/bundles/typings/angular2/angular2.d.ts" />
var angular2_1 = require('angular2/angular2');
var firebasepipe_1 = require('./firebasepipe');
var TodoList = (function () {
    function TodoList() {
        var self = this;
        self.todos = {};
        self.langPref = "british";
        self.todoDatabase = new Firebase("https://angular-connect.firebaseio.com/messages");
        self.translations = new Firebase("https://angular-connect.firebaseio.com/translations");
        self.authData = null;
        self.todoDatabase.on("child_added", function (snapshot) {
            var key = snapshot.key();
            self.todos[key] = snapshot.val();
        });
        self.todoDatabase.onAuth(function (user) {
            if (user) {
                self.authData = user;
            }
        });
    }
    TodoList.prototype.keys = function () {
        return Object.keys(this.todos);
    };
    TodoList.prototype.translate = function (message) {
        var translatedString = message;
        var startLang = this.langPref;
        var endLang;
        if (startLang === "british") {
            endLang = "american";
        }
        else {
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
    };
    TodoList.prototype.getLanguage = function ($event) {
        var selectedLanguage = $event.target.value;
        this.langPref = selectedLanguage;
    };
    TodoList.prototype.addMessage = function (message, user) {
        var newString = this.translate(message);
        this.todoDatabase.push({
            name: user,
            text: newString
        });
    };
    TodoList.prototype.doneTyping = function ($event) {
        if ($event.which === 13) {
            this.addMessage($event.target.value);
            $event.target.value = null;
        }
    };
    TodoList.prototype.authWithTwitter = function () {
        this.todoDatabase.authWithOAuthPopup("twitter", function (error, user) {
            this.authData = user;
        });
    };
    TodoList = __decorate([
        angular2_1.Component({
            selector: 'display'
        }),
        angular2_1.View({
            template: "\n\t  \t<div class=\"toolbar\">\n\t\t  <button class=\"md-raised md-primary\" (click)=\"authWithTwitter()\">Sign in with Twitter</button>\n\t\t  <span flex></span>\n\t\t  <span class=\"radio\">\n\t\t\t  American <input type=\"radio\" value=\"american\" name=\"pref\" (click)=\"getLanguage($event)\")/>\n\t\t\t  British <input type=\"radio\" value=\"british\" name=\"pref\" checked=\"checked\" (click)=\"getLanguage($event)\")/>\n\t\t  </span>\n\t\t</div>\n\t  <div class=\"message-input\">\n\t  \t<input #todotext>\n\t  \t<button (click)=\"addMessage(todotext.value, authData.twitter.username)\">Add Message</button>\n\t  </div>\n\t  <ul>\n\t  \t<li <li *ng-for=\"#key of 'https://angular-connect.firebaseio.com/messages' | firebasevalue:'child_added'\">\n\t  \t\t<strong>{{ key.name }}</strong>: {{ key.text }}\n\t  \t</li>\n\t  </ul>\n\t",
            directives: [angular2_1.NgFor],
            pipes: [firebasepipe_1.FirebaseOnValuePipe]
        }), 
        __metadata('design:paramtypes', [])
    ], TodoList);
    return TodoList;
})();
angular2_1.bootstrap(TodoList);
//# sourceMappingURL=app.js.map