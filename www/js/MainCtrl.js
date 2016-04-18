'use strict';
angular.module('starter.controllers')

        .controller('MainCtrl', function ($scope, $state, $http, api, $ionicPopup, $localstorage, $ionicPopover) {
//            $scope.userID = $localstorage.get('userID');
            $scope.userID = "";
            console.log("hello");
            

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $scope.currentState = toState.name;
                console.log(fromState);
                console.log(toState);

                if (!$state.is('register') && !$state.is('resetpassword') && !$state.is('login')) {
                    console.log("success");

                    $http({
                        url: api.endpoint + 'GetNotificationListByUserIdRequest/' + $scope.userID,
                        method: 'GET'
                    }).then(function (response) {
                        console.log("YELLOW MELLOW YELLOW MELLOW YEEEEELLLLLLLOOOOOOOWWWWW MEEEEEELLLLLOOOWWWW");
                        console.log(response);

                        $scope.notificationList = response.data.reverse();
                        console.log("THIS IS THE NOTIFICATION LIST!!!!!!!");
                        console.log($scope.notificationList);
//                    $scope.message = $scope.notificationList.[0].message;

                        $scope.badgeCount = response.data.length;

                    });

                }
            });

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

            $scope.goToState = function (notification) {
                if (notification.message.indexOf("complete") > -1) {
                    $scope.notificationTab = "complete";
                } else {
                    $scope.notificationTab = "cancel";
                }
//                $state.go('tab.myjobs');
//                $scope.popover.hide();

                var index = $scope.notificationList.indexOf(notification);

                $http({
                    url: api.endpoint + 'DeleteNotificationRequest/' + notification.id,
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(function (response) {
                    if (response.data.isDeleted) {
                        $scope.notificationList.splice(index, 1);
//                                $state.go(notification.state, $stateParams, {reload: true, inherit: false});
                        $state.go('tab.myjobs');
                        $scope.popover.hide();

                    }
                });
            };

        })
        ;