'use strict';
angular.module('starter.controllers')

        .controller('NotificationCtrl', function ($scope, $state, $http, api, $ionicPopup, $ionicPopover) {
            // .fromTemplate() method
            var template = '<ion-popover-view><ion-header-bar> <h1 class="title">Notifications</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

            $scope.popover = $ionicPopover.fromTemplate(template, {
                scope: $scope
            });

            // .fromTemplateUrl() method
            $ionicPopover.fromTemplateUrl('templates/notification.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });


            $scope.openPopover = function ($event) {
                $scope.popover.show($event);
            };
            $scope.closePopover = function () {
                $scope.popover.hide();
            };
            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.popover.remove();
            });
            // Execute action on hide popover
            $scope.$on('popover.hidden', function () {
                // Execute action
            });
            // Execute action on remove popover
            $scope.$on('popover.removed', function () {
                // Execute action
            });
        })
        ;