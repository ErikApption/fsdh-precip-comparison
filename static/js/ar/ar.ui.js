// This website merges four AR websites as requested by Mindy Brugman

// Brian Crenna Brian.Crenna@canada.ca/greendog.pizza@gmail.com
// latest update 2021 10 17 Su

//-------------------------------------------------------------------------------------------------

ar.ui =
   {
   initialize: function()
      {
      $("#ar_at_span").hide();

      this.initializeTabs().initializeButtons().initializeControls().initializeWeightingSliders()/*.initializeSelects()*/;
      },

   initializeTabs: function()
      {
      this.$tabs = $("#ar_tabs").tabs({heightStyle: "fill", activate: function(e, ui)
         {
         switch(ui.newPanel.prop("id"))
            {
            case "ar_map_tab":
               ar.map.invalidateSize();
               $("#ar_mode_container").addClass("map").appendTo("#ar_map_controls").show();
               break;
            case "ar_text_tab":
               $("#ar_mode_container").hide();
               $("#prov_button_container").appendTo("#ar_text_tab");
               break;
            case "ar_table_tab":
               $("#ar_mode_container").removeClass("map").appendTo("body").show();
               $("#prov_button_container").appendTo("#ar_table_tab");
               break;
            default:
               break;
            }

         ar.layers.tabChanged(ui.newPanel.prop("id"));
         }});

      return this;
      },

   initializeButtons: function()
      {
      $(".toggle").on("mousedown", function(e) { $(this).toggleClass("down"); });

      $(".radio").on("mousedown", function(e)
         {
         if(!e.ctrlKey || ($(this).parent().prop("id") !== "prov_button_container") || $(this).siblings().first().hasClass("down"))
            $(this).siblings().removeClass("down");

         if(e.ctrlKey && $(this).hasClass("down") && ($(this).parent().prop("id") === "prov_button_container") && ($(this).parent().find(".down").length > 1))
             $(this).removeClass("down");
         else
            $(this).addClass("down");
         });

      $("#vw_control_show_hide").on("mousedown", function()
         {
         $(this).hide();

         if($("#vw_control_div").is(":visible"))
            {
            $("#vw_layer_div,#vw_map_container,#vw_status_bar").addClass("leftmost", 600);
            $("#vw_control_div").hide("slide", {direction: "left", complete: function() { $("#vw_control_show_hide").show().appendTo("body").addClass("controls_hidden").prop("title", "Show controls").html("&#9658;"); ar.map.invalidateSize(); }}, 600);
            ar.legend.slide("left");
            }
         else
            {
            $("#vw_layer_div,#vw_map_container,#vw_status_bar").removeClass("leftmost", 600);
            $("#vw_control_div").show("slide", {direction: "left", complete: function() { $("#vw_control_show_hide").show().appendTo("#vw_control_div").removeClass("controls_hidden").prop("title", "Hide controls").html("&#9664;"); ar.map.invalidateSize(); }}, 600);
            ar.legend.slide("right");
            }
         });

      return this;
      },

   initializeControls: function()
      {
      $("#vw_map_camera").on("mousedown", function(e) { if(e.which === 1) ar.ui.saveMapImage(); });
      return this;
      },

   initializeWeightingSliders: function()
      {
      $("#ar_weighting_fieldset").hide().find(".ar_weighting_slider").each(function(i, e)
         {
         var id = $(e).prop("id").replace("ar_", "").replace("_slider", "");
         $("#ar_" + id + "_weight").text(ar.config.constants.weighting[id]);

         $(e).slider({min: 0, max: 10, step: 1, value: ar.config.constants.weighting[id], slide: function(e, ui)
            {
            var id = $(e.target).prop("id").replace("ar_", "").replace("_slider", "");

            if(ar.layers.stations.getWeightingTotal(id, ui.value) === 0)
               return false;
            else
               {
               $("#ar_" + id + "_weight").text(ui.value);
               ar.layers.stations.resetGeoJSON();
               }
            }});
         });

      $("#ar_weighting_default").on("mousedown", function()
         {
         $("#ar_weighting_fieldset").find(".ar_weighting_slider").each(function(i, e)
            {
            var id = $(e).prop("id").replace("ar_", "").replace("_slider", "");
            $("#ar_" + id + "_weight").text(ar.config.constants.weighting[id]);
            $(e).slider("option", "value", ar.config.constants.weighting[id]);
            ar.layers.stations.resetGeoJSON();
            });
         });

      return this;
      },
/*      
   initializeDateSelect: function()
      {
      $("#pr_date_select").empty();
      var basedir = "geojson/pc";
      
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
               ar.projects.dateSel = defautSelectedDate; console.log("loadDateSelection dateSel = " + ar.projects.dateSel);
               }
            else
               alert("No model times found; nothing to display");
            }, // success
         error: function(obj, text)
            {
            alert("error " + text);
            }
         }); // ajax
      }, // initializeDateSelect

   initializeSelects: function()
      {
//       $("#ar_project_select").empty().on("change", function() { ar.projects.setActiveProject($(this).val()); ar.ui.updateModelSelect(); });
    //  ar.projects.getProjects().forEach(function(p) { $("#ar_project_select").append($("<option></option>").prop("label", p.label).val(p.id)); });
  //  $("#ar_project_select").append($("<option></option>").prop("label", p.label).val(p.id));
      return this;
      },

   updateModelSelect: function()
      {
//       $("#ar_model_select").empty().off("change").on("change", function() { ar.projects.setActiveModel($(this).val()); ar.ui.updateProductSelect().updateRunSelect(); });
 //     ar.projects.getActiveModels().forEach(function(m) { $("#ar_model_select").append($("<option></option>").prop("label", m.label).val(m.id)); });
      
      },

   updateProductSelect: function()
      {
      $("#ar_product_select").empty().off("change").on("change", function() { ar.project.setActiveProduct($(this).val()); });
      ar.projects.getActiveProducts().forEach(function(p) { $("#ar_product_select").append($("<option></option>").prop("label", p.label).val(p.id)); });
      },

   updateRunSelect: function()
      {
       $("#ar_run_select").empty().off("change").on("change", function() { ar.project.setActiveRun($(this).val()); });

      var basedir = "geojson/pc/";//"data/" + ar.projects.getActiveModelID() + "/";

      // re-populate the time select from directories available in the images/ directory

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
            return (a.innerHTML.trim().indexOf("2") === 0) && (a.innerHTML.trim().indexOf("/") > -1); 
            }).map(function(a) { var x = a.innerHTML.trim(); return x.substr(0, x.indexOf("/")); });

            if(stamps.length > 0)
               {
               stamps.sort().reverse().forEach(function(ts) { $("#ar_run_select").append($("<option></option>").text(ts).val(ts)); });
               $("#ar_run_select").prop("selectedIndex", ar.projects.getActiveProject().getActiveModel().getRunIndex()).trigger("change");
               }
            else
               alert("No model times found; nothing to display");
            },
         error: function(obj, text)
            {
            alert("error " + text);
            }
         });

      return this;
      },
*/
   save: function()
      {
      window.localStorage.setItem("ar_open_tab", this.$tabs.tabs("option", "active"));
      },

   load: function()
      { 
      if(window.localStorage.getItem("ar_open_tab"))
         this.$tabs.tabs("option", "active", window.localStorage.getItem("ar_open_tab"));
      },

   saveMapImage: function()
      {
      $("#vw_map_container").addClass("copying").appendTo("body");
      var $div = $("<div></div>").addClass("watermark dark").appendTo("#vw_map_container");
      var node = document.getElementById("vw_map_container");
      // need to use ["catch"] instead of .catch to avoid error with minifier
      domtoimage.toBlob(node).then(function (blob) { $("#vw_map_container").removeClass("copying").appendTo("#ar_map_tab_content"); window.saveAs(blob, ar.projects.getActiveImageFilename()); $div.remove(); })["catch"](function (error) { $("#vw_map_container").removeClass("copying").appendTo("#ar_map_tab_content"); $div.remove(); alert("Unable to save map image."); });
      },
/*
   savePopupChartImage: function(stationName)
      {
      var node = document.getElementById("ar_chart_popup_contents");
      // need to use ["catch"] instead of .catch to avoid error with minifier
      domtoimage.toBlob(node).then(function (blob) { window.saveAs(blob, ar.projects.getActiveImageFilename(stationName)); })["catch"](function (error) { alert("Unable to save plot image."); });
      },

   saveChartImage: function(img, stationName)
      {
      var node = document.getElementById("ar_chart_inner_container");
      // need to use ["catch"] instead of .catch to avoid error with minifier
      domtoimage.toBlob(node).then(function (blob) { window.saveAs(blob, ar.projects.getActiveImageFilename(stationName)); })["catch"](function (error) { alert("Unable to save plot image."); });
      } */
   }
   
//-------------------------------------------------------------------------------------------------
