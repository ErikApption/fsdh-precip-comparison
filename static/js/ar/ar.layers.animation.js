//-------------------------------------------------------------------------------------------------

ar.layers.animation = 
   {
   visible: true,
   opacity: 0.7,
   field: "ivt",
   images: [],
   imagedata: [],
   imageCount: 84,
   timestamp: "",
   imageSource: "active",

   initialize: function()
      {
         /*
      $("#vw_field_select_fieldset").find(".field_mode").on("mousedown", function(e)
         {
         ar.layers.ivt.setField($(this).prop("id").substr(13), false);
         }); */

      this.control = ar.layercontrol.create(this, "animation");
      //this.layer = L.canvasOverlay("", [[27.5, -170.0], [71.0, -40.5]], {opacity: 1, image_smoothing: false}); // original
      this.layer = L.canvasOverlay("", [[33.3, -171.5], [87.0, -38.5]], {opacity: 1, image_smoothing: false}); // Anthony
    
      ar.map.addLayer(this.layer);

      this.addMapButtons();
      },

   getOpacity: function()
      {
      return this.opacity;
      },

   setOpacity: function(value)
      {
      if(this.opacity !== value)
         {
         this.opacity = value;

         if(this.layer)
            this.layer.setStyle({ opacity: this.opacity, fillOpacity: this.opacity });
         }
      },

   toggle: function()
      {
      this.visible = !this.visible;

      if(this.visible === true)
         {
         //$("#ar_ivt_legend").show();
         $("#vw_animation_fieldset").show();
         }
      else
         {
        // $("#ar_ivt_legend").hide();
         $("#vw_animation_fieldset").hide();
         vw.time_controls.pause();
         }

      if(this.layer)
         {
         if(this.visible === false)
            ar.map.removeLayer(this.layer);
         else
            ar.map.addLayer(this.layer);
         }
      },

   save: function()
      {
      window.localStorage.setItem("ar_anim_visible", this.visible);
      window.localStorage.setItem("ar_anim_opacity", this.opacity);
     // window.localStorage.setItem("ar_ivt_field_mode", this.field);
    //  window.localStorage.setItem("ar_ivt_image_source_mode", this.imageSource);
      },

   load: function()
      {
      if(ar.map.ready() && (window.localStorage.getItem("ar_anim_visible") === "false"))
         this.control.trigger("top_click");

      if(window.localStorage.getItem("ar_anim_visible"))
         {
         var value = parseFloat(window.localStorage.getItem("ar_anim_visible"));
         this.setOpacity(value);
         }

     /* var sourceMode = localStorage.getItem("ar_ivt_image_source_mode");

      if(sourceMode)
         {
         this.setImageSource(sourceMode);
         }

      if(localStorage.getItem("ar_ivt_field_mode"))
         $("#ar_set_field_" + localStorage.getItem("ar_ivt_field_mode")).trigger("mousedown");
         */
      },

   overlayChange: function()
      {
      if(ar.map.hasLayer(this.layer))
         {
         $("#map_legend").show();
         //$("#ivt_cb").show();
         }
      else
         {
         $("#map_legend").hide();
         //$("#ivt_cb").hide();
         }
      },

   animationModeChanged: function(mode)
      {
      this.timestamp = ar.time.getFileTimestamp();
      
      if(mode === "pr_ai_approach")
         {
         this.imageCount = 84;
         this.layer = L.canvasOverlay("", [[33.3, -171.5], [87.0, -38.5]], {opacity: 1, image_smoothing: false});          
         }
      else if(mode === "pr_weong")
         {
            this.imageCount = 48;
            this.layer = L.canvasOverlay("", [[33.2, -173.5], [86.9, -36.5]], {opacity: 1, image_smoothing: false}); // good            
         }
      else if(mode === "hrdps_ai")
         {
            this.imageCount = 84;
         this.layer = L.canvasOverlay("", [[33.3, -171.5], [87.0, -38.5]], {opacity: 1, image_smoothing: false});                    
         }
      else // pr_burrows
         {
         this.imageCount = 84;
         this.layer = L.canvasOverlay("", [[33.2, -174.0], [86.9, -36.0]], {opacity: 1, image_smoothing: false});         
         }

      ar.map.addLayer(this.layer);
      vw.time_controls.setMaxValue(this.imageCount - 1); // setMaxValue(Math.max(48, 6 * (this.imageCount - 1)));
      this.loadImages();
      ar.time.triggerChange();
      this.updateLabels();
      ar.legend.updateModelLegend(this.timestamp, ar.time.getFileHour());    
      },

   dateChanged: function(data)
      {
      // delaying 1 second gives time for plot data to load first

      if(this.timestamp !== data.timestamp)
         {
         this.timestamp = data.timestamp;
         window.setTimeout(function() { this.loadImages(); }.bind(this), 2000);
         this.updateLabels();
         }
      },

   timeChanged: function(data)
      {
      this.current_url = this.getImageURL(data.hour, data.timestamp);

      if(this.layer)
         this.layer.setUrl(this.current_url);

      return this;
      },

   loadImages: function()
      {
      for(var i = 0; i < this.imagedata.length; i++)
         this.imagedata[i].remove();

      this.imagedata.length = 0;
      this.imagedata = [];

      for(var i = 0; i < this.imageCount; i++)
        this.imagedata.push(ar.imagedata.create(this.getImageURL(i), i));

      return this;
      },

   imageLoaded: function(imagedata)
      {
      if(imagedata.image && (imagedata.index === ar.time.getIndex()))
         this.timeChanged(imagedata);
      },

   getImageURL: function(hour, timestamp)
      {
      var ts = timestamp || ar.time.getFileTimestamp();

      if(ts)
         {
         hour = parseInt(hour) + 1;

         return ar.config.getImageURL(hour, timestamp, 0, ar.projects.animationMode);
         }
      else
         return "";
      },

   timeChanged: function(data)
      {
      if(this.layer && (this.imagedata.length > data.index))
         this.layer.setImageData(this.imagedata[data.index]);
      },

   mouseover: function(e)
      {
      var target = e.target;
      var properties = target.feature.properties;
      var pixel = ar.map.latLngToContainerPoint(target.getLatLng());
      pixel.x += $("#vw_map_div").offset().left;
      pixel.y += $("#vw_map_div").offset().top;

      this.updateStationAppearance(target, "over");

      if(properties.id)
         $("#vw_map_info").html("<b>" + properties.area + ":</b> " + properties.id + " (" + properties.name + ")");
      else
         $("#vw_map_info").html(properties.name);

      ar.popup.showStation(properties, pixel);
      },

   mousedown: function(e)
      {
      var target = e.target;
      var properties = target.feature.properties;
      var pixel = ar.map.latLngToContainerPoint(target.getLatLng());
      pixel.x += $("#vw_map_div").offset().left;
     // ar.chart.request(properties);
      },

   mouseout: function(e)
      {
      this.updateStationAppearance(e.target, "out")

      $("#vw_map_info").text("");
      ar.popup.hide();
      },

   updateStationAppearance: function(target, mode)
      {
      if(this.displayMode === "circle")
         target.setStyle({radius: (mode === "over") ? 9 : 7});
      },
/*
   setField: function(field, override) 
      {
      if((this.field !== field) || (override === true))
         {
         this.field = field;
         this.loadImages();
         ar.time.triggerChange();
         this.updateLabels();
         }
      },

   setDisplayMode: function(mode) 
      {
      if(this.displayMode !== mode)
         {
         this.displayMode = mode;
         this.updateLegend().refresh();
         }
      },
*/
   updateLegend: function()
      {
      return this;
      },

   show: function()
      {
      this.control.show();
      vw.time_controls.show();

      if(this.layer && (this.visible === true))
         ar.map.addLayer(this.layer);
      },

   hide: function()
      {
      this.control.hide();
      vw.time_controls.hide();

      if(this.layer)
         ar.map.removeLayer(this.layer);
      },

   addMapButtons: function()
      {
      ["TBD7", "TBD8", "TBD9"].forEach(function(buttonText)
         {
         var $div = $("<div></div>").text(buttonText).addClass("button radio image_source_mode").prop({id: "ar_image_source_mode_" + buttonText.toLowerCase(), title: "Show images from " + ((buttonText === "TBD9") ? "TBD9" : buttonText.toUpperCase())}).data("mode", buttonText.toLowerCase()).appendTo("#vw_animation_fieldset");
         $div.on("mousedown", function() { ar.layers.animation.setImageSource($(this).data("mode")); });
         $("#ar_image_source_mode_tbd9").addClass("down"); 
         });
      },

   setImageSource: function(mode)
      {
      if(this.imageSource !== mode)
         {
         this.imageSource = mode;

         if(this.imageSource === "hrdps")
            {
            this.layer.setBounds([[27.284584045, -152.730636597], [70.611503601, -40.708557129]]);
            this.imageCount = 9;
            }
         else
            {
            this.layer.setBounds([[27.5, -170.0], [71.0, -40.5]]);
            this.imageCount = 41;
            }

         $("#ar_image_source_mode_" + mode).addClass("down").siblings().removeClass("down");

         this.setField(this.field, true);
         }

      this.updateLabels();
      },

   updateLabels: function()
      {
      $("#time_label_container").prop("title", "(TBD10)Timestamp of displayed precipitation forecast");
      if(ar.projects.animationMode === "ai_approach")
         $("#time_label_container").find("legend").text("Precipitation animation");
      else if(ar.projects.animationMode === "weong")
         $("#time_label_container").find("legend").text("Precipitation Type Fcst");
      else if(ar.projects.animationMode === "hrdps_ai")
         $("#time_label_container").find("legend").text("Precipitation Type Fcst HRDPS");
      else
         $("#time_label_container").find("legend").text("Precipitation Type Burrows");
      }
   }

//-------------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------------

ar.imagedata = function(url, index)
   {
   this.url = url;
   this.index = index;
   this.image = new Image();
   this.image.onload = function() { this.imageLoaded(); }.bind(this);
   this.image.src = url;
   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.imagedata.create = function(url, index)
   {
   return this.call(Object.create(this.prototype), url, index);
   }

//-------------------------------------------------------------------------------------------------

ar.imagedata.prototype.imageLoaded = function()
   {
   ar.layers.animation.imageLoaded(this);
   }

//-------------------------------------------------------------------------------------------------

ar.imagedata.prototype.remove = function()
   {
   this.image.onload = null;
   this.image.src = "";
   this.url = "";
   this.image = null;
   }

//-------------------------------------------------------------------------------------------------
