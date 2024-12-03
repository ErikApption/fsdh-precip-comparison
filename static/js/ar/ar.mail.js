// Brian Crenna Brian.Crenna@canada.ca / greendog.pizza@gmail.com / brian@thunderbeachscientific.com
// latest update 2022 11 15 Tu

//-------------------------------------------------------------------------------------------------

ar.mail =
   {
   baseURL: "mailto:CERA-ECAR@ec.gc.ca?subject=Feedback%20on%20Precipitation Forecast%20website&body=",

   update: function()
      {
      //var scale = $("#ar_project_select option:selected").text()
      var displayedStations = ar.projects.showNoPrecipitationStations ? "Stations with no precipitation are included." : "Stations with no precipitation are not included.";
      var precipType = "";
      if(ar.projects.animationMode === "ai_approach")
         precipType = "AI approach";
      else if(ar.projects.animationMode === "weong")
         precipType = "WEonG";
      else
         precipType = "Burrows";
      
      var body = "---------------------------------------------------------%0D%0AMeta-data:%0D%0A      Displayed stations: " + displayedStations + "%0D%0A";
      body += "      Active date/time: " + vw.time_controls.timestamp + "_" + vw.time_controls.hour + "%0D%0A";
      body += "      Precipitation type: " + precipType + "%0D%0A";


/*
      body += "      Active model: " + $("#ar_model_select option:selected").text() + "%0D%0A";
      body += "      Active run: " + $("#ar_run_select option:selected").text() + "%0D%0A";
      body += "      Active product: " + $("#ar_product_select option:selected").text() + "%0D%0A";

      if((scale.indexOf("AR scale") > -1) || (scale.indexOf("weighted") > -1))
         body += "      IVT threshold: " + ar.projects.getIVTThreshold() + "%0D%0A";

      if(ar.projects.getActiveScale() !== "A")
         body += "      Missing data display: " + ((ar.projects.getMissingValueMode() === "a") ? "show as missing" : "show highest available")+ "%0D%0A";

      if($("#ar_product_select option:selected").text() === "ECAR_W")
         {
         body += "      Weightings: ";
         ["ivt", "dur", "ant", "ret", "tot", "mpr"].forEach(function(id) { body += id.toUpperCase() + ": " + $("#ar_" + id + "_weight").text() + ((id !== "mpr") ? ", " : ""); });
         body += "%0D%0A";
         }

      var properties = ar.layers.stations.getSelectTargetProperties();

      if(properties !== null)
         body += "      Selected station: ClimateID: " + properties.id + "; Name: " + properties.name + "%0D%0A";
      else
         {
         properties = ar.layers.stations.getPreviousSelectTargetProperties();

         if(properties !== null)
            body += "   Most recently selected station: ClimateID: " + properties.id + "; Name: " + properties.name + "%0D%0A";
         }
*/
      body += "---------------------------------------------------------%0D%0A%0D%0AMessage: %0D%0A%0D%0A";

      $("#ar_feedback").prop("href", this.baseURL + body);
      }
   }

//-------------------------------------------------------------------------------------------------
