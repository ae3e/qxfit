/**
 * Fitness data like heartrate, cadence,...
 */
qx.Class.define("ae.fit.Data", {
	extend : qx.core.Object,
	
	properties : {

		name : {
			//apply : "_applyCqlfilter",
			event : "changeName",
			init : null
		},
		
		data : {
			init : []
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
