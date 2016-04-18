angular.module('starter.controllers')

        .controller('JobsCtrl', function ($scope, $state, $stateParams, $http, $filter, $localstorage, api, $ionicPopup, $ionicModal) {
            console.log($state);
            // console.log("JobsCtrl");
            $scope.username = $localstorage.get('username');
            $scope.userID = $localstorage.get('userID');
            $scope.organizationName = $localstorage.get('organizationName');

            $scope.isValidPickupTime = true;
            $scope.isValidDeliveryTime = true;
            $scope.pickupBeforeDelivery = true;

            console.log("ORGANIZATION NAME IS: " + $scope.organizationName);

            $scope.doRefresh = function () {
                $http({
                    //url: api.endpoint + 'GetJobListByUserIdRequest/' + $scope.userID,
                    url: api.endpoint + 'GetJobListByOrganizationNameRequest/' + $scope.organizationName,
                    method: 'GET'
                }).then(function (response) {
                    $scope.jobList = response.data;
                });

                $http({
                    url: api.endpoint + 'GetDemandItemListRequest',
                    method: 'GET'
                }).then(function (response) {
                    $scope.demandItemList = response.data;
                    console.log("GetDemandItemListRequest SUCCESS");
                    console.log($scope.demandItemList);
                }).finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            $http({
                //url: api.endpoint + 'GetJobListRequest',
                url: api.endpoint + 'GetJobListByOrganizationNameRequest/' + $scope.organizationName,
                method: 'GET'
            }).then(function (response) {
                $scope.jobList = response.data;
                console.log("JOBLIST");
                console.log(response.data);
//                $scope.currentPage = 1;
//                $scope.pageSize = 10;
            });

            $http({
                url: api.endpoint + 'GetDemandItemListRequest',
                method: 'GET'
            }).then(function (response) {
                $scope.demandItemList = response.data;
                console.log("GetDemandItemListRequest SUCCESS");
                console.log($scope.demandItemList);
            });

            $scope.view = function (job) {
                $http({
                    url: api.endpoint + 'GetDemandItemListByDemandIdRequest/' + job.demand.id,
                    method: 'GET'
                }).then(function (response) {
                    $scope.currentDemandItemList = response.data;
                });

                $http({
                    url: api.endpoint + 'GetJobByIdRequest/' + job.id,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(function (response) {
                    $scope.currentJob = response.data;

                    if ($scope.currentJob.timeslot === '9AM-12PM') {
                        $scope.inputEpochTime = 1460883600;
                    } else {
                        $scope.inputEpochTime = 1460901600;
                    }

                    $scope.timePickerObjectPickup = {
                        //inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
                        inputEpochTime: $scope.inputEpochTime,
                        step: 10, //Optional
                        format: 12, //Optional
                        titleLabel: 'Please indicate approximate pickup time between ' + $scope.currentJob.timeslot, //Optional
                        setLabel: 'Set', //Optional
                        closeLabel: 'Close', //Optional
                        setButtonType: 'button-calm', //Optional
                        closeButtonType: 'button-stable', //Optional
                        callback: function (val) {    //Mandatory
                            $scope.timePickerPickupCallback(val);
                        }
                    };

                    $scope.timePickerObjectDeliver = {
                        //inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
                        inputEpochTime: $scope.inputEpochTime,
                        step: 10, //Optional
                        format: 12, //Optional
                        titleLabel: 'Please indicate approximate delivery time between ' + $scope.currentJob.timeslot, //Optional
                        setLabel: 'Set', //Optional
                        closeLabel: 'Close', //Optional
                        setButtonType: 'button-calm', //Optional
                        closeButtonType: 'button-stable', //Optional
                        callback: function (val) {    //Mandatory
                            $scope.timePickerDeliverCallback(val);
                        }

                    };

                    $scope.deliveryDate = $scope.currentJob.deliveryDate;

                    $scope.timePickerPickupCallback = function (val) {
                        if (typeof (val) === 'undefined') {
                            console.log('Time not selected');
                        } else {
                            var selectedTime = new Date(val * 1000 - 8 * 60 * 60 * 1000);
                            //console.log('Selected PICKUP epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                            $scope.collectionTime = $filter('date')(selectedTime, 'HH:mm a');
                            $scope.collectionTimeTwelveHours = $filter('date')(selectedTime, 'hh:mm a');
                            $scope.pickupHours = parseInt($filter('date')(selectedTime, 'hh'));
                            $scope.pickupMinutes = parseInt($filter('date')(selectedTime, 'mm'));
//                            $scope.pickupPeriod = parseInt($filter('date')(selectedTime, 'a'));
                            console.log("PICKUPHOURS: " + $scope.pickupHours + " TYPE: " + typeof($scope.pickupHours));
                            console.log($scope.pickupMinutes);
                            console.log($scope.pickupPeriod);
                        }
                    }

                    $scope.timePickerDeliverCallback = function (val) {
                        if (typeof (val) === 'undefined') {
                            console.log('Time not selected');
                        } else {
                            var selectedTime = new Date(val * 1000 - 8 * 60 * 60 * 1000);
                            //console.log('Selected DELIVERY epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                            $scope.deliveryTime = $filter('date')(selectedTime, 'HH:mm a');
                            $scope.deliveryTimeTwelveHours = $filter('date')(selectedTime, 'hh:mm a');
                            $scope.deliveryHours = parseInt($filter('date')(selectedTime, 'hh'));
                            $scope.deliveryMinutes = parseInt($filter('date')(selectedTime, 'mm'));
//                            $scope.deliveryPeriod = parseInt($filter('date')(selectedTime, 'a'));
                        }
                    }

                });
                $scope.modal.show();
            };

            $scope.acceptJob = function (job) {
                console.log("In accept job method liao")
                $http({
                    url: api.endpoint + 'AcceptJobRequest',
                    method: 'PUT',
                    data: {
                        'jobID': job.id,
                        'userID': $scope.userID,
                        'collectionTime': $scope.collectionTime,
                        'deliveryTime': $scope.deliveryTime
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(function (response) {
                    if (response.data.isAccepted) {
                        console.log("Job Successfully Accepted!");
                        $scope.modal.hide();
//                        $state.go('tab.myjobs');
//                        $state.go($state.current, $stateParams, {reload: true, inherit: false});
                        $state.go('tab.myjobs');
//                        $scope.modal.hide();
                        $scope.showAlert = function () {
                            var alertAcceptJobSuccessPopup = $ionicPopup.alert({
                                title: 'Job Successfully Accepted',
                                template: 'Thank you for helping out!'
                            });

                            alertAcceptJobSuccessPopup.then(function (res) {
                                $state.go('tab.myjobs');
                                console.log('Thank you for helping out!');
                            });
                        };

                    }
                    $scope.showAlert = function () {
                        var alertAcceptJobSuccessPopup = $ionicPopup.alert({
                            title: 'Job Successfully Accepted',
                            template: 'Thank you for helping out!'
                        });

                        alertAcceptJobSuccessPopup.then(function (res) {
                            $state.go('myjobs');
                            console.log('Thank you for helping out!');
                        });
                    };
                });
            };

            //initialize timepicker first
            $scope.timePickerObjectPickup = {
                //inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
                inputEpochTime: $scope.inputEpochTime,
                step: 10, //Optional
                format: 12, //Optional
                titleLabel: 'Please indicate approximate pickup time', //Optional
                setLabel: 'Set', //Optional
                closeLabel: 'Close', //Optional
                setButtonType: 'button-calm', //Optional
                closeButtonType: 'button-stable', //Optional
                callback: function (val) {    //Mandatory
                    $scope.timePickerPickupCallback(val);
                }
            };

            $scope.timePickerObjectDeliver = {
                //inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
                inputEpochTime: $scope.inputEpochTime,
                step: 10, //Optional
                format: 12, //Optional
                titleLabel: 'Please indicate approximate delivery time', //Optional
                setLabel: 'Set', //Optional
                closeLabel: 'Close', //Optional
                setButtonType: 'button-calm', //Optional
                closeButtonType: 'button-stable', //Optional
                callback: function (val) {    //Mandatory
                    $scope.timePickerDeliverCallback(val);
                }

            };

            //View Job Details Modal
            $ionicModal.fromTemplateUrl('templates/viewJobDetails.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                $scope.collectionTimeTwelveHours = "";
                $scope.deliveryTimeTwelveHours = "";
                $scope.pickupHours = undefined;
                $scope.pickupMinutes = undefined;
                $scope.deliveryHours = undefined;
                $scope.deliveryMinutes = undefined;
                $scope.isValidPickupTime = true;
                $scope.isValidDeliveryTime = true;
                $scope.pickupBeforeDelivery = true;
                $scope.firstVisit = true;
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });

            $scope.goToMap = function () {
                $state.go('maps');
            };

            $scope.goToMapRouting = function () {
                $state.go('maprouting');
            };
            
            $scope.validatePickupBeforeDeliveryTime = function(){
                $scope.pickupBeforeDelivery = true;
                if($scope.pickupHours !== undefined && $scope.pickupMinutes !== undefined) {
console.log("VALIDATING...");
                if($scope.pickupHours > $scope.deliveryHours || ($scope.pickupHours === $scope.deliveryHours && $scope.pickupMinutes >= $scope.deliveryMinutes)){    
                    $scope.pickupBeforeDelivery = false;
                } 
                 }
            }

        })

        .directive('validatePickupTime', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
//                    controller: 'JobsCtrl',
                link: function ($scope, $element, $attrs, ngModel) {
                    ngModel.$validators.validatePickupTime = function (modelValue) {
                        $scope.isValidPickupTime = true;
                        //true or false based on custom dir validation

                        if (typeof (modelValue) !== 'undefined' && $scope.collectionTimeTwelveHours !== "") { 
                            var hours = parseInt(modelValue.substring(0, 2));
                            var minutes = parseInt(modelValue.substring(3, 5));
                            var period = modelValue.substring(6, 8);
                            console.log("Hours: " + hours);
                            console.log("Minutes: " + minutes);
                            console.log("Period: " + period);
                            if ($scope.currentJob.timeslot === "9AM-12PM") {
                                if (hours === 12 && minutes === 0 && period === "PM") {
                                    $scope.validatePickupBeforeDeliveryTime();
                                    return true;
                                } else if (period === "PM" || hours < 9 || hours > 12 || (hours === 12 && minutes > 0) || (hours === 12 && period === "AM")) {
                                    $scope.isValidPickupTime = false;
//                                    $scope.pickupBeforeDelivery = true;
                                    return false;
                                } else {
                                    $scope.validatePickupBeforeDeliveryTime();
                                    return true;
                                }
                            } else {
                                if (period === "AM" || hours < 2 || hours > 5 || (hours === 5 && minutes > 0)) {
                                    $scope.isValidPickupTime = false;
//                                    $scope.pickupBeforeDelivery = true;
                                    return false;
                                } else {
                                    $scope.validatePickupBeforeDeliveryTime();
                                    return true;
                                }
                            }
                        } else {
                            return false;
                        }
                    };
                }
            };
        })

        .directive('validateDeliveryTime', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function ($scope, $element, $attrs, ngModel) {
                    ngModel.$validators.validateDeliveryTime = function (modelValue) {
                        $scope.isValidDeliveryTime = true;
                        //true or false based on custom dir validation
                        if (typeof (modelValue) !== 'undefined' && $scope.collectionTimeTwelveHours !== "") {
                            var hours = parseInt(modelValue.substring(0, 2));
                            var minutes = parseInt(modelValue.substring(3, 5));
                            var period = modelValue.substring(6, 8);
                            console.log("Hours: " + hours);
                            console.log("Minutes: " + minutes);
                            console.log("Period: " + period);
                            if ($scope.currentJob.timeslot === "9AM-12PM") {
                                if (hours === 12 && minutes === 0 && period === "PM") {
                                    $scope.validatePickupBeforeDeliveryTime();
                                    return true;
                                } else if (period === "PM" || hours < 9 || hours > 12 || (hours === 12 && minutes > 0) || (hours === 12 && period === "AM")) {
                                    $scope.isValidDeliveryTime = false;
//                                    $scope.deliveryAfterPickup = true;
                                    return false;

                                } else {
                                    $scope.validatePickupBeforeDeliveryTime();
                                    return true;
                                }
                            } else {
                                if (period === "AM" || hours < 2 || hours > 5 || (hours === 5 && minutes > 0)) {
                                    $scope.isValidDeliveryTime = false;
//                                    $scope.deliveryAfterPickup = true;
                                    return false;
                                } else {
                                    $scope.validatePickupBeforeDeliveryTime();
                                    return true;
                                }
                            }
                        } else {
                            return false;
                        }
                    };
                }
            };
        });
        
//        .directive('validatePickupBeforeDeliveryTime', function () {
//            return {
//                restrict: 'A',
//                require: 'ngModel',
//                link: function ($scope, $element, $attrs, ngModel) {
//                    ngModel.$validators.validatePickupBeforeDeliveryTime = function (modelValue) {
//                        if($scope.isValidPickupTime && $scope.isValidDeliveryTime){
//                        $scope.pickupBeforeDelivery = true;
//                        console.log("PICKUP BEFORE DELIVERY??");
//                        //true or false based on custom dir validation
//                        if (typeof (modelValue) !== 'undefined') {
//                            var hours = parseInt(modelValue.substring(0, 2));
//                            var minutes = parseInt(modelValue.substring(3, 5));
//                            var period = modelValue.substring(6, 8);
//                            if($scope.deliveryHours < hours || ($scope.deliveryHours === hours && $scope.deliveryMinutes <= minutes)){    
//                                $scope.pickupBeforeDelivery = false;
//                                $scope.deliveryAfterPickup = true;
//                                console.log("FALSE LEH");
//                                return false;
//                            } else {
//                                $scope.deliveryAfterPickup = true;
//                                
//                                console.log("TRUE LEH");
//                                return true;
//                            }
//                        } else {
//                            return false;
//                        }
//                    }
//                    };
//                }
//            };
//        })
//        
//        .directive('validateDeliveryAfterPickupTime', function () {
//            return {
//                restrict: 'A',
//                require: 'ngModel',
//                link: function ($scope, $element, $attrs, ngModel) {
//                    ngModel.$validators.validateDeliveryAfterPickupTime = function (modelValue) {
//                        if($scope.isValidDeliveryTime){
//                        $scope.deliveryAfterPickup = true;
//                        console.log("Inside validate pickup and delivery time");
//                        //true or false based on custom dir validation
//                        if (typeof (modelValue) !== 'undefined') {
//                            var hours = parseInt(modelValue.substring(0, 2));
//                            var minutes = parseInt(modelValue.substring(3, 5));
//                            var period = modelValue.substring(6, 8);
//                            if($scope.pickupHours > hours || ($scope.pickupHours === hours && $scope.pickupMinutes >= minutes)){    
//                                $scope.deliveryAfterPickup = false;
//                                $scope.pickupBeforeDelivery = true;
//                                console.log("FALSE LEH");
//                                return false;
//                            } else {
//                                $scope.pickupBeforeDelivery = true;
//                                console.log("TRUE LEH");
//                                return true;
//                            }
//                        } else {
//                            return false;
//                        }
//                    }
//                    };
//                }
//            };
//        });