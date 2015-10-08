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
var MessageList = (function () {
    function MessageList() {
        var _this = this;
        this.messages = {};
        this.langPref = "british";
        this.messagesRef = new Firebase("https://angular-connect.firebaseio.com/messages");
        this.messagesRef.onAuth(function (user) {
            if (user) {
                _this.authData = user;
                _this.loggedIn = true;
            }
        });
    }
    MessageList.prototype.translate = function (message) {
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
    MessageList.prototype.getLanguage = function ($event) {
        var selectedLanguage = $event.target.value;
        this.langPref = selectedLanguage;
    };
    MessageList.prototype.doneTyping = function ($event) {
        if ($event.which === 13) {
            this.addMessage($event.target.value);
            $event.target.value = null;
        }
    };
    MessageList.prototype.addMessage = function (message) {
        var newString = this.translate(message);
        if (this.authData) {
            this.messagesRef.push({
                name: this.authData.twitter.username,
                text: newString
            });
        }
        else {
            console.log("You must login to post");
        }
    };
    MessageList.prototype.authWithTwitter = function () {
        this.messagesRef.authWithOAuthPopup("twitter", function (error, user) {
            if (error) {
                console.log(error);
            }
            else if (user) {
                this.authData = user;
            }
        });
    };
    MessageList = __decorate([
        angular2_1.Component({
            selector: 'display'
        }),
        angular2_1.View({
            template: "\n\t  \t<div>\n\t\t  <button [hidden]=\"loggedIn\" class=\"twitter\" (click)=\"authWithTwitter()\">Sign in with Twitter</button>\n\t\t  <span class=\"radio\">\n\t\t\t  <span class=\"pref\">American English <input type=\"radio\" value=\"american\" name=\"pref\" (click)=\"getLanguage($event)\")/></span>\n\t\t\t  <span class=\"pref\">British English <input type=\"radio\" value=\"british\" name=\"pref\" checked=\"checked\" (click)=\"getLanguage($event)\")/></span>\n\t\t  </span>\n\t\t</div>\n\t  <div class=\"message-input\">\n\t  \t<input [hidden]=\"!loggedIn\" #messagetext (keyup)=\"doneTyping($event)\" placeholder=\"Enter a message...\">\n\t  </div>\n\t  <ul class=\"messages-list\">\n\t\t  <li *ng-for=\"#key of 'https://angular-connect.firebaseio.com/messages' | firebaseevent: 'child_added'\">\n\t\t  \t<strong>{{key.name}}</strong>: {{key.text}}\n\t\t  </li>\n\t  </ul>\n\t",
            directives: [angular2_1.NgFor],
            pipes: [firebasepipe_1.FirebaseEventPipe]
        }), 
        __metadata('design:paramtypes', [])
    ], MessageList);
    return MessageList;
})();
angular2_1.bootstrap(MessageList);
//# sourceMappingURL=app.js.map