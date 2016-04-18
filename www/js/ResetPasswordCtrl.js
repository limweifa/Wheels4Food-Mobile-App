angular.module('starter.controllers')
        
        .controller('ResetPasswordCtrl', function ($scope, $state, $http, api, $ionicPopup) {
            $scope.data = {
                email : ""
            }
            
            $scope.submit = function () {
                console.log("in submit method");
                $http({
                    url: api.endpoint + 'CreatePendingResetPasswordRequest',
                    method: 'POST',
                    data: {
                        'email': $scope.data.email,
                        'endPoint': api.baseUrl
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    console.log("inside reset password");

                    if (response.data.isCreated) {
                        console.log("successfully reset password");
                        //$scope.submitFailed = false;

                        var resetPasswordSuccessPopup = $ionicPopup.alert({
                            title: 'Reset Password Successful',
                            template: '<div class="text-center">An email has been sent to {{data.email}} with the instructions to reset your password.</div>',
                            scope: $scope,
                            okType: 'button-calm'
                        });

                        resetPasswordSuccessPopup.then(function () {
                            $state.go('login');
                        });

                    } else {
                        console.log($scope.error);
                        $scope.error = response.data.errorList[0];
                        //$scope.submitFailed = true;
                        var resetPasswordFailPopup = $ionicPopup.alert({
                            title: 'Reset Password Failed',
                            template: '<div ng-repeat="error in errorList"><font style="color: red">{{$index + 1}}. {{error}}</font></div>',
                            scope: $scope,
                            okType: 'button-calm'
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
            };

        })
        ;