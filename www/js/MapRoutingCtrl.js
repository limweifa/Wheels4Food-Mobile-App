angular.module('starter.controllers')

        .controller('MapRoutingCtrl', function ($scope, $state, $stateParams, $location, $anchorScroll, $ionicScrollDelegate, $ionicPlatform, $ionicLoading, $ionicHistory, $cordovaGeolocation, $ionicLoading, $http, $filter, $localstorage, api, $ionicPopup, $ionicModal) {
            console.log($state);
                    $scope.username = $localstorage.get('username');
            $scope.userID = $localstorage.get('userID');
            $scope.myLatLng = "";
            $scope.showDirections = false;
//            $scope.doRefresh = function () {
//            }
//            
//            var markersArray = [];
            $ionicPlatform.ready(function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Getting Directions'
                });

                var posOptions = {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                };

                $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;

                    var myLatlng = new google.maps.LatLng(lat, long);
                    $scope.myLatLng = myLatlng;

//                    console.log("lat: " + lat);
//                    console.log("long: " + long);
//                    console.log("myLatlng: " + myLatlng);

                    var mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

//                        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                    initMap();

//                        google.maps.event.addListenerOnce(map, 'idle', function () {
//
//                            var marker = new google.maps.Marker({
//                                map: map,
//                                animation: google.maps.Animation.DROP,
//                                position: myLatlng
//                            });
//
//                            var infoWindow = new google.maps.InfoWindow({
//                                content: "Here I am!"
//                            });
//
//                            google.maps.event.addListener(marker, 'click', function () {
//                                infoWindow.open($scope.map, marker);
//                            });
//
//                        });
//                    var marker = new google.maps.Marker({
//                        position: myLatlng,
//                        map: map,
//                        draggable: true
//                    });

                    $scope.map = map;
                    $ionicLoading.hide();

                }, function (err) {
                    $ionicLoading.hide();
                    console.log(err);
                }).finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
                
//                ////to convert postal code to latlong and display marker on map
//                    var bounds = new google.maps.LatLngBounds();
//                    var geocoder = new google.maps.Geocoder();
//
//                    geocodeAddress(geocoder, map, "805180");
//                    geocodeAddress(geocoder, map, "319773");
//                    function geocodeAddress(geocoder, resultsMap, address) {
//                        //var address = "805186"; //document.getElementById('address').value;
//                        geocoder.geocode({'address': address}, function (results, status) {
//                            if (status === google.maps.GeocoderStatus.OK) {
//                                var currentLatLng = results[0].geometry.location;
//                                console.log("CURRENT LAT LNG: " + currentLatLng);
////                                resultsMap.setCenter(results[0].geometry.location);
////                                var marker = new google.maps.Marker({
////                                    map: resultsMap,
////                                    position: results[0].geometry.location
////
////                                });
//
////                                markers.push([address, currentLatLng]);
//                                
//                            } else {
//                                //alert('Geocode was not successful for the following reason: ' + status);
//                                console.log("Fail retrieving postal code");
//                            }
//                        });
//                    }
////                    console.log("MARKERS ARRAY:" + markers);

                //DIRECTIONS MATRIX

                function initMap() {
                    var markerArray = [];

                    // Instantiate a directions service.
                    var directionsService = new google.maps.DirectionsService;

                    // Create a map and center it on Manhattan.
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
//                    var onChangeHandler = function () {
//                        calculateAndDisplayRoute(
//                                directionsDisplay, directionsService, markerArray, stepDisplay, map);
//                    };
//                    document.getElementById('start').addEventListener('change', onChangeHandler);
//                    document.getElementById('end').addEventListener('change', onChangeHandler);
                }

                function calculateAndDisplayRoute(directionsDisplay, directionsService,
                        markerArray, stepDisplay, map) {
                    // First, remove any existing markers from the map.
                    for (var i = 0; i < markerArray.length; i++) {
                        markerArray[i].setMap(null);
                    }

                    // Retrieve the start and end locations and create a DirectionsRequest using
                    // WALKING directions.
                    directionsService.route({
                        origin: $scope.myLatLng, //{lat: 1.379896, lng: 103.872013},//document.getElementById('start').value,
                        destination: {lat: 1.337389, lng: 103.882417}, //document.getElementById('end').value,
                        travelMode: google.maps.TravelMode.DRIVING
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
//                $ionicLoading.show({
//                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
//                });
//
//                var posOptions = {
//                    enableHighAccuracy: true,
//                    timeout: 20000,
//                    maximumAge: 0
//                };
//
//                $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
//                    var lat = position.coords.latitude;
//                    var long = position.coords.longitude;
//
//                    var myLatlng = new google.maps.LatLng(lat, long);
//
//                    console.log("lat: " + lat);
//                    console.log("long: " + long);
//                    console.log("myLatlng: " + myLatlng);
//
//                    var mapOptions = {
//                        center: myLatlng,
//                        zoom: 16,
//                        mapTypeId: google.maps.MapTypeId.ROADMAP
//                    };
//
//                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
//
//                    google.maps.event.addListenerOnce(map, 'idle', function () {
//
//                        var marker = new google.maps.Marker({
//                            map: map,
//                            animation: google.maps.Animation.DROP,
//                            position: myLatlng
//                        });
//
//                        var infoWindow = new google.maps.InfoWindow({
//                            content: "Here I am!"
//                        });
//
//                        google.maps.event.addListener(marker, 'click', function () {
//                            infoWindow.open($scope.map, marker);
//                        });
//
//                    });
//                    
//                    $scope.map = map;
//                    $ionicLoading.hide();
//
//                }, function (err) {
//                    $ionicLoading.hide();
//                    console.log(err);
//                });

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

        })
        ;
