//-------------------------------------------------------------------------------------------------

ar.chart =
   {
   popupVisible: false,
   popupMoved: false,
   upper_popup_plot: null,
   lower_popup_plot: null,
   upper_plot: null,
   lower_plot: null,
   currentURL: null,
   currentProduct: null,
   currentJSON: null,

   initialize: function()
      {
      this.initializePopup().initializePage();
      },

   initializePopup: function()
      {
      $("#ar_chart_popup").hide().draggable({stop: function() { ar.chart.popupMoved = true; }, containment: "window" }).on("dblclick", function() { ar.chart.hidePopup(); });
      $("#ar_chart_popup").find(".close").on("mousedown", function() { ar.chart.hidePopup(); });
      $("#ar_chart_popup").find(".vw_camera").on("mousedown", function() { ar.ui.savePopupChartImage(ar.layers.stations.getSelectedStationName()); });
      $(".chart_legend").draggable().hide();
      return this;
      },

   initializePage: function()
      {
      $("#vw_plot_camera").on("mousedown", function() {ar.ui.saveChartImage($("#ar_plot_image_container").get(0), ar.layers.stations.getSelectedStationName());}).hide();
      return this;
      },

   show: function(data)
      {
      // data = {id: this.selectedStationID, name: this.selectedStationName, dateHTML: dateHTML, jsonURL: jsonURL, override: override}

      if(data.jsonURL !== "")
         {
         if(!this.popupMoved)
            $("#ar_chart_popup").css("left", Math.round(0.5 * ($(window).width() - $("#ar_chart_popup").width())) + "px");

         $(".popup_chart.upper,.tab_chart.upper").removeClass("missing");
         $("#ar_chart_popup").show();

         if((data.jsonURL !== this.currentURL) || (data.product.value !== this.currentProduct) || (this.popupVisible === false) || (data.override === true))
            {
            this.popupVisible = true;
            this.currentProduct = data.product.value;

            if(data.jsonURL !== this.currentURL)
               {
               this.currentURL = data.jsonURL;
               this.getData(data);
               }
            else
               this.plotJSON(data, this.currentJSON);
            }
         }
      else
         this.hidePopup();
      },

   hidePopup: function()
      {
      $("#ar_chart_popup").hide();
      $("#ar_chart_popup_date,#ar_chart_date").empty();
      $("#ar_chart_popup_title,#ar_chart_title").empty();
      $("#ar_chart_popup_subtitle,#ar_chart_subtitle").empty();
      $(".popup_chart.upper,.tab_chart.upper").hide();
      $(".popup_chart.lower,.tab_chart.lower,.chart_legend").hide();
      this.popupVisible = false;
      ar.layers.stations.selectTarget(null);
      return this;
      },

   getData: function(data)
      {
      $.ajax(
         {
         type: "POST",
         dataType: "json",
         async: true,
         context: this,
         url: data.jsonURL,
         beforeSend: function(xhr){ if(xhr.overrideMimeType) { xhr.overrideMimeType("application/json"); } },
         dataType: "json",
         success: function(json, text, response)
            {
            this.currentJSON = json;
            this.plotJSON(data, this.currentJSON);
            },
         error: function(e, dog, horse)
            {
            $("#ar_chart_popup_date,#ar_chart_date").empty();
            $("#ar_chart_popup_title,#ar_chart_title").empty();
            $("#ar_chart_popup_subtitle,#ar_chart_subtitle").empty();
            $(".popup_chart.upper,.tab_chart.upper").empty().addClass("missing");
            $(".popup_chart.lower,.tab_chart.lower,.chart_legend").hide();
            }
         });
      },

   plotJSON: function(data, json)
      {
      var timeID = (ar.projects.getActiveScale() === "E") ? "pr_times" : "ivt_times";
      $("#ar_chart_popup_date,#ar_chart_date").empty().html(this.getDateHTML(data, json, timeID));
      $("#ar_chart_popup_title,#ar_chart_title").empty().show().html(this.getTitleHTML(data, json));
      $("#ar_chart_popup_subtitle,#ar_chart_subtitle").empty().html(this.getSubtitleHTML(data, json));
      $(".popup_chart.upper,.tab_chart.upper").removeClass("missing");
      $(".chart_legend").show();

      if(ar.projects.getActiveScale() === "E")
         this.plotECAR(data, json);
      else
         this.plotAR(data, json);
      },

   getDateHTML: function(data, json, timeID)
      {
      var times = json[timeID];
      var startDate = ar.time.getTitleDateTimeFromUTS(1000 * times[0]);
      var endDate = ar.time.getTitleDateTimeFromUTS(1000 * times[times.length - 1]);
      return json.stn.name + ", " + startDate + " - " + endDate;
      },

   getTitleHTML: function(data, json)
      {
      if(data.model.subtitle)
         return data.model.subtitle + " from <b>" + json.model.id + " " + json.model.run + "Z</b>";
      else if(ar.projects.getActiveSubtitle())
         return ar.projects.getActiveSubtitle() + " from <b>" + json.model.id + " " + json.model.run + "Z</b>";
      else
         {
         $("#ar_chart_popup_title,#ar_chart_title").hide();
         return "";
         }
      },

   getSubtitleHTML: function(data, json)
      {
      // If you wish to remove the elevations from the plot subtitle, swap the commenting on the next two lines

      // return json.stn.name + " (" + json.stn.id + "): " + json.model.id + " " + json.model.run;

      return "<b>ID: " + json.stn.id + "</b>, <b>" + json.stn.name + "</b>: (" + json.stn.lat + "N," + (-json.stn.lon) + "W), Elev (model/actual/diff): " + Math.round(json.model.el[0]) + "/" + Math.round(json.stn.el) + "/" + Math.round(parseInt(json.model.el[0]) - parseInt(json.stn.el)) + "m";
      },

   plotECAR: function(data, json)
      {
      if(ar.projects.getActiveProductValue() === "ECAR")
         ar.layers.stations.updateStationWeighting(json.rtg);

      var subscale = ar.projects.getActiveSubscale();

      if(subscale === "S")
         this.plotECARStormTotal(data, json);
      else if(subscale === "W")
         this.plotECARWeighted(data, json);
      else
         this.plotECARRunningTotal(data, json);

      $(".chart_legend").removeClass("idf").show();
      },

   plotAR: function(data, json)
      {
      $(".popup_chart.lower,.tab_chart.lower").hide();
      $(".popup_chart.upper,.tab_chart.upper").show().addClass("single");

      var times = json.ivt_times;
      var productValue = ar.projects.getActiveProductValue();
      var stationProductValue = (productValue === "ECAR_max") ? "ECAR" : productValue;
      var IVT_threshold = ar.projects.getIVTThreshold();
      var events = json.rtg.A[IVT_threshold].e;
      var xmin = times[0];
      var xmax = times[times.length - 1];

      var options = 
         {
         plotID: "upper_popup_plot",
         containerID: "ar_chart_popup_upper_chart_container",
         seriesOptions: [{label: "IVT"}],
         series: this.createSeries(times, json.ivt),
         legend: {show: false},
         x_ticks: this.createXTicks(data.model, data.product.plots[0], json, "ivt_times"),
         xmin: xmin,
         xmax: xmax,
         canvasOverlayOptions: this.createCanvasOverlayOptions(events, "IVT", xmin, xmax),
         modelInfo: data.model,
         plotInfo: data.product.plots[0]
         };

      this.line(options);
      Object.assign(options, {plotID: "upper_plot", containerID: "ar_upper_chart_container"});
      this.line(options);
      },

   plotECARWeighted: function(data, json)
      {
      // These are double plots, so show the lower chart and resize the upper chart to provide the space

      $(".popup_chart.upper,.tab_chart.upper").show().removeClass("single");
      $(".popup_chart.lower,.tab_chart.lower").show();

      ar.layers.stations.updateStationWeighting(json.rtg);

      this.plotWeightedAR(data, json);
      this.plotWeightedST(data, json);
      },

   plotWeightedAR: function(data, json)
      {
      var times = json.ivt_times;
      var IVT_threshold = ar.projects.getIVTThreshold();
      var events = json.rtg.A[IVT_threshold].e;
      var xmin = times[0];
      var xmax = times[times.length - 1];

      var options = 
         {
         plotID: "upper_popup_plot",
         containerID: "ar_chart_popup_upper_chart_container",
         seriesOptions: [{label: "IVT"}],
         series: this.createSeries(times, json.ivt),
         legend: {show: false},
         x_ticks: this.createXTicks(data.model, data.product.plots[0], json, "ivt_times"),
         xmin: xmin,
         xmax: xmax,
         canvasOverlayOptions: this.createCanvasOverlayOptions(events, "IVT", xmin, xmax),
         modelInfo: data.model,
         plotInfo: data.product.plots[0]
         };

      this.line(options);
      Object.assign(options, {plotID: "upper_plot", containerID: "ar_upper_chart_container"});
      this.line(options);
      },

   plotWeightedST: function(data, json)
      {
      var events = json.rtg.E.W.e;
      var xmin = json.pr_times[0];
      var xmax = json.pr_times[json.pr_times.length - 1];

      var options = 
         {
         plotID: "lower_popup_plot",
         containerID: "ar_chart_popup_lower_chart_container",
         seriesOptions: [{label: "Precip"}],
         legend: {show: false},
         series: this.createSeries(json.pr_times, json.pr),
         x_ticks: this.createXTicks(data.model, data.product.plots[1], json, "pr_times"),
         xmin: xmin,
         xmax: xmax,
         canvasOverlayOptions: this.createCanvasOverlayOptions(events, "W_ST", xmin, xmax),
         modelInfo: data.model,
         plotInfo: data.product.plots[1]
         };

      this.line(options);
      Object.assign(options, {plotID: "lower_plot", containerID: "ar_lower_chart_container"});
      this.line(options);
      },

   plotECARStormTotal: function(data, json)
      {
      $(".popup_chart.lower,.tab_chart.lower").hide();
      $(".popup_chart.upper,.tab_chart.upper").show().addClass("single");

      var events = json.rtg.E.S.e;
      var xmin = json.pr_times[0];
      var xmax = json.pr_times[json.pr_times.length - 1];

      var options = 
         {
         plotID: "upper_plot",
         containerID: "ar_chart_popup_upper_chart_container",
         seriesOptions: [{label: "Precip"}],
         legend: {show: false},
         series: this.createSeries(json.pr_times, json.pr),
         x_ticks: this.createXTicks(data.model, data.product.plots[0], json, "pr_times"),
         xmin: xmin,
         xmax: xmax,
         canvasOverlayOptions: this.createCanvasOverlayOptions(events, "ECAR_ST", xmin, xmax),
         modelInfo: data.model,
         plotInfo: data.product.plots[0]
         };

      this.line(options);
      Object.assign(options, {plotID: "upper_plot", containerID: "ar_upper_chart_container"});
      this.line(options);
      },

   plotECARRunningTotal: function(data, json)
      {
      $(".popup_chart.lower,.tab_chart.lower").hide();
      $(".popup_chart.upper,.tab_chart.upper").show().addClass("single");

      var series = [];
      var seriesOptions = [];

      for(seriesID in json.rtg.E.R)
         {
         if(seriesID !== "x")
            {
            series.push(this.createSeries(json.pr_times, json.rtg.E.R[seriesID].v, false));
            seriesOptions.push({label: seriesID + "h"});
            }
         }

      for(seriesID in json.rtg.E.R)
         {
         if(seriesID !== "x")
            {
            var rtv = json.rtg.E.R[seriesID];

            if(rtv.hasOwnProperty("x") && (rtv.x.ix >= 0) && (rtv.x.ix < json.pr_times.length))
               {
               series.push(this.createSeries([json.pr_times[rtv.x.ix]], [rtv.x.v], false));
               seriesOptions.push({showLine: false, showMarker: true, label: seriesID + "h_max", showLabel: false, markerOptions: {size: 16, style: "filledCircle", color: ar.projects.getActiveColourFromIndex(rtv.x.c), shadow: true}});
               }
            }
         }

      var xmin = json.pr_times[0];
      var xmax = json.pr_times[json.pr_times.length - 1];

      var options = 
         {
         plotID: "upper_popup_plot",
         containerID: "ar_chart_popup_upper_chart_container",
         series: series,
         seriesOptions: seriesOptions,
         legend:
            {
            show: true,
            location: "nw",
            placement: "inside"
            },
         x_ticks: this.createXTicks(data.model, data.product.plots[0], json, "pr_times"),
         xmin: xmin,
         xmax: xmax,
         canvasOverlayOptions: {},
         modelInfo: data.model,
         plotInfo: data.product.plots[0]
         };

      this.line(options);
      Object.assign(options, {plotID: "upper_plot", containerID: "ar_upper_chart_container"});
      this.line(options);
      },

   createSeries: function(xarray, yarray, enclose, yScale)
      {
      var scale = (yScale || 1.0);

      if(xarray.length === yarray.length)
         {
         var result = [];
         xarray.forEach(function(x, i) { if(yarray[i] >= -1.0e-8) result.push([x, scale * yarray[i]]); });
         return (enclose !== false) ? [result] : result;
         }
      else
         {
         console.log("ar.chart.createSeries(): array lengths differ");
         return [];
         }
      },

   createXTicks: function(model, plot, json, timeID)
      {
      var times = json[timeID];
      var result = [];
      var xtick_hrs = model.xtick_hrs ? model.xtick_hrs : plot.xtick_hrs;
      var step_hrs = plot.step_hrs ? plot.step_hrs : model.step_hrs;
      var delta = Math.round(xtick_hrs / step_hrs);
      var first_hour = (new Date(1000 * times[0])).getUTCHours();
      var start = (first_hour === 0) ? 0 : Math.round((24 - first_hour) / step_hrs);

      for(var i = 0; i < times.length; i += delta)
         {
         var date = new Date(1000 * times[i]);
         var label = ar.time.days[date.getUTCDay()] + ar.time.short_months[date.getUTCMonth()] + date.getUTCDate() + "\n" + date.getUTCHours() + "Z";
         result.push([times[i], label]);
         }

      return result;
      },

   createCanvasOverlayOptions: function(events, mode, xmin, xmax)
      {
      var canvasOverlayOptions = { show: events && (events.length > 0), objects: [], afterGrid: true, tooltipLocation: "above" };

      if(events)
         {
         var missingMode = ar.projects.getMissingValueMode();
         var IVT_threshold = ar.projects.getIVTThreshold();

         events.forEach(function(e)
            {
            switch(mode)
               {
               case "IVT":
                  var ar_cat = e.c;
                  var rgba = this.toRGBA(ar.projects.getActiveColourFromIndex(ar_cat.c), 0.5);
                  var rectangle = {xmin: Math.max(e.s, xmin), xmax: Math.min(e.e, xmax), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px", color: rgba, showTooltip: true, tooltipLocation: "above", tooltipFadeSpeed: "slow"};

                  var dur = "Dur: " + ar_cat.d.toFixed(0);

                  if((ar_cat.c !== undefined) && ((ar_cat.c >= 0) || (dur > 5)))
                     {
                     var max = (ar_cat.v !== undefined) ? ("Max: " + ar_cat.v.toFixed(0) + ((ar_cat.c !== undefined) ? " [" + ar_cat.c + "]" : "")) : "";
                     Object.assign(rectangle, {tooltipFormatString: max + " " + dur, rectangleTitle: max + "\n" + dur});
                     }

                  canvasOverlayOptions.objects.push({rectangle: rectangle});
                  break;

               case "ECAR_ST":

                  if(e.c.d !== undefined)
                     {
                     var rgba = this.toRGBA(ar.projects.getActiveColourFromIndex(e.c.c), 0.5);
                     var rectangle = {xmin: Math.max(e.s, xmin), xmax: Math.min(e.e, xmax), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px", color: rgba, showTooltip: true, tooltipLocation: "above", tooltipFadeSpeed: "slow"};

                     if(e.c.d > 5.0)
                        {
                        var dur = "Dur: " + e.c.d.toFixed(1) + " hrs";
                        var tot = "Tot: " + e.c.t.toFixed(0) + " mm";
                        var rp = "RP: ";

                        if(e.c.c === "NA")
                           rp = "NA [NA]";
                        else if((parseInt(e.c.c) === 1) && (e.c.v < 3.0))
                           rp += "<3yrs,>50mm/24h [" + e.c.c + "]";
                        else if(parseInt(e.c.v) >= 10000)
                           rp += ">=PMP [" + e.c.c + "]";
                        else
                           rp += parseFloat(e.c.v).toFixed((parseFloat(e.c.v) < 10) ? 1 : 0) + " yrs [" + e.c.c + "]";

                        Object.assign(rectangle, {tooltipFormatString: dur + " " + tot + " " + rp, rectangleTitle: dur + "\n" + tot + "\n" + rp});
                        canvasOverlayOptions.objects.push({rectangle: rectangle});
                        }
                     }
                  break;

               case "W_ST":

                  if((e.c.w !== undefined) && (e.c.d !== undefined) && (e.c.t !== undefined))
                     {
                     var rgba = this.toRGBA(ar.projects.getActiveColourFromIndex(e.c.w[IVT_threshold][missingMode]), 0.5);
                     var rectangle = {xmin: Math.max(e.s, xmin), xmax: Math.min(e.e, xmax), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px", color: rgba, showTooltip: true, tooltipLocation: "above", tooltipFadeSpeed: "slow"};

                     if((e.c.d.v >= 3) && ((e.c.w[IVT_threshold][missingMode] > 0) || (e.c.d.c > 0) || (e.c.at.c > 0) || (e.c.t.c > 0)))
                        {
                        var wgt = "wtd: [" + e.c.w[IVT_threshold][missingMode] + "]";
                        var ars = (e.c.ar[IVT_threshold].d !== undefined) ? ("AR: " + e.c.ar[IVT_threshold].d.toFixed(0) + ((e.c.ar[IVT_threshold].c !== undefined) ? " [" + e.c.ar[IVT_threshold].c + "]" : "")) : "";
                        var ant = (e.c.at.v !== undefined) ? ("AT: " + e.c.at.v.toFixed(0) + ((e.c.at.c !== undefined) ? " [" + e.c.at.c + "]" : "")) : "";
                        var rp = (e.c.r.v !== undefined) ? ("RP: " + ((e.c.r.v !== "NA") ? parseFloat(e.c.r.v).toFixed((e.c.r.v < 10) ? 1 : 0) : "NA") + ((e.c.r.c !== undefined) ? " [" + e.c.r.c + "]" : "")) : "";
                        var dur = "Dur: " + e.c.d.v.toFixed(0) + " [" + e.c.d.c + "]" ;
                        var tot = (e.c.t.v !== undefined) ? ("Tot: " + e.c.t.v.toFixed(0) + ((e.c.t.c !== undefined) ? " [" + e.c.t.c + "]" : "")) : "";
                        var m1h = (e.c.m.v !== undefined) ? ("M1hPR: " + e.c.m.v.toFixed(0) + ((e.c.m.c !== undefined) ? " [" + e.c.m.c + "]" : "")) : "";
                        Object.assign(rectangle, {tooltipFormatString: [wgt, ars, dur, ant, rp, tot, m1h].join(" "), rectangleTitle: [wgt, ars, dur, ant, rp, tot].join("\n")});
                        }

                     canvasOverlayOptions.objects.push({rectangle: rectangle});
                     }

                  break;

               default:

                  break;
               }
           }, this);
         }

      return canvasOverlayOptions;
      },

   line: function(options)
      {
      $("#" + options.containerID).empty();

      this[options.plotID] = $.jqplot(options.containerID, options.series,
         {
         seriesColors: [ "#404040", "#4bb2c5", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc"],         title: ""/*{ text: options.plotInfo.subtitle, show: false, fontSize: "16px" }*/, 
         gridPadding: {top: 5, right: 10, bottom: 5, left: 45},
         grid: {backgroundColor: "transparent"},
         series: options.seriesOptions,
         seriesDefaults: { lineWidth: 1.5, breakOnNull: true, markerOptions: {size: 7} },
         highlighter:
            {
            bringSeriesToFront: false,
            show: true,
            showMarker: true,
            sizeAdjust: 7.5,
            showTooltip: true,
            tooltipContentEditor: function(str, seriesIndex, pointIndex, plot)
               {
               var date = new Date(1000 * options.series[seriesIndex][pointIndex][0]);
               var seriesValue = options.series[seriesIndex][pointIndex][1];
               return plot.series[seriesIndex].label + " (" + ar.time.days[date.getUTCDay()] + " " + ar.time.short_months[date.getUTCMonth()] + " " + date.getUTCDate() + " " + ar.zeropad(date.getUTCHours()) + "Z" + ", " + seriesValue + ")";
               }
            },
         axes:
            {
            xaxis:
               {
               labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
               tickRenderer: $.jqplot.CanvasAxisTickRenderer,
               min: options.xmin,
               max: options.xmax,
               ticks: options.x_ticks,
               tickOptions: {formatString: "%s", angle: 30, fontSize: "1em", showLabel: true}
               },

            yaxis:
               {
               label: options.plotInfo.yLabel ? options.plotInfo.yLabel : options.modelInfo.yLabel,
               fontSize: "1.1em",
               width: "36px",
               min: 0,
               labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
               tickRenderer: $.jqplot.CanvasAxisTickRenderer,
               tickOptions: {angle: 0, fontSize: "14px"}
               }
            },

         legend: options.legend,

         canvasOverlay: options.canvasOverlayOptions
         });

      $("#" + options.containerID).find("jqplot-title").css({position: "relative !important"});
      },

   update: function(data)
      {
      this.show(data);
      return this;
      },

   tabChanged: function(tabID)
      {
      if((tabID === "ar_map_tab") && (this.popupVisible === true))
         $("#ar_chart_popup").show();
      else
         $("#ar_chart_popup").hide();

      if($("#ar_chart_popup").is(":visible"))
         {
         if(this.upper_popup_plot && $("#ar_chart_popup_upper_chart_container").is(":visible"))
            this.upper_popup_plot.replot();

         if(this.lower_popup_plot && $("#ar_chart_popup_lower_chart_container").is(":visible"))
            this.lower_popup_plot.replot();
         }
      else if(tabID === "ar_plot_tab")
         {
         if(this.upper_plot && $("#ar_upper_chart_container").is(":visible"))
            this.upper_plot.replot();

         if(this.lower_plot && $("#ar_lower_chart_container").is(":visible"))
            this.lower_plot.replot();
         }

      $(".vw_camera").show();
      },

   toRGBA: function(colour, opacity)
      {
      colour = ((colour!== undefined) ? colour : "rgba(0,0,0,0)").trim();
      opacity = (opacity !== undefined) ? opacity : 0.5;

      if(colour.indexOf("rgba") >= 0)
         return colour;
      else if(colour.indexOf("rgb(") >= 0)
         return colour.substr(0, colour.indexOf(")")) + "," + opacity.toFixed(2);
      else if(colour[0] === "#")
         {
         var red = parseInt(colour.substr(1, 2), 16);
         var green = parseInt(colour.substr(3, 2), 16);
         var blue = parseInt(colour.substr(5, 2), 16);
         return "rgba(" + red + "," + green + "," + blue + "," + opacity.toFixed(2) + ")";
         }
      else
         return "rgba(0,0,0,0)";
      },

   popupIsVisible: function()
      {
      return this.popupVisible;
      }
   }

//-------------------------------------------------------------------------------------------------

$.fn.jqplotSaveImage = function()
   {
   var imgData = $(this).jqplotToImageStr({});

   if(imgData)
      window.location.href = imgData.replace("image/png", "image/octet-stream");
   };
