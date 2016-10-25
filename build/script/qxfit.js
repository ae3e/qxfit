(function(){

if (!window.qx) window.qx = {};

qx.$$start = new Date();

if (!qx.$$environment) qx.$$environment = {};
var envinfo = {"qx.aspects":true,"qx.debug":false,"qx.optimization.basecalls":true,"qx.optimization.privates":true,"qx.optimization.strings":true,"qx.optimization.variables":true,"qx.optimization.whitespace":true,"qx.version":"5.0.1"};
for (var k in envinfo) qx.$$environment[k] = envinfo[k];

if (!qx.$$libraries) qx.$$libraries = {};
var libinfo = {"__out__":{"sourceUri":"script"},"ae.fit":{"resourceUri":"resource","sourceUri":"script"}};
for (var k in libinfo) qx.$$libraries[k] = libinfo[k];

qx.$$resources = {};
qx.$$translations = {"C":null};
qx.$$locales = {"C":null};
qx.$$packageData = {};
qx.$$g = {}

qx.$$loader = {
  parts : {"boot":[0]},
  packages : {"0":{"uris":["__out__:qxfit.5c45509a761d.js.gz"]}},
  urisBefore : [],
  cssBefore : [],
  boot : "boot",
  closureParts : {},
  bootIsInline : true,
  addNoCacheParam : true,

  decodeUris : function(compressedUris)
  {
    var libs = qx.$$libraries;
    var uris = [];
    for (var i=0; i<compressedUris.length; i++)
    {
      var uri = compressedUris[i].split(":");
      var euri;
      if (uri.length==2 && uri[0] in libs) {
        var prefix = libs[uri[0]].sourceUri;
        euri = prefix + "/" + uri[1];
      } else {
        euri = compressedUris[i];
      }
      if (qx.$$loader.addNoCacheParam) {
        euri += "?nocache=" + Math.random();
      }
      
      uris.push(euri);
    }
    return uris;
  }
};

var readyStateValue = {"complete" : true};
if (document.documentMode && document.documentMode < 10 ||
    (typeof window.ActiveXObject !== "undefined" && !document.documentMode)) {
  readyStateValue["loaded"] = true;
}

function loadScript(uri, callback) {
  var elem = document.createElement("script");
  elem.charset = "utf-8";
  elem.src = uri;
  elem.onreadystatechange = elem.onload = function() {
    if (!this.readyState || readyStateValue[this.readyState]) {
      elem.onreadystatechange = elem.onload = null;
      if (typeof callback === "function") {
        callback();
      }
    }
  };

  if (isLoadParallel) {
    elem.async = null;
  }

  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

function loadCss(uri) {
  var elem = document.createElement("link");
  elem.rel = "stylesheet";
  elem.type= "text/css";
  elem.href= uri;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

var isWebkit = /AppleWebKit\/([^ ]+)/.test(navigator.userAgent);
var isLoadParallel = 'async' in document.createElement('script');

function loadScriptList(list, callback) {
  if (list.length == 0) {
    callback();
    return;
  }

  var item;

  if (isLoadParallel) {
    while (list.length) {
      item = list.shift();
      if (list.length) {
        loadScript(item);
      } else {
        loadScript(item, callback);
      }
    }
  } else {
    item = list.shift();
    loadScript(item,  function() {
      if (isWebkit) {
        // force async, else Safari fails with a "maximum recursion depth exceeded"
        window.setTimeout(function() {
          loadScriptList(list, callback);
        }, 0);
      } else {
        loadScriptList(list, callback);
      }
    });
  }
}

var fireContentLoadedEvent = function() {
  qx.$$domReady = true;
  document.removeEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
};
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
}

qx.$$loader.importPackageData = function (dataMap, callback) {
  if (dataMap["resources"]){
    var resMap = dataMap["resources"];
    for (var k in resMap) qx.$$resources[k] = resMap[k];
  }
  if (dataMap["locales"]){
    var locMap = dataMap["locales"];
    var qxlocs = qx.$$locales;
    for (var lang in locMap){
      if (!qxlocs[lang]) qxlocs[lang] = locMap[lang];
      else
        for (var k in locMap[lang]) qxlocs[lang][k] = locMap[lang][k];
    }
  }
  if (dataMap["translations"]){
    var trMap   = dataMap["translations"];
    var qxtrans = qx.$$translations;
    for (var lang in trMap){
      if (!qxtrans[lang]) qxtrans[lang] = trMap[lang];
      else
        for (var k in trMap[lang]) qxtrans[lang][k] = trMap[lang][k];
    }
  }
  if (callback){
    callback(dataMap);
  }
}

qx.$$loader.signalStartup = function ()
{
  qx.$$loader.scriptLoaded = true;
  if (window.qx && qx.event && qx.event.handler && qx.event.handler.Application) {
    qx.event.handler.Application.onScriptLoaded();
    qx.$$loader.applicationHandlerReady = true;
  } else {
    qx.$$loader.applicationHandlerReady = false;
  }
}

// Load all stuff
qx.$$loader.init = function(){
  var l=qx.$$loader;
  if (l.cssBefore.length>0) {
    for (var i=0, m=l.cssBefore.length; i<m; i++) {
      loadCss(l.cssBefore[i]);
    }
  }
  if (l.urisBefore.length>0){
    loadScriptList(l.urisBefore, function(){
      l.initUris();
    });
  } else {
    l.initUris();
  }
}

// Load qooxdoo boot stuff
qx.$$loader.initUris = function(){
  var l=qx.$$loader;
  var bootPackageHash=l.parts[l.boot][0];
  if (l.bootIsInline){
    l.importPackageData(qx.$$packageData[bootPackageHash]);
    l.signalStartup();
  } else {
    loadScriptList(l.decodeUris(l.packages[l.parts[l.boot][0]].uris), function(){
      // Opera needs this extra time to parse the scripts
      window.setTimeout(function(){
        l.importPackageData(qx.$$packageData[bootPackageHash] || {});
        l.signalStartup();
      }, 0);
    });
  }
}
})();

qx.$$packageData['0']={"locales":{},"resources":{},"translations":{}};
(function(){var c="ae.fit.Util";qx.Class.define(c,{statics:{getStatistics:function(d){var e={};e.min=Math.min.apply(null,d.filter(function(f){return f!=null;}));e.max=Math.max.apply(null,d.filter(function(g){return g!=null;}));e.sum=d.reduce(function(a,b){return a+b;});e.mean=e.sum/d.length;return e;}}});})();(function(){var a="ae.fit.Data",b="changeName";qx.Class.define(a,{extend:qx.core.Object,properties:{name:{event:b,init:null},data:{init:[]},statistics:{}},construct:function(){qx.core.Object.call(this);},members:{}});})();(function(){var b="-",d="m",e="'",f="changeName",g="\"",h="ae.fit.Session",l="/",m="x";qx.Class.define(h,{extend:qx.core.Object,properties:{name:{event:f,init:null},coordinates:{},times:{},durations:{},distances:{},speeds:{},heartrates:{init:null},altitudes:{init:null},cadences:{init:null},intervals:{}},construct:function(){qx.core.Object.call(this);},members:{calculateDurations:function(){if(this.getTimes()){var o=[];this.getTimes().getData().forEach(function(r,p,q){o.push(new Date(r)-new Date(q[0]));});};var n=new ae.fit.Data();n.setData(o);n.setStatistics(ae.fit.Util.getStatistics(o));this.setDurations(n);},calculateDistances:function(){var t=function(v,z,x,A){var R=6372.8;var y=(x-v)*(Math.PI/180);var w=(A-z)*(Math.PI/180);v=v*(Math.PI/180);x=x*(Math.PI/180);var a=Math.sin(y/2)*Math.sin(y/2)+Math.sin(w/2)*Math.sin(w/2)*Math.cos(v)*Math.cos(x);var c=2*Math.asin(Math.sqrt(a));return R*c;};var u=[];this.getCoordinates().forEach(function(D,B,C){if(B>0){u.push(u[B-1]+t(C[B-1][0],C[B-1][1],C[B][0],C[B][1]));}else {u.push(0);};});var s=new ae.fit.Data();s.setData(u);this.setDistances(s);},calculateSpeeds:function(){var E=this.getDistances().getData();var H=this.getTimes().getData();if(H&&E){var F=[];H.forEach(function(L,I,J){if(I==0){F.push(null);}else {var K=(E[I]-E[I-1])/(new Date(H[I])-new Date(H[I-1]))*1000*60*60;if(isNaN(K)||!isFinite(K)){K=null;};F.push(K);};});var G=new ae.fit.Data();G.setData(F);G.setStatistics(ae.fit.Util.getStatistics(F));this.setSpeeds(G);};},calculateIntervals:function(bb){var bc=function(bj){var bk=bj.indexOf(e);var bi=bj.indexOf(g);var bh=0;if(bi>0&&bk>0){bh=parseInt(bj.substring(0,bk))*60+parseInt(bj.substring(bk+1,bi));}else {if(bk>0){bh=parseInt(bj.substring(0,bk))*60;};if(bi>0){bh=parseInt(bj.substring(0,bi));};};return bh;};var O=[];var Q=bb.split(b);for(var i=0;i<Q.length;i++ ){var bg=Q[i].split(m);if(bg.length==2){var Y=parseInt(bg[0]);var bf=bg[1].split(l);var T=bf[0];var S=bf[1];for(var j=0;j<Y;j++ ){T.indexOf(d)<0?O.push(bc(T)):O.push(T);S.indexOf(d)<0?O.push(bc(S)):O.push(S);};}else {Q[i].indexOf(d)<0?O.push(bc(Q[i])):O.push(Q[i]);};};var V=this.getDurations().getData();var M=this.getDistances().getData();var be=this.getTimes();var k=0;var U=0;var P=new qx.data.Array();var W,N=false;if(isNaN(O[k])){N=true;};N?W=parseInt(O[k].split[0]):W=O[k]*1000;for(var i=0;i<V.length;i++ ){if(N){if(W>M[i]){continue;}else {var bd=new ae.fit.Interval();bd.setStart(U);bd.setEnd(i);P.push(bd);U=i;k=k+1;if(k==O.length){break;};if(isNaN(O[k])){N=true;W=M[bd.getEnd()]+parseInt(O[k].split()[0])/1000;}else {N=false;W=V[bd.getEnd()]+O[k]*1000;};};}else {if(W>V[i]){continue;}else {var bd=new ae.fit.Interval();bd.setStart(U);bd.setEnd(i);P.push(bd);U=i;k=k+1;if(k==O.length){break;};if(isNaN(O[k])){N=true;W=M[bd.getEnd()]+parseInt(O[k].split()[0])/1000;}else {N=false;W=V[bd.getEnd()]+O[k]*1000;};};};};var bd=new ae.fit.Interval();bd.setStart(U);bd.setEnd(V.length-1);P.push(bd);for(var i=0;i<P.length;i++ ){var X={};if(this.getAltitudes()){var ba=this.getAltitudes().getData().filter(function(bm,bl){return bl>P.getItem(i).getStart()&&bl<P.getItem(i).getEnd();});X.altitudes=ae.fit.Util.getStatistics(ba);};if(this.getSpeeds()){var ba=this.getSpeeds().getData().filter(function(bo,bn){return bn>P.getItem(i).getStart()&&bn<P.getItem(i).getEnd();});X.speeds=ae.fit.Util.getStatistics(ba);};if(this.getHeartrates()){var ba=this.getHeartrates().getData().filter(function(bq,bp){return bp>P.getItem(i).getStart()&&bp<P.getItem(i).getEnd();});X.heartrates=ae.fit.Util.getStatistics(ba);};if(this.getCadences()){var ba=this.getCadences().getData().filter(function(bs,br){return br>P.getItem(i).getStart()&&br<P.getItem(i).getEnd();});X.cadences=ae.fit.Util.getStatistics(ba);};P.getItem(i).setStatistics(X);};this.setIntervals(P);},fromGeoJSON:function(bv){if(bv.features[0].geometry.coordinates){this.setCoordinates(bv.features[0].geometry.coordinates);this.calculateDistances();if(this.getCoordinates()[0][2]){var bu=[];bv.features[0].geometry.coordinates.forEach(function(bB,bz,bA){bu.push(bB[2]);});var by=new ae.fit.Data();by.setData(bu);by.setStatistics(ae.fit.Util.getStatistics(bu));this.setAltitudes(by);};};if(bv.features[0].properties.times){var bw=new ae.fit.Data();bw.setData(bv.features[0].properties.times);this.setTimes(bw);this.calculateDurations();};if(this.getDistances()&&this.getTimes()){this.calculateSpeeds();};if(bv.features[0].properties.heartrates){var bt=new ae.fit.Data();bt.setData(bv.features[0].properties.heartrates);bt.setStatistics(ae.fit.Util.getStatistics(bv.features[0].properties.heartrates));this.setHeartrates(bt);};if(bv.features[0].properties.cadences){var bx=new ae.fit.Data();bx.setData(bv.features[0].properties.cadences);bx.setStatistics(ae.fit.Util.getStatistics(bv.features[0].properties.cadences));this.setCadences(bx);};}}});})();(function(){var a="ae.fit.Interval",b="changeName";qx.Class.define(a,{extend:qx.core.Object,properties:{name:{event:b,init:null},start:{},end:{},statistics:{}},construct:function(){qx.core.Object.call(this);},members:{}});})();

qx.$$loader.init();

