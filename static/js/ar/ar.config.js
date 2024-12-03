//-------------------------------------------------------------------------------------------------

// This object contains functions which depend on site-specific output directory setup

ar.config =
   {
   getImageURL:  function(hour, timestamp, zoom, animMode) //function(product, hour, timestamp, zoom, modelID)
      {
      // There are no RDPS images, so use the GDPS instead

     // if(modelID == "rdps")
      //   modelID = "gdps";

      var ts = timestamp || ar.time.getFileTimestamp();
      var filePrefix = "preciptype_MLfcst_grid_";
      // preciptype_MLfcst_grid_2023052412_001.png, preciptype_MLfcst_grid_weongrid2023052412_001.png, preciptype_MLfcst_grid_burrows2023060512_001.png

/*
      if((ts.substr(8,2) === "18") || (ts.substr(8,2) === "06"))
         {
         ts = ts.substr(0, 8) + ar.zeropad(parseInt(ts.substr(8,2)) - 6, 2);
         hour = parseInt(hour) + 6;
         }
*/
      hour = parseInt(hour);
      
      var year = ts.substr(0, 4);
      var month = ts.substr(4, 2);
      var day = ts.substr(6, 2);
      var directory = "data/" + animMode + "/" + year + month + day + "/";// "data/gridPTYPfcst/" +  year + month + day + "/";

      if(zoom > 0)
         directory += zoom + "/";

      var filename = filePrefix + year + month + day + "12_" + ar.zeropad(hour, 3) + ".png"; // ex: preciptype_MLfcst_grid_2023052212_001.png
      if(animMode === "weong")
         filename = filePrefix + "weongrid" + year + month + day + "12_" + ar.zeropad(hour, 3) + ".png"; // ex: preciptype_MLfcst_grid_weongrid2023052412_001.png
      else if (animMode === "burrows")
         filename = filePrefix + animMode + year + month + day + "12_" + ar.zeropad(hour, 3) + ".png"; // ex: preciptype_MLfcst_grid_burrows2023060512_001.png
      else  (animMode === "hrdps_ai")
         filename = filePrefix + "HRDPS_" + year + month + day + "12_" + ar.zeropad(hour, 3) + ".png"; // ex: preciptype_MLfcst_grid_hrdps2023060512_001.png

      return directory + filename;
      },
/*
   getStationGeoJSONURL: function(timestamp, version, modelID, product)
      {
      if(timestamp)
         {
         var run_timestamp = timestamp.substr(0, 8) + "_" + timestamp.substr(8,2) + "Z";
         return "data/" + modelID + "/" + timestamp + "/geojson/stations/" + product + "/" + run_timestamp + ".geojson";
         }
      else
         return "";
      },
*/
   constants:
      {
      weighting: { ivt: 1, dur: 2,  ant: 3, ret: 6, tot: 2, mpr: 4 }
      }
   }

//-------------------------------------------------------------------------------------------------
