angular.module('starter.controllers')

        .controller('MapCtrl', function ($scope, $state, $stateParams, $ionicPlatform, $ionicLoading, $ionicHistory, $cordovaGeolocation, $ionicLoading, $http, $filter, $localstorage, api, $ionicPopup, $ionicModal) {
            $scope.username = $localstorage.get('username');
            $scope.userID = $localstorage.get('userID');
            var markersArray = [];
            $ionicPlatform.ready(function () {
                $scope.doRefresh = function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
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

                        console.log("lat: " + lat);
                        console.log("long: " + long);
                        console.log("myLatlng: " + myLatlng);

                        var mapOptions = {
                            center: myLatlng,
                            zoom: 16,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

                        google.maps.event.addListenerOnce(map, 'idle', function () {

                            var marker = new google.maps.Marker({
                                map: map,
                                animation: google.maps.Animation.DROP,
                                position: myLatlng
                            });

                            var infoWindow = new google.maps.InfoWindow({
                                content: "Here I am!"
                            });

                            google.maps.event.addListener(marker, 'click', function () {
                                infoWindow.open($scope.map, marker);
                            });

                        });
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
                };
                
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
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

                    console.log("lat: " + lat);
                    console.log("long: " + long);
                    console.log("myLatlng: " + myLatlng);

                    var mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    google.maps.event.addListenerOnce(map, 'idle', function () {

                        var marker = new google.maps.Marker({
                            map: map,
                            animation: google.maps.Animation.DROP,
                            position: myLatlng
                        });

                        var infoWindow = new google.maps.InfoWindow({
                            content: "Here I am!"
                        });

                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.open($scope.map, marker);
                        });

                    });
                    //*****START******
//                //starting distance matrix
//                $ionicLoading.show({
//                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
//                });
//
//                var posOptions = {
//                    enableHighAccuracy: true,
//                    timeout: 100000,
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
//                    var bounds = new google.maps.LatLngBounds;
//
//                    var origin1 = "805180";
////  var origin2 = 'Greenwich, England';
//                    var destinationA = '188065';
//                    var destinationB = "319773";
//
//                    var destinationIcon = 'https://chart.googleapis.com/chart?' +
//                            'chst=d_map_pin_letter&chld=D|FF0000|000000';
//                    var originIcon = 'https://chart.googleapis.com/chart?' +
//                            'chst=d_map_pin_letter&chld=O|FFFF00|000000';
////  var map = new google.maps.Map(document.getElementById('map'), {
////    center: {lat: 55.53, lng: 9.4},
////    zoom: 10
////  });
//                    var geocoder = new google.maps.Geocoder;
//
//                    var service = new google.maps.DistanceMatrixService;
//                    service.getDistanceMatrix({
//                        origins: [origin1],
//                        destinations: [destinationA, destinationB],
//                        travelMode: google.maps.TravelMode.DRIVING,
//                        unitSystem: google.maps.UnitSystem.METRIC,
//                        avoidHighways: false,
//                        avoidTolls: false
//                    }, function (response, status) {
//                        if (status !== google.maps.DistanceMatrixStatus.OK) {
////      alert('Error was: ' + status);
//                        } else {
//                            var originList = response.originAddresses;
//                            var destinationList = response.destinationAddresses;
////      var outputDiv = document.getElementById('output');
////      outputDiv.innerHTML = '';
//                            deleteMarkers(markersArray);
//
//                            var showGeocodedAddressOnMap = function (asDestination) {
//                                var icon = asDestination ? destinationIcon : originIcon;
//                                return function (results, status) {
//                                    if (status === google.maps.GeocoderStatus.OK) {
//                                        map.fitBounds(bounds.extend(results[0].geometry.location));
//                                        markersArray.push(new google.maps.Marker({
//                                            map: map,
//                                            position: results[0].geometry.location,
//                                            icon: icon
//                                        }));
//                                    } else {
////            alert('Geocode was not successful due to: ' + status);
//                                    }
//                                };
//                            };
//
//                            for (var i = 0; i < originList.length; i++) {
//                                var results = response.rows[i].elements;
//                                geocoder.geocode({'address': originList[i]},
//                                        showGeocodedAddressOnMap(false));
//                                for (var j = 0; j < results.length; j++) {
//                                    geocoder.geocode({'address': destinationList[j]},
//                                            showGeocodedAddressOnMap(true));
//                                    console.log(originList[i] + ' to ' + destinationList[j] +
//                                            ': ' + results[j].distance.text + ' in ' +
//                                            results[j].duration.text + '<br>');
//                                }
//                            }
//                        }
//                    });
//                    //*****END******



////to convert postal code to latlong and display marker on map
//                    var bounds = new google.maps.LatLngBounds();
//                    var geocoder = new google.maps.Geocoder();
//
//                    var markers = [
//                    ];
//
//                    geocodeAddress(geocoder, map, "805180");
//                    geocodeAddress(geocoder, map, "319773");
//                    function geocodeAddress(geocoder, resultsMap, address) {
//                        //var address = "805186"; //document.getElementById('address').value;
//                        geocoder.geocode({'address': address}, function (results, status) {
//                            if (status === google.maps.GeocoderStatus.OK) {
//                                var currentLatLng = results[0].geometry.location;
//                                console.log("CURRENT LAT LNG: " + currentLatLng);
//                                resultsMap.setCenter(results[0].geometry.location);
//                                var marker = new google.maps.Marker({
//                                    map: resultsMap,
//                                    position: results[0].geometry.location
//
//                                });
//
//                                markers.push([address, currentLatLng]);
//                                
//                            } else {
//                                //alert('Geocode was not successful for the following reason: ' + status);
//                                console.log("Fail retrieving postal code");
//                            }
//                        });
//                    }
//                    console.log("MARKERS ARRAY:" + markers);


//MARKET FOR CURRENT LOCATION
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
                });

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

        })
        ;
