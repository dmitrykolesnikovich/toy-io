var Module = typeof Module !== "undefined" ? Module : {};
if (!Module.expectedDataFileDownloads) {
 Module.expectedDataFileDownloads = 0;
 Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
((function() {
 var loadPackage = (function(metadata) {
  var PACKAGE_PATH;
  if (typeof window === "object") {
   PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/");
  } else if (typeof location !== "undefined") {
   PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/");
  } else {
   throw "using preloaded data can only be done on a web page or in a web worker";
  }
  var PACKAGE_NAME = "../../asmjs/bin/ex_editor.data";
  var REMOTE_PACKAGE_BASE = "ex_editor.data";
  if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
   Module["locateFile"] = Module["locateFilePackage"];
   Module.printErr("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)");
  }
  var REMOTE_PACKAGE_NAME = typeof Module["locateFile"] === "function" ? Module["locateFile"](REMOTE_PACKAGE_BASE) : (Module["filePackagePrefixURL"] || "") + REMOTE_PACKAGE_BASE;
  var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
  var PACKAGE_UUID = metadata.package_uuid;
  function fetchRemotePackage(packageName, packageSize, callback, errback) {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", packageName, true);
   xhr.responseType = "arraybuffer";
   xhr.onprogress = (function(event) {
    var url = packageName;
    var size = packageSize;
    if (event.total) size = event.total;
    if (event.loaded) {
     if (!xhr.addedTotal) {
      xhr.addedTotal = true;
      if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
      Module.dataFileDownloads[url] = {
       loaded: event.loaded,
       total: size
      };
     } else {
      Module.dataFileDownloads[url].loaded = event.loaded;
     }
     var total = 0;
     var loaded = 0;
     var num = 0;
     for (var download in Module.dataFileDownloads) {
      var data = Module.dataFileDownloads[download];
      total += data.total;
      loaded += data.loaded;
      num++;
     }
     total = Math.ceil(total * Module.expectedDataFileDownloads / num);
     if (Module["setStatus"]) Module["setStatus"]("Downloading data... (" + loaded + "/" + total + ")");
    } else if (!Module.dataFileDownloads) {
     if (Module["setStatus"]) Module["setStatus"]("Downloading data...");
    }
   });
   xhr.onerror = (function(event) {
    throw new Error("NetworkError for: " + packageName);
   });
   xhr.onload = (function(event) {
    if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr.response) {
     var packageData = xhr.response;
     callback(packageData);
    } else {
     throw new Error(xhr.statusText + " : " + xhr.responseURL);
    }
   });
   xhr.send(null);
  }
  function handleError(error) {
   console.error("package error:", error);
  }
  var fetchedCallback = null;
  var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;
  if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, (function(data) {
   if (fetchedCallback) {
    fetchedCallback(data);
    fetchedCallback = null;
   } else {
    fetched = data;
   }
  }), handleError);
  function runWithFS() {
   function assert(check, msg) {
    if (!check) throw msg + (new Error).stack;
   }
   Module["FS_createPath"]("/", "data", true, true);
   Module["FS_createPath"]("/data", "interface", true, true);
   Module["FS_createPath"]("/data/interface", "fonts", true, true);
   Module["FS_createPath"]("/data/interface", "styles", true, true);
   Module["FS_createPath"]("/data/interface", "uisprites", true, true);
   Module["FS_createPath"]("/data/interface/uisprites", "graphic", true, true);
   Module["FS_createPath"]("/data/interface/uisprites", "mygui", true, true);
   Module["FS_createPath"]("/data/interface/uisprites", "tbb", true, true);
   Module["FS_createPath"]("/data", "shaders", true, true);
   Module["FS_createPath"]("/data/shaders", "compiled", true, true);
   Module["FS_createPath"]("/data/shaders/compiled", "filter", true, true);
   Module["FS_createPath"]("/data/shaders/compiled", "pbr", true, true);
   Module["FS_createPath"]("/data/shaders", "filter", true, true);
   Module["FS_createPath"]("/data/shaders", "pbr", true, true);
   Module["FS_createPath"]("/data", "textures", true, true);
   Module["FS_createPath"]("/data/textures", "particles", true, true);
   Module["FS_createPath"]("/data/textures", "radiance", true, true);
   Module["FS_createPath"]("/data/textures", "spherical", true, true);
   Module["FS_createPath"]("/data", "models", true, true);
   Module["FS_createPath"]("/data/models", "rifle", true, true);
   Module["FS_createPath"]("/data", "particles", true, true);
   Module["FS_createPath"]("/data", "scripts", true, true);
   Module["FS_createPath"]("/data", "sounds", true, true);
   Module["FS_createPath"]("/data/models", "platform", true, true);
   Module["FS_createPath"]("/data/models", "platform_mat", true, true);
   Module["FS_createPath"]("/data/models", "platform_raw", true, true);
   Module["FS_createPath"]("/data/models", "platform_vox", true, true);
   function DataRequest(start, end, crunched, audio) {
    this.start = start;
    this.end = end;
    this.crunched = crunched;
    this.audio = audio;
   }
   DataRequest.prototype = {
    requests: {},
    open: (function(mode, name) {
     this.name = name;
     this.requests[name] = this;
     Module["addRunDependency"]("fp " + this.name);
    }),
    send: (function() {}),
    onload: (function() {
     var byteArray = this.byteArray.subarray(this.start, this.end);
     this.finish(byteArray);
    }),
    finish: (function(byteArray) {
     var that = this;
     Module["FS_createDataFile"](this.name, null, byteArray, true, true, true);
     Module["removeRunDependency"]("fp " + that.name);
     this.requests[this.name] = null;
    })
   };
   var files = metadata.files;
   for (var i = 0; i < files.length; ++i) {
    (new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio)).open("GET", files[i].filename);
   }
   function processPackageData(arrayBuffer) {
    Module.finishedDataFileDownloads++;
    assert(arrayBuffer, "Loading data file failed.");
    assert(arrayBuffer instanceof ArrayBuffer, "bad input to processPackageData");
    var byteArray = new Uint8Array(arrayBuffer);
    DataRequest.prototype.byteArray = byteArray;
    var files = metadata.files;
    for (var i = 0; i < files.length; ++i) {
     DataRequest.prototype.requests[files[i].filename].onload();
    }
    Module["removeRunDependency"]("datafile_../../asmjs/bin/ex_editor.data");
   }
   Module["addRunDependency"]("datafile_../../asmjs/bin/ex_editor.data");
   if (!Module.preloadResults) Module.preloadResults = {};
   Module.preloadResults[PACKAGE_NAME] = {
    fromCache: false
   };
   if (fetched) {
    processPackageData(fetched);
    fetched = null;
   } else {
    fetchedCallback = processPackageData;
   }
  }
  if (Module["calledRun"]) {
   runWithFS();
  } else {
   if (!Module["preRun"]) Module["preRun"] = [];
   Module["preRun"].push(runWithFS);
  }
 });
 loadPackage({
  "files": [ {
   "audio": 0,
   "start": 0,
   "crunched": 0,
   "end": 392348,
   "filename": "/data/interface/fonts/Consolas-Bold.ttf"
  }, {
   "audio": 0,
   "start": 392348,
   "crunched": 0,
   "end": 846080,
   "filename": "/data/interface/fonts/Consolas.ttf"
  }, {
   "audio": 0,
   "start": 846080,
   "crunched": 0,
   "end": 1253848,
   "filename": "/data/interface/fonts/DejaVuSans.ttf"
  }, {
   "audio": 0,
   "start": 1253848,
   "crunched": 0,
   "end": 1363796,
   "filename": "/data/interface/fonts/Inconsolata-Bold.ttf"
  }, {
   "audio": 0,
   "start": 1363796,
   "crunched": 0,
   "end": 1460760,
   "filename": "/data/interface/fonts/Inconsolata-Regular.ttf"
  }, {
   "audio": 0,
   "start": 1460760,
   "crunched": 0,
   "end": 1465203,
   "filename": "/data/interface/fonts/OFL.txt"
  }, {
   "audio": 0,
   "start": 1465203,
   "crunched": 0,
   "end": 1520235,
   "filename": "/data/interface/fonts/VeraMono-Bold-Italic.ttf"
  }, {
   "audio": 0,
   "start": 1520235,
   "crunched": 0,
   "end": 1569287,
   "filename": "/data/interface/fonts/VeraMono-Bold.ttf"
  }, {
   "audio": 0,
   "start": 1569287,
   "crunched": 0,
   "end": 1623795,
   "filename": "/data/interface/fonts/VeraMono-Italic.ttf"
  }, {
   "audio": 0,
   "start": 1623795,
   "crunched": 0,
   "end": 1673019,
   "filename": "/data/interface/fonts/VeraMono.ttf"
  }, {
   "audio": 0,
   "start": 1673019,
   "crunched": 0,
   "end": 1679471,
   "filename": "/data/interface/styles/blendish.yml"
  }, {
   "audio": 0,
   "start": 1679471,
   "crunched": 0,
   "end": 1680549,
   "filename": "/data/interface/styles/blendish_clear.yml"
  }, {
   "audio": 0,
   "start": 1680549,
   "crunched": 0,
   "end": 1681167,
   "filename": "/data/interface/styles/blendish_dark.yml"
  }, {
   "audio": 0,
   "start": 1681167,
   "crunched": 0,
   "end": 1687496,
   "filename": "/data/interface/styles/minimal.yml"
  }, {
   "audio": 0,
   "start": 1687496,
   "crunched": 0,
   "end": 1692659,
   "filename": "/data/interface/styles/mygui.yml"
  }, {
   "audio": 0,
   "start": 1692659,
   "crunched": 0,
   "end": 1696941,
   "filename": "/data/interface/styles/turbobadger.yml"
  }, {
   "audio": 0,
   "start": 1696941,
   "crunched": 0,
   "end": 1702577,
   "filename": "/data/interface/styles/vector.yml"
  }, {
   "audio": 0,
   "start": 1702577,
   "crunched": 0,
   "end": 1717653,
   "filename": "/data/interface/uisprites/arrow_down.png"
  }, {
   "audio": 0,
   "start": 1717653,
   "crunched": 0,
   "end": 1720597,
   "filename": "/data/interface/uisprites/arrow_down_15.png"
  }, {
   "audio": 0,
   "start": 1720597,
   "crunched": 0,
   "end": 1735704,
   "filename": "/data/interface/uisprites/arrow_left.png"
  }, {
   "audio": 0,
   "start": 1735704,
   "crunched": 0,
   "end": 1738648,
   "filename": "/data/interface/uisprites/arrow_left_15.png"
  }, {
   "audio": 0,
   "start": 1738648,
   "crunched": 0,
   "end": 1753750,
   "filename": "/data/interface/uisprites/arrow_right.png"
  }, {
   "audio": 0,
   "start": 1753750,
   "crunched": 0,
   "end": 1756693,
   "filename": "/data/interface/uisprites/arrow_right_15.png"
  }, {
   "audio": 0,
   "start": 1756693,
   "crunched": 0,
   "end": 1771764,
   "filename": "/data/interface/uisprites/arrow_up.png"
  }, {
   "audio": 0,
   "start": 1771764,
   "crunched": 0,
   "end": 1774697,
   "filename": "/data/interface/uisprites/arrow_up_15.png"
  }, {
   "audio": 0,
   "start": 1774697,
   "crunched": 0,
   "end": 1789938,
   "filename": "/data/interface/uisprites/back_view.png"
  }, {
   "audio": 0,
   "start": 1789938,
   "crunched": 0,
   "end": 1792881,
   "filename": "/data/interface/uisprites/blendish_check.png"
  }, {
   "audio": 0,
   "start": 1792881,
   "crunched": 0,
   "end": 1795859,
   "filename": "/data/interface/uisprites/blendish_updown.png"
  }, {
   "audio": 0,
   "start": 1795859,
   "crunched": 0,
   "end": 1811373,
   "filename": "/data/interface/uisprites/block.png"
  }, {
   "audio": 0,
   "start": 1811373,
   "crunched": 0,
   "end": 1826552,
   "filename": "/data/interface/uisprites/bottom_view.png"
  }, {
   "audio": 0,
   "start": 1826552,
   "crunched": 0,
   "end": 1841926,
   "filename": "/data/interface/uisprites/camera.png"
  }, {
   "audio": 0,
   "start": 1841926,
   "crunched": 0,
   "end": 1857138,
   "filename": "/data/interface/uisprites/camera_.png"
  }, {
   "audio": 0,
   "start": 1857138,
   "crunched": 0,
   "end": 1859966,
   "filename": "/data/interface/uisprites/caret.png"
  }, {
   "audio": 0,
   "start": 1859966,
   "crunched": 0,
   "end": 1862803,
   "filename": "/data/interface/uisprites/caret_white.png"
  }, {
   "audio": 0,
   "start": 1862803,
   "crunched": 0,
   "end": 1880199,
   "filename": "/data/interface/uisprites/check_15.png"
  }, {
   "audio": 0,
   "start": 1880199,
   "crunched": 0,
   "end": 1895429,
   "filename": "/data/interface/uisprites/circle.png"
  }, {
   "audio": 0,
   "start": 1895429,
   "crunched": 0,
   "end": 1913928,
   "filename": "/data/interface/uisprites/class.png"
  }, {
   "audio": 0,
   "start": 1913928,
   "crunched": 0,
   "end": 1931314,
   "filename": "/data/interface/uisprites/close.png"
  }, {
   "audio": 0,
   "start": 1931314,
   "crunched": 0,
   "end": 1949152,
   "filename": "/data/interface/uisprites/close_15.png"
  }, {
   "audio": 0,
   "start": 1949152,
   "crunched": 0,
   "end": 1965179,
   "filename": "/data/interface/uisprites/copy.png"
  }, {
   "audio": 0,
   "start": 1965179,
   "crunched": 0,
   "end": 1980255,
   "filename": "/data/interface/uisprites/drop_down.png"
  }, {
   "audio": 0,
   "start": 1980255,
   "crunched": 0,
   "end": 1995641,
   "filename": "/data/interface/uisprites/edit.png"
  }, {
   "audio": 0,
   "start": 1995641,
   "crunched": 0,
   "end": 2013470,
   "filename": "/data/interface/uisprites/editor.png"
  }, {
   "audio": 0,
   "start": 2013470,
   "crunched": 0,
   "end": 2030735,
   "filename": "/data/interface/uisprites/empty.png"
  }, {
   "audio": 0,
   "start": 2030735,
   "crunched": 0,
   "end": 2033541,
   "filename": "/data/interface/uisprites/empty_15.png"
  }, {
   "audio": 0,
   "start": 2033541,
   "crunched": 0,
   "end": 2053341,
   "filename": "/data/interface/uisprites/energy.png"
  }, {
   "audio": 0,
   "start": 2053341,
   "crunched": 0,
   "end": 2072109,
   "filename": "/data/interface/uisprites/energy64.png"
  }, {
   "audio": 0,
   "start": 2072109,
   "crunched": 0,
   "end": 2087379,
   "filename": "/data/interface/uisprites/entity.png"
  }, {
   "audio": 0,
   "start": 2087379,
   "crunched": 0,
   "end": 2090216,
   "filename": "/data/interface/uisprites/expandbox_separator.png"
  }, {
   "audio": 0,
   "start": 2090216,
   "crunched": 0,
   "end": 2093037,
   "filename": "/data/interface/uisprites/expandbox_sides.png"
  }, {
   "audio": 0,
   "start": 2093037,
   "crunched": 0,
   "end": 2095977,
   "filename": "/data/interface/uisprites/file_15.png"
  }, {
   "audio": 0,
   "start": 2095977,
   "crunched": 0,
   "end": 2098957,
   "filename": "/data/interface/uisprites/file_20.png"
  }, {
   "audio": 0,
   "start": 2098957,
   "crunched": 0,
   "end": 2101914,
   "filename": "/data/interface/uisprites/folder_15.png"
  }, {
   "audio": 0,
   "start": 2101914,
   "crunched": 0,
   "end": 2104892,
   "filename": "/data/interface/uisprites/folder_20.png"
  }, {
   "audio": 0,
   "start": 2104892,
   "crunched": 0,
   "end": 2120114,
   "filename": "/data/interface/uisprites/front_view.png"
  }, {
   "audio": 0,
   "start": 2120114,
   "crunched": 0,
   "end": 2139931,
   "filename": "/data/interface/uisprites/function.png"
  }, {
   "audio": 0,
   "start": 2139931,
   "crunched": 0,
   "end": 2157753,
   "filename": "/data/interface/uisprites/game.png"
  }, {
   "audio": 0,
   "start": 2157753,
   "crunched": 0,
   "end": 2173196,
   "filename": "/data/interface/uisprites/gfx.png"
  }, {
   "audio": 0,
   "start": 2173196,
   "crunched": 0,
   "end": 2188886,
   "filename": "/data/interface/uisprites/handle.png"
  }, {
   "audio": 0,
   "start": 2188886,
   "crunched": 0,
   "end": 2204572,
   "filename": "/data/interface/uisprites/handle_x.png"
  }, {
   "audio": 0,
   "start": 2204572,
   "crunched": 0,
   "end": 2224512,
   "filename": "/data/interface/uisprites/health.png"
  }, {
   "audio": 0,
   "start": 2224512,
   "crunched": 0,
   "end": 2243340,
   "filename": "/data/interface/uisprites/health64.png"
  }, {
   "audio": 0,
   "start": 2243340,
   "crunched": 0,
   "end": 2258653,
   "filename": "/data/interface/uisprites/heap.png"
  }, {
   "audio": 0,
   "start": 2258653,
   "crunched": 0,
   "end": 2274135,
   "filename": "/data/interface/uisprites/inspect.png"
  }, {
   "audio": 0,
   "start": 2274135,
   "crunched": 0,
   "end": 2292030,
   "filename": "/data/interface/uisprites/interactmode.png"
  }, {
   "audio": 0,
   "start": 2292030,
   "crunched": 0,
   "end": 2307227,
   "filename": "/data/interface/uisprites/left_view.png"
  }, {
   "audio": 0,
   "start": 2307227,
   "crunched": 0,
   "end": 2322540,
   "filename": "/data/interface/uisprites/light.png"
  }, {
   "audio": 0,
   "start": 2322540,
   "crunched": 0,
   "end": 2340369,
   "filename": "/data/interface/uisprites/luascript.png"
  }, {
   "audio": 0,
   "start": 2340369,
   "crunched": 0,
   "end": 2361298,
   "filename": "/data/interface/uisprites/material.png"
  }, {
   "audio": 0,
   "start": 2361298,
   "crunched": 0,
   "end": 2382194,
   "filename": "/data/interface/uisprites/model.png"
  }, {
   "audio": 0,
   "start": 2382194,
   "crunched": 0,
   "end": 2385391,
   "filename": "/data/interface/uisprites/mousepointer.png"
  }, {
   "audio": 0,
   "start": 2385391,
   "crunched": 0,
   "end": 2388497,
   "filename": "/data/interface/uisprites/move_20.png"
  }, {
   "audio": 0,
   "start": 2388497,
   "crunched": 0,
   "end": 2394688,
   "filename": "/data/interface/uisprites/ogrehead.png"
  }, {
   "audio": 0,
   "start": 2394688,
   "crunched": 0,
   "end": 2397950,
   "filename": "/data/interface/uisprites/options.png"
  }, {
   "audio": 0,
   "start": 2397950,
   "crunched": 0,
   "end": 2413093,
   "filename": "/data/interface/uisprites/origin.png"
  }, {
   "audio": 0,
   "start": 2413093,
   "crunched": 0,
   "end": 2434262,
   "filename": "/data/interface/uisprites/particles.png"
  }, {
   "audio": 0,
   "start": 2434262,
   "crunched": 0,
   "end": 2449428,
   "filename": "/data/interface/uisprites/place.png"
  }, {
   "audio": 0,
   "start": 2449428,
   "crunched": 0,
   "end": 2470384,
   "filename": "/data/interface/uisprites/prefab.png"
  }, {
   "audio": 0,
   "start": 2470384,
   "crunched": 0,
   "end": 2491359,
   "filename": "/data/interface/uisprites/program.png"
  }, {
   "audio": 0,
   "start": 2491359,
   "crunched": 0,
   "end": 2506674,
   "filename": "/data/interface/uisprites/quadrant.png"
  }, {
   "audio": 0,
   "start": 2506674,
   "crunched": 0,
   "end": 2525046,
   "filename": "/data/interface/uisprites/redo.png"
  }, {
   "audio": 0,
   "start": 2525046,
   "crunched": 0,
   "end": 2528033,
   "filename": "/data/interface/uisprites/resize_diag_left_20.png"
  }, {
   "audio": 0,
   "start": 2528033,
   "crunched": 0,
   "end": 2531018,
   "filename": "/data/interface/uisprites/resize_diag_right_20.png"
  }, {
   "audio": 0,
   "start": 2531018,
   "crunched": 0,
   "end": 2534037,
   "filename": "/data/interface/uisprites/resize_h_20.png"
  }, {
   "audio": 0,
   "start": 2534037,
   "crunched": 0,
   "end": 2537049,
   "filename": "/data/interface/uisprites/resize_v_20.png"
  }, {
   "audio": 0,
   "start": 2537049,
   "crunched": 0,
   "end": 2553655,
   "filename": "/data/interface/uisprites/right_view.png"
  }, {
   "audio": 0,
   "start": 2553655,
   "crunched": 0,
   "end": 2571719,
   "filename": "/data/interface/uisprites/rotate.png"
  }, {
   "audio": 0,
   "start": 2571719,
   "crunched": 0,
   "end": 2589733,
   "filename": "/data/interface/uisprites/scale.png"
  }, {
   "audio": 0,
   "start": 2589733,
   "crunched": 0,
   "end": 2607562,
   "filename": "/data/interface/uisprites/script.png"
  }, {
   "audio": 0,
   "start": 2607562,
   "crunched": 0,
   "end": 2622877,
   "filename": "/data/interface/uisprites/sector.png"
  }, {
   "audio": 0,
   "start": 2622877,
   "crunched": 0,
   "end": 2638289,
   "filename": "/data/interface/uisprites/star.png"
  }, {
   "audio": 0,
   "start": 2638289,
   "crunched": 0,
   "end": 2641674,
   "filename": "/data/interface/uisprites/styleedit.png"
  }, {
   "audio": 0,
   "start": 2641674,
   "crunched": 0,
   "end": 2662652,
   "filename": "/data/interface/uisprites/texture.png"
  }, {
   "audio": 0,
   "start": 2662652,
   "crunched": 0,
   "end": 2677754,
   "filename": "/data/interface/uisprites/toggle_closed.png"
  }, {
   "audio": 0,
   "start": 2677754,
   "crunched": 0,
   "end": 2692830,
   "filename": "/data/interface/uisprites/toggle_open.png"
  }, {
   "audio": 0,
   "start": 2692830,
   "crunched": 0,
   "end": 2710122,
   "filename": "/data/interface/uisprites/top_view.png"
  }, {
   "audio": 0,
   "start": 2710122,
   "crunched": 0,
   "end": 2748610,
   "filename": "/data/interface/uisprites/toy.png"
  }, {
   "audio": 0,
   "start": 2748610,
   "crunched": 0,
   "end": 2808371,
   "filename": "/data/interface/uisprites/toybig.png"
  }, {
   "audio": 0,
   "start": 2808371,
   "crunched": 0,
   "end": 2826398,
   "filename": "/data/interface/uisprites/translate.png"
  }, {
   "audio": 0,
   "start": 2826398,
   "crunched": 0,
   "end": 2841784,
   "filename": "/data/interface/uisprites/ui.png"
  }, {
   "audio": 0,
   "start": 2841784,
   "crunched": 0,
   "end": 2845169,
   "filename": "/data/interface/uisprites/uieditor.png"
  }, {
   "audio": 0,
   "start": 2845169,
   "crunched": 0,
   "end": 2863539,
   "filename": "/data/interface/uisprites/undo.png"
  }, {
   "audio": 0,
   "start": 2863539,
   "crunched": 0,
   "end": 2881880,
   "filename": "/data/interface/uisprites/value.png"
  }, {
   "audio": 0,
   "start": 2881880,
   "crunched": 0,
   "end": 2899709,
   "filename": "/data/interface/uisprites/visualscript.png"
  }, {
   "audio": 0,
   "start": 2899709,
   "crunched": 0,
   "end": 2915121,
   "filename": "/data/interface/uisprites/world.png"
  }, {
   "audio": 0,
   "start": 2915121,
   "crunched": 0,
   "end": 2940552,
   "filename": "/data/interface/uisprites/graphic/blue.png"
  }, {
   "audio": 0,
   "start": 2940552,
   "crunched": 0,
   "end": 2963072,
   "filename": "/data/interface/uisprites/graphic/blue_empty_off.png"
  }, {
   "audio": 0,
   "start": 2963072,
   "crunched": 0,
   "end": 2985837,
   "filename": "/data/interface/uisprites/graphic/blue_empty_on.png"
  }, {
   "audio": 0,
   "start": 2985837,
   "crunched": 0,
   "end": 3008733,
   "filename": "/data/interface/uisprites/graphic/blue_off.png"
  }, {
   "audio": 0,
   "start": 3008733,
   "crunched": 0,
   "end": 3034289,
   "filename": "/data/interface/uisprites/graphic/blue_on.png"
  }, {
   "audio": 0,
   "start": 3034289,
   "crunched": 0,
   "end": 3065478,
   "filename": "/data/interface/uisprites/graphic/knob.png"
  }, {
   "audio": 0,
   "start": 3065478,
   "crunched": 0,
   "end": 3095615,
   "filename": "/data/interface/uisprites/graphic/knob_off.png"
  }, {
   "audio": 0,
   "start": 3095615,
   "crunched": 0,
   "end": 3126804,
   "filename": "/data/interface/uisprites/graphic/knob_on.png"
  }, {
   "audio": 0,
   "start": 3126804,
   "crunched": 0,
   "end": 3150069,
   "filename": "/data/interface/uisprites/graphic/red_off.png"
  }, {
   "audio": 0,
   "start": 3150069,
   "crunched": 0,
   "end": 3176246,
   "filename": "/data/interface/uisprites/graphic/red_on.png"
  }, {
   "audio": 0,
   "start": 3176246,
   "crunched": 0,
   "end": 3199080,
   "filename": "/data/interface/uisprites/graphic/white_off.png"
  }, {
   "audio": 0,
   "start": 3199080,
   "crunched": 0,
   "end": 3224145,
   "filename": "/data/interface/uisprites/graphic/white_on.png"
  }, {
   "audio": 0,
   "start": 3224145,
   "crunched": 0,
   "end": 3227365,
   "filename": "/data/interface/uisprites/mygui/arrow_down.png"
  }, {
   "audio": 0,
   "start": 3227365,
   "crunched": 0,
   "end": 3230620,
   "filename": "/data/interface/uisprites/mygui/arrow_down_hovered.png"
  }, {
   "audio": 0,
   "start": 3230620,
   "crunched": 0,
   "end": 3233874,
   "filename": "/data/interface/uisprites/mygui/arrow_down_pressed.png"
  }, {
   "audio": 0,
   "start": 3233874,
   "crunched": 0,
   "end": 3237087,
   "filename": "/data/interface/uisprites/mygui/arrow_left.png"
  }, {
   "audio": 0,
   "start": 3237087,
   "crunched": 0,
   "end": 3240345,
   "filename": "/data/interface/uisprites/mygui/arrow_left_hovered.png"
  }, {
   "audio": 0,
   "start": 3240345,
   "crunched": 0,
   "end": 3243594,
   "filename": "/data/interface/uisprites/mygui/arrow_left_pressed.png"
  }, {
   "audio": 0,
   "start": 3243594,
   "crunched": 0,
   "end": 3246809,
   "filename": "/data/interface/uisprites/mygui/arrow_right.png"
  }, {
   "audio": 0,
   "start": 3246809,
   "crunched": 0,
   "end": 3250073,
   "filename": "/data/interface/uisprites/mygui/arrow_right_hovered.png"
  }, {
   "audio": 0,
   "start": 3250073,
   "crunched": 0,
   "end": 3253329,
   "filename": "/data/interface/uisprites/mygui/arrow_right_pressed.png"
  }, {
   "audio": 0,
   "start": 3253329,
   "crunched": 0,
   "end": 3256531,
   "filename": "/data/interface/uisprites/mygui/arrow_up.png"
  }, {
   "audio": 0,
   "start": 3256531,
   "crunched": 0,
   "end": 3259777,
   "filename": "/data/interface/uisprites/mygui/arrow_up_hovered.png"
  }, {
   "audio": 0,
   "start": 3259777,
   "crunched": 0,
   "end": 3263017,
   "filename": "/data/interface/uisprites/mygui/arrow_up_pressed.png"
  }, {
   "audio": 0,
   "start": 3263017,
   "crunched": 0,
   "end": 3265983,
   "filename": "/data/interface/uisprites/mygui/button.png"
  }, {
   "audio": 0,
   "start": 3265983,
   "crunched": 0,
   "end": 3268977,
   "filename": "/data/interface/uisprites/mygui/button_active.png"
  }, {
   "audio": 0,
   "start": 3268977,
   "crunched": 0,
   "end": 3272238,
   "filename": "/data/interface/uisprites/mygui/button_hovered.png"
  }, {
   "audio": 0,
   "start": 3272238,
   "crunched": 0,
   "end": 3275232,
   "filename": "/data/interface/uisprites/mygui/button_pressed.png"
  }, {
   "audio": 0,
   "start": 3275232,
   "crunched": 0,
   "end": 3278182,
   "filename": "/data/interface/uisprites/mygui/checkbox.png"
  }, {
   "audio": 0,
   "start": 3278182,
   "crunched": 0,
   "end": 3281645,
   "filename": "/data/interface/uisprites/mygui/checkbox_active.png"
  }, {
   "audio": 0,
   "start": 3281645,
   "crunched": 0,
   "end": 3285329,
   "filename": "/data/interface/uisprites/mygui/checkbox_active_hovered.png"
  }, {
   "audio": 0,
   "start": 3285329,
   "crunched": 0,
   "end": 3288814,
   "filename": "/data/interface/uisprites/mygui/checkbox_active_pressed.png"
  }, {
   "audio": 0,
   "start": 3288814,
   "crunched": 0,
   "end": 3292063,
   "filename": "/data/interface/uisprites/mygui/checkbox_hovered.png"
  }, {
   "audio": 0,
   "start": 3292063,
   "crunched": 0,
   "end": 3295031,
   "filename": "/data/interface/uisprites/mygui/checkbox_pressed.png"
  }, {
   "audio": 0,
   "start": 3295031,
   "crunched": 0,
   "end": 3298632,
   "filename": "/data/interface/uisprites/mygui/closebutton.png"
  }, {
   "audio": 0,
   "start": 3298632,
   "crunched": 0,
   "end": 3302309,
   "filename": "/data/interface/uisprites/mygui/closebutton_hovered.png"
  }, {
   "audio": 0,
   "start": 3302309,
   "crunched": 0,
   "end": 3305910,
   "filename": "/data/interface/uisprites/mygui/closebutton_pressed.png"
  }, {
   "audio": 0,
   "start": 3305910,
   "crunched": 0,
   "end": 3308830,
   "filename": "/data/interface/uisprites/mygui/editbox.png"
  }, {
   "audio": 0,
   "start": 3308830,
   "crunched": 0,
   "end": 3311754,
   "filename": "/data/interface/uisprites/mygui/editbox_active.png"
  }, {
   "audio": 0,
   "start": 3311754,
   "crunched": 0,
   "end": 3314921,
   "filename": "/data/interface/uisprites/mygui/editbox_active_hovered.png"
  }, {
   "audio": 0,
   "start": 3314921,
   "crunched": 0,
   "end": 3318078,
   "filename": "/data/interface/uisprites/mygui/editbox_hovered.png"
  }, {
   "audio": 0,
   "start": 3318078,
   "crunched": 0,
   "end": 3321002,
   "filename": "/data/interface/uisprites/mygui/editbox_pressed.png"
  }, {
   "audio": 0,
   "start": 3321002,
   "crunched": 0,
   "end": 3323926,
   "filename": "/data/interface/uisprites/mygui/frame.png"
  }, {
   "audio": 0,
   "start": 3323926,
   "crunched": 0,
   "end": 3326788,
   "filename": "/data/interface/uisprites/mygui/frame_assym.png"
  }, {
   "audio": 0,
   "start": 3326788,
   "crunched": 0,
   "end": 3329712,
   "filename": "/data/interface/uisprites/mygui/frame_dark.png"
  }, {
   "audio": 0,
   "start": 3329712,
   "crunched": 0,
   "end": 3332634,
   "filename": "/data/interface/uisprites/mygui/frame_transparent.png"
  }, {
   "audio": 0,
   "start": 3332634,
   "crunched": 0,
   "end": 3335534,
   "filename": "/data/interface/uisprites/mygui/frame_transparent_alt.png"
  }, {
   "audio": 0,
   "start": 3335534,
   "crunched": 0,
   "end": 3339092,
   "filename": "/data/interface/uisprites/mygui/radiobutton.png"
  }, {
   "audio": 0,
   "start": 3339092,
   "crunched": 0,
   "end": 3342779,
   "filename": "/data/interface/uisprites/mygui/radiobutton_active.png"
  }, {
   "audio": 0,
   "start": 3342779,
   "crunched": 0,
   "end": 3346581,
   "filename": "/data/interface/uisprites/mygui/radiobutton_active_hovered.png"
  }, {
   "audio": 0,
   "start": 3346581,
   "crunched": 0,
   "end": 3350261,
   "filename": "/data/interface/uisprites/mygui/radiobutton_active_pressed.png"
  }, {
   "audio": 0,
   "start": 3350261,
   "crunched": 0,
   "end": 3353755,
   "filename": "/data/interface/uisprites/mygui/radiobutton_hovered.png"
  }, {
   "audio": 0,
   "start": 3353755,
   "crunched": 0,
   "end": 3356672,
   "filename": "/data/interface/uisprites/mygui/scrollerknoby.png"
  }, {
   "audio": 0,
   "start": 3356672,
   "crunched": 0,
   "end": 3359802,
   "filename": "/data/interface/uisprites/mygui/scrollerknoby_hovered.png"
  }, {
   "audio": 0,
   "start": 3359802,
   "crunched": 0,
   "end": 3362735,
   "filename": "/data/interface/uisprites/mygui/scrollerknoby_pressed.png"
  }, {
   "audio": 0,
   "start": 3362735,
   "crunched": 0,
   "end": 3365673,
   "filename": "/data/interface/uisprites/mygui/sliderknobx.png"
  }, {
   "audio": 0,
   "start": 3365673,
   "crunched": 0,
   "end": 3368634,
   "filename": "/data/interface/uisprites/mygui/sliderknobx_hovered.png"
  }, {
   "audio": 0,
   "start": 3368634,
   "crunched": 0,
   "end": 3371587,
   "filename": "/data/interface/uisprites/mygui/sliderknobx_pressed.png"
  }, {
   "audio": 0,
   "start": 3371587,
   "crunched": 0,
   "end": 3374513,
   "filename": "/data/interface/uisprites/mygui/sliderknoby.png"
  }, {
   "audio": 0,
   "start": 3374513,
   "crunched": 0,
   "end": 3377465,
   "filename": "/data/interface/uisprites/mygui/sliderknoby_hovered.png"
  }, {
   "audio": 0,
   "start": 3377465,
   "crunched": 0,
   "end": 3380403,
   "filename": "/data/interface/uisprites/mygui/sliderknoby_pressed.png"
  }, {
   "audio": 0,
   "start": 3380403,
   "crunched": 0,
   "end": 3383340,
   "filename": "/data/interface/uisprites/mygui/sliderx.png"
  }, {
   "audio": 0,
   "start": 3383340,
   "crunched": 0,
   "end": 3386250,
   "filename": "/data/interface/uisprites/mygui/sliderx_bis.png"
  }, {
   "audio": 0,
   "start": 3386250,
   "crunched": 0,
   "end": 3389195,
   "filename": "/data/interface/uisprites/mygui/tab.png"
  }, {
   "audio": 0,
   "start": 3389195,
   "crunched": 0,
   "end": 3392105,
   "filename": "/data/interface/uisprites/mygui/tableheader.png"
  }, {
   "audio": 0,
   "start": 3392105,
   "crunched": 0,
   "end": 3395240,
   "filename": "/data/interface/uisprites/mygui/tab_button.png"
  }, {
   "audio": 0,
   "start": 3395240,
   "crunched": 0,
   "end": 3398421,
   "filename": "/data/interface/uisprites/mygui/tab_button_active.png"
  }, {
   "audio": 0,
   "start": 3398421,
   "crunched": 0,
   "end": 3401965,
   "filename": "/data/interface/uisprites/mygui/tab_button_active_hovered.png"
  }, {
   "audio": 0,
   "start": 3401965,
   "crunched": 0,
   "end": 3405430,
   "filename": "/data/interface/uisprites/mygui/tab_button_hovered.png"
  }, {
   "audio": 0,
   "start": 3405430,
   "crunched": 0,
   "end": 3408360,
   "filename": "/data/interface/uisprites/mygui/windowbody.png"
  }, {
   "audio": 0,
   "start": 3408360,
   "crunched": 0,
   "end": 3411284,
   "filename": "/data/interface/uisprites/mygui/windowbody_black.png"
  }, {
   "audio": 0,
   "start": 3411284,
   "crunched": 0,
   "end": 3414632,
   "filename": "/data/interface/uisprites/mygui/windowheader.png"
  }, {
   "audio": 0,
   "start": 3414632,
   "crunched": 0,
   "end": 3417909,
   "filename": "/data/interface/uisprites/mygui/windowheader_dark.png"
  }, {
   "audio": 0,
   "start": 3417909,
   "crunched": 0,
   "end": 3421186,
   "filename": "/data/interface/uisprites/mygui/windowheader_darker.png"
  }, {
   "audio": 0,
   "start": 3421186,
   "crunched": 0,
   "end": 3424577,
   "filename": "/data/interface/uisprites/mygui/windowheader_var.png"
  }, {
   "audio": 0,
   "start": 3424577,
   "crunched": 0,
   "end": 3425763,
   "filename": "/data/interface/uisprites/tbb/arrow_down.png"
  }, {
   "audio": 0,
   "start": 3425763,
   "crunched": 0,
   "end": 3426929,
   "filename": "/data/interface/uisprites/tbb/arrow_left.png"
  }, {
   "audio": 0,
   "start": 3426929,
   "crunched": 0,
   "end": 3428108,
   "filename": "/data/interface/uisprites/tbb/arrow_right.png"
  }, {
   "audio": 0,
   "start": 3428108,
   "crunched": 0,
   "end": 3429279,
   "filename": "/data/interface/uisprites/tbb/arrow_up.png"
  }, {
   "audio": 0,
   "start": 3429279,
   "crunched": 0,
   "end": 3431074,
   "filename": "/data/interface/uisprites/tbb/button.png"
  }, {
   "audio": 0,
   "start": 3431074,
   "crunched": 0,
   "end": 3432613,
   "filename": "/data/interface/uisprites/tbb/button_flat_outline.png"
  }, {
   "audio": 0,
   "start": 3432613,
   "crunched": 0,
   "end": 3435707,
   "filename": "/data/interface/uisprites/tbb/button_flat_pressed.png"
  }, {
   "audio": 0,
   "start": 3435707,
   "crunched": 0,
   "end": 3437516,
   "filename": "/data/interface/uisprites/tbb/button_grouped_x_first_down.png"
  }, {
   "audio": 0,
   "start": 3437516,
   "crunched": 0,
   "end": 3439312,
   "filename": "/data/interface/uisprites/tbb/button_grouped_x_first_up.png"
  }, {
   "audio": 0,
   "start": 3439312,
   "crunched": 0,
   "end": 3441102,
   "filename": "/data/interface/uisprites/tbb/button_grouped_x_last_down.png"
  }, {
   "audio": 0,
   "start": 3441102,
   "crunched": 0,
   "end": 3442920,
   "filename": "/data/interface/uisprites/tbb/button_grouped_x_last_up.png"
  }, {
   "audio": 0,
   "start": 3442920,
   "crunched": 0,
   "end": 3444432,
   "filename": "/data/interface/uisprites/tbb/button_grouped_x_middle.png"
  }, {
   "audio": 0,
   "start": 3444432,
   "crunched": 0,
   "end": 3445993,
   "filename": "/data/interface/uisprites/tbb/button_grouped_x_middle_pressed.png"
  }, {
   "audio": 0,
   "start": 3445993,
   "crunched": 0,
   "end": 3447784,
   "filename": "/data/interface/uisprites/tbb/button_pressed.png"
  }, {
   "audio": 0,
   "start": 3447784,
   "crunched": 0,
   "end": 3451118,
   "filename": "/data/interface/uisprites/tbb/checkbox.png"
  }, {
   "audio": 0,
   "start": 3451118,
   "crunched": 0,
   "end": 3455324,
   "filename": "/data/interface/uisprites/tbb/checkbox_active.png"
  }, {
   "audio": 0,
   "start": 3455324,
   "crunched": 0,
   "end": 3458447,
   "filename": "/data/interface/uisprites/tbb/checkbox_pressed.png"
  }, {
   "audio": 0,
   "start": 3458447,
   "crunched": 0,
   "end": 3459904,
   "filename": "/data/interface/uisprites/tbb/container.png"
  }, {
   "audio": 0,
   "start": 3459904,
   "crunched": 0,
   "end": 3461712,
   "filename": "/data/interface/uisprites/tbb/editfield.png"
  }, {
   "audio": 0,
   "start": 3461712,
   "crunched": 0,
   "end": 3464525,
   "filename": "/data/interface/uisprites/tbb/empty.png"
  }, {
   "audio": 0,
   "start": 3464525,
   "crunched": 0,
   "end": 3465556,
   "filename": "/data/interface/uisprites/tbb/fadeout_x.png"
  }, {
   "audio": 0,
   "start": 3465556,
   "crunched": 0,
   "end": 3466527,
   "filename": "/data/interface/uisprites/tbb/fadeout_y.png"
  }, {
   "audio": 0,
   "start": 3466527,
   "crunched": 0,
   "end": 3469415,
   "filename": "/data/interface/uisprites/tbb/focus_tabbutton_left.png"
  }, {
   "audio": 0,
   "start": 3469415,
   "crunched": 0,
   "end": 3470512,
   "filename": "/data/interface/uisprites/tbb/focus_tabbutton_top.png"
  }, {
   "audio": 0,
   "start": 3470512,
   "crunched": 0,
   "end": 3473518,
   "filename": "/data/interface/uisprites/tbb/frame.png"
  }, {
   "audio": 0,
   "start": 3473518,
   "crunched": 0,
   "end": 3477132,
   "filename": "/data/interface/uisprites/tbb/frame_shadow.png"
  }, {
   "audio": 0,
   "start": 3477132,
   "crunched": 0,
   "end": 3480851,
   "filename": "/data/interface/uisprites/tbb/icon48.png"
  }, {
   "audio": 0,
   "start": 3480851,
   "crunched": 0,
   "end": 3482315,
   "filename": "/data/interface/uisprites/tbb/item.png"
  }, {
   "audio": 0,
   "start": 3482315,
   "crunched": 0,
   "end": 3483778,
   "filename": "/data/interface/uisprites/tbb/item_hovered.png"
  }, {
   "audio": 0,
   "start": 3483778,
   "crunched": 0,
   "end": 3485242,
   "filename": "/data/interface/uisprites/tbb/item_selected.png"
  }, {
   "audio": 0,
   "start": 3485242,
   "crunched": 0,
   "end": 3501665,
   "filename": "/data/interface/uisprites/tbb/plug_knob.png"
  }, {
   "audio": 0,
   "start": 3501665,
   "crunched": 0,
   "end": 3503687,
   "filename": "/data/interface/uisprites/tbb/radio.png"
  }, {
   "audio": 0,
   "start": 3503687,
   "crunched": 0,
   "end": 3505541,
   "filename": "/data/interface/uisprites/tbb/radio_mark.png"
  }, {
   "audio": 0,
   "start": 3505541,
   "crunched": 0,
   "end": 3507150,
   "filename": "/data/interface/uisprites/tbb/radio_pressed.png"
  }, {
   "audio": 0,
   "start": 3507150,
   "crunched": 0,
   "end": 3508259,
   "filename": "/data/interface/uisprites/tbb/resizer.png"
  }, {
   "audio": 0,
   "start": 3508259,
   "crunched": 0,
   "end": 3509588,
   "filename": "/data/interface/uisprites/tbb/scroll_bg_x.png"
  }, {
   "audio": 0,
   "start": 3509588,
   "crunched": 0,
   "end": 3510902,
   "filename": "/data/interface/uisprites/tbb/scroll_bg_y.png"
  }, {
   "audio": 0,
   "start": 3510902,
   "crunched": 0,
   "end": 3512701,
   "filename": "/data/interface/uisprites/tbb/scroll_fg_x.png"
  }, {
   "audio": 0,
   "start": 3512701,
   "crunched": 0,
   "end": 3514642,
   "filename": "/data/interface/uisprites/tbb/scroll_fg_y.png"
  }, {
   "audio": 0,
   "start": 3514642,
   "crunched": 0,
   "end": 3517585,
   "filename": "/data/interface/uisprites/tbb/slider_bg_x.png"
  }, {
   "audio": 0,
   "start": 3517585,
   "crunched": 0,
   "end": 3520537,
   "filename": "/data/interface/uisprites/tbb/slider_bg_y.png"
  }, {
   "audio": 0,
   "start": 3520537,
   "crunched": 0,
   "end": 3522590,
   "filename": "/data/interface/uisprites/tbb/slider_handle.png"
  }, {
   "audio": 0,
   "start": 3522590,
   "crunched": 0,
   "end": 3524127,
   "filename": "/data/interface/uisprites/tbb/tab_button_bottom_active.png"
  }, {
   "audio": 0,
   "start": 3524127,
   "crunched": 0,
   "end": 3525537,
   "filename": "/data/interface/uisprites/tbb/tab_button_bottom_inactive.png"
  }, {
   "audio": 0,
   "start": 3525537,
   "crunched": 0,
   "end": 3527013,
   "filename": "/data/interface/uisprites/tbb/tab_button_left_active.png"
  }, {
   "audio": 0,
   "start": 3527013,
   "crunched": 0,
   "end": 3528362,
   "filename": "/data/interface/uisprites/tbb/tab_button_left_inactive.png"
  }, {
   "audio": 0,
   "start": 3528362,
   "crunched": 0,
   "end": 3529890,
   "filename": "/data/interface/uisprites/tbb/tab_button_right_active.png"
  }, {
   "audio": 0,
   "start": 3529890,
   "crunched": 0,
   "end": 3531295,
   "filename": "/data/interface/uisprites/tbb/tab_button_right_inactive.png"
  }, {
   "audio": 0,
   "start": 3531295,
   "crunched": 0,
   "end": 3532661,
   "filename": "/data/interface/uisprites/tbb/tab_button_top.png"
  }, {
   "audio": 0,
   "start": 3532661,
   "crunched": 0,
   "end": 3534142,
   "filename": "/data/interface/uisprites/tbb/tab_button_top_active.png"
  }, {
   "audio": 0,
   "start": 3534142,
   "crunched": 0,
   "end": 3535531,
   "filename": "/data/interface/uisprites/tbb/toggle_section_icon.png"
  }, {
   "audio": 0,
   "start": 3535531,
   "crunched": 0,
   "end": 3536921,
   "filename": "/data/interface/uisprites/tbb/toggle_section_icon_active.png"
  }, {
   "audio": 0,
   "start": 3536921,
   "crunched": 0,
   "end": 3538302,
   "filename": "/data/interface/uisprites/tbb/toggle_section_icon_middle.png"
  }, {
   "audio": 0,
   "start": 3538302,
   "crunched": 0,
   "end": 3540378,
   "filename": "/data/interface/uisprites/tbb/window.png"
  }, {
   "audio": 0,
   "start": 3540378,
   "crunched": 0,
   "end": 3541852,
   "filename": "/data/interface/uisprites/tbb/window_close.png"
  }, {
   "audio": 0,
   "start": 3541852,
   "crunched": 0,
   "end": 3543360,
   "filename": "/data/interface/uisprites/tbb/window_close_pressed.png"
  }, {
   "audio": 0,
   "start": 3543360,
   "crunched": 0,
   "end": 3544368,
   "filename": "/data/interface/uisprites/tbb/window_mover_bg_tile.png"
  }, {
   "audio": 0,
   "start": 3544368,
   "crunched": 0,
   "end": 3545800,
   "filename": "/data/interface/uisprites/tbb/window_mover_overlay.png"
  }, {
   "audio": 0,
   "start": 3545800,
   "crunched": 0,
   "end": 3562082,
   "filename": "/data/interface/uisprites/tbb/window_selected.png"
  }, {
   "audio": 0,
   "start": 3562082,
   "crunched": 0,
   "end": 3578932,
   "filename": "/data/shaders/bgfx_compute.sh"
  }, {
   "audio": 0,
   "start": 3578932,
   "crunched": 0,
   "end": 3596587,
   "filename": "/data/shaders/bgfx_shader.sh"
  }, {
   "audio": 0,
   "start": 3596587,
   "crunched": 0,
   "end": 3599851,
   "filename": "/data/shaders/common.sh"
  }, {
   "audio": 0,
   "start": 3599851,
   "crunched": 0,
   "end": 3603598,
   "filename": "/data/shaders/convert.sh"
  }, {
   "audio": 0,
   "start": 3603598,
   "crunched": 0,
   "end": 3604930,
   "filename": "/data/shaders/cubic.sh"
  }, {
   "audio": 0,
   "start": 3604930,
   "crunched": 0,
   "end": 3606087,
   "filename": "/data/shaders/custom_program_fs.sc"
  }, {
   "audio": 0,
   "start": 3606087,
   "crunched": 0,
   "end": 3606270,
   "filename": "/data/shaders/custom_program_vs.sc"
  }, {
   "audio": 0,
   "start": 3606270,
   "crunched": 0,
   "end": 3606470,
   "filename": "/data/shaders/debug_fs.sc"
  }, {
   "audio": 0,
   "start": 3606470,
   "crunched": 0,
   "end": 3606688,
   "filename": "/data/shaders/debug_vs.sc"
  }, {
   "audio": 0,
   "start": 3606688,
   "crunched": 0,
   "end": 3606958,
   "filename": "/data/shaders/depth.sh"
  }, {
   "audio": 0,
   "start": 3606958,
   "crunched": 0,
   "end": 3607049,
   "filename": "/data/shaders/depth_fs.sc"
  }, {
   "audio": 0,
   "start": 3607049,
   "crunched": 0,
   "end": 3607735,
   "filename": "/data/shaders/depth_vs.sc"
  }, {
   "audio": 0,
   "start": 3607735,
   "crunched": 0,
   "end": 3610430,
   "filename": "/data/shaders/encode.sh"
  }, {
   "audio": 0,
   "start": 3610430,
   "crunched": 0,
   "end": 3611404,
   "filename": "/data/shaders/fresnel_fs.sc"
  }, {
   "audio": 0,
   "start": 3611404,
   "crunched": 0,
   "end": 3611714,
   "filename": "/data/shaders/fresnel_vs.sc"
  }, {
   "audio": 0,
   "start": 3611714,
   "crunched": 0,
   "end": 3612226,
   "filename": "/data/shaders/modelview.sh"
  }, {
   "audio": 0,
   "start": 3612226,
   "crunched": 0,
   "end": 3612577,
   "filename": "/data/shaders/particle_fs.sc"
  }, {
   "audio": 0,
   "start": 3612577,
   "crunched": 0,
   "end": 3612804,
   "filename": "/data/shaders/particle_vs.sc"
  }, {
   "audio": 0,
   "start": 3612804,
   "crunched": 0,
   "end": 3612910,
   "filename": "/data/shaders/picking_id_fs.sc"
  }, {
   "audio": 0,
   "start": 3612910,
   "crunched": 0,
   "end": 3613754,
   "filename": "/data/shaders/picking_id_vs.sc"
  }, {
   "audio": 0,
   "start": 3613754,
   "crunched": 0,
   "end": 3614491,
   "filename": "/data/shaders/shaderlib.sh"
  }, {
   "audio": 0,
   "start": 3614491,
   "crunched": 0,
   "end": 3615648,
   "filename": "/data/shaders/skeleton.sh"
  }, {
   "audio": 0,
   "start": 3615648,
   "crunched": 0,
   "end": 3616178,
   "filename": "/data/shaders/skybox_fs.sc"
  }, {
   "audio": 0,
   "start": 3616178,
   "crunched": 0,
   "end": 3616923,
   "filename": "/data/shaders/skybox_vs.sc"
  }, {
   "audio": 0,
   "start": 3616923,
   "crunched": 0,
   "end": 3618210,
   "filename": "/data/shaders/sky_color_banding_fix_fs.sc"
  }, {
   "audio": 0,
   "start": 3618210,
   "crunched": 0,
   "end": 3618941,
   "filename": "/data/shaders/sky_fs.sc"
  }, {
   "audio": 0,
   "start": 3618941,
   "crunched": 0,
   "end": 3620503,
   "filename": "/data/shaders/sky_landscape_fs.sc"
  }, {
   "audio": 0,
   "start": 3620503,
   "crunched": 0,
   "end": 3620936,
   "filename": "/data/shaders/sky_landscape_vs.sc"
  }, {
   "audio": 0,
   "start": 3620936,
   "crunched": 0,
   "end": 3622988,
   "filename": "/data/shaders/sky_vs.sc"
  }, {
   "audio": 0,
   "start": 3622988,
   "crunched": 0,
   "end": 3624161,
   "filename": "/data/shaders/spherical.sh"
  }, {
   "audio": 0,
   "start": 3624161,
   "crunched": 0,
   "end": 3625202,
   "filename": "/data/shaders/srgb.sh"
  }, {
   "audio": 0,
   "start": 3625202,
   "crunched": 0,
   "end": 3626781,
   "filename": "/data/shaders/star_fs.sc"
  }, {
   "audio": 0,
   "start": 3626781,
   "crunched": 0,
   "end": 3628391,
   "filename": "/data/shaders/star_nest_fs.sc"
  }, {
   "audio": 0,
   "start": 3628391,
   "crunched": 0,
   "end": 3628915,
   "filename": "/data/shaders/star_nest_vs.sc"
  }, {
   "audio": 0,
   "start": 3628915,
   "crunched": 0,
   "end": 3631501,
   "filename": "/data/shaders/tonemap.sh"
  }, {
   "audio": 0,
   "start": 3631501,
   "crunched": 0,
   "end": 3631947,
   "filename": "/data/shaders/triplanar.sh"
  }, {
   "audio": 0,
   "start": 3631947,
   "crunched": 0,
   "end": 3632272,
   "filename": "/data/shaders/unshaded_fs.sc"
  }, {
   "audio": 0,
   "start": 3632272,
   "crunched": 0,
   "end": 3632582,
   "filename": "/data/shaders/unshaded_vs.sc"
  }, {
   "audio": 0,
   "start": 3632582,
   "crunched": 0,
   "end": 3633802,
   "filename": "/data/shaders/varying.def.sc"
  }, {
   "audio": 0,
   "start": 3633802,
   "crunched": 0,
   "end": 3636179,
   "filename": "/data/shaders/compiled/custom_program_v0_fs"
  }, {
   "audio": 0,
   "start": 3636179,
   "crunched": 0,
   "end": 3636556,
   "filename": "/data/shaders/compiled/custom_program_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3636556,
   "crunched": 0,
   "end": 3636863,
   "filename": "/data/shaders/compiled/custom_program_v0_vs"
  }, {
   "audio": 0,
   "start": 3636863,
   "crunched": 0,
   "end": 3637176,
   "filename": "/data/shaders/compiled/custom_program_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3637176,
   "crunched": 0,
   "end": 3637257,
   "filename": "/data/shaders/compiled/depth_v0_fs"
  }, {
   "audio": 0,
   "start": 3637257,
   "crunched": 0,
   "end": 3637561,
   "filename": "/data/shaders/compiled/depth_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3637561,
   "crunched": 0,
   "end": 3638355,
   "filename": "/data/shaders/compiled/depth_v0_vs"
  }, {
   "audio": 0,
   "start": 3638355,
   "crunched": 0,
   "end": 3638891,
   "filename": "/data/shaders/compiled/depth_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3638891,
   "crunched": 0,
   "end": 3638972,
   "filename": "/data/shaders/compiled/depth_v1024_fs"
  }, {
   "audio": 0,
   "start": 3638972,
   "crunched": 0,
   "end": 3639279,
   "filename": "/data/shaders/compiled/depth_v1024_fs.d"
  }, {
   "audio": 0,
   "start": 3639279,
   "crunched": 0,
   "end": 3640073,
   "filename": "/data/shaders/compiled/depth_v1024_vs"
  }, {
   "audio": 0,
   "start": 3640073,
   "crunched": 0,
   "end": 3640612,
   "filename": "/data/shaders/compiled/depth_v1024_vs.d"
  }, {
   "audio": 0,
   "start": 3640612,
   "crunched": 0,
   "end": 3640693,
   "filename": "/data/shaders/compiled/depth_v1025_fs"
  }, {
   "audio": 0,
   "start": 3640693,
   "crunched": 0,
   "end": 3641e3,
   "filename": "/data/shaders/compiled/depth_v1025_fs.d"
  }, {
   "audio": 0,
   "start": 3641e3,
   "crunched": 0,
   "end": 3644259,
   "filename": "/data/shaders/compiled/depth_v1025_vs"
  }, {
   "audio": 0,
   "start": 3644259,
   "crunched": 0,
   "end": 3644798,
   "filename": "/data/shaders/compiled/depth_v1025_vs.d"
  }, {
   "audio": 0,
   "start": 3644798,
   "crunched": 0,
   "end": 3644879,
   "filename": "/data/shaders/compiled/depth_v1026_fs"
  }, {
   "audio": 0,
   "start": 3644879,
   "crunched": 0,
   "end": 3645186,
   "filename": "/data/shaders/compiled/depth_v1026_fs.d"
  }, {
   "audio": 0,
   "start": 3645186,
   "crunched": 0,
   "end": 3646182,
   "filename": "/data/shaders/compiled/depth_v1026_vs"
  }, {
   "audio": 0,
   "start": 3646182,
   "crunched": 0,
   "end": 3646721,
   "filename": "/data/shaders/compiled/depth_v1026_vs.d"
  }, {
   "audio": 0,
   "start": 3646721,
   "crunched": 0,
   "end": 3646802,
   "filename": "/data/shaders/compiled/depth_v1040_fs"
  }, {
   "audio": 0,
   "start": 3646802,
   "crunched": 0,
   "end": 3647109,
   "filename": "/data/shaders/compiled/depth_v1040_fs.d"
  }, {
   "audio": 0,
   "start": 3647109,
   "crunched": 0,
   "end": 3647903,
   "filename": "/data/shaders/compiled/depth_v1040_vs"
  }, {
   "audio": 0,
   "start": 3647903,
   "crunched": 0,
   "end": 3648442,
   "filename": "/data/shaders/compiled/depth_v1040_vs.d"
  }, {
   "audio": 0,
   "start": 3648442,
   "crunched": 0,
   "end": 3648523,
   "filename": "/data/shaders/compiled/depth_v1056_fs"
  }, {
   "audio": 0,
   "start": 3648523,
   "crunched": 0,
   "end": 3648830,
   "filename": "/data/shaders/compiled/depth_v1056_fs.d"
  }, {
   "audio": 0,
   "start": 3648830,
   "crunched": 0,
   "end": 3649624,
   "filename": "/data/shaders/compiled/depth_v1056_vs"
  }, {
   "audio": 0,
   "start": 3649624,
   "crunched": 0,
   "end": 3650163,
   "filename": "/data/shaders/compiled/depth_v1056_vs.d"
  }, {
   "audio": 0,
   "start": 3650163,
   "crunched": 0,
   "end": 3650244,
   "filename": "/data/shaders/compiled/depth_v1058_fs"
  }, {
   "audio": 0,
   "start": 3650244,
   "crunched": 0,
   "end": 3650551,
   "filename": "/data/shaders/compiled/depth_v1058_fs.d"
  }, {
   "audio": 0,
   "start": 3650551,
   "crunched": 0,
   "end": 3651547,
   "filename": "/data/shaders/compiled/depth_v1058_vs"
  }, {
   "audio": 0,
   "start": 3651547,
   "crunched": 0,
   "end": 3652086,
   "filename": "/data/shaders/compiled/depth_v1058_vs.d"
  }, {
   "audio": 0,
   "start": 3652086,
   "crunched": 0,
   "end": 3652167,
   "filename": "/data/shaders/compiled/depth_v1152_fs"
  }, {
   "audio": 0,
   "start": 3652167,
   "crunched": 0,
   "end": 3652474,
   "filename": "/data/shaders/compiled/depth_v1152_fs.d"
  }, {
   "audio": 0,
   "start": 3652474,
   "crunched": 0,
   "end": 3653268,
   "filename": "/data/shaders/compiled/depth_v1152_vs"
  }, {
   "audio": 0,
   "start": 3653268,
   "crunched": 0,
   "end": 3653807,
   "filename": "/data/shaders/compiled/depth_v1152_vs.d"
  }, {
   "audio": 0,
   "start": 3653807,
   "crunched": 0,
   "end": 3653888,
   "filename": "/data/shaders/compiled/depth_v1168_fs"
  }, {
   "audio": 0,
   "start": 3653888,
   "crunched": 0,
   "end": 3654195,
   "filename": "/data/shaders/compiled/depth_v1168_fs.d"
  }, {
   "audio": 0,
   "start": 3654195,
   "crunched": 0,
   "end": 3654989,
   "filename": "/data/shaders/compiled/depth_v1168_vs"
  }, {
   "audio": 0,
   "start": 3654989,
   "crunched": 0,
   "end": 3655528,
   "filename": "/data/shaders/compiled/depth_v1168_vs.d"
  }, {
   "audio": 0,
   "start": 3655528,
   "crunched": 0,
   "end": 3655609,
   "filename": "/data/shaders/compiled/depth_v1_fs"
  }, {
   "audio": 0,
   "start": 3655609,
   "crunched": 0,
   "end": 3655913,
   "filename": "/data/shaders/compiled/depth_v1_fs.d"
  }, {
   "audio": 0,
   "start": 3655913,
   "crunched": 0,
   "end": 3659172,
   "filename": "/data/shaders/compiled/depth_v1_vs"
  }, {
   "audio": 0,
   "start": 3659172,
   "crunched": 0,
   "end": 3659708,
   "filename": "/data/shaders/compiled/depth_v1_vs.d"
  }, {
   "audio": 0,
   "start": 3659708,
   "crunched": 0,
   "end": 3659789,
   "filename": "/data/shaders/compiled/depth_v2_fs"
  }, {
   "audio": 0,
   "start": 3659789,
   "crunched": 0,
   "end": 3660093,
   "filename": "/data/shaders/compiled/depth_v2_fs.d"
  }, {
   "audio": 0,
   "start": 3660093,
   "crunched": 0,
   "end": 3661089,
   "filename": "/data/shaders/compiled/depth_v2_vs"
  }, {
   "audio": 0,
   "start": 3661089,
   "crunched": 0,
   "end": 3661625,
   "filename": "/data/shaders/compiled/depth_v2_vs.d"
  }, {
   "audio": 0,
   "start": 3661625,
   "crunched": 0,
   "end": 3662270,
   "filename": "/data/shaders/compiled/fresnel_v0_fs"
  }, {
   "audio": 0,
   "start": 3662270,
   "crunched": 0,
   "end": 3662576,
   "filename": "/data/shaders/compiled/fresnel_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3662576,
   "crunched": 0,
   "end": 3667910,
   "filename": "/data/shaders/compiled/fresnel_v0_vs"
  }, {
   "audio": 0,
   "start": 3667910,
   "crunched": 0,
   "end": 3668626,
   "filename": "/data/shaders/compiled/fresnel_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3668626,
   "crunched": 0,
   "end": 3668986,
   "filename": "/data/shaders/compiled/particle_v0_fs"
  }, {
   "audio": 0,
   "start": 3668986,
   "crunched": 0,
   "end": 3669293,
   "filename": "/data/shaders/compiled/particle_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3669293,
   "crunched": 0,
   "end": 3669669,
   "filename": "/data/shaders/compiled/particle_v0_vs"
  }, {
   "audio": 0,
   "start": 3669669,
   "crunched": 0,
   "end": 3669976,
   "filename": "/data/shaders/compiled/particle_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3669976,
   "crunched": 0,
   "end": 3670086,
   "filename": "/data/shaders/compiled/picking_id_v0_fs"
  }, {
   "audio": 0,
   "start": 3670086,
   "crunched": 0,
   "end": 3670395,
   "filename": "/data/shaders/compiled/picking_id_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3670395,
   "crunched": 0,
   "end": 3670713,
   "filename": "/data/shaders/compiled/picking_id_v0_vs"
  }, {
   "audio": 0,
   "start": 3670713,
   "crunched": 0,
   "end": 3671198,
   "filename": "/data/shaders/compiled/picking_id_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3671198,
   "crunched": 0,
   "end": 3671308,
   "filename": "/data/shaders/compiled/picking_id_v4_fs"
  }, {
   "audio": 0,
   "start": 3671308,
   "crunched": 0,
   "end": 3671617,
   "filename": "/data/shaders/compiled/picking_id_v4_fs.d"
  }, {
   "audio": 0,
   "start": 3671617,
   "crunched": 0,
   "end": 3672335,
   "filename": "/data/shaders/compiled/picking_id_v4_vs"
  }, {
   "audio": 0,
   "start": 3672335,
   "crunched": 0,
   "end": 3672820,
   "filename": "/data/shaders/compiled/picking_id_v4_vs.d"
  }, {
   "audio": 0,
   "start": 3672820,
   "crunched": 0,
   "end": 3674365,
   "filename": "/data/shaders/compiled/skybox_v0_fs"
  }, {
   "audio": 0,
   "start": 3674365,
   "crunched": 0,
   "end": 3674787,
   "filename": "/data/shaders/compiled/skybox_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3674787,
   "crunched": 0,
   "end": 3675863,
   "filename": "/data/shaders/compiled/skybox_v0_vs"
  }, {
   "audio": 0,
   "start": 3675863,
   "crunched": 0,
   "end": 3676289,
   "filename": "/data/shaders/compiled/skybox_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3676289,
   "crunched": 0,
   "end": 3676959,
   "filename": "/data/shaders/compiled/sky_v0_fs"
  }, {
   "audio": 0,
   "start": 3676959,
   "crunched": 0,
   "end": 3677319,
   "filename": "/data/shaders/compiled/sky_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3677319,
   "crunched": 0,
   "end": 3680556,
   "filename": "/data/shaders/compiled/sky_v0_vs"
  }, {
   "audio": 0,
   "start": 3680556,
   "crunched": 0,
   "end": 3680916,
   "filename": "/data/shaders/compiled/sky_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3680916,
   "crunched": 0,
   "end": 3681285,
   "filename": "/data/shaders/compiled/unshaded_v0_fs"
  }, {
   "audio": 0,
   "start": 3681285,
   "crunched": 0,
   "end": 3681592,
   "filename": "/data/shaders/compiled/unshaded_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3681592,
   "crunched": 0,
   "end": 3686926,
   "filename": "/data/shaders/compiled/unshaded_v0_vs"
  }, {
   "audio": 0,
   "start": 3686926,
   "crunched": 0,
   "end": 3687643,
   "filename": "/data/shaders/compiled/unshaded_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3687643,
   "crunched": 0,
   "end": 3688012,
   "filename": "/data/shaders/compiled/unshaded_v2_fs"
  }, {
   "audio": 0,
   "start": 3688012,
   "crunched": 0,
   "end": 3688319,
   "filename": "/data/shaders/compiled/unshaded_v2_fs.d"
  }, {
   "audio": 0,
   "start": 3688319,
   "crunched": 0,
   "end": 3693826,
   "filename": "/data/shaders/compiled/unshaded_v2_vs"
  }, {
   "audio": 0,
   "start": 3693826,
   "crunched": 0,
   "end": 3694543,
   "filename": "/data/shaders/compiled/unshaded_v2_vs.d"
  }, {
   "audio": 0,
   "start": 3694543,
   "crunched": 0,
   "end": 3694912,
   "filename": "/data/shaders/compiled/unshaded_v4_fs"
  }, {
   "audio": 0,
   "start": 3694912,
   "crunched": 0,
   "end": 3695219,
   "filename": "/data/shaders/compiled/unshaded_v4_fs.d"
  }, {
   "audio": 0,
   "start": 3695219,
   "crunched": 0,
   "end": 3700985,
   "filename": "/data/shaders/compiled/unshaded_v4_vs"
  }, {
   "audio": 0,
   "start": 3700985,
   "crunched": 0,
   "end": 3701702,
   "filename": "/data/shaders/compiled/unshaded_v4_vs.d"
  }, {
   "audio": 0,
   "start": 3701702,
   "crunched": 0,
   "end": 3701906,
   "filename": "/data/shaders/compiled/filter/copy_v0_fs"
  }, {
   "audio": 0,
   "start": 3701906,
   "crunched": 0,
   "end": 3702337,
   "filename": "/data/shaders/compiled/filter/copy_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3702337,
   "crunched": 0,
   "end": 3702783,
   "filename": "/data/shaders/compiled/filter/copy_v0_vs"
  }, {
   "audio": 0,
   "start": 3702783,
   "crunched": 0,
   "end": 3703224,
   "filename": "/data/shaders/compiled/filter/copy_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3703224,
   "crunched": 0,
   "end": 3703481,
   "filename": "/data/shaders/compiled/filter/copy_v128_fs"
  }, {
   "audio": 0,
   "start": 3703481,
   "crunched": 0,
   "end": 3703909,
   "filename": "/data/shaders/compiled/filter/copy_v128_vs"
  }, {
   "audio": 0,
   "start": 3703909,
   "crunched": 0,
   "end": 3704515,
   "filename": "/data/shaders/compiled/filter/copy_v2048_fs"
  }, {
   "audio": 0,
   "start": 3704515,
   "crunched": 0,
   "end": 3704949,
   "filename": "/data/shaders/compiled/filter/copy_v2048_fs.d"
  }, {
   "audio": 0,
   "start": 3704949,
   "crunched": 0,
   "end": 3705699,
   "filename": "/data/shaders/compiled/filter/copy_v2048_vs"
  }, {
   "audio": 0,
   "start": 3705699,
   "crunched": 0,
   "end": 3706143,
   "filename": "/data/shaders/compiled/filter/copy_v2048_vs.d"
  }, {
   "audio": 0,
   "start": 3706143,
   "crunched": 0,
   "end": 3706539,
   "filename": "/data/shaders/compiled/filter/copy_v256_fs"
  }, {
   "audio": 0,
   "start": 3706539,
   "crunched": 0,
   "end": 3706977,
   "filename": "/data/shaders/compiled/filter/copy_v256_fs.d"
  }, {
   "audio": 0,
   "start": 3706977,
   "crunched": 0,
   "end": 3707405,
   "filename": "/data/shaders/compiled/filter/copy_v256_vs"
  }, {
   "audio": 0,
   "start": 3707405,
   "crunched": 0,
   "end": 3707853,
   "filename": "/data/shaders/compiled/filter/copy_v256_vs.d"
  }, {
   "audio": 0,
   "start": 3707853,
   "crunched": 0,
   "end": 3708249,
   "filename": "/data/shaders/compiled/filter/copy_v32_fs"
  }, {
   "audio": 0,
   "start": 3708249,
   "crunched": 0,
   "end": 3708677,
   "filename": "/data/shaders/compiled/filter/copy_v32_vs"
  }, {
   "audio": 0,
   "start": 3708677,
   "crunched": 0,
   "end": 3712781,
   "filename": "/data/shaders/compiled/filter/dof_blur_v0_fs"
  }, {
   "audio": 0,
   "start": 3712781,
   "crunched": 0,
   "end": 3713159,
   "filename": "/data/shaders/compiled/filter/dof_blur_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3713159,
   "crunched": 0,
   "end": 3713605,
   "filename": "/data/shaders/compiled/filter/dof_blur_v0_vs"
  }, {
   "audio": 0,
   "start": 3713605,
   "crunched": 0,
   "end": 3714050,
   "filename": "/data/shaders/compiled/filter/dof_blur_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3714050,
   "crunched": 0,
   "end": 3718015,
   "filename": "/data/shaders/compiled/filter/dof_blur_v1024_fs"
  }, {
   "audio": 0,
   "start": 3718015,
   "crunched": 0,
   "end": 3718396,
   "filename": "/data/shaders/compiled/filter/dof_blur_v1024_fs.d"
  }, {
   "audio": 0,
   "start": 3718396,
   "crunched": 0,
   "end": 3718842,
   "filename": "/data/shaders/compiled/filter/dof_blur_v1024_vs"
  }, {
   "audio": 0,
   "start": 3718842,
   "crunched": 0,
   "end": 3719290,
   "filename": "/data/shaders/compiled/filter/dof_blur_v1024_vs.d"
  }, {
   "audio": 0,
   "start": 3719290,
   "crunched": 0,
   "end": 3723255,
   "filename": "/data/shaders/compiled/filter/dof_blur_v128_fs"
  }, {
   "audio": 0,
   "start": 3723255,
   "crunched": 0,
   "end": 3723640,
   "filename": "/data/shaders/compiled/filter/dof_blur_v128_fs.d"
  }, {
   "audio": 0,
   "start": 3723640,
   "crunched": 0,
   "end": 3724086,
   "filename": "/data/shaders/compiled/filter/dof_blur_v128_vs"
  }, {
   "audio": 0,
   "start": 3724086,
   "crunched": 0,
   "end": 3724538,
   "filename": "/data/shaders/compiled/filter/dof_blur_v128_vs.d"
  }, {
   "audio": 0,
   "start": 3724538,
   "crunched": 0,
   "end": 3728503,
   "filename": "/data/shaders/compiled/filter/dof_blur_v16_fs"
  }, {
   "audio": 0,
   "start": 3728503,
   "crunched": 0,
   "end": 3728949,
   "filename": "/data/shaders/compiled/filter/dof_blur_v16_vs"
  }, {
   "audio": 0,
   "start": 3728949,
   "crunched": 0,
   "end": 3730410,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v1024_fs"
  }, {
   "audio": 0,
   "start": 3730410,
   "crunched": 0,
   "end": 3730858,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v1024_fs.d"
  }, {
   "audio": 0,
   "start": 3730858,
   "crunched": 0,
   "end": 3731304,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v1024_vs"
  }, {
   "audio": 0,
   "start": 3731304,
   "crunched": 0,
   "end": 3731757,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v1024_vs.d"
  }, {
   "audio": 0,
   "start": 3731757,
   "crunched": 0,
   "end": 3733218,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v128_fs"
  }, {
   "audio": 0,
   "start": 3733218,
   "crunched": 0,
   "end": 3733670,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v128_fs.d"
  }, {
   "audio": 0,
   "start": 3733670,
   "crunched": 0,
   "end": 3734116,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v128_vs"
  }, {
   "audio": 0,
   "start": 3734116,
   "crunched": 0,
   "end": 3734573,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v128_vs.d"
  }, {
   "audio": 0,
   "start": 3734573,
   "crunched": 0,
   "end": 3736034,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v16_fs"
  }, {
   "audio": 0,
   "start": 3736034,
   "crunched": 0,
   "end": 3736480,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v16_vs"
  }, {
   "audio": 0,
   "start": 3736480,
   "crunched": 0,
   "end": 3737644,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v2048_fs"
  }, {
   "audio": 0,
   "start": 3737644,
   "crunched": 0,
   "end": 3738092,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v2048_fs.d"
  }, {
   "audio": 0,
   "start": 3738092,
   "crunched": 0,
   "end": 3738538,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v2048_vs"
  }, {
   "audio": 0,
   "start": 3738538,
   "crunched": 0,
   "end": 3738991,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v2048_vs.d"
  }, {
   "audio": 0,
   "start": 3738991,
   "crunched": 0,
   "end": 3740155,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v256_fs"
  }, {
   "audio": 0,
   "start": 3740155,
   "crunched": 0,
   "end": 3740607,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v256_fs.d"
  }, {
   "audio": 0,
   "start": 3740607,
   "crunched": 0,
   "end": 3741053,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v256_vs"
  }, {
   "audio": 0,
   "start": 3741053,
   "crunched": 0,
   "end": 3741510,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v256_vs.d"
  }, {
   "audio": 0,
   "start": 3741510,
   "crunched": 0,
   "end": 3742674,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v32_fs"
  }, {
   "audio": 0,
   "start": 3742674,
   "crunched": 0,
   "end": 3743120,
   "filename": "/data/shaders/compiled/filter/gaussian_blur_v32_vs"
  }, {
   "audio": 0,
   "start": 3743120,
   "crunched": 0,
   "end": 3743647,
   "filename": "/data/shaders/compiled/filter/glow_bleed_v0_fs"
  }, {
   "audio": 0,
   "start": 3743647,
   "crunched": 0,
   "end": 3744153,
   "filename": "/data/shaders/compiled/filter/glow_bleed_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3744153,
   "crunched": 0,
   "end": 3744599,
   "filename": "/data/shaders/compiled/filter/glow_bleed_v0_vs"
  }, {
   "audio": 0,
   "start": 3744599,
   "crunched": 0,
   "end": 3745046,
   "filename": "/data/shaders/compiled/filter/glow_bleed_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3745046,
   "crunched": 0,
   "end": 3746063,
   "filename": "/data/shaders/compiled/filter/glow_v0_fs"
  }, {
   "audio": 0,
   "start": 3746063,
   "crunched": 0,
   "end": 3746563,
   "filename": "/data/shaders/compiled/filter/glow_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3746563,
   "crunched": 0,
   "end": 3747009,
   "filename": "/data/shaders/compiled/filter/glow_v0_vs"
  }, {
   "audio": 0,
   "start": 3747009,
   "crunched": 0,
   "end": 3747450,
   "filename": "/data/shaders/compiled/filter/glow_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3747450,
   "crunched": 0,
   "end": 3752434,
   "filename": "/data/shaders/compiled/filter/glow_v1024_fs"
  }, {
   "audio": 0,
   "start": 3752434,
   "crunched": 0,
   "end": 3752993,
   "filename": "/data/shaders/compiled/filter/glow_v1024_fs.d"
  }, {
   "audio": 0,
   "start": 3752993,
   "crunched": 0,
   "end": 3753439,
   "filename": "/data/shaders/compiled/filter/glow_v1024_vs"
  }, {
   "audio": 0,
   "start": 3753439,
   "crunched": 0,
   "end": 3753883,
   "filename": "/data/shaders/compiled/filter/glow_v1024_vs.d"
  }, {
   "audio": 0,
   "start": 3753883,
   "crunched": 0,
   "end": 3772685,
   "filename": "/data/shaders/compiled/filter/glow_v128_fs"
  }, {
   "audio": 0,
   "start": 3772685,
   "crunched": 0,
   "end": 3773192,
   "filename": "/data/shaders/compiled/filter/glow_v128_fs.d"
  }, {
   "audio": 0,
   "start": 3773192,
   "crunched": 0,
   "end": 3773638,
   "filename": "/data/shaders/compiled/filter/glow_v128_vs"
  }, {
   "audio": 0,
   "start": 3773638,
   "crunched": 0,
   "end": 3774086,
   "filename": "/data/shaders/compiled/filter/glow_v128_vs.d"
  }, {
   "audio": 0,
   "start": 3774086,
   "crunched": 0,
   "end": 3792888,
   "filename": "/data/shaders/compiled/filter/glow_v16_fs"
  }, {
   "audio": 0,
   "start": 3792888,
   "crunched": 0,
   "end": 3793334,
   "filename": "/data/shaders/compiled/filter/glow_v16_vs"
  }, {
   "audio": 0,
   "start": 3793334,
   "crunched": 0,
   "end": 3797836,
   "filename": "/data/shaders/compiled/filter/prefilter_envmap_v0_fs"
  }, {
   "audio": 0,
   "start": 3797836,
   "crunched": 0,
   "end": 3798396,
   "filename": "/data/shaders/compiled/filter/prefilter_envmap_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3798396,
   "crunched": 0,
   "end": 3798703,
   "filename": "/data/shaders/compiled/filter/prefilter_envmap_v0_vs"
  }, {
   "audio": 0,
   "start": 3798703,
   "crunched": 0,
   "end": 3799025,
   "filename": "/data/shaders/compiled/filter/prefilter_envmap_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3799025,
   "crunched": 0,
   "end": 3799192,
   "filename": "/data/shaders/compiled/filter/quad_v0_fs"
  }, {
   "audio": 0,
   "start": 3799192,
   "crunched": 0,
   "end": 3799623,
   "filename": "/data/shaders/compiled/filter/quad_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3799623,
   "crunched": 0,
   "end": 3800069,
   "filename": "/data/shaders/compiled/filter/quad_v0_vs"
  }, {
   "audio": 0,
   "start": 3800069,
   "crunched": 0,
   "end": 3800510,
   "filename": "/data/shaders/compiled/filter/quad_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3800510,
   "crunched": 0,
   "end": 3801043,
   "filename": "/data/shaders/compiled/filter/tonemap_v0_fs"
  }, {
   "audio": 0,
   "start": 3801043,
   "crunched": 0,
   "end": 3801533,
   "filename": "/data/shaders/compiled/filter/tonemap_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3801533,
   "crunched": 0,
   "end": 3801979,
   "filename": "/data/shaders/compiled/filter/tonemap_v0_vs"
  }, {
   "audio": 0,
   "start": 3801979,
   "crunched": 0,
   "end": 3802423,
   "filename": "/data/shaders/compiled/filter/tonemap_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3802423,
   "crunched": 0,
   "end": 3803208,
   "filename": "/data/shaders/compiled/filter/tonemap_v1024_fs"
  }, {
   "audio": 0,
   "start": 3803208,
   "crunched": 0,
   "end": 3803593,
   "filename": "/data/shaders/compiled/filter/tonemap_v1024_fs.d"
  }, {
   "audio": 0,
   "start": 3803593,
   "crunched": 0,
   "end": 3804039,
   "filename": "/data/shaders/compiled/filter/tonemap_v1024_vs"
  }, {
   "audio": 0,
   "start": 3804039,
   "crunched": 0,
   "end": 3804491,
   "filename": "/data/shaders/compiled/filter/tonemap_v1024_vs.d"
  }, {
   "audio": 0,
   "start": 3804491,
   "crunched": 0,
   "end": 3807013,
   "filename": "/data/shaders/compiled/filter/tonemap_v12884901920_fs"
  }, {
   "audio": 0,
   "start": 3807013,
   "crunched": 0,
   "end": 3807763,
   "filename": "/data/shaders/compiled/filter/tonemap_v12884901920_vs"
  }, {
   "audio": 0,
   "start": 3807763,
   "crunched": 0,
   "end": 3808677,
   "filename": "/data/shaders/compiled/filter/tonemap_v12884902912_fs"
  }, {
   "audio": 0,
   "start": 3808677,
   "crunched": 0,
   "end": 3809069,
   "filename": "/data/shaders/compiled/filter/tonemap_v12884902912_fs.d"
  }, {
   "audio": 0,
   "start": 3809069,
   "crunched": 0,
   "end": 3809497,
   "filename": "/data/shaders/compiled/filter/tonemap_v12884902912_vs"
  }, {
   "audio": 0,
   "start": 3809497,
   "crunched": 0,
   "end": 3809956,
   "filename": "/data/shaders/compiled/filter/tonemap_v12884902912_vs.d"
  }, {
   "audio": 0,
   "start": 3809956,
   "crunched": 0,
   "end": 3810734,
   "filename": "/data/shaders/compiled/filter/tonemap_v128_fs"
  }, {
   "audio": 0,
   "start": 3810734,
   "crunched": 0,
   "end": 3811118,
   "filename": "/data/shaders/compiled/filter/tonemap_v128_fs.d"
  }, {
   "audio": 0,
   "start": 3811118,
   "crunched": 0,
   "end": 3811546,
   "filename": "/data/shaders/compiled/filter/tonemap_v128_vs"
  }, {
   "audio": 0,
   "start": 3811546,
   "crunched": 0,
   "end": 3811997,
   "filename": "/data/shaders/compiled/filter/tonemap_v128_vs.d"
  }, {
   "audio": 0,
   "start": 3811997,
   "crunched": 0,
   "end": 3812782,
   "filename": "/data/shaders/compiled/filter/tonemap_v16_fs"
  }, {
   "audio": 0,
   "start": 3812782,
   "crunched": 0,
   "end": 3813228,
   "filename": "/data/shaders/compiled/filter/tonemap_v16_vs"
  }, {
   "audio": 0,
   "start": 3813228,
   "crunched": 0,
   "end": 3815306,
   "filename": "/data/shaders/compiled/filter/tonemap_v32_fs"
  }, {
   "audio": 0,
   "start": 3815306,
   "crunched": 0,
   "end": 3816056,
   "filename": "/data/shaders/compiled/filter/tonemap_v32_vs"
  }, {
   "audio": 0,
   "start": 3816056,
   "crunched": 0,
   "end": 3818362,
   "filename": "/data/shaders/compiled/filter/tonemap_v4294967328_fs"
  }, {
   "audio": 0,
   "start": 3818362,
   "crunched": 0,
   "end": 3819112,
   "filename": "/data/shaders/compiled/filter/tonemap_v4294967328_vs"
  }, {
   "audio": 0,
   "start": 3819112,
   "crunched": 0,
   "end": 3819983,
   "filename": "/data/shaders/compiled/filter/tonemap_v4294968320_fs"
  }, {
   "audio": 0,
   "start": 3819983,
   "crunched": 0,
   "end": 3820374,
   "filename": "/data/shaders/compiled/filter/tonemap_v4294968320_fs.d"
  }, {
   "audio": 0,
   "start": 3820374,
   "crunched": 0,
   "end": 3820802,
   "filename": "/data/shaders/compiled/filter/tonemap_v4294968320_vs"
  }, {
   "audio": 0,
   "start": 3820802,
   "crunched": 0,
   "end": 3821260,
   "filename": "/data/shaders/compiled/filter/tonemap_v4294968320_vs.d"
  }, {
   "audio": 0,
   "start": 3821260,
   "crunched": 0,
   "end": 3824382,
   "filename": "/data/shaders/compiled/filter/tonemap_v8589934624_fs"
  }, {
   "audio": 0,
   "start": 3824382,
   "crunched": 0,
   "end": 3825132,
   "filename": "/data/shaders/compiled/filter/tonemap_v8589934624_vs"
  }, {
   "audio": 0,
   "start": 3825132,
   "crunched": 0,
   "end": 3826254,
   "filename": "/data/shaders/compiled/filter/tonemap_v8589935616_fs"
  }, {
   "audio": 0,
   "start": 3826254,
   "crunched": 0,
   "end": 3826645,
   "filename": "/data/shaders/compiled/filter/tonemap_v8589935616_fs.d"
  }, {
   "audio": 0,
   "start": 3826645,
   "crunched": 0,
   "end": 3827073,
   "filename": "/data/shaders/compiled/filter/tonemap_v8589935616_vs"
  }, {
   "audio": 0,
   "start": 3827073,
   "crunched": 0,
   "end": 3827531,
   "filename": "/data/shaders/compiled/filter/tonemap_v8589935616_vs.d"
  }, {
   "audio": 0,
   "start": 3827531,
   "crunched": 0,
   "end": 3834159,
   "filename": "/data/shaders/compiled/pbr/pbr_v0_fs"
  }, {
   "audio": 0,
   "start": 3834159,
   "crunched": 0,
   "end": 3835560,
   "filename": "/data/shaders/compiled/pbr/pbr_v0_fs.d"
  }, {
   "audio": 0,
   "start": 3835560,
   "crunched": 0,
   "end": 3836655,
   "filename": "/data/shaders/compiled/pbr/pbr_v0_vs"
  }, {
   "audio": 0,
   "start": 3836655,
   "crunched": 0,
   "end": 3837252,
   "filename": "/data/shaders/compiled/pbr/pbr_v0_vs.d"
  }, {
   "audio": 0,
   "start": 3837252,
   "crunched": 0,
   "end": 3847339,
   "filename": "/data/shaders/compiled/pbr/pbr_v1024_fs"
  }, {
   "audio": 0,
   "start": 3847339,
   "crunched": 0,
   "end": 3848743,
   "filename": "/data/shaders/compiled/pbr/pbr_v1024_fs.d"
  }, {
   "audio": 0,
   "start": 3848743,
   "crunched": 0,
   "end": 3854077,
   "filename": "/data/shaders/compiled/pbr/pbr_v1024_vs"
  }, {
   "audio": 0,
   "start": 3854077,
   "crunched": 0,
   "end": 3854735,
   "filename": "/data/shaders/compiled/pbr/pbr_v1024_vs.d"
  }, {
   "audio": 0,
   "start": 3854735,
   "crunched": 0,
   "end": 3864822,
   "filename": "/data/shaders/compiled/pbr/pbr_v1025_fs"
  }, {
   "audio": 0,
   "start": 3864822,
   "crunched": 0,
   "end": 3866226,
   "filename": "/data/shaders/compiled/pbr/pbr_v1025_fs.d"
  }, {
   "audio": 0,
   "start": 3866226,
   "crunched": 0,
   "end": 3874085,
   "filename": "/data/shaders/compiled/pbr/pbr_v1025_vs"
  }, {
   "audio": 0,
   "start": 3874085,
   "crunched": 0,
   "end": 3874743,
   "filename": "/data/shaders/compiled/pbr/pbr_v1025_vs.d"
  }, {
   "audio": 0,
   "start": 3874743,
   "crunched": 0,
   "end": 3884830,
   "filename": "/data/shaders/compiled/pbr/pbr_v1026_fs"
  }, {
   "audio": 0,
   "start": 3884830,
   "crunched": 0,
   "end": 3886234,
   "filename": "/data/shaders/compiled/pbr/pbr_v1026_fs.d"
  }, {
   "audio": 0,
   "start": 3886234,
   "crunched": 0,
   "end": 3891741,
   "filename": "/data/shaders/compiled/pbr/pbr_v1026_vs"
  }, {
   "audio": 0,
   "start": 3891741,
   "crunched": 0,
   "end": 3892399,
   "filename": "/data/shaders/compiled/pbr/pbr_v1026_vs.d"
  }, {
   "audio": 0,
   "start": 3892399,
   "crunched": 0,
   "end": 3909192,
   "filename": "/data/shaders/compiled/pbr/pbr_v1032_fs"
  }, {
   "audio": 0,
   "start": 3909192,
   "crunched": 0,
   "end": 3910596,
   "filename": "/data/shaders/compiled/pbr/pbr_v1032_fs.d"
  }, {
   "audio": 0,
   "start": 3910596,
   "crunched": 0,
   "end": 3912983,
   "filename": "/data/shaders/compiled/pbr/pbr_v1032_vs"
  }, {
   "audio": 0,
   "start": 3912983,
   "crunched": 0,
   "end": 3913583,
   "filename": "/data/shaders/compiled/pbr/pbr_v1032_vs.d"
  }, {
   "audio": 0,
   "start": 3913583,
   "crunched": 0,
   "end": 3930376,
   "filename": "/data/shaders/compiled/pbr/pbr_v1033_fs"
  }, {
   "audio": 0,
   "start": 3930376,
   "crunched": 0,
   "end": 3931780,
   "filename": "/data/shaders/compiled/pbr/pbr_v1033_fs.d"
  }, {
   "audio": 0,
   "start": 3931780,
   "crunched": 0,
   "end": 3936911,
   "filename": "/data/shaders/compiled/pbr/pbr_v1033_vs"
  }, {
   "audio": 0,
   "start": 3936911,
   "crunched": 0,
   "end": 3937511,
   "filename": "/data/shaders/compiled/pbr/pbr_v1033_vs.d"
  }, {
   "audio": 0,
   "start": 3937511,
   "crunched": 0,
   "end": 3954304,
   "filename": "/data/shaders/compiled/pbr/pbr_v1034_fs"
  }, {
   "audio": 0,
   "start": 3954304,
   "crunched": 0,
   "end": 3955708,
   "filename": "/data/shaders/compiled/pbr/pbr_v1034_fs.d"
  }, {
   "audio": 0,
   "start": 3955708,
   "crunched": 0,
   "end": 3959782,
   "filename": "/data/shaders/compiled/pbr/pbr_v1034_vs"
  }, {
   "audio": 0,
   "start": 3959782,
   "crunched": 0,
   "end": 3960382,
   "filename": "/data/shaders/compiled/pbr/pbr_v1034_vs.d"
  }, {
   "audio": 0,
   "start": 3960382,
   "crunched": 0,
   "end": 3970867,
   "filename": "/data/shaders/compiled/pbr/pbr_v1040_fs"
  }, {
   "audio": 0,
   "start": 3970867,
   "crunched": 0,
   "end": 3972271,
   "filename": "/data/shaders/compiled/pbr/pbr_v1040_fs.d"
  }, {
   "audio": 0,
   "start": 3972271,
   "crunched": 0,
   "end": 3973366,
   "filename": "/data/shaders/compiled/pbr/pbr_v1040_vs"
  }, {
   "audio": 0,
   "start": 3973366,
   "crunched": 0,
   "end": 3973966,
   "filename": "/data/shaders/compiled/pbr/pbr_v1040_vs.d"
  }, {
   "audio": 0,
   "start": 3973966,
   "crunched": 0,
   "end": 3984251,
   "filename": "/data/shaders/compiled/pbr/pbr_v1056_fs"
  }, {
   "audio": 0,
   "start": 3984251,
   "crunched": 0,
   "end": 3985655,
   "filename": "/data/shaders/compiled/pbr/pbr_v1056_fs.d"
  }, {
   "audio": 0,
   "start": 3985655,
   "crunched": 0,
   "end": 3990989,
   "filename": "/data/shaders/compiled/pbr/pbr_v1056_vs"
  }, {
   "audio": 0,
   "start": 3990989,
   "crunched": 0,
   "end": 3991647,
   "filename": "/data/shaders/compiled/pbr/pbr_v1056_vs.d"
  }, {
   "audio": 0,
   "start": 3991647,
   "crunched": 0,
   "end": 4001932,
   "filename": "/data/shaders/compiled/pbr/pbr_v1057_fs"
  }, {
   "audio": 0,
   "start": 4001932,
   "crunched": 0,
   "end": 4003336,
   "filename": "/data/shaders/compiled/pbr/pbr_v1057_fs.d"
  }, {
   "audio": 0,
   "start": 4003336,
   "crunched": 0,
   "end": 4011195,
   "filename": "/data/shaders/compiled/pbr/pbr_v1057_vs"
  }, {
   "audio": 0,
   "start": 4011195,
   "crunched": 0,
   "end": 4011853,
   "filename": "/data/shaders/compiled/pbr/pbr_v1057_vs.d"
  }, {
   "audio": 0,
   "start": 4011853,
   "crunched": 0,
   "end": 4022138,
   "filename": "/data/shaders/compiled/pbr/pbr_v1058_fs"
  }, {
   "audio": 0,
   "start": 4022138,
   "crunched": 0,
   "end": 4023542,
   "filename": "/data/shaders/compiled/pbr/pbr_v1058_fs.d"
  }, {
   "audio": 0,
   "start": 4023542,
   "crunched": 0,
   "end": 4029049,
   "filename": "/data/shaders/compiled/pbr/pbr_v1058_vs"
  }, {
   "audio": 0,
   "start": 4029049,
   "crunched": 0,
   "end": 4029707,
   "filename": "/data/shaders/compiled/pbr/pbr_v1058_vs.d"
  }, {
   "audio": 0,
   "start": 4029707,
   "crunched": 0,
   "end": 4046658,
   "filename": "/data/shaders/compiled/pbr/pbr_v1064_fs"
  }, {
   "audio": 0,
   "start": 4046658,
   "crunched": 0,
   "end": 4048062,
   "filename": "/data/shaders/compiled/pbr/pbr_v1064_fs.d"
  }, {
   "audio": 0,
   "start": 4048062,
   "crunched": 0,
   "end": 4050449,
   "filename": "/data/shaders/compiled/pbr/pbr_v1064_vs"
  }, {
   "audio": 0,
   "start": 4050449,
   "crunched": 0,
   "end": 4051049,
   "filename": "/data/shaders/compiled/pbr/pbr_v1064_vs.d"
  }, {
   "audio": 0,
   "start": 4051049,
   "crunched": 0,
   "end": 4068e3,
   "filename": "/data/shaders/compiled/pbr/pbr_v1065_fs"
  }, {
   "audio": 0,
   "start": 4068e3,
   "crunched": 0,
   "end": 4069404,
   "filename": "/data/shaders/compiled/pbr/pbr_v1065_fs.d"
  }, {
   "audio": 0,
   "start": 4069404,
   "crunched": 0,
   "end": 4074535,
   "filename": "/data/shaders/compiled/pbr/pbr_v1065_vs"
  }, {
   "audio": 0,
   "start": 4074535,
   "crunched": 0,
   "end": 4075135,
   "filename": "/data/shaders/compiled/pbr/pbr_v1065_vs.d"
  }, {
   "audio": 0,
   "start": 4075135,
   "crunched": 0,
   "end": 4092086,
   "filename": "/data/shaders/compiled/pbr/pbr_v1066_fs"
  }, {
   "audio": 0,
   "start": 4092086,
   "crunched": 0,
   "end": 4093490,
   "filename": "/data/shaders/compiled/pbr/pbr_v1066_fs.d"
  }, {
   "audio": 0,
   "start": 4093490,
   "crunched": 0,
   "end": 4097564,
   "filename": "/data/shaders/compiled/pbr/pbr_v1066_vs"
  }, {
   "audio": 0,
   "start": 4097564,
   "crunched": 0,
   "end": 4098164,
   "filename": "/data/shaders/compiled/pbr/pbr_v1066_vs.d"
  }, {
   "audio": 0,
   "start": 4098164,
   "crunched": 0,
   "end": 4111788,
   "filename": "/data/shaders/compiled/pbr/pbr_v1103806595280_fs"
  }, {
   "audio": 0,
   "start": 4111788,
   "crunched": 0,
   "end": 4112883,
   "filename": "/data/shaders/compiled/pbr/pbr_v1103806595280_vs"
  }, {
   "audio": 0,
   "start": 4112883,
   "crunched": 0,
   "end": 4125984,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564032_fs"
  }, {
   "audio": 0,
   "start": 4125984,
   "crunched": 0,
   "end": 4127164,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564032_fs.d"
  }, {
   "audio": 0,
   "start": 4127164,
   "crunched": 0,
   "end": 4128259,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564032_vs"
  }, {
   "audio": 0,
   "start": 4128259,
   "crunched": 0,
   "end": 4128873,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564032_vs.d"
  }, {
   "audio": 0,
   "start": 4128873,
   "crunched": 0,
   "end": 4142014,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564033_fs"
  }, {
   "audio": 0,
   "start": 4142014,
   "crunched": 0,
   "end": 4143194,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564033_fs.d"
  }, {
   "audio": 0,
   "start": 4143194,
   "crunched": 0,
   "end": 4146752,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564033_vs"
  }, {
   "audio": 0,
   "start": 4146752,
   "crunched": 0,
   "end": 4147366,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564033_vs.d"
  }, {
   "audio": 0,
   "start": 4147366,
   "crunched": 0,
   "end": 4169848,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564040_fs"
  }, {
   "audio": 0,
   "start": 4169848,
   "crunched": 0,
   "end": 4171028,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564040_fs.d"
  }, {
   "audio": 0,
   "start": 4171028,
   "crunched": 0,
   "end": 4173415,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564040_vs"
  }, {
   "audio": 0,
   "start": 4173415,
   "crunched": 0,
   "end": 4174029,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564040_vs.d"
  }, {
   "audio": 0,
   "start": 4174029,
   "crunched": 0,
   "end": 4196511,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564041_fs"
  }, {
   "audio": 0,
   "start": 4196511,
   "crunched": 0,
   "end": 4197691,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564041_fs.d"
  }, {
   "audio": 0,
   "start": 4197691,
   "crunched": 0,
   "end": 4202742,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564041_vs"
  }, {
   "audio": 0,
   "start": 4202742,
   "crunched": 0,
   "end": 4203356,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564041_vs.d"
  }, {
   "audio": 0,
   "start": 4203356,
   "crunched": 0,
   "end": 4216957,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564048_fs"
  }, {
   "audio": 0,
   "start": 4216957,
   "crunched": 0,
   "end": 4218137,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564048_fs.d"
  }, {
   "audio": 0,
   "start": 4218137,
   "crunched": 0,
   "end": 4219232,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564048_vs"
  }, {
   "audio": 0,
   "start": 4219232,
   "crunched": 0,
   "end": 4219846,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564048_vs.d"
  }, {
   "audio": 0,
   "start": 4219846,
   "crunched": 0,
   "end": 4233691,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564080_fs"
  }, {
   "audio": 0,
   "start": 4233691,
   "crunched": 0,
   "end": 4234871,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564080_fs.d"
  }, {
   "audio": 0,
   "start": 4234871,
   "crunched": 0,
   "end": 4235966,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564080_vs"
  }, {
   "audio": 0,
   "start": 4235966,
   "crunched": 0,
   "end": 4236580,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101564080_vs.d"
  }, {
   "audio": 0,
   "start": 4236580,
   "crunched": 0,
   "end": 4253684,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101586952_fs"
  }, {
   "audio": 0,
   "start": 4253684,
   "crunched": 0,
   "end": 4255097,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101586952_fs.d"
  }, {
   "audio": 0,
   "start": 4255097,
   "crunched": 0,
   "end": 4257484,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101586952_vs"
  }, {
   "audio": 0,
   "start": 4257484,
   "crunched": 0,
   "end": 4258093,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101586952_vs.d"
  }, {
   "audio": 0,
   "start": 4258093,
   "crunched": 0,
   "end": 4275355,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101586984_fs"
  }, {
   "audio": 0,
   "start": 4275355,
   "crunched": 0,
   "end": 4276768,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101586984_fs.d"
  }, {
   "audio": 0,
   "start": 4276768,
   "crunched": 0,
   "end": 4279155,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101586984_vs"
  }, {
   "audio": 0,
   "start": 4279155,
   "crunched": 0,
   "end": 4279764,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101586984_vs.d"
  }, {
   "audio": 0,
   "start": 4279764,
   "crunched": 0,
   "end": 4292918,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587968_fs"
  }, {
   "audio": 0,
   "start": 4292918,
   "crunched": 0,
   "end": 4294331,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587968_fs.d"
  }, {
   "audio": 0,
   "start": 4294331,
   "crunched": 0,
   "end": 4299665,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587968_vs"
  }, {
   "audio": 0,
   "start": 4299665,
   "crunched": 0,
   "end": 4300332,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587968_vs.d"
  }, {
   "audio": 0,
   "start": 4300332,
   "crunched": 0,
   "end": 4313486,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587969_fs"
  }, {
   "audio": 0,
   "start": 4313486,
   "crunched": 0,
   "end": 4314899,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587969_fs.d"
  }, {
   "audio": 0,
   "start": 4314899,
   "crunched": 0,
   "end": 4322758,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587969_vs"
  }, {
   "audio": 0,
   "start": 4322758,
   "crunched": 0,
   "end": 4323425,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587969_vs.d"
  }, {
   "audio": 0,
   "start": 4323425,
   "crunched": 0,
   "end": 4345342,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587976_fs"
  }, {
   "audio": 0,
   "start": 4345342,
   "crunched": 0,
   "end": 4346755,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587976_fs.d"
  }, {
   "audio": 0,
   "start": 4346755,
   "crunched": 0,
   "end": 4349142,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587976_vs"
  }, {
   "audio": 0,
   "start": 4349142,
   "crunched": 0,
   "end": 4349751,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101587976_vs.d"
  }, {
   "audio": 0,
   "start": 4349751,
   "crunched": 0,
   "end": 4363109,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588000_fs"
  }, {
   "audio": 0,
   "start": 4363109,
   "crunched": 0,
   "end": 4364522,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588000_fs.d"
  }, {
   "audio": 0,
   "start": 4364522,
   "crunched": 0,
   "end": 4369856,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588000_vs"
  }, {
   "audio": 0,
   "start": 4369856,
   "crunched": 0,
   "end": 4370523,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588000_vs.d"
  }, {
   "audio": 0,
   "start": 4370523,
   "crunched": 0,
   "end": 4383881,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588002_fs"
  }, {
   "audio": 0,
   "start": 4383881,
   "crunched": 0,
   "end": 4385294,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588002_fs.d"
  }, {
   "audio": 0,
   "start": 4385294,
   "crunched": 0,
   "end": 4386585,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588002_vs"
  }, {
   "audio": 0,
   "start": 4386585,
   "crunched": 0,
   "end": 4387252,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588002_vs.d"
  }, {
   "audio": 0,
   "start": 4387252,
   "crunched": 0,
   "end": 4409327,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588008_fs"
  }, {
   "audio": 0,
   "start": 4409327,
   "crunched": 0,
   "end": 4410740,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588008_fs.d"
  }, {
   "audio": 0,
   "start": 4410740,
   "crunched": 0,
   "end": 4413127,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588008_vs"
  }, {
   "audio": 0,
   "start": 4413127,
   "crunched": 0,
   "end": 4413736,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588008_vs.d"
  }, {
   "audio": 0,
   "start": 4413736,
   "crunched": 0,
   "end": 4435811,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588010_fs"
  }, {
   "audio": 0,
   "start": 4435811,
   "crunched": 0,
   "end": 4437224,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588010_fs.d"
  }, {
   "audio": 0,
   "start": 4437224,
   "crunched": 0,
   "end": 4441298,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588010_vs"
  }, {
   "audio": 0,
   "start": 4441298,
   "crunched": 0,
   "end": 4441907,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588010_vs.d"
  }, {
   "audio": 0,
   "start": 4441907,
   "crunched": 0,
   "end": 4455228,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588096_fs"
  }, {
   "audio": 0,
   "start": 4455228,
   "crunched": 0,
   "end": 4456641,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588096_fs.d"
  }, {
   "audio": 0,
   "start": 4456641,
   "crunched": 0,
   "end": 4461975,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588096_vs"
  }, {
   "audio": 0,
   "start": 4461975,
   "crunched": 0,
   "end": 4462642,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588096_vs.d"
  }, {
   "audio": 0,
   "start": 4462642,
   "crunched": 0,
   "end": 4476366,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588112_fs"
  }, {
   "audio": 0,
   "start": 4476366,
   "crunched": 0,
   "end": 4477779,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588112_fs.d"
  }, {
   "audio": 0,
   "start": 4477779,
   "crunched": 0,
   "end": 4483113,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588112_vs"
  }, {
   "audio": 0,
   "start": 4483113,
   "crunched": 0,
   "end": 4483780,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588112_vs.d"
  }, {
   "audio": 0,
   "start": 4483780,
   "crunched": 0,
   "end": 4497706,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588144_fs"
  }, {
   "audio": 0,
   "start": 4497706,
   "crunched": 0,
   "end": 4499119,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588144_fs.d"
  }, {
   "audio": 0,
   "start": 4499119,
   "crunched": 0,
   "end": 4505195,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588144_vs"
  }, {
   "audio": 0,
   "start": 4505195,
   "crunched": 0,
   "end": 4505804,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588144_vs.d"
  }, {
   "audio": 0,
   "start": 4505804,
   "crunched": 0,
   "end": 4519943,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588272_fs"
  }, {
   "audio": 0,
   "start": 4519943,
   "crunched": 0,
   "end": 4521356,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588272_fs.d"
  }, {
   "audio": 0,
   "start": 4521356,
   "crunched": 0,
   "end": 4522451,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588272_vs"
  }, {
   "audio": 0,
   "start": 4522451,
   "crunched": 0,
   "end": 4523060,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588272_vs.d"
  }, {
   "audio": 0,
   "start": 4523060,
   "crunched": 0,
   "end": 4538405,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588912_fs"
  }, {
   "audio": 0,
   "start": 4538405,
   "crunched": 0,
   "end": 4539818,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588912_fs.d"
  }, {
   "audio": 0,
   "start": 4539818,
   "crunched": 0,
   "end": 4540913,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588912_vs"
  }, {
   "audio": 0,
   "start": 4540913,
   "crunched": 0,
   "end": 4541522,
   "filename": "/data/shaders/compiled/pbr/pbr_v1108101588912_vs.d"
  }, {
   "audio": 0,
   "start": 4541522,
   "crunched": 0,
   "end": 4554676,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522560_fs"
  }, {
   "audio": 0,
   "start": 4554676,
   "crunched": 0,
   "end": 4556089,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522560_fs.d"
  }, {
   "audio": 0,
   "start": 4556089,
   "crunched": 0,
   "end": 4561423,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522560_vs"
  }, {
   "audio": 0,
   "start": 4561423,
   "crunched": 0,
   "end": 4562090,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522560_vs.d"
  }, {
   "audio": 0,
   "start": 4562090,
   "crunched": 0,
   "end": 4584007,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522568_fs"
  }, {
   "audio": 0,
   "start": 4584007,
   "crunched": 0,
   "end": 4585420,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522568_fs.d"
  }, {
   "audio": 0,
   "start": 4585420,
   "crunched": 0,
   "end": 4587807,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522568_vs"
  }, {
   "audio": 0,
   "start": 4587807,
   "crunched": 0,
   "end": 4588416,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522568_vs.d"
  }, {
   "audio": 0,
   "start": 4588416,
   "crunched": 0,
   "end": 4601774,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522592_fs"
  }, {
   "audio": 0,
   "start": 4601774,
   "crunched": 0,
   "end": 4603187,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522592_fs.d"
  }, {
   "audio": 0,
   "start": 4603187,
   "crunched": 0,
   "end": 4608521,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522592_vs"
  }, {
   "audio": 0,
   "start": 4608521,
   "crunched": 0,
   "end": 4609188,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522592_vs.d"
  }, {
   "audio": 0,
   "start": 4609188,
   "crunched": 0,
   "end": 4622546,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522594_fs"
  }, {
   "audio": 0,
   "start": 4622546,
   "crunched": 0,
   "end": 4623959,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522594_fs.d"
  }, {
   "audio": 0,
   "start": 4623959,
   "crunched": 0,
   "end": 4629466,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522594_vs"
  }, {
   "audio": 0,
   "start": 4629466,
   "crunched": 0,
   "end": 4630133,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522594_vs.d"
  }, {
   "audio": 0,
   "start": 4630133,
   "crunched": 0,
   "end": 4652208,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522600_fs"
  }, {
   "audio": 0,
   "start": 4652208,
   "crunched": 0,
   "end": 4653621,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522600_fs.d"
  }, {
   "audio": 0,
   "start": 4653621,
   "crunched": 0,
   "end": 4656008,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522600_vs"
  }, {
   "audio": 0,
   "start": 4656008,
   "crunched": 0,
   "end": 4656617,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522600_vs.d"
  }, {
   "audio": 0,
   "start": 4656617,
   "crunched": 0,
   "end": 4678692,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522602_fs"
  }, {
   "audio": 0,
   "start": 4678692,
   "crunched": 0,
   "end": 4680105,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522602_fs.d"
  }, {
   "audio": 0,
   "start": 4680105,
   "crunched": 0,
   "end": 4684179,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522602_vs"
  }, {
   "audio": 0,
   "start": 4684179,
   "crunched": 0,
   "end": 4684788,
   "filename": "/data/shaders/compiled/pbr/pbr_v1116691522602_vs.d"
  }, {
   "audio": 0,
   "start": 4684788,
   "crunched": 0,
   "end": 4695036,
   "filename": "/data/shaders/compiled/pbr/pbr_v1152_fs"
  }, {
   "audio": 0,
   "start": 4695036,
   "crunched": 0,
   "end": 4696440,
   "filename": "/data/shaders/compiled/pbr/pbr_v1152_fs.d"
  }, {
   "audio": 0,
   "start": 4696440,
   "crunched": 0,
   "end": 4701774,
   "filename": "/data/shaders/compiled/pbr/pbr_v1152_vs"
  }, {
   "audio": 0,
   "start": 4701774,
   "crunched": 0,
   "end": 4702432,
   "filename": "/data/shaders/compiled/pbr/pbr_v1152_vs.d"
  }, {
   "audio": 0,
   "start": 4702432,
   "crunched": 0,
   "end": 4719411,
   "filename": "/data/shaders/compiled/pbr/pbr_v1160_fs"
  }, {
   "audio": 0,
   "start": 4719411,
   "crunched": 0,
   "end": 4720815,
   "filename": "/data/shaders/compiled/pbr/pbr_v1160_fs.d"
  }, {
   "audio": 0,
   "start": 4720815,
   "crunched": 0,
   "end": 4723202,
   "filename": "/data/shaders/compiled/pbr/pbr_v1160_vs"
  }, {
   "audio": 0,
   "start": 4723202,
   "crunched": 0,
   "end": 4723802,
   "filename": "/data/shaders/compiled/pbr/pbr_v1160_vs.d"
  }, {
   "audio": 0,
   "start": 4723802,
   "crunched": 0,
   "end": 4734448,
   "filename": "/data/shaders/compiled/pbr/pbr_v1168_fs"
  }, {
   "audio": 0,
   "start": 4734448,
   "crunched": 0,
   "end": 4735852,
   "filename": "/data/shaders/compiled/pbr/pbr_v1168_fs.d"
  }, {
   "audio": 0,
   "start": 4735852,
   "crunched": 0,
   "end": 4741186,
   "filename": "/data/shaders/compiled/pbr/pbr_v1168_vs"
  }, {
   "audio": 0,
   "start": 4741186,
   "crunched": 0,
   "end": 4741844,
   "filename": "/data/shaders/compiled/pbr/pbr_v1168_vs.d"
  }, {
   "audio": 0,
   "start": 4741844,
   "crunched": 0,
   "end": 4759582,
   "filename": "/data/shaders/compiled/pbr/pbr_v1176_fs"
  }, {
   "audio": 0,
   "start": 4759582,
   "crunched": 0,
   "end": 4760986,
   "filename": "/data/shaders/compiled/pbr/pbr_v1176_fs.d"
  }, {
   "audio": 0,
   "start": 4760986,
   "crunched": 0,
   "end": 4763373,
   "filename": "/data/shaders/compiled/pbr/pbr_v1176_vs"
  }, {
   "audio": 0,
   "start": 4763373,
   "crunched": 0,
   "end": 4763973,
   "filename": "/data/shaders/compiled/pbr/pbr_v1176_vs.d"
  }, {
   "audio": 0,
   "start": 4763973,
   "crunched": 0,
   "end": 4774814,
   "filename": "/data/shaders/compiled/pbr/pbr_v1200_fs"
  }, {
   "audio": 0,
   "start": 4774814,
   "crunched": 0,
   "end": 4776103,
   "filename": "/data/shaders/compiled/pbr/pbr_v1200_fs.d"
  }, {
   "audio": 0,
   "start": 4776103,
   "crunched": 0,
   "end": 4777198,
   "filename": "/data/shaders/compiled/pbr/pbr_v1200_vs"
  }, {
   "audio": 0,
   "start": 4777198,
   "crunched": 0,
   "end": 4777798,
   "filename": "/data/shaders/compiled/pbr/pbr_v1200_vs.d"
  }, {
   "audio": 0,
   "start": 4777798,
   "crunched": 0,
   "end": 4787886,
   "filename": "/data/shaders/compiled/pbr/pbr_v128_fs"
  }, {
   "audio": 0,
   "start": 4787886,
   "crunched": 0,
   "end": 4789056,
   "filename": "/data/shaders/compiled/pbr/pbr_v128_fs.d"
  }, {
   "audio": 0,
   "start": 4789056,
   "crunched": 0,
   "end": 4790151,
   "filename": "/data/shaders/compiled/pbr/pbr_v128_vs"
  }, {
   "audio": 0,
   "start": 4790151,
   "crunched": 0,
   "end": 4790755,
   "filename": "/data/shaders/compiled/pbr/pbr_v128_vs.d"
  }, {
   "audio": 0,
   "start": 4790755,
   "crunched": 0,
   "end": 4800843,
   "filename": "/data/shaders/compiled/pbr/pbr_v129_fs"
  }, {
   "audio": 0,
   "start": 4800843,
   "crunched": 0,
   "end": 4802013,
   "filename": "/data/shaders/compiled/pbr/pbr_v129_fs.d"
  }, {
   "audio": 0,
   "start": 4802013,
   "crunched": 0,
   "end": 4805571,
   "filename": "/data/shaders/compiled/pbr/pbr_v129_vs"
  }, {
   "audio": 0,
   "start": 4805571,
   "crunched": 0,
   "end": 4806175,
   "filename": "/data/shaders/compiled/pbr/pbr_v129_vs.d"
  }, {
   "audio": 0,
   "start": 4806175,
   "crunched": 0,
   "end": 4816477,
   "filename": "/data/shaders/compiled/pbr/pbr_v130_fs"
  }, {
   "audio": 0,
   "start": 4816477,
   "crunched": 0,
   "end": 4817647,
   "filename": "/data/shaders/compiled/pbr/pbr_v130_fs.d"
  }, {
   "audio": 0,
   "start": 4817647,
   "crunched": 0,
   "end": 4818938,
   "filename": "/data/shaders/compiled/pbr/pbr_v130_vs"
  }, {
   "audio": 0,
   "start": 4818938,
   "crunched": 0,
   "end": 4819542,
   "filename": "/data/shaders/compiled/pbr/pbr_v130_vs.d"
  }, {
   "audio": 0,
   "start": 4819542,
   "crunched": 0,
   "end": 4830585,
   "filename": "/data/shaders/compiled/pbr/pbr_v1328_fs"
  }, {
   "audio": 0,
   "start": 4830585,
   "crunched": 0,
   "end": 4831874,
   "filename": "/data/shaders/compiled/pbr/pbr_v1328_fs.d"
  }, {
   "audio": 0,
   "start": 4831874,
   "crunched": 0,
   "end": 4832969,
   "filename": "/data/shaders/compiled/pbr/pbr_v1328_vs"
  }, {
   "audio": 0,
   "start": 4832969,
   "crunched": 0,
   "end": 4833569,
   "filename": "/data/shaders/compiled/pbr/pbr_v1328_vs.d"
  }, {
   "audio": 0,
   "start": 4833569,
   "crunched": 0,
   "end": 4850927,
   "filename": "/data/shaders/compiled/pbr/pbr_v136_fs"
  }, {
   "audio": 0,
   "start": 4850927,
   "crunched": 0,
   "end": 4852097,
   "filename": "/data/shaders/compiled/pbr/pbr_v136_fs.d"
  }, {
   "audio": 0,
   "start": 4852097,
   "crunched": 0,
   "end": 4854484,
   "filename": "/data/shaders/compiled/pbr/pbr_v136_vs"
  }, {
   "audio": 0,
   "start": 4854484,
   "crunched": 0,
   "end": 4855088,
   "filename": "/data/shaders/compiled/pbr/pbr_v136_vs.d"
  }, {
   "audio": 0,
   "start": 4855088,
   "crunched": 0,
   "end": 4872446,
   "filename": "/data/shaders/compiled/pbr/pbr_v137_fs"
  }, {
   "audio": 0,
   "start": 4872446,
   "crunched": 0,
   "end": 4873616,
   "filename": "/data/shaders/compiled/pbr/pbr_v137_fs.d"
  }, {
   "audio": 0,
   "start": 4873616,
   "crunched": 0,
   "end": 4878667,
   "filename": "/data/shaders/compiled/pbr/pbr_v137_vs"
  }, {
   "audio": 0,
   "start": 4878667,
   "crunched": 0,
   "end": 4879271,
   "filename": "/data/shaders/compiled/pbr/pbr_v137_vs.d"
  }, {
   "audio": 0,
   "start": 4879271,
   "crunched": 0,
   "end": 4891249,
   "filename": "/data/shaders/compiled/pbr/pbr_v1424_fs"
  }, {
   "audio": 0,
   "start": 4891249,
   "crunched": 0,
   "end": 4892543,
   "filename": "/data/shaders/compiled/pbr/pbr_v1424_fs.d"
  }, {
   "audio": 0,
   "start": 4892543,
   "crunched": 0,
   "end": 4893638,
   "filename": "/data/shaders/compiled/pbr/pbr_v1424_vs"
  }, {
   "audio": 0,
   "start": 4893638,
   "crunched": 0,
   "end": 4894243,
   "filename": "/data/shaders/compiled/pbr/pbr_v1424_vs.d"
  }, {
   "audio": 0,
   "start": 4894243,
   "crunched": 0,
   "end": 4913109,
   "filename": "/data/shaders/compiled/pbr/pbr_v1432_fs"
  }, {
   "audio": 0,
   "start": 4913109,
   "crunched": 0,
   "end": 4914403,
   "filename": "/data/shaders/compiled/pbr/pbr_v1432_fs.d"
  }, {
   "audio": 0,
   "start": 4914403,
   "crunched": 0,
   "end": 4916790,
   "filename": "/data/shaders/compiled/pbr/pbr_v1432_vs"
  }, {
   "audio": 0,
   "start": 4916790,
   "crunched": 0,
   "end": 4917395,
   "filename": "/data/shaders/compiled/pbr/pbr_v1432_vs.d"
  }, {
   "audio": 0,
   "start": 4917395,
   "crunched": 0,
   "end": 4928110,
   "filename": "/data/shaders/compiled/pbr/pbr_v144_fs"
  }, {
   "audio": 0,
   "start": 4928110,
   "crunched": 0,
   "end": 4929340,
   "filename": "/data/shaders/compiled/pbr/pbr_v144_fs.d"
  }, {
   "audio": 0,
   "start": 4929340,
   "crunched": 0,
   "end": 4930435,
   "filename": "/data/shaders/compiled/pbr/pbr_v144_vs"
  }, {
   "audio": 0,
   "start": 4930435,
   "crunched": 0,
   "end": 4931039,
   "filename": "/data/shaders/compiled/pbr/pbr_v144_vs.d"
  }, {
   "audio": 0,
   "start": 4931039,
   "crunched": 0,
   "end": 4941806,
   "filename": "/data/shaders/compiled/pbr/pbr_v16_fs"
  }, {
   "audio": 0,
   "start": 4941806,
   "crunched": 0,
   "end": 4942901,
   "filename": "/data/shaders/compiled/pbr/pbr_v16_vs"
  }, {
   "audio": 0,
   "start": 4942901,
   "crunched": 0,
   "end": 4977900,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179869296_fs"
  }, {
   "audio": 0,
   "start": 4977900,
   "crunched": 0,
   "end": 4980287,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179869296_vs"
  }, {
   "audio": 0,
   "start": 4980287,
   "crunched": 0,
   "end": 5003513,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179869392_fs"
  }, {
   "audio": 0,
   "start": 5003513,
   "crunched": 0,
   "end": 5004608,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179869392_vs"
  }, {
   "audio": 0,
   "start": 5004608,
   "crunched": 0,
   "end": 5039891,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179869400_fs"
  }, {
   "audio": 0,
   "start": 5039891,
   "crunched": 0,
   "end": 5042278,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179869400_vs"
  }, {
   "audio": 0,
   "start": 5042278,
   "crunched": 0,
   "end": 5061591,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870722_fs"
  }, {
   "audio": 0,
   "start": 5061591,
   "crunched": 0,
   "end": 5062882,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870722_vs"
  }, {
   "audio": 0,
   "start": 5062882,
   "crunched": 0,
   "end": 5085649,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870848_fs"
  }, {
   "audio": 0,
   "start": 5085649,
   "crunched": 0,
   "end": 5086744,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870848_vs"
  }, {
   "audio": 0,
   "start": 5086744,
   "crunched": 0,
   "end": 5120958,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870856_fs"
  }, {
   "audio": 0,
   "start": 5120958,
   "crunched": 0,
   "end": 5123345,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870856_vs"
  }, {
   "audio": 0,
   "start": 5123345,
   "crunched": 0,
   "end": 5124440,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870864_vs"
  }, {
   "audio": 0,
   "start": 5124440,
   "crunched": 0,
   "end": 5159565,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870872_fs"
  }, {
   "audio": 0,
   "start": 5159565,
   "crunched": 0,
   "end": 5161952,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870872_vs"
  }, {
   "audio": 0,
   "start": 5161952,
   "crunched": 0,
   "end": 5185393,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870896_fs"
  }, {
   "audio": 0,
   "start": 5185393,
   "crunched": 0,
   "end": 5186488,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870896_vs"
  }, {
   "audio": 0,
   "start": 5186488,
   "crunched": 0,
   "end": 5222339,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870904_fs"
  }, {
   "audio": 0,
   "start": 5222339,
   "crunched": 0,
   "end": 5224726,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179870904_vs"
  }, {
   "audio": 0,
   "start": 5224726,
   "crunched": 0,
   "end": 5243727,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179881474_fs"
  }, {
   "audio": 0,
   "start": 5243727,
   "crunched": 0,
   "end": 5245023,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179881474_fs.d"
  }, {
   "audio": 0,
   "start": 5245023,
   "crunched": 0,
   "end": 5246314,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179881474_vs"
  }, {
   "audio": 0,
   "start": 5246314,
   "crunched": 0,
   "end": 5246921,
   "filename": "/data/shaders/compiled/pbr/pbr_v17179881474_vs.d"
  }, {
   "audio": 0,
   "start": 5246921,
   "crunched": 0,
   "end": 5264488,
   "filename": "/data/shaders/compiled/pbr/pbr_v17_fs"
  }, {
   "audio": 0,
   "start": 5264488,
   "crunched": 0,
   "end": 5269539,
   "filename": "/data/shaders/compiled/pbr/pbr_v17_vs"
  }, {
   "audio": 0,
   "start": 5269539,
   "crunched": 0,
   "end": 5281532,
   "filename": "/data/shaders/compiled/pbr/pbr_v1936_fs"
  }, {
   "audio": 0,
   "start": 5281532,
   "crunched": 0,
   "end": 5282821,
   "filename": "/data/shaders/compiled/pbr/pbr_v1936_fs.d"
  }, {
   "audio": 0,
   "start": 5282821,
   "crunched": 0,
   "end": 5283916,
   "filename": "/data/shaders/compiled/pbr/pbr_v1936_vs"
  }, {
   "audio": 0,
   "start": 5283916,
   "crunched": 0,
   "end": 5284516,
   "filename": "/data/shaders/compiled/pbr/pbr_v1936_vs.d"
  }, {
   "audio": 0,
   "start": 5284516,
   "crunched": 0,
   "end": 5304426,
   "filename": "/data/shaders/compiled/pbr/pbr_v1944_fs"
  }, {
   "audio": 0,
   "start": 5304426,
   "crunched": 0,
   "end": 5305720,
   "filename": "/data/shaders/compiled/pbr/pbr_v1944_fs.d"
  }, {
   "audio": 0,
   "start": 5305720,
   "crunched": 0,
   "end": 5308107,
   "filename": "/data/shaders/compiled/pbr/pbr_v1944_vs"
  }, {
   "audio": 0,
   "start": 5308107,
   "crunched": 0,
   "end": 5308712,
   "filename": "/data/shaders/compiled/pbr/pbr_v1944_vs.d"
  }, {
   "audio": 0,
   "start": 5308712,
   "crunched": 0,
   "end": 5320898,
   "filename": "/data/shaders/compiled/pbr/pbr_v1968_fs"
  }, {
   "audio": 0,
   "start": 5320898,
   "crunched": 0,
   "end": 5322187,
   "filename": "/data/shaders/compiled/pbr/pbr_v1968_fs.d"
  }, {
   "audio": 0,
   "start": 5322187,
   "crunched": 0,
   "end": 5323282,
   "filename": "/data/shaders/compiled/pbr/pbr_v1968_vs"
  }, {
   "audio": 0,
   "start": 5323282,
   "crunched": 0,
   "end": 5323882,
   "filename": "/data/shaders/compiled/pbr/pbr_v1968_vs.d"
  }, {
   "audio": 0,
   "start": 5323882,
   "crunched": 0,
   "end": 5339390,
   "filename": "/data/shaders/compiled/pbr/pbr_v2203318223056_fs"
  }, {
   "audio": 0,
   "start": 5339390,
   "crunched": 0,
   "end": 5340485,
   "filename": "/data/shaders/compiled/pbr/pbr_v2203318223056_vs"
  }, {
   "audio": 0,
   "start": 5340485,
   "crunched": 0,
   "end": 5355719,
   "filename": "/data/shaders/compiled/pbr/pbr_v2207613191808_fs"
  }, {
   "audio": 0,
   "start": 5355719,
   "crunched": 0,
   "end": 5356899,
   "filename": "/data/shaders/compiled/pbr/pbr_v2207613191808_fs.d"
  }, {
   "audio": 0,
   "start": 5356899,
   "crunched": 0,
   "end": 5357994,
   "filename": "/data/shaders/compiled/pbr/pbr_v2207613191808_vs"
  }, {
   "audio": 0,
   "start": 5357994,
   "crunched": 0,
   "end": 5358608,
   "filename": "/data/shaders/compiled/pbr/pbr_v2207613191808_vs.d"
  }, {
   "audio": 0,
   "start": 5358608,
   "crunched": 0,
   "end": 5369596,
   "filename": "/data/shaders/compiled/pbr/pbr_v24_fs"
  }, {
   "audio": 0,
   "start": 5369596,
   "crunched": 0,
   "end": 5370691,
   "filename": "/data/shaders/compiled/pbr/pbr_v24_vs"
  }, {
   "audio": 0,
   "start": 5370691,
   "crunched": 0,
   "end": 5377316,
   "filename": "/data/shaders/compiled/pbr/pbr_v2_fs"
  }, {
   "audio": 0,
   "start": 5377316,
   "crunched": 0,
   "end": 5378602,
   "filename": "/data/shaders/compiled/pbr/pbr_v2_fs.d"
  }, {
   "audio": 0,
   "start": 5378602,
   "crunched": 0,
   "end": 5379893,
   "filename": "/data/shaders/compiled/pbr/pbr_v2_vs"
  }, {
   "audio": 0,
   "start": 5379893,
   "crunched": 0,
   "end": 5380490,
   "filename": "/data/shaders/compiled/pbr/pbr_v2_vs.d"
  }, {
   "audio": 0,
   "start": 5380490,
   "crunched": 0,
   "end": 5387316,
   "filename": "/data/shaders/compiled/pbr/pbr_v32_fs"
  }, {
   "audio": 0,
   "start": 5387316,
   "crunched": 0,
   "end": 5388718,
   "filename": "/data/shaders/compiled/pbr/pbr_v32_fs.d"
  }, {
   "audio": 0,
   "start": 5388718,
   "crunched": 0,
   "end": 5389813,
   "filename": "/data/shaders/compiled/pbr/pbr_v32_vs"
  }, {
   "audio": 0,
   "start": 5389813,
   "crunched": 0,
   "end": 5390411,
   "filename": "/data/shaders/compiled/pbr/pbr_v32_vs.d"
  }, {
   "audio": 0,
   "start": 5390411,
   "crunched": 0,
   "end": 5397237,
   "filename": "/data/shaders/compiled/pbr/pbr_v34_fs"
  }, {
   "audio": 0,
   "start": 5397237,
   "crunched": 0,
   "end": 5398639,
   "filename": "/data/shaders/compiled/pbr/pbr_v34_fs.d"
  }, {
   "audio": 0,
   "start": 5398639,
   "crunched": 0,
   "end": 5404512,
   "filename": "/data/shaders/compiled/pbr/pbr_v34_vs"
  }, {
   "audio": 0,
   "start": 5404512,
   "crunched": 0,
   "end": 5405110,
   "filename": "/data/shaders/compiled/pbr/pbr_v34_vs.d"
  }, {
   "audio": 0,
   "start": 5405110,
   "crunched": 0,
   "end": 5415986,
   "filename": "/data/shaders/compiled/pbr/pbr_v400_fs"
  }, {
   "audio": 0,
   "start": 5415986,
   "crunched": 0,
   "end": 5417216,
   "filename": "/data/shaders/compiled/pbr/pbr_v400_fs.d"
  }, {
   "audio": 0,
   "start": 5417216,
   "crunched": 0,
   "end": 5418311,
   "filename": "/data/shaders/compiled/pbr/pbr_v400_vs"
  }, {
   "audio": 0,
   "start": 5418311,
   "crunched": 0,
   "end": 5418915,
   "filename": "/data/shaders/compiled/pbr/pbr_v400_vs.d"
  }, {
   "audio": 0,
   "start": 5418915,
   "crunched": 0,
   "end": 5431053,
   "filename": "/data/shaders/compiled/pbr/pbr_v40_fs"
  }, {
   "audio": 0,
   "start": 5431053,
   "crunched": 0,
   "end": 5432455,
   "filename": "/data/shaders/compiled/pbr/pbr_v40_fs.d"
  }, {
   "audio": 0,
   "start": 5432455,
   "crunched": 0,
   "end": 5434842,
   "filename": "/data/shaders/compiled/pbr/pbr_v40_vs"
  }, {
   "audio": 0,
   "start": 5434842,
   "crunched": 0,
   "end": 5435440,
   "filename": "/data/shaders/compiled/pbr/pbr_v40_vs.d"
  }, {
   "audio": 0,
   "start": 5435440,
   "crunched": 0,
   "end": 5443433,
   "filename": "/data/shaders/compiled/pbr/pbr_v4130_fs"
  }, {
   "audio": 0,
   "start": 5443433,
   "crunched": 0,
   "end": 5444722,
   "filename": "/data/shaders/compiled/pbr/pbr_v4130_fs.d"
  }, {
   "audio": 0,
   "start": 5444722,
   "crunched": 0,
   "end": 5446013,
   "filename": "/data/shaders/compiled/pbr/pbr_v4130_vs"
  }, {
   "audio": 0,
   "start": 5446013,
   "crunched": 0,
   "end": 5446613,
   "filename": "/data/shaders/compiled/pbr/pbr_v4130_vs.d"
  }, {
   "audio": 0,
   "start": 5446613,
   "crunched": 0,
   "end": 5458548,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967376_fs"
  }, {
   "audio": 0,
   "start": 5458548,
   "crunched": 0,
   "end": 5459643,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967376_vs"
  }, {
   "audio": 0,
   "start": 5459643,
   "crunched": 0,
   "end": 5479193,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967392_fs"
  }, {
   "audio": 0,
   "start": 5479193,
   "crunched": 0,
   "end": 5480288,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967392_vs"
  }, {
   "audio": 0,
   "start": 5480288,
   "crunched": 0,
   "end": 5509991,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967394_fs"
  }, {
   "audio": 0,
   "start": 5509991,
   "crunched": 0,
   "end": 5514065,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967394_vs"
  }, {
   "audio": 0,
   "start": 5514065,
   "crunched": 0,
   "end": 5537173,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967408_fs"
  }, {
   "audio": 0,
   "start": 5537173,
   "crunched": 0,
   "end": 5538268,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967408_vs"
  }, {
   "audio": 0,
   "start": 5538268,
   "crunched": 0,
   "end": 5572788,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967409_fs"
  }, {
   "audio": 0,
   "start": 5572788,
   "crunched": 0,
   "end": 5577839,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967409_vs"
  }, {
   "audio": 0,
   "start": 5577839,
   "crunched": 0,
   "end": 5597389,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967488_fs"
  }, {
   "audio": 0,
   "start": 5597389,
   "crunched": 0,
   "end": 5598484,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967488_vs"
  }, {
   "audio": 0,
   "start": 5598484,
   "crunched": 0,
   "end": 5621510,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967504_fs"
  }, {
   "audio": 0,
   "start": 5621510,
   "crunched": 0,
   "end": 5622605,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967504_vs"
  }, {
   "audio": 0,
   "start": 5622605,
   "crunched": 0,
   "end": 5657237,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967505_fs"
  }, {
   "audio": 0,
   "start": 5657237,
   "crunched": 0,
   "end": 5662288,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967505_vs"
  }, {
   "audio": 0,
   "start": 5662288,
   "crunched": 0,
   "end": 5685543,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967512_fs"
  }, {
   "audio": 0,
   "start": 5685543,
   "crunched": 0,
   "end": 5686638,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967512_vs"
  }, {
   "audio": 0,
   "start": 5686638,
   "crunched": 0,
   "end": 5699175,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967712_fs"
  }, {
   "audio": 0,
   "start": 5699175,
   "crunched": 0,
   "end": 5700270,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967712_vs"
  }, {
   "audio": 0,
   "start": 5700270,
   "crunched": 0,
   "end": 5712854,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967720_fs"
  }, {
   "audio": 0,
   "start": 5712854,
   "crunched": 0,
   "end": 5713949,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967720_vs"
  }, {
   "audio": 0,
   "start": 5713949,
   "crunched": 0,
   "end": 5726707,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967736_fs"
  }, {
   "audio": 0,
   "start": 5726707,
   "crunched": 0,
   "end": 5727802,
   "filename": "/data/shaders/compiled/pbr/pbr_v4294967736_vs"
  }, {
   "audio": 0,
   "start": 5727802,
   "crunched": 0,
   "end": 5739940,
   "filename": "/data/shaders/compiled/pbr/pbr_v42_fs"
  }, {
   "audio": 0,
   "start": 5739940,
   "crunched": 0,
   "end": 5741342,
   "filename": "/data/shaders/compiled/pbr/pbr_v42_fs.d"
  }, {
   "audio": 0,
   "start": 5741342,
   "crunched": 0,
   "end": 5745416,
   "filename": "/data/shaders/compiled/pbr/pbr_v42_vs"
  }, {
   "audio": 0,
   "start": 5745416,
   "crunched": 0,
   "end": 5746014,
   "filename": "/data/shaders/compiled/pbr/pbr_v42_vs.d"
  }, {
   "audio": 0,
   "start": 5746014,
   "crunched": 0,
   "end": 5756921,
   "filename": "/data/shaders/compiled/pbr/pbr_v5120_fs"
  }, {
   "audio": 0,
   "start": 5756921,
   "crunched": 0,
   "end": 5758325,
   "filename": "/data/shaders/compiled/pbr/pbr_v5120_fs.d"
  }, {
   "audio": 0,
   "start": 5758325,
   "crunched": 0,
   "end": 5759420,
   "filename": "/data/shaders/compiled/pbr/pbr_v5120_vs"
  }, {
   "audio": 0,
   "start": 5759420,
   "crunched": 0,
   "end": 5760020,
   "filename": "/data/shaders/compiled/pbr/pbr_v5120_vs.d"
  }, {
   "audio": 0,
   "start": 5760020,
   "crunched": 0,
   "end": 5770927,
   "filename": "/data/shaders/compiled/pbr/pbr_v5121_fs"
  }, {
   "audio": 0,
   "start": 5770927,
   "crunched": 0,
   "end": 5772331,
   "filename": "/data/shaders/compiled/pbr/pbr_v5121_fs.d"
  }, {
   "audio": 0,
   "start": 5772331,
   "crunched": 0,
   "end": 5775889,
   "filename": "/data/shaders/compiled/pbr/pbr_v5121_vs"
  }, {
   "audio": 0,
   "start": 5775889,
   "crunched": 0,
   "end": 5776489,
   "filename": "/data/shaders/compiled/pbr/pbr_v5121_vs.d"
  }, {
   "audio": 0,
   "start": 5776489,
   "crunched": 0,
   "end": 5787396,
   "filename": "/data/shaders/compiled/pbr/pbr_v5122_fs"
  }, {
   "audio": 0,
   "start": 5787396,
   "crunched": 0,
   "end": 5788800,
   "filename": "/data/shaders/compiled/pbr/pbr_v5122_fs.d"
  }, {
   "audio": 0,
   "start": 5788800,
   "crunched": 0,
   "end": 5790091,
   "filename": "/data/shaders/compiled/pbr/pbr_v5122_vs"
  }, {
   "audio": 0,
   "start": 5790091,
   "crunched": 0,
   "end": 5790691,
   "filename": "/data/shaders/compiled/pbr/pbr_v5122_vs.d"
  }, {
   "audio": 0,
   "start": 5790691,
   "crunched": 0,
   "end": 5802379,
   "filename": "/data/shaders/compiled/pbr/pbr_v5136_fs"
  }, {
   "audio": 0,
   "start": 5802379,
   "crunched": 0,
   "end": 5803668,
   "filename": "/data/shaders/compiled/pbr/pbr_v5136_fs.d"
  }, {
   "audio": 0,
   "start": 5803668,
   "crunched": 0,
   "end": 5804763,
   "filename": "/data/shaders/compiled/pbr/pbr_v5136_vs"
  }, {
   "audio": 0,
   "start": 5804763,
   "crunched": 0,
   "end": 5805363,
   "filename": "/data/shaders/compiled/pbr/pbr_v5136_vs.d"
  }, {
   "audio": 0,
   "start": 5805363,
   "crunched": 0,
   "end": 5816448,
   "filename": "/data/shaders/compiled/pbr/pbr_v5152_fs"
  }, {
   "audio": 0,
   "start": 5816448,
   "crunched": 0,
   "end": 5817852,
   "filename": "/data/shaders/compiled/pbr/pbr_v5152_fs.d"
  }, {
   "audio": 0,
   "start": 5817852,
   "crunched": 0,
   "end": 5818947,
   "filename": "/data/shaders/compiled/pbr/pbr_v5152_vs"
  }, {
   "audio": 0,
   "start": 5818947,
   "crunched": 0,
   "end": 5819547,
   "filename": "/data/shaders/compiled/pbr/pbr_v5152_vs.d"
  }, {
   "audio": 0,
   "start": 5819547,
   "crunched": 0,
   "end": 5830632,
   "filename": "/data/shaders/compiled/pbr/pbr_v5154_fs"
  }, {
   "audio": 0,
   "start": 5830632,
   "crunched": 0,
   "end": 5832036,
   "filename": "/data/shaders/compiled/pbr/pbr_v5154_fs.d"
  }, {
   "audio": 0,
   "start": 5832036,
   "crunched": 0,
   "end": 5833327,
   "filename": "/data/shaders/compiled/pbr/pbr_v5154_vs"
  }, {
   "audio": 0,
   "start": 5833327,
   "crunched": 0,
   "end": 5833927,
   "filename": "/data/shaders/compiled/pbr/pbr_v5154_vs.d"
  }, {
   "audio": 0,
   "start": 5833927,
   "crunched": 0,
   "end": 5844995,
   "filename": "/data/shaders/compiled/pbr/pbr_v5248_fs"
  }, {
   "audio": 0,
   "start": 5844995,
   "crunched": 0,
   "end": 5846399,
   "filename": "/data/shaders/compiled/pbr/pbr_v5248_fs.d"
  }, {
   "audio": 0,
   "start": 5846399,
   "crunched": 0,
   "end": 5847494,
   "filename": "/data/shaders/compiled/pbr/pbr_v5248_vs"
  }, {
   "audio": 0,
   "start": 5847494,
   "crunched": 0,
   "end": 5848094,
   "filename": "/data/shaders/compiled/pbr/pbr_v5248_vs.d"
  }, {
   "audio": 0,
   "start": 5848094,
   "crunched": 0,
   "end": 5859560,
   "filename": "/data/shaders/compiled/pbr/pbr_v5264_fs"
  }, {
   "audio": 0,
   "start": 5859560,
   "crunched": 0,
   "end": 5860964,
   "filename": "/data/shaders/compiled/pbr/pbr_v5264_fs.d"
  }, {
   "audio": 0,
   "start": 5860964,
   "crunched": 0,
   "end": 5862059,
   "filename": "/data/shaders/compiled/pbr/pbr_v5264_vs"
  }, {
   "audio": 0,
   "start": 5862059,
   "crunched": 0,
   "end": 5862659,
   "filename": "/data/shaders/compiled/pbr/pbr_v5264_vs.d"
  }, {
   "audio": 0,
   "start": 5862659,
   "crunched": 0,
   "end": 5870986,
   "filename": "/data/shaders/compiled/pbr/pbr_v546_fs"
  }, {
   "audio": 0,
   "start": 5870986,
   "crunched": 0,
   "end": 5872277,
   "filename": "/data/shaders/compiled/pbr/pbr_v546_vs"
  }, {
   "audio": 0,
   "start": 5872277,
   "crunched": 0,
   "end": 5883265,
   "filename": "/data/shaders/compiled/pbr/pbr_v56_fs"
  }, {
   "audio": 0,
   "start": 5883265,
   "crunched": 0,
   "end": 5884360,
   "filename": "/data/shaders/compiled/pbr/pbr_v56_vs"
  }, {
   "audio": 0,
   "start": 5884360,
   "crunched": 0,
   "end": 5892356,
   "filename": "/data/shaders/compiled/pbr/pbr_v8224_fs"
  }, {
   "audio": 0,
   "start": 5892356,
   "crunched": 0,
   "end": 5893760,
   "filename": "/data/shaders/compiled/pbr/pbr_v8224_fs.d"
  }, {
   "audio": 0,
   "start": 5893760,
   "crunched": 0,
   "end": 5899836,
   "filename": "/data/shaders/compiled/pbr/pbr_v8224_vs"
  }, {
   "audio": 0,
   "start": 5899836,
   "crunched": 0,
   "end": 5900436,
   "filename": "/data/shaders/compiled/pbr/pbr_v8224_vs.d"
  }, {
   "audio": 0,
   "start": 5900436,
   "crunched": 0,
   "end": 5908432,
   "filename": "/data/shaders/compiled/pbr/pbr_v8226_fs"
  }, {
   "audio": 0,
   "start": 5908432,
   "crunched": 0,
   "end": 5909836,
   "filename": "/data/shaders/compiled/pbr/pbr_v8226_fs.d"
  }, {
   "audio": 0,
   "start": 5909836,
   "crunched": 0,
   "end": 5915343,
   "filename": "/data/shaders/compiled/pbr/pbr_v8226_vs"
  }, {
   "audio": 0,
   "start": 5915343,
   "crunched": 0,
   "end": 5916001,
   "filename": "/data/shaders/compiled/pbr/pbr_v8226_vs.d"
  }, {
   "audio": 0,
   "start": 5916001,
   "crunched": 0,
   "end": 5931043,
   "filename": "/data/shaders/compiled/pbr/pbr_v8232_fs"
  }, {
   "audio": 0,
   "start": 5931043,
   "crunched": 0,
   "end": 5932447,
   "filename": "/data/shaders/compiled/pbr/pbr_v8232_fs.d"
  }, {
   "audio": 0,
   "start": 5932447,
   "crunched": 0,
   "end": 5934834,
   "filename": "/data/shaders/compiled/pbr/pbr_v8232_vs"
  }, {
   "audio": 0,
   "start": 5934834,
   "crunched": 0,
   "end": 5935434,
   "filename": "/data/shaders/compiled/pbr/pbr_v8232_vs.d"
  }, {
   "audio": 0,
   "start": 5935434,
   "crunched": 0,
   "end": 5958660,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589934800_fs"
  }, {
   "audio": 0,
   "start": 5958660,
   "crunched": 0,
   "end": 5959755,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589934800_vs"
  }, {
   "audio": 0,
   "start": 5959755,
   "crunched": 0,
   "end": 5995018,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589934808_fs"
  }, {
   "audio": 0,
   "start": 5995018,
   "crunched": 0,
   "end": 5997405,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589934808_vs"
  }, {
   "audio": 0,
   "start": 5997405,
   "crunched": 0,
   "end": 6016718,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936130_fs"
  }, {
   "audio": 0,
   "start": 6016718,
   "crunched": 0,
   "end": 6018009,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936130_vs"
  }, {
   "audio": 0,
   "start": 6018009,
   "crunched": 0,
   "end": 6037873,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936176_fs"
  }, {
   "audio": 0,
   "start": 6037873,
   "crunched": 0,
   "end": 6039050,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936176_fs.d"
  }, {
   "audio": 0,
   "start": 6039050,
   "crunched": 0,
   "end": 6040145,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936176_vs"
  }, {
   "audio": 0,
   "start": 6040145,
   "crunched": 0,
   "end": 6040756,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936176_vs.d"
  }, {
   "audio": 0,
   "start": 6040756,
   "crunched": 0,
   "end": 6071678,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936184_fs"
  }, {
   "audio": 0,
   "start": 6071678,
   "crunched": 0,
   "end": 6072855,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936184_fs.d"
  }, {
   "audio": 0,
   "start": 6072855,
   "crunched": 0,
   "end": 6075242,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936184_vs"
  }, {
   "audio": 0,
   "start": 6075242,
   "crunched": 0,
   "end": 6075853,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936184_vs.d"
  }, {
   "audio": 0,
   "start": 6075853,
   "crunched": 0,
   "end": 6098605,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936256_fs"
  }, {
   "audio": 0,
   "start": 6098605,
   "crunched": 0,
   "end": 6099842,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936256_fs.d"
  }, {
   "audio": 0,
   "start": 6099842,
   "crunched": 0,
   "end": 6100937,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936256_vs"
  }, {
   "audio": 0,
   "start": 6100937,
   "crunched": 0,
   "end": 6101548,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936256_vs.d"
  }, {
   "audio": 0,
   "start": 6101548,
   "crunched": 0,
   "end": 6124284,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936257_fs"
  }, {
   "audio": 0,
   "start": 6124284,
   "crunched": 0,
   "end": 6125461,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936257_fs.d"
  }, {
   "audio": 0,
   "start": 6125461,
   "crunched": 0,
   "end": 6129127,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936257_vs"
  }, {
   "audio": 0,
   "start": 6129127,
   "crunched": 0,
   "end": 6129738,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936257_vs.d"
  }, {
   "audio": 0,
   "start": 6129738,
   "crunched": 0,
   "end": 6164696,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936264_fs"
  }, {
   "audio": 0,
   "start": 6164696,
   "crunched": 0,
   "end": 6165873,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936264_fs.d"
  }, {
   "audio": 0,
   "start": 6165873,
   "crunched": 0,
   "end": 6168260,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936264_vs"
  }, {
   "audio": 0,
   "start": 6168260,
   "crunched": 0,
   "end": 6168871,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936264_vs.d"
  }, {
   "audio": 0,
   "start": 6168871,
   "crunched": 0,
   "end": 6203829,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936265_fs"
  }, {
   "audio": 0,
   "start": 6203829,
   "crunched": 0,
   "end": 6205006,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936265_fs.d"
  }, {
   "audio": 0,
   "start": 6205006,
   "crunched": 0,
   "end": 6210057,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936265_vs"
  }, {
   "audio": 0,
   "start": 6210057,
   "crunched": 0,
   "end": 6210668,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936265_vs.d"
  }, {
   "audio": 0,
   "start": 6210668,
   "crunched": 0,
   "end": 6233918,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936272_fs"
  }, {
   "audio": 0,
   "start": 6233918,
   "crunched": 0,
   "end": 6235155,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936272_fs.d"
  }, {
   "audio": 0,
   "start": 6235155,
   "crunched": 0,
   "end": 6236250,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936272_vs"
  }, {
   "audio": 0,
   "start": 6236250,
   "crunched": 0,
   "end": 6236861,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936272_vs.d"
  }, {
   "audio": 0,
   "start": 6236861,
   "crunched": 0,
   "end": 6260322,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936304_fs"
  }, {
   "audio": 0,
   "start": 6260322,
   "crunched": 0,
   "end": 6261499,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936304_fs.d"
  }, {
   "audio": 0,
   "start": 6261499,
   "crunched": 0,
   "end": 6262594,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936304_vs"
  }, {
   "audio": 0,
   "start": 6262594,
   "crunched": 0,
   "end": 6263205,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936304_vs.d"
  }, {
   "audio": 0,
   "start": 6263205,
   "crunched": 0,
   "end": 6298940,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936312_fs"
  }, {
   "audio": 0,
   "start": 6298940,
   "crunched": 0,
   "end": 6300117,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936312_fs.d"
  }, {
   "audio": 0,
   "start": 6300117,
   "crunched": 0,
   "end": 6302504,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936312_vs"
  }, {
   "audio": 0,
   "start": 6302504,
   "crunched": 0,
   "end": 6303115,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589936312_vs.d"
  }, {
   "audio": 0,
   "start": 6303115,
   "crunched": 0,
   "end": 6325867,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589937920_fs"
  }, {
   "audio": 0,
   "start": 6325867,
   "crunched": 0,
   "end": 6327104,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589937920_fs.d"
  }, {
   "audio": 0,
   "start": 6327104,
   "crunched": 0,
   "end": 6328199,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589937920_vs"
  }, {
   "audio": 0,
   "start": 6328199,
   "crunched": 0,
   "end": 6328810,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589937920_vs.d"
  }, {
   "audio": 0,
   "start": 6328810,
   "crunched": 0,
   "end": 6352227,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589938064_fs"
  }, {
   "audio": 0,
   "start": 6352227,
   "crunched": 0,
   "end": 6353464,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589938064_fs.d"
  }, {
   "audio": 0,
   "start": 6353464,
   "crunched": 0,
   "end": 6354559,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589938064_vs"
  }, {
   "audio": 0,
   "start": 6354559,
   "crunched": 0,
   "end": 6355170,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589938064_vs.d"
  }, {
   "audio": 0,
   "start": 6355170,
   "crunched": 0,
   "end": 6374171,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946881_fs"
  }, {
   "audio": 0,
   "start": 6374171,
   "crunched": 0,
   "end": 6375466,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946881_fs.d"
  }, {
   "audio": 0,
   "start": 6375466,
   "crunched": 0,
   "end": 6379024,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946881_vs"
  }, {
   "audio": 0,
   "start": 6379024,
   "crunched": 0,
   "end": 6379630,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946881_vs.d"
  }, {
   "audio": 0,
   "start": 6379630,
   "crunched": 0,
   "end": 6398631,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946882_fs"
  }, {
   "audio": 0,
   "start": 6398631,
   "crunched": 0,
   "end": 6399926,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946882_fs.d"
  }, {
   "audio": 0,
   "start": 6399926,
   "crunched": 0,
   "end": 6401217,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946882_vs"
  }, {
   "audio": 0,
   "start": 6401217,
   "crunched": 0,
   "end": 6401823,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946882_vs.d"
  }, {
   "audio": 0,
   "start": 6401823,
   "crunched": 0,
   "end": 6421035,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946914_fs"
  }, {
   "audio": 0,
   "start": 6421035,
   "crunched": 0,
   "end": 6422330,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946914_fs.d"
  }, {
   "audio": 0,
   "start": 6422330,
   "crunched": 0,
   "end": 6423621,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946914_vs"
  }, {
   "audio": 0,
   "start": 6423621,
   "crunched": 0,
   "end": 6424227,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589946914_vs.d"
  }, {
   "audio": 0,
   "start": 6424227,
   "crunched": 0,
   "end": 6446820,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947904_fs"
  }, {
   "audio": 0,
   "start": 6446820,
   "crunched": 0,
   "end": 6448115,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947904_fs.d"
  }, {
   "audio": 0,
   "start": 6448115,
   "crunched": 0,
   "end": 6449210,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947904_vs"
  }, {
   "audio": 0,
   "start": 6449210,
   "crunched": 0,
   "end": 6449816,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947904_vs.d"
  }, {
   "audio": 0,
   "start": 6449816,
   "crunched": 0,
   "end": 6472409,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947905_fs"
  }, {
   "audio": 0,
   "start": 6472409,
   "crunched": 0,
   "end": 6473704,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947905_fs.d"
  }, {
   "audio": 0,
   "start": 6473704,
   "crunched": 0,
   "end": 6477262,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947905_vs"
  }, {
   "audio": 0,
   "start": 6477262,
   "crunched": 0,
   "end": 6477868,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947905_vs.d"
  }, {
   "audio": 0,
   "start": 6477868,
   "crunched": 0,
   "end": 6500461,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947906_fs"
  }, {
   "audio": 0,
   "start": 6500461,
   "crunched": 0,
   "end": 6501756,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947906_fs.d"
  }, {
   "audio": 0,
   "start": 6501756,
   "crunched": 0,
   "end": 6503047,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947906_vs"
  }, {
   "audio": 0,
   "start": 6503047,
   "crunched": 0,
   "end": 6503653,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947906_vs.d"
  }, {
   "audio": 0,
   "start": 6503653,
   "crunched": 0,
   "end": 6538022,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947912_fs"
  }, {
   "audio": 0,
   "start": 6538022,
   "crunched": 0,
   "end": 6539322,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947912_fs.d"
  }, {
   "audio": 0,
   "start": 6539322,
   "crunched": 0,
   "end": 6541709,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947912_vs"
  }, {
   "audio": 0,
   "start": 6541709,
   "crunched": 0,
   "end": 6542320,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947912_vs.d"
  }, {
   "audio": 0,
   "start": 6542320,
   "crunched": 0,
   "end": 6576689,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947913_fs"
  }, {
   "audio": 0,
   "start": 6576689,
   "crunched": 0,
   "end": 6577989,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947913_fs.d"
  }, {
   "audio": 0,
   "start": 6577989,
   "crunched": 0,
   "end": 6583020,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947913_vs"
  }, {
   "audio": 0,
   "start": 6583020,
   "crunched": 0,
   "end": 6583631,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947913_vs.d"
  }, {
   "audio": 0,
   "start": 6583631,
   "crunched": 0,
   "end": 6606629,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947920_fs"
  }, {
   "audio": 0,
   "start": 6606629,
   "crunched": 0,
   "end": 6607924,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947920_fs.d"
  }, {
   "audio": 0,
   "start": 6607924,
   "crunched": 0,
   "end": 6609019,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947920_vs"
  }, {
   "audio": 0,
   "start": 6609019,
   "crunched": 0,
   "end": 6609625,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947920_vs.d"
  }, {
   "audio": 0,
   "start": 6609625,
   "crunched": 0,
   "end": 6644753,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947928_fs"
  }, {
   "audio": 0,
   "start": 6644753,
   "crunched": 0,
   "end": 6646053,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947928_fs.d"
  }, {
   "audio": 0,
   "start": 6646053,
   "crunched": 0,
   "end": 6648440,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947928_vs"
  }, {
   "audio": 0,
   "start": 6648440,
   "crunched": 0,
   "end": 6649051,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947928_vs.d"
  }, {
   "audio": 0,
   "start": 6649051,
   "crunched": 0,
   "end": 6671857,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947936_fs"
  }, {
   "audio": 0,
   "start": 6671857,
   "crunched": 0,
   "end": 6673152,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947936_fs.d"
  }, {
   "audio": 0,
   "start": 6673152,
   "crunched": 0,
   "end": 6674247,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947936_vs"
  }, {
   "audio": 0,
   "start": 6674247,
   "crunched": 0,
   "end": 6674853,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947936_vs.d"
  }, {
   "audio": 0,
   "start": 6674853,
   "crunched": 0,
   "end": 6697659,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947938_fs"
  }, {
   "audio": 0,
   "start": 6697659,
   "crunched": 0,
   "end": 6698954,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947938_fs.d"
  }, {
   "audio": 0,
   "start": 6698954,
   "crunched": 0,
   "end": 6700245,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947938_vs"
  }, {
   "audio": 0,
   "start": 6700245,
   "crunched": 0,
   "end": 6700851,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947938_vs.d"
  }, {
   "audio": 0,
   "start": 6700851,
   "crunched": 0,
   "end": 6724057,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947952_fs"
  }, {
   "audio": 0,
   "start": 6724057,
   "crunched": 0,
   "end": 6725352,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947952_fs.d"
  }, {
   "audio": 0,
   "start": 6725352,
   "crunched": 0,
   "end": 6726447,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947952_vs"
  }, {
   "audio": 0,
   "start": 6726447,
   "crunched": 0,
   "end": 6727053,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589947952_vs.d"
  }, {
   "audio": 0,
   "start": 6727053,
   "crunched": 0,
   "end": 6749813,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948032_fs"
  }, {
   "audio": 0,
   "start": 6749813,
   "crunched": 0,
   "end": 6751108,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948032_fs.d"
  }, {
   "audio": 0,
   "start": 6751108,
   "crunched": 0,
   "end": 6752203,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948032_vs"
  }, {
   "audio": 0,
   "start": 6752203,
   "crunched": 0,
   "end": 6752809,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948032_vs.d"
  }, {
   "audio": 0,
   "start": 6752809,
   "crunched": 0,
   "end": 6775972,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948048_fs"
  }, {
   "audio": 0,
   "start": 6775972,
   "crunched": 0,
   "end": 6777267,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948048_fs.d"
  }, {
   "audio": 0,
   "start": 6777267,
   "crunched": 0,
   "end": 6778362,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948048_vs"
  }, {
   "audio": 0,
   "start": 6778362,
   "crunched": 0,
   "end": 6778968,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948048_vs.d"
  }, {
   "audio": 0,
   "start": 6778968,
   "crunched": 0,
   "end": 6802339,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948080_fs"
  }, {
   "audio": 0,
   "start": 6802339,
   "crunched": 0,
   "end": 6803634,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948080_fs.d"
  }, {
   "audio": 0,
   "start": 6803634,
   "crunched": 0,
   "end": 6804729,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948080_vs"
  }, {
   "audio": 0,
   "start": 6804729,
   "crunched": 0,
   "end": 6805335,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948080_vs.d"
  }, {
   "audio": 0,
   "start": 6805335,
   "crunched": 0,
   "end": 6828717,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948176_fs"
  }, {
   "audio": 0,
   "start": 6828717,
   "crunched": 0,
   "end": 6830012,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948176_fs.d"
  }, {
   "audio": 0,
   "start": 6830012,
   "crunched": 0,
   "end": 6831107,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948176_vs"
  }, {
   "audio": 0,
   "start": 6831107,
   "crunched": 0,
   "end": 6831713,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948176_vs.d"
  }, {
   "audio": 0,
   "start": 6831713,
   "crunched": 0,
   "end": 6867897,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948184_fs"
  }, {
   "audio": 0,
   "start": 6867897,
   "crunched": 0,
   "end": 6869197,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948184_fs.d"
  }, {
   "audio": 0,
   "start": 6869197,
   "crunched": 0,
   "end": 6871584,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948184_vs"
  }, {
   "audio": 0,
   "start": 6871584,
   "crunched": 0,
   "end": 6872195,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948184_vs.d"
  }, {
   "audio": 0,
   "start": 6872195,
   "crunched": 0,
   "end": 6895781,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948208_fs"
  }, {
   "audio": 0,
   "start": 6895781,
   "crunched": 0,
   "end": 6897076,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948208_fs.d"
  }, {
   "audio": 0,
   "start": 6897076,
   "crunched": 0,
   "end": 6898171,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948208_vs"
  }, {
   "audio": 0,
   "start": 6898171,
   "crunched": 0,
   "end": 6898777,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948208_vs.d"
  }, {
   "audio": 0,
   "start": 6898777,
   "crunched": 0,
   "end": 6922451,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948304_fs"
  }, {
   "audio": 0,
   "start": 6922451,
   "crunched": 0,
   "end": 6923751,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948304_fs.d"
  }, {
   "audio": 0,
   "start": 6923751,
   "crunched": 0,
   "end": 6924846,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948304_vs"
  }, {
   "audio": 0,
   "start": 6924846,
   "crunched": 0,
   "end": 6925457,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948304_vs.d"
  }, {
   "audio": 0,
   "start": 6925457,
   "crunched": 0,
   "end": 6961923,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948312_fs"
  }, {
   "audio": 0,
   "start": 6961923,
   "crunched": 0,
   "end": 6963223,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948312_fs.d"
  }, {
   "audio": 0,
   "start": 6963223,
   "crunched": 0,
   "end": 6965610,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948312_vs"
  }, {
   "audio": 0,
   "start": 6965610,
   "crunched": 0,
   "end": 6966221,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948312_vs.d"
  }, {
   "audio": 0,
   "start": 6966221,
   "crunched": 0,
   "end": 6990806,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948816_fs"
  }, {
   "audio": 0,
   "start": 6990806,
   "crunched": 0,
   "end": 6992101,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948816_fs.d"
  }, {
   "audio": 0,
   "start": 6992101,
   "crunched": 0,
   "end": 6993196,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948816_vs"
  }, {
   "audio": 0,
   "start": 6993196,
   "crunched": 0,
   "end": 6993802,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948816_vs.d"
  }, {
   "audio": 0,
   "start": 6993802,
   "crunched": 0,
   "end": 7031312,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948824_fs"
  }, {
   "audio": 0,
   "start": 7031312,
   "crunched": 0,
   "end": 7032612,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948824_fs.d"
  }, {
   "audio": 0,
   "start": 7032612,
   "crunched": 0,
   "end": 7034999,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948824_vs"
  }, {
   "audio": 0,
   "start": 7034999,
   "crunched": 0,
   "end": 7035610,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948824_vs.d"
  }, {
   "audio": 0,
   "start": 7035610,
   "crunched": 0,
   "end": 7060400,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948848_fs"
  }, {
   "audio": 0,
   "start": 7060400,
   "crunched": 0,
   "end": 7061695,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948848_fs.d"
  }, {
   "audio": 0,
   "start": 7061695,
   "crunched": 0,
   "end": 7062790,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948848_vs"
  }, {
   "audio": 0,
   "start": 7062790,
   "crunched": 0,
   "end": 7063396,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589948848_vs.d"
  }, {
   "audio": 0,
   "start": 7063396,
   "crunched": 0,
   "end": 7085992,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960192_fs"
  }, {
   "audio": 0,
   "start": 7085992,
   "crunched": 0,
   "end": 7087402,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960192_fs.d"
  }, {
   "audio": 0,
   "start": 7087402,
   "crunched": 0,
   "end": 7088497,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960192_vs"
  }, {
   "audio": 0,
   "start": 7088497,
   "crunched": 0,
   "end": 7089103,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960192_vs.d"
  }, {
   "audio": 0,
   "start": 7089103,
   "crunched": 0,
   "end": 7111699,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960193_fs"
  }, {
   "audio": 0,
   "start": 7111699,
   "crunched": 0,
   "end": 7113109,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960193_fs.d"
  }, {
   "audio": 0,
   "start": 7113109,
   "crunched": 0,
   "end": 7116667,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960193_vs"
  }, {
   "audio": 0,
   "start": 7116667,
   "crunched": 0,
   "end": 7117273,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960193_vs.d"
  }, {
   "audio": 0,
   "start": 7117273,
   "crunched": 0,
   "end": 7139869,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960194_fs"
  }, {
   "audio": 0,
   "start": 7139869,
   "crunched": 0,
   "end": 7141279,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960194_fs.d"
  }, {
   "audio": 0,
   "start": 7141279,
   "crunched": 0,
   "end": 7142570,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960194_vs"
  }, {
   "audio": 0,
   "start": 7142570,
   "crunched": 0,
   "end": 7143176,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960194_vs.d"
  }, {
   "audio": 0,
   "start": 7143176,
   "crunched": 0,
   "end": 7177569,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960200_fs"
  }, {
   "audio": 0,
   "start": 7177569,
   "crunched": 0,
   "end": 7178979,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960200_fs.d"
  }, {
   "audio": 0,
   "start": 7178979,
   "crunched": 0,
   "end": 7181366,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960200_vs"
  }, {
   "audio": 0,
   "start": 7181366,
   "crunched": 0,
   "end": 7181972,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960200_vs.d"
  }, {
   "audio": 0,
   "start": 7181972,
   "crunched": 0,
   "end": 7204970,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960208_fs"
  }, {
   "audio": 0,
   "start": 7204970,
   "crunched": 0,
   "end": 7206380,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960208_fs.d"
  }, {
   "audio": 0,
   "start": 7206380,
   "crunched": 0,
   "end": 7207475,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960208_vs"
  }, {
   "audio": 0,
   "start": 7207475,
   "crunched": 0,
   "end": 7208081,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960208_vs.d"
  }, {
   "audio": 0,
   "start": 7208081,
   "crunched": 0,
   "end": 7230890,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960224_fs"
  }, {
   "audio": 0,
   "start": 7230890,
   "crunched": 0,
   "end": 7232300,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960224_fs.d"
  }, {
   "audio": 0,
   "start": 7232300,
   "crunched": 0,
   "end": 7233395,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960224_vs"
  }, {
   "audio": 0,
   "start": 7233395,
   "crunched": 0,
   "end": 7234001,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960224_vs.d"
  }, {
   "audio": 0,
   "start": 7234001,
   "crunched": 0,
   "end": 7256810,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960226_fs"
  }, {
   "audio": 0,
   "start": 7256810,
   "crunched": 0,
   "end": 7258220,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960226_fs.d"
  }, {
   "audio": 0,
   "start": 7258220,
   "crunched": 0,
   "end": 7259511,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960226_vs"
  }, {
   "audio": 0,
   "start": 7259511,
   "crunched": 0,
   "end": 7260117,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960226_vs.d"
  }, {
   "audio": 0,
   "start": 7260117,
   "crunched": 0,
   "end": 7294668,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960232_fs"
  }, {
   "audio": 0,
   "start": 7294668,
   "crunched": 0,
   "end": 7296078,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960232_fs.d"
  }, {
   "audio": 0,
   "start": 7296078,
   "crunched": 0,
   "end": 7298465,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960232_vs"
  }, {
   "audio": 0,
   "start": 7298465,
   "crunched": 0,
   "end": 7299071,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960232_vs.d"
  }, {
   "audio": 0,
   "start": 7299071,
   "crunched": 0,
   "end": 7333622,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960234_fs"
  }, {
   "audio": 0,
   "start": 7333622,
   "crunched": 0,
   "end": 7335032,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960234_fs.d"
  }, {
   "audio": 0,
   "start": 7335032,
   "crunched": 0,
   "end": 7339106,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960234_vs"
  }, {
   "audio": 0,
   "start": 7339106,
   "crunched": 0,
   "end": 7339712,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960234_vs.d"
  }, {
   "audio": 0,
   "start": 7339712,
   "crunched": 0,
   "end": 7362475,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960320_fs"
  }, {
   "audio": 0,
   "start": 7362475,
   "crunched": 0,
   "end": 7363885,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960320_fs.d"
  }, {
   "audio": 0,
   "start": 7363885,
   "crunched": 0,
   "end": 7364980,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960320_vs"
  }, {
   "audio": 0,
   "start": 7364980,
   "crunched": 0,
   "end": 7365586,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960320_vs.d"
  }, {
   "audio": 0,
   "start": 7365586,
   "crunched": 0,
   "end": 7388752,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960336_fs"
  }, {
   "audio": 0,
   "start": 7388752,
   "crunched": 0,
   "end": 7390162,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960336_fs.d"
  }, {
   "audio": 0,
   "start": 7390162,
   "crunched": 0,
   "end": 7391257,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960336_vs"
  }, {
   "audio": 0,
   "start": 7391257,
   "crunched": 0,
   "end": 7391863,
   "filename": "/data/shaders/compiled/pbr/pbr_v8589960336_vs.d"
  }, {
   "audio": 0,
   "start": 7391863,
   "crunched": 0,
   "end": 7403843,
   "filename": "/data/shaders/compiled/pbr/pbr_v8_fs"
  }, {
   "audio": 0,
   "start": 7403843,
   "crunched": 0,
   "end": 7405244,
   "filename": "/data/shaders/compiled/pbr/pbr_v8_fs.d"
  }, {
   "audio": 0,
   "start": 7405244,
   "crunched": 0,
   "end": 7407631,
   "filename": "/data/shaders/compiled/pbr/pbr_v8_vs"
  }, {
   "audio": 0,
   "start": 7407631,
   "crunched": 0,
   "end": 7408228,
   "filename": "/data/shaders/compiled/pbr/pbr_v8_vs.d"
  }, {
   "audio": 0,
   "start": 7408228,
   "crunched": 0,
   "end": 7409128,
   "filename": "/data/shaders/filter/blend.sh"
  }, {
   "audio": 0,
   "start": 7409128,
   "crunched": 0,
   "end": 7410487,
   "filename": "/data/shaders/filter/blur.sh"
  }, {
   "audio": 0,
   "start": 7410487,
   "crunched": 0,
   "end": 7411538,
   "filename": "/data/shaders/filter/copy_fs.sc"
  }, {
   "audio": 0,
   "start": 7411538,
   "crunched": 0,
   "end": 7411568,
   "filename": "/data/shaders/filter/copy_vs.sc"
  }, {
   "audio": 0,
   "start": 7411568,
   "crunched": 0,
   "end": 7415630,
   "filename": "/data/shaders/filter/dof_blur_fs.sc"
  }, {
   "audio": 0,
   "start": 7415630,
   "crunched": 0,
   "end": 7415660,
   "filename": "/data/shaders/filter/dof_blur_vs.sc"
  }, {
   "audio": 0,
   "start": 7415660,
   "crunched": 0,
   "end": 7416314,
   "filename": "/data/shaders/filter/filter.sh"
  }, {
   "audio": 0,
   "start": 7416314,
   "crunched": 0,
   "end": 7416579,
   "filename": "/data/shaders/filter/filter_vs.sc"
  }, {
   "audio": 0,
   "start": 7416579,
   "crunched": 0,
   "end": 7417450,
   "filename": "/data/shaders/filter/gaussian_blur_fs.sc"
  }, {
   "audio": 0,
   "start": 7417450,
   "crunched": 0,
   "end": 7417481,
   "filename": "/data/shaders/filter/gaussian_blur_vs.sc"
  }, {
   "audio": 0,
   "start": 7417481,
   "crunched": 0,
   "end": 7418323,
   "filename": "/data/shaders/filter/glow.sh"
  }, {
   "audio": 0,
   "start": 7418323,
   "crunched": 0,
   "end": 7418794,
   "filename": "/data/shaders/filter/glow_bleed_fs.sc"
  }, {
   "audio": 0,
   "start": 7418794,
   "crunched": 0,
   "end": 7418824,
   "filename": "/data/shaders/filter/glow_bleed_vs.sc"
  }, {
   "audio": 0,
   "start": 7418824,
   "crunched": 0,
   "end": 7420174,
   "filename": "/data/shaders/filter/glow_fs.sc"
  }, {
   "audio": 0,
   "start": 7420174,
   "crunched": 0,
   "end": 7420204,
   "filename": "/data/shaders/filter/glow_vs.sc"
  }, {
   "audio": 0,
   "start": 7420204,
   "crunched": 0,
   "end": 7423184,
   "filename": "/data/shaders/filter/prefilter_envmap_fs.sc"
  }, {
   "audio": 0,
   "start": 7423184,
   "crunched": 0,
   "end": 7423365,
   "filename": "/data/shaders/filter/prefilter_envmap_vs.sc"
  }, {
   "audio": 0,
   "start": 7423365,
   "crunched": 0,
   "end": 7423500,
   "filename": "/data/shaders/filter/quad_fs.sc"
  }, {
   "audio": 0,
   "start": 7423500,
   "crunched": 0,
   "end": 7423530,
   "filename": "/data/shaders/filter/quad_vs.sc"
  }, {
   "audio": 0,
   "start": 7423530,
   "crunched": 0,
   "end": 7425097,
   "filename": "/data/shaders/filter/tonemap_fs.sc"
  }, {
   "audio": 0,
   "start": 7425097,
   "crunched": 0,
   "end": 7425128,
   "filename": "/data/shaders/filter/tonemap_vs.sc"
  }, {
   "audio": 0,
   "start": 7425128,
   "crunched": 0,
   "end": 7428250,
   "filename": "/data/shaders/pbr/fog.sh"
  }, {
   "audio": 0,
   "start": 7428250,
   "crunched": 0,
   "end": 7428727,
   "filename": "/data/shaders/pbr/fs_anisotropy.sh"
  }, {
   "audio": 0,
   "start": 7428727,
   "crunched": 0,
   "end": 7428947,
   "filename": "/data/shaders/pbr/fs_ao.sh"
  }, {
   "audio": 0,
   "start": 7428947,
   "crunched": 0,
   "end": 7430217,
   "filename": "/data/shaders/pbr/fs_depth.sh"
  }, {
   "audio": 0,
   "start": 7430217,
   "crunched": 0,
   "end": 7430425,
   "filename": "/data/shaders/pbr/fs_emission.sh"
  }, {
   "audio": 0,
   "start": 7430425,
   "crunched": 0,
   "end": 7430837,
   "filename": "/data/shaders/pbr/fs_normal.sh"
  }, {
   "audio": 0,
   "start": 7430837,
   "crunched": 0,
   "end": 7435501,
   "filename": "/data/shaders/pbr/light.sh"
  }, {
   "audio": 0,
   "start": 7435501,
   "crunched": 0,
   "end": 7441155,
   "filename": "/data/shaders/pbr/light_brdf.sh"
  }, {
   "audio": 0,
   "start": 7441155,
   "crunched": 0,
   "end": 7442883,
   "filename": "/data/shaders/pbr/pbr.sh"
  }, {
   "audio": 0,
   "start": 7442883,
   "crunched": 0,
   "end": 7445797,
   "filename": "/data/shaders/pbr/pbr_fs.sc"
  }, {
   "audio": 0,
   "start": 7445797,
   "crunched": 0,
   "end": 7447108,
   "filename": "/data/shaders/pbr/pbr_vs.sc"
  }, {
   "audio": 0,
   "start": 7447108,
   "crunched": 0,
   "end": 7448528,
   "filename": "/data/shaders/pbr/radiance.sh"
  }, {
   "audio": 0,
   "start": 7448528,
   "crunched": 0,
   "end": 7454418,
   "filename": "/data/shaders/pbr/shadow.sh"
  }, {
   "audio": 0,
   "start": 7454418,
   "crunched": 0,
   "end": 7454587,
   "filename": "/data/textures/black.png"
  }, {
   "audio": 0,
   "start": 7454587,
   "crunched": 0,
   "end": 7469566,
   "filename": "/data/textures/empty.png"
  }, {
   "audio": 0,
   "start": 7469566,
   "crunched": 0,
   "end": 7484545,
   "filename": "/data/textures/normal.png"
  }, {
   "audio": 0,
   "start": 7484545,
   "crunched": 0,
   "end": 7484714,
   "filename": "/data/textures/white.png"
  }, {
   "audio": 0,
   "start": 7484714,
   "crunched": 0,
   "end": 7569066,
   "filename": "/data/textures/particles/billows.png"
  }, {
   "audio": 0,
   "start": 7569066,
   "crunched": 0,
   "end": 7657165,
   "filename": "/data/textures/particles/billows_b.png"
  }, {
   "audio": 0,
   "start": 7657165,
   "crunched": 0,
   "end": 7684190,
   "filename": "/data/textures/particles/burst.png"
  }, {
   "audio": 0,
   "start": 7684190,
   "crunched": 0,
   "end": 7712330,
   "filename": "/data/textures/particles/burst_2.png"
  }, {
   "audio": 0,
   "start": 7712330,
   "crunched": 0,
   "end": 7739799,
   "filename": "/data/textures/particles/burst_b.png"
  }, {
   "audio": 0,
   "start": 7739799,
   "crunched": 0,
   "end": 7768996,
   "filename": "/data/textures/particles/burst_b_2.png"
  }, {
   "audio": 0,
   "start": 7768996,
   "crunched": 0,
   "end": 7809924,
   "filename": "/data/textures/particles/flames.png"
  }, {
   "audio": 0,
   "start": 7809924,
   "crunched": 0,
   "end": 7851742,
   "filename": "/data/textures/particles/flames_b.png"
  }, {
   "audio": 0,
   "start": 7851742,
   "crunched": 0,
   "end": 7885111,
   "filename": "/data/textures/particles/flames_b_v.png"
  }, {
   "audio": 0,
   "start": 7885111,
   "crunched": 0,
   "end": 7918553,
   "filename": "/data/textures/particles/flames_v.png"
  }, {
   "audio": 0,
   "start": 7918553,
   "crunched": 0,
   "end": 7941378,
   "filename": "/data/textures/particles/geometric_b.png"
  }, {
   "audio": 0,
   "start": 7941378,
   "crunched": 0,
   "end": 8203590,
   "filename": "/data/textures/particles/particle.ktx"
  }, {
   "audio": 0,
   "start": 8203590,
   "crunched": 0,
   "end": 8233633,
   "filename": "/data/textures/particles/wave.png"
  }, {
   "audio": 0,
   "start": 8233633,
   "crunched": 0,
   "end": 8265687,
   "filename": "/data/textures/particles/wave_b.png"
  }, {
   "audio": 0,
   "start": 8265687,
   "crunched": 0,
   "end": 10026964,
   "filename": "/data/textures/radiance/tiber_1_1k.hdr"
  }, {
   "audio": 0,
   "start": 10026964,
   "crunched": 0,
   "end": 10861565,
   "filename": "/data/textures/spherical/grid.png"
  }, {
   "audio": 0,
   "start": 10861565,
   "crunched": 0,
   "end": 10970165,
   "filename": "/data/models/rifle.bin"
  }, {
   "audio": 0,
   "start": 10970165,
   "crunched": 0,
   "end": 10990467,
   "filename": "/data/models/rifle.gltf"
  }, {
   "audio": 0,
   "start": 10990467,
   "crunched": 0,
   "end": 11012084,
   "filename": "/data/models/rifle/blips_emissive.png"
  }, {
   "audio": 0,
   "start": 11012084,
   "crunched": 0,
   "end": 11287122,
   "filename": "/data/models/rifle/Chrome_metallicRoughness.png"
  }, {
   "audio": 0,
   "start": 11287122,
   "crunched": 0,
   "end": 11315769,
   "filename": "/data/models/rifle/Padding_metallicRoughness.png"
  }, {
   "audio": 0,
   "start": 11315769,
   "crunched": 0,
   "end": 11644289,
   "filename": "/data/models/rifle/Padding_normal.png"
  }, {
   "audio": 0,
   "start": 11644289,
   "crunched": 0,
   "end": 11919327,
   "filename": "/data/models/rifle/Rifle_dark_metallicRoughness.png"
  }, {
   "audio": 0,
   "start": 11919327,
   "crunched": 0,
   "end": 12157493,
   "filename": "/data/models/rifle/Rifle_dark_normal.png"
  }, {
   "audio": 0,
   "start": 12157493,
   "crunched": 0,
   "end": 12432531,
   "filename": "/data/models/rifle/Rifle_metallicRoughness.png"
  }, {
   "audio": 0,
   "start": 12432531,
   "crunched": 0,
   "end": 12707569,
   "filename": "/data/models/rifle/Rifle_Metal_Dull_metallicRoughness.png"
  }, {
   "audio": 0,
   "start": 12707569,
   "crunched": 0,
   "end": 12945735,
   "filename": "/data/models/rifle/Rifle_Metal_Dull_normal.png"
  }, {
   "audio": 0,
   "start": 12945735,
   "crunched": 0,
   "end": 13183901,
   "filename": "/data/models/rifle/Rifle_normal.png"
  }, {
   "audio": 0,
   "start": 13183901,
   "crunched": 0,
   "end": 13185784,
   "filename": "/data/particles/blue.ptc"
  }, {
   "audio": 0,
   "start": 13185784,
   "crunched": 0,
   "end": 13188256,
   "filename": "/data/particles/flash.ptc"
  }, {
   "audio": 0,
   "start": 13188256,
   "crunched": 0,
   "end": 13190723,
   "filename": "/data/particles/impact.ptc"
  }, {
   "audio": 0,
   "start": 13190723,
   "crunched": 0,
   "end": 13193179,
   "filename": "/data/particles/trail.ptc"
  }, {
   "audio": 0,
   "start": 13193179,
   "crunched": 0,
   "end": 13196240,
   "filename": "/data/scripts/enemy_ai.lua"
  }, {
   "audio": 1,
   "start": 13196240,
   "crunched": 0,
   "end": 13412296,
   "filename": "/data/sounds/alarm.ogg"
  }, {
   "audio": 1,
   "start": 13412296,
   "crunched": 0,
   "end": 13430345,
   "filename": "/data/sounds/bzwomb.ogg"
  }, {
   "audio": 1,
   "start": 13430345,
   "crunched": 0,
   "end": 13883315,
   "filename": "/data/sounds/complexambient.ogg"
  }, {
   "audio": 1,
   "start": 13883315,
   "crunched": 0,
   "end": 13896486,
   "filename": "/data/sounds/destroy.ogg"
  }, {
   "audio": 1,
   "start": 13896486,
   "crunched": 0,
   "end": 14228512,
   "filename": "/data/sounds/electricfield.ogg"
  }, {
   "audio": 1,
   "start": 14228512,
   "crunched": 0,
   "end": 14244173,
   "filename": "/data/sounds/grzzt.ogg"
  }, {
   "audio": 1,
   "start": 14244173,
   "crunched": 0,
   "end": 14279606,
   "filename": "/data/sounds/impact.ogg"
  }, {
   "audio": 1,
   "start": 14279606,
   "crunched": 0,
   "end": 14321976,
   "filename": "/data/sounds/impact2.ogg"
  }, {
   "audio": 1,
   "start": 14321976,
   "crunched": 0,
   "end": 14338431,
   "filename": "/data/sounds/rifle.ogg"
  }, {
   "audio": 1,
   "start": 14338431,
   "crunched": 0,
   "end": 14422337,
   "filename": "/data/sounds/rifle2.ogg"
  }, {
   "audio": 1,
   "start": 14422337,
   "crunched": 0,
   "end": 14472085,
   "filename": "/data/sounds/robotdeath.ogg"
  }, {
   "audio": 1,
   "start": 14472085,
   "crunched": 0,
   "end": 14523038,
   "filename": "/data/sounds/robotdeath2.ogg"
  }, {
   "audio": 1,
   "start": 14523038,
   "crunched": 0,
   "end": 14605629,
   "filename": "/data/sounds/schklatweom.ogg"
  }, {
   "audio": 1,
   "start": 14605629,
   "crunched": 0,
   "end": 14713325,
   "filename": "/data/sounds/sizzle.ogg"
  }, {
   "audio": 1,
   "start": 14713325,
   "crunched": 0,
   "end": 14799672,
   "filename": "/data/sounds/sparks.ogg"
  }, {
   "audio": 0,
   "start": 14799672,
   "crunched": 0,
   "end": 15566618,
   "filename": "/data/textures/beehive.png"
  }, {
   "audio": 0,
   "start": 15566618,
   "crunched": 0,
   "end": 17718990,
   "filename": "/data/models/buffer_human00.bin"
  }, {
   "audio": 0,
   "start": 17718990,
   "crunched": 0,
   "end": 19786328,
   "filename": "/data/models/human00.gltf"
  }, {
   "audio": 0,
   "start": 19786328,
   "crunched": 0,
   "end": 19786469,
   "filename": "/data/models/platform.mtl"
  }, {
   "audio": 0,
   "start": 19786469,
   "crunched": 0,
   "end": 19800129,
   "filename": "/data/models/platform/buffer_corner_covered.bin"
  }, {
   "audio": 0,
   "start": 19800129,
   "crunched": 0,
   "end": 19815085,
   "filename": "/data/models/platform/buffer_corner_frame.bin"
  }, {
   "audio": 0,
   "start": 19815085,
   "crunched": 0,
   "end": 19838245,
   "filename": "/data/models/platform/buffer_cube_covered.bin"
  }, {
   "audio": 0,
   "start": 19838245,
   "crunched": 0,
   "end": 19862085,
   "filename": "/data/models/platform/buffer_cube_covered_angle.bin"
  }, {
   "audio": 0,
   "start": 19862085,
   "crunched": 0,
   "end": 19885249,
   "filename": "/data/models/platform/buffer_cube_covered_corner.bin"
  }, {
   "audio": 0,
   "start": 19885249,
   "crunched": 0,
   "end": 19908445,
   "filename": "/data/models/platform/buffer_cube_covered_side.bin"
  }, {
   "audio": 0,
   "start": 19908445,
   "crunched": 0,
   "end": 19934225,
   "filename": "/data/models/platform/buffer_cube_frame.bin"
  }, {
   "audio": 0,
   "start": 19934225,
   "crunched": 0,
   "end": 19935073,
   "filename": "/data/models/platform/buffer_empty_covered.bin"
  }, {
   "audio": 0,
   "start": 19935073,
   "crunched": 0,
   "end": 19936133,
   "filename": "/data/models/platform/buffer_empty_covered_hole_angle.bin"
  }, {
   "audio": 0,
   "start": 19936133,
   "crunched": 0,
   "end": 19936981,
   "filename": "/data/models/platform/buffer_empty_covered_hole_side.bin"
  }, {
   "audio": 0,
   "start": 19936981,
   "crunched": 0,
   "end": 19943883,
   "filename": "/data/models/platform/corner_covered.gltf"
  }, {
   "audio": 0,
   "start": 19943883,
   "crunched": 0,
   "end": 19948760,
   "filename": "/data/models/platform/corner_frame.gltf"
  }, {
   "audio": 0,
   "start": 19948760,
   "crunched": 0,
   "end": 19955660,
   "filename": "/data/models/platform/cube_covered.gltf"
  }, {
   "audio": 0,
   "start": 19955660,
   "crunched": 0,
   "end": 19963449,
   "filename": "/data/models/platform/cube_covered_angle.gltf"
  }, {
   "audio": 0,
   "start": 19963449,
   "crunched": 0,
   "end": 19971238,
   "filename": "/data/models/platform/cube_covered_corner.gltf"
  }, {
   "audio": 0,
   "start": 19971238,
   "crunched": 0,
   "end": 19978986,
   "filename": "/data/models/platform/cube_covered_side.gltf"
  }, {
   "audio": 0,
   "start": 19978986,
   "crunched": 0,
   "end": 19983897,
   "filename": "/data/models/platform/cube_frame.gltf"
  }, {
   "audio": 0,
   "start": 19983897,
   "crunched": 0,
   "end": 19990199,
   "filename": "/data/models/platform/empty_covered.gltf"
  }, {
   "audio": 0,
   "start": 19990199,
   "crunched": 0,
   "end": 19996536,
   "filename": "/data/models/platform/empty_covered_hole_angle.gltf"
  }, {
   "audio": 0,
   "start": 19996536,
   "crunched": 0,
   "end": 20002867,
   "filename": "/data/models/platform/empty_covered_hole_side.gltf"
  }, {
   "audio": 0,
   "start": 20002867,
   "crunched": 0,
   "end": 20008842,
   "filename": "/data/models/platform/platform.tls"
  }, {
   "audio": 0,
   "start": 20008842,
   "crunched": 0,
   "end": 20022502,
   "filename": "/data/models/platform_mat/buffer_corner_covered.bin"
  }, {
   "audio": 0,
   "start": 20022502,
   "crunched": 0,
   "end": 20037458,
   "filename": "/data/models/platform_mat/buffer_corner_frame.bin"
  }, {
   "audio": 0,
   "start": 20037458,
   "crunched": 0,
   "end": 20060618,
   "filename": "/data/models/platform_mat/buffer_cube_covered.bin"
  }, {
   "audio": 0,
   "start": 20060618,
   "crunched": 0,
   "end": 20084458,
   "filename": "/data/models/platform_mat/buffer_cube_covered_angle.bin"
  }, {
   "audio": 0,
   "start": 20084458,
   "crunched": 0,
   "end": 20107622,
   "filename": "/data/models/platform_mat/buffer_cube_covered_corner.bin"
  }, {
   "audio": 0,
   "start": 20107622,
   "crunched": 0,
   "end": 20130818,
   "filename": "/data/models/platform_mat/buffer_cube_covered_side.bin"
  }, {
   "audio": 0,
   "start": 20130818,
   "crunched": 0,
   "end": 20156598,
   "filename": "/data/models/platform_mat/buffer_cube_frame.bin"
  }, {
   "audio": 0,
   "start": 20156598,
   "crunched": 0,
   "end": 20157446,
   "filename": "/data/models/platform_mat/buffer_empty_covered.bin"
  }, {
   "audio": 0,
   "start": 20157446,
   "crunched": 0,
   "end": 20158506,
   "filename": "/data/models/platform_mat/buffer_empty_covered_hole_angle.bin"
  }, {
   "audio": 0,
   "start": 20158506,
   "crunched": 0,
   "end": 20159354,
   "filename": "/data/models/platform_mat/buffer_empty_covered_hole_side.bin"
  }, {
   "audio": 0,
   "start": 20159354,
   "crunched": 0,
   "end": 20166256,
   "filename": "/data/models/platform_mat/corner_covered.gltf"
  }, {
   "audio": 0,
   "start": 20166256,
   "crunched": 0,
   "end": 20171133,
   "filename": "/data/models/platform_mat/corner_frame.gltf"
  }, {
   "audio": 0,
   "start": 20171133,
   "crunched": 0,
   "end": 20178033,
   "filename": "/data/models/platform_mat/cube_covered.gltf"
  }, {
   "audio": 0,
   "start": 20178033,
   "crunched": 0,
   "end": 20185822,
   "filename": "/data/models/platform_mat/cube_covered_angle.gltf"
  }, {
   "audio": 0,
   "start": 20185822,
   "crunched": 0,
   "end": 20193611,
   "filename": "/data/models/platform_mat/cube_covered_corner.gltf"
  }, {
   "audio": 0,
   "start": 20193611,
   "crunched": 0,
   "end": 20201359,
   "filename": "/data/models/platform_mat/cube_covered_side.gltf"
  }, {
   "audio": 0,
   "start": 20201359,
   "crunched": 0,
   "end": 20206270,
   "filename": "/data/models/platform_mat/cube_frame.gltf"
  }, {
   "audio": 0,
   "start": 20206270,
   "crunched": 0,
   "end": 20212572,
   "filename": "/data/models/platform_mat/empty_covered.gltf"
  }, {
   "audio": 0,
   "start": 20212572,
   "crunched": 0,
   "end": 20218909,
   "filename": "/data/models/platform_mat/empty_covered_hole_angle.gltf"
  }, {
   "audio": 0,
   "start": 20218909,
   "crunched": 0,
   "end": 20225240,
   "filename": "/data/models/platform_mat/empty_covered_hole_side.gltf"
  }, {
   "audio": 0,
   "start": 20225240,
   "crunched": 0,
   "end": 20229690,
   "filename": "/data/models/platform_mat/platform.tls"
  }, {
   "audio": 0,
   "start": 20229690,
   "crunched": 0,
   "end": 20271080,
   "filename": "/data/models/platform_raw/corner_covered.obj"
  }, {
   "audio": 0,
   "start": 20271080,
   "crunched": 0,
   "end": 20316311,
   "filename": "/data/models/platform_raw/corner_frame.obj"
  }, {
   "audio": 0,
   "start": 20316311,
   "crunched": 0,
   "end": 20374612,
   "filename": "/data/models/platform_raw/cube_covered.obj"
  }, {
   "audio": 0,
   "start": 20374612,
   "crunched": 0,
   "end": 20435322,
   "filename": "/data/models/platform_raw/cube_covered_angle.obj"
  }, {
   "audio": 0,
   "start": 20435322,
   "crunched": 0,
   "end": 20493623,
   "filename": "/data/models/platform_raw/cube_covered_corner.obj"
  }, {
   "audio": 0,
   "start": 20493623,
   "crunched": 0,
   "end": 20551946,
   "filename": "/data/models/platform_raw/cube_covered_side.obj"
  }, {
   "audio": 0,
   "start": 20551946,
   "crunched": 0,
   "end": 20616827,
   "filename": "/data/models/platform_raw/cube_frame.obj"
  }, {
   "audio": 0,
   "start": 20616827,
   "crunched": 0,
   "end": 20618099,
   "filename": "/data/models/platform_raw/empty_covered.obj"
  }, {
   "audio": 0,
   "start": 20618099,
   "crunched": 0,
   "end": 20620171,
   "filename": "/data/models/platform_raw/empty_covered_hole_angle.obj"
  }, {
   "audio": 0,
   "start": 20620171,
   "crunched": 0,
   "end": 20621603,
   "filename": "/data/models/platform_raw/empty_covered_hole_side.obj"
  }, {
   "audio": 0,
   "start": 20621603,
   "crunched": 0,
   "end": 20621635,
   "filename": "/data/models/platform_raw/platform.cfg"
  }, {
   "audio": 0,
   "start": 20621635,
   "crunched": 0,
   "end": 20621776,
   "filename": "/data/models/platform_raw/platform.mtl"
  }, {
   "audio": 0,
   "start": 20621776,
   "crunched": 0,
   "end": 20626226,
   "filename": "/data/models/platform_raw/platform.tls"
  }, {
   "audio": 0,
   "start": 20626226,
   "crunched": 0,
   "end": 20706502,
   "filename": "/data/models/platform_vox/corner_covered.obj"
  }, {
   "audio": 0,
   "start": 20706502,
   "crunched": 0,
   "end": 20789415,
   "filename": "/data/models/platform_vox/corner_frame.obj"
  }, {
   "audio": 0,
   "start": 20789415,
   "crunched": 0,
   "end": 20885880,
   "filename": "/data/models/platform_vox/cube_covered.obj"
  }, {
   "audio": 0,
   "start": 20885880,
   "crunched": 0,
   "end": 20988756,
   "filename": "/data/models/platform_vox/cube_covered_angle.obj"
  }, {
   "audio": 0,
   "start": 20988756,
   "crunched": 0,
   "end": 21085221,
   "filename": "/data/models/platform_vox/cube_covered_corner.obj"
  }, {
   "audio": 0,
   "start": 21085221,
   "crunched": 0,
   "end": 21181866,
   "filename": "/data/models/platform_vox/cube_covered_side.obj"
  }, {
   "audio": 0,
   "start": 21181866,
   "crunched": 0,
   "end": 21296961,
   "filename": "/data/models/platform_vox/cube_frame.obj"
  }, {
   "audio": 0,
   "start": 21296961,
   "crunched": 0,
   "end": 21410992,
   "filename": "/data/models/platform_vox/cube_ramp_middle.obj"
  }, {
   "audio": 0,
   "start": 21410992,
   "crunched": 0,
   "end": 21538613,
   "filename": "/data/models/platform_vox/cube_ramp_side.obj"
  }, {
   "audio": 0,
   "start": 21538613,
   "crunched": 0,
   "end": 21539408,
   "filename": "/data/models/platform_vox/empty_covered.obj"
  }, {
   "audio": 0,
   "start": 21539408,
   "crunched": 0,
   "end": 21546879,
   "filename": "/data/models/platform_vox/empty_covered_hole_angle.obj"
  }, {
   "audio": 0,
   "start": 21546879,
   "crunched": 0,
   "end": 21547978,
   "filename": "/data/models/platform_vox/empty_covered_hole_side.obj"
  }, {
   "audio": 0,
   "start": 21547978,
   "crunched": 0,
   "end": 21548010,
   "filename": "/data/models/platform_vox/platform.cfg"
  }, {
   "audio": 0,
   "start": 21548010,
   "crunched": 0,
   "end": 21548151,
   "filename": "/data/models/platform_vox/platform.mtl"
  }, {
   "audio": 0,
   "start": 21548151,
   "crunched": 0,
   "end": 21552601,
   "filename": "/data/models/platform_vox/platform.tls"
  }, {
   "audio": 0,
   "start": 21552601,
   "crunched": 0,
   "end": 21552722,
   "filename": "/data/textures/platform.png"
  } ],
  "remote_package_size": 21552722,
  "package_uuid": "8d36e512-525a-462e-bdc1-cc5a8c785752"
 });
}))();
var moduleOverrides = {};
var key;
for (key in Module) {
 if (Module.hasOwnProperty(key)) {
  moduleOverrides[key] = Module[key];
 }
}
Module["arguments"] = [];
Module["thisProgram"] = "./this.program";
Module["quit"] = (function(status, toThrow) {
 throw toThrow;
});
Module["preRun"] = [];
Module["postRun"] = [];
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
if (Module["ENVIRONMENT"]) {
 if (Module["ENVIRONMENT"] === "WEB") {
  ENVIRONMENT_IS_WEB = true;
 } else if (Module["ENVIRONMENT"] === "WORKER") {
  ENVIRONMENT_IS_WORKER = true;
 } else if (Module["ENVIRONMENT"] === "NODE") {
  ENVIRONMENT_IS_NODE = true;
 } else if (Module["ENVIRONMENT"] === "SHELL") {
  ENVIRONMENT_IS_SHELL = true;
 } else {
  throw new Error("Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.");
 }
} else {
 ENVIRONMENT_IS_WEB = typeof window === "object";
 ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
 ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
 ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
}
if (ENVIRONMENT_IS_NODE) {
 var nodeFS;
 var nodePath;
 Module["read"] = function shell_read(filename, binary) {
  var ret;
  if (!nodeFS) nodeFS = require("fs");
  if (!nodePath) nodePath = require("path");
  filename = nodePath["normalize"](filename);
  ret = nodeFS["readFileSync"](filename);
  return binary ? ret : ret.toString();
 };
 Module["readBinary"] = function readBinary(filename) {
  var ret = Module["read"](filename, true);
  if (!ret.buffer) {
   ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
 };
 if (process["argv"].length > 1) {
  Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/");
 }
 Module["arguments"] = process["argv"].slice(2);
 if (typeof module !== "undefined") {
  module["exports"] = Module;
 }
 process["on"]("uncaughtException", (function(ex) {
  if (!(ex instanceof ExitStatus)) {
   throw ex;
  }
 }));
 process["on"]("unhandledRejection", (function(reason, p) {
  process["exit"](1);
 }));
 Module["inspect"] = (function() {
  return "[Emscripten Module object]";
 });
} else if (ENVIRONMENT_IS_SHELL) {
 if (typeof read != "undefined") {
  Module["read"] = function shell_read(f) {
   return read(f);
  };
 }
 Module["readBinary"] = function readBinary(f) {
  var data;
  if (typeof readbuffer === "function") {
   return new Uint8Array(readbuffer(f));
  }
  data = read(f, "binary");
  assert(typeof data === "object");
  return data;
 };
 if (typeof scriptArgs != "undefined") {
  Module["arguments"] = scriptArgs;
 } else if (typeof arguments != "undefined") {
  Module["arguments"] = arguments;
 }
 if (typeof quit === "function") {
  Module["quit"] = (function(status, toThrow) {
   quit(status);
  });
 }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 Module["read"] = function shell_read(url) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", url, false);
  xhr.send(null);
  return xhr.responseText;
 };
 if (ENVIRONMENT_IS_WORKER) {
  Module["readBinary"] = function readBinary(url) {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, false);
   xhr.responseType = "arraybuffer";
   xhr.send(null);
   return new Uint8Array(xhr.response);
  };
 }
 Module["readAsync"] = function readAsync(url, onload, onerror) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function xhr_onload() {
   if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
    onload(xhr.response);
    return;
   }
   onerror();
  };
  xhr.onerror = onerror;
  xhr.send(null);
 };
 if (typeof arguments != "undefined") {
  Module["arguments"] = arguments;
 }
 Module["setWindowTitle"] = (function(title) {
  document.title = title;
 });
}
Module["print"] = typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null;
Module["printErr"] = typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || Module["print"];
Module.print = Module["print"];
Module.printErr = Module["printErr"];
for (key in moduleOverrides) {
 if (moduleOverrides.hasOwnProperty(key)) {
  Module[key] = moduleOverrides[key];
 }
}
moduleOverrides = undefined;
var STACK_ALIGN = 16;
function staticAlloc(size) {
 assert(!staticSealed);
 var ret = STATICTOP;
 STATICTOP = STATICTOP + size + 15 & -16;
 return ret;
}
function dynamicAlloc(size) {
 assert(DYNAMICTOP_PTR);
 var ret = HEAP32[DYNAMICTOP_PTR >> 2];
 var end = ret + size + 15 & -16;
 HEAP32[DYNAMICTOP_PTR >> 2] = end;
 if (end >= TOTAL_MEMORY) {
  var success = enlargeMemory();
  if (!success) {
   HEAP32[DYNAMICTOP_PTR >> 2] = ret;
   return 0;
  }
 }
 return ret;
}
function alignMemory(size, factor) {
 if (!factor) factor = STACK_ALIGN;
 var ret = size = Math.ceil(size / factor) * factor;
 return ret;
}
function getNativeTypeSize(type) {
 switch (type) {
 case "i1":
 case "i8":
  return 1;
 case "i16":
  return 2;
 case "i32":
  return 4;
 case "i64":
  return 8;
 case "float":
  return 4;
 case "double":
  return 8;
 default:
  {
   if (type[type.length - 1] === "*") {
    return 4;
   } else if (type[0] === "i") {
    var bits = parseInt(type.substr(1));
    assert(bits % 8 === 0);
    return bits / 8;
   } else {
    return 0;
   }
  }
 }
}
function warnOnce(text) {
 if (!warnOnce.shown) warnOnce.shown = {};
 if (!warnOnce.shown[text]) {
  warnOnce.shown[text] = 1;
  Module.printErr(text);
 }
}
var functionPointers = new Array(0);
var GLOBAL_BASE = 1024;
var ABORT = 0;
var EXITSTATUS = 0;
function assert(condition, text) {
 if (!condition) {
  abort("Assertion failed: " + text);
 }
}
function setValue(ptr, value, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 switch (type) {
 case "i1":
  HEAP8[ptr >> 0] = value;
  break;
 case "i8":
  HEAP8[ptr >> 0] = value;
  break;
 case "i16":
  HEAP16[ptr >> 1] = value;
  break;
 case "i32":
  HEAP32[ptr >> 2] = value;
  break;
 case "i64":
  tempI64 = [ value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
  break;
 case "float":
  HEAPF32[ptr >> 2] = value;
  break;
 case "double":
  HEAPF64[ptr >> 3] = value;
  break;
 default:
  abort("invalid type for setValue: " + type);
 }
}
var ALLOC_NORMAL = 0;
var ALLOC_STATIC = 2;
var ALLOC_NONE = 4;
function allocate(slab, types, allocator, ptr) {
 var zeroinit, size;
 if (typeof slab === "number") {
  zeroinit = true;
  size = slab;
 } else {
  zeroinit = false;
  size = slab.length;
 }
 var singleType = typeof types === "string" ? types : null;
 var ret;
 if (allocator == ALLOC_NONE) {
  ret = ptr;
 } else {
  ret = [ typeof _malloc === "function" ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc ][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
 }
 if (zeroinit) {
  var stop;
  ptr = ret;
  assert((ret & 3) == 0);
  stop = ret + (size & ~3);
  for (; ptr < stop; ptr += 4) {
   HEAP32[ptr >> 2] = 0;
  }
  stop = ret + size;
  while (ptr < stop) {
   HEAP8[ptr++ >> 0] = 0;
  }
  return ret;
 }
 if (singleType === "i8") {
  if (slab.subarray || slab.slice) {
   HEAPU8.set(slab, ret);
  } else {
   HEAPU8.set(new Uint8Array(slab), ret);
  }
  return ret;
 }
 var i = 0, type, typeSize, previousType;
 while (i < size) {
  var curr = slab[i];
  type = singleType || types[i];
  if (type === 0) {
   i++;
   continue;
  }
  if (type == "i64") type = "i32";
  setValue(ret + i, curr, type);
  if (previousType !== type) {
   typeSize = getNativeTypeSize(type);
   previousType = type;
  }
  i += typeSize;
 }
 return ret;
}
function getMemory(size) {
 if (!staticSealed) return staticAlloc(size);
 if (!runtimeInitialized) return dynamicAlloc(size);
 return _malloc(size);
}
function Pointer_stringify(ptr, length) {
 if (length === 0 || !ptr) return "";
 var hasUtf = 0;
 var t;
 var i = 0;
 while (1) {
  t = HEAPU8[ptr + i >> 0];
  hasUtf |= t;
  if (t == 0 && !length) break;
  i++;
  if (length && i == length) break;
 }
 if (!length) length = i;
 var ret = "";
 if (hasUtf < 128) {
  var MAX_CHUNK = 1024;
  var curr;
  while (length > 0) {
   curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
   ret = ret ? ret + curr : curr;
   ptr += MAX_CHUNK;
   length -= MAX_CHUNK;
  }
  return ret;
 }
 return UTF8ToString(ptr);
}
var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(u8Array, idx) {
 var endPtr = idx;
 while (u8Array[endPtr]) ++endPtr;
 if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
  return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
 } else {
  var u0, u1, u2, u3, u4, u5;
  var str = "";
  while (1) {
   u0 = u8Array[idx++];
   if (!u0) return str;
   if (!(u0 & 128)) {
    str += String.fromCharCode(u0);
    continue;
   }
   u1 = u8Array[idx++] & 63;
   if ((u0 & 224) == 192) {
    str += String.fromCharCode((u0 & 31) << 6 | u1);
    continue;
   }
   u2 = u8Array[idx++] & 63;
   if ((u0 & 240) == 224) {
    u0 = (u0 & 15) << 12 | u1 << 6 | u2;
   } else {
    u3 = u8Array[idx++] & 63;
    if ((u0 & 248) == 240) {
     u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3;
    } else {
     u4 = u8Array[idx++] & 63;
     if ((u0 & 252) == 248) {
      u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4;
     } else {
      u5 = u8Array[idx++] & 63;
      u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5;
     }
    }
   }
   if (u0 < 65536) {
    str += String.fromCharCode(u0);
   } else {
    var ch = u0 - 65536;
    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
   }
  }
 }
}
function UTF8ToString(ptr) {
 return UTF8ArrayToString(HEAPU8, ptr);
}
function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
 if (!(maxBytesToWrite > 0)) return 0;
 var startIdx = outIdx;
 var endIdx = outIdx + maxBytesToWrite - 1;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
  if (u <= 127) {
   if (outIdx >= endIdx) break;
   outU8Array[outIdx++] = u;
  } else if (u <= 2047) {
   if (outIdx + 1 >= endIdx) break;
   outU8Array[outIdx++] = 192 | u >> 6;
   outU8Array[outIdx++] = 128 | u & 63;
  } else if (u <= 65535) {
   if (outIdx + 2 >= endIdx) break;
   outU8Array[outIdx++] = 224 | u >> 12;
   outU8Array[outIdx++] = 128 | u >> 6 & 63;
   outU8Array[outIdx++] = 128 | u & 63;
  } else if (u <= 2097151) {
   if (outIdx + 3 >= endIdx) break;
   outU8Array[outIdx++] = 240 | u >> 18;
   outU8Array[outIdx++] = 128 | u >> 12 & 63;
   outU8Array[outIdx++] = 128 | u >> 6 & 63;
   outU8Array[outIdx++] = 128 | u & 63;
  } else if (u <= 67108863) {
   if (outIdx + 4 >= endIdx) break;
   outU8Array[outIdx++] = 248 | u >> 24;
   outU8Array[outIdx++] = 128 | u >> 18 & 63;
   outU8Array[outIdx++] = 128 | u >> 12 & 63;
   outU8Array[outIdx++] = 128 | u >> 6 & 63;
   outU8Array[outIdx++] = 128 | u & 63;
  } else {
   if (outIdx + 5 >= endIdx) break;
   outU8Array[outIdx++] = 252 | u >> 30;
   outU8Array[outIdx++] = 128 | u >> 24 & 63;
   outU8Array[outIdx++] = 128 | u >> 18 & 63;
   outU8Array[outIdx++] = 128 | u >> 12 & 63;
   outU8Array[outIdx++] = 128 | u >> 6 & 63;
   outU8Array[outIdx++] = 128 | u & 63;
  }
 }
 outU8Array[outIdx] = 0;
 return outIdx - startIdx;
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
 return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
function lengthBytesUTF8(str) {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
  if (u <= 127) {
   ++len;
  } else if (u <= 2047) {
   len += 2;
  } else if (u <= 65535) {
   len += 3;
  } else if (u <= 2097151) {
   len += 4;
  } else if (u <= 67108863) {
   len += 5;
  } else {
   len += 6;
  }
 }
 return len;
}
var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
function allocateUTF8(str) {
 var size = lengthBytesUTF8(str) + 1;
 var ret = _malloc(size);
 if (ret) stringToUTF8Array(str, HEAP8, ret, size);
 return ret;
}
function allocateUTF8OnStack(str) {
 var size = lengthBytesUTF8(str) + 1;
 var ret = stackAlloc(size);
 stringToUTF8Array(str, HEAP8, ret, size);
 return ret;
}
function demangle(func) {
 return func;
}
function demangleAll(text) {
 var regex = /__Z[\w\d_]+/g;
 return text.replace(regex, (function(x) {
  var y = demangle(x);
  return x === y ? x : x + " [" + y + "]";
 }));
}
function jsStackTrace() {
 var err = new Error;
 if (!err.stack) {
  try {
   throw new Error(0);
  } catch (e) {
   err = e;
  }
  if (!err.stack) {
   return "(no stack trace available)";
  }
 }
 return err.stack.toString();
}
function stackTrace() {
 var js = jsStackTrace();
 if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
 return demangleAll(js);
}
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;
var MIN_TOTAL_MEMORY = 16777216;
function alignUp(x, multiple) {
 if (x % multiple > 0) {
  x += multiple - x % multiple;
 }
 return x;
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBuffer(buf) {
 Module["buffer"] = buffer = buf;
}
function updateGlobalBufferViews() {
 Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
 Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
 Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
 Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
 Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
 Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
 Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
 Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer);
}
var STATIC_BASE, STATICTOP, staticSealed;
var STACK_BASE, STACKTOP, STACK_MAX;
var DYNAMIC_BASE, DYNAMICTOP_PTR;
STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
staticSealed = false;
function abortOnCannotGrowMemory() {
 abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ");
}
if (!Module["reallocBuffer"]) Module["reallocBuffer"] = (function(size) {
 var ret;
 try {
  if (ArrayBuffer.transfer) {
   ret = ArrayBuffer.transfer(buffer, size);
  } else {
   var oldHEAP8 = HEAP8;
   ret = new ArrayBuffer(size);
   var temp = new Int8Array(ret);
   temp.set(oldHEAP8);
  }
 } catch (e) {
  return false;
 }
 var success = _emscripten_replace_memory(ret);
 if (!success) return false;
 return ret;
});
function enlargeMemory() {
 var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
 var LIMIT = 2147483648 - PAGE_MULTIPLE;
 if (HEAP32[DYNAMICTOP_PTR >> 2] > LIMIT) {
  return false;
 }
 var OLD_TOTAL_MEMORY = TOTAL_MEMORY;
 TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY);
 while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2]) {
  if (TOTAL_MEMORY <= 536870912) {
   TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE);
  } else {
   TOTAL_MEMORY = Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE), LIMIT);
  }
 }
 var replacement = Module["reallocBuffer"](TOTAL_MEMORY);
 if (!replacement || replacement.byteLength != TOTAL_MEMORY) {
  TOTAL_MEMORY = OLD_TOTAL_MEMORY;
  return false;
 }
 updateGlobalBuffer(replacement);
 updateGlobalBufferViews();
 return true;
}
var byteLength;
try {
 byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
 byteLength(new ArrayBuffer(4));
} catch (e) {
 byteLength = (function(buffer) {
  return buffer.byteLength;
 });
}
var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
if (Module["buffer"]) {
 buffer = Module["buffer"];
} else {
 if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") {
  Module["wasmMemory"] = new WebAssembly.Memory({
   "initial": TOTAL_MEMORY / WASM_PAGE_SIZE
  });
  buffer = Module["wasmMemory"].buffer;
 } else {
  buffer = new ArrayBuffer(TOTAL_MEMORY);
 }
 Module["buffer"] = buffer;
}
updateGlobalBufferViews();
function getTotalMemory() {
 return TOTAL_MEMORY;
}
HEAP32[0] = 1668509029;
HEAP16[1] = 25459;
if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99) throw "Runtime error: expected the system to be little-endian!";
function callRuntimeCallbacks(callbacks) {
 while (callbacks.length > 0) {
  var callback = callbacks.shift();
  if (typeof callback == "function") {
   callback();
   continue;
  }
  var func = callback.func;
  if (typeof func === "number") {
   if (callback.arg === undefined) {
    Module["dynCall_v"](func);
   } else {
    Module["dynCall_vi"](func, callback.arg);
   }
  } else {
   func(callback.arg === undefined ? null : callback.arg);
  }
 }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
 if (Module["preRun"]) {
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
 if (runtimeInitialized) return;
 runtimeInitialized = true;
 callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
 callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
 callRuntimeCallbacks(__ATEXIT__);
 runtimeExited = true;
}
function postRun() {
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
}
function addOnPostRun(cb) {
 __ATPOSTRUN__.unshift(cb);
}
function writeArrayToMemory(array, buffer) {
 HEAP8.set(array, buffer);
}
function writeAsciiToMemory(str, buffer, dontAddNull) {
 for (var i = 0; i < str.length; ++i) {
  HEAP8[buffer++ >> 0] = str.charCodeAt(i);
 }
 if (!dontAddNull) HEAP8[buffer >> 0] = 0;
}
var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function getUniqueRunDependency(id) {
 return id;
}
function addRunDependency(id) {
 runDependencies++;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
}
function removeRunDependency(id) {
 runDependencies--;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
 return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0;
}
function integrateWasmJS() {
 var wasmTextFile = "ex_editor.wast";
 var wasmBinaryFile = "ex_editor.wasm";
 var asmjsCodeFile = "ex_editor.temp.asm.js";
 if (typeof Module["locateFile"] === "function") {
  if (!isDataURI(wasmTextFile)) {
   wasmTextFile = Module["locateFile"](wasmTextFile);
  }
  if (!isDataURI(wasmBinaryFile)) {
   wasmBinaryFile = Module["locateFile"](wasmBinaryFile);
  }
  if (!isDataURI(asmjsCodeFile)) {
   asmjsCodeFile = Module["locateFile"](asmjsCodeFile);
  }
 }
 var wasmPageSize = 64 * 1024;
 var info = {
  "global": null,
  "env": null,
  "asm2wasm": {
   "f64-rem": (function(x, y) {
    return x % y;
   }),
   "debugger": (function() {
    debugger;
   })
  },
  "parent": Module
 };
 var exports = null;
 function mergeMemory(newBuffer) {
  var oldBuffer = Module["buffer"];
  if (newBuffer.byteLength < oldBuffer.byteLength) {
   Module["printErr"]("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
  }
  var oldView = new Int8Array(oldBuffer);
  var newView = new Int8Array(newBuffer);
  newView.set(oldView);
  updateGlobalBuffer(newBuffer);
  updateGlobalBufferViews();
 }
 function fixImports(imports) {
  return imports;
 }
 function getBinary() {
  try {
   if (Module["wasmBinary"]) {
    return new Uint8Array(Module["wasmBinary"]);
   }
   if (Module["readBinary"]) {
    return Module["readBinary"](wasmBinaryFile);
   } else {
    throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
   }
  } catch (err) {
   abort(err);
  }
 }
 function getBinaryPromise() {
  if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
   return fetch(wasmBinaryFile, {
    credentials: "same-origin"
   }).then((function(response) {
    if (!response["ok"]) {
     throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
    }
    return response["arrayBuffer"]();
   })).catch((function() {
    return getBinary();
   }));
  }
  return new Promise((function(resolve, reject) {
   resolve(getBinary());
  }));
 }
 function doNativeWasm(global, env, providedBuffer) {
  if (typeof WebAssembly !== "object") {
   Module["printErr"]("no native wasm support detected");
   return false;
  }
  if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) {
   Module["printErr"]("no native wasm Memory in use");
   return false;
  }
  env["memory"] = Module["wasmMemory"];
  info["global"] = {
   "NaN": NaN,
   "Infinity": Infinity
  };
  info["global.Math"] = Math;
  info["env"] = env;
  function receiveInstance(instance, module) {
   exports = instance.exports;
   if (exports.memory) mergeMemory(exports.memory);
   Module["asm"] = exports;
   Module["usingWasm"] = true;
   removeRunDependency("wasm-instantiate");
  }
  addRunDependency("wasm-instantiate");
  if (Module["instantiateWasm"]) {
   try {
    return Module["instantiateWasm"](info, receiveInstance);
   } catch (e) {
    Module["printErr"]("Module.instantiateWasm callback failed with error: " + e);
    return false;
   }
  }
  function receiveInstantiatedSource(output) {
   receiveInstance(output["instance"], output["module"]);
  }
  function instantiateArrayBuffer(receiver) {
   getBinaryPromise().then((function(binary) {
    return WebAssembly.instantiate(binary, info);
   })).then(receiver).catch((function(reason) {
    Module["printErr"]("failed to asynchronously prepare wasm: " + reason);
    abort(reason);
   }));
  }
  if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
   WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, {
    credentials: "same-origin"
   }), info).then(receiveInstantiatedSource).catch((function(reason) {
    Module["printErr"]("wasm streaming compile failed: " + reason);
    Module["printErr"]("falling back to ArrayBuffer instantiation");
    instantiateArrayBuffer(receiveInstantiatedSource);
   }));
  } else {
   instantiateArrayBuffer(receiveInstantiatedSource);
  }
  return {};
 }
 Module["asmPreload"] = Module["asm"];
 var asmjsReallocBuffer = Module["reallocBuffer"];
 var wasmReallocBuffer = (function(size) {
  var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
  size = alignUp(size, PAGE_MULTIPLE);
  var old = Module["buffer"];
  var oldSize = old.byteLength;
  if (Module["usingWasm"]) {
   try {
    var result = Module["wasmMemory"].grow((size - oldSize) / wasmPageSize);
    if (result !== (-1 | 0)) {
     return Module["buffer"] = Module["wasmMemory"].buffer;
    } else {
     return null;
    }
   } catch (e) {
    return null;
   }
  }
 });
 Module["reallocBuffer"] = (function(size) {
  if (finalMethod === "asmjs") {
   return asmjsReallocBuffer(size);
  } else {
   return wasmReallocBuffer(size);
  }
 });
 var finalMethod = "";
 Module["asm"] = (function(global, env, providedBuffer) {
  env = fixImports(env);
  if (!env["table"]) {
   var TABLE_SIZE = Module["wasmTableSize"];
   if (TABLE_SIZE === undefined) TABLE_SIZE = 1024;
   var MAX_TABLE_SIZE = Module["wasmMaxTableSize"];
   if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") {
    if (MAX_TABLE_SIZE !== undefined) {
     env["table"] = new WebAssembly.Table({
      "initial": TABLE_SIZE,
      "maximum": MAX_TABLE_SIZE,
      "element": "anyfunc"
     });
    } else {
     env["table"] = new WebAssembly.Table({
      "initial": TABLE_SIZE,
      element: "anyfunc"
     });
    }
   } else {
    env["table"] = new Array(TABLE_SIZE);
   }
   Module["wasmTable"] = env["table"];
  }
  if (!env["memoryBase"]) {
   env["memoryBase"] = Module["STATIC_BASE"];
  }
  if (!env["tableBase"]) {
   env["tableBase"] = 0;
  }
  var exports;
  exports = doNativeWasm(global, env, providedBuffer);
  if (!exports) abort("no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods");
  return exports;
 });
}
integrateWasmJS();
var ASM_CONSTS = [ (function($0, $1) {
 Module.printErr("bad name in getProcAddress: " + [ Pointer_stringify($0), Pointer_stringify($1) ]);
}) ];
function _emscripten_asm_const_iii(code, a0, a1) {
 return ASM_CONSTS[code](a0, a1);
}
STATIC_BASE = GLOBAL_BASE;
STATICTOP = STATIC_BASE + 4450960;
__ATINIT__.push({
 func: (function() {
  __GLOBAL__I_000101();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_SPVRemapper_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_builtin_functions_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_builtin_types_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_shaderc_spirv_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Type_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_ObjectPool_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Meta_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Proto_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Math_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Anim_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Icosphere_cpp();
 })
}, {
 func: (function() {
  ___cxx_global_var_init();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_TypeIn_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Styler_cpp();
 })
}, {
 func: (function() {
  ___cxx_global_var_init_2153();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Inspector_cpp();
 })
}, {
 func: (function() {
  ___cxx_global_var_init_2247();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Draw_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Particles_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Sky_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_ImporterGltf_cpp();
 })
}, {
 func: (function() {
  ___cxx_global_var_init_3868();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btAlignedAllocator_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexHull_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexHullComputer_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGeometryUtil_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btPolarDecomposition_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btQuickprof_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btThreads_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btVector3_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btAxisSweep3_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btBroadphaseProxy_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btDbvt_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btDbvtBroadphase_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btDispatcher_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btOverlappingPairCache_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btQuantizedBvh_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSimpleBroadphase_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btActivatingCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btBox2dBox2dCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btBoxBoxCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btBoxBoxDetector_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCollisionDispatcher_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCollisionDispatcherMt_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCollisionObject_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCollisionWorld_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCollisionWorldImporter_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCompoundCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCompoundCompoundCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvex2dConvex2dAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexConcaveCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexConvexAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexPlaneCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btDefaultCollisionConfiguration_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btEmptyCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGhostObject_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btHashedSimplePairCache_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btInternalEdgeUtility_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btManifoldResult_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSimulationIslandManager_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSphereBoxCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSphereSphereCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSphereTriangleCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btUnionFind_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_SphereTriangleDetector_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btBox2dShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btBoxShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btBvhTriangleMeshShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCapsuleShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCollisionShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCompoundShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConcaveShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConeShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvex2dShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexHullShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexInternalShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexPointCloudShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexPolyhedron_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexTriangleMeshShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btCylinderShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btEmptyShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btHeightfieldTerrainShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMinkowskiSumShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultimaterialTriangleMeshShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiSphereShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btOptimizedBvh_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btPolyhedralConvexShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btScaledBvhTriangleMeshShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btShapeHull_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSphereShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btStaticPlaneShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btStridingMeshInterface_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTetrahedronShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTriangleBuffer_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTriangleCallback_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTriangleIndexVertexArray_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTriangleIndexVertexMaterialArray_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTriangleMesh_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTriangleMeshShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btUniformScalingShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btContactProcessing_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGenericPoolAllocator_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGImpactBvh_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGImpactCollisionAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGImpactQuantizedBvh_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGImpactShape_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTriangleShapeEx_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_gim_box_set_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_gim_contact_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_gim_memory_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_gim_tri_collision_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btContinuousConvexCollision_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConvexCast_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGjkConvexCast_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGjkEpa2_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGjkEpaPenetrationDepthSolver_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGjkPairDetector_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMinkowskiPenetrationDepthSolver_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btPersistentManifold_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btPolyhedralContactClipping_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btRaycastCallback_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSubSimplexConvexCast_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btVoronoiSimplexSolver_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btDiscreteDynamicsWorld_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btDiscreteDynamicsWorldMt_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btRigidBody_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSimpleDynamicsWorld_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSimulationIslandManagerMt_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btConeTwistConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btContactConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btFixedConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGearConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGeneric6DofConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGeneric6DofSpring2Constraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btGeneric6DofSpringConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btHinge2Constraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btHingeConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btNNCGConstraintSolver_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btPoint2PointConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSequentialImpulseConstraintSolver_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSliderConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btSolve2LinearConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btTypedConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btUniversalConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBody_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodyConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodyConstraintSolver_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodyDynamicsWorld_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodyFixedConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodyGearConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodyJointLimitConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodyJointMotor_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodyPoint2Point_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMultiBodySliderConstraint_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btDantzigLCP_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btLemkeAlgorithm_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btMLCPSolver_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btRaycastVehicle_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btWheelInfo_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_btKinematicCharacterController_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_BulletCollider_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_BulletMotionState_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_BulletSolid_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_BulletWorld_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_SoundMedium_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_VisualMedium_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Movable_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Physic_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Solid_cpp();
 })
}, {
 func: (function() {
  ___cxx_global_var_init_446();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_WorldPage_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_VisuScene_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_Elements_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_doc_cpp();
 })
}, {
 func: (function() {
  __GLOBAL__sub_I_iostream_cpp();
 })
});
var STATIC_BUMP = 4450960;
Module["STATIC_BASE"] = STATIC_BASE;
Module["STATIC_BUMP"] = STATIC_BUMP;
STATICTOP += 16;
function __ZSt18uncaught_exceptionv() {
 return !!__ZSt18uncaught_exceptionv.uncaught_exception;
}
function _emscripten_get_now() {
 abort();
}
function _emscripten_get_now_is_monotonic() {
 return ENVIRONMENT_IS_NODE || typeof dateNow !== "undefined" || (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self["performance"] && self["performance"]["now"];
}
var ERRNO_CODES = {
 EPERM: 1,
 ENOENT: 2,
 ESRCH: 3,
 EINTR: 4,
 EIO: 5,
 ENXIO: 6,
 E2BIG: 7,
 ENOEXEC: 8,
 EBADF: 9,
 ECHILD: 10,
 EAGAIN: 11,
 EWOULDBLOCK: 11,
 ENOMEM: 12,
 EACCES: 13,
 EFAULT: 14,
 ENOTBLK: 15,
 EBUSY: 16,
 EEXIST: 17,
 EXDEV: 18,
 ENODEV: 19,
 ENOTDIR: 20,
 EISDIR: 21,
 EINVAL: 22,
 ENFILE: 23,
 EMFILE: 24,
 ENOTTY: 25,
 ETXTBSY: 26,
 EFBIG: 27,
 ENOSPC: 28,
 ESPIPE: 29,
 EROFS: 30,
 EMLINK: 31,
 EPIPE: 32,
 EDOM: 33,
 ERANGE: 34,
 ENOMSG: 42,
 EIDRM: 43,
 ECHRNG: 44,
 EL2NSYNC: 45,
 EL3HLT: 46,
 EL3RST: 47,
 ELNRNG: 48,
 EUNATCH: 49,
 ENOCSI: 50,
 EL2HLT: 51,
 EDEADLK: 35,
 ENOLCK: 37,
 EBADE: 52,
 EBADR: 53,
 EXFULL: 54,
 ENOANO: 55,
 EBADRQC: 56,
 EBADSLT: 57,
 EDEADLOCK: 35,
 EBFONT: 59,
 ENOSTR: 60,
 ENODATA: 61,
 ETIME: 62,
 ENOSR: 63,
 ENONET: 64,
 ENOPKG: 65,
 EREMOTE: 66,
 ENOLINK: 67,
 EADV: 68,
 ESRMNT: 69,
 ECOMM: 70,
 EPROTO: 71,
 EMULTIHOP: 72,
 EDOTDOT: 73,
 EBADMSG: 74,
 ENOTUNIQ: 76,
 EBADFD: 77,
 EREMCHG: 78,
 ELIBACC: 79,
 ELIBBAD: 80,
 ELIBSCN: 81,
 ELIBMAX: 82,
 ELIBEXEC: 83,
 ENOSYS: 38,
 ENOTEMPTY: 39,
 ENAMETOOLONG: 36,
 ELOOP: 40,
 EOPNOTSUPP: 95,
 EPFNOSUPPORT: 96,
 ECONNRESET: 104,
 ENOBUFS: 105,
 EAFNOSUPPORT: 97,
 EPROTOTYPE: 91,
 ENOTSOCK: 88,
 ENOPROTOOPT: 92,
 ESHUTDOWN: 108,
 ECONNREFUSED: 111,
 EADDRINUSE: 98,
 ECONNABORTED: 103,
 ENETUNREACH: 101,
 ENETDOWN: 100,
 ETIMEDOUT: 110,
 EHOSTDOWN: 112,
 EHOSTUNREACH: 113,
 EINPROGRESS: 115,
 EALREADY: 114,
 EDESTADDRREQ: 89,
 EMSGSIZE: 90,
 EPROTONOSUPPORT: 93,
 ESOCKTNOSUPPORT: 94,
 EADDRNOTAVAIL: 99,
 ENETRESET: 102,
 EISCONN: 106,
 ENOTCONN: 107,
 ETOOMANYREFS: 109,
 EUSERS: 87,
 EDQUOT: 122,
 ESTALE: 116,
 ENOTSUP: 95,
 ENOMEDIUM: 123,
 EILSEQ: 84,
 EOVERFLOW: 75,
 ECANCELED: 125,
 ENOTRECOVERABLE: 131,
 EOWNERDEAD: 130,
 ESTRPIPE: 86
};
function ___setErrNo(value) {
 if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
 return value;
}
function _clock_gettime(clk_id, tp) {
 var now;
 if (clk_id === 0) {
  now = Date.now();
 } else if (clk_id === 1 && _emscripten_get_now_is_monotonic()) {
  now = _emscripten_get_now();
 } else {
  ___setErrNo(ERRNO_CODES.EINVAL);
  return -1;
 }
 HEAP32[tp >> 2] = now / 1e3 | 0;
 HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
 return 0;
}
function ___clock_gettime() {
 return _clock_gettime.apply(null, arguments);
}
var EXCEPTIONS = {
 last: 0,
 caught: [],
 infos: {},
 deAdjust: (function(adjusted) {
  if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;
  for (var ptr in EXCEPTIONS.infos) {
   var info = EXCEPTIONS.infos[ptr];
   if (info.adjusted === adjusted) {
    return ptr;
   }
  }
  return adjusted;
 }),
 addRef: (function(ptr) {
  if (!ptr) return;
  var info = EXCEPTIONS.infos[ptr];
  info.refcount++;
 }),
 decRef: (function(ptr) {
  if (!ptr) return;
  var info = EXCEPTIONS.infos[ptr];
  assert(info.refcount > 0);
  info.refcount--;
  if (info.refcount === 0 && !info.rethrown) {
   if (info.destructor) {
    Module["dynCall_vi"](info.destructor, ptr);
   }
   delete EXCEPTIONS.infos[ptr];
   ___cxa_free_exception(ptr);
  }
 }),
 clearRef: (function(ptr) {
  if (!ptr) return;
  var info = EXCEPTIONS.infos[ptr];
  info.refcount = 0;
 })
};
function ___cxa_pure_virtual() {
 ABORT = true;
 throw "Pure virtual function called!";
}
function ___lock() {}
function ___map_file(pathname, size) {
 ___setErrNo(ERRNO_CODES.EPERM);
 return -1;
}
var ERRNO_MESSAGES = {
 0: "Success",
 1: "Not super-user",
 2: "No such file or directory",
 3: "No such process",
 4: "Interrupted system call",
 5: "I/O error",
 6: "No such device or address",
 7: "Arg list too long",
 8: "Exec format error",
 9: "Bad file number",
 10: "No children",
 11: "No more processes",
 12: "Not enough core",
 13: "Permission denied",
 14: "Bad address",
 15: "Block device required",
 16: "Mount device busy",
 17: "File exists",
 18: "Cross-device link",
 19: "No such device",
 20: "Not a directory",
 21: "Is a directory",
 22: "Invalid argument",
 23: "Too many open files in system",
 24: "Too many open files",
 25: "Not a typewriter",
 26: "Text file busy",
 27: "File too large",
 28: "No space left on device",
 29: "Illegal seek",
 30: "Read only file system",
 31: "Too many links",
 32: "Broken pipe",
 33: "Math arg out of domain of func",
 34: "Math result not representable",
 35: "File locking deadlock error",
 36: "File or path name too long",
 37: "No record locks available",
 38: "Function not implemented",
 39: "Directory not empty",
 40: "Too many symbolic links",
 42: "No message of desired type",
 43: "Identifier removed",
 44: "Channel number out of range",
 45: "Level 2 not synchronized",
 46: "Level 3 halted",
 47: "Level 3 reset",
 48: "Link number out of range",
 49: "Protocol driver not attached",
 50: "No CSI structure available",
 51: "Level 2 halted",
 52: "Invalid exchange",
 53: "Invalid request descriptor",
 54: "Exchange full",
 55: "No anode",
 56: "Invalid request code",
 57: "Invalid slot",
 59: "Bad font file fmt",
 60: "Device not a stream",
 61: "No data (for no delay io)",
 62: "Timer expired",
 63: "Out of streams resources",
 64: "Machine is not on the network",
 65: "Package not installed",
 66: "The object is remote",
 67: "The link has been severed",
 68: "Advertise error",
 69: "Srmount error",
 70: "Communication error on send",
 71: "Protocol error",
 72: "Multihop attempted",
 73: "Cross mount point (not really error)",
 74: "Trying to read unreadable message",
 75: "Value too large for defined data type",
 76: "Given log. name not unique",
 77: "f.d. invalid for this operation",
 78: "Remote address changed",
 79: "Can   access a needed shared lib",
 80: "Accessing a corrupted shared lib",
 81: ".lib section in a.out corrupted",
 82: "Attempting to link in too many libs",
 83: "Attempting to exec a shared library",
 84: "Illegal byte sequence",
 86: "Streams pipe error",
 87: "Too many users",
 88: "Socket operation on non-socket",
 89: "Destination address required",
 90: "Message too long",
 91: "Protocol wrong type for socket",
 92: "Protocol not available",
 93: "Unknown protocol",
 94: "Socket type not supported",
 95: "Not supported",
 96: "Protocol family not supported",
 97: "Address family not supported by protocol family",
 98: "Address already in use",
 99: "Address not available",
 100: "Network interface is not configured",
 101: "Network is unreachable",
 102: "Connection reset by network",
 103: "Connection aborted",
 104: "Connection reset by peer",
 105: "No buffer space available",
 106: "Socket is already connected",
 107: "Socket is not connected",
 108: "Can't send after socket shutdown",
 109: "Too many references",
 110: "Connection timed out",
 111: "Connection refused",
 112: "Host is down",
 113: "Host is unreachable",
 114: "Socket already connected",
 115: "Connection already in progress",
 116: "Stale file handle",
 122: "Quota exceeded",
 123: "No medium (in tape drive)",
 125: "Operation canceled",
 130: "Previous owner died",
 131: "State not recoverable"
};
var PATH = {
 splitPath: (function(filename) {
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  return splitPathRe.exec(filename).slice(1);
 }),
 normalizeArray: (function(parts, allowAboveRoot) {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
   var last = parts[i];
   if (last === ".") {
    parts.splice(i, 1);
   } else if (last === "..") {
    parts.splice(i, 1);
    up++;
   } else if (up) {
    parts.splice(i, 1);
    up--;
   }
  }
  if (allowAboveRoot) {
   for (; up; up--) {
    parts.unshift("..");
   }
  }
  return parts;
 }),
 normalize: (function(path) {
  var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
  path = PATH.normalizeArray(path.split("/").filter((function(p) {
   return !!p;
  })), !isAbsolute).join("/");
  if (!path && !isAbsolute) {
   path = ".";
  }
  if (path && trailingSlash) {
   path += "/";
  }
  return (isAbsolute ? "/" : "") + path;
 }),
 dirname: (function(path) {
  var result = PATH.splitPath(path), root = result[0], dir = result[1];
  if (!root && !dir) {
   return ".";
  }
  if (dir) {
   dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
 }),
 basename: (function(path) {
  if (path === "/") return "/";
  var lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) return path;
  return path.substr(lastSlash + 1);
 }),
 extname: (function(path) {
  return PATH.splitPath(path)[3];
 }),
 join: (function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return PATH.normalize(paths.join("/"));
 }),
 join2: (function(l, r) {
  return PATH.normalize(l + "/" + r);
 }),
 resolve: (function() {
  var resolvedPath = "", resolvedAbsolute = false;
  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
   var path = i >= 0 ? arguments[i] : FS.cwd();
   if (typeof path !== "string") {
    throw new TypeError("Arguments to path.resolve must be strings");
   } else if (!path) {
    return "";
   }
   resolvedPath = path + "/" + resolvedPath;
   resolvedAbsolute = path.charAt(0) === "/";
  }
  resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((function(p) {
   return !!p;
  })), !resolvedAbsolute).join("/");
  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
 }),
 relative: (function(from, to) {
  from = PATH.resolve(from).substr(1);
  to = PATH.resolve(to).substr(1);
  function trim(arr) {
   var start = 0;
   for (; start < arr.length; start++) {
    if (arr[start] !== "") break;
   }
   var end = arr.length - 1;
   for (; end >= 0; end--) {
    if (arr[end] !== "") break;
   }
   if (start > end) return [];
   return arr.slice(start, end - start + 1);
  }
  var fromParts = trim(from.split("/"));
  var toParts = trim(to.split("/"));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
   if (fromParts[i] !== toParts[i]) {
    samePartsLength = i;
    break;
   }
  }
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
   outputParts.push("..");
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join("/");
 })
};
var TTY = {
 ttys: [],
 init: (function() {}),
 shutdown: (function() {}),
 register: (function(dev, ops) {
  TTY.ttys[dev] = {
   input: [],
   output: [],
   ops: ops
  };
  FS.registerDevice(dev, TTY.stream_ops);
 }),
 stream_ops: {
  open: (function(stream) {
   var tty = TTY.ttys[stream.node.rdev];
   if (!tty) {
    throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
   }
   stream.tty = tty;
   stream.seekable = false;
  }),
  close: (function(stream) {
   stream.tty.ops.flush(stream.tty);
  }),
  flush: (function(stream) {
   stream.tty.ops.flush(stream.tty);
  }),
  read: (function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.get_char) {
    throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
   }
   var bytesRead = 0;
   for (var i = 0; i < length; i++) {
    var result;
    try {
     result = stream.tty.ops.get_char(stream.tty);
    } catch (e) {
     throw new FS.ErrnoError(ERRNO_CODES.EIO);
    }
    if (result === undefined && bytesRead === 0) {
     throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
    }
    if (result === null || result === undefined) break;
    bytesRead++;
    buffer[offset + i] = result;
   }
   if (bytesRead) {
    stream.node.timestamp = Date.now();
   }
   return bytesRead;
  }),
  write: (function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.put_char) {
    throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
   }
   for (var i = 0; i < length; i++) {
    try {
     stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
    } catch (e) {
     throw new FS.ErrnoError(ERRNO_CODES.EIO);
    }
   }
   if (length) {
    stream.node.timestamp = Date.now();
   }
   return i;
  })
 },
 default_tty_ops: {
  get_char: (function(tty) {
   if (!tty.input.length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
     var BUFSIZE = 256;
     var buf = new Buffer(BUFSIZE);
     var bytesRead = 0;
     var isPosixPlatform = process.platform != "win32";
     var fd = process.stdin.fd;
     if (isPosixPlatform) {
      var usingDevice = false;
      try {
       fd = fs.openSync("/dev/stdin", "r");
       usingDevice = true;
      } catch (e) {}
     }
     try {
      bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null);
     } catch (e) {
      if (e.toString().indexOf("EOF") != -1) bytesRead = 0; else throw e;
     }
     if (usingDevice) {
      fs.closeSync(fd);
     }
     if (bytesRead > 0) {
      result = buf.slice(0, bytesRead).toString("utf-8");
     } else {
      result = null;
     }
    } else if (typeof window != "undefined" && typeof window.prompt == "function") {
     result = window.prompt("Input: ");
     if (result !== null) {
      result += "\n";
     }
    } else if (typeof readline == "function") {
     result = readline();
     if (result !== null) {
      result += "\n";
     }
    }
    if (!result) {
     return null;
    }
    tty.input = intArrayFromString(result, true);
   }
   return tty.input.shift();
  }),
  put_char: (function(tty, val) {
   if (val === null || val === 10) {
    Module["print"](UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  }),
  flush: (function(tty) {
   if (tty.output && tty.output.length > 0) {
    Module["print"](UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  })
 },
 default_tty1_ops: {
  put_char: (function(tty, val) {
   if (val === null || val === 10) {
    Module["printErr"](UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  }),
  flush: (function(tty) {
   if (tty.output && tty.output.length > 0) {
    Module["printErr"](UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  })
 }
};
var MEMFS = {
 ops_table: null,
 mount: (function(mount) {
  return MEMFS.createNode(null, "/", 16384 | 511, 0);
 }),
 createNode: (function(parent, name, mode, dev) {
  if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (!MEMFS.ops_table) {
   MEMFS.ops_table = {
    dir: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr,
      lookup: MEMFS.node_ops.lookup,
      mknod: MEMFS.node_ops.mknod,
      rename: MEMFS.node_ops.rename,
      unlink: MEMFS.node_ops.unlink,
      rmdir: MEMFS.node_ops.rmdir,
      readdir: MEMFS.node_ops.readdir,
      symlink: MEMFS.node_ops.symlink
     },
     stream: {
      llseek: MEMFS.stream_ops.llseek
     }
    },
    file: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr
     },
     stream: {
      llseek: MEMFS.stream_ops.llseek,
      read: MEMFS.stream_ops.read,
      write: MEMFS.stream_ops.write,
      allocate: MEMFS.stream_ops.allocate,
      mmap: MEMFS.stream_ops.mmap,
      msync: MEMFS.stream_ops.msync
     }
    },
    link: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr,
      readlink: MEMFS.node_ops.readlink
     },
     stream: {}
    },
    chrdev: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr
     },
     stream: FS.chrdev_stream_ops
    }
   };
  }
  var node = FS.createNode(parent, name, mode, dev);
  if (FS.isDir(node.mode)) {
   node.node_ops = MEMFS.ops_table.dir.node;
   node.stream_ops = MEMFS.ops_table.dir.stream;
   node.contents = {};
  } else if (FS.isFile(node.mode)) {
   node.node_ops = MEMFS.ops_table.file.node;
   node.stream_ops = MEMFS.ops_table.file.stream;
   node.usedBytes = 0;
   node.contents = null;
  } else if (FS.isLink(node.mode)) {
   node.node_ops = MEMFS.ops_table.link.node;
   node.stream_ops = MEMFS.ops_table.link.stream;
  } else if (FS.isChrdev(node.mode)) {
   node.node_ops = MEMFS.ops_table.chrdev.node;
   node.stream_ops = MEMFS.ops_table.chrdev.stream;
  }
  node.timestamp = Date.now();
  if (parent) {
   parent.contents[name] = node;
  }
  return node;
 }),
 getFileDataAsRegularArray: (function(node) {
  if (node.contents && node.contents.subarray) {
   var arr = [];
   for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
   return arr;
  }
  return node.contents;
 }),
 getFileDataAsTypedArray: (function(node) {
  if (!node.contents) return new Uint8Array;
  if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
  return new Uint8Array(node.contents);
 }),
 expandFileStorage: (function(node, newCapacity) {
  if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
   node.contents = MEMFS.getFileDataAsRegularArray(node);
   node.usedBytes = node.contents.length;
  }
  if (!node.contents || node.contents.subarray) {
   var prevCapacity = node.contents ? node.contents.length : 0;
   if (prevCapacity >= newCapacity) return;
   var CAPACITY_DOUBLING_MAX = 1024 * 1024;
   newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
   if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
   var oldContents = node.contents;
   node.contents = new Uint8Array(newCapacity);
   if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
   return;
  }
  if (!node.contents && newCapacity > 0) node.contents = [];
  while (node.contents.length < newCapacity) node.contents.push(0);
 }),
 resizeFileStorage: (function(node, newSize) {
  if (node.usedBytes == newSize) return;
  if (newSize == 0) {
   node.contents = null;
   node.usedBytes = 0;
   return;
  }
  if (!node.contents || node.contents.subarray) {
   var oldContents = node.contents;
   node.contents = new Uint8Array(new ArrayBuffer(newSize));
   if (oldContents) {
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
   }
   node.usedBytes = newSize;
   return;
  }
  if (!node.contents) node.contents = [];
  if (node.contents.length > newSize) node.contents.length = newSize; else while (node.contents.length < newSize) node.contents.push(0);
  node.usedBytes = newSize;
 }),
 node_ops: {
  getattr: (function(node) {
   var attr = {};
   attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
   attr.ino = node.id;
   attr.mode = node.mode;
   attr.nlink = 1;
   attr.uid = 0;
   attr.gid = 0;
   attr.rdev = node.rdev;
   if (FS.isDir(node.mode)) {
    attr.size = 4096;
   } else if (FS.isFile(node.mode)) {
    attr.size = node.usedBytes;
   } else if (FS.isLink(node.mode)) {
    attr.size = node.link.length;
   } else {
    attr.size = 0;
   }
   attr.atime = new Date(node.timestamp);
   attr.mtime = new Date(node.timestamp);
   attr.ctime = new Date(node.timestamp);
   attr.blksize = 4096;
   attr.blocks = Math.ceil(attr.size / attr.blksize);
   return attr;
  }),
  setattr: (function(node, attr) {
   if (attr.mode !== undefined) {
    node.mode = attr.mode;
   }
   if (attr.timestamp !== undefined) {
    node.timestamp = attr.timestamp;
   }
   if (attr.size !== undefined) {
    MEMFS.resizeFileStorage(node, attr.size);
   }
  }),
  lookup: (function(parent, name) {
   throw FS.genericErrors[ERRNO_CODES.ENOENT];
  }),
  mknod: (function(parent, name, mode, dev) {
   return MEMFS.createNode(parent, name, mode, dev);
  }),
  rename: (function(old_node, new_dir, new_name) {
   if (FS.isDir(old_node.mode)) {
    var new_node;
    try {
     new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (new_node) {
     for (var i in new_node.contents) {
      throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
     }
    }
   }
   delete old_node.parent.contents[old_node.name];
   old_node.name = new_name;
   new_dir.contents[new_name] = old_node;
   old_node.parent = new_dir;
  }),
  unlink: (function(parent, name) {
   delete parent.contents[name];
  }),
  rmdir: (function(parent, name) {
   var node = FS.lookupNode(parent, name);
   for (var i in node.contents) {
    throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
   }
   delete parent.contents[name];
  }),
  readdir: (function(node) {
   var entries = [ ".", ".." ];
   for (var key in node.contents) {
    if (!node.contents.hasOwnProperty(key)) {
     continue;
    }
    entries.push(key);
   }
   return entries;
  }),
  symlink: (function(parent, newname, oldpath) {
   var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
   node.link = oldpath;
   return node;
  }),
  readlink: (function(node) {
   if (!FS.isLink(node.mode)) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   return node.link;
  })
 },
 stream_ops: {
  read: (function(stream, buffer, offset, length, position) {
   var contents = stream.node.contents;
   if (position >= stream.node.usedBytes) return 0;
   var size = Math.min(stream.node.usedBytes - position, length);
   assert(size >= 0);
   if (size > 8 && contents.subarray) {
    buffer.set(contents.subarray(position, position + size), offset);
   } else {
    for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
   }
   return size;
  }),
  write: (function(stream, buffer, offset, length, position, canOwn) {
   if (!length) return 0;
   var node = stream.node;
   node.timestamp = Date.now();
   if (buffer.subarray && (!node.contents || node.contents.subarray)) {
    if (canOwn) {
     node.contents = buffer.subarray(offset, offset + length);
     node.usedBytes = length;
     return length;
    } else if (node.usedBytes === 0 && position === 0) {
     node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
     node.usedBytes = length;
     return length;
    } else if (position + length <= node.usedBytes) {
     node.contents.set(buffer.subarray(offset, offset + length), position);
     return length;
    }
   }
   MEMFS.expandFileStorage(node, position + length);
   if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); else {
    for (var i = 0; i < length; i++) {
     node.contents[position + i] = buffer[offset + i];
    }
   }
   node.usedBytes = Math.max(node.usedBytes, position + length);
   return length;
  }),
  llseek: (function(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     position += stream.node.usedBytes;
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   return position;
  }),
  allocate: (function(stream, offset, length) {
   MEMFS.expandFileStorage(stream.node, offset + length);
   stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
  }),
  mmap: (function(stream, buffer, offset, length, position, prot, flags) {
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
   }
   var ptr;
   var allocated;
   var contents = stream.node.contents;
   if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
    allocated = false;
    ptr = contents.byteOffset;
   } else {
    if (position > 0 || position + length < stream.node.usedBytes) {
     if (contents.subarray) {
      contents = contents.subarray(position, position + length);
     } else {
      contents = Array.prototype.slice.call(contents, position, position + length);
     }
    }
    allocated = true;
    ptr = _malloc(length);
    if (!ptr) {
     throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
    }
    buffer.set(contents, ptr);
   }
   return {
    ptr: ptr,
    allocated: allocated
   };
  }),
  msync: (function(stream, buffer, offset, length, mmapFlags) {
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
   }
   if (mmapFlags & 2) {
    return 0;
   }
   var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
   return 0;
  })
 }
};
var IDBFS = {
 dbs: {},
 indexedDB: (function() {
  if (typeof indexedDB !== "undefined") return indexedDB;
  var ret = null;
  if (typeof window === "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  assert(ret, "IDBFS used, but indexedDB not supported");
  return ret;
 }),
 DB_VERSION: 21,
 DB_STORE_NAME: "FILE_DATA",
 mount: (function(mount) {
  return MEMFS.mount.apply(null, arguments);
 }),
 syncfs: (function(mount, populate, callback) {
  IDBFS.getLocalSet(mount, (function(err, local) {
   if (err) return callback(err);
   IDBFS.getRemoteSet(mount, (function(err, remote) {
    if (err) return callback(err);
    var src = populate ? remote : local;
    var dst = populate ? local : remote;
    IDBFS.reconcile(src, dst, callback);
   }));
  }));
 }),
 getDB: (function(name, callback) {
  var db = IDBFS.dbs[name];
  if (db) {
   return callback(null, db);
  }
  var req;
  try {
   req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
  } catch (e) {
   return callback(e);
  }
  if (!req) {
   return callback("Unable to connect to IndexedDB");
  }
  req.onupgradeneeded = (function(e) {
   var db = e.target.result;
   var transaction = e.target.transaction;
   var fileStore;
   if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
    fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
   } else {
    fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
   }
   if (!fileStore.indexNames.contains("timestamp")) {
    fileStore.createIndex("timestamp", "timestamp", {
     unique: false
    });
   }
  });
  req.onsuccess = (function() {
   db = req.result;
   IDBFS.dbs[name] = db;
   callback(null, db);
  });
  req.onerror = (function(e) {
   callback(this.error);
   e.preventDefault();
  });
 }),
 getLocalSet: (function(mount, callback) {
  var entries = {};
  function isRealDir(p) {
   return p !== "." && p !== "..";
  }
  function toAbsolute(root) {
   return (function(p) {
    return PATH.join2(root, p);
   });
  }
  var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  while (check.length) {
   var path = check.pop();
   var stat;
   try {
    stat = FS.stat(path);
   } catch (e) {
    return callback(e);
   }
   if (FS.isDir(stat.mode)) {
    check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
   }
   entries[path] = {
    timestamp: stat.mtime
   };
  }
  return callback(null, {
   type: "local",
   entries: entries
  });
 }),
 getRemoteSet: (function(mount, callback) {
  var entries = {};
  IDBFS.getDB(mount.mountpoint, (function(err, db) {
   if (err) return callback(err);
   try {
    var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readonly");
    transaction.onerror = (function(e) {
     callback(this.error);
     e.preventDefault();
    });
    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
    var index = store.index("timestamp");
    index.openKeyCursor().onsuccess = (function(event) {
     var cursor = event.target.result;
     if (!cursor) {
      return callback(null, {
       type: "remote",
       db: db,
       entries: entries
      });
     }
     entries[cursor.primaryKey] = {
      timestamp: cursor.key
     };
     cursor.continue();
    });
   } catch (e) {
    return callback(e);
   }
  }));
 }),
 loadLocalEntry: (function(path, callback) {
  var stat, node;
  try {
   var lookup = FS.lookupPath(path);
   node = lookup.node;
   stat = FS.stat(path);
  } catch (e) {
   return callback(e);
  }
  if (FS.isDir(stat.mode)) {
   return callback(null, {
    timestamp: stat.mtime,
    mode: stat.mode
   });
  } else if (FS.isFile(stat.mode)) {
   node.contents = MEMFS.getFileDataAsTypedArray(node);
   return callback(null, {
    timestamp: stat.mtime,
    mode: stat.mode,
    contents: node.contents
   });
  } else {
   return callback(new Error("node type not supported"));
  }
 }),
 storeLocalEntry: (function(path, entry, callback) {
  try {
   if (FS.isDir(entry.mode)) {
    FS.mkdir(path, entry.mode);
   } else if (FS.isFile(entry.mode)) {
    FS.writeFile(path, entry.contents, {
     canOwn: true
    });
   } else {
    return callback(new Error("node type not supported"));
   }
   FS.chmod(path, entry.mode);
   FS.utime(path, entry.timestamp, entry.timestamp);
  } catch (e) {
   return callback(e);
  }
  callback(null);
 }),
 removeLocalEntry: (function(path, callback) {
  try {
   var lookup = FS.lookupPath(path);
   var stat = FS.stat(path);
   if (FS.isDir(stat.mode)) {
    FS.rmdir(path);
   } else if (FS.isFile(stat.mode)) {
    FS.unlink(path);
   }
  } catch (e) {
   return callback(e);
  }
  callback(null);
 }),
 loadRemoteEntry: (function(store, path, callback) {
  var req = store.get(path);
  req.onsuccess = (function(event) {
   callback(null, event.target.result);
  });
  req.onerror = (function(e) {
   callback(this.error);
   e.preventDefault();
  });
 }),
 storeRemoteEntry: (function(store, path, entry, callback) {
  var req = store.put(entry, path);
  req.onsuccess = (function() {
   callback(null);
  });
  req.onerror = (function(e) {
   callback(this.error);
   e.preventDefault();
  });
 }),
 removeRemoteEntry: (function(store, path, callback) {
  var req = store.delete(path);
  req.onsuccess = (function() {
   callback(null);
  });
  req.onerror = (function(e) {
   callback(this.error);
   e.preventDefault();
  });
 }),
 reconcile: (function(src, dst, callback) {
  var total = 0;
  var create = [];
  Object.keys(src.entries).forEach((function(key) {
   var e = src.entries[key];
   var e2 = dst.entries[key];
   if (!e2 || e.timestamp > e2.timestamp) {
    create.push(key);
    total++;
   }
  }));
  var remove = [];
  Object.keys(dst.entries).forEach((function(key) {
   var e = dst.entries[key];
   var e2 = src.entries[key];
   if (!e2) {
    remove.push(key);
    total++;
   }
  }));
  if (!total) {
   return callback(null);
  }
  var completed = 0;
  var db = src.type === "remote" ? src.db : dst.db;
  var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readwrite");
  var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  function done(err) {
   if (err) {
    if (!done.errored) {
     done.errored = true;
     return callback(err);
    }
    return;
   }
   if (++completed >= total) {
    return callback(null);
   }
  }
  transaction.onerror = (function(e) {
   done(this.error);
   e.preventDefault();
  });
  create.sort().forEach((function(path) {
   if (dst.type === "local") {
    IDBFS.loadRemoteEntry(store, path, (function(err, entry) {
     if (err) return done(err);
     IDBFS.storeLocalEntry(path, entry, done);
    }));
   } else {
    IDBFS.loadLocalEntry(path, (function(err, entry) {
     if (err) return done(err);
     IDBFS.storeRemoteEntry(store, path, entry, done);
    }));
   }
  }));
  remove.sort().reverse().forEach((function(path) {
   if (dst.type === "local") {
    IDBFS.removeLocalEntry(path, done);
   } else {
    IDBFS.removeRemoteEntry(store, path, done);
   }
  }));
 })
};
var NODEFS = {
 isWindows: false,
 staticInit: (function() {
  NODEFS.isWindows = !!process.platform.match(/^win/);
  var flags = process["binding"]("constants");
  if (flags["fs"]) {
   flags = flags["fs"];
  }
  NODEFS.flagsForNodeMap = {
   "1024": flags["O_APPEND"],
   "64": flags["O_CREAT"],
   "128": flags["O_EXCL"],
   "0": flags["O_RDONLY"],
   "2": flags["O_RDWR"],
   "4096": flags["O_SYNC"],
   "512": flags["O_TRUNC"],
   "1": flags["O_WRONLY"]
  };
 }),
 bufferFrom: (function(arrayBuffer) {
  return Buffer.alloc ? Buffer.from(arrayBuffer) : new Buffer(arrayBuffer);
 }),
 mount: (function(mount) {
  assert(ENVIRONMENT_IS_NODE);
  return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0);
 }),
 createNode: (function(parent, name, mode, dev) {
  if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var node = FS.createNode(parent, name, mode);
  node.node_ops = NODEFS.node_ops;
  node.stream_ops = NODEFS.stream_ops;
  return node;
 }),
 getMode: (function(path) {
  var stat;
  try {
   stat = fs.lstatSync(path);
   if (NODEFS.isWindows) {
    stat.mode = stat.mode | (stat.mode & 292) >> 2;
   }
  } catch (e) {
   if (!e.code) throw e;
   throw new FS.ErrnoError(ERRNO_CODES[e.code]);
  }
  return stat.mode;
 }),
 realPath: (function(node) {
  var parts = [];
  while (node.parent !== node) {
   parts.push(node.name);
   node = node.parent;
  }
  parts.push(node.mount.opts.root);
  parts.reverse();
  return PATH.join.apply(null, parts);
 }),
 flagsForNode: (function(flags) {
  flags &= ~2097152;
  flags &= ~2048;
  flags &= ~32768;
  flags &= ~524288;
  var newFlags = 0;
  for (var k in NODEFS.flagsForNodeMap) {
   if (flags & k) {
    newFlags |= NODEFS.flagsForNodeMap[k];
    flags ^= k;
   }
  }
  if (!flags) {
   return newFlags;
  } else {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
 }),
 node_ops: {
  getattr: (function(node) {
   var path = NODEFS.realPath(node);
   var stat;
   try {
    stat = fs.lstatSync(path);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
   if (NODEFS.isWindows && !stat.blksize) {
    stat.blksize = 4096;
   }
   if (NODEFS.isWindows && !stat.blocks) {
    stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0;
   }
   return {
    dev: stat.dev,
    ino: stat.ino,
    mode: stat.mode,
    nlink: stat.nlink,
    uid: stat.uid,
    gid: stat.gid,
    rdev: stat.rdev,
    size: stat.size,
    atime: stat.atime,
    mtime: stat.mtime,
    ctime: stat.ctime,
    blksize: stat.blksize,
    blocks: stat.blocks
   };
  }),
  setattr: (function(node, attr) {
   var path = NODEFS.realPath(node);
   try {
    if (attr.mode !== undefined) {
     fs.chmodSync(path, attr.mode);
     node.mode = attr.mode;
    }
    if (attr.timestamp !== undefined) {
     var date = new Date(attr.timestamp);
     fs.utimesSync(path, date, date);
    }
    if (attr.size !== undefined) {
     fs.truncateSync(path, attr.size);
    }
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  lookup: (function(parent, name) {
   var path = PATH.join2(NODEFS.realPath(parent), name);
   var mode = NODEFS.getMode(path);
   return NODEFS.createNode(parent, name, mode);
  }),
  mknod: (function(parent, name, mode, dev) {
   var node = NODEFS.createNode(parent, name, mode, dev);
   var path = NODEFS.realPath(node);
   try {
    if (FS.isDir(node.mode)) {
     fs.mkdirSync(path, node.mode);
    } else {
     fs.writeFileSync(path, "", {
      mode: node.mode
     });
    }
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
   return node;
  }),
  rename: (function(oldNode, newDir, newName) {
   var oldPath = NODEFS.realPath(oldNode);
   var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
   try {
    fs.renameSync(oldPath, newPath);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  unlink: (function(parent, name) {
   var path = PATH.join2(NODEFS.realPath(parent), name);
   try {
    fs.unlinkSync(path);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  rmdir: (function(parent, name) {
   var path = PATH.join2(NODEFS.realPath(parent), name);
   try {
    fs.rmdirSync(path);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  readdir: (function(node) {
   var path = NODEFS.realPath(node);
   try {
    return fs.readdirSync(path);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  symlink: (function(parent, newName, oldPath) {
   var newPath = PATH.join2(NODEFS.realPath(parent), newName);
   try {
    fs.symlinkSync(oldPath, newPath);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  readlink: (function(node) {
   var path = NODEFS.realPath(node);
   try {
    path = fs.readlinkSync(path);
    path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
    return path;
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  })
 },
 stream_ops: {
  open: (function(stream) {
   var path = NODEFS.realPath(stream.node);
   try {
    if (FS.isFile(stream.node.mode)) {
     stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags));
    }
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  close: (function(stream) {
   try {
    if (FS.isFile(stream.node.mode) && stream.nfd) {
     fs.closeSync(stream.nfd);
    }
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  read: (function(stream, buffer, offset, length, position) {
   if (length === 0) return 0;
   try {
    return fs.readSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position);
   } catch (e) {
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  write: (function(stream, buffer, offset, length, position) {
   try {
    return fs.writeSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position);
   } catch (e) {
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  llseek: (function(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     try {
      var stat = fs.fstatSync(stream.nfd);
      position += stat.size;
     } catch (e) {
      throw new FS.ErrnoError(ERRNO_CODES[e.code]);
     }
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   return position;
  })
 }
};
var WORKERFS = {
 DIR_MODE: 16895,
 FILE_MODE: 33279,
 reader: null,
 mount: (function(mount) {
  assert(ENVIRONMENT_IS_WORKER);
  if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync;
  var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
  var createdParents = {};
  function ensureParent(path) {
   var parts = path.split("/");
   var parent = root;
   for (var i = 0; i < parts.length - 1; i++) {
    var curr = parts.slice(0, i + 1).join("/");
    if (!createdParents[curr]) {
     createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0);
    }
    parent = createdParents[curr];
   }
   return parent;
  }
  function base(path) {
   var parts = path.split("/");
   return parts[parts.length - 1];
  }
  Array.prototype.forEach.call(mount.opts["files"] || [], (function(file) {
   WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate);
  }));
  (mount.opts["blobs"] || []).forEach((function(obj) {
   WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"]);
  }));
  (mount.opts["packages"] || []).forEach((function(pack) {
   pack["metadata"].files.forEach((function(file) {
    var name = file.filename.substr(1);
    WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end));
   }));
  }));
  return root;
 }),
 createNode: (function(parent, name, mode, dev, contents, mtime) {
  var node = FS.createNode(parent, name, mode);
  node.mode = mode;
  node.node_ops = WORKERFS.node_ops;
  node.stream_ops = WORKERFS.stream_ops;
  node.timestamp = (mtime || new Date).getTime();
  assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
  if (mode === WORKERFS.FILE_MODE) {
   node.size = contents.size;
   node.contents = contents;
  } else {
   node.size = 4096;
   node.contents = {};
  }
  if (parent) {
   parent.contents[name] = node;
  }
  return node;
 }),
 node_ops: {
  getattr: (function(node) {
   return {
    dev: 1,
    ino: undefined,
    mode: node.mode,
    nlink: 1,
    uid: 0,
    gid: 0,
    rdev: undefined,
    size: node.size,
    atime: new Date(node.timestamp),
    mtime: new Date(node.timestamp),
    ctime: new Date(node.timestamp),
    blksize: 4096,
    blocks: Math.ceil(node.size / 4096)
   };
  }),
  setattr: (function(node, attr) {
   if (attr.mode !== undefined) {
    node.mode = attr.mode;
   }
   if (attr.timestamp !== undefined) {
    node.timestamp = attr.timestamp;
   }
  }),
  lookup: (function(parent, name) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }),
  mknod: (function(parent, name, mode, dev) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  rename: (function(oldNode, newDir, newName) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  unlink: (function(parent, name) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  rmdir: (function(parent, name) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  readdir: (function(node) {
   var entries = [ ".", ".." ];
   for (var key in node.contents) {
    if (!node.contents.hasOwnProperty(key)) {
     continue;
    }
    entries.push(key);
   }
   return entries;
  }),
  symlink: (function(parent, newName, oldPath) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  readlink: (function(node) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  })
 },
 stream_ops: {
  read: (function(stream, buffer, offset, length, position) {
   if (position >= stream.node.size) return 0;
   var chunk = stream.node.contents.slice(position, position + length);
   var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
   buffer.set(new Uint8Array(ab), offset);
   return chunk.size;
  }),
  write: (function(stream, buffer, offset, length, position) {
   throw new FS.ErrnoError(ERRNO_CODES.EIO);
  }),
  llseek: (function(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     position += stream.node.size;
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   return position;
  })
 }
};
STATICTOP += 16;
STATICTOP += 16;
STATICTOP += 16;
var FS = {
 root: null,
 mounts: [],
 devices: {},
 streams: [],
 nextInode: 1,
 nameTable: null,
 currentPath: "/",
 initialized: false,
 ignorePermissions: true,
 trackingDelegate: {},
 tracking: {
  openFlags: {
   READ: 1,
   WRITE: 2
  }
 },
 ErrnoError: null,
 genericErrors: {},
 filesystems: null,
 syncFSRequests: 0,
 handleFSError: (function(e) {
  if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
  return ___setErrNo(e.errno);
 }),
 lookupPath: (function(path, opts) {
  path = PATH.resolve(FS.cwd(), path);
  opts = opts || {};
  if (!path) return {
   path: "",
   node: null
  };
  var defaults = {
   follow_mount: true,
   recurse_count: 0
  };
  for (var key in defaults) {
   if (opts[key] === undefined) {
    opts[key] = defaults[key];
   }
  }
  if (opts.recurse_count > 8) {
   throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
  }
  var parts = PATH.normalizeArray(path.split("/").filter((function(p) {
   return !!p;
  })), false);
  var current = FS.root;
  var current_path = "/";
  for (var i = 0; i < parts.length; i++) {
   var islast = i === parts.length - 1;
   if (islast && opts.parent) {
    break;
   }
   current = FS.lookupNode(current, parts[i]);
   current_path = PATH.join2(current_path, parts[i]);
   if (FS.isMountpoint(current)) {
    if (!islast || islast && opts.follow_mount) {
     current = current.mounted.root;
    }
   }
   if (!islast || opts.follow) {
    var count = 0;
    while (FS.isLink(current.mode)) {
     var link = FS.readlink(current_path);
     current_path = PATH.resolve(PATH.dirname(current_path), link);
     var lookup = FS.lookupPath(current_path, {
      recurse_count: opts.recurse_count
     });
     current = lookup.node;
     if (count++ > 40) {
      throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
     }
    }
   }
  }
  return {
   path: current_path,
   node: current
  };
 }),
 getPath: (function(node) {
  var path;
  while (true) {
   if (FS.isRoot(node)) {
    var mount = node.mount.mountpoint;
    if (!path) return mount;
    return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
   }
   path = path ? node.name + "/" + path : node.name;
   node = node.parent;
  }
 }),
 hashName: (function(parentid, name) {
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
   hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
  }
  return (parentid + hash >>> 0) % FS.nameTable.length;
 }),
 hashAddNode: (function(node) {
  var hash = FS.hashName(node.parent.id, node.name);
  node.name_next = FS.nameTable[hash];
  FS.nameTable[hash] = node;
 }),
 hashRemoveNode: (function(node) {
  var hash = FS.hashName(node.parent.id, node.name);
  if (FS.nameTable[hash] === node) {
   FS.nameTable[hash] = node.name_next;
  } else {
   var current = FS.nameTable[hash];
   while (current) {
    if (current.name_next === node) {
     current.name_next = node.name_next;
     break;
    }
    current = current.name_next;
   }
  }
 }),
 lookupNode: (function(parent, name) {
  var err = FS.mayLookup(parent);
  if (err) {
   throw new FS.ErrnoError(err, parent);
  }
  var hash = FS.hashName(parent.id, name);
  for (var node = FS.nameTable[hash]; node; node = node.name_next) {
   var nodeName = node.name;
   if (node.parent.id === parent.id && nodeName === name) {
    return node;
   }
  }
  return FS.lookup(parent, name);
 }),
 createNode: (function(parent, name, mode, rdev) {
  if (!FS.FSNode) {
   FS.FSNode = (function(parent, name, mode, rdev) {
    if (!parent) {
     parent = this;
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
   });
   FS.FSNode.prototype = {};
   var readMode = 292 | 73;
   var writeMode = 146;
   Object.defineProperties(FS.FSNode.prototype, {
    read: {
     get: (function() {
      return (this.mode & readMode) === readMode;
     }),
     set: (function(val) {
      val ? this.mode |= readMode : this.mode &= ~readMode;
     })
    },
    write: {
     get: (function() {
      return (this.mode & writeMode) === writeMode;
     }),
     set: (function(val) {
      val ? this.mode |= writeMode : this.mode &= ~writeMode;
     })
    },
    isFolder: {
     get: (function() {
      return FS.isDir(this.mode);
     })
    },
    isDevice: {
     get: (function() {
      return FS.isChrdev(this.mode);
     })
    }
   });
  }
  var node = new FS.FSNode(parent, name, mode, rdev);
  FS.hashAddNode(node);
  return node;
 }),
 destroyNode: (function(node) {
  FS.hashRemoveNode(node);
 }),
 isRoot: (function(node) {
  return node === node.parent;
 }),
 isMountpoint: (function(node) {
  return !!node.mounted;
 }),
 isFile: (function(mode) {
  return (mode & 61440) === 32768;
 }),
 isDir: (function(mode) {
  return (mode & 61440) === 16384;
 }),
 isLink: (function(mode) {
  return (mode & 61440) === 40960;
 }),
 isChrdev: (function(mode) {
  return (mode & 61440) === 8192;
 }),
 isBlkdev: (function(mode) {
  return (mode & 61440) === 24576;
 }),
 isFIFO: (function(mode) {
  return (mode & 61440) === 4096;
 }),
 isSocket: (function(mode) {
  return (mode & 49152) === 49152;
 }),
 flagModes: {
  "r": 0,
  "rs": 1052672,
  "r+": 2,
  "w": 577,
  "wx": 705,
  "xw": 705,
  "w+": 578,
  "wx+": 706,
  "xw+": 706,
  "a": 1089,
  "ax": 1217,
  "xa": 1217,
  "a+": 1090,
  "ax+": 1218,
  "xa+": 1218
 },
 modeStringToFlags: (function(str) {
  var flags = FS.flagModes[str];
  if (typeof flags === "undefined") {
   throw new Error("Unknown file open mode: " + str);
  }
  return flags;
 }),
 flagsToPermissionString: (function(flag) {
  var perms = [ "r", "w", "rw" ][flag & 3];
  if (flag & 512) {
   perms += "w";
  }
  return perms;
 }),
 nodePermissions: (function(node, perms) {
  if (FS.ignorePermissions) {
   return 0;
  }
  if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
   return ERRNO_CODES.EACCES;
  } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
   return ERRNO_CODES.EACCES;
  } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
   return ERRNO_CODES.EACCES;
  }
  return 0;
 }),
 mayLookup: (function(dir) {
  var err = FS.nodePermissions(dir, "x");
  if (err) return err;
  if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
  return 0;
 }),
 mayCreate: (function(dir, name) {
  try {
   var node = FS.lookupNode(dir, name);
   return ERRNO_CODES.EEXIST;
  } catch (e) {}
  return FS.nodePermissions(dir, "wx");
 }),
 mayDelete: (function(dir, name, isdir) {
  var node;
  try {
   node = FS.lookupNode(dir, name);
  } catch (e) {
   return e.errno;
  }
  var err = FS.nodePermissions(dir, "wx");
  if (err) {
   return err;
  }
  if (isdir) {
   if (!FS.isDir(node.mode)) {
    return ERRNO_CODES.ENOTDIR;
   }
   if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
    return ERRNO_CODES.EBUSY;
   }
  } else {
   if (FS.isDir(node.mode)) {
    return ERRNO_CODES.EISDIR;
   }
  }
  return 0;
 }),
 mayOpen: (function(node, flags) {
  if (!node) {
   return ERRNO_CODES.ENOENT;
  }
  if (FS.isLink(node.mode)) {
   return ERRNO_CODES.ELOOP;
  } else if (FS.isDir(node.mode)) {
   if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
    return ERRNO_CODES.EISDIR;
   }
  }
  return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
 }),
 MAX_OPEN_FDS: 4096,
 nextfd: (function(fd_start, fd_end) {
  fd_start = fd_start || 0;
  fd_end = fd_end || FS.MAX_OPEN_FDS;
  for (var fd = fd_start; fd <= fd_end; fd++) {
   if (!FS.streams[fd]) {
    return fd;
   }
  }
  throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
 }),
 getStream: (function(fd) {
  return FS.streams[fd];
 }),
 createStream: (function(stream, fd_start, fd_end) {
  if (!FS.FSStream) {
   FS.FSStream = (function() {});
   FS.FSStream.prototype = {};
   Object.defineProperties(FS.FSStream.prototype, {
    object: {
     get: (function() {
      return this.node;
     }),
     set: (function(val) {
      this.node = val;
     })
    },
    isRead: {
     get: (function() {
      return (this.flags & 2097155) !== 1;
     })
    },
    isWrite: {
     get: (function() {
      return (this.flags & 2097155) !== 0;
     })
    },
    isAppend: {
     get: (function() {
      return this.flags & 1024;
     })
    }
   });
  }
  var newStream = new FS.FSStream;
  for (var p in stream) {
   newStream[p] = stream[p];
  }
  stream = newStream;
  var fd = FS.nextfd(fd_start, fd_end);
  stream.fd = fd;
  FS.streams[fd] = stream;
  return stream;
 }),
 closeStream: (function(fd) {
  FS.streams[fd] = null;
 }),
 chrdev_stream_ops: {
  open: (function(stream) {
   var device = FS.getDevice(stream.node.rdev);
   stream.stream_ops = device.stream_ops;
   if (stream.stream_ops.open) {
    stream.stream_ops.open(stream);
   }
  }),
  llseek: (function() {
   throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
  })
 },
 major: (function(dev) {
  return dev >> 8;
 }),
 minor: (function(dev) {
  return dev & 255;
 }),
 makedev: (function(ma, mi) {
  return ma << 8 | mi;
 }),
 registerDevice: (function(dev, ops) {
  FS.devices[dev] = {
   stream_ops: ops
  };
 }),
 getDevice: (function(dev) {
  return FS.devices[dev];
 }),
 getMounts: (function(mount) {
  var mounts = [];
  var check = [ mount ];
  while (check.length) {
   var m = check.pop();
   mounts.push(m);
   check.push.apply(check, m.mounts);
  }
  return mounts;
 }),
 syncfs: (function(populate, callback) {
  if (typeof populate === "function") {
   callback = populate;
   populate = false;
  }
  FS.syncFSRequests++;
  if (FS.syncFSRequests > 1) {
   console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
  }
  var mounts = FS.getMounts(FS.root.mount);
  var completed = 0;
  function doCallback(err) {
   assert(FS.syncFSRequests > 0);
   FS.syncFSRequests--;
   return callback(err);
  }
  function done(err) {
   if (err) {
    if (!done.errored) {
     done.errored = true;
     return doCallback(err);
    }
    return;
   }
   if (++completed >= mounts.length) {
    doCallback(null);
   }
  }
  mounts.forEach((function(mount) {
   if (!mount.type.syncfs) {
    return done(null);
   }
   mount.type.syncfs(mount, populate, done);
  }));
 }),
 mount: (function(type, opts, mountpoint) {
  var root = mountpoint === "/";
  var pseudo = !mountpoint;
  var node;
  if (root && FS.root) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  } else if (!root && !pseudo) {
   var lookup = FS.lookupPath(mountpoint, {
    follow_mount: false
   });
   mountpoint = lookup.path;
   node = lookup.node;
   if (FS.isMountpoint(node)) {
    throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
   }
   if (!FS.isDir(node.mode)) {
    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
   }
  }
  var mount = {
   type: type,
   opts: opts,
   mountpoint: mountpoint,
   mounts: []
  };
  var mountRoot = type.mount(mount);
  mountRoot.mount = mount;
  mount.root = mountRoot;
  if (root) {
   FS.root = mountRoot;
  } else if (node) {
   node.mounted = mount;
   if (node.mount) {
    node.mount.mounts.push(mount);
   }
  }
  return mountRoot;
 }),
 unmount: (function(mountpoint) {
  var lookup = FS.lookupPath(mountpoint, {
   follow_mount: false
  });
  if (!FS.isMountpoint(lookup.node)) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var node = lookup.node;
  var mount = node.mounted;
  var mounts = FS.getMounts(mount);
  Object.keys(FS.nameTable).forEach((function(hash) {
   var current = FS.nameTable[hash];
   while (current) {
    var next = current.name_next;
    if (mounts.indexOf(current.mount) !== -1) {
     FS.destroyNode(current);
    }
    current = next;
   }
  }));
  node.mounted = null;
  var idx = node.mount.mounts.indexOf(mount);
  assert(idx !== -1);
  node.mount.mounts.splice(idx, 1);
 }),
 lookup: (function(parent, name) {
  return parent.node_ops.lookup(parent, name);
 }),
 mknod: (function(path, mode, dev) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  if (!name || name === "." || name === "..") {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var err = FS.mayCreate(parent, name);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!parent.node_ops.mknod) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  return parent.node_ops.mknod(parent, name, mode, dev);
 }),
 create: (function(path, mode) {
  mode = mode !== undefined ? mode : 438;
  mode &= 4095;
  mode |= 32768;
  return FS.mknod(path, mode, 0);
 }),
 mkdir: (function(path, mode) {
  mode = mode !== undefined ? mode : 511;
  mode &= 511 | 512;
  mode |= 16384;
  return FS.mknod(path, mode, 0);
 }),
 mkdirTree: (function(path, mode) {
  var dirs = path.split("/");
  var d = "";
  for (var i = 0; i < dirs.length; ++i) {
   if (!dirs[i]) continue;
   d += "/" + dirs[i];
   try {
    FS.mkdir(d, mode);
   } catch (e) {
    if (e.errno != ERRNO_CODES.EEXIST) throw e;
   }
  }
 }),
 mkdev: (function(path, mode, dev) {
  if (typeof dev === "undefined") {
   dev = mode;
   mode = 438;
  }
  mode |= 8192;
  return FS.mknod(path, mode, dev);
 }),
 symlink: (function(oldpath, newpath) {
  if (!PATH.resolve(oldpath)) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  var lookup = FS.lookupPath(newpath, {
   parent: true
  });
  var parent = lookup.node;
  if (!parent) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  var newname = PATH.basename(newpath);
  var err = FS.mayCreate(parent, newname);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!parent.node_ops.symlink) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  return parent.node_ops.symlink(parent, newname, oldpath);
 }),
 rename: (function(old_path, new_path) {
  var old_dirname = PATH.dirname(old_path);
  var new_dirname = PATH.dirname(new_path);
  var old_name = PATH.basename(old_path);
  var new_name = PATH.basename(new_path);
  var lookup, old_dir, new_dir;
  try {
   lookup = FS.lookupPath(old_path, {
    parent: true
   });
   old_dir = lookup.node;
   lookup = FS.lookupPath(new_path, {
    parent: true
   });
   new_dir = lookup.node;
  } catch (e) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  }
  if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  if (old_dir.mount !== new_dir.mount) {
   throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
  }
  var old_node = FS.lookupNode(old_dir, old_name);
  var relative = PATH.relative(old_path, new_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  relative = PATH.relative(new_path, old_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
  }
  var new_node;
  try {
   new_node = FS.lookupNode(new_dir, new_name);
  } catch (e) {}
  if (old_node === new_node) {
   return;
  }
  var isdir = FS.isDir(old_node.mode);
  var err = FS.mayDelete(old_dir, old_name, isdir);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!old_dir.node_ops.rename) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  }
  if (new_dir !== old_dir) {
   err = FS.nodePermissions(old_dir, "w");
   if (err) {
    throw new FS.ErrnoError(err);
   }
  }
  try {
   if (FS.trackingDelegate["willMovePath"]) {
    FS.trackingDelegate["willMovePath"](old_path, new_path);
   }
  } catch (e) {
   console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
  }
  FS.hashRemoveNode(old_node);
  try {
   old_dir.node_ops.rename(old_node, new_dir, new_name);
  } catch (e) {
   throw e;
  } finally {
   FS.hashAddNode(old_node);
  }
  try {
   if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path);
  } catch (e) {
   console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
  }
 }),
 rmdir: (function(path) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var err = FS.mayDelete(parent, name, true);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!parent.node_ops.rmdir) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  }
  try {
   if (FS.trackingDelegate["willDeletePath"]) {
    FS.trackingDelegate["willDeletePath"](path);
   }
  } catch (e) {
   console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
  }
  parent.node_ops.rmdir(parent, name);
  FS.destroyNode(node);
  try {
   if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
  } catch (e) {
   console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
  }
 }),
 readdir: (function(path) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  if (!node.node_ops.readdir) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
  }
  return node.node_ops.readdir(node);
 }),
 unlink: (function(path) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var err = FS.mayDelete(parent, name, false);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!parent.node_ops.unlink) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  }
  try {
   if (FS.trackingDelegate["willDeletePath"]) {
    FS.trackingDelegate["willDeletePath"](path);
   }
  } catch (e) {
   console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
  }
  parent.node_ops.unlink(parent, name);
  FS.destroyNode(node);
  try {
   if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
  } catch (e) {
   console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
  }
 }),
 readlink: (function(path) {
  var lookup = FS.lookupPath(path);
  var link = lookup.node;
  if (!link) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  if (!link.node_ops.readlink) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
 }),
 stat: (function(path, dontFollow) {
  var lookup = FS.lookupPath(path, {
   follow: !dontFollow
  });
  var node = lookup.node;
  if (!node) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  if (!node.node_ops.getattr) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  return node.node_ops.getattr(node);
 }),
 lstat: (function(path) {
  return FS.stat(path, true);
 }),
 chmod: (function(path, mode, dontFollow) {
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  node.node_ops.setattr(node, {
   mode: mode & 4095 | node.mode & ~4095,
   timestamp: Date.now()
  });
 }),
 lchmod: (function(path, mode) {
  FS.chmod(path, mode, true);
 }),
 fchmod: (function(fd, mode) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  FS.chmod(stream.node, mode);
 }),
 chown: (function(path, uid, gid, dontFollow) {
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  node.node_ops.setattr(node, {
   timestamp: Date.now()
  });
 }),
 lchown: (function(path, uid, gid) {
  FS.chown(path, uid, gid, true);
 }),
 fchown: (function(fd, uid, gid) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  FS.chown(stream.node, uid, gid);
 }),
 truncate: (function(path, len) {
  if (len < 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: true
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (FS.isDir(node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
  }
  if (!FS.isFile(node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var err = FS.nodePermissions(node, "w");
  if (err) {
   throw new FS.ErrnoError(err);
  }
  node.node_ops.setattr(node, {
   size: len,
   timestamp: Date.now()
  });
 }),
 ftruncate: (function(fd, len) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  FS.truncate(stream.node, len);
 }),
 utime: (function(path, atime, mtime) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  node.node_ops.setattr(node, {
   timestamp: Math.max(atime, mtime)
  });
 }),
 open: (function(path, flags, mode, fd_start, fd_end) {
  if (path === "") {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
  mode = typeof mode === "undefined" ? 438 : mode;
  if (flags & 64) {
   mode = mode & 4095 | 32768;
  } else {
   mode = 0;
  }
  var node;
  if (typeof path === "object") {
   node = path;
  } else {
   path = PATH.normalize(path);
   try {
    var lookup = FS.lookupPath(path, {
     follow: !(flags & 131072)
    });
    node = lookup.node;
   } catch (e) {}
  }
  var created = false;
  if (flags & 64) {
   if (node) {
    if (flags & 128) {
     throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
    }
   } else {
    node = FS.mknod(path, mode, 0);
    created = true;
   }
  }
  if (!node) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  if (FS.isChrdev(node.mode)) {
   flags &= ~512;
  }
  if (flags & 65536 && !FS.isDir(node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
  }
  if (!created) {
   var err = FS.mayOpen(node, flags);
   if (err) {
    throw new FS.ErrnoError(err);
   }
  }
  if (flags & 512) {
   FS.truncate(node, 0);
  }
  flags &= ~(128 | 512);
  var stream = FS.createStream({
   node: node,
   path: FS.getPath(node),
   flags: flags,
   seekable: true,
   position: 0,
   stream_ops: node.stream_ops,
   ungotten: [],
   error: false
  }, fd_start, fd_end);
  if (stream.stream_ops.open) {
   stream.stream_ops.open(stream);
  }
  if (Module["logReadFiles"] && !(flags & 1)) {
   if (!FS.readFiles) FS.readFiles = {};
   if (!(path in FS.readFiles)) {
    FS.readFiles[path] = 1;
    Module["printErr"]("read file: " + path);
   }
  }
  try {
   if (FS.trackingDelegate["onOpenFile"]) {
    var trackingFlags = 0;
    if ((flags & 2097155) !== 1) {
     trackingFlags |= FS.tracking.openFlags.READ;
    }
    if ((flags & 2097155) !== 0) {
     trackingFlags |= FS.tracking.openFlags.WRITE;
    }
    FS.trackingDelegate["onOpenFile"](path, trackingFlags);
   }
  } catch (e) {
   console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message);
  }
  return stream;
 }),
 close: (function(stream) {
  if (stream.getdents) stream.getdents = null;
  try {
   if (stream.stream_ops.close) {
    stream.stream_ops.close(stream);
   }
  } catch (e) {
   throw e;
  } finally {
   FS.closeStream(stream.fd);
  }
 }),
 llseek: (function(stream, offset, whence) {
  if (!stream.seekable || !stream.stream_ops.llseek) {
   throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
  }
  stream.position = stream.stream_ops.llseek(stream, offset, whence);
  stream.ungotten = [];
  return stream.position;
 }),
 read: (function(stream, buffer, offset, length, position) {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
  }
  if (!stream.stream_ops.read) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var seeking = typeof position !== "undefined";
  if (!seeking) {
   position = stream.position;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
  }
  var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
  if (!seeking) stream.position += bytesRead;
  return bytesRead;
 }),
 write: (function(stream, buffer, offset, length, position, canOwn) {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
  }
  if (!stream.stream_ops.write) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  if (stream.flags & 1024) {
   FS.llseek(stream, 0, 2);
  }
  var seeking = typeof position !== "undefined";
  if (!seeking) {
   position = stream.position;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
  }
  var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
  if (!seeking) stream.position += bytesWritten;
  try {
   if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path);
  } catch (e) {
   console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + e.message);
  }
  return bytesWritten;
 }),
 allocate: (function(stream, offset, length) {
  if (offset < 0 || length <= 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
  }
  if (!stream.stream_ops.allocate) {
   throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
  }
  stream.stream_ops.allocate(stream, offset, length);
 }),
 mmap: (function(stream, buffer, offset, length, position, prot, flags) {
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(ERRNO_CODES.EACCES);
  }
  if (!stream.stream_ops.mmap) {
   throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
  }
  return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
 }),
 msync: (function(stream, buffer, offset, length, mmapFlags) {
  if (!stream || !stream.stream_ops.msync) {
   return 0;
  }
  return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
 }),
 munmap: (function(stream) {
  return 0;
 }),
 ioctl: (function(stream, cmd, arg) {
  if (!stream.stream_ops.ioctl) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
  }
  return stream.stream_ops.ioctl(stream, cmd, arg);
 }),
 readFile: (function(path, opts) {
  opts = opts || {};
  opts.flags = opts.flags || "r";
  opts.encoding = opts.encoding || "binary";
  if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
   throw new Error('Invalid encoding type "' + opts.encoding + '"');
  }
  var ret;
  var stream = FS.open(path, opts.flags);
  var stat = FS.stat(path);
  var length = stat.size;
  var buf = new Uint8Array(length);
  FS.read(stream, buf, 0, length, 0);
  if (opts.encoding === "utf8") {
   ret = UTF8ArrayToString(buf, 0);
  } else if (opts.encoding === "binary") {
   ret = buf;
  }
  FS.close(stream);
  return ret;
 }),
 writeFile: (function(path, data, opts) {
  opts = opts || {};
  opts.flags = opts.flags || "w";
  var stream = FS.open(path, opts.flags, opts.mode);
  if (typeof data === "string") {
   var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
   var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
   FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
  } else if (ArrayBuffer.isView(data)) {
   FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
  } else {
   throw new Error("Unsupported data type");
  }
  FS.close(stream);
 }),
 cwd: (function() {
  return FS.currentPath;
 }),
 chdir: (function(path) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  if (lookup.node === null) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  if (!FS.isDir(lookup.node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
  }
  var err = FS.nodePermissions(lookup.node, "x");
  if (err) {
   throw new FS.ErrnoError(err);
  }
  FS.currentPath = lookup.path;
 }),
 createDefaultDirectories: (function() {
  FS.mkdir("/tmp");
  FS.mkdir("/home");
  FS.mkdir("/home/web_user");
 }),
 createDefaultDevices: (function() {
  FS.mkdir("/dev");
  FS.registerDevice(FS.makedev(1, 3), {
   read: (function() {
    return 0;
   }),
   write: (function(stream, buffer, offset, length, pos) {
    return length;
   })
  });
  FS.mkdev("/dev/null", FS.makedev(1, 3));
  TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
  TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
  FS.mkdev("/dev/tty", FS.makedev(5, 0));
  FS.mkdev("/dev/tty1", FS.makedev(6, 0));
  var random_device;
  if (typeof crypto !== "undefined") {
   var randomBuffer = new Uint8Array(1);
   random_device = (function() {
    crypto.getRandomValues(randomBuffer);
    return randomBuffer[0];
   });
  } else if (ENVIRONMENT_IS_NODE) {
   random_device = (function() {
    return require("crypto")["randomBytes"](1)[0];
   });
  } else {
   random_device = (function() {
    return Math.random() * 256 | 0;
   });
  }
  FS.createDevice("/dev", "random", random_device);
  FS.createDevice("/dev", "urandom", random_device);
  FS.mkdir("/dev/shm");
  FS.mkdir("/dev/shm/tmp");
 }),
 createSpecialDirectories: (function() {
  FS.mkdir("/proc");
  FS.mkdir("/proc/self");
  FS.mkdir("/proc/self/fd");
  FS.mount({
   mount: (function() {
    var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
    node.node_ops = {
     lookup: (function(parent, name) {
      var fd = +name;
      var stream = FS.getStream(fd);
      if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
      var ret = {
       parent: null,
       mount: {
        mountpoint: "fake"
       },
       node_ops: {
        readlink: (function() {
         return stream.path;
        })
       }
      };
      ret.parent = ret;
      return ret;
     })
    };
    return node;
   })
  }, {}, "/proc/self/fd");
 }),
 createStandardStreams: (function() {
  if (Module["stdin"]) {
   FS.createDevice("/dev", "stdin", Module["stdin"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdin");
  }
  if (Module["stdout"]) {
   FS.createDevice("/dev", "stdout", null, Module["stdout"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdout");
  }
  if (Module["stderr"]) {
   FS.createDevice("/dev", "stderr", null, Module["stderr"]);
  } else {
   FS.symlink("/dev/tty1", "/dev/stderr");
  }
  var stdin = FS.open("/dev/stdin", "r");
  assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
  var stdout = FS.open("/dev/stdout", "w");
  assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
  var stderr = FS.open("/dev/stderr", "w");
  assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")");
 }),
 ensureErrnoError: (function() {
  if (FS.ErrnoError) return;
  FS.ErrnoError = function ErrnoError(errno, node) {
   this.node = node;
   this.setErrno = (function(errno) {
    this.errno = errno;
    for (var key in ERRNO_CODES) {
     if (ERRNO_CODES[key] === errno) {
      this.code = key;
      break;
     }
    }
   });
   this.setErrno(errno);
   this.message = ERRNO_MESSAGES[errno];
   if (this.stack) Object.defineProperty(this, "stack", {
    value: (new Error).stack,
    writable: true
   });
  };
  FS.ErrnoError.prototype = new Error;
  FS.ErrnoError.prototype.constructor = FS.ErrnoError;
  [ ERRNO_CODES.ENOENT ].forEach((function(code) {
   FS.genericErrors[code] = new FS.ErrnoError(code);
   FS.genericErrors[code].stack = "<generic error, no stack>";
  }));
 }),
 staticInit: (function() {
  FS.ensureErrnoError();
  FS.nameTable = new Array(4096);
  FS.mount(MEMFS, {}, "/");
  FS.createDefaultDirectories();
  FS.createDefaultDevices();
  FS.createSpecialDirectories();
  FS.filesystems = {
   "MEMFS": MEMFS,
   "IDBFS": IDBFS,
   "NODEFS": NODEFS,
   "WORKERFS": WORKERFS
  };
 }),
 init: (function(input, output, error) {
  assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
  FS.init.initialized = true;
  FS.ensureErrnoError();
  Module["stdin"] = input || Module["stdin"];
  Module["stdout"] = output || Module["stdout"];
  Module["stderr"] = error || Module["stderr"];
  FS.createStandardStreams();
 }),
 quit: (function() {
  FS.init.initialized = false;
  var fflush = Module["_fflush"];
  if (fflush) fflush(0);
  for (var i = 0; i < FS.streams.length; i++) {
   var stream = FS.streams[i];
   if (!stream) {
    continue;
   }
   FS.close(stream);
  }
 }),
 getMode: (function(canRead, canWrite) {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
 }),
 joinPath: (function(parts, forceRelative) {
  var path = PATH.join.apply(null, parts);
  if (forceRelative && path[0] == "/") path = path.substr(1);
  return path;
 }),
 absolutePath: (function(relative, base) {
  return PATH.resolve(base, relative);
 }),
 standardizePath: (function(path) {
  return PATH.normalize(path);
 }),
 findObject: (function(path, dontResolveLastLink) {
  var ret = FS.analyzePath(path, dontResolveLastLink);
  if (ret.exists) {
   return ret.object;
  } else {
   ___setErrNo(ret.error);
   return null;
  }
 }),
 analyzePath: (function(path, dontResolveLastLink) {
  try {
   var lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   path = lookup.path;
  } catch (e) {}
  var ret = {
   isRoot: false,
   exists: false,
   error: 0,
   name: null,
   path: null,
   object: null,
   parentExists: false,
   parentPath: null,
   parentObject: null
  };
  try {
   var lookup = FS.lookupPath(path, {
    parent: true
   });
   ret.parentExists = true;
   ret.parentPath = lookup.path;
   ret.parentObject = lookup.node;
   ret.name = PATH.basename(path);
   lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   ret.exists = true;
   ret.path = lookup.path;
   ret.object = lookup.node;
   ret.name = lookup.node.name;
   ret.isRoot = lookup.path === "/";
  } catch (e) {
   ret.error = e.errno;
  }
  return ret;
 }),
 createFolder: (function(parent, name, canRead, canWrite) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(canRead, canWrite);
  return FS.mkdir(path, mode);
 }),
 createPath: (function(parent, path, canRead, canWrite) {
  parent = typeof parent === "string" ? parent : FS.getPath(parent);
  var parts = path.split("/").reverse();
  while (parts.length) {
   var part = parts.pop();
   if (!part) continue;
   var current = PATH.join2(parent, part);
   try {
    FS.mkdir(current);
   } catch (e) {}
   parent = current;
  }
  return current;
 }),
 createFile: (function(parent, name, properties, canRead, canWrite) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(canRead, canWrite);
  return FS.create(path, mode);
 }),
 createDataFile: (function(parent, name, data, canRead, canWrite, canOwn) {
  var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
  var mode = FS.getMode(canRead, canWrite);
  var node = FS.create(path, mode);
  if (data) {
   if (typeof data === "string") {
    var arr = new Array(data.length);
    for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
    data = arr;
   }
   FS.chmod(node, mode | 146);
   var stream = FS.open(node, "w");
   FS.write(stream, data, 0, data.length, 0, canOwn);
   FS.close(stream);
   FS.chmod(node, mode);
  }
  return node;
 }),
 createDevice: (function(parent, name, input, output) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(!!input, !!output);
  if (!FS.createDevice.major) FS.createDevice.major = 64;
  var dev = FS.makedev(FS.createDevice.major++, 0);
  FS.registerDevice(dev, {
   open: (function(stream) {
    stream.seekable = false;
   }),
   close: (function(stream) {
    if (output && output.buffer && output.buffer.length) {
     output(10);
    }
   }),
   read: (function(stream, buffer, offset, length, pos) {
    var bytesRead = 0;
    for (var i = 0; i < length; i++) {
     var result;
     try {
      result = input();
     } catch (e) {
      throw new FS.ErrnoError(ERRNO_CODES.EIO);
     }
     if (result === undefined && bytesRead === 0) {
      throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
     }
     if (result === null || result === undefined) break;
     bytesRead++;
     buffer[offset + i] = result;
    }
    if (bytesRead) {
     stream.node.timestamp = Date.now();
    }
    return bytesRead;
   }),
   write: (function(stream, buffer, offset, length, pos) {
    for (var i = 0; i < length; i++) {
     try {
      output(buffer[offset + i]);
     } catch (e) {
      throw new FS.ErrnoError(ERRNO_CODES.EIO);
     }
    }
    if (length) {
     stream.node.timestamp = Date.now();
    }
    return i;
   })
  });
  return FS.mkdev(path, mode, dev);
 }),
 createLink: (function(parent, name, target, canRead, canWrite) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  return FS.symlink(target, path);
 }),
 forceLoadFile: (function(obj) {
  if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
  var success = true;
  if (typeof XMLHttpRequest !== "undefined") {
   throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  } else if (Module["read"]) {
   try {
    obj.contents = intArrayFromString(Module["read"](obj.url), true);
    obj.usedBytes = obj.contents.length;
   } catch (e) {
    success = false;
   }
  } else {
   throw new Error("Cannot load without read() or XMLHttpRequest.");
  }
  if (!success) ___setErrNo(ERRNO_CODES.EIO);
  return success;
 }),
 createLazyFile: (function(parent, name, url, canRead, canWrite) {
  function LazyUint8Array() {
   this.lengthKnown = false;
   this.chunks = [];
  }
  LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
   if (idx > this.length - 1 || idx < 0) {
    return undefined;
   }
   var chunkOffset = idx % this.chunkSize;
   var chunkNum = idx / this.chunkSize | 0;
   return this.getter(chunkNum)[chunkOffset];
  };
  LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
   this.getter = getter;
  };
  LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
   var xhr = new XMLHttpRequest;
   xhr.open("HEAD", url, false);
   xhr.send(null);
   if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
   var datalength = Number(xhr.getResponseHeader("Content-length"));
   var header;
   var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
   var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
   var chunkSize = 1024 * 1024;
   if (!hasByteServing) chunkSize = datalength;
   var doXHR = (function(from, to) {
    if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
    if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
    if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
    if (xhr.overrideMimeType) {
     xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
    xhr.send(null);
    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
    if (xhr.response !== undefined) {
     return new Uint8Array(xhr.response || []);
    } else {
     return intArrayFromString(xhr.responseText || "", true);
    }
   });
   var lazyArray = this;
   lazyArray.setDataGetter((function(chunkNum) {
    var start = chunkNum * chunkSize;
    var end = (chunkNum + 1) * chunkSize - 1;
    end = Math.min(end, datalength - 1);
    if (typeof lazyArray.chunks[chunkNum] === "undefined") {
     lazyArray.chunks[chunkNum] = doXHR(start, end);
    }
    if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
    return lazyArray.chunks[chunkNum];
   }));
   if (usesGzip || !datalength) {
    chunkSize = datalength = 1;
    datalength = this.getter(0).length;
    chunkSize = datalength;
    console.log("LazyFiles on gzip forces download of the whole file when length is accessed");
   }
   this._length = datalength;
   this._chunkSize = chunkSize;
   this.lengthKnown = true;
  };
  if (typeof XMLHttpRequest !== "undefined") {
   if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
   var lazyArray = new LazyUint8Array;
   Object.defineProperties(lazyArray, {
    length: {
     get: (function() {
      if (!this.lengthKnown) {
       this.cacheLength();
      }
      return this._length;
     })
    },
    chunkSize: {
     get: (function() {
      if (!this.lengthKnown) {
       this.cacheLength();
      }
      return this._chunkSize;
     })
    }
   });
   var properties = {
    isDevice: false,
    contents: lazyArray
   };
  } else {
   var properties = {
    isDevice: false,
    url: url
   };
  }
  var node = FS.createFile(parent, name, properties, canRead, canWrite);
  if (properties.contents) {
   node.contents = properties.contents;
  } else if (properties.url) {
   node.contents = null;
   node.url = properties.url;
  }
  Object.defineProperties(node, {
   usedBytes: {
    get: (function() {
     return this.contents.length;
    })
   }
  });
  var stream_ops = {};
  var keys = Object.keys(node.stream_ops);
  keys.forEach((function(key) {
   var fn = node.stream_ops[key];
   stream_ops[key] = function forceLoadLazyFile() {
    if (!FS.forceLoadFile(node)) {
     throw new FS.ErrnoError(ERRNO_CODES.EIO);
    }
    return fn.apply(null, arguments);
   };
  }));
  stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
   if (!FS.forceLoadFile(node)) {
    throw new FS.ErrnoError(ERRNO_CODES.EIO);
   }
   var contents = stream.node.contents;
   if (position >= contents.length) return 0;
   var size = Math.min(contents.length - position, length);
   assert(size >= 0);
   if (contents.slice) {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents[position + i];
    }
   } else {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents.get(position + i);
    }
   }
   return size;
  };
  node.stream_ops = stream_ops;
  return node;
 }),
 createPreloadedFile: (function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
  Browser.init();
  var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency("cp " + fullname);
  function processData(byteArray) {
   function finish(byteArray) {
    if (preFinish) preFinish();
    if (!dontCreateFile) {
     FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
    if (onload) onload();
    removeRunDependency(dep);
   }
   var handled = false;
   Module["preloadPlugins"].forEach((function(plugin) {
    if (handled) return;
    if (plugin["canHandle"](fullname)) {
     plugin["handle"](byteArray, fullname, finish, (function() {
      if (onerror) onerror();
      removeRunDependency(dep);
     }));
     handled = true;
    }
   }));
   if (!handled) finish(byteArray);
  }
  addRunDependency(dep);
  if (typeof url == "string") {
   Browser.asyncLoad(url, (function(byteArray) {
    processData(byteArray);
   }), onerror);
  } else {
   processData(url);
  }
 }),
 indexedDB: (function() {
  return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 }),
 DB_NAME: (function() {
  return "EM_FS_" + window.location.pathname;
 }),
 DB_VERSION: 20,
 DB_STORE_NAME: "FILE_DATA",
 saveFilesToDB: (function(paths, onload, onerror) {
  onload = onload || (function() {});
  onerror = onerror || (function() {});
  var indexedDB = FS.indexedDB();
  try {
   var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
  } catch (e) {
   return onerror(e);
  }
  openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
   console.log("creating db");
   var db = openRequest.result;
   db.createObjectStore(FS.DB_STORE_NAME);
  };
  openRequest.onsuccess = function openRequest_onsuccess() {
   var db = openRequest.result;
   var transaction = db.transaction([ FS.DB_STORE_NAME ], "readwrite");
   var files = transaction.objectStore(FS.DB_STORE_NAME);
   var ok = 0, fail = 0, total = paths.length;
   function finish() {
    if (fail == 0) onload(); else onerror();
   }
   paths.forEach((function(path) {
    var putRequest = files.put(FS.analyzePath(path).object.contents, path);
    putRequest.onsuccess = function putRequest_onsuccess() {
     ok++;
     if (ok + fail == total) finish();
    };
    putRequest.onerror = function putRequest_onerror() {
     fail++;
     if (ok + fail == total) finish();
    };
   }));
   transaction.onerror = onerror;
  };
  openRequest.onerror = onerror;
 }),
 loadFilesFromDB: (function(paths, onload, onerror) {
  onload = onload || (function() {});
  onerror = onerror || (function() {});
  var indexedDB = FS.indexedDB();
  try {
   var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
  } catch (e) {
   return onerror(e);
  }
  openRequest.onupgradeneeded = onerror;
  openRequest.onsuccess = function openRequest_onsuccess() {
   var db = openRequest.result;
   try {
    var transaction = db.transaction([ FS.DB_STORE_NAME ], "readonly");
   } catch (e) {
    onerror(e);
    return;
   }
   var files = transaction.objectStore(FS.DB_STORE_NAME);
   var ok = 0, fail = 0, total = paths.length;
   function finish() {
    if (fail == 0) onload(); else onerror();
   }
   paths.forEach((function(path) {
    var getRequest = files.get(path);
    getRequest.onsuccess = function getRequest_onsuccess() {
     if (FS.analyzePath(path).exists) {
      FS.unlink(path);
     }
     FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
     ok++;
     if (ok + fail == total) finish();
    };
    getRequest.onerror = function getRequest_onerror() {
     fail++;
     if (ok + fail == total) finish();
    };
   }));
   transaction.onerror = onerror;
  };
  openRequest.onerror = onerror;
 })
};
var SYSCALLS = {
 DEFAULT_POLLMASK: 5,
 mappings: {},
 umask: 511,
 calculateAt: (function(dirfd, path) {
  if (path[0] !== "/") {
   var dir;
   if (dirfd === -100) {
    dir = FS.cwd();
   } else {
    var dirstream = FS.getStream(dirfd);
    if (!dirstream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
    dir = dirstream.path;
   }
   path = PATH.join2(dir, path);
  }
  return path;
 }),
 doStat: (function(func, path, buf) {
  try {
   var stat = func(path);
  } catch (e) {
   if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
    return -ERRNO_CODES.ENOTDIR;
   }
   throw e;
  }
  HEAP32[buf >> 2] = stat.dev;
  HEAP32[buf + 4 >> 2] = 0;
  HEAP32[buf + 8 >> 2] = stat.ino;
  HEAP32[buf + 12 >> 2] = stat.mode;
  HEAP32[buf + 16 >> 2] = stat.nlink;
  HEAP32[buf + 20 >> 2] = stat.uid;
  HEAP32[buf + 24 >> 2] = stat.gid;
  HEAP32[buf + 28 >> 2] = stat.rdev;
  HEAP32[buf + 32 >> 2] = 0;
  HEAP32[buf + 36 >> 2] = stat.size;
  HEAP32[buf + 40 >> 2] = 4096;
  HEAP32[buf + 44 >> 2] = stat.blocks;
  HEAP32[buf + 48 >> 2] = stat.atime.getTime() / 1e3 | 0;
  HEAP32[buf + 52 >> 2] = 0;
  HEAP32[buf + 56 >> 2] = stat.mtime.getTime() / 1e3 | 0;
  HEAP32[buf + 60 >> 2] = 0;
  HEAP32[buf + 64 >> 2] = stat.ctime.getTime() / 1e3 | 0;
  HEAP32[buf + 68 >> 2] = 0;
  HEAP32[buf + 72 >> 2] = stat.ino;
  return 0;
 }),
 doMsync: (function(addr, stream, len, flags) {
  var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
  FS.msync(stream, buffer, 0, len, flags);
 }),
 doMkdir: (function(path, mode) {
  path = PATH.normalize(path);
  if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
  FS.mkdir(path, mode, 0);
  return 0;
 }),
 doMknod: (function(path, mode, dev) {
  switch (mode & 61440) {
  case 32768:
  case 8192:
  case 24576:
  case 4096:
  case 49152:
   break;
  default:
   return -ERRNO_CODES.EINVAL;
  }
  FS.mknod(path, mode, dev);
  return 0;
 }),
 doReadlink: (function(path, buf, bufsize) {
  if (bufsize <= 0) return -ERRNO_CODES.EINVAL;
  var ret = FS.readlink(path);
  var len = Math.min(bufsize, lengthBytesUTF8(ret));
  var endChar = HEAP8[buf + len];
  stringToUTF8(ret, buf, bufsize + 1);
  HEAP8[buf + len] = endChar;
  return len;
 }),
 doAccess: (function(path, amode) {
  if (amode & ~7) {
   return -ERRNO_CODES.EINVAL;
  }
  var node;
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  node = lookup.node;
  var perms = "";
  if (amode & 4) perms += "r";
  if (amode & 2) perms += "w";
  if (amode & 1) perms += "x";
  if (perms && FS.nodePermissions(node, perms)) {
   return -ERRNO_CODES.EACCES;
  }
  return 0;
 }),
 doDup: (function(path, flags, suggestFD) {
  var suggest = FS.getStream(suggestFD);
  if (suggest) FS.close(suggest);
  return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
 }),
 doReadv: (function(stream, iov, iovcnt, offset) {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
   var ptr = HEAP32[iov + i * 8 >> 2];
   var len = HEAP32[iov + (i * 8 + 4) >> 2];
   var curr = FS.read(stream, HEAP8, ptr, len, offset);
   if (curr < 0) return -1;
   ret += curr;
   if (curr < len) break;
  }
  return ret;
 }),
 doWritev: (function(stream, iov, iovcnt, offset) {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
   var ptr = HEAP32[iov + i * 8 >> 2];
   var len = HEAP32[iov + (i * 8 + 4) >> 2];
   var curr = FS.write(stream, HEAP8, ptr, len, offset);
   if (curr < 0) return -1;
   ret += curr;
  }
  return ret;
 }),
 varargs: 0,
 get: (function(varargs) {
  SYSCALLS.varargs += 4;
  var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
  return ret;
 }),
 getStr: (function() {
  var ret = Pointer_stringify(SYSCALLS.get());
  return ret;
 }),
 getStreamFromFD: (function() {
  var stream = FS.getStream(SYSCALLS.get());
  if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  return stream;
 }),
 getSocketFromFD: (function() {
  var socket = SOCKFS.getSocket(SYSCALLS.get());
  if (!socket) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  return socket;
 }),
 getSocketAddress: (function(allowNull) {
  var addrp = SYSCALLS.get(), addrlen = SYSCALLS.get();
  if (allowNull && addrp === 0) return null;
  var info = __read_sockaddr(addrp, addrlen);
  if (info.errno) throw new FS.ErrnoError(info.errno);
  info.addr = DNS.lookup_addr(info.addr) || info.addr;
  return info;
 }),
 get64: (function() {
  var low = SYSCALLS.get(), high = SYSCALLS.get();
  if (low >= 0) assert(high === 0); else assert(high === -1);
  return low;
 }),
 getZero: (function() {
  assert(SYSCALLS.get() === 0);
 })
};
function ___syscall10(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var path = SYSCALLS.getStr();
  FS.unlink(path);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall140(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
  var offset = offset_low;
  FS.llseek(stream, offset, whence);
  HEAP32[result >> 2] = stream.position;
  if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall145(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
  return SYSCALLS.doReadv(stream, iov, iovcnt);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall146(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
  return SYSCALLS.doWritev(stream, iov, iovcnt);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall196(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var path = SYSCALLS.getStr(), buf = SYSCALLS.get();
  return SYSCALLS.doStat(FS.lstat, path, buf);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall220(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), dirp = SYSCALLS.get(), count = SYSCALLS.get();
  if (!stream.getdents) {
   stream.getdents = FS.readdir(stream.path);
  }
  var pos = 0;
  while (stream.getdents.length > 0 && pos + 268 <= count) {
   var id;
   var type;
   var name = stream.getdents.pop();
   if (name[0] === ".") {
    id = 1;
    type = 4;
   } else {
    var child = FS.lookupNode(stream.node, name);
    id = child.id;
    type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
   }
   HEAP32[dirp + pos >> 2] = id;
   HEAP32[dirp + pos + 4 >> 2] = stream.position;
   HEAP16[dirp + pos + 8 >> 1] = 268;
   HEAP8[dirp + pos + 10 >> 0] = type;
   stringToUTF8(name, dirp + pos + 11, 256);
   pos += 268;
  }
  return pos;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall221(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), cmd = SYSCALLS.get();
  switch (cmd) {
  case 0:
   {
    var arg = SYSCALLS.get();
    if (arg < 0) {
     return -ERRNO_CODES.EINVAL;
    }
    var newStream;
    newStream = FS.open(stream.path, stream.flags, 0, arg);
    return newStream.fd;
   }
  case 1:
  case 2:
   return 0;
  case 3:
   return stream.flags;
  case 4:
   {
    var arg = SYSCALLS.get();
    stream.flags |= arg;
    return 0;
   }
  case 12:
  case 12:
   {
    var arg = SYSCALLS.get();
    var offset = 0;
    HEAP16[arg + offset >> 1] = 2;
    return 0;
   }
  case 13:
  case 14:
  case 13:
  case 14:
   return 0;
  case 16:
  case 8:
   return -ERRNO_CODES.EINVAL;
  case 9:
   ___setErrNo(ERRNO_CODES.EINVAL);
   return -1;
  default:
   {
    return -ERRNO_CODES.EINVAL;
   }
  }
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall3(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get(), count = SYSCALLS.get();
  return FS.read(stream, HEAP8, buf, count);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall330(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var old = SYSCALLS.getStreamFromFD(), suggestFD = SYSCALLS.get(), flags = SYSCALLS.get();
  assert(!flags);
  if (old.fd === suggestFD) return -ERRNO_CODES.EINVAL;
  return SYSCALLS.doDup(old.path, old.flags, suggestFD);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall38(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var old_path = SYSCALLS.getStr(), new_path = SYSCALLS.getStr();
  FS.rename(old_path, new_path);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall40(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var path = SYSCALLS.getStr();
  FS.rmdir(path);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall5(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var pathname = SYSCALLS.getStr(), flags = SYSCALLS.get(), mode = SYSCALLS.get();
  var stream = FS.open(pathname, flags, mode);
  return stream.fd;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall54(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), op = SYSCALLS.get();
  switch (op) {
  case 21509:
  case 21505:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    return 0;
   }
  case 21510:
  case 21511:
  case 21512:
  case 21506:
  case 21507:
  case 21508:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    return 0;
   }
  case 21519:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    var argp = SYSCALLS.get();
    HEAP32[argp >> 2] = 0;
    return 0;
   }
  case 21520:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    return -ERRNO_CODES.EINVAL;
   }
  case 21531:
   {
    var argp = SYSCALLS.get();
    return FS.ioctl(stream, op, argp);
   }
  case 21523:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    return 0;
   }
  default:
   abort("bad ioctl syscall " + op);
  }
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall6(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD();
  FS.close(stream);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall63(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var old = SYSCALLS.getStreamFromFD(), suggestFD = SYSCALLS.get();
  if (old.fd === suggestFD) return suggestFD;
  return SYSCALLS.doDup(old.path, old.flags, suggestFD);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___syscall91(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var addr = SYSCALLS.get(), len = SYSCALLS.get();
  var info = SYSCALLS.mappings[addr];
  if (!info) return 0;
  if (len === info.len) {
   var stream = FS.getStream(info.fd);
   SYSCALLS.doMsync(addr, stream, len, info.flags);
   FS.munmap(stream);
   SYSCALLS.mappings[addr] = null;
   if (info.allocated) {
    _free(info.malloc);
   }
  }
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function ___unlock() {}
function _abort() {
 Module["abort"]();
}
function _emscripten_set_main_loop_timing(mode, value) {
 Browser.mainLoop.timingMode = mode;
 Browser.mainLoop.timingValue = value;
 if (!Browser.mainLoop.func) {
  return 1;
 }
 if (mode == 0) {
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
   var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
   setTimeout(Browser.mainLoop.runner, timeUntilNextTick);
  };
  Browser.mainLoop.method = "timeout";
 } else if (mode == 1) {
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
   Browser.requestAnimationFrame(Browser.mainLoop.runner);
  };
  Browser.mainLoop.method = "rAF";
 } else if (mode == 2) {
  if (typeof setImmediate === "undefined") {
   var setImmediates = [];
   var emscriptenMainLoopMessageId = "setimmediate";
   function Browser_setImmediate_messageHandler(event) {
    if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
     event.stopPropagation();
     setImmediates.shift()();
    }
   }
   addEventListener("message", Browser_setImmediate_messageHandler, true);
   setImmediate = function Browser_emulated_setImmediate(func) {
    setImmediates.push(func);
    if (ENVIRONMENT_IS_WORKER) {
     if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
     Module["setImmediates"].push(func);
     postMessage({
      target: emscriptenMainLoopMessageId
     });
    } else postMessage(emscriptenMainLoopMessageId, "*");
   };
  }
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
   setImmediate(Browser.mainLoop.runner);
  };
  Browser.mainLoop.method = "immediate";
 }
 return 0;
}
function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
 Module["noExitRuntime"] = true;
 assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
 Browser.mainLoop.func = func;
 Browser.mainLoop.arg = arg;
 var browserIterationFunc;
 if (typeof arg !== "undefined") {
  browserIterationFunc = (function() {
   Module["dynCall_vi"](func, arg);
  });
 } else {
  browserIterationFunc = (function() {
   Module["dynCall_v"](func);
  });
 }
 var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
 Browser.mainLoop.runner = function Browser_mainLoop_runner() {
  if (ABORT) return;
  if (Browser.mainLoop.queue.length > 0) {
   var start = Date.now();
   var blocker = Browser.mainLoop.queue.shift();
   blocker.func(blocker.arg);
   if (Browser.mainLoop.remainingBlockers) {
    var remaining = Browser.mainLoop.remainingBlockers;
    var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
    if (blocker.counted) {
     Browser.mainLoop.remainingBlockers = next;
    } else {
     next = next + .5;
     Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
    }
   }
   console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
   Browser.mainLoop.updateStatus();
   if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
   setTimeout(Browser.mainLoop.runner, 0);
   return;
  }
  if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
  if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
   Browser.mainLoop.scheduler();
   return;
  } else if (Browser.mainLoop.timingMode == 0) {
   Browser.mainLoop.tickStartTime = _emscripten_get_now();
  }
  if (Browser.mainLoop.method === "timeout" && Module.ctx) {
   Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
   Browser.mainLoop.method = "";
  }
  Browser.mainLoop.runIter(browserIterationFunc);
  if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  Browser.mainLoop.scheduler();
 };
 if (!noSetTiming) {
  if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps); else _emscripten_set_main_loop_timing(1, 1);
  Browser.mainLoop.scheduler();
 }
 if (simulateInfiniteLoop) {
  throw "SimulateInfiniteLoop";
 }
}
var Browser = {
 mainLoop: {
  scheduler: null,
  method: "",
  currentlyRunningMainloop: 0,
  func: null,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  pause: (function() {
   Browser.mainLoop.scheduler = null;
   Browser.mainLoop.currentlyRunningMainloop++;
  }),
  resume: (function() {
   Browser.mainLoop.currentlyRunningMainloop++;
   var timingMode = Browser.mainLoop.timingMode;
   var timingValue = Browser.mainLoop.timingValue;
   var func = Browser.mainLoop.func;
   Browser.mainLoop.func = null;
   _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true);
   _emscripten_set_main_loop_timing(timingMode, timingValue);
   Browser.mainLoop.scheduler();
  }),
  updateStatus: (function() {
   if (Module["setStatus"]) {
    var message = Module["statusMessage"] || "Please wait...";
    var remaining = Browser.mainLoop.remainingBlockers;
    var expected = Browser.mainLoop.expectedBlockers;
    if (remaining) {
     if (remaining < expected) {
      Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")");
     } else {
      Module["setStatus"](message);
     }
    } else {
     Module["setStatus"]("");
    }
   }
  }),
  runIter: (function(func) {
   if (ABORT) return;
   if (Module["preMainLoop"]) {
    var preRet = Module["preMainLoop"]();
    if (preRet === false) {
     return;
    }
   }
   try {
    func();
   } catch (e) {
    if (e instanceof ExitStatus) {
     return;
    } else {
     if (e && typeof e === "object" && e.stack) Module.printErr("exception thrown: " + [ e, e.stack ]);
     throw e;
    }
   }
   if (Module["postMainLoop"]) Module["postMainLoop"]();
  })
 },
 isFullscreen: false,
 pointerLock: false,
 moduleContextCreatedCallbacks: [],
 workers: [],
 init: (function() {
  if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
  if (Browser.initted) return;
  Browser.initted = true;
  try {
   new Blob;
   Browser.hasBlobConstructor = true;
  } catch (e) {
   Browser.hasBlobConstructor = false;
   console.log("warning: no blob constructor, cannot create blobs with mimetypes");
  }
  Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
  Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
  if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
   console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
   Module.noImageDecoding = true;
  }
  var imagePlugin = {};
  imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
   return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
  };
  imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
   var b = null;
   if (Browser.hasBlobConstructor) {
    try {
     b = new Blob([ byteArray ], {
      type: Browser.getMimetype(name)
     });
     if (b.size !== byteArray.length) {
      b = new Blob([ (new Uint8Array(byteArray)).buffer ], {
       type: Browser.getMimetype(name)
      });
     }
    } catch (e) {
     warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder");
    }
   }
   if (!b) {
    var bb = new Browser.BlobBuilder;
    bb.append((new Uint8Array(byteArray)).buffer);
    b = bb.getBlob();
   }
   var url = Browser.URLObject.createObjectURL(b);
   var img = new Image;
   img.onload = function img_onload() {
    assert(img.complete, "Image " + name + " could not be decoded");
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    Module["preloadedImages"][name] = canvas;
    Browser.URLObject.revokeObjectURL(url);
    if (onload) onload(byteArray);
   };
   img.onerror = function img_onerror(event) {
    console.log("Image " + url + " could not be decoded");
    if (onerror) onerror();
   };
   img.src = url;
  };
  Module["preloadPlugins"].push(imagePlugin);
  var audioPlugin = {};
  audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
   return !Module.noAudioDecoding && name.substr(-4) in {
    ".ogg": 1,
    ".wav": 1,
    ".mp3": 1
   };
  };
  audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
   var done = false;
   function finish(audio) {
    if (done) return;
    done = true;
    Module["preloadedAudios"][name] = audio;
    if (onload) onload(byteArray);
   }
   function fail() {
    if (done) return;
    done = true;
    Module["preloadedAudios"][name] = new Audio;
    if (onerror) onerror();
   }
   if (Browser.hasBlobConstructor) {
    try {
     var b = new Blob([ byteArray ], {
      type: Browser.getMimetype(name)
     });
    } catch (e) {
     return fail();
    }
    var url = Browser.URLObject.createObjectURL(b);
    var audio = new Audio;
    audio.addEventListener("canplaythrough", (function() {
     finish(audio);
    }), false);
    audio.onerror = function audio_onerror(event) {
     if (done) return;
     console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");
     function encode64(data) {
      var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var PAD = "=";
      var ret = "";
      var leftchar = 0;
      var leftbits = 0;
      for (var i = 0; i < data.length; i++) {
       leftchar = leftchar << 8 | data[i];
       leftbits += 8;
       while (leftbits >= 6) {
        var curr = leftchar >> leftbits - 6 & 63;
        leftbits -= 6;
        ret += BASE[curr];
       }
      }
      if (leftbits == 2) {
       ret += BASE[(leftchar & 3) << 4];
       ret += PAD + PAD;
      } else if (leftbits == 4) {
       ret += BASE[(leftchar & 15) << 2];
       ret += PAD;
      }
      return ret;
     }
     audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
     finish(audio);
    };
    audio.src = url;
    Browser.safeSetTimeout((function() {
     finish(audio);
    }), 1e4);
   } else {
    return fail();
   }
  };
  Module["preloadPlugins"].push(audioPlugin);
  function pointerLockChange() {
   Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"];
  }
  var canvas = Module["canvas"];
  if (canvas) {
   canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (function() {});
   canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (function() {});
   canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
   document.addEventListener("pointerlockchange", pointerLockChange, false);
   document.addEventListener("mozpointerlockchange", pointerLockChange, false);
   document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
   document.addEventListener("mspointerlockchange", pointerLockChange, false);
   if (Module["elementPointerLock"]) {
    canvas.addEventListener("click", (function(ev) {
     if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
      Module["canvas"].requestPointerLock();
      ev.preventDefault();
     }
    }), false);
   }
  }
 }),
 createContext: (function(canvas, useWebGL, setInModule, webGLContextAttributes) {
  if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
  var ctx;
  var contextHandle;
  if (useWebGL) {
   var contextAttributes = {
    antialias: false,
    alpha: false
   };
   if (webGLContextAttributes) {
    for (var attribute in webGLContextAttributes) {
     contextAttributes[attribute] = webGLContextAttributes[attribute];
    }
   }
   contextHandle = GL.createContext(canvas, contextAttributes);
   if (contextHandle) {
    ctx = GL.getContext(contextHandle).GLctx;
   }
  } else {
   ctx = canvas.getContext("2d");
  }
  if (!ctx) return null;
  if (setInModule) {
   if (!useWebGL) assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
   Module.ctx = ctx;
   if (useWebGL) GL.makeContextCurrent(contextHandle);
   Module.useWebGL = useWebGL;
   Browser.moduleContextCreatedCallbacks.forEach((function(callback) {
    callback();
   }));
   Browser.init();
  }
  return ctx;
 }),
 destroyContext: (function(canvas, useWebGL, setInModule) {}),
 fullscreenHandlersInstalled: false,
 lockPointer: undefined,
 resizeCanvas: undefined,
 requestFullscreen: (function(lockPointer, resizeCanvas, vrDevice) {
  Browser.lockPointer = lockPointer;
  Browser.resizeCanvas = resizeCanvas;
  Browser.vrDevice = vrDevice;
  if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
  if (typeof Browser.resizeCanvas === "undefined") Browser.resizeCanvas = false;
  if (typeof Browser.vrDevice === "undefined") Browser.vrDevice = null;
  var canvas = Module["canvas"];
  function fullscreenChange() {
   Browser.isFullscreen = false;
   var canvasContainer = canvas.parentNode;
   if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
    canvas.exitFullscreen = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (function() {});
    canvas.exitFullscreen = canvas.exitFullscreen.bind(document);
    if (Browser.lockPointer) canvas.requestPointerLock();
    Browser.isFullscreen = true;
    if (Browser.resizeCanvas) Browser.setFullscreenCanvasSize();
   } else {
    canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
    canvasContainer.parentNode.removeChild(canvasContainer);
    if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
   }
   if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
   if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen);
   Browser.updateCanvasDimensions(canvas);
  }
  if (!Browser.fullscreenHandlersInstalled) {
   Browser.fullscreenHandlersInstalled = true;
   document.addEventListener("fullscreenchange", fullscreenChange, false);
   document.addEventListener("mozfullscreenchange", fullscreenChange, false);
   document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
   document.addEventListener("MSFullscreenChange", fullscreenChange, false);
  }
  var canvasContainer = document.createElement("div");
  canvas.parentNode.insertBefore(canvasContainer, canvas);
  canvasContainer.appendChild(canvas);
  canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? (function() {
   canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]);
  }) : null) || (canvasContainer["webkitRequestFullScreen"] ? (function() {
   canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]);
  }) : null);
  if (vrDevice) {
   canvasContainer.requestFullscreen({
    vrDisplay: vrDevice
   });
  } else {
   canvasContainer.requestFullscreen();
  }
 }),
 requestFullScreen: (function(lockPointer, resizeCanvas, vrDevice) {
  Module.printErr("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.");
  Browser.requestFullScreen = (function(lockPointer, resizeCanvas, vrDevice) {
   return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
  });
  return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
 }),
 nextRAF: 0,
 fakeRequestAnimationFrame: (function(func) {
  var now = Date.now();
  if (Browser.nextRAF === 0) {
   Browser.nextRAF = now + 1e3 / 60;
  } else {
   while (now + 2 >= Browser.nextRAF) {
    Browser.nextRAF += 1e3 / 60;
   }
  }
  var delay = Math.max(Browser.nextRAF - now, 0);
  setTimeout(func, delay);
 }),
 requestAnimationFrame: function requestAnimationFrame(func) {
  if (typeof window === "undefined") {
   Browser.fakeRequestAnimationFrame(func);
  } else {
   if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"] || Browser.fakeRequestAnimationFrame;
   }
   window.requestAnimationFrame(func);
  }
 },
 safeCallback: (function(func) {
  return (function() {
   if (!ABORT) return func.apply(null, arguments);
  });
 }),
 allowAsyncCallbacks: true,
 queuedAsyncCallbacks: [],
 pauseAsyncCallbacks: (function() {
  Browser.allowAsyncCallbacks = false;
 }),
 resumeAsyncCallbacks: (function() {
  Browser.allowAsyncCallbacks = true;
  if (Browser.queuedAsyncCallbacks.length > 0) {
   var callbacks = Browser.queuedAsyncCallbacks;
   Browser.queuedAsyncCallbacks = [];
   callbacks.forEach((function(func) {
    func();
   }));
  }
 }),
 safeRequestAnimationFrame: (function(func) {
  return Browser.requestAnimationFrame((function() {
   if (ABORT) return;
   if (Browser.allowAsyncCallbacks) {
    func();
   } else {
    Browser.queuedAsyncCallbacks.push(func);
   }
  }));
 }),
 safeSetTimeout: (function(func, timeout) {
  Module["noExitRuntime"] = true;
  return setTimeout((function() {
   if (ABORT) return;
   if (Browser.allowAsyncCallbacks) {
    func();
   } else {
    Browser.queuedAsyncCallbacks.push(func);
   }
  }), timeout);
 }),
 safeSetInterval: (function(func, timeout) {
  Module["noExitRuntime"] = true;
  return setInterval((function() {
   if (ABORT) return;
   if (Browser.allowAsyncCallbacks) {
    func();
   }
  }), timeout);
 }),
 getMimetype: (function(name) {
  return {
   "jpg": "image/jpeg",
   "jpeg": "image/jpeg",
   "png": "image/png",
   "bmp": "image/bmp",
   "ogg": "audio/ogg",
   "wav": "audio/wav",
   "mp3": "audio/mpeg"
  }[name.substr(name.lastIndexOf(".") + 1)];
 }),
 getUserMedia: (function(func) {
  if (!window.getUserMedia) {
   window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"];
  }
  window.getUserMedia(func);
 }),
 getMovementX: (function(event) {
  return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0;
 }),
 getMovementY: (function(event) {
  return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0;
 }),
 getMouseWheelDelta: (function(event) {
  var delta = 0;
  switch (event.type) {
  case "DOMMouseScroll":
   delta = event.detail;
   break;
  case "mousewheel":
   delta = event.wheelDelta;
   break;
  case "wheel":
   delta = event["deltaY"];
   break;
  default:
   throw "unrecognized mouse wheel event: " + event.type;
  }
  return delta;
 }),
 mouseX: 0,
 mouseY: 0,
 mouseMovementX: 0,
 mouseMovementY: 0,
 touches: {},
 lastTouches: {},
 calculateMouseEvent: (function(event) {
  if (Browser.pointerLock) {
   if (event.type != "mousemove" && "mozMovementX" in event) {
    Browser.mouseMovementX = Browser.mouseMovementY = 0;
   } else {
    Browser.mouseMovementX = Browser.getMovementX(event);
    Browser.mouseMovementY = Browser.getMovementY(event);
   }
   if (typeof SDL != "undefined") {
    Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
    Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
   } else {
    Browser.mouseX += Browser.mouseMovementX;
    Browser.mouseY += Browser.mouseMovementY;
   }
  } else {
   var rect = Module["canvas"].getBoundingClientRect();
   var cw = Module["canvas"].width;
   var ch = Module["canvas"].height;
   var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
   var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
   if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
    var touch = event.touch;
    if (touch === undefined) {
     return;
    }
    var adjustedX = touch.pageX - (scrollX + rect.left);
    var adjustedY = touch.pageY - (scrollY + rect.top);
    adjustedX = adjustedX * (cw / rect.width);
    adjustedY = adjustedY * (ch / rect.height);
    var coords = {
     x: adjustedX,
     y: adjustedY
    };
    if (event.type === "touchstart") {
     Browser.lastTouches[touch.identifier] = coords;
     Browser.touches[touch.identifier] = coords;
    } else if (event.type === "touchend" || event.type === "touchmove") {
     var last = Browser.touches[touch.identifier];
     if (!last) last = coords;
     Browser.lastTouches[touch.identifier] = last;
     Browser.touches[touch.identifier] = coords;
    }
    return;
   }
   var x = event.pageX - (scrollX + rect.left);
   var y = event.pageY - (scrollY + rect.top);
   x = x * (cw / rect.width);
   y = y * (ch / rect.height);
   Browser.mouseMovementX = x - Browser.mouseX;
   Browser.mouseMovementY = y - Browser.mouseY;
   Browser.mouseX = x;
   Browser.mouseY = y;
  }
 }),
 asyncLoad: (function(url, onload, onerror, noRunDep) {
  var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
  Module["readAsync"](url, (function(arrayBuffer) {
   assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
   onload(new Uint8Array(arrayBuffer));
   if (dep) removeRunDependency(dep);
  }), (function(event) {
   if (onerror) {
    onerror();
   } else {
    throw 'Loading data file "' + url + '" failed.';
   }
  }));
  if (dep) addRunDependency(dep);
 }),
 resizeListeners: [],
 updateResizeListeners: (function() {
  var canvas = Module["canvas"];
  Browser.resizeListeners.forEach((function(listener) {
   listener(canvas.width, canvas.height);
  }));
 }),
 setCanvasSize: (function(width, height, noUpdates) {
  var canvas = Module["canvas"];
  Browser.updateCanvasDimensions(canvas, width, height);
  if (!noUpdates) Browser.updateResizeListeners();
 }),
 windowedWidth: 0,
 windowedHeight: 0,
 setFullscreenCanvasSize: (function() {
  if (typeof SDL != "undefined") {
   var flags = HEAPU32[SDL.screen >> 2];
   flags = flags | 8388608;
   HEAP32[SDL.screen >> 2] = flags;
  }
  Browser.updateResizeListeners();
 }),
 setWindowedCanvasSize: (function() {
  if (typeof SDL != "undefined") {
   var flags = HEAPU32[SDL.screen >> 2];
   flags = flags & ~8388608;
   HEAP32[SDL.screen >> 2] = flags;
  }
  Browser.updateResizeListeners();
 }),
 updateCanvasDimensions: (function(canvas, wNative, hNative) {
  if (wNative && hNative) {
   canvas.widthNative = wNative;
   canvas.heightNative = hNative;
  } else {
   wNative = canvas.widthNative;
   hNative = canvas.heightNative;
  }
  var w = wNative;
  var h = hNative;
  if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
   if (w / h < Module["forcedAspectRatio"]) {
    w = Math.round(h * Module["forcedAspectRatio"]);
   } else {
    h = Math.round(w / Module["forcedAspectRatio"]);
   }
  }
  if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
   var factor = Math.min(screen.width / w, screen.height / h);
   w = Math.round(w * factor);
   h = Math.round(h * factor);
  }
  if (Browser.resizeCanvas) {
   if (canvas.width != w) canvas.width = w;
   if (canvas.height != h) canvas.height = h;
   if (typeof canvas.style != "undefined") {
    canvas.style.removeProperty("width");
    canvas.style.removeProperty("height");
   }
  } else {
   if (canvas.width != wNative) canvas.width = wNative;
   if (canvas.height != hNative) canvas.height = hNative;
   if (typeof canvas.style != "undefined") {
    if (w != wNative || h != hNative) {
     canvas.style.setProperty("width", w + "px", "important");
     canvas.style.setProperty("height", h + "px", "important");
    } else {
     canvas.style.removeProperty("width");
     canvas.style.removeProperty("height");
    }
   }
  }
 }),
 wgetRequests: {},
 nextWgetRequestHandle: 0,
 getNextWgetRequestHandle: (function() {
  var handle = Browser.nextWgetRequestHandle;
  Browser.nextWgetRequestHandle++;
  return handle;
 })
};
var AL = {
 QUEUE_INTERVAL: 25,
 QUEUE_LOOKAHEAD: .1,
 DEVICE_NAME: "Emscripten OpenAL",
 CAPTURE_DEVICE_NAME: "Emscripten OpenAL capture",
 ALC_EXTENSIONS: {
  ALC_SOFT_pause_device: true,
  ALC_SOFT_HRTF: true
 },
 AL_EXTENSIONS: {
  AL_EXT_float32: true,
  AL_SOFT_loop_points: true,
  AL_SOFT_source_length: true,
  AL_EXT_source_distance_model: true,
  AL_SOFT_source_spatialize: true
 },
 _alcErr: 0,
 alcErr: 0,
 deviceRefCounts: {},
 alcStringCache: {},
 paused: false,
 stringCache: {},
 contexts: {},
 currentCtx: null,
 buffers: {
  0: {
   id: 0,
   refCount: 0,
   audioBuf: null,
   frequency: 0,
   bytesPerSample: 2,
   channels: 1,
   length: 0
  }
 },
 paramArray: [],
 _nextId: 1,
 newId: (function() {
  return AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++;
 }),
 freeIds: [],
 scheduleContextAudio: (function(ctx) {
  if (Browser.mainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
   return;
  }
  for (var i in ctx.sources) {
   AL.scheduleSourceAudio(ctx.sources[i]);
  }
 }),
 scheduleSourceAudio: (function(src, lookahead) {
  if (Browser.mainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
   return;
  }
  if (src.state !== 4114) {
   return;
  }
  var currentTime = AL.updateSourceTime(src);
  var startTime = src.bufStartTime;
  var startOffset = src.bufOffset;
  var bufCursor = src.bufsProcessed;
  for (var i = 0; i < src.audioQueue.length; i++) {
   var audioSrc = src.audioQueue[i];
   startTime = audioSrc._startTime + audioSrc._duration;
   startOffset = 0;
   bufCursor += audioSrc._skipCount + 1;
  }
  if (!lookahead) {
   lookahead = AL.QUEUE_LOOKAHEAD;
  }
  var lookaheadTime = currentTime + lookahead;
  var skipCount = 0;
  while (startTime < lookaheadTime) {
   if (bufCursor >= src.bufQueue.length) {
    if (src.looping) {
     bufCursor %= src.bufQueue.length;
    } else {
     break;
    }
   }
   var buf = src.bufQueue[bufCursor % src.bufQueue.length];
   if (buf.length === 0) {
    skipCount++;
    if (skipCount === src.bufQueue.length) {
     break;
    }
   } else {
    var audioSrc = src.context.audioCtx.createBufferSource();
    audioSrc.buffer = buf.audioBuf;
    audioSrc.playbackRate.value = src.playbackRate;
    if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
     audioSrc.loopStart = buf.audioBuf._loopStart;
     audioSrc.loopEnd = buf.audioBuf._loopEnd;
    }
    var duration = 0;
    if (src.type === 4136 && src.looping) {
     duration = Number.POSITIVE_INFINITY;
     audioSrc.loop = true;
     if (buf.audioBuf._loopStart) {
      audioSrc.loopStart = buf.audioBuf._loopStart;
     }
     if (buf.audioBuf._loopEnd) {
      audioSrc.loopEnd = buf.audioBuf._loopEnd;
     }
    } else {
     duration = (buf.audioBuf.duration - startOffset) / src.playbackRate;
    }
    audioSrc._startOffset = startOffset;
    audioSrc._duration = duration;
    audioSrc._skipCount = skipCount;
    skipCount = 0;
    audioSrc.connect(src.gain);
    if (typeof audioSrc.start !== "undefined") {
     startTime = Math.max(startTime, src.context.audioCtx.currentTime);
     audioSrc.start(startTime, startOffset);
    } else if (typeof audioSrc.noteOn !== "undefined") {
     startTime = Math.max(startTime, src.context.audioCtx.currentTime);
     audioSrc.noteOn(startTime);
    }
    audioSrc._startTime = startTime;
    src.audioQueue.push(audioSrc);
    startTime += duration;
   }
   startOffset = 0;
   bufCursor++;
  }
 }),
 updateSourceTime: (function(src) {
  var currentTime = src.context.audioCtx.currentTime;
  if (src.state !== 4114) {
   return currentTime;
  }
  if (!isFinite(src.bufStartTime)) {
   src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
   src.bufOffset = 0;
  }
  var nextStartTime = 0;
  while (src.audioQueue.length) {
   var audioSrc = src.audioQueue[0];
   src.bufsProcessed += audioSrc._skipCount;
   nextStartTime = audioSrc._startTime + audioSrc._duration;
   if (currentTime < nextStartTime) {
    break;
   }
   src.audioQueue.shift();
   src.bufStartTime = nextStartTime;
   src.bufOffset = 0;
   src.bufsProcessed++;
  }
  if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
   AL.setSourceState(src, 4116);
  } else if (src.type === 4136 && src.looping) {
   var buf = src.bufQueue[0];
   if (buf.length === 0) {
    src.bufOffset = 0;
   } else {
    var delta = (currentTime - src.bufStartTime) * src.playbackRate;
    var loopStart = buf.audioBuf._loopStart || 0;
    var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
    if (loopEnd <= loopStart) {
     loopEnd = buf.audioBuf.duration;
    }
    if (delta < loopEnd) {
     src.bufOffset = delta;
    } else {
     src.bufOffset = loopStart + (delta - loopStart) % (loopEnd - loopStart);
    }
   }
  } else if (src.audioQueue[0]) {
   src.bufOffset = (currentTime - src.audioQueue[0]._startTime) * src.playbackRate;
  } else {
   if (src.type !== 4136 && src.looping) {
    var srcDuration = AL.sourceDuration(src) / src.playbackRate;
    if (srcDuration > 0) {
     src.bufStartTime += Math.floor((currentTime - src.bufStartTime) / srcDuration) * srcDuration;
    }
   }
   for (var i = 0; i < src.bufQueue.length; i++) {
    if (src.bufsProcessed >= src.bufQueue.length) {
     if (src.looping) {
      src.bufsProcessed %= src.bufQueue.length;
     } else {
      AL.setSourceState(src, 4116);
      break;
     }
    }
    var buf = src.bufQueue[src.bufsProcessed];
    if (buf.length > 0) {
     nextStartTime = src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
     if (currentTime < nextStartTime) {
      src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
      break;
     }
     src.bufStartTime = nextStartTime;
    }
    src.bufOffset = 0;
    src.bufsProcessed++;
   }
  }
  return currentTime;
 }),
 cancelPendingSourceAudio: (function(src) {
  AL.updateSourceTime(src);
  for (var i = 1; i < src.audioQueue.length; i++) {
   var audioSrc = src.audioQueue[i];
   audioSrc.stop();
  }
  if (src.audioQueue.length > 1) {
   src.audioQueue.length = 1;
  }
 }),
 stopSourceAudio: (function(src) {
  for (var i = 0; i < src.audioQueue.length; i++) {
   src.audioQueue[i].stop();
  }
  src.audioQueue.length = 0;
 }),
 setSourceState: (function(src, state) {
  if (state === 4114) {
   if (src.state === 4114 || src.state == 4116) {
    src.bufsProcessed = 0;
    src.bufOffset = 0;
   } else {}
   AL.stopSourceAudio(src);
   src.state = 4114;
   src.bufStartTime = Number.NEGATIVE_INFINITY;
   AL.scheduleSourceAudio(src);
  } else if (state === 4115) {
   if (src.state === 4114) {
    AL.updateSourceTime(src);
    AL.stopSourceAudio(src);
    src.state = 4115;
   }
  } else if (state === 4116) {
   if (src.state !== 4113) {
    src.state = 4116;
    src.bufsProcessed = src.bufQueue.length;
    src.bufStartTime = Number.NEGATIVE_INFINITY;
    src.bufOffset = 0;
    AL.stopSourceAudio(src);
   }
  } else if (state === 4113) {
   if (src.state !== 4113) {
    src.state = 4113;
    src.bufsProcessed = 0;
    src.bufStartTime = Number.NEGATIVE_INFINITY;
    src.bufOffset = 0;
    AL.stopSourceAudio(src);
   }
  }
 }),
 initSourcePanner: (function(src) {
  if (src.type === 4144) {
   return;
  }
  var templateBuf = AL.buffers[0];
  for (var i = 0; i < src.bufQueue.length; i++) {
   if (src.bufQueue[i].id !== 0) {
    templateBuf = src.bufQueue[i];
    break;
   }
  }
  if (src.spatialize === 1 || src.spatialize === 2 && templateBuf.channels === 1) {
   if (src.panner) {
    return;
   }
   src.panner = src.context.audioCtx.createPanner();
   AL.updateSourceGlobal(src);
   AL.updateSourceSpace(src);
   src.panner.connect(src.context.gain);
   src.gain.disconnect();
   src.gain.connect(src.panner);
  } else {
   if (!src.panner) {
    return;
   }
   src.panner.disconnect();
   src.gain.disconnect();
   src.gain.connect(src.context.gain);
   src.panner = null;
  }
 }),
 updateContextGlobal: (function(ctx) {
  for (var i in ctx.sources) {
   AL.updateSourceGlobal(ctx.sources[i]);
  }
 }),
 updateSourceGlobal: (function(src) {
  var panner = src.panner;
  if (!panner) {
   return;
  }
  panner.refDistance = src.refDistance;
  panner.maxDistance = src.maxDistance;
  panner.rolloffFactor = src.rolloffFactor;
  panner.panningModel = src.context.hrtf ? "HRTF" : "equalpower";
  var distanceModel = src.context.sourceDistanceModel ? src.distanceModel : src.context.distanceModel;
  switch (distanceModel) {
  case 0:
   panner.distanceModel = "inverse";
   panner.refDistance = 3.40282e+38;
   break;
  case 53249:
  case 53250:
   panner.distanceModel = "inverse";
   break;
  case 53251:
  case 53252:
   panner.distanceModel = "linear";
   break;
  case 53253:
  case 53254:
   panner.distanceModel = "exponential";
   break;
  }
 }),
 updateListenerSpace: (function(ctx) {
  var listener = ctx.audioCtx.listener;
  if (listener.positionX) {
   listener.positionX.value = listener._position[0];
   listener.positionY.value = listener._position[1];
   listener.positionZ.value = listener._position[2];
  } else {
   listener.setPosition(listener._position[0], listener._position[1], listener._position[2]);
  }
  if (listener.forwardX) {
   listener.forwardX.value = listener._direction[0];
   listener.forwardY.value = listener._direction[1];
   listener.forwardZ.value = listener._direction[2];
   listener.upX.value = listener._up[0];
   listener.upY.value = listener._up[1];
   listener.upZ.value = listener._up[2];
  } else {
   listener.setOrientation(listener._direction[0], listener._direction[1], listener._direction[2], listener._up[0], listener._up[1], listener._up[2]);
  }
  for (var i in ctx.sources) {
   AL.updateSourceSpace(ctx.sources[i]);
  }
 }),
 updateSourceSpace: (function(src) {
  if (!src.panner) {
   return;
  }
  var panner = src.panner;
  var posX = src.position[0];
  var posY = src.position[1];
  var posZ = src.position[2];
  var dirX = src.direction[0];
  var dirY = src.direction[1];
  var dirZ = src.direction[2];
  var listener = src.context.audioCtx.listener;
  var lPosX = listener._position[0];
  var lPosY = listener._position[1];
  var lPosZ = listener._position[2];
  if (src.relative) {
   var lBackX = -listener._direction[0];
   var lBackY = -listener._direction[1];
   var lBackZ = -listener._direction[2];
   var lUpX = listener._up[0];
   var lUpY = listener._up[1];
   var lUpZ = listener._up[2];
   var invMag = 1 / Math.sqrt(lBackX * lBackX + lBackY * lBackY + lBackZ * lBackZ);
   lBackX *= invMag;
   lBackY *= invMag;
   lBackZ *= invMag;
   var invMag = 1 / Math.sqrt(lUpX * lUpX + lUpY * lUpY + lUpZ * lUpZ);
   lUpX *= invMag;
   lUpY *= invMag;
   lUpZ *= invMag;
   var lRightX = lUpY * lBackZ - lUpZ * lBackY;
   var lRightY = lUpZ * lBackX - lUpX * lBackZ;
   var lRightZ = lUpX * lBackY - lUpY * lBackX;
   var invMag = 1 / Math.sqrt(lRightX * lRightX + lRightY * lRightY + lRightZ * lRightZ);
   lRightX *= invMag;
   lRightY *= invMag;
   lRightZ *= invMag;
   var lUpX = lBackY * lRightZ - lBackZ * lRightY;
   var lUpY = lBackZ * lRightX - lBackX * lRightZ;
   var lUpZ = lBackX * lRightY - lBackY * lRightX;
   var oldX = dirX;
   var oldY = dirY;
   var oldZ = dirZ;
   dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
   dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
   dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
   var oldX = posX;
   var oldY = posY;
   var oldZ = posZ;
   posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
   posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
   posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
   posX += lPosX;
   posY += lPosY;
   posZ += lPosZ;
  }
  if (panner.positionX) {
   panner.positionX.value = posX;
   panner.positionY.value = posY;
   panner.positionZ.value = posZ;
  } else {
   panner.setPosition(posX, posY, posZ);
  }
  if (panner.orientationX) {
   panner.orientationX.value = dirX;
   panner.orientationY.value = dirY;
   panner.orientationZ.value = dirZ;
  } else {
   panner.setOrientation(dirX, dirY, dirZ);
  }
  var oldShift = src.dopplerShift;
  var velX = src.velocity[0];
  var velY = src.velocity[1];
  var velZ = src.velocity[2];
  var lVelX = listener._velocity[0];
  var lVelY = listener._velocity[1];
  var lVelZ = listener._velocity[2];
  if (posX === lPosX && posY === lPosY && posZ === lPosZ || velX === lVelX && velY === lVelY && velZ === lVelZ) {
   src.dopplerShift = 1;
  } else {
   var speedOfSound = src.context.speedOfSound;
   var dopplerFactor = src.context.dopplerFactor;
   var slX = lPosX - posX;
   var slY = lPosY - posY;
   var slZ = lPosZ - posZ;
   var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
   var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
   var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
   vls = Math.min(vls, speedOfSound / dopplerFactor);
   vss = Math.min(vss, speedOfSound / dopplerFactor);
   src.dopplerShift = (speedOfSound - dopplerFactor * vls) / (speedOfSound - dopplerFactor * vss);
  }
  if (src.dopplerShift !== oldShift) {
   AL.updateSourceRate(src);
  }
 }),
 updateSourceRate: (function(src) {
  if (src.state === 4114) {
   AL.cancelPendingSourceAudio(src);
   var audioSrc = src.audioQueue[0];
   if (!audioSrc) {
    return;
   }
   var duration;
   if (src.type === 4136 && src.looping) {
    duration = Number.POSITIVE_INFINITY;
   } else {
    duration = (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate;
   }
   audioSrc._duration = duration;
   audioSrc.playbackRate.value = src.playbackRate;
   AL.scheduleSourceAudio(src);
  }
 }),
 sourceDuration: (function(src) {
  var length = 0;
  for (var i = 0; i < src.bufQueue.length; i++) {
   var audioBuf = src.bufQueue[i].audioBuf;
   length += audioBuf ? audioBuf.duration : 0;
  }
  return length;
 }),
 sourceTell: (function(src) {
  AL.updateSourceTime(src);
  var offset = 0;
  for (var i = 0; i < src.bufsProcessed; i++) {
   offset += src.bufQueue[i].audioBuf.duration;
  }
  offset += src.bufOffset;
  return offset;
 }),
 sourceSeek: (function(src, offset) {
  var playing = src.state == 4114;
  if (playing) {
   AL.setSourceState(src, 4113);
  }
  src.bufsProcessed = 0;
  while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
   offset -= src.bufQueue[src.bufsProcessed].audiobuf.duration;
   src.bufsProcessed++;
  }
  src.bufOffset = offset;
  if (playing) {
   AL.setSourceState(src, 4114);
  }
 }),
 getGlobalParam: (function(funcname, param) {
  if (!AL.currentCtx) {
   return null;
  }
  switch (param) {
  case 49152:
   return AL.currentCtx.dopplerFactor;
  case 49155:
   return AL.currentCtx.speedOfSound;
  case 53248:
   return AL.currentCtx.distanceModel;
  default:
   AL.currentCtx.err = 40962;
   return null;
  }
 }),
 setGlobalParam: (function(funcname, param, value) {
  if (!AL.currentCtx) {
   return;
  }
  switch (param) {
  case 49152:
   if (!Number.isFinite(value) || value < 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   AL.currentCtx.dopplerFactor = value;
   AL.updateListenerSpace(AL.currentCtx);
   break;
  case 49155:
   if (!Number.isFinite(value) || value <= 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   AL.currentCtx.speedOfSound = value;
   AL.updateListenerSpace(AL.currentCtx);
   break;
  case 53248:
   switch (value) {
   case 0:
   case 53249:
   case 53250:
   case 53251:
   case 53252:
   case 53253:
   case 53254:
    AL.currentCtx.distanceModel = value;
    AL.updateContextGlobal(AL.currentCtx);
    break;
   default:
    AL.currentCtx.err = 40963;
    return;
   }
   break;
  default:
   AL.currentCtx.err = 40962;
   return;
  }
 }),
 getListenerParam: (function(funcname, param) {
  if (!AL.currentCtx) {
   return null;
  }
  switch (param) {
  case 4100:
   return AL.currentCtx.audioCtx.listener._position;
  case 4102:
   return AL.currentCtx.audioCtx.listener._velocity;
  case 4111:
   return AL.currentCtx.audioCtx.listener._direction.concat(AL.currentCtx.audioCtx.listener._up);
  case 4106:
   return AL.currentCtx.gain.gain.value;
  default:
   AL.currentCtx.err = 40962;
   return null;
  }
 }),
 setListenerParam: (function(funcname, param, value) {
  if (!AL.currentCtx) {
   return;
  }
  if (value === null) {
   AL.currentCtx.err = 40962;
   return;
  }
  var listener = AL.currentCtx.audioCtx.listener;
  switch (param) {
  case 4100:
   if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
    AL.currentCtx.err = 40963;
    return;
   }
   listener._position[0] = value[0];
   listener._position[1] = value[1];
   listener._position[2] = value[2];
   AL.updateListenerSpace(AL.currentCtx);
   break;
  case 4102:
   if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
    AL.currentCtx.err = 40963;
    return;
   }
   listener._velocity[0] = value[0];
   listener._velocity[1] = value[1];
   listener._velocity[2] = value[2];
   AL.updateListenerSpace(AL.currentCtx);
   break;
  case 4106:
   if (!Number.isFinite(value) || value < 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   AL.currentCtx.gain.gain.value = value;
   break;
  case 4111:
   if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2]) || !Number.isFinite(value[3]) || !Number.isFinite(value[4]) || !Number.isFinite(value[5])) {
    AL.currentCtx.err = 40963;
    return;
   }
   listener._direction[0] = value[0];
   listener._direction[1] = value[1];
   listener._direction[2] = value[2];
   listener._up[0] = value[3];
   listener._up[1] = value[4];
   listener._up[2] = value[5];
   AL.updateListenerSpace(AL.currentCtx);
   break;
  default:
   AL.currentCtx.err = 40962;
   return;
  }
 }),
 getBufferParam: (function(funcname, bufferId, param) {
  if (!AL.currentCtx) {
   return;
  }
  var buf = AL.buffers[bufferId];
  if (!buf || bufferId === 0) {
   AL.currentCtx.err = 40961;
   return;
  }
  switch (param) {
  case 8193:
   return buf.frequency;
  case 8194:
   return buf.bytesPerSample * 8;
  case 8195:
   return buf.channels;
  case 8196:
   return buf.length * buf.bytesPerSample * buf.channels;
  case 8213:
   if (buf.length === 0) {
    return [ 0, 0 ];
   } else {
    return [ (buf.audioBuf._loopStart || 0) * buf.frequency, (buf.audioBuf._loopEnd || buf.length) * buf.frequency ];
   }
  default:
   AL.currentCtx.err = 40962;
   return null;
  }
 }),
 setBufferParam: (function(funcname, bufferId, param, value) {
  if (!AL.currentCtx) {
   return;
  }
  var buf = AL.buffers[bufferId];
  if (!buf || bufferId === 0) {
   AL.currentCtx.err = 40961;
   return;
  }
  if (value === null) {
   AL.currentCtx.err = 40962;
   return;
  }
  switch (param) {
  case 8196:
   if (value !== 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   break;
  case 8213:
   if (value[0] < 0 || value[0] > buf.length || value[1] < 0 || value[1] > buf.Length || value[0] >= value[1]) {
    AL.currentCtx.err = 40963;
    return;
   }
   if (buf.refCount > 0) {
    AL.currentCtx.err = 40964;
    return;
   }
   if (buf.audioBuf) {
    buf.audioBuf._loopStart = value[0] / buf.frequency;
    buf.audioBuf._loopEnd = value[1] / buf.frequency;
   }
   break;
  default:
   AL.currentCtx.err = 40962;
   return;
  }
 }),
 getSourceParam: (function(funcname, sourceId, param) {
  if (!AL.currentCtx) {
   return null;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
   AL.currentCtx.err = 40961;
   return null;
  }
  switch (param) {
  case 514:
   return src.relative;
  case 4097:
   return src.coneInnerAngle;
  case 4098:
   return src.coneOuterAngle;
  case 4099:
   return src.pitch;
  case 4100:
   return src.position;
  case 4101:
   return src.direction;
  case 4102:
   return src.velocity;
  case 4103:
   return src.looping;
  case 4105:
   if (src.type === 4136) {
    return src.bufQueue[0].id;
   } else {
    return 0;
   }
  case 4106:
   return src.gain.gain.value;
  case 4109:
   return src.minGain;
  case 4110:
   return src.maxGain;
  case 4112:
   return src.state;
  case 4117:
   if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
    return 0;
   } else {
    return src.bufQueue.length;
   }
  case 4118:
   if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 || src.looping) {
    return 0;
   } else {
    return src.bufsProcessed;
   }
  case 4128:
   return src.refDistance;
  case 4129:
   return src.rolloffFactor;
  case 4130:
   return src.coneOuterGain;
  case 4131:
   return src.maxDistance;
  case 4132:
   return AL.sourceTell(src);
  case 4133:
   var offset = AL.sourceTell(src);
   if (offset > 0) {
    offset *= src.bufQueue[0].frequency;
   }
   return offset;
  case 4134:
   var offset = AL.sourceTell(src);
   if (offset > 0) {
    offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample;
   }
   return offset;
  case 4135:
   return src.type;
  case 4628:
   return src.spatialize;
  case 8201:
   var length = 0;
   var bytesPerFrame = 0;
   for (var i = 0; i < src.bufQueue.length; i++) {
    length += src.bufQueue[i].length;
    if (src.bufQueue[i].id !== 0) {
     bytesPerFrame = src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels;
    }
   }
   return length * bytesPerFrame;
  case 8202:
   var length = 0;
   for (var i = 0; i < src.bufQueue.length; i++) {
    length += src.bufQueue[i].length;
   }
   return length;
  case 8203:
   return AL.sourceDuration(src);
  case 53248:
   return src.distanceModel;
  default:
   AL.currentCtx.err = 40962;
   return null;
  }
 }),
 setSourceParam: (function(funcname, sourceId, param, value) {
  if (!AL.currentCtx) {
   return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
   AL.currentCtx.err = 40961;
   return;
  }
  if (value === null) {
   AL.currentCtx.err = 40962;
   return;
  }
  switch (param) {
  case 514:
   if (value === 1) {
    src.relative = true;
    AL.updateSourceSpace(src);
   } else if (value === 0) {
    src.relative = false;
    AL.updateSourceSpace(src);
   } else {
    AL.currentCtx.err = 40963;
    return;
   }
   break;
  case 4097:
   if (!Number.isFinite(value)) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.coneInnerAngle = value;
   if (src.panner) {
    src.panner.coneInnerAngle = value % 360;
   }
   break;
  case 4098:
   if (!Number.isFinite(value)) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.coneOuterAngle = value;
   if (src.panner) {
    src.panner.coneOuterAngle = value % 360;
   }
   break;
  case 4099:
   if (!Number.isFinite(value) || value <= 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   if (src.pitch === value) {
    break;
   }
   src.pitch = value;
   AL.updateSourceRate(src);
   break;
  case 4100:
   if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.position[0] = value[0];
   src.position[1] = value[1];
   src.position[2] = value[2];
   AL.updateSourceSpace(src);
   break;
  case 4101:
   if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.direction[0] = value[0];
   src.direction[1] = value[1];
   src.direction[2] = value[2];
   AL.updateSourceSpace(src);
   break;
  case 4102:
   if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.velocity[0] = value[0];
   src.velocity[1] = value[1];
   src.velocity[2] = value[2];
   AL.updateSourceSpace(src);
   break;
  case 4103:
   if (value === 1) {
    src.looping = true;
    AL.updateSourceTime(src);
    if (src.type === 4136 && src.audioQueue.length > 0) {
     var audioSrc = src.audioQueue[0];
     audioSrc.loop = true;
     audioSrc._duration = Number.POSITIVE_INFINITY;
    }
   } else if (value === 0) {
    src.looping = false;
    var currentTime = AL.updateSourceTime(src);
    if (src.type === 4136 && src.audioQueue.length > 0) {
     var audioSrc = src.audioQueue[0];
     audioSrc.loop = false;
     audioSrc._duration = src.bufQueue[0].audioBuf.duration / src.playbackRate;
     audioSrc._startTime = currentTime - src.bufOffset / src.playbackRate;
    }
   } else {
    AL.currentCtx.err = 40963;
    return;
   }
   break;
  case 4105:
   if (src.state === 4114 || src.state === 4115) {
    AL.currentCtx.err = 40964;
    return;
   }
   if (value === 0) {
    for (var i in src.bufQueue) {
     src.bufQueue[i].refCount--;
    }
    src.bufQueue.length = 1;
    src.bufQueue[0] = AL.buffers[0];
    src.bufsProcessed = 0;
    src.type = 4144;
   } else {
    var buf = AL.buffers[value];
    if (!buf) {
     AL.currentCtx.err = 40963;
     return;
    }
    for (var i in src.bufQueue) {
     src.bufQueue[i].refCount--;
    }
    src.bufQueue.length = 0;
    buf.refCount++;
    src.bufQueue = [ buf ];
    src.bufsProcessed = 0;
    src.type = 4136;
   }
   AL.initSourcePanner(src);
   AL.scheduleSourceAudio(src);
   break;
  case 4106:
   if (!Number.isFinite(value) || value < 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.gain.gain.value = value;
   break;
  case 4109:
   if (!Number.isFinite(value) || value < 0 || value > Math.min(src.maxGain, 1)) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.minGain = value;
   break;
  case 4110:
   if (!Number.isFinite(value) || value < Math.max(0, src.minGain) || value > 1) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.maxGain = value;
   break;
  case 4128:
   if (!Number.isFinite(value) || value < 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.refDistance = value;
   if (src.panner) {
    src.panner.refDistance = value;
   }
   break;
  case 4129:
   if (!Number.isFinite(value) || value < 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.rolloffFactor = value;
   if (src.panner) {
    src.panner.rolloffFactor = value;
   }
   break;
  case 4130:
   if (!Number.isFinite(value) || value < 0 || value > 1) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.coneOuterGain = value;
   if (src.panner) {
    src.panner.coneOuterGain = value;
   }
   break;
  case 4131:
   if (!Number.isFinite(value) || value < 0) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.maxDistance = value;
   if (src.panner) {
    src.panner.maxDistance = value;
   }
   break;
  case 4132:
   if (value < 0 || value > AL.sourceDuration(src)) {
    AL.currentCtx.err = 40963;
    return;
   }
   AL.sourceSeek(src, value);
   break;
  case 4133:
   var srcLen = AL.sourceDuration(src);
   if (srcLen > 0) {
    var frequency;
    for (var bufId in src.bufQueue) {
     if (bufId !== 0) {
      frequency = src.bufQueue[bufId].frequency;
      break;
     }
    }
    value /= frequency;
   }
   if (value < 0 || value > srcLen) {
    AL.currentCtx.err = 40963;
    return;
   }
   AL.sourceSeek(src, value);
   break;
  case 4134:
   var srcLen = AL.sourceDuration(src);
   if (srcLen > 0) {
    var bytesPerSec;
    for (var bufId in src.bufQueue) {
     if (bufId !== 0) {
      var buf = src.bufQueue[bufId];
      bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
      break;
     }
    }
    value /= bytesPerSec;
   }
   if (value < 0 || value > srcLen) {
    AL.currentCtx.err = 40963;
    return;
   }
   AL.sourceSeek(src, value);
   break;
  case 4628:
   if (value !== 0 && value !== 1 && value !== 2) {
    AL.currentCtx.err = 40963;
    return;
   }
   src.spatialize = value;
   AL.initSourcePanner(src);
   break;
  case 8201:
  case 8202:
  case 8203:
   AL.currentCtx.err = 40964;
   break;
  case 53248:
   switch (value) {
   case 0:
   case 53249:
   case 53250:
   case 53251:
   case 53252:
   case 53253:
   case 53254:
    src.distanceModel = value;
    if (AL.currentCtx.sourceDistanceModel) {
     AL.updateContextGlobal(AL.currentCtx);
    }
    break;
   default:
    AL.currentCtx.err = 40963;
    return;
   }
   break;
  default:
   AL.currentCtx.err = 40962;
   return;
  }
 }),
 captures: {},
 sharedCaptureAudioCtx: null,
 requireValidCaptureDevice: (function(deviceId, funcname) {
  if (deviceId === 0) {
   AL.alcErr = 40961;
   return null;
  }
  var c = AL.captures[deviceId];
  if (!c) {
   AL.alcErr = 40961;
   return null;
  }
  var err = c.mediaStreamError;
  if (err) {
   AL.alcErr = 40961;
   return null;
  }
  return c;
 })
};
function _alBufferData(bufferId, format, pData, size, freq) {
 if (!AL.currentCtx) {
  return;
 }
 var buf = AL.buffers[bufferId];
 if (!buf) {
  AL.currentCtx.err = 40963;
  return;
 }
 if (freq <= 0) {
  AL.currentCtx.err = 40963;
  return;
 }
 var audioBuf = null;
 try {
  switch (format) {
  case 4352:
   if (size > 0) {
    audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size, freq);
    var channel0 = audioBuf.getChannelData(0);
    for (var i = 0; i < size; ++i) {
     channel0[i] = HEAPU8[pData++] * .0078125 - 1;
    }
   }
   buf.bytesPerSample = 1;
   buf.channels = 1;
   buf.length = size;
   break;
  case 4353:
   if (size > 0) {
    audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 1, freq);
    var channel0 = audioBuf.getChannelData(0);
    pData >>= 1;
    for (var i = 0; i < size >> 1; ++i) {
     channel0[i] = HEAP16[pData++] * 30517578125e-15;
    }
   }
   buf.bytesPerSample = 2;
   buf.channels = 1;
   buf.length = size >> 1;
   break;
  case 4354:
   if (size > 0) {
    audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 1, freq);
    var channel0 = audioBuf.getChannelData(0);
    var channel1 = audioBuf.getChannelData(1);
    for (var i = 0; i < size >> 1; ++i) {
     channel0[i] = HEAPU8[pData++] * .0078125 - 1;
     channel1[i] = HEAPU8[pData++] * .0078125 - 1;
    }
   }
   buf.bytesPerSample = 1;
   buf.channels = 2;
   buf.length = size >> 1;
   break;
  case 4355:
   if (size > 0) {
    audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 2, freq);
    var channel0 = audioBuf.getChannelData(0);
    var channel1 = audioBuf.getChannelData(1);
    pData >>= 1;
    for (var i = 0; i < size >> 2; ++i) {
     channel0[i] = HEAP16[pData++] * 30517578125e-15;
     channel1[i] = HEAP16[pData++] * 30517578125e-15;
    }
   }
   buf.bytesPerSample = 2;
   buf.channels = 2;
   buf.length = size >> 2;
   break;
  case 65552:
   if (size > 0) {
    audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 2, freq);
    var channel0 = audioBuf.getChannelData(0);
    pData >>= 2;
    for (var i = 0; i < size >> 2; ++i) {
     channel0[i] = HEAPF32[pData++];
    }
   }
   buf.bytesPerSample = 4;
   buf.channels = 1;
   buf.length = size >> 2;
   break;
  case 65553:
   if (size > 0) {
    audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 3, freq);
    var channel0 = audioBuf.getChannelData(0);
    var channel1 = audioBuf.getChannelData(1);
    pData >>= 2;
    for (var i = 0; i < size >> 3; ++i) {
     channel0[i] = HEAPF32[pData++];
     channel1[i] = HEAPF32[pData++];
    }
   }
   buf.bytesPerSample = 4;
   buf.channels = 2;
   buf.length = size >> 3;
   break;
  default:
   AL.currentCtx.err = 40963;
   return;
  }
  buf.frequency = freq;
  buf.audioBuf = audioBuf;
 } catch (e) {
  AL.currentCtx.err = 40963;
  return;
 }
}
function _alDeleteBuffers(count, pBufferIds) {
 if (!AL.currentCtx) {
  return;
 }
 for (var i = 0; i < count; ++i) {
  var bufId = HEAP32[pBufferIds + i * 4 >> 2];
  if (bufId === 0) {
   continue;
  }
  if (!AL.buffers[bufId]) {
   AL.currentCtx.err = 40961;
   return;
  }
  if (AL.buffers[bufId].refCount) {
   AL.currentCtx.err = 40964;
   return;
  }
 }
 for (var i = 0; i < count; ++i) {
  var bufId = HEAP32[pBufferIds + i * 4 >> 2];
  if (bufId === 0) {
   continue;
  }
  AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
  delete AL.buffers[bufId];
  AL.freeIds.push(bufId);
 }
}
function _alSourcei(sourceId, param, value) {
 switch (param) {
 case 514:
 case 4097:
 case 4098:
 case 4103:
 case 4105:
 case 4128:
 case 4129:
 case 4131:
 case 4132:
 case 4133:
 case 4134:
 case 4628:
 case 8201:
 case 8202:
 case 53248:
  AL.setSourceParam("alSourcei", sourceId, param, value);
  break;
 default:
  AL.setSourceParam("alSourcei", sourceId, param, null);
  break;
 }
}
function _alDeleteSources(count, pSourceIds) {
 if (!AL.currentCtx) {
  return;
 }
 for (var i = 0; i < count; ++i) {
  var srcId = HEAP32[pSourceIds + i * 4 >> 2];
  if (!AL.currentCtx.sources[srcId]) {
   AL.currentCtx.err = 40961;
   return;
  }
 }
 for (var i = 0; i < count; ++i) {
  var srcId = HEAP32[pSourceIds + i * 4 >> 2];
  AL.setSourceState(AL.currentCtx.sources[srcId], 4116);
  _alSourcei(srcId, 4105, 0);
  delete AL.currentCtx.sources[srcId];
  AL.freeIds.push(srcId);
 }
}
function _alGenBuffers(count, pBufferIds) {
 if (!AL.currentCtx) {
  return;
 }
 for (var i = 0; i < count; ++i) {
  var buf = {
   deviceId: AL.currentCtx.deviceId,
   id: AL.newId(),
   refCount: 0,
   audioBuf: null,
   frequency: 0,
   bytesPerSample: 2,
   channels: 1,
   length: 0
  };
  AL.deviceRefCounts[buf.deviceId]++;
  AL.buffers[buf.id] = buf;
  HEAP32[pBufferIds + i * 4 >> 2] = buf.id;
 }
}
function _alGenSources(count, pSourceIds) {
 if (!AL.currentCtx) {
  return;
 }
 for (var i = 0; i < count; ++i) {
  var gain = AL.currentCtx.audioCtx.createGain();
  gain.connect(AL.currentCtx.gain);
  var src = {
   context: AL.currentCtx,
   id: AL.newId(),
   type: 4144,
   state: 4113,
   bufQueue: [ AL.buffers[0] ],
   audioQueue: [],
   looping: false,
   pitch: 1,
   dopplerShift: 1,
   gain: gain,
   minGain: 0,
   maxGain: 1,
   panner: null,
   bufsProcessed: 0,
   bufStartTime: Number.NEGATIVE_INFINITY,
   bufOffset: 0,
   relative: false,
   refDistance: 1,
   maxDistance: 3.40282e+38,
   rolloffFactor: 1,
   position: [ 0, 0, 0 ],
   velocity: [ 0, 0, 0 ],
   direction: [ 0, 0, 0 ],
   coneOuterGain: 0,
   coneInnerAngle: 360,
   coneOuterAngle: 360,
   distanceModel: 53250,
   spatialize: 2,
   get playbackRate() {
    return this.pitch * this.dopplerShift;
   }
  };
  AL.currentCtx.sources[src.id] = src;
  HEAP32[pSourceIds + i * 4 >> 2] = src.id;
 }
}
function _alGetBufferi(bufferId, param, pValue) {
 var val = AL.getBufferParam("alGetBufferi", bufferId, param);
 if (val === null) {
  return;
 }
 if (!pValue) {
  AL.currentCtx.err = 40963;
  return;
 }
 switch (param) {
 case 8193:
 case 8194:
 case 8195:
 case 8196:
  HEAP32[pValue >> 2] = val;
  break;
 default:
  AL.currentCtx.err = 40962;
  return;
 }
}
function _alGetEnumValue(pEnumName) {
 if (!AL.currentCtx) {
  return 0;
 }
 if (!pEnumName) {
  AL.currentCtx.err = 40963;
  return 0;
 }
 name = Pointer_stringify(pEnumName);
 switch (name) {
 case "AL_BITS":
  return 8194;
 case "AL_BUFFER":
  return 4105;
 case "AL_BUFFERS_PROCESSED":
  return 4118;
 case "AL_BUFFERS_QUEUED":
  return 4117;
 case "AL_BYTE_OFFSET":
  return 4134;
 case "AL_CHANNELS":
  return 8195;
 case "AL_CONE_INNER_ANGLE":
  return 4097;
 case "AL_CONE_OUTER_ANGLE":
  return 4098;
 case "AL_CONE_OUTER_GAIN":
  return 4130;
 case "AL_DIRECTION":
  return 4101;
 case "AL_DISTANCE_MODEL":
  return 53248;
 case "AL_DOPPLER_FACTOR":
  return 49152;
 case "AL_DOPPLER_VELOCITY":
  return 49153;
 case "AL_EXPONENT_DISTANCE":
  return 53253;
 case "AL_EXPONENT_DISTANCE_CLAMPED":
  return 53254;
 case "AL_EXTENSIONS":
  return 45060;
 case "AL_FORMAT_MONO16":
  return 4353;
 case "AL_FORMAT_MONO8":
  return 4352;
 case "AL_FORMAT_STEREO16":
  return 4355;
 case "AL_FORMAT_STEREO8":
  return 4354;
 case "AL_FREQUENCY":
  return 8193;
 case "AL_GAIN":
  return 4106;
 case "AL_INITIAL":
  return 4113;
 case "AL_INVALID":
  return -1;
 case "AL_ILLEGAL_ENUM":
 case "AL_INVALID_ENUM":
  return 40962;
 case "AL_INVALID_NAME":
  return 40961;
 case "AL_ILLEGAL_COMMAND":
 case "AL_INVALID_OPERATION":
  return 40964;
 case "AL_INVALID_VALUE":
  return 40963;
 case "AL_INVERSE_DISTANCE":
  return 53249;
 case "AL_INVERSE_DISTANCE_CLAMPED":
  return 53250;
 case "AL_LINEAR_DISTANCE":
  return 53251;
 case "AL_LINEAR_DISTANCE_CLAMPED":
  return 53252;
 case "AL_LOOPING":
  return 4103;
 case "AL_MAX_DISTANCE":
  return 4131;
 case "AL_MAX_GAIN":
  return 4110;
 case "AL_MIN_GAIN":
  return 4109;
 case "AL_NONE":
  return 0;
 case "AL_NO_ERROR":
  return 0;
 case "AL_ORIENTATION":
  return 4111;
 case "AL_OUT_OF_MEMORY":
  return 40965;
 case "AL_PAUSED":
  return 4115;
 case "AL_PENDING":
  return 8209;
 case "AL_PITCH":
  return 4099;
 case "AL_PLAYING":
  return 4114;
 case "AL_POSITION":
  return 4100;
 case "AL_PROCESSED":
  return 8210;
 case "AL_REFERENCE_DISTANCE":
  return 4128;
 case "AL_RENDERER":
  return 45059;
 case "AL_ROLLOFF_FACTOR":
  return 4129;
 case "AL_SAMPLE_OFFSET":
  return 4133;
 case "AL_SEC_OFFSET":
  return 4132;
 case "AL_SIZE":
  return 8196;
 case "AL_SOURCE_RELATIVE":
  return 514;
 case "AL_SOURCE_STATE":
  return 4112;
 case "AL_SOURCE_TYPE":
  return 4135;
 case "AL_SPEED_OF_SOUND":
  return 49155;
 case "AL_STATIC":
  return 4136;
 case "AL_STOPPED":
  return 4116;
 case "AL_STREAMING":
  return 4137;
 case "AL_UNDETERMINED":
  return 4144;
 case "AL_UNUSED":
  return 8208;
 case "AL_VELOCITY":
  return 4102;
 case "AL_VENDOR":
  return 45057;
 case "AL_VERSION":
  return 45058;
 case "AL_AUTO_SOFT":
  return 2;
 case "AL_SOURCE_DISTANCE_MODEL":
  return 512;
 case "AL_SOURCE_SPATIALIZE_SOFT":
  return 4628;
 case "AL_LOOP_POINTS_SOFT":
  return 8213;
 case "AL_BYTE_LENGTH_SOFT":
  return 8201;
 case "AL_SAMPLE_LENGTH_SOFT":
  return 8202;
 case "AL_SEC_LENGTH_SOFT":
  return 8203;
 case "AL_FORMAT_MONO_FLOAT32":
  return 65552;
 case "AL_FORMAT_STEREO_FLOAT32":
  return 65553;
 default:
  AL.currentCtx.err = 40963;
  return 0;
 }
}
function _alGetError() {
 if (!AL.currentCtx) {
  return 40964;
 } else {
  var err = AL.currentCtx.err;
  AL.currentCtx.err = 0;
  return err;
 }
}
function _alGetSourcef(sourceId, param, pValue) {
 var val = AL.getSourceParam("alGetSourcef", sourceId, param);
 if (val === null) {
  return;
 }
 if (!pValue) {
  AL.currentCtx.err = 40963;
  return;
 }
 switch (param) {
 case 4097:
 case 4098:
 case 4099:
 case 4106:
 case 4109:
 case 4110:
 case 4128:
 case 4129:
 case 4130:
 case 4131:
 case 4132:
 case 4133:
 case 4134:
 case 8203:
  HEAPF32[pValue >> 2] = val;
  break;
 default:
  AL.currentCtx.err = 40962;
  return;
 }
}
function _alGetSourcei(sourceId, param, pValue) {
 var val = AL.getSourceParam("alGetSourcei", sourceId, param);
 if (val === null) {
  return;
 }
 if (!pValue) {
  AL.currentCtx.err = 40963;
  return;
 }
 switch (param) {
 case 514:
 case 4097:
 case 4098:
 case 4103:
 case 4105:
 case 4112:
 case 4117:
 case 4118:
 case 4128:
 case 4129:
 case 4131:
 case 4132:
 case 4133:
 case 4134:
 case 4135:
 case 4628:
 case 8201:
 case 8202:
 case 53248:
  HEAP32[pValue >> 2] = val;
  break;
 default:
  AL.currentCtx.err = 40962;
  return;
 }
}
function _alListener3f(param, value0, value1, value2) {
 switch (param) {
 case 4100:
 case 4102:
  AL.paramArray[0] = value0;
  AL.paramArray[1] = value1;
  AL.paramArray[2] = value2;
  AL.setListenerParam("alListener3f", param, AL.paramArray);
  break;
 default:
  AL.setListenerParam("alListener3f", param, null);
  break;
 }
}
function _alListenerfv(param, pValues) {
 if (!AL.currentCtx) {
  return;
 }
 if (!pValues) {
  AL.currentCtx.err = 40963;
  return;
 }
 switch (param) {
 case 4100:
 case 4102:
  AL.paramArray[0] = HEAPF32[pValues >> 2];
  AL.paramArray[1] = HEAPF32[pValues + 4 >> 2];
  AL.paramArray[2] = HEAPF32[pValues + 8 >> 2];
  AL.setListenerParam("alListenerfv", param, AL.paramArray);
  break;
 case 4111:
  AL.paramArray[0] = HEAPF32[pValues >> 2];
  AL.paramArray[1] = HEAPF32[pValues + 4 >> 2];
  AL.paramArray[2] = HEAPF32[pValues + 8 >> 2];
  AL.paramArray[3] = HEAPF32[pValues + 12 >> 2];
  AL.paramArray[4] = HEAPF32[pValues + 16 >> 2];
  AL.paramArray[5] = HEAPF32[pValues + 20 >> 2];
  AL.setListenerParam("alListenerfv", param, AL.paramArray);
  break;
 default:
  AL.setListenerParam("alListenerfv", param, null);
  break;
 }
}
function _alSource3f(sourceId, param, value0, value1, value2) {
 switch (param) {
 case 4100:
 case 4101:
 case 4102:
  AL.paramArray[0] = value0;
  AL.paramArray[1] = value1;
  AL.paramArray[2] = value2;
  AL.setSourceParam("alSource3f", sourceId, param, AL.paramArray);
  break;
 default:
  AL.setSourceParam("alSource3f", sourceId, param, null);
  break;
 }
}
function _alSourcePause(sourceId) {
 if (!AL.currentCtx) {
  return;
 }
 var src = AL.currentCtx.sources[sourceId];
 if (!src) {
  AL.currentCtx.err = 40961;
  return;
 }
 AL.setSourceState(src, 4115);
}
function _alSourcePlay(sourceId) {
 if (!AL.currentCtx) {
  return;
 }
 var src = AL.currentCtx.sources[sourceId];
 if (!src) {
  AL.currentCtx.err = 40961;
  return;
 }
 AL.setSourceState(src, 4114);
}
function _alSourceQueueBuffers(sourceId, count, pBufferIds) {
 if (!AL.currentCtx) {
  return;
 }
 var src = AL.currentCtx.sources[sourceId];
 if (!src) {
  AL.currentCtx.err = 40961;
  return;
 }
 if (src.type === 4136) {
  AL.currentCtx.err = 40964;
  return;
 }
 if (count === 0) {
  return;
 }
 var templateBuf = AL.buffers[0];
 for (var i = 0; i < src.bufQueue.length; i++) {
  if (src.bufQueue[i].id !== 0) {
   templateBuf = src.bufQueue[i];
   break;
  }
 }
 for (var i = 0; i < count; ++i) {
  var bufId = HEAP32[pBufferIds + i * 4 >> 2];
  var buf = AL.buffers[bufId];
  if (!buf) {
   AL.currentCtx.err = 40961;
   return;
  }
  if (templateBuf.id !== 0 && (buf.frequency !== templateBuf.frequency || buf.bytesPerSample !== templateBuf.bytesPerSample || buf.channels !== templateBuf.channels)) {
   AL.currentCtx.err = 40964;
  }
 }
 if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
  src.bufQueue.length = 0;
 }
 src.type = 4137;
 for (var i = 0; i < count; ++i) {
  var bufId = HEAP32[pBufferIds + i * 4 >> 2];
  var buf = AL.buffers[bufId];
  buf.refCount++;
  src.bufQueue.push(buf);
 }
 if (src.looping) {
  AL.cancelPendingSourceAudio(src);
 }
 AL.initSourcePanner(src);
 AL.scheduleSourceAudio(src);
}
function _alSourceRewind(sourceId) {
 if (!AL.currentCtx) {
  return;
 }
 var src = AL.currentCtx.sources[sourceId];
 if (!src) {
  AL.currentCtx.err = 40961;
  return;
 }
 AL.setSourceState(src, 4116);
 AL.setSourceState(src, 4113);
}
function _alSourceStop(sourceId) {
 if (!AL.currentCtx) {
  return;
 }
 var src = AL.currentCtx.sources[sourceId];
 if (!src) {
  AL.currentCtx.err = 40961;
  return;
 }
 AL.setSourceState(src, 4116);
}
function _alSourceUnqueueBuffers(sourceId, count, pBufferIds) {
 if (!AL.currentCtx) {
  return;
 }
 var src = AL.currentCtx.sources[sourceId];
 if (!src) {
  AL.currentCtx.err = 40961;
  return;
 }
 if (count > (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 ? 0 : src.bufsProcessed)) {
  AL.currentCtx.err = 40963;
  return;
 }
 if (count === 0) {
  return;
 }
 for (var i = 0; i < count; i++) {
  var buf = src.bufQueue.shift();
  buf.refCount--;
  HEAP32[pBufferIds + i * 4 >> 2] = buf.id;
  src.bufsProcessed--;
 }
 if (src.bufQueue.length === 0) {
  src.bufQueue.push(AL.buffers[0]);
 }
 AL.initSourcePanner(src);
 AL.scheduleSourceAudio(src);
}
function _alSourcef(sourceId, param, value) {
 switch (param) {
 case 4097:
 case 4098:
 case 4099:
 case 4106:
 case 4109:
 case 4110:
 case 4128:
 case 4129:
 case 4130:
 case 4131:
 case 4132:
 case 4133:
 case 4134:
 case 8203:
  AL.setSourceParam("alSourcef", sourceId, param, value);
  break;
 default:
  AL.setSourceParam("alSourcef", sourceId, param, null);
  break;
 }
}
function _alcCloseDevice(deviceId) {
 if (!deviceId in AL.deviceRefCounts || AL.deviceRefCounts[deviceId] > 0) {
  return 0;
 }
 delete AL.deviceRefCounts[deviceId];
 AL.freeIds.push(deviceId);
 return 1;
}
function _alcCreateContext(deviceId, pAttrList) {
 if (!deviceId in AL.deviceRefCounts) {
  AL.alcErr = 40961;
  return 0;
 }
 var options = null;
 var attrs = [];
 var hrtf = null;
 pAttrList >>= 2;
 if (pAttrList) {
  var attr = 0;
  var val = 0;
  while (true) {
   attr = HEAP32[pAttrList++];
   attrs.push(attr);
   if (attr === 0) {
    break;
   }
   val = HEAP32[pAttrList++];
   attrs.push(val);
   switch (attr) {
   case 4103:
    if (!options) {
     options = {};
    }
    options.sampleRate = val;
    break;
   case 4112:
   case 4113:
    break;
   case 6546:
    switch (val) {
    case 0:
     hrtf = false;
     break;
    case 1:
     hrtf = true;
     break;
    case 2:
     break;
    default:
     AL.alcErr = 40964;
     return 0;
    }
    break;
   case 6550:
    if (val !== 0) {
     AL.alcErr = 40964;
     return 0;
    }
    break;
   default:
    AL.alcErr = 40964;
    return 0;
   }
  }
 }
 var AudioContext = window.AudioContext || window.webkitAudioContext;
 var ac = null;
 try {
  if (options) {
   ac = new AudioContext(options);
  } else {
   ac = new AudioContext;
  }
 } catch (e) {
  if (e.name === "NotSupportedError") {
   AL.alcErr = 40964;
  } else {
   AL.alcErr = 40961;
  }
  return 0;
 }
 if (typeof ac.createGain === "undefined") {
  ac.createGain = ac.createGainNode;
 }
 var gain = ac.createGain();
 gain.connect(ac.destination);
 ac.listener._position = [ 0, 0, 0 ];
 ac.listener._velocity = [ 0, 0, 0 ];
 ac.listener._direction = [ 0, 0, 0 ];
 ac.listener._up = [ 0, 0, 0 ];
 var ctx = {
  deviceId: deviceId,
  id: AL.newId(),
  attrs: attrs,
  audioCtx: ac,
  sources: [],
  interval: setInterval((function() {
   AL.scheduleContextAudio(ctx);
  }), AL.QUEUE_INTERVAL),
  gain: gain,
  distanceModel: 53250,
  speedOfSound: 343.3,
  dopplerFactor: 1,
  sourceDistanceModel: false,
  hrtf: hrtf || false,
  _err: 0,
  get err() {
   return this._err;
  },
  set err(val) {
   if (this._err === 0 || val === 0) {
    this._err = val;
   }
  }
 };
 AL.deviceRefCounts[deviceId]++;
 AL.contexts[ctx.id] = ctx;
 if (hrtf !== null) {
  for (var ctxId in AL.contexts) {
   var c = AL.contexts[ctxId];
   if (c.deviceId === deviceId) {
    c.hrtf = hrtf;
    AL.updateContextGlobal(c);
   }
  }
 }
 return ctx.id;
}
function _alcDestroyContext(contextId) {
 var ctx = AL.contexts[contextId];
 if (AL.currentCtx === ctx) {
  AL.alcErr = 40962;
  return;
 }
 if (AL.contexts[contextId].interval) {
  clearInterval(AL.contexts[contextId].interval);
 }
 AL.deviceRefCounts[ctx.deviceId]--;
 delete AL.contexts[contextId];
 AL.freeIds.push(contextId);
}
function _alcGetEnumValue(deviceId, pEnumName) {
 if (deviceId !== 0 && !deviceId in AL.deviceRefCounts) {
  return 0;
 } else if (!pEnumName) {
  AL.alcErr = 40964;
  return 0;
 }
 name = Pointer_stringify(pEnumName);
 switch (name) {
 case "ALC_NO_ERROR":
  return 0;
 case "ALC_INVALID_DEVICE":
  return 40961;
 case "ALC_INVALID_CONTEXT":
  return 40962;
 case "ALC_INVALID_ENUM":
  return 40963;
 case "ALC_INVALID_VALUE":
  return 40964;
 case "ALC_OUT_OF_MEMORY":
  return 40965;
 case "ALC_MAJOR_VERSION":
  return 4096;
 case "ALC_MINOR_VERSION":
  return 4097;
 case "ALC_ATTRIBUTES_SIZE":
  return 4098;
 case "ALC_ALL_ATTRIBUTES":
  return 4099;
 case "ALC_DEFAULT_DEVICE_SPECIFIER":
  return 4100;
 case "ALC_DEVICE_SPECIFIER":
  return 4101;
 case "ALC_EXTENSIONS":
  return 4102;
 case "ALC_FREQUENCY":
  return 4103;
 case "ALC_REFRESH":
  return 4104;
 case "ALC_SYNC":
  return 4105;
 case "ALC_MONO_SOURCES":
  return 4112;
 case "ALC_STEREO_SOURCES":
  return 4113;
 case "ALC_CAPTURE_DEVICE_SPECIFIER":
  return 784;
 case "ALC_CAPTURE_DEFAULT_DEVICE_SPECIFIER":
  return 785;
 case "ALC_CAPTURE_SAMPLES":
  return 786;
 case "ALC_HRTF_SOFT":
  return 6546;
 case "ALC_HRTF_ID_SOFT":
  return 6550;
 case "ALC_DONT_CARE_SOFT":
  return 2;
 case "ALC_HRTF_STATUS_SOFT":
  return 6547;
 case "ALC_NUM_HRTF_SPECIFIERS_SOFT":
  return 6548;
 case "ALC_HRTF_SPECIFIER_SOFT":
  return 6549;
 case "ALC_HRTF_DISABLED_SOFT":
  return 0;
 case "ALC_HRTF_ENABLED_SOFT":
  return 1;
 case "ALC_HRTF_DENIED_SOFT":
  return 2;
 case "ALC_HRTF_REQUIRED_SOFT":
  return 3;
 case "ALC_HRTF_HEADPHONES_DETECTED_SOFT":
  return 4;
 case "ALC_HRTF_UNSUPPORTED_FORMAT_SOFT":
  return 5;
 default:
  AL.alcErr = 40964;
  return 0;
 }
}
function _alcGetError(deviceId) {
 var err = AL.alcErr;
 AL.alcErr = 0;
 return err;
}
function _alcGetString(deviceId, param) {
 if (AL.alcStringCache[param]) {
  return AL.alcStringCache[param];
 }
 var ret;
 switch (param) {
 case 0:
  ret = "No Error";
  break;
 case 40961:
  ret = "Invalid Device";
  break;
 case 40962:
  ret = "Invalid Context";
  break;
 case 40963:
  ret = "Invalid Enum";
  break;
 case 40964:
  ret = "Invalid Value";
  break;
 case 40965:
  ret = "Out of Memory";
  break;
 case 4100:
  if (typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined") {
   ret = AL.DEVICE_NAME;
  } else {
   return 0;
  }
  break;
 case 4101:
  if (typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined") {
   ret = AL.DEVICE_NAME.concat(" ");
  } else {
   ret = " ";
  }
  break;
 case 785:
  ret = AL.CAPTURE_DEVICE_NAME;
  break;
 case 784:
  if (deviceId === 0) ret = AL.CAPTURE_DEVICE_NAME.concat(" "); else {
   var c = AL.requireValidCaptureDevice(deviceId, "alcGetString");
   if (!c) {
    return 0;
   }
   ret = c.deviceName;
  }
  break;
 case 4102:
  if (!deviceId) {
   AL.alcErr = 40961;
   return 0;
  }
  ret = "";
  for (var ext in AL.ALC_EXTENSIONS) {
   ret = ret.concat(ext);
   ret = ret.concat(" ");
  }
  ret = ret.trim();
  break;
 default:
  AL.alcErr = 40963;
  return 0;
 }
 ret = allocate(intArrayFromString(ret), "i8", ALLOC_NORMAL);
 AL.alcStringCache[param] = ret;
 return ret;
}
function _alcMakeContextCurrent(contextId) {
 if (contextId === 0) {
  AL.currentCtx = null;
  return 0;
 } else {
  AL.currentCtx = AL.contexts[contextId];
  return 1;
 }
}
function _alcOpenDevice(pDeviceName) {
 if (pDeviceName) {
  var name = Pointer_stringify(pDeviceName);
  if (name !== AL.DEVICE_NAME) {
   return 0;
  }
 }
 if (typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined") {
  var deviceId = AL.newId();
  AL.deviceRefCounts[deviceId] = 0;
  return deviceId;
 } else {
  return 0;
 }
}
function _atexit(func, arg) {
 __ATEXIT__.unshift({
  func: func,
  arg: arg
 });
}
function _clock() {
 if (_clock.start === undefined) _clock.start = Date.now();
 return (Date.now() - _clock.start) * (1e6 / 1e3) | 0;
}
function _difftime(time1, time0) {
 return time1 - time0;
}
var EGL = {
 errorCode: 12288,
 defaultDisplayInitialized: false,
 currentContext: 0,
 currentReadSurface: 0,
 currentDrawSurface: 0,
 stringCache: {},
 setErrorCode: (function(code) {
  EGL.errorCode = code;
 }),
 chooseConfig: (function(display, attribList, config, config_size, numConfigs) {
  if (display != 62e3) {
   EGL.setErrorCode(12296);
   return 0;
  }
  if ((!config || !config_size) && !numConfigs) {
   EGL.setErrorCode(12300);
   return 0;
  }
  if (numConfigs) {
   HEAP32[numConfigs >> 2] = 1;
  }
  if (config && config_size > 0) {
   HEAP32[config >> 2] = 62002;
  }
  EGL.setErrorCode(12288);
  return 1;
 })
};
function _eglChooseConfig(display, attrib_list, configs, config_size, numConfigs) {
 return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs);
}
var GLUT = {
 initTime: null,
 idleFunc: null,
 displayFunc: null,
 keyboardFunc: null,
 keyboardUpFunc: null,
 specialFunc: null,
 specialUpFunc: null,
 reshapeFunc: null,
 motionFunc: null,
 passiveMotionFunc: null,
 mouseFunc: null,
 buttons: 0,
 modifiers: 0,
 initWindowWidth: 256,
 initWindowHeight: 256,
 initDisplayMode: 18,
 windowX: 0,
 windowY: 0,
 windowWidth: 0,
 windowHeight: 0,
 requestedAnimationFrame: false,
 saveModifiers: (function(event) {
  GLUT.modifiers = 0;
  if (event["shiftKey"]) GLUT.modifiers += 1;
  if (event["ctrlKey"]) GLUT.modifiers += 2;
  if (event["altKey"]) GLUT.modifiers += 4;
 }),
 onMousemove: (function(event) {
  var lastX = Browser.mouseX;
  var lastY = Browser.mouseY;
  Browser.calculateMouseEvent(event);
  var newX = Browser.mouseX;
  var newY = Browser.mouseY;
  if (newX == lastX && newY == lastY) return;
  if (GLUT.buttons == 0 && event.target == Module["canvas"] && GLUT.passiveMotionFunc) {
   event.preventDefault();
   GLUT.saveModifiers(event);
   Module["dynCall_vii"](GLUT.passiveMotionFunc, lastX, lastY);
  } else if (GLUT.buttons != 0 && GLUT.motionFunc) {
   event.preventDefault();
   GLUT.saveModifiers(event);
   Module["dynCall_vii"](GLUT.motionFunc, lastX, lastY);
  }
 }),
 getSpecialKey: (function(keycode) {
  var key = null;
  switch (keycode) {
  case 8:
   key = 120;
   break;
  case 46:
   key = 111;
   break;
  case 112:
   key = 1;
   break;
  case 113:
   key = 2;
   break;
  case 114:
   key = 3;
   break;
  case 115:
   key = 4;
   break;
  case 116:
   key = 5;
   break;
  case 117:
   key = 6;
   break;
  case 118:
   key = 7;
   break;
  case 119:
   key = 8;
   break;
  case 120:
   key = 9;
   break;
  case 121:
   key = 10;
   break;
  case 122:
   key = 11;
   break;
  case 123:
   key = 12;
   break;
  case 37:
   key = 100;
   break;
  case 38:
   key = 101;
   break;
  case 39:
   key = 102;
   break;
  case 40:
   key = 103;
   break;
  case 33:
   key = 104;
   break;
  case 34:
   key = 105;
   break;
  case 36:
   key = 106;
   break;
  case 35:
   key = 107;
   break;
  case 45:
   key = 108;
   break;
  case 16:
  case 5:
   key = 112;
   break;
  case 6:
   key = 113;
   break;
  case 17:
  case 3:
   key = 114;
   break;
  case 4:
   key = 115;
   break;
  case 18:
  case 2:
   key = 116;
   break;
  case 1:
   key = 117;
   break;
  }
  return key;
 }),
 getASCIIKey: (function(event) {
  if (event["ctrlKey"] || event["altKey"] || event["metaKey"]) return null;
  var keycode = event["keyCode"];
  if (48 <= keycode && keycode <= 57) return keycode;
  if (65 <= keycode && keycode <= 90) return event["shiftKey"] ? keycode : keycode + 32;
  if (96 <= keycode && keycode <= 105) return keycode - 48;
  if (106 <= keycode && keycode <= 111) return keycode - 106 + 42;
  switch (keycode) {
  case 9:
  case 13:
  case 27:
  case 32:
  case 61:
   return keycode;
  }
  var s = event["shiftKey"];
  switch (keycode) {
  case 186:
   return s ? 58 : 59;
  case 187:
   return s ? 43 : 61;
  case 188:
   return s ? 60 : 44;
  case 189:
   return s ? 95 : 45;
  case 190:
   return s ? 62 : 46;
  case 191:
   return s ? 63 : 47;
  case 219:
   return s ? 123 : 91;
  case 220:
   return s ? 124 : 47;
  case 221:
   return s ? 125 : 93;
  case 222:
   return s ? 34 : 39;
  }
  return null;
 }),
 onKeydown: (function(event) {
  if (GLUT.specialFunc || GLUT.keyboardFunc) {
   var key = GLUT.getSpecialKey(event["keyCode"]);
   if (key !== null) {
    if (GLUT.specialFunc) {
     event.preventDefault();
     GLUT.saveModifiers(event);
     Module["dynCall_viii"](GLUT.specialFunc, key, Browser.mouseX, Browser.mouseY);
    }
   } else {
    key = GLUT.getASCIIKey(event);
    if (key !== null && GLUT.keyboardFunc) {
     event.preventDefault();
     GLUT.saveModifiers(event);
     Module["dynCall_viii"](GLUT.keyboardFunc, key, Browser.mouseX, Browser.mouseY);
    }
   }
  }
 }),
 onKeyup: (function(event) {
  if (GLUT.specialUpFunc || GLUT.keyboardUpFunc) {
   var key = GLUT.getSpecialKey(event["keyCode"]);
   if (key !== null) {
    if (GLUT.specialUpFunc) {
     event.preventDefault();
     GLUT.saveModifiers(event);
     Module["dynCall_viii"](GLUT.specialUpFunc, key, Browser.mouseX, Browser.mouseY);
    }
   } else {
    key = GLUT.getASCIIKey(event);
    if (key !== null && GLUT.keyboardUpFunc) {
     event.preventDefault();
     GLUT.saveModifiers(event);
     Module["dynCall_viii"](GLUT.keyboardUpFunc, key, Browser.mouseX, Browser.mouseY);
    }
   }
  }
 }),
 touchHandler: (function(event) {
  if (event.target != Module["canvas"]) {
   return;
  }
  var touches = event.changedTouches, main = touches[0], type = "";
  switch (event.type) {
  case "touchstart":
   type = "mousedown";
   break;
  case "touchmove":
   type = "mousemove";
   break;
  case "touchend":
   type = "mouseup";
   break;
  default:
   return;
  }
  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(type, true, true, window, 1, main.screenX, main.screenY, main.clientX, main.clientY, false, false, false, false, 0, null);
  main.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
 }),
 onMouseButtonDown: (function(event) {
  Browser.calculateMouseEvent(event);
  GLUT.buttons |= 1 << event["button"];
  if (event.target == Module["canvas"] && GLUT.mouseFunc) {
   try {
    event.target.setCapture();
   } catch (e) {}
   event.preventDefault();
   GLUT.saveModifiers(event);
   Module["dynCall_viiii"](GLUT.mouseFunc, event["button"], 0, Browser.mouseX, Browser.mouseY);
  }
 }),
 onMouseButtonUp: (function(event) {
  Browser.calculateMouseEvent(event);
  GLUT.buttons &= ~(1 << event["button"]);
  if (GLUT.mouseFunc) {
   event.preventDefault();
   GLUT.saveModifiers(event);
   Module["dynCall_viiii"](GLUT.mouseFunc, event["button"], 1, Browser.mouseX, Browser.mouseY);
  }
 }),
 onMouseWheel: (function(event) {
  Browser.calculateMouseEvent(event);
  var e = window.event || event;
  var delta = -Browser.getMouseWheelDelta(event);
  delta = delta == 0 ? 0 : delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1);
  var button = 3;
  if (delta < 0) {
   button = 4;
  }
  if (GLUT.mouseFunc) {
   event.preventDefault();
   GLUT.saveModifiers(event);
   Module["dynCall_viiii"](GLUT.mouseFunc, button, 0, Browser.mouseX, Browser.mouseY);
  }
 }),
 onFullscreenEventChange: (function(event) {
  var width;
  var height;
  if (document["fullscreen"] || document["fullScreen"] || document["mozFullScreen"] || document["webkitIsFullScreen"]) {
   width = screen["width"];
   height = screen["height"];
  } else {
   width = GLUT.windowWidth;
   height = GLUT.windowHeight;
   document.removeEventListener("fullscreenchange", GLUT.onFullscreenEventChange, true);
   document.removeEventListener("mozfullscreenchange", GLUT.onFullscreenEventChange, true);
   document.removeEventListener("webkitfullscreenchange", GLUT.onFullscreenEventChange, true);
  }
  Browser.setCanvasSize(width, height);
  if (GLUT.reshapeFunc) {
   Module["dynCall_vii"](GLUT.reshapeFunc, width, height);
  }
  _glutPostRedisplay();
 }),
 requestFullscreen: (function() {
  Browser.requestFullscreen(false, false);
 }),
 requestFullScreen: (function() {
  Module.printErr("GLUT.requestFullScreen() is deprecated. Please call GLUT.requestFullscreen instead.");
  GLUT.requestFullScreen = (function() {
   return GLUT.requestFullscreen();
  });
  return GLUT.requestFullscreen();
 }),
 exitFullscreen: (function() {
  var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["webkitCancelFullScreen"] || (function() {});
  CFS.apply(document, []);
 }),
 cancelFullScreen: (function() {
  Module.printErr("GLUT.cancelFullScreen() is deprecated. Please call GLUT.exitFullscreen instead.");
  GLUT.cancelFullScreen = (function() {
   return GLUT.exitFullscreen();
  });
  return GLUT.exitFullscreen();
 })
};
function _glutInitDisplayMode(mode) {
 GLUT.initDisplayMode = mode;
}
function _glutCreateWindow(name) {
 var contextAttributes = {
  antialias: (GLUT.initDisplayMode & 128) != 0,
  depth: (GLUT.initDisplayMode & 16) != 0,
  stencil: (GLUT.initDisplayMode & 32) != 0,
  alpha: (GLUT.initDisplayMode & 8) != 0
 };
 Module.ctx = Browser.createContext(Module["canvas"], true, true, contextAttributes);
 return Module.ctx ? 1 : 0;
}
var GL = {
 counter: 1,
 lastError: 0,
 buffers: [],
 mappedBuffers: {},
 programs: [],
 framebuffers: [],
 renderbuffers: [],
 textures: [],
 uniforms: [],
 shaders: [],
 vaos: [],
 contexts: [],
 currentContext: null,
 offscreenCanvases: {},
 timerQueriesEXT: [],
 queries: [],
 samplers: [],
 transformFeedbacks: [],
 syncs: [],
 byteSizeByTypeRoot: 5120,
 byteSizeByType: [ 1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8 ],
 programInfos: {},
 stringCache: {},
 stringiCache: {},
 tempFixedLengthArray: [],
 packAlignment: 4,
 unpackAlignment: 4,
 init: (function() {
  GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
  for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
   GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i + 1);
  }
  for (var i = 0; i < 32; i++) {
   GL.tempFixedLengthArray.push(new Array(i));
  }
 }),
 recordError: function recordError(errorCode) {
  if (!GL.lastError) {
   GL.lastError = errorCode;
  }
 },
 getNewId: (function(table) {
  var ret = GL.counter++;
  for (var i = table.length; i < ret; i++) {
   table[i] = null;
  }
  return ret;
 }),
 MINI_TEMP_BUFFER_SIZE: 256,
 miniTempBuffer: null,
 miniTempBufferViews: [ 0 ],
 getSource: (function(shader, count, string, length) {
  var source = "";
  for (var i = 0; i < count; ++i) {
   var frag;
   if (length) {
    var len = HEAP32[length + i * 4 >> 2];
    if (len < 0) {
     frag = Pointer_stringify(HEAP32[string + i * 4 >> 2]);
    } else {
     frag = Pointer_stringify(HEAP32[string + i * 4 >> 2], len);
    }
   } else {
    frag = Pointer_stringify(HEAP32[string + i * 4 >> 2]);
   }
   source += frag;
  }
  return source;
 }),
 createContext: (function(canvas, webGLContextAttributes) {
  if (typeof webGLContextAttributes["majorVersion"] === "undefined" && typeof webGLContextAttributes["minorVersion"] === "undefined") {
   if (typeof WebGL2RenderingContext !== "undefined") webGLContextAttributes["majorVersion"] = 2; else webGLContextAttributes["majorVersion"] = 1;
   webGLContextAttributes["minorVersion"] = 0;
  }
  var ctx;
  var errorInfo = "?";
  function onContextCreationError(event) {
   errorInfo = event.statusMessage || errorInfo;
  }
  try {
   canvas.addEventListener("webglcontextcreationerror", onContextCreationError, false);
   try {
    if (webGLContextAttributes["majorVersion"] == 1 && webGLContextAttributes["minorVersion"] == 0) {
     ctx = canvas.getContext("webgl", webGLContextAttributes) || canvas.getContext("experimental-webgl", webGLContextAttributes);
    } else if (webGLContextAttributes["majorVersion"] == 2 && webGLContextAttributes["minorVersion"] == 0) {
     ctx = canvas.getContext("webgl2", webGLContextAttributes);
    } else {
     throw "Unsupported WebGL context version " + majorVersion + "." + minorVersion + "!";
    }
   } finally {
    canvas.removeEventListener("webglcontextcreationerror", onContextCreationError, false);
   }
   if (!ctx) throw ":(";
  } catch (e) {
   Module.print("Could not create canvas: " + [ errorInfo, e, JSON.stringify(webGLContextAttributes) ]);
   return 0;
  }
  if (!ctx) return 0;
  var context = GL.registerContext(ctx, webGLContextAttributes);
  return context;
 }),
 registerContext: (function(ctx, webGLContextAttributes) {
  var handle = GL.getNewId(GL.contexts);
  var context = {
   handle: handle,
   attributes: webGLContextAttributes,
   version: webGLContextAttributes["majorVersion"],
   GLctx: ctx
  };
  function getChromeVersion() {
   var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
   return raw ? parseInt(raw[2], 10) : false;
  }
  context.supportsWebGL2EntryPoints = context.version >= 2 && (getChromeVersion() === false || getChromeVersion() >= 58);
  if (ctx.canvas) ctx.canvas.GLctxObject = context;
  GL.contexts[handle] = context;
  if (typeof webGLContextAttributes["enableExtensionsByDefault"] === "undefined" || webGLContextAttributes["enableExtensionsByDefault"]) {
   GL.initExtensions(context);
  }
  return handle;
 }),
 makeContextCurrent: (function(contextHandle) {
  var context = GL.contexts[contextHandle];
  if (!context) return false;
  GLctx = Module.ctx = context.GLctx;
  GL.currentContext = context;
  return true;
 }),
 getContext: (function(contextHandle) {
  return GL.contexts[contextHandle];
 }),
 deleteContext: (function(contextHandle) {
  if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
  if (typeof JSEvents === "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
  if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
  GL.contexts[contextHandle] = null;
 }),
 initExtensions: (function(context) {
  if (!context) context = GL.currentContext;
  if (context.initExtensionsDone) return;
  context.initExtensionsDone = true;
  var GLctx = context.GLctx;
  context.maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
  if (context.version < 2) {
   var instancedArraysExt = GLctx.getExtension("ANGLE_instanced_arrays");
   if (instancedArraysExt) {
    GLctx["vertexAttribDivisor"] = (function(index, divisor) {
     instancedArraysExt["vertexAttribDivisorANGLE"](index, divisor);
    });
    GLctx["drawArraysInstanced"] = (function(mode, first, count, primcount) {
     instancedArraysExt["drawArraysInstancedANGLE"](mode, first, count, primcount);
    });
    GLctx["drawElementsInstanced"] = (function(mode, count, type, indices, primcount) {
     instancedArraysExt["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
    });
   }
   var vaoExt = GLctx.getExtension("OES_vertex_array_object");
   if (vaoExt) {
    GLctx["createVertexArray"] = (function() {
     return vaoExt["createVertexArrayOES"]();
    });
    GLctx["deleteVertexArray"] = (function(vao) {
     vaoExt["deleteVertexArrayOES"](vao);
    });
    GLctx["bindVertexArray"] = (function(vao) {
     vaoExt["bindVertexArrayOES"](vao);
    });
    GLctx["isVertexArray"] = (function(vao) {
     return vaoExt["isVertexArrayOES"](vao);
    });
   }
   var drawBuffersExt = GLctx.getExtension("WEBGL_draw_buffers");
   if (drawBuffersExt) {
    GLctx["drawBuffers"] = (function(n, bufs) {
     drawBuffersExt["drawBuffersWEBGL"](n, bufs);
    });
   }
  }
  GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
  var automaticallyEnabledExtensions = [ "OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "OES_element_index_uint", "EXT_texture_filter_anisotropic", "ANGLE_instanced_arrays", "OES_texture_float_linear", "OES_texture_half_float_linear", "WEBGL_compressed_texture_atc", "WEBKIT_WEBGL_compressed_texture_pvrtc", "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float", "EXT_frag_depth", "EXT_sRGB", "WEBGL_draw_buffers", "WEBGL_shared_resources", "EXT_shader_texture_lod", "EXT_color_buffer_float" ];
  var exts = GLctx.getSupportedExtensions();
  if (exts && exts.length > 0) {
   GLctx.getSupportedExtensions().forEach((function(ext) {
    if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
     GLctx.getExtension(ext);
    }
   }));
  }
 }),
 populateUniformTable: (function(program) {
  var p = GL.programs[program];
  GL.programInfos[program] = {
   uniforms: {},
   maxUniformLength: 0,
   maxAttributeLength: -1,
   maxUniformBlockNameLength: -1
  };
  var ptable = GL.programInfos[program];
  var utable = ptable.uniforms;
  var numUniforms = GLctx.getProgramParameter(p, GLctx.ACTIVE_UNIFORMS);
  for (var i = 0; i < numUniforms; ++i) {
   var u = GLctx.getActiveUniform(p, i);
   var name = u.name;
   ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length + 1);
   if (name.indexOf("]", name.length - 1) !== -1) {
    var ls = name.lastIndexOf("[");
    name = name.slice(0, ls);
   }
   var loc = GLctx.getUniformLocation(p, name);
   if (loc != null) {
    var id = GL.getNewId(GL.uniforms);
    utable[name] = [ u.size, id ];
    GL.uniforms[id] = loc;
    for (var j = 1; j < u.size; ++j) {
     var n = name + "[" + j + "]";
     loc = GLctx.getUniformLocation(p, n);
     id = GL.getNewId(GL.uniforms);
     GL.uniforms[id] = loc;
    }
   }
  }
 })
};
function _eglCreateContext(display, config, hmm, contextAttribs) {
 if (display != 62e3) {
  EGL.setErrorCode(12296);
  return 0;
 }
 var glesContextVersion = 1;
 for (;;) {
  var param = HEAP32[contextAttribs >> 2];
  if (param == 12440) {
   glesContextVersion = HEAP32[contextAttribs + 4 >> 2];
  } else if (param == 12344) {
   break;
  } else {
   EGL.setErrorCode(12292);
   return 0;
  }
  contextAttribs += 8;
 }
 if (glesContextVersion != 2) {
  EGL.setErrorCode(12293);
  return 0;
 }
 _glutInitDisplayMode(178);
 EGL.windowID = _glutCreateWindow();
 if (EGL.windowID != 0) {
  EGL.setErrorCode(12288);
  return 62004;
 } else {
  EGL.setErrorCode(12297);
  return 0;
 }
}
function _eglCreateWindowSurface(display, config, win, attrib_list) {
 if (display != 62e3) {
  EGL.setErrorCode(12296);
  return 0;
 }
 if (config != 62002) {
  EGL.setErrorCode(12293);
  return 0;
 }
 EGL.setErrorCode(12288);
 return 62006;
}
function _eglDestroyContext(display, context) {
 if (display != 62e3) {
  EGL.setErrorCode(12296);
  return 0;
 }
 if (context != 62004) {
  EGL.setErrorCode(12294);
  return 0;
 }
 EGL.setErrorCode(12288);
 return 1;
}
function _eglDestroySurface(display, surface) {
 if (display != 62e3) {
  EGL.setErrorCode(12296);
  return 0;
 }
 if (surface != 62006) {
  EGL.setErrorCode(12301);
  return 1;
 }
 if (EGL.currentReadSurface == surface) {
  EGL.currentReadSurface = 0;
 }
 if (EGL.currentDrawSurface == surface) {
  EGL.currentDrawSurface = 0;
 }
 EGL.setErrorCode(12288);
 return 1;
}
function _eglGetDisplay(nativeDisplayType) {
 EGL.setErrorCode(12288);
 return 62e3;
}
function _eglGetProcAddress(name_) {
 return _emscripten_GetProcAddress(name_);
}
function _eglInitialize(display, majorVersion, minorVersion) {
 if (display == 62e3) {
  if (majorVersion) {
   HEAP32[majorVersion >> 2] = 1;
  }
  if (minorVersion) {
   HEAP32[minorVersion >> 2] = 4;
  }
  EGL.defaultDisplayInitialized = true;
  EGL.setErrorCode(12288);
  return 1;
 } else {
  EGL.setErrorCode(12296);
  return 0;
 }
}
function _eglMakeCurrent(display, draw, read, context) {
 if (display != 62e3) {
  EGL.setErrorCode(12296);
  return 0;
 }
 if (context != 0 && context != 62004) {
  EGL.setErrorCode(12294);
  return 0;
 }
 if (read != 0 && read != 62006 || draw != 0 && draw != 62006) {
  EGL.setErrorCode(12301);
  return 0;
 }
 EGL.currentContext = context;
 EGL.currentDrawSurface = draw;
 EGL.currentReadSurface = read;
 EGL.setErrorCode(12288);
 return 1;
}
function _eglQueryString(display, name) {
 if (display != 62e3) {
  EGL.setErrorCode(12296);
  return 0;
 }
 EGL.setErrorCode(12288);
 if (EGL.stringCache[name]) return EGL.stringCache[name];
 var ret;
 switch (name) {
 case 12371:
  ret = allocate(intArrayFromString("Emscripten"), "i8", ALLOC_NORMAL);
  break;
 case 12372:
  ret = allocate(intArrayFromString("1.4 Emscripten EGL"), "i8", ALLOC_NORMAL);
  break;
 case 12373:
  ret = allocate(intArrayFromString(""), "i8", ALLOC_NORMAL);
  break;
 case 12429:
  ret = allocate(intArrayFromString("OpenGL_ES"), "i8", ALLOC_NORMAL);
  break;
 default:
  EGL.setErrorCode(12300);
  return 0;
 }
 EGL.stringCache[name] = ret;
 return ret;
}
function _eglSwapBuffers() {
 if (!EGL.defaultDisplayInitialized) {
  EGL.setErrorCode(12289);
 } else if (!Module.ctx) {
  EGL.setErrorCode(12290);
 } else if (Module.ctx.isContextLost()) {
  EGL.setErrorCode(12302);
 } else {
  EGL.setErrorCode(12288);
  return 1;
 }
 return 0;
}
function _eglTerminate(display) {
 if (display != 62e3) {
  EGL.setErrorCode(12296);
  return 0;
 }
 EGL.currentContext = 0;
 EGL.currentReadSurface = 0;
 EGL.currentDrawSurface = 0;
 EGL.defaultDisplayInitialized = false;
 EGL.setErrorCode(12288);
 return 1;
}
var JSEvents = {
 keyEvent: 0,
 mouseEvent: 0,
 wheelEvent: 0,
 uiEvent: 0,
 focusEvent: 0,
 deviceOrientationEvent: 0,
 deviceMotionEvent: 0,
 fullscreenChangeEvent: 0,
 pointerlockChangeEvent: 0,
 visibilityChangeEvent: 0,
 touchEvent: 0,
 lastGamepadState: null,
 lastGamepadStateFrame: null,
 numGamepadsConnected: 0,
 previousFullscreenElement: null,
 previousScreenX: null,
 previousScreenY: null,
 removeEventListenersRegistered: false,
 staticInit: (function() {
  if (typeof window !== "undefined") {
   window.addEventListener("gamepadconnected", (function() {
    ++JSEvents.numGamepadsConnected;
   }));
   window.addEventListener("gamepaddisconnected", (function() {
    --JSEvents.numGamepadsConnected;
   }));
   var firstState = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null;
   if (firstState) {
    JSEvents.numGamepadsConnected = firstState.length;
   }
  }
 }),
 registerRemoveEventListeners: (function() {
  if (!JSEvents.removeEventListenersRegistered) {
   __ATEXIT__.push((function() {
    for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
     JSEvents._removeHandler(i);
    }
   }));
   JSEvents.removeEventListenersRegistered = true;
  }
 }),
 findEventTarget: (function(target) {
  if (target) {
   if (typeof target == "number") {
    target = Pointer_stringify(target);
   }
   if (target == "#window") return window; else if (target == "#document") return document; else if (target == "#screen") return window.screen; else if (target == "#canvas") return Module["canvas"];
   if (typeof target == "string") return document.getElementById(target); else return target;
  } else {
   return window;
  }
 }),
 deferredCalls: [],
 deferCall: (function(targetFunction, precedence, argsList) {
  function arraysHaveEqualContent(arrA, arrB) {
   if (arrA.length != arrB.length) return false;
   for (var i in arrA) {
    if (arrA[i] != arrB[i]) return false;
   }
   return true;
  }
  for (var i in JSEvents.deferredCalls) {
   var call = JSEvents.deferredCalls[i];
   if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
    return;
   }
  }
  JSEvents.deferredCalls.push({
   targetFunction: targetFunction,
   precedence: precedence,
   argsList: argsList
  });
  JSEvents.deferredCalls.sort((function(x, y) {
   return x.precedence < y.precedence;
  }));
 }),
 removeDeferredCalls: (function(targetFunction) {
  for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
   if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
    JSEvents.deferredCalls.splice(i, 1);
    --i;
   }
  }
 }),
 canPerformEventHandlerRequests: (function() {
  return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
 }),
 runDeferredCalls: (function() {
  if (!JSEvents.canPerformEventHandlerRequests()) {
   return;
  }
  for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
   var call = JSEvents.deferredCalls[i];
   JSEvents.deferredCalls.splice(i, 1);
   --i;
   call.targetFunction.apply(this, call.argsList);
  }
 }),
 inEventHandler: 0,
 currentEventHandler: null,
 eventHandlers: [],
 isInternetExplorer: (function() {
  return navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0;
 }),
 removeAllHandlersOnTarget: (function(target, eventTypeString) {
  for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
   if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
    JSEvents._removeHandler(i--);
   }
  }
 }),
 _removeHandler: (function(i) {
  var h = JSEvents.eventHandlers[i];
  h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
  JSEvents.eventHandlers.splice(i, 1);
 }),
 registerOrRemoveHandler: (function(eventHandler) {
  var jsEventHandler = function jsEventHandler(event) {
   ++JSEvents.inEventHandler;
   JSEvents.currentEventHandler = eventHandler;
   JSEvents.runDeferredCalls();
   eventHandler.handlerFunc(event);
   JSEvents.runDeferredCalls();
   --JSEvents.inEventHandler;
  };
  if (eventHandler.callbackfunc) {
   eventHandler.eventListenerFunc = jsEventHandler;
   eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
   JSEvents.eventHandlers.push(eventHandler);
   JSEvents.registerRemoveEventListeners();
  } else {
   for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
    if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
     JSEvents._removeHandler(i--);
    }
   }
  }
 }),
 registerKeyEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.keyEvent) {
   JSEvents.keyEvent = _malloc(164);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   stringToUTF8(e.key ? e.key : "", JSEvents.keyEvent + 0, 32);
   stringToUTF8(e.code ? e.code : "", JSEvents.keyEvent + 32, 32);
   HEAP32[JSEvents.keyEvent + 64 >> 2] = e.location;
   HEAP32[JSEvents.keyEvent + 68 >> 2] = e.ctrlKey;
   HEAP32[JSEvents.keyEvent + 72 >> 2] = e.shiftKey;
   HEAP32[JSEvents.keyEvent + 76 >> 2] = e.altKey;
   HEAP32[JSEvents.keyEvent + 80 >> 2] = e.metaKey;
   HEAP32[JSEvents.keyEvent + 84 >> 2] = e.repeat;
   stringToUTF8(e.locale ? e.locale : "", JSEvents.keyEvent + 88, 32);
   stringToUTF8(e.char ? e.char : "", JSEvents.keyEvent + 120, 32);
   HEAP32[JSEvents.keyEvent + 152 >> 2] = e.charCode;
   HEAP32[JSEvents.keyEvent + 156 >> 2] = e.keyCode;
   HEAP32[JSEvents.keyEvent + 160 >> 2] = e.which;
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.keyEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: JSEvents.findEventTarget(target),
   allowsDeferredCalls: JSEvents.isInternetExplorer() ? false : true,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 getBoundingClientRectOrZeros: (function(target) {
  return target.getBoundingClientRect ? target.getBoundingClientRect() : {
   left: 0,
   top: 0
  };
 }),
 fillMouseEventData: (function(eventStruct, e, target) {
  HEAPF64[eventStruct >> 3] = JSEvents.tick();
  HEAP32[eventStruct + 8 >> 2] = e.screenX;
  HEAP32[eventStruct + 12 >> 2] = e.screenY;
  HEAP32[eventStruct + 16 >> 2] = e.clientX;
  HEAP32[eventStruct + 20 >> 2] = e.clientY;
  HEAP32[eventStruct + 24 >> 2] = e.ctrlKey;
  HEAP32[eventStruct + 28 >> 2] = e.shiftKey;
  HEAP32[eventStruct + 32 >> 2] = e.altKey;
  HEAP32[eventStruct + 36 >> 2] = e.metaKey;
  HEAP16[eventStruct + 40 >> 1] = e.button;
  HEAP16[eventStruct + 42 >> 1] = e.buttons;
  HEAP32[eventStruct + 44 >> 2] = e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || e.screenX - JSEvents.previousScreenX;
  HEAP32[eventStruct + 48 >> 2] = e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || e.screenY - JSEvents.previousScreenY;
  if (Module["canvas"]) {
   var rect = Module["canvas"].getBoundingClientRect();
   HEAP32[eventStruct + 60 >> 2] = e.clientX - rect.left;
   HEAP32[eventStruct + 64 >> 2] = e.clientY - rect.top;
  } else {
   HEAP32[eventStruct + 60 >> 2] = 0;
   HEAP32[eventStruct + 64 >> 2] = 0;
  }
  if (target) {
   var rect = JSEvents.getBoundingClientRectOrZeros(target);
   HEAP32[eventStruct + 52 >> 2] = e.clientX - rect.left;
   HEAP32[eventStruct + 56 >> 2] = e.clientY - rect.top;
  } else {
   HEAP32[eventStruct + 52 >> 2] = 0;
   HEAP32[eventStruct + 56 >> 2] = 0;
  }
  if (e.type !== "wheel" && e.type !== "mousewheel") {
   JSEvents.previousScreenX = e.screenX;
   JSEvents.previousScreenY = e.screenY;
  }
 }),
 registerMouseEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.mouseEvent) {
   JSEvents.mouseEvent = _malloc(72);
  }
  target = JSEvents.findEventTarget(target);
  var handlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillMouseEventData(JSEvents.mouseEvent, e, target);
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.mouseEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: target,
   allowsDeferredCalls: eventTypeString != "mousemove" && eventTypeString != "mouseenter" && eventTypeString != "mouseleave",
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  if (JSEvents.isInternetExplorer() && eventTypeString == "mousedown") eventHandler.allowsDeferredCalls = false;
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 registerWheelEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.wheelEvent) {
   JSEvents.wheelEvent = _malloc(104);
  }
  target = JSEvents.findEventTarget(target);
  var wheelHandlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillMouseEventData(JSEvents.wheelEvent, e, target);
   HEAPF64[JSEvents.wheelEvent + 72 >> 3] = e["deltaX"];
   HEAPF64[JSEvents.wheelEvent + 80 >> 3] = e["deltaY"];
   HEAPF64[JSEvents.wheelEvent + 88 >> 3] = e["deltaZ"];
   HEAP32[JSEvents.wheelEvent + 96 >> 2] = e["deltaMode"];
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.wheelEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var mouseWheelHandlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillMouseEventData(JSEvents.wheelEvent, e, target);
   HEAPF64[JSEvents.wheelEvent + 72 >> 3] = e["wheelDeltaX"] || 0;
   HEAPF64[JSEvents.wheelEvent + 80 >> 3] = -(e["wheelDeltaY"] ? e["wheelDeltaY"] : e["wheelDelta"]);
   HEAPF64[JSEvents.wheelEvent + 88 >> 3] = 0;
   HEAP32[JSEvents.wheelEvent + 96 >> 2] = 0;
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.wheelEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: target,
   allowsDeferredCalls: true,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: eventTypeString == "wheel" ? wheelHandlerFunc : mouseWheelHandlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 pageScrollPos: (function() {
  if (window.pageXOffset > 0 || window.pageYOffset > 0) {
   return [ window.pageXOffset, window.pageYOffset ];
  }
  if (typeof document.documentElement.scrollLeft !== "undefined" || typeof document.documentElement.scrollTop !== "undefined") {
   return [ document.documentElement.scrollLeft, document.documentElement.scrollTop ];
  }
  return [ document.body.scrollLeft | 0, document.body.scrollTop | 0 ];
 }),
 registerUiEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.uiEvent) {
   JSEvents.uiEvent = _malloc(36);
  }
  if (eventTypeString == "scroll" && !target) {
   target = document;
  } else {
   target = JSEvents.findEventTarget(target);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   if (e.target != target) {
    return;
   }
   var scrollPos = JSEvents.pageScrollPos();
   HEAP32[JSEvents.uiEvent >> 2] = e.detail;
   HEAP32[JSEvents.uiEvent + 4 >> 2] = document.body.clientWidth;
   HEAP32[JSEvents.uiEvent + 8 >> 2] = document.body.clientHeight;
   HEAP32[JSEvents.uiEvent + 12 >> 2] = window.innerWidth;
   HEAP32[JSEvents.uiEvent + 16 >> 2] = window.innerHeight;
   HEAP32[JSEvents.uiEvent + 20 >> 2] = window.outerWidth;
   HEAP32[JSEvents.uiEvent + 24 >> 2] = window.outerHeight;
   HEAP32[JSEvents.uiEvent + 28 >> 2] = scrollPos[0];
   HEAP32[JSEvents.uiEvent + 32 >> 2] = scrollPos[1];
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.uiEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: target,
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 getNodeNameForTarget: (function(target) {
  if (!target) return "";
  if (target == window) return "#window";
  if (target == window.screen) return "#screen";
  return target && target.nodeName ? target.nodeName : "";
 }),
 registerFocusEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.focusEvent) {
   JSEvents.focusEvent = _malloc(256);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   var nodeName = JSEvents.getNodeNameForTarget(e.target);
   var id = e.target.id ? e.target.id : "";
   stringToUTF8(nodeName, JSEvents.focusEvent + 0, 128);
   stringToUTF8(id, JSEvents.focusEvent + 128, 128);
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.focusEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: JSEvents.findEventTarget(target),
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 tick: (function() {
  if (window["performance"] && window["performance"]["now"]) return window["performance"]["now"](); else return Date.now();
 }),
 registerDeviceOrientationEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.deviceOrientationEvent) {
   JSEvents.deviceOrientationEvent = _malloc(40);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   HEAPF64[JSEvents.deviceOrientationEvent >> 3] = JSEvents.tick();
   HEAPF64[JSEvents.deviceOrientationEvent + 8 >> 3] = e.alpha;
   HEAPF64[JSEvents.deviceOrientationEvent + 16 >> 3] = e.beta;
   HEAPF64[JSEvents.deviceOrientationEvent + 24 >> 3] = e.gamma;
   HEAP32[JSEvents.deviceOrientationEvent + 32 >> 2] = e.absolute;
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.deviceOrientationEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: JSEvents.findEventTarget(target),
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 registerDeviceMotionEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.deviceMotionEvent) {
   JSEvents.deviceMotionEvent = _malloc(80);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   HEAPF64[JSEvents.deviceMotionEvent >> 3] = JSEvents.tick();
   HEAPF64[JSEvents.deviceMotionEvent + 8 >> 3] = e.acceleration.x;
   HEAPF64[JSEvents.deviceMotionEvent + 16 >> 3] = e.acceleration.y;
   HEAPF64[JSEvents.deviceMotionEvent + 24 >> 3] = e.acceleration.z;
   HEAPF64[JSEvents.deviceMotionEvent + 32 >> 3] = e.accelerationIncludingGravity.x;
   HEAPF64[JSEvents.deviceMotionEvent + 40 >> 3] = e.accelerationIncludingGravity.y;
   HEAPF64[JSEvents.deviceMotionEvent + 48 >> 3] = e.accelerationIncludingGravity.z;
   HEAPF64[JSEvents.deviceMotionEvent + 56 >> 3] = e.rotationRate.alpha;
   HEAPF64[JSEvents.deviceMotionEvent + 64 >> 3] = e.rotationRate.beta;
   HEAPF64[JSEvents.deviceMotionEvent + 72 >> 3] = e.rotationRate.gamma;
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.deviceMotionEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: JSEvents.findEventTarget(target),
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 screenOrientation: (function() {
  if (!window.screen) return undefined;
  return window.screen.orientation || window.screen.mozOrientation || window.screen.webkitOrientation || window.screen.msOrientation;
 }),
 fillOrientationChangeEventData: (function(eventStruct, e) {
  var orientations = [ "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary" ];
  var orientations2 = [ "portrait", "portrait", "landscape", "landscape" ];
  var orientationString = JSEvents.screenOrientation();
  var orientation = orientations.indexOf(orientationString);
  if (orientation == -1) {
   orientation = orientations2.indexOf(orientationString);
  }
  HEAP32[eventStruct >> 2] = 1 << orientation;
  HEAP32[eventStruct + 4 >> 2] = window.orientation;
 }),
 registerOrientationChangeEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.orientationChangeEvent) {
   JSEvents.orientationChangeEvent = _malloc(8);
  }
  if (!target) {
   target = window.screen;
  } else {
   target = JSEvents.findEventTarget(target);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillOrientationChangeEventData(JSEvents.orientationChangeEvent, e);
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.orientationChangeEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  if (eventTypeString == "orientationchange" && window.screen.mozOrientation !== undefined) {
   eventTypeString = "mozorientationchange";
  }
  var eventHandler = {
   target: target,
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 fullscreenEnabled: (function() {
  return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
 }),
 fillFullscreenChangeEventData: (function(eventStruct, e) {
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  var isFullscreen = !!fullscreenElement;
  HEAP32[eventStruct >> 2] = isFullscreen;
  HEAP32[eventStruct + 4 >> 2] = JSEvents.fullscreenEnabled();
  var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
  var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
  var id = reportedElement && reportedElement.id ? reportedElement.id : "";
  stringToUTF8(nodeName, eventStruct + 8, 128);
  stringToUTF8(id, eventStruct + 136, 128);
  HEAP32[eventStruct + 264 >> 2] = reportedElement ? reportedElement.clientWidth : 0;
  HEAP32[eventStruct + 268 >> 2] = reportedElement ? reportedElement.clientHeight : 0;
  HEAP32[eventStruct + 272 >> 2] = screen.width;
  HEAP32[eventStruct + 276 >> 2] = screen.height;
  if (isFullscreen) {
   JSEvents.previousFullscreenElement = fullscreenElement;
  }
 }),
 registerFullscreenChangeEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.fullscreenChangeEvent) {
   JSEvents.fullscreenChangeEvent = _malloc(280);
  }
  if (!target) {
   target = document;
  } else {
   target = JSEvents.findEventTarget(target);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillFullscreenChangeEventData(JSEvents.fullscreenChangeEvent, e);
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.fullscreenChangeEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: target,
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 resizeCanvasForFullscreen: (function(target, strategy) {
  var restoreOldStyle = __registerRestoreOldStyle(target);
  var cssWidth = strategy.softFullscreen ? window.innerWidth : screen.width;
  var cssHeight = strategy.softFullscreen ? window.innerHeight : screen.height;
  var rect = target.getBoundingClientRect();
  var windowedCssWidth = rect.right - rect.left;
  var windowedCssHeight = rect.bottom - rect.top;
  var windowedRttWidth = target.width;
  var windowedRttHeight = target.height;
  if (strategy.scaleMode == 3) {
   __setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
   cssWidth = windowedCssWidth;
   cssHeight = windowedCssHeight;
  } else if (strategy.scaleMode == 2) {
   if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
    var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
    __setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
    cssHeight = desiredCssHeight;
   } else {
    var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
    __setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
    cssWidth = desiredCssWidth;
   }
  }
  if (!target.style.backgroundColor) target.style.backgroundColor = "black";
  if (!document.body.style.backgroundColor) document.body.style.backgroundColor = "black";
  target.style.width = cssWidth + "px";
  target.style.height = cssHeight + "px";
  if (strategy.filteringMode == 1) {
   target.style.imageRendering = "optimizeSpeed";
   target.style.imageRendering = "-moz-crisp-edges";
   target.style.imageRendering = "-o-crisp-edges";
   target.style.imageRendering = "-webkit-optimize-contrast";
   target.style.imageRendering = "optimize-contrast";
   target.style.imageRendering = "crisp-edges";
   target.style.imageRendering = "pixelated";
  }
  var dpiScale = strategy.canvasResolutionScaleMode == 2 ? window.devicePixelRatio : 1;
  if (strategy.canvasResolutionScaleMode != 0) {
   target.width = cssWidth * dpiScale;
   target.height = cssHeight * dpiScale;
   if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, target.width, target.height);
  }
  return restoreOldStyle;
 }),
 requestFullscreen: (function(target, strategy) {
  if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
   JSEvents.resizeCanvasForFullscreen(target, strategy);
  }
  if (target.requestFullscreen) {
   target.requestFullscreen();
  } else if (target.msRequestFullscreen) {
   target.msRequestFullscreen();
  } else if (target.mozRequestFullScreen) {
   target.mozRequestFullScreen();
  } else if (target.mozRequestFullscreen) {
   target.mozRequestFullscreen();
  } else if (target.webkitRequestFullscreen) {
   target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
   if (typeof JSEvents.fullscreenEnabled() === "undefined") {
    return -1;
   } else {
    return -3;
   }
  }
  if (strategy.canvasResizedCallback) {
   Module["dynCall_iiii"](strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData);
  }
  return 0;
 }),
 fillPointerlockChangeEventData: (function(eventStruct, e) {
  var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
  var isPointerlocked = !!pointerLockElement;
  HEAP32[eventStruct >> 2] = isPointerlocked;
  var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
  var id = pointerLockElement && pointerLockElement.id ? pointerLockElement.id : "";
  stringToUTF8(nodeName, eventStruct + 4, 128);
  stringToUTF8(id, eventStruct + 132, 128);
 }),
 registerPointerlockChangeEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.pointerlockChangeEvent) {
   JSEvents.pointerlockChangeEvent = _malloc(260);
  }
  if (!target) {
   target = document;
  } else {
   target = JSEvents.findEventTarget(target);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillPointerlockChangeEventData(JSEvents.pointerlockChangeEvent, e);
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.pointerlockChangeEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: target,
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 registerPointerlockErrorEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!target) {
   target = document;
  } else {
   target = JSEvents.findEventTarget(target);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, 0, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: target,
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 requestPointerLock: (function(target) {
  if (target.requestPointerLock) {
   target.requestPointerLock();
  } else if (target.mozRequestPointerLock) {
   target.mozRequestPointerLock();
  } else if (target.webkitRequestPointerLock) {
   target.webkitRequestPointerLock();
  } else if (target.msRequestPointerLock) {
   target.msRequestPointerLock();
  } else {
   if (document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock || document.body.msRequestPointerLock) {
    return -3;
   } else {
    return -1;
   }
  }
  return 0;
 }),
 fillVisibilityChangeEventData: (function(eventStruct, e) {
  var visibilityStates = [ "hidden", "visible", "prerender", "unloaded" ];
  var visibilityState = visibilityStates.indexOf(document.visibilityState);
  HEAP32[eventStruct >> 2] = document.hidden;
  HEAP32[eventStruct + 4 >> 2] = visibilityState;
 }),
 registerVisibilityChangeEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.visibilityChangeEvent) {
   JSEvents.visibilityChangeEvent = _malloc(8);
  }
  if (!target) {
   target = document;
  } else {
   target = JSEvents.findEventTarget(target);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillVisibilityChangeEventData(JSEvents.visibilityChangeEvent, e);
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.visibilityChangeEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: target,
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 registerTouchEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.touchEvent) {
   JSEvents.touchEvent = _malloc(1684);
  }
  target = JSEvents.findEventTarget(target);
  var handlerFunc = (function(event) {
   var e = event || window.event;
   var touches = {};
   for (var i = 0; i < e.touches.length; ++i) {
    var touch = e.touches[i];
    touches[touch.identifier] = touch;
   }
   for (var i = 0; i < e.changedTouches.length; ++i) {
    var touch = e.changedTouches[i];
    touches[touch.identifier] = touch;
    touch.changed = true;
   }
   for (var i = 0; i < e.targetTouches.length; ++i) {
    var touch = e.targetTouches[i];
    touches[touch.identifier].onTarget = true;
   }
   var ptr = JSEvents.touchEvent;
   HEAP32[ptr + 4 >> 2] = e.ctrlKey;
   HEAP32[ptr + 8 >> 2] = e.shiftKey;
   HEAP32[ptr + 12 >> 2] = e.altKey;
   HEAP32[ptr + 16 >> 2] = e.metaKey;
   ptr += 20;
   var canvasRect = Module["canvas"] ? Module["canvas"].getBoundingClientRect() : undefined;
   var targetRect = JSEvents.getBoundingClientRectOrZeros(target);
   var numTouches = 0;
   for (var i in touches) {
    var t = touches[i];
    HEAP32[ptr >> 2] = t.identifier;
    HEAP32[ptr + 4 >> 2] = t.screenX;
    HEAP32[ptr + 8 >> 2] = t.screenY;
    HEAP32[ptr + 12 >> 2] = t.clientX;
    HEAP32[ptr + 16 >> 2] = t.clientY;
    HEAP32[ptr + 20 >> 2] = t.pageX;
    HEAP32[ptr + 24 >> 2] = t.pageY;
    HEAP32[ptr + 28 >> 2] = t.changed;
    HEAP32[ptr + 32 >> 2] = t.onTarget;
    if (canvasRect) {
     HEAP32[ptr + 44 >> 2] = t.clientX - canvasRect.left;
     HEAP32[ptr + 48 >> 2] = t.clientY - canvasRect.top;
    } else {
     HEAP32[ptr + 44 >> 2] = 0;
     HEAP32[ptr + 48 >> 2] = 0;
    }
    HEAP32[ptr + 36 >> 2] = t.clientX - targetRect.left;
    HEAP32[ptr + 40 >> 2] = t.clientY - targetRect.top;
    ptr += 52;
    if (++numTouches >= 32) {
     break;
    }
   }
   HEAP32[JSEvents.touchEvent >> 2] = numTouches;
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.touchEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: target,
   allowsDeferredCalls: eventTypeString == "touchstart" || eventTypeString == "touchend",
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 fillGamepadEventData: (function(eventStruct, e) {
  HEAPF64[eventStruct >> 3] = e.timestamp;
  for (var i = 0; i < e.axes.length; ++i) {
   HEAPF64[eventStruct + i * 8 + 16 >> 3] = e.axes[i];
  }
  for (var i = 0; i < e.buttons.length; ++i) {
   if (typeof e.buttons[i] === "object") {
    HEAPF64[eventStruct + i * 8 + 528 >> 3] = e.buttons[i].value;
   } else {
    HEAPF64[eventStruct + i * 8 + 528 >> 3] = e.buttons[i];
   }
  }
  for (var i = 0; i < e.buttons.length; ++i) {
   if (typeof e.buttons[i] === "object") {
    HEAP32[eventStruct + i * 4 + 1040 >> 2] = e.buttons[i].pressed;
   } else {
    HEAP32[eventStruct + i * 4 + 1040 >> 2] = e.buttons[i] == 1;
   }
  }
  HEAP32[eventStruct + 1296 >> 2] = e.connected;
  HEAP32[eventStruct + 1300 >> 2] = e.index;
  HEAP32[eventStruct + 8 >> 2] = e.axes.length;
  HEAP32[eventStruct + 12 >> 2] = e.buttons.length;
  stringToUTF8(e.id, eventStruct + 1304, 64);
  stringToUTF8(e.mapping, eventStruct + 1368, 64);
 }),
 registerGamepadEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.gamepadEvent) {
   JSEvents.gamepadEvent = _malloc(1432);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillGamepadEventData(JSEvents.gamepadEvent, e.gamepad);
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.gamepadEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: JSEvents.findEventTarget(target),
   allowsDeferredCalls: true,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 registerBeforeUnloadEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  var handlerFunc = (function(event) {
   var e = event || window.event;
   var confirmationMessage = Module["dynCall_iiii"](callbackfunc, eventTypeId, 0, userData);
   if (confirmationMessage) {
    confirmationMessage = Pointer_stringify(confirmationMessage);
   }
   if (confirmationMessage) {
    e.preventDefault();
    e.returnValue = confirmationMessage;
    return confirmationMessage;
   }
  });
  var eventHandler = {
   target: JSEvents.findEventTarget(target),
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 battery: (function() {
  return navigator.battery || navigator.mozBattery || navigator.webkitBattery;
 }),
 fillBatteryEventData: (function(eventStruct, e) {
  HEAPF64[eventStruct >> 3] = e.chargingTime;
  HEAPF64[eventStruct + 8 >> 3] = e.dischargingTime;
  HEAPF64[eventStruct + 16 >> 3] = e.level;
  HEAP32[eventStruct + 24 >> 2] = e.charging;
 }),
 registerBatteryEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!JSEvents.batteryEvent) {
   JSEvents.batteryEvent = _malloc(32);
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   JSEvents.fillBatteryEventData(JSEvents.batteryEvent, JSEvents.battery());
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.batteryEvent, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: JSEvents.findEventTarget(target),
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 }),
 registerWebGlEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
  if (!target) {
   target = Module["canvas"];
  }
  var handlerFunc = (function(event) {
   var e = event || window.event;
   var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, 0, userData);
   if (shouldCancel) {
    e.preventDefault();
   }
  });
  var eventHandler = {
   target: JSEvents.findEventTarget(target),
   allowsDeferredCalls: false,
   eventTypeString: eventTypeString,
   callbackfunc: callbackfunc,
   handlerFunc: handlerFunc,
   useCapture: useCapture
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
 })
};
function _emscripten_exit_pointerlock() {
 JSEvents.removeDeferredCalls(JSEvents.requestPointerLock);
 if (document.exitPointerLock) {
  document.exitPointerLock();
 } else if (document.msExitPointerLock) {
  document.msExitPointerLock();
 } else if (document.mozExitPointerLock) {
  document.mozExitPointerLock();
 } else if (document.webkitExitPointerLock) {
  document.webkitExitPointerLock();
 } else {
  return -1;
 }
 return 0;
}
function _emscripten_get_element_css_size(target, width, height) {
 if (!target) {
  target = Module["canvas"];
 } else {
  target = JSEvents.findEventTarget(target);
 }
 if (!target) return -4;
 if (target.getBoundingClientRect) {
  var rect = target.getBoundingClientRect();
  HEAPF64[width >> 3] = rect.right - rect.left;
  HEAPF64[height >> 3] = rect.bottom - rect.top;
 } else {
  HEAPF64[width >> 3] = target.clientWidth;
  HEAPF64[height >> 3] = target.clientHeight;
 }
 return 0;
}
function _emscripten_get_pointerlock_status(pointerlockStatus) {
 if (pointerlockStatus) JSEvents.fillPointerlockChangeEventData(pointerlockStatus);
 if (!document.body || !document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock) {
  return -1;
 }
 return 0;
}
function _emscripten_glActiveTexture(x0) {
 GLctx["activeTexture"](x0);
}
function _emscripten_glAttachShader(program, shader) {
 GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
}
function _emscripten_glBindAttribLocation(program, index, name) {
 name = Pointer_stringify(name);
 GLctx.bindAttribLocation(GL.programs[program], index, name);
}
function _emscripten_glBindBuffer(target, buffer) {
 var bufferObj = buffer ? GL.buffers[buffer] : null;
 if (target == 35051) {
  GLctx.currentPixelPackBufferBinding = buffer;
 } else if (target == 35052) {
  GLctx.currentPixelUnpackBufferBinding = buffer;
 }
 GLctx.bindBuffer(target, bufferObj);
}
function _emscripten_glBindFramebuffer(target, framebuffer) {
 GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : null);
}
function _emscripten_glBindProgramARB() {
 Module["printErr"]("missing function: emscripten_glBindProgramARB");
 abort(-1);
}
function _emscripten_glBindRenderbuffer(target, renderbuffer) {
 GLctx.bindRenderbuffer(target, renderbuffer ? GL.renderbuffers[renderbuffer] : null);
}
function _emscripten_glBindTexture(target, texture) {
 GLctx.bindTexture(target, texture ? GL.textures[texture] : null);
}
function _emscripten_glBindVertexArray(vao) {
 GLctx["bindVertexArray"](GL.vaos[vao]);
}
function _emscripten_glBlendColor(x0, x1, x2, x3) {
 GLctx["blendColor"](x0, x1, x2, x3);
}
function _emscripten_glBlendEquation(x0) {
 GLctx["blendEquation"](x0);
}
function _emscripten_glBlendEquationSeparate(x0, x1) {
 GLctx["blendEquationSeparate"](x0, x1);
}
function _emscripten_glBlendFunc(x0, x1) {
 GLctx["blendFunc"](x0, x1);
}
function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) {
 GLctx["blendFuncSeparate"](x0, x1, x2, x3);
}
function _emscripten_glBufferData(target, size, data, usage) {
 if (!data) {
  GLctx.bufferData(target, size, usage);
 } else {
  if (GL.currentContext.supportsWebGL2EntryPoints) {
   GLctx.bufferData(target, HEAPU8, usage, data, size);
   return;
  }
  GLctx.bufferData(target, HEAPU8.subarray(data, data + size), usage);
 }
}
function _emscripten_glBufferSubData(target, offset, size, data) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.bufferSubData(target, offset, HEAPU8, data, size);
  return;
 }
 GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size));
}
function _emscripten_glCheckFramebufferStatus(x0) {
 return GLctx["checkFramebufferStatus"](x0);
}
function _emscripten_glClear(x0) {
 GLctx["clear"](x0);
}
function _emscripten_glClearColor(x0, x1, x2, x3) {
 GLctx["clearColor"](x0, x1, x2, x3);
}
function _emscripten_glClearDepth(x0) {
 GLctx["clearDepth"](x0);
}
function _emscripten_glClearDepthf(x0) {
 GLctx["clearDepth"](x0);
}
function _emscripten_glClearStencil(x0) {
 GLctx["clearStencil"](x0);
}
function _emscripten_glClientActiveTexture() {
 Module["printErr"]("missing function: emscripten_glClientActiveTexture");
 abort(-1);
}
function _emscripten_glColorMask(red, green, blue, alpha) {
 GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
}
function _emscripten_glColorPointer() {
 Module["printErr"]("missing function: emscripten_glColorPointer");
 abort(-1);
}
function _emscripten_glCompileShader(shader) {
 GLctx.compileShader(GL.shaders[shader]);
}
function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, HEAPU8, data, imageSize);
  return;
 }
 GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null);
}
function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize);
  return;
 }
 GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null);
}
function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
 GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
}
function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
 GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
}
function _emscripten_glCreateProgram() {
 var id = GL.getNewId(GL.programs);
 var program = GLctx.createProgram();
 program.name = id;
 GL.programs[id] = program;
 return id;
}
function _emscripten_glCreateShader(shaderType) {
 var id = GL.getNewId(GL.shaders);
 GL.shaders[id] = GLctx.createShader(shaderType);
 return id;
}
function _emscripten_glCullFace(x0) {
 GLctx["cullFace"](x0);
}
function _emscripten_glDeleteBuffers(n, buffers) {
 for (var i = 0; i < n; i++) {
  var id = HEAP32[buffers + i * 4 >> 2];
  var buffer = GL.buffers[id];
  if (!buffer) continue;
  GLctx.deleteBuffer(buffer);
  buffer.name = 0;
  GL.buffers[id] = null;
  if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
  if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0;
 }
}
function _emscripten_glDeleteFramebuffers(n, framebuffers) {
 for (var i = 0; i < n; ++i) {
  var id = HEAP32[framebuffers + i * 4 >> 2];
  var framebuffer = GL.framebuffers[id];
  if (!framebuffer) continue;
  GLctx.deleteFramebuffer(framebuffer);
  framebuffer.name = 0;
  GL.framebuffers[id] = null;
 }
}
function _emscripten_glDeleteObjectARB() {
 Module["printErr"]("missing function: emscripten_glDeleteObjectARB");
 abort(-1);
}
function _emscripten_glDeleteProgram(id) {
 if (!id) return;
 var program = GL.programs[id];
 if (!program) {
  GL.recordError(1281);
  return;
 }
 GLctx.deleteProgram(program);
 program.name = 0;
 GL.programs[id] = null;
 GL.programInfos[id] = null;
}
function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
 for (var i = 0; i < n; i++) {
  var id = HEAP32[renderbuffers + i * 4 >> 2];
  var renderbuffer = GL.renderbuffers[id];
  if (!renderbuffer) continue;
  GLctx.deleteRenderbuffer(renderbuffer);
  renderbuffer.name = 0;
  GL.renderbuffers[id] = null;
 }
}
function _emscripten_glDeleteShader(id) {
 if (!id) return;
 var shader = GL.shaders[id];
 if (!shader) {
  GL.recordError(1281);
  return;
 }
 GLctx.deleteShader(shader);
 GL.shaders[id] = null;
}
function _emscripten_glDeleteTextures(n, textures) {
 for (var i = 0; i < n; i++) {
  var id = HEAP32[textures + i * 4 >> 2];
  var texture = GL.textures[id];
  if (!texture) continue;
  GLctx.deleteTexture(texture);
  texture.name = 0;
  GL.textures[id] = null;
 }
}
function _emscripten_glDeleteVertexArrays(n, vaos) {
 for (var i = 0; i < n; i++) {
  var id = HEAP32[vaos + i * 4 >> 2];
  GLctx["deleteVertexArray"](GL.vaos[id]);
  GL.vaos[id] = null;
 }
}
function _emscripten_glDepthFunc(x0) {
 GLctx["depthFunc"](x0);
}
function _emscripten_glDepthMask(flag) {
 GLctx.depthMask(!!flag);
}
function _emscripten_glDepthRange(x0, x1) {
 GLctx["depthRange"](x0, x1);
}
function _emscripten_glDepthRangef(x0, x1) {
 GLctx["depthRange"](x0, x1);
}
function _emscripten_glDetachShader(program, shader) {
 GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
}
function _emscripten_glDisable(x0) {
 GLctx["disable"](x0);
}
function _emscripten_glDisableVertexAttribArray(index) {
 GLctx.disableVertexAttribArray(index);
}
function _emscripten_glDrawArrays(mode, first, count) {
 GLctx.drawArrays(mode, first, count);
}
function _emscripten_glDrawArraysInstanced(mode, first, count, primcount) {
 GLctx["drawArraysInstanced"](mode, first, count, primcount);
}
function _emscripten_glDrawBuffers(n, bufs) {
 var bufArray = GL.tempFixedLengthArray[n];
 for (var i = 0; i < n; i++) {
  bufArray[i] = HEAP32[bufs + i * 4 >> 2];
 }
 GLctx["drawBuffers"](bufArray);
}
function _emscripten_glDrawElements(mode, count, type, indices) {
 GLctx.drawElements(mode, count, type, indices);
}
function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
 GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
}
function _emscripten_glDrawRangeElements(mode, start, end, count, type, indices) {
 _emscripten_glDrawElements(mode, count, type, indices);
}
function _emscripten_glEnable(x0) {
 GLctx["enable"](x0);
}
function _emscripten_glEnableClientState() {
 Module["printErr"]("missing function: emscripten_glEnableClientState");
 abort(-1);
}
function _emscripten_glEnableVertexAttribArray(index) {
 GLctx.enableVertexAttribArray(index);
}
function _emscripten_glFinish() {
 GLctx["finish"]();
}
function _emscripten_glFlush() {
 GLctx["flush"]();
}
function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
 GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
}
function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
 GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
}
function _emscripten_glFrontFace(x0) {
 GLctx["frontFace"](x0);
}
function _emscripten_glFrustum() {
 Module["printErr"]("missing function: emscripten_glFrustum");
 abort(-1);
}
function _emscripten_glGenBuffers(n, buffers) {
 for (var i = 0; i < n; i++) {
  var buffer = GLctx.createBuffer();
  if (!buffer) {
   GL.recordError(1282);
   while (i < n) HEAP32[buffers + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.buffers);
  buffer.name = id;
  GL.buffers[id] = buffer;
  HEAP32[buffers + i * 4 >> 2] = id;
 }
}
function _emscripten_glGenFramebuffers(n, ids) {
 for (var i = 0; i < n; ++i) {
  var framebuffer = GLctx.createFramebuffer();
  if (!framebuffer) {
   GL.recordError(1282);
   while (i < n) HEAP32[ids + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.framebuffers);
  framebuffer.name = id;
  GL.framebuffers[id] = framebuffer;
  HEAP32[ids + i * 4 >> 2] = id;
 }
}
function _emscripten_glGenRenderbuffers(n, renderbuffers) {
 for (var i = 0; i < n; i++) {
  var renderbuffer = GLctx.createRenderbuffer();
  if (!renderbuffer) {
   GL.recordError(1282);
   while (i < n) HEAP32[renderbuffers + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.renderbuffers);
  renderbuffer.name = id;
  GL.renderbuffers[id] = renderbuffer;
  HEAP32[renderbuffers + i * 4 >> 2] = id;
 }
}
function _emscripten_glGenTextures(n, textures) {
 for (var i = 0; i < n; i++) {
  var texture = GLctx.createTexture();
  if (!texture) {
   GL.recordError(1282);
   while (i < n) HEAP32[textures + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.textures);
  texture.name = id;
  GL.textures[id] = texture;
  HEAP32[textures + i * 4 >> 2] = id;
 }
}
function _emscripten_glGenVertexArrays(n, arrays) {
 for (var i = 0; i < n; i++) {
  var vao = GLctx["createVertexArray"]();
  if (!vao) {
   GL.recordError(1282);
   while (i < n) HEAP32[arrays + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.vaos);
  vao.name = id;
  GL.vaos[id] = vao;
  HEAP32[arrays + i * 4 >> 2] = id;
 }
}
function _emscripten_glGenerateMipmap(x0) {
 GLctx["generateMipmap"](x0);
}
function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
 program = GL.programs[program];
 var info = GLctx.getActiveAttrib(program, index);
 if (!info) return;
 if (bufSize > 0 && name) {
  var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
 if (size) HEAP32[size >> 2] = info.size;
 if (type) HEAP32[type >> 2] = info.type;
}
function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
 program = GL.programs[program];
 var info = GLctx.getActiveUniform(program, index);
 if (!info) return;
 if (bufSize > 0 && name) {
  var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
 if (size) HEAP32[size >> 2] = info.size;
 if (type) HEAP32[type >> 2] = info.type;
}
function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
 var result = GLctx.getAttachedShaders(GL.programs[program]);
 var len = result.length;
 if (len > maxCount) {
  len = maxCount;
 }
 HEAP32[count >> 2] = len;
 for (var i = 0; i < len; ++i) {
  var id = GL.shaders.indexOf(result[i]);
  HEAP32[shaders + i * 4 >> 2] = id;
 }
}
function _emscripten_glGetAttribLocation(program, name) {
 program = GL.programs[program];
 name = Pointer_stringify(name);
 return GLctx.getAttribLocation(program, name);
}
function emscriptenWebGLGet(name_, p, type) {
 if (!p) {
  GL.recordError(1281);
  return;
 }
 var ret = undefined;
 switch (name_) {
 case 36346:
  ret = 1;
  break;
 case 36344:
  if (type !== "Integer" && type !== "Integer64") {
   GL.recordError(1280);
  }
  return;
 case 34814:
 case 36345:
  ret = 0;
  break;
 case 34466:
  var formats = GLctx.getParameter(34467);
  ret = formats.length;
  break;
 case 33309:
  if (GLctx.canvas.GLctxObject.version < 2) {
   GL.recordError(1282);
   return;
  }
  var exts = GLctx.getSupportedExtensions();
  ret = 2 * exts.length;
  break;
 case 33307:
 case 33308:
  if (GLctx.canvas.GLctxObject.version < 2) {
   GL.recordError(1280);
   return;
  }
  ret = name_ == 33307 ? 3 : 0;
  break;
 }
 if (ret === undefined) {
  var result = GLctx.getParameter(name_);
  switch (typeof result) {
  case "number":
   ret = result;
   break;
  case "boolean":
   ret = result ? 1 : 0;
   break;
  case "string":
   GL.recordError(1280);
   return;
  case "object":
   if (result === null) {
    switch (name_) {
    case 34964:
    case 35725:
    case 34965:
    case 36006:
    case 36007:
    case 32873:
    case 34229:
    case 35097:
    case 36389:
    case 34068:
     {
      ret = 0;
      break;
     }
    default:
     {
      GL.recordError(1280);
      return;
     }
    }
   } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
    for (var i = 0; i < result.length; ++i) {
     switch (type) {
     case "Integer":
      HEAP32[p + i * 4 >> 2] = result[i];
      break;
     case "Float":
      HEAPF32[p + i * 4 >> 2] = result[i];
      break;
     case "Boolean":
      HEAP8[p + i >> 0] = result[i] ? 1 : 0;
      break;
     default:
      throw "internal glGet error, bad type: " + type;
     }
    }
    return;
   } else if (result instanceof WebGLBuffer || result instanceof WebGLProgram || result instanceof WebGLFramebuffer || result instanceof WebGLRenderbuffer || result instanceof WebGLQuery || result instanceof WebGLSampler || result instanceof WebGLSync || result instanceof WebGLTransformFeedback || result instanceof WebGLVertexArrayObject || result instanceof WebGLTexture) {
    ret = result.name | 0;
   } else {
    GL.recordError(1280);
    return;
   }
   break;
  default:
   GL.recordError(1280);
   return;
  }
 }
 switch (type) {
 case "Integer64":
  tempI64 = [ ret >>> 0, (tempDouble = ret, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], HEAP32[p >> 2] = tempI64[0], HEAP32[p + 4 >> 2] = tempI64[1];
  break;
 case "Integer":
  HEAP32[p >> 2] = ret;
  break;
 case "Float":
  HEAPF32[p >> 2] = ret;
  break;
 case "Boolean":
  HEAP8[p >> 0] = ret ? 1 : 0;
  break;
 default:
  throw "internal glGet error, bad type: " + type;
 }
}
function _emscripten_glGetBooleanv(name_, p) {
 emscriptenWebGLGet(name_, p, "Boolean");
}
function _emscripten_glGetBufferParameteriv(target, value, data) {
 if (!data) {
  GL.recordError(1281);
  return;
 }
 HEAP32[data >> 2] = GLctx.getBufferParameter(target, value);
}
function _emscripten_glGetError() {
 if (GL.lastError) {
  var error = GL.lastError;
  GL.lastError = 0;
  return error;
 } else {
  return GLctx.getError();
 }
}
function _emscripten_glGetFloatv(name_, p) {
 emscriptenWebGLGet(name_, p, "Float");
}
function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
 var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
 HEAP32[params >> 2] = result;
}
function _emscripten_glGetInfoLogARB() {
 Module["printErr"]("missing function: emscripten_glGetInfoLogARB");
 abort(-1);
}
function _emscripten_glGetIntegerv(name_, p) {
 emscriptenWebGLGet(name_, p, "Integer");
}
function _emscripten_glGetObjectParameterivARB() {
 Module["printErr"]("missing function: emscripten_glGetObjectParameterivARB");
 abort(-1);
}
function _emscripten_glGetPointerv() {
 Module["printErr"]("missing function: emscripten_glGetPointerv");
 abort(-1);
}
function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
 var log = GLctx.getProgramInfoLog(GL.programs[program]);
 if (log === null) log = "(unknown error)";
 if (maxLength > 0 && infoLog) {
  var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
}
function _emscripten_glGetProgramiv(program, pname, p) {
 if (!p) {
  GL.recordError(1281);
  return;
 }
 if (program >= GL.counter) {
  GL.recordError(1281);
  return;
 }
 var ptable = GL.programInfos[program];
 if (!ptable) {
  GL.recordError(1282);
  return;
 }
 if (pname == 35716) {
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  HEAP32[p >> 2] = log.length + 1;
 } else if (pname == 35719) {
  HEAP32[p >> 2] = ptable.maxUniformLength;
 } else if (pname == 35722) {
  if (ptable.maxAttributeLength == -1) {
   program = GL.programs[program];
   var numAttribs = GLctx.getProgramParameter(program, GLctx.ACTIVE_ATTRIBUTES);
   ptable.maxAttributeLength = 0;
   for (var i = 0; i < numAttribs; ++i) {
    var activeAttrib = GLctx.getActiveAttrib(program, i);
    ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length + 1);
   }
  }
  HEAP32[p >> 2] = ptable.maxAttributeLength;
 } else if (pname == 35381) {
  if (ptable.maxUniformBlockNameLength == -1) {
   program = GL.programs[program];
   var numBlocks = GLctx.getProgramParameter(program, GLctx.ACTIVE_UNIFORM_BLOCKS);
   ptable.maxUniformBlockNameLength = 0;
   for (var i = 0; i < numBlocks; ++i) {
    var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
    ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length + 1);
   }
  }
  HEAP32[p >> 2] = ptable.maxUniformBlockNameLength;
 } else {
  HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname);
 }
}
function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
 if (!params) {
  GL.recordError(1281);
  return;
 }
 HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname);
}
function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
 var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
 if (log === null) log = "(unknown error)";
 if (maxLength > 0 && infoLog) {
  var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
}
function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
 var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
 HEAP32[range >> 2] = result.rangeMin;
 HEAP32[range + 4 >> 2] = result.rangeMax;
 HEAP32[precision >> 2] = result.precision;
}
function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
 var result = GLctx.getShaderSource(GL.shaders[shader]);
 if (!result) return;
 if (bufSize > 0 && source) {
  var numBytesWrittenExclNull = stringToUTF8(result, source, bufSize);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
}
function _emscripten_glGetShaderiv(shader, pname, p) {
 if (!p) {
  GL.recordError(1281);
  return;
 }
 if (pname == 35716) {
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  HEAP32[p >> 2] = log.length + 1;
 } else if (pname == 35720) {
  var source = GLctx.getShaderSource(GL.shaders[shader]);
  var sourceLength = source === null || source.length == 0 ? 0 : source.length + 1;
  HEAP32[p >> 2] = sourceLength;
 } else {
  HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
 }
}
function _emscripten_glGetString(name_) {
 if (GL.stringCache[name_]) return GL.stringCache[name_];
 var ret;
 switch (name_) {
 case 7936:
 case 7937:
 case 37445:
 case 37446:
  ret = allocate(intArrayFromString(GLctx.getParameter(name_)), "i8", ALLOC_NORMAL);
  break;
 case 7938:
  var glVersion = GLctx.getParameter(GLctx.VERSION);
  if (GLctx.canvas.GLctxObject.version >= 2) glVersion = "OpenGL ES 3.0 (" + glVersion + ")"; else {
   glVersion = "OpenGL ES 2.0 (" + glVersion + ")";
  }
  ret = allocate(intArrayFromString(glVersion), "i8", ALLOC_NORMAL);
  break;
 case 7939:
  var exts = GLctx.getSupportedExtensions();
  var gl_exts = [];
  for (var i = 0; i < exts.length; ++i) {
   gl_exts.push(exts[i]);
   gl_exts.push("GL_" + exts[i]);
  }
  ret = allocate(intArrayFromString(gl_exts.join(" ")), "i8", ALLOC_NORMAL);
  break;
 case 35724:
  var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
  var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
  var ver_num = glslVersion.match(ver_re);
  if (ver_num !== null) {
   if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
   glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")";
  }
  ret = allocate(intArrayFromString(glslVersion), "i8", ALLOC_NORMAL);
  break;
 default:
  GL.recordError(1280);
  return 0;
 }
 GL.stringCache[name_] = ret;
 return ret;
}
function _emscripten_glGetTexParameterfv(target, pname, params) {
 if (!params) {
  GL.recordError(1281);
  return;
 }
 HEAPF32[params >> 2] = GLctx.getTexParameter(target, pname);
}
function _emscripten_glGetTexParameteriv(target, pname, params) {
 if (!params) {
  GL.recordError(1281);
  return;
 }
 HEAP32[params >> 2] = GLctx.getTexParameter(target, pname);
}
function _emscripten_glGetUniformLocation(program, name) {
 name = Pointer_stringify(name);
 var arrayOffset = 0;
 if (name.indexOf("]", name.length - 1) !== -1) {
  var ls = name.lastIndexOf("[");
  var arrayIndex = name.slice(ls + 1, -1);
  if (arrayIndex.length > 0) {
   arrayOffset = parseInt(arrayIndex);
   if (arrayOffset < 0) {
    return -1;
   }
  }
  name = name.slice(0, ls);
 }
 var ptable = GL.programInfos[program];
 if (!ptable) {
  return -1;
 }
 var utable = ptable.uniforms;
 var uniformInfo = utable[name];
 if (uniformInfo && arrayOffset < uniformInfo[0]) {
  return uniformInfo[1] + arrayOffset;
 } else {
  return -1;
 }
}
function emscriptenWebGLGetUniform(program, location, params, type) {
 if (!params) {
  GL.recordError(1281);
  return;
 }
 var data = GLctx.getUniform(GL.programs[program], GL.uniforms[location]);
 if (typeof data == "number" || typeof data == "boolean") {
  switch (type) {
  case "Integer":
   HEAP32[params >> 2] = data;
   break;
  case "Float":
   HEAPF32[params >> 2] = data;
   break;
  default:
   throw "internal emscriptenWebGLGetUniform() error, bad type: " + type;
  }
 } else {
  for (var i = 0; i < data.length; i++) {
   switch (type) {
   case "Integer":
    HEAP32[params + i * 4 >> 2] = data[i];
    break;
   case "Float":
    HEAPF32[params + i * 4 >> 2] = data[i];
    break;
   default:
    throw "internal emscriptenWebGLGetUniform() error, bad type: " + type;
   }
  }
 }
}
function _emscripten_glGetUniformfv(program, location, params) {
 emscriptenWebGLGetUniform(program, location, params, "Float");
}
function _emscripten_glGetUniformiv(program, location, params) {
 emscriptenWebGLGetUniform(program, location, params, "Integer");
}
function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
 if (!pointer) {
  GL.recordError(1281);
  return;
 }
 HEAP32[pointer >> 2] = GLctx.getVertexAttribOffset(index, pname);
}
function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
 if (!params) {
  GL.recordError(1281);
  return;
 }
 var data = GLctx.getVertexAttrib(index, pname);
 if (pname == 34975) {
  HEAP32[params >> 2] = data["name"];
 } else if (typeof data == "number" || typeof data == "boolean") {
  switch (type) {
  case "Integer":
   HEAP32[params >> 2] = data;
   break;
  case "Float":
   HEAPF32[params >> 2] = data;
   break;
  case "FloatToInteger":
   HEAP32[params >> 2] = Math.fround(data);
   break;
  default:
   throw "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + type;
  }
 } else {
  for (var i = 0; i < data.length; i++) {
   switch (type) {
   case "Integer":
    HEAP32[params + i * 4 >> 2] = data[i];
    break;
   case "Float":
    HEAPF32[params + i * 4 >> 2] = data[i];
    break;
   case "FloatToInteger":
    HEAP32[params + i * 4 >> 2] = Math.fround(data[i]);
    break;
   default:
    throw "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + type;
   }
  }
 }
}
function _emscripten_glGetVertexAttribfv(index, pname, params) {
 emscriptenWebGLGetVertexAttrib(index, pname, params, "Float");
}
function _emscripten_glGetVertexAttribiv(index, pname, params) {
 emscriptenWebGLGetVertexAttrib(index, pname, params, "FloatToInteger");
}
function _emscripten_glHint(x0, x1) {
 GLctx["hint"](x0, x1);
}
function _emscripten_glIsBuffer(buffer) {
 var b = GL.buffers[buffer];
 if (!b) return 0;
 return GLctx.isBuffer(b);
}
function _emscripten_glIsEnabled(x0) {
 return GLctx["isEnabled"](x0);
}
function _emscripten_glIsFramebuffer(framebuffer) {
 var fb = GL.framebuffers[framebuffer];
 if (!fb) return 0;
 return GLctx.isFramebuffer(fb);
}
function _emscripten_glIsProgram(program) {
 program = GL.programs[program];
 if (!program) return 0;
 return GLctx.isProgram(program);
}
function _emscripten_glIsRenderbuffer(renderbuffer) {
 var rb = GL.renderbuffers[renderbuffer];
 if (!rb) return 0;
 return GLctx.isRenderbuffer(rb);
}
function _emscripten_glIsShader(shader) {
 var s = GL.shaders[shader];
 if (!s) return 0;
 return GLctx.isShader(s);
}
function _emscripten_glIsTexture(texture) {
 var texture = GL.textures[texture];
 if (!texture) return 0;
 return GLctx.isTexture(texture);
}
function _emscripten_glIsVertexArray(array) {
 var vao = GL.vaos[array];
 if (!vao) return 0;
 return GLctx["isVertexArray"](vao);
}
function _emscripten_glLineWidth(x0) {
 GLctx["lineWidth"](x0);
}
function _emscripten_glLinkProgram(program) {
 GLctx.linkProgram(GL.programs[program]);
 GL.programInfos[program] = null;
 GL.populateUniformTable(program);
}
function _emscripten_glLoadIdentity() {
 throw "Legacy GL function (glLoadIdentity) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.";
}
function _emscripten_glLoadMatrixf() {
 Module["printErr"]("missing function: emscripten_glLoadMatrixf");
 abort(-1);
}
function _emscripten_glMatrixMode() {
 throw "Legacy GL function (glMatrixMode) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.";
}
function _emscripten_glNormalPointer() {
 Module["printErr"]("missing function: emscripten_glNormalPointer");
 abort(-1);
}
function _emscripten_glPixelStorei(pname, param) {
 if (pname == 3333) {
  GL.packAlignment = param;
 } else if (pname == 3317) {
  GL.unpackAlignment = param;
 }
 GLctx.pixelStorei(pname, param);
}
function _emscripten_glPolygonOffset(x0, x1) {
 GLctx["polygonOffset"](x0, x1);
}
function emscriptenWebGLComputeImageSize(width, height, sizePerPixel, alignment) {
 function roundedToNextMultipleOf(x, y) {
  return Math.floor((x + y - 1) / y) * y;
 }
 var plainRowSize = width * sizePerPixel;
 var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
 return height <= 0 ? 0 : (height - 1) * alignedRowSize + plainRowSize;
}
function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
 var sizePerPixel;
 var numChannels;
 switch (format) {
 case 6406:
 case 6409:
 case 6402:
 case 6403:
 case 36244:
  numChannels = 1;
  break;
 case 6410:
 case 33319:
 case 33320:
  numChannels = 2;
  break;
 case 6407:
 case 35904:
 case 36248:
  numChannels = 3;
  break;
 case 6408:
 case 35906:
 case 36249:
  numChannels = 4;
  break;
 default:
  GL.recordError(1280);
  return null;
 }
 switch (type) {
 case 5121:
 case 5120:
  sizePerPixel = numChannels * 1;
  break;
 case 5123:
 case 36193:
 case 5131:
 case 5122:
  sizePerPixel = numChannels * 2;
  break;
 case 5125:
 case 5126:
 case 5124:
  sizePerPixel = numChannels * 4;
  break;
 case 34042:
 case 35902:
 case 33640:
 case 35899:
 case 34042:
  sizePerPixel = 4;
  break;
 case 33635:
 case 32819:
 case 32820:
  sizePerPixel = 2;
  break;
 default:
  GL.recordError(1280);
  return null;
 }
 var bytes = emscriptenWebGLComputeImageSize(width, height, sizePerPixel, GL.unpackAlignment);
 switch (type) {
 case 5120:
  return HEAP8.subarray(pixels, pixels + bytes);
 case 5121:
  return HEAPU8.subarray(pixels, pixels + bytes);
 case 5122:
  return HEAP16.subarray(pixels >> 1, pixels + bytes >> 1);
 case 5124:
  return HEAP32.subarray(pixels >> 2, pixels + bytes >> 2);
 case 5126:
  return HEAPF32.subarray(pixels >> 2, pixels + bytes >> 2);
 case 5125:
 case 34042:
 case 35902:
 case 33640:
 case 35899:
 case 34042:
  return HEAPU32.subarray(pixels >> 2, pixels + bytes >> 2);
 case 5123:
 case 33635:
 case 32819:
 case 32820:
 case 36193:
 case 5131:
  return HEAPU16.subarray(pixels >> 1, pixels + bytes >> 1);
 default:
  GL.recordError(1280);
  return null;
 }
}
function emscriptenWebGLGetHeapForType(type) {
 switch (type) {
 case 5120:
  return HEAP8;
 case 5121:
  return HEAPU8;
 case 5122:
  return HEAP16;
 case 5123:
 case 33635:
 case 32819:
 case 32820:
 case 36193:
 case 5131:
  return HEAPU16;
 case 5124:
  return HEAP32;
 case 5125:
 case 34042:
 case 35902:
 case 33640:
 case 35899:
 case 34042:
  return HEAPU32;
 case 5126:
  return HEAPF32;
 default:
  return null;
 }
}
function emscriptenWebGLGetShiftForType(type) {
 switch (type) {
 case 5120:
 case 5121:
  return 0;
 case 5122:
 case 5123:
 case 33635:
 case 32819:
 case 32820:
 case 36193:
 case 5131:
  return 1;
 case 5124:
 case 5126:
 case 5125:
 case 34042:
 case 35902:
 case 33640:
 case 35899:
 case 34042:
  return 2;
 default:
  return 0;
 }
}
function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  if (GLctx.currentPixelPackBufferBinding) {
   GLctx.readPixels(x, y, width, height, format, type, pixels);
  } else {
   GLctx.readPixels(x, y, width, height, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type));
  }
  return;
 }
 var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
 if (!pixelData) {
  GL.recordError(1280);
  return;
 }
 GLctx.readPixels(x, y, width, height, format, type, pixelData);
}
function _emscripten_glReleaseShaderCompiler() {}
function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) {
 GLctx["renderbufferStorage"](x0, x1, x2, x3);
}
function _emscripten_glRotatef() {
 Module["printErr"]("missing function: emscripten_glRotatef");
 abort(-1);
}
function _emscripten_glSampleCoverage(value, invert) {
 GLctx.sampleCoverage(value, !!invert);
}
function _emscripten_glScissor(x0, x1, x2, x3) {
 GLctx["scissor"](x0, x1, x2, x3);
}
function _emscripten_glShaderBinary() {
 GL.recordError(1280);
}
function _emscripten_glShaderSource(shader, count, string, length) {
 var source = GL.getSource(shader, count, string, length);
 GLctx.shaderSource(GL.shaders[shader], source);
}
function _emscripten_glStencilFunc(x0, x1, x2) {
 GLctx["stencilFunc"](x0, x1, x2);
}
function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) {
 GLctx["stencilFuncSeparate"](x0, x1, x2, x3);
}
function _emscripten_glStencilMask(x0) {
 GLctx["stencilMask"](x0);
}
function _emscripten_glStencilMaskSeparate(x0, x1) {
 GLctx["stencilMaskSeparate"](x0, x1);
}
function _emscripten_glStencilOp(x0, x1, x2) {
 GLctx["stencilOp"](x0, x1, x2);
}
function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) {
 GLctx["stencilOpSeparate"](x0, x1, x2, x3);
}
function _emscripten_glTexCoordPointer() {
 Module["printErr"]("missing function: emscripten_glTexCoordPointer");
 abort(-1);
}
function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  if (GLctx.currentPixelUnpackBufferBinding) {
   GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
  } else if (pixels != 0) {
   GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type));
  } else {
   GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null);
  }
  return;
 }
 var pixelData = null;
 if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat);
 GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
}
function _emscripten_glTexParameterf(x0, x1, x2) {
 GLctx["texParameterf"](x0, x1, x2);
}
function _emscripten_glTexParameterfv(target, pname, params) {
 var param = HEAPF32[params >> 2];
 GLctx.texParameterf(target, pname, param);
}
function _emscripten_glTexParameteri(x0, x1, x2) {
 GLctx["texParameteri"](x0, x1, x2);
}
function _emscripten_glTexParameteriv(target, pname, params) {
 var param = HEAP32[params >> 2];
 GLctx.texParameteri(target, pname, param);
}
function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  if (GLctx.currentPixelUnpackBufferBinding) {
   GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
  } else if (pixels != 0) {
   GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type));
  } else {
   GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null);
  }
  return;
 }
 var pixelData = null;
 if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
 GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
}
function _emscripten_glUniform1f(location, v0) {
 GLctx.uniform1f(GL.uniforms[location], v0);
}
function _emscripten_glUniform1fv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform1fv(GL.uniforms[location], HEAPF32, value >> 2, count);
  return;
 }
 var view;
 if (count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[count - 1];
  for (var i = 0; i < count; ++i) {
   view[i] = HEAPF32[value + 4 * i >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 4 >> 2);
 }
 GLctx.uniform1fv(GL.uniforms[location], view);
}
function _emscripten_glUniform1i(location, v0) {
 GLctx.uniform1i(GL.uniforms[location], v0);
}
function _emscripten_glUniform1iv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform1iv(GL.uniforms[location], HEAP32, value >> 2, count);
  return;
 }
 GLctx.uniform1iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 4 >> 2));
}
function _emscripten_glUniform2f(location, v0, v1) {
 GLctx.uniform2f(GL.uniforms[location], v0, v1);
}
function _emscripten_glUniform2fv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform2fv(GL.uniforms[location], HEAPF32, value >> 2, count * 2);
  return;
 }
 var view;
 if (2 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[2 * count - 1];
  for (var i = 0; i < 2 * count; i += 2) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2);
 }
 GLctx.uniform2fv(GL.uniforms[location], view);
}
function _emscripten_glUniform2i(location, v0, v1) {
 GLctx.uniform2i(GL.uniforms[location], v0, v1);
}
function _emscripten_glUniform2iv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform2iv(GL.uniforms[location], HEAP32, value >> 2, count * 2);
  return;
 }
 GLctx.uniform2iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 8 >> 2));
}
function _emscripten_glUniform3f(location, v0, v1, v2) {
 GLctx.uniform3f(GL.uniforms[location], v0, v1, v2);
}
function _emscripten_glUniform3fv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform3fv(GL.uniforms[location], HEAPF32, value >> 2, count * 3);
  return;
 }
 var view;
 if (3 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[3 * count - 1];
  for (var i = 0; i < 3 * count; i += 3) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
   view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2);
 }
 GLctx.uniform3fv(GL.uniforms[location], view);
}
function _emscripten_glUniform3i(location, v0, v1, v2) {
 GLctx.uniform3i(GL.uniforms[location], v0, v1, v2);
}
function _emscripten_glUniform3iv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform3iv(GL.uniforms[location], HEAP32, value >> 2, count * 3);
  return;
 }
 GLctx.uniform3iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 12 >> 2));
}
function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
 GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3);
}
function _emscripten_glUniform4fv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform4fv(GL.uniforms[location], HEAPF32, value >> 2, count * 4);
  return;
 }
 var view;
 if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[4 * count - 1];
  for (var i = 0; i < 4 * count; i += 4) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
   view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
   view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2);
 }
 GLctx.uniform4fv(GL.uniforms[location], view);
}
function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
 GLctx.uniform4i(GL.uniforms[location], v0, v1, v2, v3);
}
function _emscripten_glUniform4iv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform4iv(GL.uniforms[location], HEAP32, value >> 2, count * 4);
  return;
 }
 GLctx.uniform4iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 16 >> 2));
}
function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, HEAPF32, value >> 2, count * 4);
  return;
 }
 var view;
 if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[4 * count - 1];
  for (var i = 0; i < 4 * count; i += 4) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
   view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
   view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2);
 }
 GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, view);
}
function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, HEAPF32, value >> 2, count * 9);
  return;
 }
 var view;
 if (9 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[9 * count - 1];
  for (var i = 0; i < 9 * count; i += 9) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
   view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
   view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
   view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
   view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
   view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
   view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
   view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2);
 }
 GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view);
}
function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, HEAPF32, value >> 2, count * 16);
  return;
 }
 var view;
 if (16 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[16 * count - 1];
  for (var i = 0; i < 16 * count; i += 16) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
   view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
   view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
   view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
   view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
   view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
   view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
   view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2];
   view[i + 9] = HEAPF32[value + (4 * i + 36) >> 2];
   view[i + 10] = HEAPF32[value + (4 * i + 40) >> 2];
   view[i + 11] = HEAPF32[value + (4 * i + 44) >> 2];
   view[i + 12] = HEAPF32[value + (4 * i + 48) >> 2];
   view[i + 13] = HEAPF32[value + (4 * i + 52) >> 2];
   view[i + 14] = HEAPF32[value + (4 * i + 56) >> 2];
   view[i + 15] = HEAPF32[value + (4 * i + 60) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2);
 }
 GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view);
}
function _emscripten_glUseProgram(program) {
 GLctx.useProgram(program ? GL.programs[program] : null);
}
function _emscripten_glValidateProgram(program) {
 GLctx.validateProgram(GL.programs[program]);
}
function _emscripten_glVertexAttrib1f(x0, x1) {
 GLctx["vertexAttrib1f"](x0, x1);
}
function _emscripten_glVertexAttrib1fv(index, v) {
 GLctx.vertexAttrib1f(index, HEAPF32[v >> 2]);
}
function _emscripten_glVertexAttrib2f(x0, x1, x2) {
 GLctx["vertexAttrib2f"](x0, x1, x2);
}
function _emscripten_glVertexAttrib2fv(index, v) {
 GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2]);
}
function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) {
 GLctx["vertexAttrib3f"](x0, x1, x2, x3);
}
function _emscripten_glVertexAttrib3fv(index, v) {
 GLctx.vertexAttrib3f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2]);
}
function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) {
 GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4);
}
function _emscripten_glVertexAttrib4fv(index, v) {
 GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2]);
}
function _emscripten_glVertexAttribDivisor(index, divisor) {
 GLctx["vertexAttribDivisor"](index, divisor);
}
function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
 GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}
function _emscripten_glVertexPointer() {
 throw "Legacy GL function (glVertexPointer) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.";
}
function _emscripten_glViewport(x0, x1, x2, x3) {
 GLctx["viewport"](x0, x1, x2, x3);
}
function _longjmp(env, value) {
 Module["setThrew"](env, value || 1);
 throw "longjmp";
}
function _emscripten_longjmp(env, value) {
 _longjmp(env, value);
}
function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
 if (!target) target = "#canvas";
 target = JSEvents.findEventTarget(target);
 if (!target) return -4;
 if (!target.requestPointerLock && !target.mozRequestPointerLock && !target.webkitRequestPointerLock && !target.msRequestPointerLock) {
  return -1;
 }
 var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
 if (!canPerformRequests) {
  if (deferUntilInEventHandler) {
   JSEvents.deferCall(JSEvents.requestPointerLock, 2, [ target ]);
   return 1;
  } else {
   return -2;
  }
 }
 return JSEvents.requestPointerLock(target);
}
function _emscripten_set_canvas_element_size(target, width, height) {
 if (target) target = JSEvents.findEventTarget(target); else target = Module["canvas"];
 if (!target) return -4;
 target.width = width;
 target.height = height;
 return 0;
}
function _emscripten_set_canvas_size(width, height) {
 Browser.setCanvasSize(width, height);
}
function _emscripten_set_keydown_callback(target, userData, useCapture, callbackfunc) {
 JSEvents.registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown");
 return 0;
}
function _emscripten_set_keypress_callback(target, userData, useCapture, callbackfunc) {
 JSEvents.registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress");
 return 0;
}
function _emscripten_set_keyup_callback(target, userData, useCapture, callbackfunc) {
 JSEvents.registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup");
 return 0;
}
function _emscripten_set_mousedown_callback(target, userData, useCapture, callbackfunc) {
 JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown");
 return 0;
}
function _emscripten_set_mousemove_callback(target, userData, useCapture, callbackfunc) {
 JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove");
 return 0;
}
function _emscripten_set_mouseup_callback(target, userData, useCapture, callbackfunc) {
 JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup");
 return 0;
}
function _emscripten_set_resize_callback(target, userData, useCapture, callbackfunc) {
 JSEvents.registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize");
 return 0;
}
function _emscripten_set_wheel_callback(target, userData, useCapture, callbackfunc) {
 target = JSEvents.findEventTarget(target);
 if (typeof target.onwheel !== "undefined") {
  JSEvents.registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel");
  return 0;
 } else if (typeof target.onmousewheel !== "undefined") {
  JSEvents.registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "mousewheel");
  return 0;
 } else {
  return -1;
 }
}
function __exit(status) {
 Module["exit"](status);
}
function _exit(status) {
 __exit(status);
}
var _environ = STATICTOP;
STATICTOP += 16;
function ___buildEnvironment(env) {
 var MAX_ENV_VALUES = 64;
 var TOTAL_ENV_SIZE = 1024;
 var poolPtr;
 var envPtr;
 if (!___buildEnvironment.called) {
  ___buildEnvironment.called = true;
  ENV["USER"] = ENV["LOGNAME"] = "web_user";
  ENV["PATH"] = "/";
  ENV["PWD"] = "/";
  ENV["HOME"] = "/home/web_user";
  ENV["LANG"] = "C.UTF-8";
  ENV["_"] = Module["thisProgram"];
  poolPtr = staticAlloc(TOTAL_ENV_SIZE);
  envPtr = staticAlloc(MAX_ENV_VALUES * 4);
  HEAP32[envPtr >> 2] = poolPtr;
  HEAP32[_environ >> 2] = envPtr;
 } else {
  envPtr = HEAP32[_environ >> 2];
  poolPtr = HEAP32[envPtr >> 2];
 }
 var strings = [];
 var totalSize = 0;
 for (var key in env) {
  if (typeof env[key] === "string") {
   var line = key + "=" + env[key];
   strings.push(line);
   totalSize += line.length;
  }
 }
 if (totalSize > TOTAL_ENV_SIZE) {
  throw new Error("Environment size exceeded TOTAL_ENV_SIZE!");
 }
 var ptrSize = 4;
 for (var i = 0; i < strings.length; i++) {
  var line = strings[i];
  writeAsciiToMemory(line, poolPtr);
  HEAP32[envPtr + i * ptrSize >> 2] = poolPtr;
  poolPtr += line.length + 1;
 }
 HEAP32[envPtr + strings.length * ptrSize >> 2] = 0;
}
var ENV = {};
function _getenv(name) {
 if (name === 0) return 0;
 name = Pointer_stringify(name);
 if (!ENV.hasOwnProperty(name)) return 0;
 if (_getenv.ret) _free(_getenv.ret);
 _getenv.ret = allocateUTF8(ENV[name]);
 return _getenv.ret;
}
function _gettimeofday(ptr) {
 var now = Date.now();
 HEAP32[ptr >> 2] = now / 1e3 | 0;
 HEAP32[ptr + 4 >> 2] = now % 1e3 * 1e3 | 0;
 return 0;
}
function _glActiveTexture(x0) {
 GLctx["activeTexture"](x0);
}
function _glAttachShader(program, shader) {
 GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
}
function _glBindBuffer(target, buffer) {
 var bufferObj = buffer ? GL.buffers[buffer] : null;
 if (target == 35051) {
  GLctx.currentPixelPackBufferBinding = buffer;
 } else if (target == 35052) {
  GLctx.currentPixelUnpackBufferBinding = buffer;
 }
 GLctx.bindBuffer(target, bufferObj);
}
function _glBindFramebuffer(target, framebuffer) {
 GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : null);
}
function _glBindRenderbuffer(target, renderbuffer) {
 GLctx.bindRenderbuffer(target, renderbuffer ? GL.renderbuffers[renderbuffer] : null);
}
function _glBindTexture(target, texture) {
 GLctx.bindTexture(target, texture ? GL.textures[texture] : null);
}
function _glBlendColor(x0, x1, x2, x3) {
 GLctx["blendColor"](x0, x1, x2, x3);
}
function _glBlendEquationSeparate(x0, x1) {
 GLctx["blendEquationSeparate"](x0, x1);
}
function _glBlendFuncSeparate(x0, x1, x2, x3) {
 GLctx["blendFuncSeparate"](x0, x1, x2, x3);
}
function _glBufferData(target, size, data, usage) {
 if (!data) {
  GLctx.bufferData(target, size, usage);
 } else {
  if (GL.currentContext.supportsWebGL2EntryPoints) {
   GLctx.bufferData(target, HEAPU8, usage, data, size);
   return;
  }
  GLctx.bufferData(target, HEAPU8.subarray(data, data + size), usage);
 }
}
function _glBufferSubData(target, offset, size, data) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.bufferSubData(target, offset, HEAPU8, data, size);
  return;
 }
 GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size));
}
function _glCheckFramebufferStatus(x0) {
 return GLctx["checkFramebufferStatus"](x0);
}
function _glClear(x0) {
 GLctx["clear"](x0);
}
function _glClearColor(x0, x1, x2, x3) {
 GLctx["clearColor"](x0, x1, x2, x3);
}
function _glClearDepthf(x0) {
 GLctx["clearDepth"](x0);
}
function _glClearStencil(x0) {
 GLctx["clearStencil"](x0);
}
function _glColorMask(red, green, blue, alpha) {
 GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
}
function _glCompileShader(shader) {
 GLctx.compileShader(GL.shaders[shader]);
}
function _glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, HEAPU8, data, imageSize);
  return;
 }
 GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null);
}
function _glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize);
  return;
 }
 GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null);
}
function _glCreateProgram() {
 var id = GL.getNewId(GL.programs);
 var program = GLctx.createProgram();
 program.name = id;
 GL.programs[id] = program;
 return id;
}
function _glCreateShader(shaderType) {
 var id = GL.getNewId(GL.shaders);
 GL.shaders[id] = GLctx.createShader(shaderType);
 return id;
}
function _glCullFace(x0) {
 GLctx["cullFace"](x0);
}
function _glDeleteBuffers(n, buffers) {
 for (var i = 0; i < n; i++) {
  var id = HEAP32[buffers + i * 4 >> 2];
  var buffer = GL.buffers[id];
  if (!buffer) continue;
  GLctx.deleteBuffer(buffer);
  buffer.name = 0;
  GL.buffers[id] = null;
  if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
  if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0;
 }
}
function _glDeleteFramebuffers(n, framebuffers) {
 for (var i = 0; i < n; ++i) {
  var id = HEAP32[framebuffers + i * 4 >> 2];
  var framebuffer = GL.framebuffers[id];
  if (!framebuffer) continue;
  GLctx.deleteFramebuffer(framebuffer);
  framebuffer.name = 0;
  GL.framebuffers[id] = null;
 }
}
function _glDeleteProgram(id) {
 if (!id) return;
 var program = GL.programs[id];
 if (!program) {
  GL.recordError(1281);
  return;
 }
 GLctx.deleteProgram(program);
 program.name = 0;
 GL.programs[id] = null;
 GL.programInfos[id] = null;
}
function _glDeleteRenderbuffers(n, renderbuffers) {
 for (var i = 0; i < n; i++) {
  var id = HEAP32[renderbuffers + i * 4 >> 2];
  var renderbuffer = GL.renderbuffers[id];
  if (!renderbuffer) continue;
  GLctx.deleteRenderbuffer(renderbuffer);
  renderbuffer.name = 0;
  GL.renderbuffers[id] = null;
 }
}
function _glDeleteShader(id) {
 if (!id) return;
 var shader = GL.shaders[id];
 if (!shader) {
  GL.recordError(1281);
  return;
 }
 GLctx.deleteShader(shader);
 GL.shaders[id] = null;
}
function _glDeleteTextures(n, textures) {
 for (var i = 0; i < n; i++) {
  var id = HEAP32[textures + i * 4 >> 2];
  var texture = GL.textures[id];
  if (!texture) continue;
  GLctx.deleteTexture(texture);
  texture.name = 0;
  GL.textures[id] = null;
 }
}
function _glDepthFunc(x0) {
 GLctx["depthFunc"](x0);
}
function _glDepthMask(flag) {
 GLctx.depthMask(!!flag);
}
function _glDetachShader(program, shader) {
 GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
}
function _glDisable(x0) {
 GLctx["disable"](x0);
}
function _glDisableVertexAttribArray(index) {
 GLctx.disableVertexAttribArray(index);
}
function _glDrawArrays(mode, first, count) {
 GLctx.drawArrays(mode, first, count);
}
function _glDrawElements(mode, count, type, indices) {
 GLctx.drawElements(mode, count, type, indices);
}
function _glEnable(x0) {
 GLctx["enable"](x0);
}
function _glEnableVertexAttribArray(index) {
 GLctx.enableVertexAttribArray(index);
}
function _glFlush() {
 GLctx["flush"]();
}
function _glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
 GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
}
function _glFramebufferTexture2D(target, attachment, textarget, texture, level) {
 GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
}
function _glGenBuffers(n, buffers) {
 for (var i = 0; i < n; i++) {
  var buffer = GLctx.createBuffer();
  if (!buffer) {
   GL.recordError(1282);
   while (i < n) HEAP32[buffers + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.buffers);
  buffer.name = id;
  GL.buffers[id] = buffer;
  HEAP32[buffers + i * 4 >> 2] = id;
 }
}
function _glGenFramebuffers(n, ids) {
 for (var i = 0; i < n; ++i) {
  var framebuffer = GLctx.createFramebuffer();
  if (!framebuffer) {
   GL.recordError(1282);
   while (i < n) HEAP32[ids + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.framebuffers);
  framebuffer.name = id;
  GL.framebuffers[id] = framebuffer;
  HEAP32[ids + i * 4 >> 2] = id;
 }
}
function _glGenRenderbuffers(n, renderbuffers) {
 for (var i = 0; i < n; i++) {
  var renderbuffer = GLctx.createRenderbuffer();
  if (!renderbuffer) {
   GL.recordError(1282);
   while (i < n) HEAP32[renderbuffers + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.renderbuffers);
  renderbuffer.name = id;
  GL.renderbuffers[id] = renderbuffer;
  HEAP32[renderbuffers + i * 4 >> 2] = id;
 }
}
function _glGenTextures(n, textures) {
 for (var i = 0; i < n; i++) {
  var texture = GLctx.createTexture();
  if (!texture) {
   GL.recordError(1282);
   while (i < n) HEAP32[textures + i++ * 4 >> 2] = 0;
   return;
  }
  var id = GL.getNewId(GL.textures);
  texture.name = id;
  GL.textures[id] = texture;
  HEAP32[textures + i * 4 >> 2] = id;
 }
}
function _glGenerateMipmap(x0) {
 GLctx["generateMipmap"](x0);
}
function _glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
 program = GL.programs[program];
 var info = GLctx.getActiveAttrib(program, index);
 if (!info) return;
 if (bufSize > 0 && name) {
  var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
 if (size) HEAP32[size >> 2] = info.size;
 if (type) HEAP32[type >> 2] = info.type;
}
function _glGetActiveUniform(program, index, bufSize, length, size, type, name) {
 program = GL.programs[program];
 var info = GLctx.getActiveUniform(program, index);
 if (!info) return;
 if (bufSize > 0 && name) {
  var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
 if (size) HEAP32[size >> 2] = info.size;
 if (type) HEAP32[type >> 2] = info.type;
}
function _glGetAttribLocation(program, name) {
 program = GL.programs[program];
 name = Pointer_stringify(name);
 return GLctx.getAttribLocation(program, name);
}
function _glGetError() {
 if (GL.lastError) {
  var error = GL.lastError;
  GL.lastError = 0;
  return error;
 } else {
  return GLctx.getError();
 }
}
function _glGetFloatv(name_, p) {
 emscriptenWebGLGet(name_, p, "Float");
}
function _glGetIntegerv(name_, p) {
 emscriptenWebGLGet(name_, p, "Integer");
}
function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
 var log = GLctx.getProgramInfoLog(GL.programs[program]);
 if (log === null) log = "(unknown error)";
 if (maxLength > 0 && infoLog) {
  var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
}
function _glGetProgramiv(program, pname, p) {
 if (!p) {
  GL.recordError(1281);
  return;
 }
 if (program >= GL.counter) {
  GL.recordError(1281);
  return;
 }
 var ptable = GL.programInfos[program];
 if (!ptable) {
  GL.recordError(1282);
  return;
 }
 if (pname == 35716) {
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  HEAP32[p >> 2] = log.length + 1;
 } else if (pname == 35719) {
  HEAP32[p >> 2] = ptable.maxUniformLength;
 } else if (pname == 35722) {
  if (ptable.maxAttributeLength == -1) {
   program = GL.programs[program];
   var numAttribs = GLctx.getProgramParameter(program, GLctx.ACTIVE_ATTRIBUTES);
   ptable.maxAttributeLength = 0;
   for (var i = 0; i < numAttribs; ++i) {
    var activeAttrib = GLctx.getActiveAttrib(program, i);
    ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length + 1);
   }
  }
  HEAP32[p >> 2] = ptable.maxAttributeLength;
 } else if (pname == 35381) {
  if (ptable.maxUniformBlockNameLength == -1) {
   program = GL.programs[program];
   var numBlocks = GLctx.getProgramParameter(program, GLctx.ACTIVE_UNIFORM_BLOCKS);
   ptable.maxUniformBlockNameLength = 0;
   for (var i = 0; i < numBlocks; ++i) {
    var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
    ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length + 1);
   }
  }
  HEAP32[p >> 2] = ptable.maxUniformBlockNameLength;
 } else {
  HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname);
 }
}
function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
 var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
 if (log === null) log = "(unknown error)";
 if (maxLength > 0 && infoLog) {
  var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
 } else {
  if (length) HEAP32[length >> 2] = 0;
 }
}
function _glGetShaderiv(shader, pname, p) {
 if (!p) {
  GL.recordError(1281);
  return;
 }
 if (pname == 35716) {
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  HEAP32[p >> 2] = log.length + 1;
 } else if (pname == 35720) {
  var source = GLctx.getShaderSource(GL.shaders[shader]);
  var sourceLength = source === null || source.length == 0 ? 0 : source.length + 1;
  HEAP32[p >> 2] = sourceLength;
 } else {
  HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
 }
}
function _glGetString(name_) {
 if (GL.stringCache[name_]) return GL.stringCache[name_];
 var ret;
 switch (name_) {
 case 7936:
 case 7937:
 case 37445:
 case 37446:
  ret = allocate(intArrayFromString(GLctx.getParameter(name_)), "i8", ALLOC_NORMAL);
  break;
 case 7938:
  var glVersion = GLctx.getParameter(GLctx.VERSION);
  if (GLctx.canvas.GLctxObject.version >= 2) glVersion = "OpenGL ES 3.0 (" + glVersion + ")"; else {
   glVersion = "OpenGL ES 2.0 (" + glVersion + ")";
  }
  ret = allocate(intArrayFromString(glVersion), "i8", ALLOC_NORMAL);
  break;
 case 7939:
  var exts = GLctx.getSupportedExtensions();
  var gl_exts = [];
  for (var i = 0; i < exts.length; ++i) {
   gl_exts.push(exts[i]);
   gl_exts.push("GL_" + exts[i]);
  }
  ret = allocate(intArrayFromString(gl_exts.join(" ")), "i8", ALLOC_NORMAL);
  break;
 case 35724:
  var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
  var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
  var ver_num = glslVersion.match(ver_re);
  if (ver_num !== null) {
   if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
   glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")";
  }
  ret = allocate(intArrayFromString(glslVersion), "i8", ALLOC_NORMAL);
  break;
 default:
  GL.recordError(1280);
  return 0;
 }
 GL.stringCache[name_] = ret;
 return ret;
}
function _glGetUniformLocation(program, name) {
 name = Pointer_stringify(name);
 var arrayOffset = 0;
 if (name.indexOf("]", name.length - 1) !== -1) {
  var ls = name.lastIndexOf("[");
  var arrayIndex = name.slice(ls + 1, -1);
  if (arrayIndex.length > 0) {
   arrayOffset = parseInt(arrayIndex);
   if (arrayOffset < 0) {
    return -1;
   }
  }
  name = name.slice(0, ls);
 }
 var ptable = GL.programInfos[program];
 if (!ptable) {
  return -1;
 }
 var utable = ptable.uniforms;
 var uniformInfo = utable[name];
 if (uniformInfo && arrayOffset < uniformInfo[0]) {
  return uniformInfo[1] + arrayOffset;
 } else {
  return -1;
 }
}
function _glLinkProgram(program) {
 GLctx.linkProgram(GL.programs[program]);
 GL.programInfos[program] = null;
 GL.populateUniformTable(program);
}
function _glPixelStorei(pname, param) {
 if (pname == 3333) {
  GL.packAlignment = param;
 } else if (pname == 3317) {
  GL.unpackAlignment = param;
 }
 GLctx.pixelStorei(pname, param);
}
function _glReadPixels(x, y, width, height, format, type, pixels) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  if (GLctx.currentPixelPackBufferBinding) {
   GLctx.readPixels(x, y, width, height, format, type, pixels);
  } else {
   GLctx.readPixels(x, y, width, height, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type));
  }
  return;
 }
 var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
 if (!pixelData) {
  GL.recordError(1280);
  return;
 }
 GLctx.readPixels(x, y, width, height, format, type, pixelData);
}
function _glRenderbufferStorage(x0, x1, x2, x3) {
 GLctx["renderbufferStorage"](x0, x1, x2, x3);
}
function _glScissor(x0, x1, x2, x3) {
 GLctx["scissor"](x0, x1, x2, x3);
}
function _glShaderSource(shader, count, string, length) {
 var source = GL.getSource(shader, count, string, length);
 GLctx.shaderSource(GL.shaders[shader], source);
}
function _glStencilFuncSeparate(x0, x1, x2, x3) {
 GLctx["stencilFuncSeparate"](x0, x1, x2, x3);
}
function _glStencilOpSeparate(x0, x1, x2, x3) {
 GLctx["stencilOpSeparate"](x0, x1, x2, x3);
}
function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  if (GLctx.currentPixelUnpackBufferBinding) {
   GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
  } else if (pixels != 0) {
   GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type));
  } else {
   GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null);
  }
  return;
 }
 var pixelData = null;
 if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat);
 GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
}
function _glTexParameterf(x0, x1, x2) {
 GLctx["texParameterf"](x0, x1, x2);
}
function _glTexParameterfv(target, pname, params) {
 var param = HEAPF32[params >> 2];
 GLctx.texParameterf(target, pname, param);
}
function _glTexParameteri(x0, x1, x2) {
 GLctx["texParameteri"](x0, x1, x2);
}
function _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  if (GLctx.currentPixelUnpackBufferBinding) {
   GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
  } else if (pixels != 0) {
   GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type));
  } else {
   GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null);
  }
  return;
 }
 var pixelData = null;
 if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
 GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
}
function _glUniform1i(location, v0) {
 GLctx.uniform1i(GL.uniforms[location], v0);
}
function _glUniform1iv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform1iv(GL.uniforms[location], HEAP32, value >> 2, count);
  return;
 }
 GLctx.uniform1iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 4 >> 2));
}
function _glUniform4fv(location, count, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniform4fv(GL.uniforms[location], HEAPF32, value >> 2, count * 4);
  return;
 }
 var view;
 if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[4 * count - 1];
  for (var i = 0; i < 4 * count; i += 4) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
   view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
   view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2);
 }
 GLctx.uniform4fv(GL.uniforms[location], view);
}
function _glUniformMatrix3fv(location, count, transpose, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, HEAPF32, value >> 2, count * 9);
  return;
 }
 var view;
 if (9 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[9 * count - 1];
  for (var i = 0; i < 9 * count; i += 9) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
   view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
   view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
   view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
   view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
   view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
   view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
   view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2);
 }
 GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view);
}
function _glUniformMatrix4fv(location, count, transpose, value) {
 if (GL.currentContext.supportsWebGL2EntryPoints) {
  GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, HEAPF32, value >> 2, count * 16);
  return;
 }
 var view;
 if (16 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
  view = GL.miniTempBufferViews[16 * count - 1];
  for (var i = 0; i < 16 * count; i += 16) {
   view[i] = HEAPF32[value + 4 * i >> 2];
   view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
   view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
   view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
   view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
   view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
   view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
   view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
   view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2];
   view[i + 9] = HEAPF32[value + (4 * i + 36) >> 2];
   view[i + 10] = HEAPF32[value + (4 * i + 40) >> 2];
   view[i + 11] = HEAPF32[value + (4 * i + 44) >> 2];
   view[i + 12] = HEAPF32[value + (4 * i + 48) >> 2];
   view[i + 13] = HEAPF32[value + (4 * i + 52) >> 2];
   view[i + 14] = HEAPF32[value + (4 * i + 56) >> 2];
   view[i + 15] = HEAPF32[value + (4 * i + 60) >> 2];
  }
 } else {
  view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2);
 }
 GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view);
}
function _glUseProgram(program) {
 GLctx.useProgram(program ? GL.programs[program] : null);
}
function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
 GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}
function _glViewport(x0, x1, x2, x3) {
 GLctx["viewport"](x0, x1, x2, x3);
}
var ___tm_current = STATICTOP;
STATICTOP += 48;
var ___tm_timezone = allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC);
function _gmtime_r(time, tmPtr) {
 var date = new Date(HEAP32[time >> 2] * 1e3);
 HEAP32[tmPtr >> 2] = date.getUTCSeconds();
 HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
 HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
 HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
 HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
 HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
 HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
 HEAP32[tmPtr + 36 >> 2] = 0;
 HEAP32[tmPtr + 32 >> 2] = 0;
 var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
 var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
 HEAP32[tmPtr + 28 >> 2] = yday;
 HEAP32[tmPtr + 40 >> 2] = ___tm_timezone;
 return tmPtr;
}
function _gmtime(time) {
 return _gmtime_r(time, ___tm_current);
}
var cttz_i8 = allocate([ 8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0 ], "i8", ALLOC_STATIC);
function _llvm_trap() {
 abort("trap!");
}
var _tzname = STATICTOP;
STATICTOP += 16;
var _daylight = STATICTOP;
STATICTOP += 16;
var _timezone = STATICTOP;
STATICTOP += 16;
function _tzset() {
 if (_tzset.called) return;
 _tzset.called = true;
 HEAP32[_timezone >> 2] = (new Date).getTimezoneOffset() * 60;
 var winter = new Date(2e3, 0, 1);
 var summer = new Date(2e3, 6, 1);
 HEAP32[_daylight >> 2] = Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
 function extractZone(date) {
  var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
  return match ? match[1] : "GMT";
 }
 var winterName = extractZone(winter);
 var summerName = extractZone(summer);
 var winterNamePtr = allocate(intArrayFromString(winterName), "i8", ALLOC_NORMAL);
 var summerNamePtr = allocate(intArrayFromString(summerName), "i8", ALLOC_NORMAL);
 if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
  HEAP32[_tzname >> 2] = winterNamePtr;
  HEAP32[_tzname + 4 >> 2] = summerNamePtr;
 } else {
  HEAP32[_tzname >> 2] = summerNamePtr;
  HEAP32[_tzname + 4 >> 2] = winterNamePtr;
 }
}
function _localtime_r(time, tmPtr) {
 _tzset();
 var date = new Date(HEAP32[time >> 2] * 1e3);
 HEAP32[tmPtr >> 2] = date.getSeconds();
 HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
 HEAP32[tmPtr + 8 >> 2] = date.getHours();
 HEAP32[tmPtr + 12 >> 2] = date.getDate();
 HEAP32[tmPtr + 16 >> 2] = date.getMonth();
 HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
 HEAP32[tmPtr + 24 >> 2] = date.getDay();
 var start = new Date(date.getFullYear(), 0, 1);
 var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
 HEAP32[tmPtr + 28 >> 2] = yday;
 HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
 var summerOffset = (new Date(2e3, 6, 1)).getTimezoneOffset();
 var winterOffset = start.getTimezoneOffset();
 var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
 HEAP32[tmPtr + 32 >> 2] = dst;
 var zonePtr = HEAP32[_tzname + (dst ? 4 : 0) >> 2];
 HEAP32[tmPtr + 40 >> 2] = zonePtr;
 return tmPtr;
}
function _localtime(time) {
 return _localtime_r(time, ___tm_current);
}
function _emscripten_memcpy_big(dest, src, num) {
 HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
 return dest;
}
function _mktime(tmPtr) {
 _tzset();
 var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
 var dst = HEAP32[tmPtr + 32 >> 2];
 var guessedOffset = date.getTimezoneOffset();
 var start = new Date(date.getFullYear(), 0, 1);
 var summerOffset = (new Date(2e3, 6, 1)).getTimezoneOffset();
 var winterOffset = start.getTimezoneOffset();
 var dstOffset = Math.min(winterOffset, summerOffset);
 if (dst < 0) {
  HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
 } else if (dst > 0 != (dstOffset == guessedOffset)) {
  var nonDstOffset = Math.max(winterOffset, summerOffset);
  var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
  date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
 }
 HEAP32[tmPtr + 24 >> 2] = date.getDay();
 var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
 HEAP32[tmPtr + 28 >> 2] = yday;
 return date.getTime() / 1e3 | 0;
}
function _pthread_cond_wait() {
 return 0;
}
var PTHREAD_SPECIFIC = {};
function _pthread_getspecific(key) {
 return PTHREAD_SPECIFIC[key] || 0;
}
var PTHREAD_SPECIFIC_NEXT_KEY = 1;
function _pthread_key_create(key, destructor) {
 if (key == 0) {
  return ERRNO_CODES.EINVAL;
 }
 HEAP32[key >> 2] = PTHREAD_SPECIFIC_NEXT_KEY;
 PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY] = 0;
 PTHREAD_SPECIFIC_NEXT_KEY++;
 return 0;
}
function _pthread_mutex_destroy() {}
function _pthread_mutex_init() {}
function _pthread_mutexattr_init() {}
function _pthread_mutexattr_settype() {}
function _pthread_once(ptr, func) {
 if (!_pthread_once.seen) _pthread_once.seen = {};
 if (ptr in _pthread_once.seen) return;
 Module["dynCall_v"](func);
 _pthread_once.seen[ptr] = 1;
}
function _pthread_setspecific(key, value) {
 if (!(key in PTHREAD_SPECIFIC)) {
  return ERRNO_CODES.EINVAL;
 }
 PTHREAD_SPECIFIC[key] = value;
 return 0;
}
function __isLeapYear(year) {
 return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function __arraySum(array, index) {
 var sum = 0;
 for (var i = 0; i <= index; sum += array[i++]) ;
 return sum;
}
var __MONTH_DAYS_LEAP = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
var __MONTH_DAYS_REGULAR = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
function __addDays(date, days) {
 var newDate = new Date(date.getTime());
 while (days > 0) {
  var leap = __isLeapYear(newDate.getFullYear());
  var currentMonth = newDate.getMonth();
  var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
  if (days > daysInCurrentMonth - newDate.getDate()) {
   days -= daysInCurrentMonth - newDate.getDate() + 1;
   newDate.setDate(1);
   if (currentMonth < 11) {
    newDate.setMonth(currentMonth + 1);
   } else {
    newDate.setMonth(0);
    newDate.setFullYear(newDate.getFullYear() + 1);
   }
  } else {
   newDate.setDate(newDate.getDate() + days);
   return newDate;
  }
 }
 return newDate;
}
function _strftime(s, maxsize, format, tm) {
 var tm_zone = HEAP32[tm + 40 >> 2];
 var date = {
  tm_sec: HEAP32[tm >> 2],
  tm_min: HEAP32[tm + 4 >> 2],
  tm_hour: HEAP32[tm + 8 >> 2],
  tm_mday: HEAP32[tm + 12 >> 2],
  tm_mon: HEAP32[tm + 16 >> 2],
  tm_year: HEAP32[tm + 20 >> 2],
  tm_wday: HEAP32[tm + 24 >> 2],
  tm_yday: HEAP32[tm + 28 >> 2],
  tm_isdst: HEAP32[tm + 32 >> 2],
  tm_gmtoff: HEAP32[tm + 36 >> 2],
  tm_zone: tm_zone ? Pointer_stringify(tm_zone) : ""
 };
 var pattern = Pointer_stringify(format);
 var EXPANSION_RULES_1 = {
  "%c": "%a %b %d %H:%M:%S %Y",
  "%D": "%m/%d/%y",
  "%F": "%Y-%m-%d",
  "%h": "%b",
  "%r": "%I:%M:%S %p",
  "%R": "%H:%M",
  "%T": "%H:%M:%S",
  "%x": "%m/%d/%y",
  "%X": "%H:%M:%S"
 };
 for (var rule in EXPANSION_RULES_1) {
  pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
 }
 var WEEKDAYS = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
 var MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
 function leadingSomething(value, digits, character) {
  var str = typeof value === "number" ? value.toString() : value || "";
  while (str.length < digits) {
   str = character[0] + str;
  }
  return str;
 }
 function leadingNulls(value, digits) {
  return leadingSomething(value, digits, "0");
 }
 function compareByDay(date1, date2) {
  function sgn(value) {
   return value < 0 ? -1 : value > 0 ? 1 : 0;
  }
  var compare;
  if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
   if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
    compare = sgn(date1.getDate() - date2.getDate());
   }
  }
  return compare;
 }
 function getFirstWeekStartDate(janFourth) {
  switch (janFourth.getDay()) {
  case 0:
   return new Date(janFourth.getFullYear() - 1, 11, 29);
  case 1:
   return janFourth;
  case 2:
   return new Date(janFourth.getFullYear(), 0, 3);
  case 3:
   return new Date(janFourth.getFullYear(), 0, 2);
  case 4:
   return new Date(janFourth.getFullYear(), 0, 1);
  case 5:
   return new Date(janFourth.getFullYear() - 1, 11, 31);
  case 6:
   return new Date(janFourth.getFullYear() - 1, 11, 30);
  }
 }
 function getWeekBasedYear(date) {
  var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
  var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
  var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
  var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
  var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
   if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
    return thisDate.getFullYear() + 1;
   } else {
    return thisDate.getFullYear();
   }
  } else {
   return thisDate.getFullYear() - 1;
  }
 }
 var EXPANSION_RULES_2 = {
  "%a": (function(date) {
   return WEEKDAYS[date.tm_wday].substring(0, 3);
  }),
  "%A": (function(date) {
   return WEEKDAYS[date.tm_wday];
  }),
  "%b": (function(date) {
   return MONTHS[date.tm_mon].substring(0, 3);
  }),
  "%B": (function(date) {
   return MONTHS[date.tm_mon];
  }),
  "%C": (function(date) {
   var year = date.tm_year + 1900;
   return leadingNulls(year / 100 | 0, 2);
  }),
  "%d": (function(date) {
   return leadingNulls(date.tm_mday, 2);
  }),
  "%e": (function(date) {
   return leadingSomething(date.tm_mday, 2, " ");
  }),
  "%g": (function(date) {
   return getWeekBasedYear(date).toString().substring(2);
  }),
  "%G": (function(date) {
   return getWeekBasedYear(date);
  }),
  "%H": (function(date) {
   return leadingNulls(date.tm_hour, 2);
  }),
  "%I": (function(date) {
   var twelveHour = date.tm_hour;
   if (twelveHour == 0) twelveHour = 12; else if (twelveHour > 12) twelveHour -= 12;
   return leadingNulls(twelveHour, 2);
  }),
  "%j": (function(date) {
   return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3);
  }),
  "%m": (function(date) {
   return leadingNulls(date.tm_mon + 1, 2);
  }),
  "%M": (function(date) {
   return leadingNulls(date.tm_min, 2);
  }),
  "%n": (function() {
   return "\n";
  }),
  "%p": (function(date) {
   if (date.tm_hour >= 0 && date.tm_hour < 12) {
    return "AM";
   } else {
    return "PM";
   }
  }),
  "%S": (function(date) {
   return leadingNulls(date.tm_sec, 2);
  }),
  "%t": (function() {
   return "\t";
  }),
  "%u": (function(date) {
   var day = new Date(date.tm_year + 1900, date.tm_mon + 1, date.tm_mday, 0, 0, 0, 0);
   return day.getDay() || 7;
  }),
  "%U": (function(date) {
   var janFirst = new Date(date.tm_year + 1900, 0, 1);
   var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
   var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
   if (compareByDay(firstSunday, endDate) < 0) {
    var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
    var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
    var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
    return leadingNulls(Math.ceil(days / 7), 2);
   }
   return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
  }),
  "%V": (function(date) {
   var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
   var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
   var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
   var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
   var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
   if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
    return "53";
   }
   if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
    return "01";
   }
   var daysDifference;
   if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
    daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
   } else {
    daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
   }
   return leadingNulls(Math.ceil(daysDifference / 7), 2);
  }),
  "%w": (function(date) {
   var day = new Date(date.tm_year + 1900, date.tm_mon + 1, date.tm_mday, 0, 0, 0, 0);
   return day.getDay();
  }),
  "%W": (function(date) {
   var janFirst = new Date(date.tm_year, 0, 1);
   var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
   var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
   if (compareByDay(firstMonday, endDate) < 0) {
    var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
    var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
    var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
    return leadingNulls(Math.ceil(days / 7), 2);
   }
   return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
  }),
  "%y": (function(date) {
   return (date.tm_year + 1900).toString().substring(2);
  }),
  "%Y": (function(date) {
   return date.tm_year + 1900;
  }),
  "%z": (function(date) {
   var off = date.tm_gmtoff;
   var ahead = off >= 0;
   off = Math.abs(off) / 60;
   off = off / 60 * 100 + off % 60;
   return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
  }),
  "%Z": (function(date) {
   return date.tm_zone;
  }),
  "%%": (function() {
   return "%";
  })
 };
 for (var rule in EXPANSION_RULES_2) {
  if (pattern.indexOf(rule) >= 0) {
   pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
  }
 }
 var bytes = intArrayFromString(pattern, false);
 if (bytes.length > maxsize) {
  return 0;
 }
 writeArrayToMemory(bytes, s);
 return bytes.length - 1;
}
function _strftime_l(s, maxsize, format, tm) {
 return _strftime(s, maxsize, format, tm);
}
function _system(command) {
 ___setErrNo(ERRNO_CODES.EAGAIN);
 return -1;
}
function _time(ptr) {
 var ret = Date.now() / 1e3 | 0;
 if (ptr) {
  HEAP32[ptr >> 2] = ret;
 }
 return ret;
}
if (ENVIRONMENT_IS_NODE) {
 _emscripten_get_now = function _emscripten_get_now_actual() {
  var t = process["hrtime"]();
  return t[0] * 1e3 + t[1] / 1e6;
 };
} else if (typeof dateNow !== "undefined") {
 _emscripten_get_now = dateNow;
} else if (typeof self === "object" && self["performance"] && typeof self["performance"]["now"] === "function") {
 _emscripten_get_now = (function() {
  return self["performance"]["now"]();
 });
} else if (typeof performance === "object" && typeof performance["now"] === "function") {
 _emscripten_get_now = (function() {
  return performance["now"]();
 });
} else {
 _emscripten_get_now = Date.now;
}
FS.staticInit();
__ATINIT__.unshift((function() {
 if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
}));
__ATMAIN__.push((function() {
 FS.ignorePermissions = false;
}));
__ATEXIT__.push((function() {
 FS.quit();
}));
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
__ATINIT__.unshift((function() {
 TTY.init();
}));
__ATEXIT__.push((function() {
 TTY.shutdown();
}));
if (ENVIRONMENT_IS_NODE) {
 var fs = require("fs");
 var NODEJS_PATH = require("path");
 NODEFS.staticInit();
}
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas, vrDevice) {
 Module.printErr("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead.");
 Module["requestFullScreen"] = Module["requestFullscreen"];
 Browser.requestFullScreen(lockPointer, resizeCanvas, vrDevice);
};
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas, vrDevice) {
 Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
 Browser.requestAnimationFrame(func);
};
Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
 Browser.setCanvasSize(width, height, noUpdates);
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
 Browser.mainLoop.pause();
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
 Browser.mainLoop.resume();
};
Module["getUserMedia"] = function Module_getUserMedia() {
 Browser.getUserMedia();
};
Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
 return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes);
};
var GLctx;
GL.init();
JSEvents.staticInit();
___buildEnvironment(ENV);
DYNAMICTOP_PTR = staticAlloc(4);
STACK_BASE = STACKTOP = alignMemory(STATICTOP);
STACK_MAX = STACK_BASE + TOTAL_STACK;
DYNAMIC_BASE = alignMemory(STACK_MAX);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
staticSealed = true;
function intArrayFromString(stringy, dontAddNull, length) {
 var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
 var u8array = new Array(len);
 var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
 if (dontAddNull) u8array.length = numBytesWritten;
 return u8array;
}
Module["wasmTableSize"] = 2347017;
Module["wasmMaxTableSize"] = 2347017;
function invoke_ii(index, a1) {
 try {
  return Module["dynCall_ii"](index, a1);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  Module["setThrew"](1, 0);
 }
}
function invoke_iii(index, a1, a2) {
 try {
  return Module["dynCall_iii"](index, a1, a2);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  Module["setThrew"](1, 0);
 }
}
function invoke_vi(index, a1) {
 try {
  Module["dynCall_vi"](index, a1);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  Module["setThrew"](1, 0);
 }
}
function invoke_vii(index, a1, a2) {
 try {
  Module["dynCall_vii"](index, a1, a2);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  Module["setThrew"](1, 0);
 }
}
function invoke_viii(index, a1, a2, a3) {
 try {
  Module["dynCall_viii"](index, a1, a2, a3);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  Module["setThrew"](1, 0);
 }
}
function invoke_viiiii(index, a1, a2, a3, a4, a5) {
 try {
  Module["dynCall_viiiii"](index, a1, a2, a3, a4, a5);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  Module["setThrew"](1, 0);
 }
}
Module.asmGlobalArg = {};
Module.asmLibraryArg = {
 "abort": abort,
 "enlargeMemory": enlargeMemory,
 "getTotalMemory": getTotalMemory,
 "abortOnCannotGrowMemory": abortOnCannotGrowMemory,
 "invoke_ii": invoke_ii,
 "invoke_iii": invoke_iii,
 "invoke_vi": invoke_vi,
 "invoke_vii": invoke_vii,
 "invoke_viii": invoke_viii,
 "invoke_viiiii": invoke_viiiii,
 "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv,
 "___clock_gettime": ___clock_gettime,
 "___cxa_pure_virtual": ___cxa_pure_virtual,
 "___lock": ___lock,
 "___map_file": ___map_file,
 "___setErrNo": ___setErrNo,
 "___syscall10": ___syscall10,
 "___syscall140": ___syscall140,
 "___syscall145": ___syscall145,
 "___syscall146": ___syscall146,
 "___syscall196": ___syscall196,
 "___syscall220": ___syscall220,
 "___syscall221": ___syscall221,
 "___syscall3": ___syscall3,
 "___syscall330": ___syscall330,
 "___syscall38": ___syscall38,
 "___syscall40": ___syscall40,
 "___syscall5": ___syscall5,
 "___syscall54": ___syscall54,
 "___syscall6": ___syscall6,
 "___syscall63": ___syscall63,
 "___syscall91": ___syscall91,
 "___unlock": ___unlock,
 "_abort": _abort,
 "_alBufferData": _alBufferData,
 "_alDeleteBuffers": _alDeleteBuffers,
 "_alDeleteSources": _alDeleteSources,
 "_alGenBuffers": _alGenBuffers,
 "_alGenSources": _alGenSources,
 "_alGetBufferi": _alGetBufferi,
 "_alGetEnumValue": _alGetEnumValue,
 "_alGetError": _alGetError,
 "_alGetSourcef": _alGetSourcef,
 "_alGetSourcei": _alGetSourcei,
 "_alListener3f": _alListener3f,
 "_alListenerfv": _alListenerfv,
 "_alSource3f": _alSource3f,
 "_alSourcePause": _alSourcePause,
 "_alSourcePlay": _alSourcePlay,
 "_alSourceQueueBuffers": _alSourceQueueBuffers,
 "_alSourceRewind": _alSourceRewind,
 "_alSourceStop": _alSourceStop,
 "_alSourceUnqueueBuffers": _alSourceUnqueueBuffers,
 "_alSourcef": _alSourcef,
 "_alSourcei": _alSourcei,
 "_alcCloseDevice": _alcCloseDevice,
 "_alcCreateContext": _alcCreateContext,
 "_alcDestroyContext": _alcDestroyContext,
 "_alcGetEnumValue": _alcGetEnumValue,
 "_alcGetError": _alcGetError,
 "_alcGetString": _alcGetString,
 "_alcMakeContextCurrent": _alcMakeContextCurrent,
 "_alcOpenDevice": _alcOpenDevice,
 "_atexit": _atexit,
 "_clock": _clock,
 "_difftime": _difftime,
 "_eglChooseConfig": _eglChooseConfig,
 "_eglCreateContext": _eglCreateContext,
 "_eglCreateWindowSurface": _eglCreateWindowSurface,
 "_eglDestroyContext": _eglDestroyContext,
 "_eglDestroySurface": _eglDestroySurface,
 "_eglGetDisplay": _eglGetDisplay,
 "_eglGetProcAddress": _eglGetProcAddress,
 "_eglInitialize": _eglInitialize,
 "_eglMakeCurrent": _eglMakeCurrent,
 "_eglQueryString": _eglQueryString,
 "_eglSwapBuffers": _eglSwapBuffers,
 "_eglTerminate": _eglTerminate,
 "_emscripten_asm_const_iii": _emscripten_asm_const_iii,
 "_emscripten_exit_pointerlock": _emscripten_exit_pointerlock,
 "_emscripten_get_element_css_size": _emscripten_get_element_css_size,
 "_emscripten_get_now": _emscripten_get_now,
 "_emscripten_get_pointerlock_status": _emscripten_get_pointerlock_status,
 "_emscripten_glActiveTexture": _emscripten_glActiveTexture,
 "_emscripten_glAttachShader": _emscripten_glAttachShader,
 "_emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation,
 "_emscripten_glBindBuffer": _emscripten_glBindBuffer,
 "_emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer,
 "_emscripten_glBindProgramARB": _emscripten_glBindProgramARB,
 "_emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer,
 "_emscripten_glBindTexture": _emscripten_glBindTexture,
 "_emscripten_glBindVertexArray": _emscripten_glBindVertexArray,
 "_emscripten_glBlendColor": _emscripten_glBlendColor,
 "_emscripten_glBlendEquation": _emscripten_glBlendEquation,
 "_emscripten_glBlendEquationSeparate": _emscripten_glBlendEquationSeparate,
 "_emscripten_glBlendFunc": _emscripten_glBlendFunc,
 "_emscripten_glBlendFuncSeparate": _emscripten_glBlendFuncSeparate,
 "_emscripten_glBufferData": _emscripten_glBufferData,
 "_emscripten_glBufferSubData": _emscripten_glBufferSubData,
 "_emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus,
 "_emscripten_glClear": _emscripten_glClear,
 "_emscripten_glClearColor": _emscripten_glClearColor,
 "_emscripten_glClearDepth": _emscripten_glClearDepth,
 "_emscripten_glClearDepthf": _emscripten_glClearDepthf,
 "_emscripten_glClearStencil": _emscripten_glClearStencil,
 "_emscripten_glClientActiveTexture": _emscripten_glClientActiveTexture,
 "_emscripten_glColorMask": _emscripten_glColorMask,
 "_emscripten_glColorPointer": _emscripten_glColorPointer,
 "_emscripten_glCompileShader": _emscripten_glCompileShader,
 "_emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D,
 "_emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D,
 "_emscripten_glCopyTexImage2D": _emscripten_glCopyTexImage2D,
 "_emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D,
 "_emscripten_glCreateProgram": _emscripten_glCreateProgram,
 "_emscripten_glCreateShader": _emscripten_glCreateShader,
 "_emscripten_glCullFace": _emscripten_glCullFace,
 "_emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers,
 "_emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers,
 "_emscripten_glDeleteObjectARB": _emscripten_glDeleteObjectARB,
 "_emscripten_glDeleteProgram": _emscripten_glDeleteProgram,
 "_emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers,
 "_emscripten_glDeleteShader": _emscripten_glDeleteShader,
 "_emscripten_glDeleteTextures": _emscripten_glDeleteTextures,
 "_emscripten_glDeleteVertexArrays": _emscripten_glDeleteVertexArrays,
 "_emscripten_glDepthFunc": _emscripten_glDepthFunc,
 "_emscripten_glDepthMask": _emscripten_glDepthMask,
 "_emscripten_glDepthRange": _emscripten_glDepthRange,
 "_emscripten_glDepthRangef": _emscripten_glDepthRangef,
 "_emscripten_glDetachShader": _emscripten_glDetachShader,
 "_emscripten_glDisable": _emscripten_glDisable,
 "_emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray,
 "_emscripten_glDrawArrays": _emscripten_glDrawArrays,
 "_emscripten_glDrawArraysInstanced": _emscripten_glDrawArraysInstanced,
 "_emscripten_glDrawBuffers": _emscripten_glDrawBuffers,
 "_emscripten_glDrawElements": _emscripten_glDrawElements,
 "_emscripten_glDrawElementsInstanced": _emscripten_glDrawElementsInstanced,
 "_emscripten_glDrawRangeElements": _emscripten_glDrawRangeElements,
 "_emscripten_glEnable": _emscripten_glEnable,
 "_emscripten_glEnableClientState": _emscripten_glEnableClientState,
 "_emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray,
 "_emscripten_glFinish": _emscripten_glFinish,
 "_emscripten_glFlush": _emscripten_glFlush,
 "_emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer,
 "_emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D,
 "_emscripten_glFrontFace": _emscripten_glFrontFace,
 "_emscripten_glFrustum": _emscripten_glFrustum,
 "_emscripten_glGenBuffers": _emscripten_glGenBuffers,
 "_emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers,
 "_emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers,
 "_emscripten_glGenTextures": _emscripten_glGenTextures,
 "_emscripten_glGenVertexArrays": _emscripten_glGenVertexArrays,
 "_emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap,
 "_emscripten_glGetActiveAttrib": _emscripten_glGetActiveAttrib,
 "_emscripten_glGetActiveUniform": _emscripten_glGetActiveUniform,
 "_emscripten_glGetAttachedShaders": _emscripten_glGetAttachedShaders,
 "_emscripten_glGetAttribLocation": _emscripten_glGetAttribLocation,
 "_emscripten_glGetBooleanv": _emscripten_glGetBooleanv,
 "_emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv,
 "_emscripten_glGetError": _emscripten_glGetError,
 "_emscripten_glGetFloatv": _emscripten_glGetFloatv,
 "_emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv,
 "_emscripten_glGetInfoLogARB": _emscripten_glGetInfoLogARB,
 "_emscripten_glGetIntegerv": _emscripten_glGetIntegerv,
 "_emscripten_glGetObjectParameterivARB": _emscripten_glGetObjectParameterivARB,
 "_emscripten_glGetPointerv": _emscripten_glGetPointerv,
 "_emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog,
 "_emscripten_glGetProgramiv": _emscripten_glGetProgramiv,
 "_emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv,
 "_emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog,
 "_emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat,
 "_emscripten_glGetShaderSource": _emscripten_glGetShaderSource,
 "_emscripten_glGetShaderiv": _emscripten_glGetShaderiv,
 "_emscripten_glGetString": _emscripten_glGetString,
 "_emscripten_glGetTexParameterfv": _emscripten_glGetTexParameterfv,
 "_emscripten_glGetTexParameteriv": _emscripten_glGetTexParameteriv,
 "_emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation,
 "_emscripten_glGetUniformfv": _emscripten_glGetUniformfv,
 "_emscripten_glGetUniformiv": _emscripten_glGetUniformiv,
 "_emscripten_glGetVertexAttribPointerv": _emscripten_glGetVertexAttribPointerv,
 "_emscripten_glGetVertexAttribfv": _emscripten_glGetVertexAttribfv,
 "_emscripten_glGetVertexAttribiv": _emscripten_glGetVertexAttribiv,
 "_emscripten_glHint": _emscripten_glHint,
 "_emscripten_glIsBuffer": _emscripten_glIsBuffer,
 "_emscripten_glIsEnabled": _emscripten_glIsEnabled,
 "_emscripten_glIsFramebuffer": _emscripten_glIsFramebuffer,
 "_emscripten_glIsProgram": _emscripten_glIsProgram,
 "_emscripten_glIsRenderbuffer": _emscripten_glIsRenderbuffer,
 "_emscripten_glIsShader": _emscripten_glIsShader,
 "_emscripten_glIsTexture": _emscripten_glIsTexture,
 "_emscripten_glIsVertexArray": _emscripten_glIsVertexArray,
 "_emscripten_glLineWidth": _emscripten_glLineWidth,
 "_emscripten_glLinkProgram": _emscripten_glLinkProgram,
 "_emscripten_glLoadIdentity": _emscripten_glLoadIdentity,
 "_emscripten_glLoadMatrixf": _emscripten_glLoadMatrixf,
 "_emscripten_glMatrixMode": _emscripten_glMatrixMode,
 "_emscripten_glNormalPointer": _emscripten_glNormalPointer,
 "_emscripten_glPixelStorei": _emscripten_glPixelStorei,
 "_emscripten_glPolygonOffset": _emscripten_glPolygonOffset,
 "_emscripten_glReadPixels": _emscripten_glReadPixels,
 "_emscripten_glReleaseShaderCompiler": _emscripten_glReleaseShaderCompiler,
 "_emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage,
 "_emscripten_glRotatef": _emscripten_glRotatef,
 "_emscripten_glSampleCoverage": _emscripten_glSampleCoverage,
 "_emscripten_glScissor": _emscripten_glScissor,
 "_emscripten_glShaderBinary": _emscripten_glShaderBinary,
 "_emscripten_glShaderSource": _emscripten_glShaderSource,
 "_emscripten_glStencilFunc": _emscripten_glStencilFunc,
 "_emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate,
 "_emscripten_glStencilMask": _emscripten_glStencilMask,
 "_emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate,
 "_emscripten_glStencilOp": _emscripten_glStencilOp,
 "_emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate,
 "_emscripten_glTexCoordPointer": _emscripten_glTexCoordPointer,
 "_emscripten_glTexImage2D": _emscripten_glTexImage2D,
 "_emscripten_glTexParameterf": _emscripten_glTexParameterf,
 "_emscripten_glTexParameterfv": _emscripten_glTexParameterfv,
 "_emscripten_glTexParameteri": _emscripten_glTexParameteri,
 "_emscripten_glTexParameteriv": _emscripten_glTexParameteriv,
 "_emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D,
 "_emscripten_glUniform1f": _emscripten_glUniform1f,
 "_emscripten_glUniform1fv": _emscripten_glUniform1fv,
 "_emscripten_glUniform1i": _emscripten_glUniform1i,
 "_emscripten_glUniform1iv": _emscripten_glUniform1iv,
 "_emscripten_glUniform2f": _emscripten_glUniform2f,
 "_emscripten_glUniform2fv": _emscripten_glUniform2fv,
 "_emscripten_glUniform2i": _emscripten_glUniform2i,
 "_emscripten_glUniform2iv": _emscripten_glUniform2iv,
 "_emscripten_glUniform3f": _emscripten_glUniform3f,
 "_emscripten_glUniform3fv": _emscripten_glUniform3fv,
 "_emscripten_glUniform3i": _emscripten_glUniform3i,
 "_emscripten_glUniform3iv": _emscripten_glUniform3iv,
 "_emscripten_glUniform4f": _emscripten_glUniform4f,
 "_emscripten_glUniform4fv": _emscripten_glUniform4fv,
 "_emscripten_glUniform4i": _emscripten_glUniform4i,
 "_emscripten_glUniform4iv": _emscripten_glUniform4iv,
 "_emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv,
 "_emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv,
 "_emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv,
 "_emscripten_glUseProgram": _emscripten_glUseProgram,
 "_emscripten_glValidateProgram": _emscripten_glValidateProgram,
 "_emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f,
 "_emscripten_glVertexAttrib1fv": _emscripten_glVertexAttrib1fv,
 "_emscripten_glVertexAttrib2f": _emscripten_glVertexAttrib2f,
 "_emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv,
 "_emscripten_glVertexAttrib3f": _emscripten_glVertexAttrib3f,
 "_emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv,
 "_emscripten_glVertexAttrib4f": _emscripten_glVertexAttrib4f,
 "_emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv,
 "_emscripten_glVertexAttribDivisor": _emscripten_glVertexAttribDivisor,
 "_emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer,
 "_emscripten_glVertexPointer": _emscripten_glVertexPointer,
 "_emscripten_glViewport": _emscripten_glViewport,
 "_emscripten_longjmp": _emscripten_longjmp,
 "_emscripten_memcpy_big": _emscripten_memcpy_big,
 "_emscripten_request_pointerlock": _emscripten_request_pointerlock,
 "_emscripten_set_canvas_element_size": _emscripten_set_canvas_element_size,
 "_emscripten_set_canvas_size": _emscripten_set_canvas_size,
 "_emscripten_set_keydown_callback": _emscripten_set_keydown_callback,
 "_emscripten_set_keypress_callback": _emscripten_set_keypress_callback,
 "_emscripten_set_keyup_callback": _emscripten_set_keyup_callback,
 "_emscripten_set_main_loop": _emscripten_set_main_loop,
 "_emscripten_set_mousedown_callback": _emscripten_set_mousedown_callback,
 "_emscripten_set_mousemove_callback": _emscripten_set_mousemove_callback,
 "_emscripten_set_mouseup_callback": _emscripten_set_mouseup_callback,
 "_emscripten_set_resize_callback": _emscripten_set_resize_callback,
 "_emscripten_set_wheel_callback": _emscripten_set_wheel_callback,
 "_exit": _exit,
 "_getenv": _getenv,
 "_gettimeofday": _gettimeofday,
 "_glActiveTexture": _glActiveTexture,
 "_glAttachShader": _glAttachShader,
 "_glBindBuffer": _glBindBuffer,
 "_glBindFramebuffer": _glBindFramebuffer,
 "_glBindRenderbuffer": _glBindRenderbuffer,
 "_glBindTexture": _glBindTexture,
 "_glBlendColor": _glBlendColor,
 "_glBlendEquationSeparate": _glBlendEquationSeparate,
 "_glBlendFuncSeparate": _glBlendFuncSeparate,
 "_glBufferData": _glBufferData,
 "_glBufferSubData": _glBufferSubData,
 "_glCheckFramebufferStatus": _glCheckFramebufferStatus,
 "_glClear": _glClear,
 "_glClearColor": _glClearColor,
 "_glClearDepthf": _glClearDepthf,
 "_glClearStencil": _glClearStencil,
 "_glColorMask": _glColorMask,
 "_glCompileShader": _glCompileShader,
 "_glCompressedTexImage2D": _glCompressedTexImage2D,
 "_glCompressedTexSubImage2D": _glCompressedTexSubImage2D,
 "_glCreateProgram": _glCreateProgram,
 "_glCreateShader": _glCreateShader,
 "_glCullFace": _glCullFace,
 "_glDeleteBuffers": _glDeleteBuffers,
 "_glDeleteFramebuffers": _glDeleteFramebuffers,
 "_glDeleteProgram": _glDeleteProgram,
 "_glDeleteRenderbuffers": _glDeleteRenderbuffers,
 "_glDeleteShader": _glDeleteShader,
 "_glDeleteTextures": _glDeleteTextures,
 "_glDepthFunc": _glDepthFunc,
 "_glDepthMask": _glDepthMask,
 "_glDetachShader": _glDetachShader,
 "_glDisable": _glDisable,
 "_glDisableVertexAttribArray": _glDisableVertexAttribArray,
 "_glDrawArrays": _glDrawArrays,
 "_glDrawElements": _glDrawElements,
 "_glEnable": _glEnable,
 "_glEnableVertexAttribArray": _glEnableVertexAttribArray,
 "_glFlush": _glFlush,
 "_glFramebufferRenderbuffer": _glFramebufferRenderbuffer,
 "_glFramebufferTexture2D": _glFramebufferTexture2D,
 "_glGenBuffers": _glGenBuffers,
 "_glGenFramebuffers": _glGenFramebuffers,
 "_glGenRenderbuffers": _glGenRenderbuffers,
 "_glGenTextures": _glGenTextures,
 "_glGenerateMipmap": _glGenerateMipmap,
 "_glGetActiveAttrib": _glGetActiveAttrib,
 "_glGetActiveUniform": _glGetActiveUniform,
 "_glGetAttribLocation": _glGetAttribLocation,
 "_glGetError": _glGetError,
 "_glGetFloatv": _glGetFloatv,
 "_glGetIntegerv": _glGetIntegerv,
 "_glGetProgramInfoLog": _glGetProgramInfoLog,
 "_glGetProgramiv": _glGetProgramiv,
 "_glGetShaderInfoLog": _glGetShaderInfoLog,
 "_glGetShaderiv": _glGetShaderiv,
 "_glGetString": _glGetString,
 "_glGetUniformLocation": _glGetUniformLocation,
 "_glLinkProgram": _glLinkProgram,
 "_glPixelStorei": _glPixelStorei,
 "_glReadPixels": _glReadPixels,
 "_glRenderbufferStorage": _glRenderbufferStorage,
 "_glScissor": _glScissor,
 "_glShaderSource": _glShaderSource,
 "_glStencilFuncSeparate": _glStencilFuncSeparate,
 "_glStencilOpSeparate": _glStencilOpSeparate,
 "_glTexImage2D": _glTexImage2D,
 "_glTexParameterf": _glTexParameterf,
 "_glTexParameterfv": _glTexParameterfv,
 "_glTexParameteri": _glTexParameteri,
 "_glTexSubImage2D": _glTexSubImage2D,
 "_glUniform1i": _glUniform1i,
 "_glUniform1iv": _glUniform1iv,
 "_glUniform4fv": _glUniform4fv,
 "_glUniformMatrix3fv": _glUniformMatrix3fv,
 "_glUniformMatrix4fv": _glUniformMatrix4fv,
 "_glUseProgram": _glUseProgram,
 "_glVertexAttribPointer": _glVertexAttribPointer,
 "_glViewport": _glViewport,
 "_gmtime": _gmtime,
 "_llvm_trap": _llvm_trap,
 "_localtime": _localtime,
 "_longjmp": _longjmp,
 "_mktime": _mktime,
 "_pthread_cond_wait": _pthread_cond_wait,
 "_pthread_getspecific": _pthread_getspecific,
 "_pthread_key_create": _pthread_key_create,
 "_pthread_mutex_destroy": _pthread_mutex_destroy,
 "_pthread_mutex_init": _pthread_mutex_init,
 "_pthread_mutexattr_init": _pthread_mutexattr_init,
 "_pthread_mutexattr_settype": _pthread_mutexattr_settype,
 "_pthread_once": _pthread_once,
 "_pthread_setspecific": _pthread_setspecific,
 "_strftime": _strftime,
 "_strftime_l": _strftime_l,
 "_system": _system,
 "_time": _time,
 "DYNAMICTOP_PTR": DYNAMICTOP_PTR,
 "STACKTOP": STACKTOP
};
var asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer);
Module["asm"] = asm;
var __GLOBAL__I_000101 = Module["__GLOBAL__I_000101"] = (function() {
 return Module["asm"]["__GLOBAL__I_000101"].apply(null, arguments);
});
var __GLOBAL__sub_I_Anim_cpp = Module["__GLOBAL__sub_I_Anim_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Anim_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_BulletCollider_cpp = Module["__GLOBAL__sub_I_BulletCollider_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_BulletCollider_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_BulletMotionState_cpp = Module["__GLOBAL__sub_I_BulletMotionState_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_BulletMotionState_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_BulletSolid_cpp = Module["__GLOBAL__sub_I_BulletSolid_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_BulletSolid_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_BulletWorld_cpp = Module["__GLOBAL__sub_I_BulletWorld_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_BulletWorld_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Draw_cpp = Module["__GLOBAL__sub_I_Draw_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Draw_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Elements_cpp = Module["__GLOBAL__sub_I_Elements_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Elements_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Icosphere_cpp = Module["__GLOBAL__sub_I_Icosphere_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Icosphere_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_ImporterGltf_cpp = Module["__GLOBAL__sub_I_ImporterGltf_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_ImporterGltf_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Inspector_cpp = Module["__GLOBAL__sub_I_Inspector_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Inspector_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Math_cpp = Module["__GLOBAL__sub_I_Math_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Math_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Meta_cpp = Module["__GLOBAL__sub_I_Meta_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Meta_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Movable_cpp = Module["__GLOBAL__sub_I_Movable_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Movable_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_ObjectPool_cpp = Module["__GLOBAL__sub_I_ObjectPool_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_ObjectPool_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Particles_cpp = Module["__GLOBAL__sub_I_Particles_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Particles_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Physic_cpp = Module["__GLOBAL__sub_I_Physic_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Physic_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Proto_cpp = Module["__GLOBAL__sub_I_Proto_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Proto_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_SPVRemapper_cpp = Module["__GLOBAL__sub_I_SPVRemapper_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_SPVRemapper_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Sky_cpp = Module["__GLOBAL__sub_I_Sky_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Sky_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Solid_cpp = Module["__GLOBAL__sub_I_Solid_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Solid_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_SoundMedium_cpp = Module["__GLOBAL__sub_I_SoundMedium_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_SoundMedium_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_SphereTriangleDetector_cpp = Module["__GLOBAL__sub_I_SphereTriangleDetector_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_SphereTriangleDetector_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Styler_cpp = Module["__GLOBAL__sub_I_Styler_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Styler_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_TypeIn_cpp = Module["__GLOBAL__sub_I_TypeIn_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_TypeIn_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_Type_cpp = Module["__GLOBAL__sub_I_Type_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_Type_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_VisuScene_cpp = Module["__GLOBAL__sub_I_VisuScene_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_VisuScene_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_VisualMedium_cpp = Module["__GLOBAL__sub_I_VisualMedium_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_VisualMedium_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_WorldPage_cpp = Module["__GLOBAL__sub_I_WorldPage_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_WorldPage_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btActivatingCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btActivatingCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btActivatingCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btAlignedAllocator_cpp = Module["__GLOBAL__sub_I_btAlignedAllocator_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btAlignedAllocator_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btAxisSweep3_cpp = Module["__GLOBAL__sub_I_btAxisSweep3_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btAxisSweep3_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btBox2dBox2dCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btBox2dBox2dCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btBox2dBox2dCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btBox2dShape_cpp = Module["__GLOBAL__sub_I_btBox2dShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btBox2dShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btBoxBoxCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btBoxBoxCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btBoxBoxCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btBoxBoxDetector_cpp = Module["__GLOBAL__sub_I_btBoxBoxDetector_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btBoxBoxDetector_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btBoxShape_cpp = Module["__GLOBAL__sub_I_btBoxShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btBoxShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btBroadphaseProxy_cpp = Module["__GLOBAL__sub_I_btBroadphaseProxy_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btBroadphaseProxy_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btBvhTriangleMeshShape_cpp = Module["__GLOBAL__sub_I_btBvhTriangleMeshShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btBvhTriangleMeshShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCapsuleShape_cpp = Module["__GLOBAL__sub_I_btCapsuleShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCapsuleShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCollisionDispatcherMt_cpp = Module["__GLOBAL__sub_I_btCollisionDispatcherMt_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCollisionDispatcherMt_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCollisionDispatcher_cpp = Module["__GLOBAL__sub_I_btCollisionDispatcher_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCollisionDispatcher_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCollisionObject_cpp = Module["__GLOBAL__sub_I_btCollisionObject_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCollisionObject_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCollisionShape_cpp = Module["__GLOBAL__sub_I_btCollisionShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCollisionShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCollisionWorldImporter_cpp = Module["__GLOBAL__sub_I_btCollisionWorldImporter_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCollisionWorldImporter_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCollisionWorld_cpp = Module["__GLOBAL__sub_I_btCollisionWorld_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCollisionWorld_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCompoundCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btCompoundCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCompoundCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCompoundCompoundCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btCompoundCompoundCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCompoundCompoundCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCompoundShape_cpp = Module["__GLOBAL__sub_I_btCompoundShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCompoundShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConcaveShape_cpp = Module["__GLOBAL__sub_I_btConcaveShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConcaveShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConeShape_cpp = Module["__GLOBAL__sub_I_btConeShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConeShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConeTwistConstraint_cpp = Module["__GLOBAL__sub_I_btConeTwistConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConeTwistConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btContactConstraint_cpp = Module["__GLOBAL__sub_I_btContactConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btContactConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btContactProcessing_cpp = Module["__GLOBAL__sub_I_btContactProcessing_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btContactProcessing_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btContinuousConvexCollision_cpp = Module["__GLOBAL__sub_I_btContinuousConvexCollision_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btContinuousConvexCollision_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvex2dConvex2dAlgorithm_cpp = Module["__GLOBAL__sub_I_btConvex2dConvex2dAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvex2dConvex2dAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvex2dShape_cpp = Module["__GLOBAL__sub_I_btConvex2dShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvex2dShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexCast_cpp = Module["__GLOBAL__sub_I_btConvexCast_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexCast_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexConcaveCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btConvexConcaveCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexConcaveCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexConvexAlgorithm_cpp = Module["__GLOBAL__sub_I_btConvexConvexAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexConvexAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexHullComputer_cpp = Module["__GLOBAL__sub_I_btConvexHullComputer_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexHullComputer_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexHullShape_cpp = Module["__GLOBAL__sub_I_btConvexHullShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexHullShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexHull_cpp = Module["__GLOBAL__sub_I_btConvexHull_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexHull_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexInternalShape_cpp = Module["__GLOBAL__sub_I_btConvexInternalShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexInternalShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexPlaneCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btConvexPlaneCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexPlaneCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexPointCloudShape_cpp = Module["__GLOBAL__sub_I_btConvexPointCloudShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexPointCloudShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexPolyhedron_cpp = Module["__GLOBAL__sub_I_btConvexPolyhedron_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexPolyhedron_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexShape_cpp = Module["__GLOBAL__sub_I_btConvexShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btConvexTriangleMeshShape_cpp = Module["__GLOBAL__sub_I_btConvexTriangleMeshShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btConvexTriangleMeshShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btCylinderShape_cpp = Module["__GLOBAL__sub_I_btCylinderShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btCylinderShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btDantzigLCP_cpp = Module["__GLOBAL__sub_I_btDantzigLCP_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btDantzigLCP_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btDbvtBroadphase_cpp = Module["__GLOBAL__sub_I_btDbvtBroadphase_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btDbvtBroadphase_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btDbvt_cpp = Module["__GLOBAL__sub_I_btDbvt_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btDbvt_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btDefaultCollisionConfiguration_cpp = Module["__GLOBAL__sub_I_btDefaultCollisionConfiguration_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btDefaultCollisionConfiguration_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btDiscreteDynamicsWorldMt_cpp = Module["__GLOBAL__sub_I_btDiscreteDynamicsWorldMt_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btDiscreteDynamicsWorldMt_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btDiscreteDynamicsWorld_cpp = Module["__GLOBAL__sub_I_btDiscreteDynamicsWorld_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btDiscreteDynamicsWorld_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btDispatcher_cpp = Module["__GLOBAL__sub_I_btDispatcher_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btDispatcher_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btEmptyCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btEmptyCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btEmptyCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btEmptyShape_cpp = Module["__GLOBAL__sub_I_btEmptyShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btEmptyShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btFixedConstraint_cpp = Module["__GLOBAL__sub_I_btFixedConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btFixedConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGImpactBvh_cpp = Module["__GLOBAL__sub_I_btGImpactBvh_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGImpactBvh_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGImpactCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btGImpactCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGImpactCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGImpactQuantizedBvh_cpp = Module["__GLOBAL__sub_I_btGImpactQuantizedBvh_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGImpactQuantizedBvh_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGImpactShape_cpp = Module["__GLOBAL__sub_I_btGImpactShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGImpactShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGearConstraint_cpp = Module["__GLOBAL__sub_I_btGearConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGearConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGeneric6DofConstraint_cpp = Module["__GLOBAL__sub_I_btGeneric6DofConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGeneric6DofConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGeneric6DofSpring2Constraint_cpp = Module["__GLOBAL__sub_I_btGeneric6DofSpring2Constraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGeneric6DofSpring2Constraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGeneric6DofSpringConstraint_cpp = Module["__GLOBAL__sub_I_btGeneric6DofSpringConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGeneric6DofSpringConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGenericPoolAllocator_cpp = Module["__GLOBAL__sub_I_btGenericPoolAllocator_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGenericPoolAllocator_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGeometryUtil_cpp = Module["__GLOBAL__sub_I_btGeometryUtil_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGeometryUtil_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGhostObject_cpp = Module["__GLOBAL__sub_I_btGhostObject_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGhostObject_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGjkConvexCast_cpp = Module["__GLOBAL__sub_I_btGjkConvexCast_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGjkConvexCast_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGjkEpa2_cpp = Module["__GLOBAL__sub_I_btGjkEpa2_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGjkEpa2_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGjkEpaPenetrationDepthSolver_cpp = Module["__GLOBAL__sub_I_btGjkEpaPenetrationDepthSolver_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGjkEpaPenetrationDepthSolver_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btGjkPairDetector_cpp = Module["__GLOBAL__sub_I_btGjkPairDetector_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btGjkPairDetector_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btHashedSimplePairCache_cpp = Module["__GLOBAL__sub_I_btHashedSimplePairCache_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btHashedSimplePairCache_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btHeightfieldTerrainShape_cpp = Module["__GLOBAL__sub_I_btHeightfieldTerrainShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btHeightfieldTerrainShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btHinge2Constraint_cpp = Module["__GLOBAL__sub_I_btHinge2Constraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btHinge2Constraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btHingeConstraint_cpp = Module["__GLOBAL__sub_I_btHingeConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btHingeConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btInternalEdgeUtility_cpp = Module["__GLOBAL__sub_I_btInternalEdgeUtility_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btInternalEdgeUtility_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btKinematicCharacterController_cpp = Module["__GLOBAL__sub_I_btKinematicCharacterController_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btKinematicCharacterController_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btLemkeAlgorithm_cpp = Module["__GLOBAL__sub_I_btLemkeAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btLemkeAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMLCPSolver_cpp = Module["__GLOBAL__sub_I_btMLCPSolver_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMLCPSolver_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btManifoldResult_cpp = Module["__GLOBAL__sub_I_btManifoldResult_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btManifoldResult_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMinkowskiPenetrationDepthSolver_cpp = Module["__GLOBAL__sub_I_btMinkowskiPenetrationDepthSolver_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMinkowskiPenetrationDepthSolver_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMinkowskiSumShape_cpp = Module["__GLOBAL__sub_I_btMinkowskiSumShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMinkowskiSumShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodyConstraintSolver_cpp = Module["__GLOBAL__sub_I_btMultiBodyConstraintSolver_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodyConstraintSolver_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodyConstraint_cpp = Module["__GLOBAL__sub_I_btMultiBodyConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodyConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodyDynamicsWorld_cpp = Module["__GLOBAL__sub_I_btMultiBodyDynamicsWorld_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodyDynamicsWorld_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodyFixedConstraint_cpp = Module["__GLOBAL__sub_I_btMultiBodyFixedConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodyFixedConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodyGearConstraint_cpp = Module["__GLOBAL__sub_I_btMultiBodyGearConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodyGearConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodyJointLimitConstraint_cpp = Module["__GLOBAL__sub_I_btMultiBodyJointLimitConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodyJointLimitConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodyJointMotor_cpp = Module["__GLOBAL__sub_I_btMultiBodyJointMotor_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodyJointMotor_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodyPoint2Point_cpp = Module["__GLOBAL__sub_I_btMultiBodyPoint2Point_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodyPoint2Point_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBodySliderConstraint_cpp = Module["__GLOBAL__sub_I_btMultiBodySliderConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBodySliderConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiBody_cpp = Module["__GLOBAL__sub_I_btMultiBody_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiBody_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultiSphereShape_cpp = Module["__GLOBAL__sub_I_btMultiSphereShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultiSphereShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btMultimaterialTriangleMeshShape_cpp = Module["__GLOBAL__sub_I_btMultimaterialTriangleMeshShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btMultimaterialTriangleMeshShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btNNCGConstraintSolver_cpp = Module["__GLOBAL__sub_I_btNNCGConstraintSolver_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btNNCGConstraintSolver_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btOptimizedBvh_cpp = Module["__GLOBAL__sub_I_btOptimizedBvh_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btOptimizedBvh_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btOverlappingPairCache_cpp = Module["__GLOBAL__sub_I_btOverlappingPairCache_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btOverlappingPairCache_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btPersistentManifold_cpp = Module["__GLOBAL__sub_I_btPersistentManifold_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btPersistentManifold_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btPoint2PointConstraint_cpp = Module["__GLOBAL__sub_I_btPoint2PointConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btPoint2PointConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btPolarDecomposition_cpp = Module["__GLOBAL__sub_I_btPolarDecomposition_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btPolarDecomposition_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btPolyhedralContactClipping_cpp = Module["__GLOBAL__sub_I_btPolyhedralContactClipping_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btPolyhedralContactClipping_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btPolyhedralConvexShape_cpp = Module["__GLOBAL__sub_I_btPolyhedralConvexShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btPolyhedralConvexShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btQuantizedBvh_cpp = Module["__GLOBAL__sub_I_btQuantizedBvh_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btQuantizedBvh_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btQuickprof_cpp = Module["__GLOBAL__sub_I_btQuickprof_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btQuickprof_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btRaycastCallback_cpp = Module["__GLOBAL__sub_I_btRaycastCallback_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btRaycastCallback_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btRaycastVehicle_cpp = Module["__GLOBAL__sub_I_btRaycastVehicle_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btRaycastVehicle_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btRigidBody_cpp = Module["__GLOBAL__sub_I_btRigidBody_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btRigidBody_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btScaledBvhTriangleMeshShape_cpp = Module["__GLOBAL__sub_I_btScaledBvhTriangleMeshShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btScaledBvhTriangleMeshShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSequentialImpulseConstraintSolver_cpp = Module["__GLOBAL__sub_I_btSequentialImpulseConstraintSolver_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSequentialImpulseConstraintSolver_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btShapeHull_cpp = Module["__GLOBAL__sub_I_btShapeHull_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btShapeHull_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSimpleBroadphase_cpp = Module["__GLOBAL__sub_I_btSimpleBroadphase_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSimpleBroadphase_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSimpleDynamicsWorld_cpp = Module["__GLOBAL__sub_I_btSimpleDynamicsWorld_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSimpleDynamicsWorld_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSimulationIslandManagerMt_cpp = Module["__GLOBAL__sub_I_btSimulationIslandManagerMt_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSimulationIslandManagerMt_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSimulationIslandManager_cpp = Module["__GLOBAL__sub_I_btSimulationIslandManager_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSimulationIslandManager_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSliderConstraint_cpp = Module["__GLOBAL__sub_I_btSliderConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSliderConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSolve2LinearConstraint_cpp = Module["__GLOBAL__sub_I_btSolve2LinearConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSolve2LinearConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSphereBoxCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btSphereBoxCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSphereBoxCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSphereShape_cpp = Module["__GLOBAL__sub_I_btSphereShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSphereShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSphereSphereCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btSphereSphereCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSphereSphereCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSphereTriangleCollisionAlgorithm_cpp = Module["__GLOBAL__sub_I_btSphereTriangleCollisionAlgorithm_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSphereTriangleCollisionAlgorithm_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btStaticPlaneShape_cpp = Module["__GLOBAL__sub_I_btStaticPlaneShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btStaticPlaneShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btStridingMeshInterface_cpp = Module["__GLOBAL__sub_I_btStridingMeshInterface_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btStridingMeshInterface_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btSubSimplexConvexCast_cpp = Module["__GLOBAL__sub_I_btSubSimplexConvexCast_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btSubSimplexConvexCast_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTetrahedronShape_cpp = Module["__GLOBAL__sub_I_btTetrahedronShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTetrahedronShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btThreads_cpp = Module["__GLOBAL__sub_I_btThreads_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btThreads_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTriangleBuffer_cpp = Module["__GLOBAL__sub_I_btTriangleBuffer_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTriangleBuffer_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTriangleCallback_cpp = Module["__GLOBAL__sub_I_btTriangleCallback_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTriangleCallback_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTriangleIndexVertexArray_cpp = Module["__GLOBAL__sub_I_btTriangleIndexVertexArray_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTriangleIndexVertexArray_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTriangleIndexVertexMaterialArray_cpp = Module["__GLOBAL__sub_I_btTriangleIndexVertexMaterialArray_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTriangleIndexVertexMaterialArray_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTriangleMeshShape_cpp = Module["__GLOBAL__sub_I_btTriangleMeshShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTriangleMeshShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTriangleMesh_cpp = Module["__GLOBAL__sub_I_btTriangleMesh_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTriangleMesh_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTriangleShapeEx_cpp = Module["__GLOBAL__sub_I_btTriangleShapeEx_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTriangleShapeEx_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btTypedConstraint_cpp = Module["__GLOBAL__sub_I_btTypedConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btTypedConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btUniformScalingShape_cpp = Module["__GLOBAL__sub_I_btUniformScalingShape_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btUniformScalingShape_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btUnionFind_cpp = Module["__GLOBAL__sub_I_btUnionFind_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btUnionFind_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btUniversalConstraint_cpp = Module["__GLOBAL__sub_I_btUniversalConstraint_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btUniversalConstraint_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btVector3_cpp = Module["__GLOBAL__sub_I_btVector3_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btVector3_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btVoronoiSimplexSolver_cpp = Module["__GLOBAL__sub_I_btVoronoiSimplexSolver_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btVoronoiSimplexSolver_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_btWheelInfo_cpp = Module["__GLOBAL__sub_I_btWheelInfo_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_btWheelInfo_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_builtin_functions_cpp = Module["__GLOBAL__sub_I_builtin_functions_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_builtin_functions_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_builtin_types_cpp = Module["__GLOBAL__sub_I_builtin_types_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_builtin_types_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_doc_cpp = Module["__GLOBAL__sub_I_doc_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_doc_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_gim_box_set_cpp = Module["__GLOBAL__sub_I_gim_box_set_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_gim_box_set_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_gim_contact_cpp = Module["__GLOBAL__sub_I_gim_contact_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_gim_contact_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_gim_memory_cpp = Module["__GLOBAL__sub_I_gim_memory_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_gim_memory_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_gim_tri_collision_cpp = Module["__GLOBAL__sub_I_gim_tri_collision_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_gim_tri_collision_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_iostream_cpp = Module["__GLOBAL__sub_I_iostream_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_iostream_cpp"].apply(null, arguments);
});
var __GLOBAL__sub_I_shaderc_spirv_cpp = Module["__GLOBAL__sub_I_shaderc_spirv_cpp"] = (function() {
 return Module["asm"]["__GLOBAL__sub_I_shaderc_spirv_cpp"].apply(null, arguments);
});
var ___cxx_global_var_init = Module["___cxx_global_var_init"] = (function() {
 return Module["asm"]["___cxx_global_var_init"].apply(null, arguments);
});
var ___cxx_global_var_init_2153 = Module["___cxx_global_var_init_2153"] = (function() {
 return Module["asm"]["___cxx_global_var_init_2153"].apply(null, arguments);
});
var ___cxx_global_var_init_2247 = Module["___cxx_global_var_init_2247"] = (function() {
 return Module["asm"]["___cxx_global_var_init_2247"].apply(null, arguments);
});
var ___cxx_global_var_init_3868 = Module["___cxx_global_var_init_3868"] = (function() {
 return Module["asm"]["___cxx_global_var_init_3868"].apply(null, arguments);
});
var ___cxx_global_var_init_446 = Module["___cxx_global_var_init_446"] = (function() {
 return Module["asm"]["___cxx_global_var_init_446"].apply(null, arguments);
});
var ___errno_location = Module["___errno_location"] = (function() {
 return Module["asm"]["___errno_location"].apply(null, arguments);
});
var _emscripten_GetProcAddress = Module["_emscripten_GetProcAddress"] = (function() {
 return Module["asm"]["_emscripten_GetProcAddress"].apply(null, arguments);
});
var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = (function() {
 return Module["asm"]["_emscripten_replace_memory"].apply(null, arguments);
});
var _free = Module["_free"] = (function() {
 return Module["asm"]["_free"].apply(null, arguments);
});
var _main = Module["_main"] = (function() {
 return Module["asm"]["_main"].apply(null, arguments);
});
var _malloc = Module["_malloc"] = (function() {
 return Module["asm"]["_malloc"].apply(null, arguments);
});
var setThrew = Module["setThrew"] = (function() {
 return Module["asm"]["setThrew"].apply(null, arguments);
});
var stackAlloc = Module["stackAlloc"] = (function() {
 return Module["asm"]["stackAlloc"].apply(null, arguments);
});
var dynCall_ii = Module["dynCall_ii"] = (function() {
 return Module["asm"]["dynCall_ii"].apply(null, arguments);
});
var dynCall_iii = Module["dynCall_iii"] = (function() {
 return Module["asm"]["dynCall_iii"].apply(null, arguments);
});
var dynCall_iiii = Module["dynCall_iiii"] = (function() {
 return Module["asm"]["dynCall_iiii"].apply(null, arguments);
});
var dynCall_v = Module["dynCall_v"] = (function() {
 return Module["asm"]["dynCall_v"].apply(null, arguments);
});
var dynCall_vi = Module["dynCall_vi"] = (function() {
 return Module["asm"]["dynCall_vi"].apply(null, arguments);
});
var dynCall_vii = Module["dynCall_vii"] = (function() {
 return Module["asm"]["dynCall_vii"].apply(null, arguments);
});
var dynCall_viii = Module["dynCall_viii"] = (function() {
 return Module["asm"]["dynCall_viii"].apply(null, arguments);
});
var dynCall_viiii = Module["dynCall_viiii"] = (function() {
 return Module["asm"]["dynCall_viiii"].apply(null, arguments);
});
var dynCall_viiiii = Module["dynCall_viiiii"] = (function() {
 return Module["asm"]["dynCall_viiiii"].apply(null, arguments);
});
Module["asm"] = asm;
Module["getMemory"] = getMemory;
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
function ExitStatus(status) {
 this.name = "ExitStatus";
 this.message = "Program terminated with exit(" + status + ")";
 this.status = status;
}
ExitStatus.prototype = new Error;
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
 if (!Module["calledRun"]) run();
 if (!Module["calledRun"]) dependenciesFulfilled = runCaller;
};
Module["callMain"] = function callMain(args) {
 args = args || [];
 ensureInitRuntime();
 var argc = args.length + 1;
 var argv = stackAlloc((argc + 1) * 4);
 HEAP32[argv >> 2] = allocateUTF8OnStack(Module["thisProgram"]);
 for (var i = 1; i < argc; i++) {
  HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
 }
 HEAP32[(argv >> 2) + argc] = 0;
 try {
  var ret = Module["_main"](argc, argv, 0);
  exit(ret, true);
 } catch (e) {
  if (e instanceof ExitStatus) {
   return;
  } else if (e == "SimulateInfiniteLoop") {
   Module["noExitRuntime"] = true;
   return;
  } else {
   var toLog = e;
   if (e && typeof e === "object" && e.stack) {
    toLog = [ e, e.stack ];
   }
   Module.printErr("exception thrown: " + toLog);
   Module["quit"](1, e);
  }
 } finally {
  calledMain = true;
 }
};
function run(args) {
 args = args || Module["arguments"];
 if (runDependencies > 0) {
  return;
 }
 preRun();
 if (runDependencies > 0) return;
 if (Module["calledRun"]) return;
 function doRun() {
  if (Module["calledRun"]) return;
  Module["calledRun"] = true;
  if (ABORT) return;
  ensureInitRuntime();
  preMain();
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  if (Module["_main"] && shouldRunNow) Module["callMain"](args);
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout((function() {
   setTimeout((function() {
    Module["setStatus"]("");
   }), 1);
   doRun();
  }), 1);
 } else {
  doRun();
 }
}
Module["run"] = run;
function exit(status, implicit) {
 if (implicit && Module["noExitRuntime"] && status === 0) {
  return;
 }
 if (Module["noExitRuntime"]) {} else {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  exitRuntime();
  if (Module["onExit"]) Module["onExit"](status);
 }
 if (ENVIRONMENT_IS_NODE) {
  process["exit"](status);
 }
 Module["quit"](status, new ExitStatus(status));
}
Module["exit"] = exit;
function abort(what) {
 if (Module["onAbort"]) {
  Module["onAbort"](what);
 }
 if (what !== undefined) {
  Module.print(what);
  Module.printErr(what);
  what = JSON.stringify(what);
 } else {
  what = "";
 }
 ABORT = true;
 EXITSTATUS = 1;
 throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
}
Module["abort"] = abort;
if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) {
 shouldRunNow = false;
}
Module["noExitRuntime"] = true;
run();



