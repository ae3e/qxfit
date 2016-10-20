/**
 * Interval
 */
qx.Class.define("ae.fit.Interval", {
	extend : qx.core.Object,
	
	properties : {

		name : {
			//apply : "_applyCqlfilter",
			event : "changeName",
			init : null
		},
		
		start : {
			
		},
		
		end : {
			
		},
		
		statistics : {
			
		}		
	},

	construct : function(){
		this.base(arguments);
		
	},
	
	members : {

	}
});
