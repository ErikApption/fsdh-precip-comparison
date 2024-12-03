//-------------------------------------------------------------------------------------------------

ar.layers.alex = 
   {
   added: false,
   visible: true,
   opacity: 1.0,
   mode: "obs",
   activeURL: "",
   selectedTarget: null,
   selectedStationID: "",
   plotMoved: false,
   plotVisible: false,

   initialize: function()
      {
      $(".alex_button").on("mousedown", function() {ar.layers.alex.setMode($(this).prop("id").substr(-3)); });
      this.control = ar.layercontrol.create(this, "alex");
      this.initializePopup();
      this.refresh();
      this.hide();
      },

   initializePopup: function(e)
      {
      $("<div></div>").prop({id: "ar_plot_popup", title: "Drag to move popup or double-click to close"}).appendTo(document.body).hide().draggable({stop: function() { ar.layers.alex.plotMoved = true; } });
      $("#ar_plot_popup").on("dblclick", function() {ar.layers.alex.hidePlots(); });
      return this;
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

         $(".leaflet-marker-icon").css({opacity: this.opacity});

         if(this.layer)
            this.layer.setStyle({ opacity: this.opacity, fillOpacity: this.opacity });
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
      window.localStorage.setItem("ar_alex_visible", this.visible);
      window.localStorage.setItem("ar_alex_opacity", this.opacity);
      window.localStorage.setItem("ar_alex_mode", this.mode);
      },

   load: function()
      {
      if(ar.map.ready() && (window.localStorage.getItem("ar_alex_visible") === "false"))
         this.control.trigger("top_click");

      if(window.localStorage.getItem("ar_alex_opacity"))
         {
         var value = parseFloat(window.localStorage.getItem("ar_alex_opacity"));
         this.setOpacity(value);
         }

      if(localStorage.getItem("ar_alex_mode"))
         $("#ar_alex_" + localStorage.getItem("ar_alex_mode")).trigger("mousedown");
      },

   refresh: function()
      {
      $.ajax(
         {
         type: "POST",
         dataType: "text",
         async: true,
         context: this,
         url: "geojson/alex_stations.geojson",
         beforeSend: function(xhr){ if(xhr.overrideMimeType) { xhr.overrideMimeType("application/json"); } },
         success: function(message, text, response)
            {
            try
               {
               this.setGeoJSON(JSON.parse(message));
               }
            catch(e)
               {
               this.setGeoJSON(null);
               }
            },
         error: function(e)
            {
            this.setGeoJSON(null);
            }
         });

      return this;
      },

   setGeoJSON: function(geoJSON)
      {
      this.geoJSON = geoJSON;
      this.refreshLayer();
      this.updatePlot();
      },

   refreshLayer: function()
      {
      if(this.layer)
         {
         ar.map.removeLayer(this.layer);
         this.layer.clearLayers();
         this.layer = null;
         }

      if(this.geoJSON)
         {
         this.layer = new L.GeoJSON(this.geoJSON,
            {
            pointToLayer: function (feature, latlng)
               {
               return ar.layers.alex.getPointToLayer(feature, latlng);
               },

            onEachFeature: function(feature, layer)
               {
               layer.on(
                  {
                  mouseover: function(e) { ar.layers.alex.mouseover(e); },
                  mousedown: function(e) { ar.layers.alex.mousedown(e); },
                  mouseout: function(e) { ar.layers.alex.mouseout(e); }
                  });
               }

            });

         if((this.added === true) && (this.visible === true))
            ar.map.addLayer(this.layer);

         this.updatePlot();
         }

      return this;
      },

   getPointToLayer: function(feature, latlng)
      {
      return L.circleMarker(latlng, {"color": "#840", "fillColor": "#FCD500", "fillOpacity": this.opacity, "opacity": this.opacity, "radius": 8, "weight": 2});
      },

   mouseover: function(e)
      {
      var target = e.target;
      var properties = target.feature.properties;
      var pixel = ar.map.latLngToContainerPoint(target.getLatLng());
      pixel.x += $("#vw_map_div").offset().left;
      pixel.y += $("#vw_map_div").offset().top;

      target.setStyle({radius: 10});

      if(properties.Name)
         $("#vw_map_info").html("<b>" + properties.Station_ID + "</b> (" + properties.Name + ")");
      else
         $("#vw_map_info").html("");

      ar.popup.showStation({id: properties.Station_ID}, pixel);
      },

   mousedown: function(e)
      {
      this.showPlot(e.target);
      L.DomEvent.stopPropagation(e);
      },

   mouseout: function(e)
      {
      e.target.setStyle({radius: 8});
      $("#vw_map_info").text("");
      ar.popup.hide();
      },

   setMode: function(mode)
      {
      if(this.mode !== mode)
         {
         this.mode = mode;
         $("#ar_title_container").html(ar.projects.alex.title + ((this.mode === "obs") ? " (JRA 1980-2020)" : " (CanRCM4)"));
         this.updatePlot();
         }
      },

   showPlot: function(target)
      {
      this.selectTarget(target);
      this.selectedStationID = target.feature.properties.Station_ID;
      this.selectedStationName = target.feature.properties.Name;

      $("#ar_document_container").empty();

      $("#ar_plot_date_div").html(this.selectedStationName);

      var url = "alex/" + this.selectedStationName + "_" + this.mode + "_duration_tseries.pdf";
      url = url.replace(/ /g, "_").replace("__", "_").replace(" - ", "-").replace("(AUT)", "AUT");

      if(this.activeURL !== url)
         {
         this.activeURL = url;

         if(this.activeURL !== "")
            {
            var $iframe = $("<iframe></iframe>").prop({src: this.activeURL, width: $("#ar_tabs").width() - 20, height: $("#ar_tabs").height() - 50});
            $iframe.css({"border": "1px solid #777", "border-radius": "3px", "margin-top": "3px", "position": "absolute", "top": "40px", "right": "10px", "left": "10px", "bottom": "10px"});
            $("#ar_document_container").append($iframe);
            }

         var $contents = $("<div></div>");
         var $date_div = $("<div></div>").prop({id: "ar_popup_date_div"}).html(this.selectedStationName).appendTo($contents);
         var $iframe = $("<iframe></iframe>").prop({src: this.activeURL, width: 700, height: 400});
         $iframe.css({display: "block", width: "97%", height: "83%", border: "1px solid #777", "border-radius": "3px", "margin-top": "3px", "position": "absolute", "top": "40px", "right": "10px", "left": "10px", "bottom": "10px"});
         $contents.append($iframe);
         var $close = $("<div></div>").addClass("ar_button close").prop({title: "Click to close popup (or click map)"}).text("x").on("mousedown", function() { ar.layers.alex.hidePlot(); });
         $iframe.on("mousedown", function() { ar.layers.alex.hidePlot(); });
         $("#ar_plot_popup").empty().append($contents, "<br>", $close).show();

         if(!this.plotMoved)
            $("#ar_plot_popup").css("left", Math.round(0.5 * ($(window).width() - $("#ar_plot_popup").width())) + "px");

         this.plotVisible = true;
         }
      else
         this.hidePlot();

      return this;
      },

   hidePlot: function()
      {
      this.plotVisible = false;
      $("#ar_plot_popup").hide();
      $("#ar_plot_image").prop({src: ""});
      $("#ar_popup_date_div,#ar_plot_date_div").text("");
//       $("#vw_plot_camera").hide();
      this.selectTarget(null);
      return this;
      },

   selectTarget: function(target)
      {
      if(this.selectedTarget)
         this.selectedTarget.setStyle({ radius: 8, weight: 2 });

      this.selectedTarget = target;
      return this;
      },

   tabChanged: function(tabID)
      {
      if((tabID === "ar_map_tab") && (this.plotVisible === true))
         $("#ar_plot_popup").show();
      else
         $("#ar_plot_popup").hide();
      },

   updatePlot: function()
      {
      if((this.selectedStationID !== "") && (this.plotVisible === true))
         {
         var target = this.getTargetFromStationID(this.selectedStationID);

         if(target !== null)
            this.showPlot(target);
         else
            this.hidePlot();
         }
      },

   getTargetFromStationID: function(stationID)
      {
      if(this.layer)
         {
         var layers = this.layer.getLayers();

         for(var i = 0; i < layers.length; i++)
            {
            if(layers[i].feature.properties.ClimateID === stationID)
               return layers[i];
            }
         }

      return null;
      },

   getSelectedStationName: function()
      {
      return this.selectedStationName;
      },

   bringToFront: function()
      {
      if(this.layer)
         this.layer.bringToFront();
      },

   show: function()
      {
      this.added = true;

      this.control.show();

      if(this.layer && (this.visible === true))
         ar.map.addLayer(this.layer);
      },

   hide: function()
      {
      this.added = false;
      this.control.hide();

      if(this.layer)
         ar.map.removeLayer(this.layer);
      }
   }

//-------------------------------------------------------------------------------------------------
