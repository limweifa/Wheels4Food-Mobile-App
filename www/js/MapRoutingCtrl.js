angular.module('starter.controllers')

        .controller('MapRoutingCtrl', function ($scope, $state, $stateParams, $location, $anchorScroll, $ionicScrollDelegate, $ionicPlatform, $ionicLoading, $ionicHistory, $cordovaGeolocation, $ionicLoading, $http, $filter, $localstorage, api, $ionicPopup, $ionicModal) {
            $scope.pickupPostalCode = "";
            $scope.username = $localstorage.get('username');
            $scope.userID = $localstorage.get('userID');
            $scope.myLatLng = "";
            $scope.pickupLatLng = "";
            $scope.showDirections = false;

            $scope.location = {
                origin: '',
                destination: ''
            };
            $scope.toLocation = "";
            $scope.errorLocation = "";
            $scope.travel = {
                type: ''
            }
            $scope.travelMode = google.maps.TravelMode.DRIVING;

            $ionicPlatform.ready(function () {

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Getting Directions'
                });

                var posOptions = {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                };
                $scope.$on('eventName', function (event, currentJob) {
                    $scope.pickupPostalCode = currentJob.demand.supplier.postalCode;
                    $scope.deliveryPostalCode = currentJob.demand.user.postalCode;

                    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;

                        var myLatlng = new google.maps.LatLng(lat, long);
                        $scope.myLatLng = myLatlng;
                        $scope.originLatLng = myLatlng;

                        var mapOptions = {
                            center: myLatlng,
                            zoom: 16,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        initMap();
                        $scope.map = map;
                        $ionicLoading.hide();


                    }, function (err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.errorLocation = "Sorry, we are unable to get the directions at the moment. Please ensure that your location service is turned on and try again later."
                        $scope.showAlert();
                    }).finally(function () {
                        // Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                });
//                ////to convert postal code to latlong and display marker on map
//                    var bounds = new google.maps.LatLngBounds();
//                    var geocoder = new google.maps.Geocoder();

                function geocodeDeliveryAddress(geocoder, resultsMap, address) {
//                        //var address = "805186"; //document.getElementById('address').value;
                    geocoder.geocode({'address': "Singapore " + address}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
//                                var currentLatLng = results[0].geometry.location;
                            $scope.deliveryLatLng = results[0].geometry.location;
                        }
                    });
                }


                function geocodePickupAddress(geocoder, resultsMap, address) {
//                        //var address = "805186"; //document.getElementById('address').value;
                    geocoder.geocode({'address': "Singapore " + address}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
//                                var currentLatLng = results[0].geometry.location;
                            $scope.pickupLatLng = results[0].geometry.location;
                            $scope.destinationLatLng = results[0].geometry.location;
                            var markerArray = [];

                            // Instantiate a directions service.
                            var directionsService = new google.maps.DirectionsService;
                            var map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 13,
                                center: $scope.myLatLng
                            });
                            // Create a renderer for directions and bind it to the map.
                            var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
                            //directionsDisplay.setPanel(document.getElementById('right-panel'));
                            directionsDisplay.setPanel(document.getElementById('directions'));
                            // Instantiate an info window to hold step text.
                            var stepDisplay = new google.maps.InfoWindow;
                            // Display the route between the initial start and end selections.
                            calculateAndDisplayRoute(
                                    directionsDisplay, directionsService, markerArray, stepDisplay, map);

                            // Listen to change events from the start and end lists.
                            var onChangeHandler = function () {
                                if ($scope.location.origin === "pickupLocation") {
                                    $scope.originLatLng = $scope.pickupLatLng;
                                } else if ($scope.location.origin === "deliveryLocation") {
                                    $scope.originLatLng = $scope.deliveryLatLng;
                                } else {
                                    $scope.originLatLng = $scope.myLatLng;
                                }

                                calculateAndDisplayRoute(
                                        directionsDisplay, directionsService, markerArray, stepDisplay, map);
                            };

                            var onChangeHandler2 = function () {
                                if ($scope.location.destination === "pickupLocation") {
                                    $scope.destinationLatLng = $scope.pickupLatLng;
                                } else if ($scope.location.destination === "deliveryLocation") {
                                    $scope.destinationLatLng = $scope.deliveryLatLng;
                                } else {
                                    $scope.destinationLatLng = $scope.myLatLng;
                                }

                                calculateAndDisplayRoute(
                                        directionsDisplay, directionsService, markerArray, stepDisplay, map);
                            };

                            var onChangeHandlerTravelMode = function () {
                                if ($scope.travel.type === "WALKING") {
                                    $scope.travelMode = google.maps.TravelMode.WALKING;
                                } else {
                                    $scope.travelMode = google.maps.TravelMode.DRIVING;
                                }

                                calculateAndDisplayRoute(
                                        directionsDisplay, directionsService, markerArray, stepDisplay, map);
                            };
                            document.getElementById('start').addEventListener('change', onChangeHandler);
                            document.getElementById('end').addEventListener('change', onChangeHandler2);
                            document.getElementById('travelMode').addEventListener('change', onChangeHandlerTravelMode);
                        } else {
                            //alert('Geocode was not successful for the following reason: ' + status);
                            console.log("Fail retrieving postal code");
                            $scope.showAlert();
                        }
                    });
                }
                //DIRECTIONS MATRIX

                function initMap() {
                    var bounds = new google.maps.LatLngBounds();
                    var geocoder = new google.maps.Geocoder();
//                    var markerArray = [];
//
//                    // Instantiate a directions service.
//                    var directionsService = new google.maps.DirectionsService;

                    // Create a map and center it on Manhattan.
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 13,
                        center: $scope.myLatLng
                    });

                    geocodePickupAddress(geocoder, map, $scope.pickupPostalCode);
                    geocodeDeliveryAddress(geocoder, map, $scope.deliveryPostalCode);
                }

                function calculateAndDisplayRoute(directionsDisplay, directionsService,
                        markerArray, stepDisplay, map) {
                    // First, remove any existing markers from the map.
                    for (var i = 0; i < markerArray.length; i++) {
                        markerArray[i].setMap(null);
                    }

                    // Retrieve the start and end locations and create a DirectionsRequest using
                    // DRIVING/WALKING directions.
                    directionsService.route({
                        origin: $scope.originLatLng,
                        destination: $scope.destinationLatLng,
                        travelMode: $scope.travelMode
                    }, function (response, status) {
                        // Route the directions and pass the response to a function to create
                        // markers for each step.
                        if (status === google.maps.DirectionsStatus.OK) {
                            document.getElementById('warnings-panel').innerHTML =
                                    '<b>' + response.routes[0].warnings + '</b>';
                            directionsDisplay.setDirections(response);
                            showSteps(response, markerArray, stepDisplay, map);
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    });
                }


                function showSteps(directionResult, markerArray, stepDisplay, map) {
                    // For each step, place a marker, and add the text to the marker's infowindow.
                    // Also attach the marker to an array so we can keep track of it and remove it
                    // when calculating new routes.
                    var myRoute = directionResult.routes[0].legs[0];
                    for (var i = 0; i < myRoute.steps.length; i++) {
                        var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
                        marker.setMap(map);
                        marker.setPosition(myRoute.steps[i].start_location);
                        attachInstructionText(
                                stepDisplay, marker, myRoute.steps[i].instructions, map);
                    }
                }

                function attachInstructionText(stepDisplay, marker, text, map) {
                    google.maps.event.addListener(marker, 'click', function () {
                        // Open an info window when the marker is clicked on, containing the text
                        // of the step.
                        stepDisplay.setContent(text);
                        stepDisplay.open(map, marker);
                    });
                }

            });
            $scope.myGoBack = function () {
//                $ionicHistory.goBack();
                $state.go('tab.jobs');
            };

            function deleteMarkers(markersArray) {
                for (var i = 0; i < markersArray.length; i++) {
                    markersArray[i].setMap(null);
                }
                markersArray = [];
            }

            $scope.scrollToAnchorWithinCurrentPage = function (anchor)
            {
                $scope.showDirections = true;
                $location.hash(anchor);
                var handle = $ionicScrollDelegate.$getByHandle('content');
                handle.anchorScroll();
            };
            
            $scope.showAlert = function () {
                var locationErrorPopup = $ionicPopup.alert({
                    title: 'Unable to get directions',
                    template: "Sorry, we are unable to get the directions at the moment. Please ensure that your location service is turned on and try again later.",
                    okType: 'button-calm'
                    
                });

                locationErrorPopup.then(function (res) {
                    //console.log("Successfully cancelled");
                });
            };

        })
        ;
