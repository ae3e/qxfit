/**
 * Session
 */
qx.Class.define("ae.fit.Session", {
	extend : qx.core.Object,
	
	properties : {

		name : {
			//apply : "_applyCqlfilter",
			event : "changeName",
			init : null
		},
		
		coordinates : {
			
		},
		
		times : {
			
		},
		
		durations : {
			
		},
		
		distances : {
			
		},
		
		speeds : {
			
		},
		
		heartrates : {
			init : null
		},
		
		altitudes : {
			init : null
		},
		
		cadences : {
			init : null
		},
		
		intervals : {
			
		}
		
	},

	construct : function(){
		this.base(arguments);
		
	},
	
	members : {
		calculateDurations : function(){
			if(this.getTimes()){
	    		var data = [];
	    		this.getTimes().getData().forEach(function(elt,index,array){
	    			data.push(new Date(elt)-new Date(array[0]));
		    	});
	    	}
			
			var durations = new ae.fit.Data();
			durations.setData(data);
			durations.setStatistics(ae.fit.Util.getStatistics(data));
			this.setDurations(durations);
		},
		
		calculateDistances : function(){
			/**
	         * Calculates distance between 2 points using Haversine formula
	         * @param lat1 {Double} Latitude of point 1
	         * @param lon1 {Double} Longitude of point 1 
	         * @param lat2 {Double} Latitude of point 2 
	         * @param lon2 {Double} Longitude of point 2 
	         * @return {Double} distance in km
	         */
	        var haversine = function(lat1, lon1, lat2, lon2) {
	            var R = 6372.8;
	            var dLat = (lat2 - lat1)*(Math.PI / 180);
	            var dLon = (lon2 - lon1)*(Math.PI / 180);
	            lat1 = lat1*(Math.PI / 180);
	            lat2 = lat2*(Math.PI / 180);

	            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	            var c = 2 * Math.asin(Math.sqrt(a));
	            return R * c;
	        }
	         
	        var data = [];
	        this.getCoordinates().forEach(function(elt,index,array){
	        	if(index>0){
	        		data.push(data[index-1]+haversine(array[index-1][1],array[index-1][0],array[index][1],array[index][0]));
	        	}else{
	        		data.push(0);
	        	}
	        });
	        
	        var distances = new ae.fit.Data();
	        distances.setData(data);
			this.setDistances(distances);
		},
		
		calculateSpeeds : function(){
			var distances = this.getDistances().getData();
	    	var times = this.getTimes().getData();
	    	
	    	if(times && distances){
	    		var data = [];	    		 
		    	times.forEach(function(elt,index,array){
		    		if(index == 0){
		    			data.push(null);
		    		}else{
		    			var speed = (distances[index]-distances[index-1])/(new Date(times[index])-new Date(times[index-1]))* 1000 * 60 * 60;
		    			if(isNaN(speed) || !isFinite(speed)){speed=null;}
				    	data.push(speed);
		    		}
		    	});
		    	
		    	var speeds = new ae.fit.Data();
		    	speeds.setData(data);
		    	speeds.setStatistics(ae.fit.Util.getStatistics(data));
				this.setSpeeds(speeds);
	    	}	
		},
		
		calculateIntervals : function(training){
			//training example : 15' - 10 x 200m/45" - 3' - 10 x 200m/45" - 10'
	    	
	    	var timeToSec = function(time){
	    		var indexM = time.indexOf("'");
	    		var indexS = time.indexOf("\"");
	    		var duration = 0;

	    		if(indexS>0 && indexM>0){
	    			duration = parseInt(time.substring(0,indexM))*60 + parseInt(time.substring(indexM+1,indexS));
	    		}else{
	    			if(indexM>0){
		    			duration = parseInt(time.substring(0,indexM))*60;
		    		}
	    			if(indexS>0){
		    			duration = parseInt(time.substring(0,indexS));
		    		}
	    		}
	    		return duration;
	    	}
	    	var intt = [];
	    	var phases = training.split("-");

	    	for(var i=0;i<phases.length;i++){
	    		var sets = phases[i].split("x");
	    		
	    		if(sets.length==2){
	    			//10 x 200m/45"
	    			var repetition = parseInt(sets[0]);
	    			var mode = sets[1].split("/");
	    			var fast = mode[0];
	    			var slow = mode[1];
	    			for (var j=0;j<repetition;j++){
	    				fast.indexOf("m")<0?intt.push(timeToSec(fast)):intt.push(fast);
	    				slow.indexOf("m")<0?intt.push(timeToSec(slow)):intt.push(slow);
	    			}
	    		}else{
	    			//1000m or 15'
	    			phases[i].indexOf("m")<0?intt.push(timeToSec(phases[i])):intt.push(phases[i]);
	    			
	    		}
	    	}
	    	
	    	var durations = this.getDurations().getData();
    		var distances = this.getDistances().getData();
    		var times = this.getTimes();
    		var k =0;
    		var start = 0;
    		var intervals = new qx.data.Array();
    		var step, dist = false;

    		if(isNaN(intt[k])){dist=true;}
    		dist?step=parseInt(intt[k].split[0]):step=intt[k]*1000;
    	
	    	for(var i=0;i<durations.length;i++){
	    		
	    		if(dist){
	    			//console.log(step);
	    			if(step>distances[i]){
	    				continue;
	    			}else{
	    				var interval = new ae.fit.Interval();
	    	   			interval.setStart(start);
	    	   			interval.setEnd(i);
	    	   			intervals.push(interval);

		    			start=i;
		    			k=k+1;
		    			if(k==intt.length){
		    				break;
		    			}
		    			if(isNaN(intt[k])){
		    				dist=true;
		    				step=distances[interval.getEnd()]+parseInt(intt[k].split()[0])/1000
		    			}else{
		    				dist=false;
		    				step=durations[interval.getEnd()]+intt[k]*1000;
		    			}
		    		}
	    		}else{
	    			if(step>durations[i]){
		    			continue;
		    		}else{
		    			var interval = new ae.fit.Interval();
	    	   			interval.setStart(start);
	    	   			interval.setEnd(i);
	    	   			intervals.push(interval);
	    	   			
		    			start=i;
		    			k=k+1;
		    			if(k==intt.length){
		    				break;
		    			}
		    			if(isNaN(intt[k])){
		    				dist=true;
		    				step=distances[interval.getEnd()]+parseInt(intt[k].split()[0])/1000
		    			}else{
		    				dist=false;
		    				step=durations[interval.getEnd()]+intt[k]*1000;
		    			}
		    		}
	    		}
	    		
	    	}

   			var interval = new ae.fit.Interval();
   			interval.setStart(start);
   			interval.setEnd(durations.length-1);
   			intervals.push(interval);

   			
   			for(var i=0;i<intervals.length;i++){
   				var statistics = {};
   				if(this.getAltitudes()){
   					var data = this.getAltitudes().getData().filter(function(elt,index){
   						return index>intervals.getItem(i).getStart() && index<intervals.getItem(i).getEnd();
   					});
   					statistics.altitudes = ae.fit.Util.getStatistics(data);
   				}
   				if(this.getSpeeds()){
   					var data = this.getSpeeds().getData().filter(function(elt,index){
   						return index>intervals.getItem(i).getStart() && index<intervals.getItem(i).getEnd();
   					});
   					statistics.speeds = ae.fit.Util.getStatistics(data);
   				}
				if(this.getHeartrates()){
					var data = this.getHeartrates().getData().filter(function(elt,index){
   						return index>intervals.getItem(i).getStart() && index<intervals.getItem(i).getEnd();
   					});
					statistics.heartrates = ae.fit.Util.getStatistics(data);
				}
				if(this.getCadences()){
					var data = this.getCadences().getData().filter(function(elt,index){
   						return index>intervals.getItem(i).getStart() && index<intervals.getItem(i).getEnd();
   					});
					statistics.cadences = ae.fit.Util.getStatistics(data);
				}
				intervals.getItem(i).setStatistics(statistics);
   			}
   			this.setIntervals(intervals);
		},
		
		fromGeoJSON : function(geojson){
			
			if(geojson.features[0].geometry.coordinates){
				this.setCoordinates(geojson.features[0].geometry.coordinates);
				this.calculateDistances();
				
				if(this.getCoordinates()[0][2]){
					var data = [];
					geojson.features[0].geometry.coordinates.forEach(function(elt,index,array){data.push(elt[2]);});
					
					var altitudes = new ae.fit.Data();
					altitudes.setData(data);
					altitudes.setStatistics(ae.fit.Util.getStatistics(data));
					this.setAltitudes(altitudes);
				}
			}
			
	    	if(geojson.features[0].properties.times){
	    		var times = new ae.fit.Data();
	    		times.setData(geojson.features[0].properties.times);
	    		this.setTimes(times);
	    		
	    		this.calculateDurations();
	    	}
	    	
	    	if(this.getDistances() && this.getTimes()){
	    		this.calculateSpeeds();
	    	}
	    	
	    	if(geojson.features[0].properties.heartrates){
	    		var heartrates = new ae.fit.Data();
	    		heartrates.setData(geojson.features[0].properties.heartrates);
	    		heartrates.setStatistics(ae.fit.Util.getStatistics(geojson.features[0].properties.heartrates));
	    		this.setHeartrates(heartrates);
	    	}
	    	
	    	if(geojson.features[0].properties.cadences){
	    		var cadences = new ae.fit.Data();
	    		cadences.setData(geojson.features[0].properties.cadences);
	    		cadences.setStatistics(ae.fit.Util.getStatistics(geojson.features[0].properties.cadences));
	    		this.setCadences(cadences);
	    	}
		}
	}
});
