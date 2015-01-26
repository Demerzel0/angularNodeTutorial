'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
    'ngRoute',
    'ngResource',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers'

]).
config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'partials/partial1.html',
            controller: 'MyCtrl2'
        });
        $routeProvider.when('/view2', {
            templateUrl: 'partials/partial2.html',
            controller: 'MyCtrl2'
        });
        $routeProvider.otherwise({
            redirectTo: '/view1'
        });
    }
]);

app.factory('Bookmark', function ($resource) {
    return $resource('/bookmark/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    }); // Note the full endpoint address
});
app.factory('Tag', function ($resource) {
    return $resource('/tag/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    }); // Note the full endpoint address
});