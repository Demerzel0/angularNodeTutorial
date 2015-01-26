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
            $scope.selectedTag = {};
            $scope.updateTags = function () {
                if ($scope.bookmark) {
                    $scope.tags = Tag.query({
                        ref_bookmark: $scope.bookmark.id
                    }, function () {
                        $scope.updateCompleteTagList();
                    });
                }
            };
            $scope.updateCompleteTagList = function () {
                $scope.completeTagList = Tag.query(function ($res) {
                    console.log("coucou", $scope.completeTagList)
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
            // update The tag list with the checked info
            $scope.$watch('selectedTag', function () {
                angular.forEach($scope.completeTagList, function (value) {
                    if ($scope.selectedTag[value.id]) {
                        value.isSelected = true;
                    } else {
                        value.isSelected = false;
                    }
                });
            }, true);
            $scope.keypressed = function ($event) {
                if (event.which === 13) {
                    $scope.addBookmark();
                }

            };
            $scope.tagFilter = function ($tagId) {
                var atLeastOneSelected = false,
                    filteredBookmarks = [];
                // afficher uniquement les éléments selectionnés par les checkboxs
                angular.forEach($scope.completeTagList, function (tag) {
                    if (tag.isSelected) {
                        angular.forEach($scope.bookmarks, function (bookmark) {
                            if (bookmark.id === tag.ref_bookmark) {
                                if ( filteredBookmarks.indexOf(bookmark) === -1){
                                    filteredBookmarks.push(bookmark);
                                }                                
                            }
                        });
                        $scope.filteredBookmarks = true;
                        atLeastOneSelected = true;
                    }
                });

                if (!atLeastOneSelected) {
                    $scope.filteredBookmarks = $scope.bookmarks;
                } else {
                    $scope.filteredBookmarks = filteredBookmarks;
                }

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