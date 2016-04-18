angular.module('starter.controllers')

        .controller('AccountCtrl', function ($scope, $state, $http, $localstorage, $timeout, api, $ionicHistory, $ionicPopup, $ionicModal) {
            $scope.username = $localstorage.get('username');

            $scope.password = {
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            };

            console.log($scope.username);

//            $scope.viewAccount = function () {
            $http({
                url: api.endpoint + 'GetUserByUsernameRequest/' + $scope.username,
                method: 'GET'
            }).then(function (response) {
                console.log("ACCOUNT RESPONSE:" + response.data);
                $scope.user = response.data;
                $scope.originalUser = angular.copy($scope.user);
            });
//            }
            $scope.logout = function () {

                var confirmLogoutPopup = $ionicPopup.confirm({
                    title: 'Confirm Logout',
                    template: 'Do you want to log out?',
                    okType: 'button-calm'
                });
                confirmLogoutPopup.then(function (res) {
                    if (res) {
                        $state.go('login');
                        $timeout(function () {
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $localstorage.clear();
                        }, 300);
                        console.log('You are sure');
                    } else {
                        console.log('You are not sure');
                    }
                });


            }

            $scope.updateProfile = function () {
                var confirmUpdatePopup = $ionicPopup.confirm({
                    title: 'Confirm Profile Update',
                    template: 'Are you sure you want to update your profile?',
                    okType: 'button-calm'
                });

                confirmUpdatePopup.then(function (res) {
                    if (res) {
                        console.log('Yes Update');
                        $http({
                            url: api.endpoint + 'UpdateUserRequest',
                            method: 'PUT',
                            data: $scope.user,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }).then(function (response) {
                            if (response.data.isUpdated) {
                                $scope.originalUser = angular.copy($scope.user);
                                $scope.modal1.hide();
//                                $state.go('tab.account');
                            } else {
                                $scope.errorList = response.data.errorList;

                                var updateFailPopup = $ionicPopup.alert({
                                    title: 'Update Profile Failed',
                                    template: '<div ng-repeat="error in errorList"><font style="color: red">{{$index + 1}}. {{error}}</font></div>',
                                    scope: $scope,
                                    okType: 'button-calm'
                                });

//                        ngDialog.openConfirm({
//                            template: '/Wheels4Food/resources/ngTemplates/updateProfileError.html',
//                            className: 'ngdialog-theme-default dialog-generic',
//                            scope: $scope
//                        });
                            }
                        });
                    } else {
                        console.log('You are not sure');
                    }
                });
            }

            $scope.changePassword = function () {
                var confirmUpdatePopup = $ionicPopup.confirm({
                    title: 'Confirm Change Password',
                    template: 'Are you sure you want to change your password?',
                    okType: 'button-calm'
                });

                confirmUpdatePopup.then(function (res) {
                    if (res) {
                        console.log('Yes Change Password');
                        $http({
                            url: api.endpoint + 'ChangePasswordRequest',
                            method: 'PUT',
                            data: {
                                'username': $scope.username,
                                'oldPassword': $scope.password.oldPassword,
                                'newPassword': $scope.password.newPassword,
                                'confirmNewPassword': $scope.password.confirmNewPassword
                            },
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }).then(function (response) {
                            console.log(response.data.isChanged);
                            console.log($scope.oldPassword);
                            if (response.data.isChanged) {

                                //$scope.originalUser = angular.copy($scope.user);
                                $scope.modal2.hide();
                                $scope.password.oldPassword = "";
                                $scope.password.newPassword = "";
                                $scope.password.confirmNewPassword = "";
                                $scope.showAlert();
                            } else {
                                $scope.errorList = response.data.errorList;

                                var updateFailPopup = $ionicPopup.alert({
                                    title: 'Change Password Failed',
                                    template: '<div ng-repeat="error in errorList"><font style="color: red;text-align:left">{{$index + 1}}. {{error}}</font></div>',
                                    scope: $scope,
                                    okType: 'button-calm'
                                });

//                        ngDialog.openConfirm({
//                            template: '/Wheels4Food/resources/ngTemplates/updateProfileError.html',
//                            className: 'ngdialog-theme-default dialog-generic',
//                            scope: $scope
//                        });
                            }
                        });
                    } else {
                        console.log('You are not sure');
                    }
                });
            }

            $scope.showAlert = function () {
                var changePasswordSuccessfulPopup = $ionicPopup.alert({
                    title: 'Password Changed',
                    template: 'Your password has been changed successfully.',
                    okType: 'button-calm'

                });

                changePasswordSuccessfulPopup.then(function (res) {
                    console.log("Successfully changed");
//                                                $state.go($state.current, $stateParams, {reload: true, inherit: false});                                                

                });
            };


            $scope.cancel = function (index) {
                $scope.user = angular.copy($scope.originalUser);
                if (index == 1) {
                    $scope.modal1.hide();
                } else
                    $scope.modal2.hide();
                //$scope.modal2.hide();
            }

            $ionicModal.fromTemplateUrl('templates/editModal.html', {
                id: '1',
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal1 = modal;
            });

            $ionicModal.fromTemplateUrl('templates/changePasswordModal.html', {
                id: '2',
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal2 = modal;
            });


            $scope.openModal = function (index) {
                if (index === 1) {
                    $scope.modal1.show();
                } else {
                    $scope.modal2.show();
                }
            };

            $scope.closeModal = function () {
                if (index == 1) {
                    $scope.modal1.hide();
                } else
                    $scope.modal2.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal1.remove();
                $scope.modal2.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });
        })
        ;