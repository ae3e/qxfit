qx.Class.define("ae.fit.Util",
    {
        statics: {

            /**
             * Calculate statistics on a vector data
             * @param values {[Float]} Values
             * @return {Object} the converted value with unit
             */
        	getStatistics:function(values){
        		
        		var stats = {};
        		stats.min = Math.min.apply(null,values.filter(function(elt){
					return elt!=null;
				}));
        		stats.max = Math.max.apply(null,values.filter(function(elt){
					return elt!=null;
				}));
        		stats.sum = values.reduce(function(a, b) { return a + b });
        		stats.mean = stats.sum / values.length;

        		return stats;
            }
        }
    });
