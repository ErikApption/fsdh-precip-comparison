//-------------------------------------------------------------------------------------------------

ar.layers.regions = 
   {
   zIndex: 5,
   visible: true,
   opacity: 1.0,
   lineWidth: 1.5,
   fillColour: "#EEE",
   lineColour: "#888",

   initialize: function()
      {
      this.createLayer();
      this.control = ar.layercontrol.create(this, "regions");
      $("#ar_line_width_slider").slider({min: 0.5, value: this.lineWidth, step: 0.5, max: 5, slide: function(e, ui) { ar.layers.setLineWidth(ui.value); }});
      },

   createLayer: function()
      {
      var style = function(f)
         {
         var lineColour = (f.properties.hasOwnProperty("STATEFP") ? "#88A" : ar.layers.regions.lineColour);
         var fillColour = (f.properties.hasOwnProperty("STATEFP") ? "#EEF" : ar.layers.regions.fillColour);
         return { weight: ar.layers.regions.lineWidth, color: lineColour, opacity: ar.layers.regions.opacity, fillColor: fillColour, fillOpacity: 0.2 * ar.layers.regions.opacity};
         }

      function onEachFeature(feature, layer)
         {
         layer.on(
            {
            mouseover: function(e) { ar.layers.regions.mouseover(e); },
            mouseout: function(e) { ar.layers.regions.mouseout(e); }
            });
         }

      this.layer = new L.GeoJSON.AJAX("geojson/land_standard_exaggerated_A.geojson", { style: style, onEachFeature: onEachFeature });
      this.layer.on("data:loaded", function() { ar.layers.reorder(); });
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
         this.layer.setStyle({ opacity: this.opacity, fillOpacity: 0.2 * this.opacity });
         }
      },

   getLineWidth: function()
      {
      return this.lineWidth;
      },

   setLineWidth: function(value)
      {
      if((value > 0) && (value < 6))
         {
         this.lineWidth = value;
         this.layer.setStyle({weight: value});
         }
      },

   getFillColour: function()
      {
      return this.fillColour;
      },

   setFillColour: function(value)
      {
      if(this.fillColour !== value)
         {
         this.fillColour = value;
         this.layer.setStyle({fillColor: this.fillColour});
         }
      },

   getLineColour: function()
      {
      return this.lineColour;
      },

   setLineColour: function(value)
      {
      if(this.lineColour !== value)
         {
         this.lineColour = value;
         this.layer.setStyle({color: this.lineColour});
         }
      },

   mouseover: function(e)
      {
      var target = e.target;
      $("#vw_map_info").html(target.feature.properties.name);
      },

   mouseout: function(e)
      {
      if($(e.originalEvent.target).prop("id") !== "ar_popup")
         {
         var target = e.target;
         $("#vw_map_info").text("");
         }
      },

   toggle: function()
      {
      this.visible = !this.visible;

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
      window.localStorage.setItem("ar_regions_visible", this.visible);
      window.localStorage.setItem("ar_regions_opacity", this.opacity);
      window.localStorage.setItem("ar_regions_line_width", this.lineWidth);
      window.localStorage.setItem("ar_regions_line_colour", this.lineColour);
      window.localStorage.setItem("ar_regions_fill_colour", this.fillColour);
      },

   load: function()
      {
      if(ar.map.ready() && (window.localStorage.getItem("ar_regions_visible") === "false"))
         this.control.trigger("top_click");

      if(window.localStorage.getItem("ar_regions_opacity"))
         {
         var value = parseFloat(window.localStorage.getItem("ar_regions_opacity"));
         this.setOpacity(value);
         }

      if(window.localStorage.getItem("ar_regions_line_width"))
         {
         var value = parseFloat(window.localStorage.getItem("ar_regions_line_width"));
         this.setLineWidth(value);
         $("#ar_line_width_slider").slider("value", value);
         }

      if(window.localStorage.getItem("ar_regions_line_colour"))
         {
         var value = window.localStorage.getItem("ar_regions_line_colour");
         this.setLineColour(value);
         }

      if(window.localStorage.getItem("ar_regions_fill_colour"))
         {
         var value = window.localStorage.getItem("ar_regions_fill_colour");
         this.setFillColour(value);
         }
      },

   bringToFront: function()
      {
      if(this.layer)
         this.layer.bringToFront();
      }
   }

//-------------------------------------------------------------------------------------------------


