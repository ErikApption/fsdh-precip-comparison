//-------------------------------------------------------------------------------------------------

ar.layers.pr = 
   {
   visible: true,
   opacity: 0.7,
   field: "pr",
//    imagedata: [],
   images: [],
   imageCount: 246,
   timestamp: "",

   initialize: function()
      {
      $("#ar_map_controls").find(".field_mode").on("mousedown", function(e)
         {
         $("#ar_map_controls").find(".field_mode").removeClass("down");
         $(this).addClass("down");
         ar.layers.stations.setField($(this).prop("id").substr(10));
         });

      this.control = ar.layercontrol.create(this, "pr");
//       this.layer = L.canvasOverlay("", [[-84.89209, -360], [84.89209, 0]], {opacity: 1, image_smoothing: false});
      this.layer = L.imageOverlay("", [[-84.89209, -360], [84.89209, 0]], {opacity: 1, image_smoothing: false});
      ar.map.addLayer(this.layer);
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
         $("#ar_pr_legend").show();
         $("#vw_animation_fieldset").show();
         }
      else
         {
         $("#ar_pr_legend").hide();
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
      window.localStorage.setItem("ar_pr_visible", this.visible);
      window.localStorage.setItem("ar_pr_opacity", this.opacity);
      window.localStorage.setItem("ar_pr_field_mode", this.field);
      },

   load: function()
      {
      if(ar.map.ready() && (window.localStorage.getItem("ar_pr_visible") === "false"))
         this.control.trigger("top_click");

      if(window.localStorage.getItem("ar_pr_opacity"))
         {
         var value = parseFloat(window.localStorage.getItem("ar_pr_opacity"));
         this.setOpacity(value);
         }

      if(localStorage.getItem("ar_pr_field_mode"))
         $("#ar_field_" + localStorage.getItem("ar_pr_field_mode")).trigger("mousedown");
      },

   overlayChange: function()
      {
      if(ar.map.hasLayer(this.layer))
         {
         $("#map_legend").show();
         $("#pr_cb").show();
         }
      else
         {
         $("#map_legend").hide();
         $("#pr_cb").hide();
         }
      },

   modelChanged: function(model)
      {
      if(model.id === "hrdps")
         {
         this.layer.setBounds([[27.284584045, -152.730636597], [70.611503601, -40.708557129]]);
         this.imageCount = 9;
         }
      else
         {
         this.layer.setBounds([[-84.89209, -360], [84.89209, 0]]);
         this.imageCount = 246;
         }

      window.setTimeout(function() { this.loadImages(); }.bind(this), ar.layers.stations.plotIsVisible() ? 2000 : 1);
      },

   dateChanged: function(data)
      {
      // reload IVT images only if the timestamp has changed; not if model or product changes
      // delaying 1 second gives time for plot data to load first, if one is visible when the time control is changed

      if(this.timestamp !== data.timestamp)
         {
         this.timestamp = data.timestamp;
         window.setTimeout(function() { this.loadImages(data.hour, data.timestamp); }.bind(this), ar.layers.stations.plotIsVisible() ? 2000 : 1);
         }
      },

   timeChanged: function(data)
      {
      this.current_url = this.getImageURL(data.hour, data.timestamp);

      if(this.layer)
         this.layer.setUrl(this.current_url);
      },

   loadImages: function(data)
      {
      // set overlay bounds to match current model

      this.images.length = 0;
      this.images = [];

      for(var h = 0; h < this.imageCount; h+= 6)
         {
         this.images.push(new Image());
         this.images[this.images.length - 1].src = this.getImageURL(h);
         }

      return this;
      },

   getImageURL: function(hour, timestamp)
      {
      // AR images are available only for the 0Z and 12Z runs, but the RDPS and HRDPS runs are available at 6Z and 18Z too
      // so we need to adjust the run and hour to modify the images used for these runs

      var ts = timestamp || ar.time.getFileTimestamp();

      if(ts)
         {

         if((ts.substr(8,2) === "18") || (ts.substr(8,2) === "06"))
            {
            ts = ts.substr(0, 8) + ar.zeropad(parseInt(ts.substr(8,2)) - 6, 2);
            hour = parseInt(hour) + 6;
            }

         return ar.config.getImageURL("field/pr_6h", hour, timestamp, 0);
         }
      else
         return "";
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

//    timeChanged: function(data)
//       {
//       if(this.layer && (this.imagedata.length > data.index))
//          this.layer.setImageData(this.imagedata[data.index]);
//       },
// 
//    loadImages: function(data)
//       {
//       for(var i = 0; i < this.imagedata.length; i++)
//          this.imagedata[i].remove();
// 
//       this.imagedata.length = 0;
//       this.imagedata = [];
// 
//       for(var i = 0; i < 41; i++)
//          this.imagedata.push(ar.imagedata.create(ar.config.getIVTImageURL(6 * i), i));
// 
//       return this;
//       },
// 
//    imageLoaded: function(imagedata)
//       {
//       if(imagedata.image && (imagedata.index === ar.time.getIndex()))
//          this.timeChanged(imagedata);
//       },

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
      ar.chart.request(properties);
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

   setField: function(field)
      {
      if(this.field !== field)
         {
         this.field = field;
         this.updateLegend().refresh();
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

   updateLegend: function()
      {
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
      }
   }

//-------------------------------------------------------------------------------------------------

