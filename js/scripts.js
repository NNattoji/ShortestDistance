(function (){
	var INF = 9999999;
	var cities = ["chennai","mangalore","goa","mumbai","nagpur","bhopal","jaipur","lucknow"];
	var distance = [[0,726,INF,INF,INF,INF,INF,1918],
		            [726,0,355,INF,INF,INF,INF,INF],
		            [INF,355,0,590,INF,INF,INF,INF],
	           	    [INF,INF,590,0,1354,INF,INF,INF],
		            [INF,INF,INF,1354,0,580,INF,INF],
		            [INF,INF,INF,INF,580,0,595,INF],
		            [INF,INF,INF,INF,INF,595,0,568],
		            [INF,INF,INF,INF,INF,INF,568,0]];
																															
	var fromCity = document.getElementById('from').value.toLowerCase();
	var toCity = document.getElementById('to').value.toLowerCase();
	
	var indexOfFrom = cities.indexOf(fromCity);
	var indexOfTo = cities.indexOf(toCity);
	
	if (indexOfFrom == -1 || indexOfTo == -1)
	{
		document.getElementById('distance').value = "";
		alert("Distance cannot be determined between the two cities! Please re-enter cities!");
	}
	else
	{
		if (indexOfFrom > indexOfTo)
		{
			var fromCityReversed = toCity;
			var toCityReversed = fromCity;
			var fromTo = fromCityReversed.concat("-".concat(toCityReversed));

			var arrayRetrieved = floydWarshall(distance, cities);
			var path = determinePath(arrayRetrieved, fromTo);
			var pathReversed = path.reverse();
			alert("complete path: " + pathReversed);
			createDatabase(arrayRetrieved, fromTo);
			display(pathReversed);
		}
		else
		{
			var fromTo = fromCity.concat("-".concat(toCity));

			var arrayRetrieved = floydWarshall(distance, cities);
			var path = determinePath(arrayRetrieved, fromTo);
			alert("complete path: " + path);
			createDatabase(arrayRetrieved, fromTo);
			display(path);
		}
	}
	
	
	function display(path)  
	{
		var mapProp = {
			center: new google.maps.LatLng(21, 78),
			zoom:4,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

		var i = 0;
		var address = path[i];
		var myPath = [];
		var geocoder = new google.maps.Geocoder(); 
		function geocode() {
			geocoder.geocode({'address': address},function(results, status) {
							  if (status == google.maps.GeocoderStatus.OK)
							  {
							    var lattitude = results[0].geometry.location.lat();
							    var longitude = results[0].geometry.location.lng();
				
						        var city = new google.maps.LatLng(lattitude, longitude);
			                    myPath.push(city);
								
								marker = new google.maps.Marker({ 
										position: new google.maps.LatLng(lattitude, longitude), 
										map: map 
								});	
							    marker.setMap(map);
								
								i++;
								address = path[i];
								if (address != null)
								geocode();

								if (myPath.length == path.length)
								{
									var tripPath = new google.maps.Polyline({
			                        path:myPath,
			                        strokeColor:"#000000",
		                            strokeOpacity:0.6,
			                        strokeWeight:2
						        });
						        tripPath.setMap(map);
							   }
							 }
						  });
		}
		geocode();
	}

	function determinePath(arrayRetrieved, fromTo) {
		/*Start: code for determining the path*/
		var path = fromTo.split("-");
		var pathArray = [path[1]];
		
		var citiesArray = arrayRetrieved[2];
		var predecessorArray = arrayRetrieved[1];
		var distancesArray = arrayRetrieved[0]; 
		
		for (var i = 0; i < citiesArray.length; i++)
		{
			for (var j = 0; j < citiesArray.length; j++)
			{
				if (citiesArray[i][j] == fromTo)
				{
					var predecessorValue = predecessorArray[i][j];
					
					if (predecessorValue != 0)
					{

						while (predecessorValue != 0)
						{

							var predecessorCity = citiesArray[i][predecessorValue];
							predecessorValue = predecessorArray[i][predecessorValue];

							var predecessorPath = predecessorCity.split("-");
							if (predecessorPath[0] != path[0])
							{
								pathArray.push(predecessorPath[0]);
							}
							if (predecessorPath[1] != path[0])
							{
								pathArray.push(predecessorPath[1]);
							}	
						};

					}
				}
			}
		}
		pathArray.push(path[0]);
		var pathArrayReverse = pathArray.reverse();
		/*End: code for determining the path*/
		return pathArrayReverse;
	}
	
	function floydWarshall(distance,cities) {
		var p = constructInitialMatixOfPredecessors(distance);
		
		for (k = 0; k < distance.length; k++) {
			for (i = 0; i < distance.length; i++) {
				for (j = 0; j < distance.length; j++) {
					if (distance[i][k] == INF || distance[k][j] == INF) {
						continue;                 
					}

					if (distance[i][j] > distance[i][k] + distance[k][j]) {
						distance[i][j] = distance[i][k] + distance[k][j];
						p[i][j] = p[k][j];
					}

				}
			}
		}
		
		var cityFromTo = [["0","726","INF","INF","INF","INF","INF","1918"],
		                  ["726","0","355","INF","INF","INF","INF","INF"],
		                  ["INF","355","0","590","INF","INF","INF","INF"],
		                  ["INF","INF","590","0","1354","INF","INF","INF"],
		                  ["INF","INF","INF","1354","0","580","INF","INF"],
		                  ["INF","INF","INF","INF","580","0","595","INF"],
		                  ["INF","INF","INF","INF","INF","595","0","568"],
		                  ["INF","INF","INF","INF","INF","INF","568","0"]];
		
	    for (i = 0; i < cities.length; i++) {
			for (j = 0; j < cities.length; j++) {
				cityFromTo[i][j] = cities[i].concat("-".concat(cities[j]));
			}
		}
		
		return [distance,p,cityFromTo];
	}

	function constructInitialMatixOfPredecessors(distance) {

		var p = [[0,726,INF,INF,INF,INF,INF,1918],
		         [726,0,355,INF,INF,INF,INF,INF],
		         [INF,355,0,590,INF,INF,INF,INF],
	           	 [INF,INF,590,0,1354,INF,INF,INF],
		         [INF,INF,INF,1354,0,580,INF,INF],
		         [INF,INF,INF,INF,580,0,595,INF],
		         [INF,INF,INF,INF,INF,595,0,568],
		         [INF,INF,INF,INF,INF,INF,568,0]];

		for (i = 0; i < distance.length; i++) {
			for (j = 0; j < distance.length; j++) {
				if (distance[i][j] != 0 && distance[i][j] != INF) {
					p[i][j] = i;
				} else {
					p[i][j] = 0;
				}
			}
		}
		return p;
	}
	
	function createDatabase(arrayRetrieved, fromTo) {
		var distanceRetrieved = [];
		var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB; 
		
		/*Database delete: to be used only when needed else causes database block*/
//		var req = indexedDB.deleteDatabase('sunthird');
//		req.onerror = function () {
//			alert("Couldn't delete database");
//		};
//		req.onblocked = function () {
//			alert("Couldn't delete database due to the operation being blocked");
//		};
		
		var request = indexedDB.open('Project');
	
		request.onupgradeneeded = function(event) {
			var db = event.target.result; 
			//autoIncrement is the automatic key generator
			var objectStore = db.createObjectStore("cityDist", {keyPath: "cities"});
			// Create an index to search distance by city names. 
			//objectStore.createIndex("cities", "cities", { unique: true });
		};

		request.onerror = function(event) { 
			alert("Database access error: " + event.target.errorCode); 
		}; 
		request.onsuccess = function(event) { 
			var db = event.target.result;
			
			var cArray = arrayRetrieved[2];
			var pArray = arrayRetrieved[1];
			var dArray = arrayRetrieved[0];
			
			var distancesArrayLength = dArray.length;
		    
				for (i = 0; i < distancesArrayLength; i++) { 
					for (j = 0; j < distancesArrayLength; j++) {
						var inputCities = cArray[i][j];
						var inputDistance = dArray[i][j];
						var data = {cities: inputCities, distance: inputDistance};
						var trans = db.transaction('cityDist', 'readwrite');
                        var store = trans.objectStore('cityDist');	
						var dataRequest = store.put(data); 
						
//						dataRequest.onerror = function(event) { 
//			                alert("Database persistence error: " + event.target.errorCode); 
//	                 	}; 
//
//						dataRequest.onsuccess = function(event) { 
//							alert("Done!"); 
//						};	
						var ijIndex = distancesArrayLength-1;
						if (i == ijIndex && j == ijIndex)
						{
							var req = indexedDB.open('Project');
							req.onsuccess = function(event) { 
								var db = event.target.result;
								var trans = db.transaction('cityDist');
								var store = trans.objectStore('cityDist');	
								var retrievalRequest = store.get(fromTo); 
								//alert("Store Return: " +retrievalRequest.result);
								retrievalRequest.onsuccess = function(event) {
									distanceRetrieved = event.target.result.distance;
									
									var distanceRetrievedinKm = distanceRetrieved.toString().concat(" Km");
									document.getElementById("distance").value = distanceRetrievedinKm;

								};
								retrievalRequest.onblocked = function () {
									alert("Couldn't retrieve database due to the operation being blocked");
								};
								retrievalRequest.onerror = function(event) { 
									alert("Database access error: " + event.target.errorCode); 
								}; 
							};
						}
					}
				}
				
			//Retrieving one value from the database
			//var request = objectStore.get("Primary Key")

		};
	}
	
})();
