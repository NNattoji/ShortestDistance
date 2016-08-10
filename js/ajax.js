(function() {
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200)
		{
			var i;
			var table="<tr><th>Cities</th></tr>";
			var x = xhttp.responseXML.getElementsByTagName("sequence")[0].childNodes;
			for (i = 0; i < x.length; i++)
			{
				table += "<tr><td>" + x[i].childNodes[0].nodeValue + "</td></tr>";
			}

			document.getElementById("sequence").innerHTML = table;
		}
	};
	xhttp.open("GET", "http://192.168.0.107:8099/sequence.xml", true);
	xhttp.send();

})();
