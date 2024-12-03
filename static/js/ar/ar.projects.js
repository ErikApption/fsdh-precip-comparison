//-------------------------------------------------------------------------------------------------

ar.projects = 
   {
   active: null,
   selectedDate: "", // to be changed
   selectedTime: "001",
   maxAvailableDate: "",
   showNoPrecipitationStations: true,
   animationMode: "ai_approach",

   initialize: function()
      {
      $("#pr_date_select").on("change", function() { if(ar.projects.selectedDate != $(this).val()) {ar.projects.selectedDate = $(this).val(); vw.time_controls.setTimestamp($(this).val() );}
         //ar.projects.selectedDate = $(this).val(); 
         //vw.time_controls.setTimestamp($(this).val() + ar.projects.selectedTime.substr(1,2));
        // vw.time_controls.setTimestamp($(this).val() );
      });
      $("#pr_time_select").on("change", function() {ar.projects.selectedTime = $(this).val(); });
      $("#pr_show_no_precip").on("mousedown", function() {ar.projects.showNoPrecipitationStations = true;
                                                          if( $("#pr_hide_no_precip").hasClass("down") )
                                                             {
                                                               $("#pr_hide_no_precip").removeClass("down");
                                                               $("#pr_show_no_precip").addClass("down"); 
                                                             }                                              
                                                          ar.layers.precip.refresh();
                                                         });

      $("#pr_hide_no_precip").on("mousedown", function() {ar.projects.showNoPrecipitationStations = false;
                                                         if($("#pr_show_no_precip").hasClass("down"))
                                                            {
                                                            $("#pr_show_no_precip").removeClass("down"); 
                                                            $("#pr_hide_no_precip").addClass("down");   
                                                            }
                                                         ar.layers.precip.refresh();
                                                      });                                               

      $("#pr_show_plot").on("mousedown", function() {ar.layers.precip.refresh(); ar.legend.updateModelLegend(ar.projects.selectedDate, ar.projects.selectedTime);
                                                     $("#pr_show_plot").removeClass("down"); ar.projects.resetShowHideNoRecipBtns();}) ;
      
      //$("#ar_run_select").on("change", function() { ar.popup.hide(); vw.time_controls.setTimestamp($(this).val()); });
   
      $("#pr_compare_mode_fieldset").find(".anim_mode").on("mousedown", function() { var id = $(this).prop("id"); ar.projects.updateAnimationMode(id);                                                                                  
                                                                                   ar.layers.animation.animationModeChanged(id);
                                                                                   ar.mail.update(); });
    
      this.precip.initialize();  //this.alex.initialize(); 
      // The following line is for the top button in the layer control pannel
      //$("#ar_station_filter_select").on("change", function() {ar.layers.precip.setFilterIndex($(this).val()); });

      return this;
      },

   save: function()
      {
      window.localStorage.setItem("ar_project_active", "precip");
      },

   resetShowHideNoRecipBtns: function()
   {
      if( this.showNoPrecipitationStations) 
      {
         if($("#pr_hide_no_precip").hasClass("down"))
            $("#pr_hide_no_precip").removeClass("down");
         
         if(!$("#pr_show_no_precip").hasClass("down"))
            $("#pr_show_no_precip").addClass("down");                  
      }
      else
      {
         if($("#pr_show_no_precip").hasClass("down"))
            $("#pr_show_no_precip").removeClass("down");

         if(!$("#pr_hide_no_precip").hasClass("down"))
            $("#pr_hide_no_precip").addClass("down");
      }
   },

   innitializeSelectedDateValue: function()
      {
      const todayDate = new Date();
      console.log("todayDate = " + todayDate.toString()); // Nhi
      //var utcHr = parseInt(todayDate.getUTCHours());
      todayDate.setDate(todayDate.getDate() - 2); // yesterday's *.geojson may not be available yet
      console.log(todayDate.toString()); // Nhi
      YYYY = todayDate.getUTCFullYear();
      MM = todayDate.getUTCMonth() + 1;
      DD = todayDate.getUTCDate();

      timestamp = YYYY + ar.zeropad(MM) + ar.zeropad(DD);
      console.log("innitializeSelectedDateValue - timestamp = " + timestamp); // Nhi

      this.selectedDate = timestamp;
      if(vw.time_controls.timestamp === "")
         vw.time_controls.setTimestamp(this.selectedDate);
      },

   buildDateSelection: function()
   {
      $("#pr_date_select").empty();

      var basedir = "geojson/stations";

      $.ajax(
         {
         type: "GET",
         dataType: "text",
         async: true,
         context: this,
         url: basedir,
         success: function(message, text, response)
            {
            var stamps = $($.parseHTML(message)).find("a").toArray().filter(function(a) {
               return (a.innerHTML.trim().indexOf("2") === 0) && (a.innerHTML.trim().indexOf("/") > -1); }).map(function(a) { var x = a.innerHTML.trim(); 
                  return x.substr(0, x.indexOf("/")); });
      
            if(stamps.length > 0)
               { console.log("stamps[0] = " + stamps[0]); // Nhi
               stamps.sort().reverse().forEach(function(ts) { $("#pr_date_select").append($("<option></option>").text(ts).val(ts)); });
               defautSelectedDate = stamps[0];
               defaultSelectedIndex = Math.max(0, $("#pr_date_select").map(function(i,e) { return $(e).val(); }).toArray().indexOf(defautSelectedDate));
               console.log("defaultSelectedIndex = " + defaultSelectedIndex);
               $("#pr_date_select").prop("selectedIndex", defaultSelectedIndex).trigger("change");
               this.selectedDate = defautSelectedDate; console.log("loadDateSelection selectedDate = " + this.selectedDate);
               this.maxAvailableDate = defautSelectedDate;
               // $("#pr_date_select").prop("selectedIndex", this.getRunIndex()).trigger("change");
               }
            else
               alert("No date found; nothing to display");
            }, // success
         error: function(obj, text)
            {
            alert("error " + text);
            }
      }); // ajax
   },

   updateAnimationMode: function(id)
      {
      if(id === "pr_ai_approach")
         ar.projects.animationMode = "ai_approach";
      else if (id === "pr_weong")
         ar.projects.animationMode = "weong";
      else if (id === "pr_hrdps_ai")
         ar.projects.animationMode = "hrdps_ai";
      else
         ar.projects.animationMode = "burrows";
      },

   load: function()
      {
      this.buildDateSelection();

      // Build Time Selection values
      $("#pr_time_select").empty();

      for(let i = 0; i< 10 ; ++i)
         {
         txt = "00" + i.toString(); 
         $("#pr_time_select").append($("<option></option>").val(txt).text(txt));      
         }

      for(let i = 10; i< 24 ; ++i)
         {
         txt = "0" + i.toString();
         $("#pr_time_select").append($("<option></option>").val(txt).text(txt));
         }

      $("#pr_time_select").prop("selectedIndex", 0).trigger("change");

      var projectID = "precip" ;//window.localStorage.getItem("ar_project_active");
      this.activate(projectID, true);

      if(this.active !== null)
         {
         console.log("project is active");
         }

      },

   activate: function(projectID, update)
      {
      // this.values.forEach(function(p) { this[p.id].deactivate(); }, this);
      this.active = this[projectID];
      this.active.activate(update);

      
     
   

   //   if(this.activeModelID === "")
     //    this.activeModelID = this.active.getModelID();
/*
      var scale = this.getActiveScale();

      if((scale === "A") || ((scale === "E") && (this.getActiveSubscale() === "W")))
         {
         $("#ar_ivt_mode_fieldset").show();

         if(this.getActiveProductValue() === "ECAR_W")
            $("#ar_weighting_fieldset").show();
         else
            $("#ar_weighting_fieldset").hide();
         }
      else
         $("#ar_weighting_fieldset,#ar_ivt_mode_fieldset").hide();

      if(scale === "A")
         $("#ar_missing_mode_fieldset").hide();
      else
         $("#ar_missing_mode_fieldset").show();
         */
      },
/*
   setModelValue: function(modelID, update)
      {
      this.activeModelID = modelID;
      this.active.setModelValue(modelID, true);
      },

   getActiveModelID: function()
      {
      return "TBD6"; //this.activeModelID;
      },

   getActiveUsesIVTThreshold: function()
      {
      return this.active.getUsesIVTThreshold();
      },

   getActiveProject: function()
      {
      return this.active;
      },

   getModels: function()
      {
      return this.values;
      },

   getActiveProduct: function() //del
      {
      return this.active.getProduct();
      },

   getActiveModel: function() //del
      {
      return this.active.getModel();
      },
*/
   getActiveCategories: function()
      {
      return this.active.getCategories();
      },

   getActiveCategory: function(colour)
      {
      return this.active.getCategory(colour);
      },

   getActiveColour: function(category)
      {
      return this.active.getColour(category);
      },

   getActiveColourFromIndex: function(index)
      {
      return this.active.getColourFromIndex(index);
      },

   getActiveShortCategory: function(colour)
      {
      return this.active.getShortCategory(colour);
      },

   getActiveImageURL: function(filename)
      {
      return this.active.getImageURL(filename);
      },

   getActiveGeoJSONURL: function()
      {
       
      if(this.selectedDate == "")
         {
         this.innitializeSelectedDateValue();
         }
         console.log("selectedDate = " + this.selectedDate); // Nhi
         console.log("ActiveGeoJSONURL = " + "geojson/stations/" + this.selectedDate + "/prcp_type_obs_" + this.selectedDate + "_" + this.selectedTime + ".geojson");

      return ("geojson/stations/" + this.selectedDate + "/prcp_type_obs_" + this.selectedDate + "_" + this.selectedTime + ".geojson"); // ex: prcp_type_obs_20230401_001.geojson); 
      },

   getActiveJSONURL: function(stationID)
      {
      return this.active.getJSONURL(stationID);
      },
/*
   getActiveStationGeoJSONURL: function()
      {    
      return this.active.getStationGeoJSONURL();
      },
*/
   getActiveColourIndex: function(colour)
      {
      return this.active.getColourIndex(colour);
      },

   getActiveImageFilename: function(prefix)
      {
      var result = (prefix ? prefix.replace(/ |\./g, "_") + "_" : "") + $("#ar_project_select option:selected").text().replace(/ |\./g, "_");

      if(this.active.id !== "alex")
         {
         result += "_" + $("#ar_model_select option:selected").text().replace(/ |\./g, "_");
        // result += "_" + $("#ar_run_select option:selected").text().replace(/ |\./g, "_");

         var text = $("#ar_product_select option:selected").text().replace(/ |\./g, "_");
         result += "_" + text.substr(0, text.indexOf("(") - 1).trim();
         }

     // if(this.IVT_threshold < 249)
        // result += "_thrshld_IVT_100";

      return result + ".png";
      },
/*
   getActiveModelDuration: function()
      {
      return this.active.getModelDuration();
      },

   getActiveTitle: function()
      {
      return this.active.getTitle();
      },

   updateWeighting: function()
      {
      if(this.active.updateWeighting)
         this.active.updateWeighting();
      },

   getActiveProductValue: function() 
      {
      return this.active.getProductValue();
      },

   getActiveScale: function() 
      {
      return this.active ? this.active.getScale() : "E";
      },

   getActiveSubscale: function()
      {
      return this.active.getSubscale();
      },

   getActiveSubtitle: function()
      {
      return this.active.getSubtitle();
      },

   setIVTThreshold: function(value)
      {
      if(this.IVT_threshold !== value)
         {
         this.IVT_threshold = value;
         ar.layers.stations.resetGeoJSON();
         }
      },

   getIVTThreshold: function()
      {
      return this.IVT_threshold;
      },

   setMissingValueMode: function(value)
      {
      var mode = (value.indexOf("mode_a") < 0) ? "v" : "a";

      if(this.missingValueMode !== mode)
         {
         this.missingValueMode = mode;
         ar.layers.stations.resetGeoJSON();
         }
      },

   getMissingValueMode: function()
      {
      return this.missingValueMode;
      },

   getScaleText: function(scale, subscale)
      {
      if(scale === "E")
         return "ECAR " + ((subscale === "W") ? ((this.getActiveProductValue() === "ECAR_W") ? "Weighted" : "Max Weighted") : ((subscale === "S") ? "Storm Total" : "Return Period")) + ":";
      else if(scale === "A")
         return "AR scale:";
      else
         return "";
      }
      */
   }

