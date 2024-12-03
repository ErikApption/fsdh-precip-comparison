//-------------------------------------------------------------------------------------------------

ar.layers.ivt = 
   {
   visible: true,
   opacity: 0.7,
   field: "ivt",
   images: [],
   imagedata: [],
   imageCount: 4,
   timestamp: "",

   initialize: function()
      {
      $("#vw_field_select_fieldset").find(".field_mode").on("mousedown", function(e)
         {
         ar.layers.ivt.setField($(this).prop("id").substr(13));
         });

      this.control = ar.layercontrol.create(this, "ivt");
      this.layer = L.canvasOverlay("", [[27.284584045410156, -152.7306365966797], [70.61150360107422, -40.70855712890625]], {opacity: 1, image_smoothing: false});
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
         $("#ar_ivt_legend").show();
         $("#vw_animation_fieldset").show();
         }
      else
         {
         $("#ar_ivt_legend").hide();
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
      window.localStorage.setItem("ar_ivt_visible", this.visible);
      window.localStorage.setItem("ar_ivt_opacity", this.opacity);
      window.localStorage.setItem("ar_ivt_field_mode", this.field);
      },

   load: function()
      {
      if(ar.map.ready() && (window.localStorage.getItem("ar_ivt_visible") === "false"))
         this.control.trigger("top_click");

      if(window.localStorage.getItem("ar_ivt_opacity"))
         {
         var value = parseFloat(window.localStorage.getItem("ar_ivt_opacity"));
         this.setOpacity(value);
         }

      if(localStorage.getItem("ar_ivt_field_mode"))
         $("#ar_set_field_" + localStorage.getItem("ar_ivt_field_mode")).trigger("mousedown");
      },

   overlayChange: function()
      {
      if(ar.map.hasLayer(this.layer))
         {
         $("#map_legend").show();
         $("#ivt_cb").show();
         }
      else
         {
         $("#map_legend").hide();
         $("#ivt_cb").hide();
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
         this.layer.setBounds([[27.284584045410156, -152.7306365966797], [70.61150360107422, -40.70855712890625]]);
         this.imageCount = 41;
         }

      vw.time_controls.setMaxValue(Math.max(48, 6 * this.imageCount));

      var name = model.id.toUpperCase();

      if(name == "RDPS")
         name = "GDPS";

      $("#time_label_container").prop("title", "Timestamp of displayed IVT calculated from " + name);
      $("#time_label_container").find("legend").text(name + " IVT");

      window.setTimeout(function() { this.loadImages(); }.bind(this), ar.layers.stations.plotIsVisible() ? 2000 : 1);
      },

   dateChanged: function(data)
      {
      // reload IVT images only if the timestamp has changed; not if model or product changes
      // delaying 1 second gives time for plot data to load first, if one is visible when the time control is changed

      if(this.timestamp !== data.timestamp)
         {
         this.timestamp = data.timestamp;
         window.setTimeout(function() { this.loadImages(); }.bind(this), ar.layers.stations.plotIsVisible() ? 2000 : 1);
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
         this.imagedata.push(ar.imagedata.create(this.getImageURL(6 * i), i));

      return this;
      },

   imageLoaded: function(imagedata)
      {
      if(imagedata.image && (imagedata.index === ar.time.getIndex()))
         this.timeChanged(imagedata);
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

         return ar.config.getImageURL(this.field, hour, timestamp, 0);
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
         this.loadImages();
         ar.time.triggerChange();
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
   ar.layers.ivt.imageLoaded(this);
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
