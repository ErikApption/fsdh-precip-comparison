//-------------------------------------------------------------------------------------------------

ar.layers.stations = 
   {
   visible: true,
   opacity: 1.0,
   displayMode: "circle",
   hoverTimerID: 0,
   filterIndex: -1,
   plotMode: "Click",
   selectedTarget: null,
   previousSelectedTarget: null,
   selectedStationID: "",
   activeGeoJSONURL: "",
   categoryTypes: {ar: {label: "AR scale", units: "kg m<sup>-1</sup>s<sup>-1</sup>"}, m: {label: "precip rate", units: "mm/hr"}, d: {label: "duration", units: "hr"}, at: {label: "Antecedent precip", units: "mm"}, r: {label: "return period", units: "yr"}, t: {label: "total runoff", units: "mm"}},
 
   initialize: function()
      {
      $("#ar_stations_circle").on("mousedown", function(e) { ar.layers.stations.setDisplayMode("circle"); })
      $("#ar_stations_label").on("mousedown", function(e) { ar.layers.stations.setDisplayMode("label"); })
      $(".station_mode").on("mousedown dblclick click mousemove mouseup", function(e) { e.preventDefault(); return false; });
      $(".plot_button").on("mousedown", function(e) { ar.layers.stations.setPlotMode($(this).text()); });
      $("#ar_station_filter_select").on("change", function() {ar.layers.stations.setFilterIndex($(this).val()); });

      this.control = ar.layercontrol.create(this, "stations");
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
      window.localStorage.setItem("ar_stations_visible", this.visible);
      window.localStorage.setItem("ar_stations_opacity", this.opacity);
      window.localStorage.setItem("ar_stations_display_mode", this.displayMode);
      window.localStorage.setItem("ar_stations_plot_mode", this.plotMode);
      },

   load: function()
      {
      if(ar.map.ready() && (window.localStorage.getItem("ar_stations_visible") === "false"))
         this.control.trigger("top_click");

      if(window.localStorage.getItem("ar_stations_opacity"))
         {
         var value = parseFloat(window.localStorage.getItem("ar_stations_opacity"));
         this.setOpacity(value);
         }

      if(localStorage.getItem("ar_stations_display_mode"))
         $("#ar_stations_" + localStorage.getItem("ar_stations_display_mode")).trigger("mousedown");

      if(localStorage.getItem("ar_stations_plot_mode") && (localStorage.getItem("ar_stations_plot_mode") === "Hover"))
         $("#ar_station_hover").trigger("mousedown");
      },

   refresh: function()
      {
      if(this.activeGeoJSONURL !== ar.projects.getActiveStationGeoJSONURL())
         {
         this.activeGeoJSONURL = ar.projects.getActiveStationGeoJSONURL();
         this.activeScale = ar.projects.getActiveScale();
         this.activeSubscale = ar.projects.getActiveSubscale();
         this.activeProductValue = ar.projects.getActiveProductValue();

         $.ajax(
            {
            type: "POST",
            dataType: "json",
            async: true,
            context: this,
            url: this.activeGeoJSONURL,
            beforeSend: function(xhr){ if(xhr.overrideMimeType) { xhr.overrideMimeType("application/json"); } },
            dataType: "json",
            success: function(message, text, response)
               {
               try
                  {
                  this.setGeoJSON(message);
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
         }
      else if((this.activeScale !== ar.projects.getActiveScale()) || (this.activeSubscale !== ar.projects.getActiveSubscale()) || (this.activeProductValue !== ar.projects.getActiveProductValue()))
         {
         this.activeScale = ar.projects.getActiveScale();
         this.activeSubscale = ar.projects.getActiveSubscale();
         this.activeProductValue = ar.projects.getActiveProductValue();
         this.updateGeoJSON();
         }

      return this;
      },

   updateStationPoints: function(scaleID, product)
      {
      if(this.geoJSON && this.geoJSON.features && (this.geoJSON.features.length > 0) && this.geoJSON.features[0].properties.hasOwnProperty(scaleID) && this.geoJSON.features[0].properties[scaleID].hasOwnProperty(product))
         this.setGeoJSON(this.geoJSON);
      else
         this.refresh()
      },

   resetGeoJSON: function()
      {
      this.setGeoJSON(this.geoJSON).updatePlot(true);
      return this;
      },

   setGeoJSON: function(geoJSON)
      {
      this.geoJSON = geoJSON;
      this.updateGeoJSON();
      ar.mail.update();
      return this;
      },

   updateGeoJSON: function()
      {
      if((this.geoJSON !== null) && (this.geoJSON !== undefined))
         {
         if(ar.projects.getActiveScale() === "E")
            this.setECARGeoJSON();
         else
            this.setARGeoJSON();
         }
      else
         this.activeGeoJSON = null;

      this.refreshLayer();

      return this;
      },

   setECARGeoJSON: function()
      {
      var subscale = ar.projects.getActiveSubscale();

      if(subscale === "S")
         this.setECARStormTotalGeoJSON();
      else if(subscale === "W")
         this.setECARWeightedGeoJSON();
      else
         this.setECARRunningTotalGeoJSON();
      },

   setECARStormTotalGeoJSON: function()
      {
      var mode = ar.projects.getMissingValueMode();
      var features = this.geoJSON.features;

      features.sort(function(a,b) { return (a.properties.rtg.E.S.x.c[mode] > b.properties.rtg.E.S.x.c[mode]) || (b.properties.rtg.E.S.x.c[mode] === "NA"); });

      this.geoJSON.features = features;

      this.activeGeoJSON = {"type":"FeatureCollection", "features":[]};

      this.geoJSON.features.forEach(function(f) { var cat = f.properties.rtg.E.S.x.c[mode]; if((cat >= this.filterIndex) || (cat === "NA")) this.activeGeoJSON.features.push(f); }, this);
      },

   setECARWeightedGeoJSON: function()
      {
      var mode = ar.projects.getMissingValueMode();
      var IVT_threshold = ar.projects.getIVTThreshold();
      var subsubscale = (ar.projects.getActiveProductValue() === "ECAR_W") ? "x" : "xx";

      if(subsubscale === "x")
         this.updateWeighting();

      var features = this.geoJSON.features;
      features.sort(function(a,b) { return (a.properties.rtg.E.W[subsubscale].c[IVT_threshold][mode] > b.properties.rtg.E.W[subsubscale].c[IVT_threshold][mode]) || (b.properties.rtg.E.W[subsubscale].c[IVT_threshold][mode] === "NA"); });
      this.geoJSON.features = features;

      this.activeGeoJSON = {"type":"FeatureCollection", "features":[]};

      this.geoJSON.features.forEach(function(f) { var cat = f.properties.rtg.E.W[subsubscale].c[IVT_threshold][mode]; if((cat >= this.filterIndex) || (cat === "NA")) this.activeGeoJSON.features.push(f); }, this);
      },

   setECARRunningTotalGeoJSON: function()
      {
      var mode = ar.projects.getMissingValueMode();
      var productValue = ar.projects.getActiveProductValue();

      var features = this.geoJSON.features;

      if(productValue === "x")
         features.sort(function(a,b) { return (a.properties.rtg.E.R.x.c[mode] > b.properties.rtg.E.R.x.c[mode]) || (b.properties.rtg.E.R.x.c[mode] === "NA"); });
      else
         features.sort(function(a,b) { return (a.properties.rtg.E.R[productValue].c > b.properties.rtg.E.R[productValue].c) || (b.properties.rtg.E.R[productValue].c === "NA"); });

      this.geoJSON.features = features;

      this.activeGeoJSON = {"type":"FeatureCollection", "features":[]};

      if(productValue === "x")
         this.geoJSON.features.forEach(function(f) { var cat = f.properties.rtg.E.R.x.c[mode]; if((cat >= this.filterIndex) || (cat === "NA")) this.activeGeoJSON.features.push(f); }, this);
      else
         this.geoJSON.features.forEach(function(f) { var cat = f.properties.rtg.E.R[productValue].x.c; if((cat >= this.filterIndex) || (cat === "NA")) this.activeGeoJSON.features.push(f); }, this);
      },

   setARGeoJSON: function()
      {
      var IVT_threshold = ar.projects.getIVTThreshold();

      var features = this.geoJSON.features;
      features.sort(function(a,b) { return (a.properties.rtg.A[IVT_threshold].x.c > b.properties.rtg.A[IVT_threshold].x.c) || (b.properties.rtg.A[IVT_threshold].x.c === "NA"); });
      this.geoJSON.features = features;

      this.activeGeoJSON = {"type":"FeatureCollection", "features":[]};

      this.geoJSON.features.forEach(function(f) { var category = f.properties.rtg.A[IVT_threshold].x.c; if((category >= this.filterIndex) || (category === "NA")) this.activeGeoJSON.features.push(f); }, this);
      },

   refreshLayer: function()
      {
      if(this.layer)
         {
         ar.map.removeLayer(this.layer);
         this.layer.clearLayers();
         this.layer = null;
         }

      if(this.activeGeoJSON)
         {
         this.layer = new L.GeoJSON(this.activeGeoJSON,
            {
            pointToLayer: function (feature, latlng)
               {
             //  return ar.layers.stations.getPointToLayer(feature, latlng);
               },

            onEachFeature: function(feature, layer)
               {
               layer.on(
                  {
                  mouseover: function(e) { ar.layers.stations.mouseover(e); },
                  mousedown: function(e) { ar.layers.stations.mousedown(e); },
                  mouseout: function(e) { ar.layers.stations.mouseout(e); }
                  });
               }

            });

         if(this.visible === true)
            ar.map.addLayer(this.layer);
         }

      this.updatePlot(false);

      return this;
      },

   initializeFilterSelect: function()
      {
      $("#ar_station_filter_select").empty();
      ar.projects.getActiveCategories().forEach(function(c, i) { $("#ar_station_filter_select").append($("<option></option>").val(c.value).html((i === 0) ? "All stations" : c.html)); });
      },

   setFilterIndex: function(value)
      {
      if(this.filterIndex !== parseInt(value))
         {
         this.filterIndex = parseInt(value);

         if(this.geoJSON !== null)
            {
            var scale = ar.projects.getActiveScale();
            var subscale = ar.projects.getActiveSubscale();
            var productValue = ar.projects.getActiveProductValue();
            var mode = ar.projects.getMissingValueMode();
            var IVT_threshold = ar.projects.getIVTThreshold();

            this.activeGeoJSON = {"type":"FeatureCollection", "features":[]};

            if(scale === "A") 
               this.geoJSON.features.forEach(function(f) { var category = f.properties.rtg.A[IVT_threshold].x.c; if((category >= this.filterIndex) || (category === "NA")) this.activeGeoJSON.features.push(f); }, this);
            else if(scale === "E")
               {
               if(subscale === "W")
                  {
                  var subsubscale = (productValue === "ECAR_W") ? "x" : "xx";
                  this.geoJSON.features.forEach(function(f) { var cat = f.properties.rtg.E.W[subsubscale].c[IVT_threshold][mode]; if((cat >= this.filterIndex) || (cat === "NA")) this.activeGeoJSON.features.push(f); }, this);
                  }
               else if(subscale === "R")
                  {
                  if(productValue === "x")
                     this.geoJSON.features.forEach(function(f) { var cat = f.properties.rtg.E.R.x.c[mode]; if((cat >= this.filterIndex) || (cat === "NA")) this.activeGeoJSON.features.push(f); }, this);
                  else
                     this.geoJSON.features.forEach(function(f) { var cat = f.properties.rtg.E.R[productValue].x.c; if((cat >= this.filterIndex) || (cat === "NA")) this.activeGeoJSON.features.push(f); }, this);
                  }
               else
                  this.geoJSON.features.forEach(function(f) { var cat = f.properties.rtg.E.S.x.c[mode]; if((cat >= this.filterIndex) || (cat === "NA")) this.activeGeoJSON.features.push(f); }, this);
               }

            this.refreshLayer();
            }
         }
      },

   getPointToLayer: function(feature, latlng)
      {
      var scale = ar.projects.getActiveScale();
      var subscale = ar.projects.getActiveSubscale();
      var productValue = ar.projects.getActiveProductValue();
      var mode = ar.projects.getMissingValueMode();
      var IVT_threshold = ar.projects.getIVTThreshold();
      var mxcl = "#000";

      if(scale === "A") 
         mxcl = ar.projects.getActiveColourFromIndex(feature.properties.rtg.A[IVT_threshold].x.c);
      else if(scale === "E")
         {
         if(subscale === "W")
            {
            if(feature.properties.id === "8206491")
               var dog = "what";
            var subsubscale = (productValue === "ECAR_W") ? "x" : "xx";
            mxcl = ar.projects.getActiveColourFromIndex(feature.properties.rtg.E.W[subsubscale].c[IVT_threshold][mode]);
            }
         else if(subscale === "R")
            {
            if(productValue === "x")
               mxcl = ar.projects.getActiveColourFromIndex(feature.properties.rtg.E.R.x.c[mode]);
            else
               mxcl = ar.projects.getActiveColourFromIndex(feature.properties.rtg.E.R[productValue].x.c);
            }
         else
            mxcl = ar.projects.getActiveColourFromIndex(feature.properties.rtg.E[subscale].x.c[mode]);
         }

      if(this.displayMode === "circle")
         return L.circleMarker(latlng, {color: "black", fillColor: mxcl, fillOpacity: this.opacity, opacity: this.opacity, radius: 7, weight: 2});
      else
         {
         var colour = "rgba(255,255,255,0.2)";
         var text = this.getMarkerText(mxcl);
         return L.textMarker(latlng, {color: "black", fillOpacity: this.opacity, opacity: this.opacity, text: text, weight: 1, bgColor: colour});
         }
      },

   getCategory: function(colour)
      {
      return ar.projects.getActiveCategory(colour);
      },

   getTitle: function(colour)
      {
      return ar.projects.getActiveTitle(colour);
      },

   getMarkerText: function(colour)
      {
      return ar.projects.getActiveShortCategory(colour);
      },

   mouseover: function(e)
      {
      var target = e.target;
      var properties = target.feature.properties;
      var pixel = ar.map.latLngToContainerPoint(target.getLatLng());
      pixel.x += $("#vw_map_div").offset().left;
      pixel.y += $("#vw_map_div").offset().top;

      target.setStyle({radius: 10});

      var scale = ar.projects.getActiveScale();
      var subscale = ar.projects.getActiveSubscale();
      var productValue = ar.projects.getActiveProductValue();
      var IVT_threshold = ar.projects.getIVTThreshold();
      var mode = ar.projects.getMissingValueMode();

      var colour = "#000";

      if(scale === "A")
         colour = ar.projects.getActiveColourFromIndex(properties.rtg.A[IVT_threshold].x.c);
      else if(scale === "E")
         {
         if(subscale === "W")
            {
            var subsubscale = (productValue === "ECAR_W") ? "x" : "xx";
            colour = ar.projects.getActiveColourFromIndex(properties.rtg.E.W[subsubscale].c[IVT_threshold][mode]);
            }
         else if(subscale === "R")
            {
            if(productValue === "x")
               colour = ar.projects.getActiveColourFromIndex(properties.rtg.E.R.x.c[mode]);
            else
               colour = ar.projects.getActiveColourFromIndex(properties.rtg.E.R[productValue].x.c);
            }
         else
            colour = ar.projects.getActiveColourFromIndex(properties.rtg.E[subscale].x.c[mode]);
         }

      var category = this.getCategory(colour);

      var title = this.getTitle(colour);

      var info = "";

      if(scale === "A")
         {
         var cat = properties.rtg.A[IVT_threshold].x;
         info = "(IVT: " + cat.v.toFixed(0) + ", dur: " + cat.d.toFixed(0) + "h)";
         }
      else if(scale === "E")
         {
         if(subscale === "S")
            {
            var cat = properties.rtg.E.S.x;

            if((mode === "v") || (cat.r !== "NA"))
               {
               var rp = (cat.r !== "NA") ? (cat.r.toFixed((cat.r < 10) ? 1 : 0) + "yr") : "NA";
               info = "(RP: " + rp + ", ST: " + cat.t.toFixed((cat.t < 10) ? 1 : 0) + "mm, dur: " + cat.d.toFixed(0) + "h)";
               }
            }
         else if(subscale === "R")
            {
            if(productValue === "x")
               {
               var cat = properties.rtg.E.R.x;

               if((mode === "v") || (cat.i[mode] !== "NA"))
                  {
                  var rp = (cat.r !== "NA") ? (cat.r.toFixed((cat.r < 10) ? 1 : 0) + "yr") : "NA";
                  var interval = (cat.i[mode] !== "NA") ? (cat.i[mode] + "h") : "NA";
                  info = "(amt: " + cat.t.toFixed((cat.t < 10) ? 1 : 0) + "mm, int: " + interval + ", RP: " + rp + ")";
                  }
               }
            else
               {
               var cat = properties.rtg.E.R[productValue].x;

               if((mode === "v") || (cat.r !== "NA"))
                  {
                  var rp = (cat.r !== "NA") ? (cat.r.toFixed((cat.r < 10) ? 1 : 0) + "yr") : "NA";
                  info = "(amt: " + cat.v.toFixed((cat.v < 10) ? 1 : 0) + "mm, int: " + productValue + "h, RP: " + rp + ")";
                  }
               }
            }
         else if(subscale === "W")
            {
            if(productValue === "ECAR_W")
               {
               var cat = properties.rtg.E.W.x;

               if((mode === "v") || (cat.c[IVT_threshold].a !== "NA"))
                  info = "(Tot: " + cat.t.toFixed((cat.t < 10) ? 1 : 0) + "mm, Ant: " + cat.a.toFixed(0) + "mm, dur: " + cat.d.toFixed(0) + "h, RP: " + cat.r + "yr)";
               }
            else
               {
               var cat = properties.rtg.E.W.xx.c[IVT_threshold];

               if((cat.t !== "") && (cat.t !== undefined))
                  {
                  var evt = properties.rtg.E.W.e[cat.i];
                  var ed = (cat.t === "ar") ? evt.c[cat.t][IVT_threshold] : evt.c[cat.t];
                  info = "(Type: <b>" + this.categoryTypes[cat.t]["label"] + "</b>, Value: <b>" + ed.v + this.categoryTypes[cat.t]["units"] + "</b>)";
                  }
               }
            }
         }

      if(properties.name)
         $("#vw_map_info").html("<b>" + properties.name + "</b> (Climate ID " + properties.id + "): " + category + " " + info);
      else
         $("#vw_map_info").html("");

      ar.popup.showStation({id: properties.name, scale: scale, subscale: subscale, product: productValue, category: category, info: info}, pixel);
      this.startHoverTimer(e.target); 
      },

   mousedown: function(e)
      {
      this.showChart(e.target);
      L.DomEvent.stopPropagation(e);
      },

   mouseout: function(e)
      {
      e.target.setStyle({radius: 7});
      $("#vw_map_info").text("");
      ar.popup.hide();
      this.resetHoverTimer();
      },

   setDisplayMode: function(mode)
      {
      if(this.displayMode !== mode)
         {
         this.displayMode = mode;
         this.refreshLayer();
         }
      },

   startHoverTimer: function(target)
      {
      if(this.plotMode === "Hover")
         {
         window.clearTimeout(this.hoverTimerID);
         this.hoverTimerID = window.setTimeout(function() { ar.layers.stations.showChart(target); }, 500);
         }
      },

   resetHoverTimer: function()
      {
      if(this.plotMode === "Hover")
         window.clearTimeout(this.hoverTimerID);
      },

   setPlotMode: function(mode)
      {
      if(this.plotMode !== mode)
         {
         this.plotMode = mode;
         window.clearTimeout(this.hoverTimerID);
         }
      },

   showChart: function(target)
      {
      this.selectTarget(target);
      ar.chart.show({id: this.selectedStationID, name: this.selectedStationName, jsonURL: ar.projects.getActiveJSONURL(this.selectedStationID), model: ar.projects.getActiveModel(), model: ar.projects.getActiveModel(), product: ar.projects.getActiveProduct()});
      return this;
      },

   selectTarget: function(target)
      {
      if(this.selectedTarget)
         {
         this.selectedTarget.setStyle({ radius: 7, weight: 2 });
         this.previousSelectedTarget = this.selectedTarget;
         }

      this.selectedTarget = target;

      if(this.selectedTarget)
         {
         this.selectedStationID = this.selectedTarget.feature.properties.id;
         this.selectedStationName = this.selectedTarget.feature.properties.name;
         }

      ar.mail.update();

      return this;
      },

   getSelectTargetProperties: function()
      {
      return (this.selectedTarget ? this.selectedTarget.feature.properties : null);
      },

   getPreviousSelectTargetProperties: function()
      {
      return (this.previousSelectedTarget ? this.previousSelectedTarget.feature.properties : null);
      },

   tabChanged: function(tabID)
      {
      ar.chart.tabChanged(tabID);
      },

   updatePlot: function(override)
      {
      if(ar.chart.popupIsVisible() && (this.selectedStationID !== ""))
         {
         var target = this.getTargetFromStationID(this.selectedStationID);

         if(target !== null)
            ar.chart.show({id: this.selectedStationID, name: this.selectedStationName, jsonURL: ar.projects.getActiveJSONURL(target.feature.properties.id), model: ar.projects.getActiveModel(), product: ar.projects.getActiveProduct(), override: override});
         else
            ar.chart.hidePopup();
         }

      return this;
      },

   plotIsVisible: function()
      {
      return (ar.chart.popupIsVisible() && (this.selectedStationID !== ""));
      },

   getTargetFromStationID: function(stationID)
      {
      if(this.layer)
         {
         var layers = this.layer.getLayers();

         for(var i = 0; i < layers.length; i++)
            {
            if(layers[i].feature.properties.id === stationID)
               return layers[i];
            }
         }

      return null;
      },

   projectChanged: function(project)
      {
      this.filterIndex = -1;
      this.initializeFilterSelect();
      },

   modelChanged: function(model)
      {
      this.refresh();
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
      this.control.show();

      if(this.layer && (this.visible === true))
         ar.map.addLayer(this.layer);
      },

   hide: function()
      {
      this.control.hide();

      if(this.layer && (this.visible === true))
         ar.map.removeLayer(this.layer);
      },

   getWeightingTotal: function(senderID, newValue)
      {
      var total = 0;
      $("#ar_weighting_container").find(".ar_weighting_value").each(function(i, e) { if($(e).prop("id").indexOf(senderID) < 0) total += parseInt($(e).text()); });
      return total + newValue;
      },

   updateWeighting: function()
      {
      var ivtWeight = parseInt($("#ar_ivt_weight").text());
      var durWeight = parseInt($("#ar_dur_weight").text());
      var antWeight = parseInt($("#ar_ant_weight").text());
      var retWeight = parseInt($("#ar_ret_weight").text());
      var totWeight = parseInt($("#ar_tot_weight").text());
      var mprWeight = parseInt($("#ar_mpr_weight").text());

      var sum = ivtWeight + durWeight + antWeight + retWeight + totWeight + mprWeight;

      if((sum > 0) && (this.geoJSON))
         {
         var invSum = 1.0 / sum;
         var scale = ar.projects.getActiveScale();
         var subscale = ar.projects.getActiveSubscale();
         var mode = ar.projects.getMissingValueMode();
         var IVT_threshold = ar.projects.getIVTThreshold();

         this.geoJSON.features.forEach(function(f)
            {
            if(f.properties.id === "8206491")
               var dog = "what";

            var prop = f.properties.rtg.E.W;
            var mx = prop.x.c[IVT_threshold];
            mx.v = 0;   // reset the maximum to zero to start

            // loop through all events

            prop.e.forEach(function(e)
               {
               var ar = e.c.ar[IVT_threshold].c;
               var r = e.c.r.c;
               var rc = (r === "NA") ? 0 : r;
               var v = Math.floor((ivtWeight * ar + durWeight * e.c.d.c + antWeight * e.c.at.c + retWeight * rc + totWeight * e.c.t.c + mprWeight * e.c.m.c) * invSum);

               // update event weighted category

               e.c.w[IVT_threshold].v = v;
               e.c.w[IVT_threshold].a = (r === "NA") ? "NA": v;

               // update station max weighted category

               mx.v = Math.max(mx.v, v);

               if(mx.a !== "NA")
                  mx.a = mx.v;
               else if(r === "NA")
                  mx.a = "NA";
               });
            }, this);
         }
      },

   updateStationWeighting: function(rtg)
      {
      var ivtWeight = parseInt($("#ar_ivt_weight").text());
      var durWeight = parseInt($("#ar_dur_weight").text());
      var antWeight = parseInt($("#ar_ant_weight").text());
      var retWeight = parseInt($("#ar_ret_weight").text());
      var totWeight = parseInt($("#ar_tot_weight").text());
      var mprWeight = parseInt($("#ar_mpr_weight").text());

      var sum = ivtWeight + durWeight + antWeight + retWeight + totWeight + mprWeight;

      if(sum > 0)
         {
         var invSum = 1.0 / sum;
         var scale = ar.projects.getActiveScale();
         var subscale = ar.projects.getActiveSubscale();
         var mode = ar.projects.getMissingValueMode();
         var IVT_threshold = ar.projects.getIVTThreshold();

         var prop = rtg.E.W;
         var mx = prop.x.c[IVT_threshold];

         mx.v = 0;   // reset the maximum to zero to start

         // loop through all events

         prop.e.forEach(function(e)
            {
            var ar = e.c.ar[IVT_threshold].c;
            var r = e.c.r.c;
            var rc = (r === "NA") ? 0 : r;
            var v = Math.floor((ivtWeight * ar + durWeight * e.c.d.c + antWeight * e.c.at.c + retWeight * rc + totWeight * e.c.t.c + mprWeight * e.c.m.c) * invSum);

            // update event weighted category

            e.c.w[IVT_threshold].v = v;
            e.c.w[IVT_threshold].a = (r === "NA") ? "NA": v;

            // update station max weighted category

            mx.v = Math.max(mx.v, v);

            if(mx.a !== "NA")
               mx.a = mx.v;
            else if(r === "NA")
               mx.a = "NA";
            });
         }
      }
   }

//-------------------------------------------------------------------------------------------------
