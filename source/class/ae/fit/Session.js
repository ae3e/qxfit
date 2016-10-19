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
		}
		
	},

	construct : function(){
		this.base(arguments);
		
	}
});