//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------

   ar.projects.precip =
   {
   id: "precip",
   label: "Precipitation type comparison TBD5",
   title: "Precipitation",
   

   colormap_categories:
      {
      "#FE0000": {l: "FZRA", s: "0", i: 0, ar_class: "fzra"},
      "#FA8072": {l: "PL", s: "1", i: 1, ar_class: "pl"},
      "#FEA500": {l: "FZDZ", s: "2" , i: 2, ar_class: "fzdz"},
      "#00BFFF": {l: "SG", s: "3", i: 3, ar_class: "sg"},
      "#0000FF": {l: "SN", s: "4", i: 4, ar_class: "sn"},
      "#008B8B": {l: "RASN", s: "5", i: 5, ar_class: "rasn"}, 
      "#00FF00": {l: "RA", s: "6", i: 6, ar_class: "ra"},
      "#FFFF00": {l: "DZ", s: "7", i: 7, ar_class: "dz"},
      "#FFFFFF": {l: "No precipitation", s: "NA", i: 8, ar_class: "No precipitation"}
      },

   legend:
      {
      title: "Precipitation observation",
      width: "200px",
      height: "300px",
      lis:
         [
         {ar_class: "fzra", label: "FZRA", title: "FZRA"},
         {ar_class: "pl", label: "PL", title: "PL"},
         {ar_class: "fzdz", label: "FZDZ", title: "FZDZ"},
         {ar_class: "sg", label: "SG", title: "SG"},
         {ar_class: "sn", label: "SN", title: "SN"},
         {ar_class: "rasn", label: "RASN", title: "RASN"},
         {ar_class: "ra", label: "RA", title: "RA"},
         {ar_class: "dz", label: "DZ", title: "DZ"},
         {ar_class: "no_data", label: "No precipitation", title: "No precipitation"},            
         ]
      },

   initialize: function()
      {
            //ar.projects.values.push({id: this.id});
      //$("#ar_project_select").append($("<option></option>").val(this.id).text(this.label));
      $("#ar_document_tab_li").hide();
      this.colormap = ar.colormap.create(this.colormap_categories);
      delete this.colormap_categories;            
      },

   activate: function(update)
      {
      this.active = true;
     // $("#ar_title_container").html(this.title + ((ar.layers.alex.mode === "obs") ? " (JRA 1980-2020)" : " (CanRCM4)"));
      $("#ar_title_container").html("Precipitation type comparison TBD2");
      $(".ar_guide_content").hide();
      $("#ar_guide_" + this.id).show();
     // $("#ar_mrp_fieldset,#ar_stations_mode").hide();
      $("#ar_plot_tab_li").hide();
      $("#ar_document_tab_li").show();
     // $("#ar_alex_mode_container").show();
      //$("#ar_weighting_fieldset,#ar_ivt_mode_fieldset").hide();
    // $("#ar_ivt_mode_fieldset").show();
      //ar.layers.stations.hide();
      ar.layers.animation.show();//ar.layers.ivt.hide();
      ar.layers.precip.show(); // ar.layers.alex.show();
      $("#ar_product_title_text").html("<span style=\"color: red; font-size: 18px;\"> Experimental </span>");
      $("#ar_product_subtitle_text").html("<span style=\"color: red; font-size: 16px;\">Precipitation type observation</span>");
      ar.legend.show().update(this.legend);
      ar.legend.updateModelLegend(ar.projects.selectedDate, ar.projects.selectedTime);
      
      // The following line is for the first  button in the layer control pannel
      ar.layers.precip.initializeFilterSelect();

      return this;
      },

   deactivate: function()
      {
      this.active = false;
    //  $("#ar_mrp_fieldset,#ar_stations_mode").show();
      $("#ar_plot_tab_li").show();
      $("#ar_document_tab_li").hide();
    //  $("#ar_alex_mode_container").hide();
    //  ar.layers.stations.show();
      ar.layers.ivt.show();
    //  ar.layers.alex.hide(); // ar.layers.alex.hide();
      ar.legend.show();
      return this;
      },

   setModelID: function() // del
      {
      return this;
      },
/*
   setModelValue: function()
      {
      return this;
      },

   getModelID: function() // del
      {
      return "";
      },

   setProductValue: function() // del
      {
      return this;
      },

   getProduct: function()// del
      {
      return "";
      },
*/
   getCategories: function()
   {
      return this.colormap.getCategories();
   },

   getShortCategory: function()
      {
      return "";
      },
/*
   getScale: function() 
      {
      return this.id;
      },

   getSubscale: function()
      {
      return "";
      },

   getUsesIVTThreshold: function()
      {
      return false;
      }
*/
   }

//-------------------------------------------------------------------------------------------------

