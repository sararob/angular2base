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
        // var self = this;
        // self.todos = {};
        // self.todoDatabase = new Firebase("");
        // self.todoDatabase.on("child_added", function(snapshot) {
        // 	console.log(self.todos);
        // 	var key = snapshot.key();
        // 	self.todos[key] = snapshot.val();
        // });
    }
    TodoList.prototype.keys = function () {
        return Object.keys(this.todos);
    };
    TodoList.prototype.addTodo = function (todo) {
        this.todoDatabase.push(todo);
    };
    TodoList.prototype.doneTyping = function ($event) {
        if ($event.which === 13) {
            this.addTodo($event.target.value);
            $event.target.value = null;
        }
    };
    TodoList = __decorate([
        angular2_1.Component({
            selector: 'display'
        }),
        angular2_1.View({
            template: "\n\t  <p>Todos:</p>\n\t  <ul>\n\t  \t<li *ng-for=\"#key of 'https://test-stuff.firebaseio.com/angular2' | firebasevalue:'child_added'\">\n\t  \t\t{{ key }}\n\t  \t</li>\n\t  </ul>\n\t  <input #todotext>\n\t  <buton (click)=\"addTodo(todotext.value)\">Add Todo</button>\n\t",
            directives: [angular2_1.NgFor],
            pipes: [firebasepipe_1.FirebaseOnValuePipe]
        }), 
        __metadata('design:paramtypes', [])
    ], TodoList);
    return TodoList;
})();
angular2_1.bootstrap(TodoList);
//# sourceMappingURL=app.js.map