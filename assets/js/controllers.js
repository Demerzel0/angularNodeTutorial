'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('MyCtrl1', ['$scope',
    function ($scope) {
        $scope.firstName = "tutu";
    }
])
    .controller('MyCtrl2', ['$scope', 'Bookmark', 'Tag',
        function ($scope, Bookmark, Tag) {
            // INIT *********************************************
            /*            var bookmark = Bookmark.get({
                id: 1
            }, function () {
                $scope.test = bookmark.url
                console.log(bookmark);
            });*/
            /*            var entries = Bookmark.query(function () {
                console.log(entries);
            });*/
            /*            
            console.log(entries);*/

            $scope.updateTags = function () {
                if ($scope.bookmark) {
                    console.log($scope.bookmark)
                    $scope.tags = Tag.query({
                        ref_bookmark: $scope.bookmark.id
                    }, function () {
                        $scope.updateCompleteTagList();
                    });
                }
            };
            $scope.updateCompleteTagList = function () {
                $scope.completeTagList = Tag.query(function ($res) {
                    console.log("coucou", $res)
                });
            };
            $scope.updateCompleteTagList();

            $scope.updateBookmarks = function () {
                $scope.bookmarks = Bookmark.query();
            };
            $scope.updateBookmarks();
            $scope.filteredBookmarks = $scope.bookmarks;
            // action *********************************************
            $scope.$watch('bookmark', function () {
                $scope.updateTags();
            });
            $scope.keypressed = function ($event) {
                if (event.which === 13) {
                    $scope.addBookmark();
                }

            };
            $scope.filterList = [];
            $scope.tagFilter = function ($ref_bookmarkId, $tagId) {
                var i,
                    tagIndex = $scope.filterList.indexOf($ref_bookmarkId),
                    tempFilteredBookmark = [];
// TODO maintenir une structure plus complexe pour les filtre toggle ou pas (sur l'id du tag)
                // on trouve si c'est un ajout ou une suppression
                if (tagIndex === -1) {
                    $scope.filterList.push($ref_bookmarkId);
                } else {
                    $scope.filterList.splice($ref_bookmarkId, 1);
                }
                // on parcours tous les bookmark et on ajoute dans la nouvelle list tous ceux 
                for (var key in $scope.bookmarks) {
                    if ($scope.bookmarks.hasOwnProperty(key)) {
                        for (i = 0; i < $scope.filterList.length; i++) {
                            if ($scope.bookmarks[key].id === $scope.filterList[i]) {
                                tempFilteredBookmark.push($scope.bookmarks[key])
                                console.log(tempFilteredBookmark)
                            }
                        }

                       
                    }
                }
                console.log("filterlist",$scope.filterList)
                $scope.filteredBookmarks = tempFilteredBookmark;

            };
            $scope.addBookmark = function () {
                $scope.bookmark = new Bookmark();
                $scope.bookmark.url = $scope.bookmarkToAdd;
                Bookmark.save($scope.bookmark, function ($res) {
                    console.log("just saved : ", $res)
                    $scope.bookmark = $res;
                    $scope.updateBookmarks();
                });
            }
            $scope.addTag = function () {
                if ($scope.bookmark) {
                    $scope.tag = new Tag();
                    $scope.tag.tagName = $scope.tagToAdd;
                    $scope.tag.ref_bookmark = $scope.bookmark.id;
                    Tag.save($scope.tag, function ($res) {
                        console.log("just saved : ", $res)
                        $scope.updateTags();
                    });
                } else {
                    window.alert("no bookmark created or selected")
                }
            }
            $scope.removeTag = function ($tagId) {

                Tag.delete({
                    id: $tagId
                }, function () {
                    $scope.updateTags();
                });

            }

        }
    ]);