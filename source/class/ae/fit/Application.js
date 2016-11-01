/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qxfit"
 *
 * @asset(ae/fit/*)
 */
qx.Class.define("ae.fit.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Create a button
      var button1 = new qx.ui.form.Button("First Button", "ae/fit/test.png");

      // Document is the application root
      var doc = this.getRoot();

      // Add button to document at fixed coordinates
      doc.add(button1, {left: 100, top: 50});

      // Add an event listener
      button1.addListener("execute", function(e) {
        alert("Hello World!");
      });
      
      var url = "https://gist.githubusercontent.com/adeliz/3d4a389c4942fc1468e183dbb8a9396a/raw/Lemoncello.gpx";
      //var url= "https://gist.githubusercontent.com/adeliz/3d4a389c4942fc1468e183dbb8a9396a/raw/Albon.gpx";
      var req = new qx.io.request.Xhr(url);
      req.addListener("success", function (e) {

      	var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(e.getTarget().getResponse(), "text/xml");
        
        var data = toGeoJSON.gpx(xmlDoc);
        data.features[0].properties.times = data.features[0].properties.coordTimes;
        data.features[0].properties.heartrates = data.features[0].properties.heartRates;
        console.log(data);
        
        var session = new ae.fit.Session();
        session.fromGeoJSON(data);
        
        console.log(session.getAltitudes().getStatistics().min+" "+session.getAltitudes().getStatistics().max);
        console.log(session.getTimes().getData()[0]+" "+session.getTimes().getData()[session.getTimes().getData().length-1]);
        console.log(session.getDurations().getData()[session.getDurations().getData().length-1]/1000/60);
        console.log(session.getDistances().getData()[session.getDistances().getData().length-1]);
        
        console.log(session.getHeartrates().getStatistics().min+" "+session.getHeartrates().getStatistics().max);
        console.log(session.getSpeeds().getStatistics().min+" "+session.getSpeeds().getStatistics().max);
        //console.log(session.getCadences().getStatistics().min+" "+session.getCadences().getStatistics().max);
        
        console.log(ae.fit.Util.getSMA(session.getDistances().getData(),10));
        
        session.calculateIntervals("15'- 600m - 10'");
        console.log(session.getIntervals());
      },this);
      req.send();
    }
  }
});
