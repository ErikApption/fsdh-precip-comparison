//-------------------------------------------------------------------------------------------------

ar.project = function(data)
   {
   $.extend(this, data);

   this.active = 0;
   this.modelID = "";
   this.productValue = "";
   this.runValue = "";
   this.timestamp = "";
   this.model = this.models[this.modelIndex];
   this.colormap = ar.colormap.create(this.colormap_categories);
   delete this.colormap_categories;

  // $("#ar_project_select").append($("<option></option>").val(this.id).text(this.label));

   ar.projects[this.id] = this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.create = function(data)
   {
   return this.call(Object.create(this.prototype), data);
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.activate = function(update)
   {
   this.active = true;
   this.model = this.models[this.getModelIndex(ar.projects.getActiveModelID())];

   this.updateModelSelect().updateProductSelect();

   this.product = this.model.products[this.getProductIndex()];
   $("#ar_title_container").html(this.title);
   $(".ar_guide_content").hide();
   $("#ar_guide_" + this.id).show();
   $("#ar_mrp_fieldset,#vw_animation_fieldset").show();

   if(update !== false)
      this.updateRunSelect();
   else
      {
      $("#ar_model_select").trigger("change");
      $("#ar_product_select").trigger("change");
      }

   ar.legend.show().update(this.legend);

   $(".chart_legend").removeClass("ar idf");

   if(this.legend.classID)
      $(".chart_legend").addClass(this.legend.classID);

   vw.time_controls.setMaxValue(Math.max(48, this.model.duration_hours));
   ar.layers.projectChanged(this);
   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.deactivate = function()
   {
   this.active = false;
   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.setModelValue = function(modelID, update)
   {
   this.modelID = modelID;
   this.model = this.models[this.getModelIndex(modelID)];
   this.updateProductSelect();

   $("#ar_product_select").trigger("change");

   if(update !== false)
      this.updateRunSelect();

   vw.time_controls.setMaxValue(Math.max(48, this.model.duration_hours));

   ar.legend.updateModelLegend(this.model.label, this.getRunTimestamp());

   ar.layers.modelChanged(this.model);

   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getModelID = function()
   {
   return this.model ? this.model.id : "";
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getModel = function()
   {
   return this.model;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.setProductValue = function(value, refresh)
   {
   this.productValue = value;
   this.product = this.model.products[this.getProductIndex()];

   ar.layers.stations.updateStationPoints(this.shortID, $.isNumeric(this.productValue) ? parseInt(this.productValue) : this.productValue);

   if(refresh !== false)
      this.refresh();

   $("#ar_product_title_text").html("<span style=\"color: red; font-size: 18px;\">Experimental </span>" + this.product.title);
   $("#ar_product_subtitle_text").html(this.product.subtitle);

   if(this.productValue === "ECAR_W")
      $("#ar_weighting_fieldset").show();
   else
      $("#ar_weighting_fieldset").hide();

   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getScale = function()
   {
   return this.scale;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getSubscale = function()
   {
   return this.subscale;
   }

//-------------------------------------------------------------------------------------------------

ar.project.getUsesIVTThreshold = function()
   {
   return this.usesIVTThreshold;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getProduct = function()
   {
   return this.product;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getProductValue = function()
   {
   return $.isNumeric(this.productValue) ? parseInt(this.productValue) : this.productValue;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.setRunValue = function(value)
   {
   this.runValue = value;
   ar.legend.updateModelLegend(this.model.label, value);
   this.refresh();
   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getRunTimestamp = function()
   {
   return this.runValue;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.updateModelSelect = function()
   {
   $("#ar_model_select").empty();
   //this.models.forEach(function(m) { $("#ar_model_select").append($("<option></option>").val(m.id).text(m.label).data(m.products)); });
   $("#ar_model_select").append($("<option>2023040612</option>"));

   if($("#ar_model_select").find("option").length < 2)
      $("#ar_model_select").addClass("inactive").prop("disabled", true);
   else
      $("#ar_model_select").removeClass("inactive").prop("disabled", false);

   $("#ar_model_select").prop("selectedIndex", this.getModelIndex(ar.projects.getActiveModelID()));

   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.updateProductSelect = function()
   {
   $("#ar_product_select").empty();

   this.model.products.forEach(function(p) { $("#ar_product_select").append($("<option></option>").val(p.value).text(p.label));});

   $("#ar_product_select").prop("selectedIndex", this.getProductIndex());

   if($("#ar_product_select").find("option").length < 2)
      $("#ar_product_select").addClass("inactive").prop("disabled", true);
   else
      $("#ar_product_select").removeClass("inactive").prop("disabled", false);

   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getDateIndex = function()
   {
   return Math.max(0, $("#pr_date_select").map(function(i,e) { return $(e).val(); }).toArray().indexOf(this.runValue)); 
   }


//-------------------------------------------------------------------------------------------------

ar.project.prototype.updateRunSelect = function()
   {
   $("#pr_date_select").empty();

   var basedir = this.getBaseURL();
   console.log("ar.project.prototype.updateRunSelect - basedir = " + basedir); // Nhi

   // re-populate the time select from directories available in the images/ directory
/*
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
            stamps.sort().reverse().forEach(function(ts) { $("#pr_date_select").append($("<option></option>").text(ts).val(ts)); });
            $("#pr_date_select").prop("selectedIndex", this.getRunIndex()).trigger("change");
            }
         else
            alert("No model times found; nothing to display");
         },
      error: function(obj, text)
         {
         alert("error " + text);
         }
      });
*/
   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getModelIndex = function(modelID)
   {
   var result = 0;
   this.models.forEach(function(m, i) { if(m.id === modelID) result = i; });
   return result;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getProductIndex = function()
   {
   return Math.max(0, $("#ar_product_select option").map(function(i,e) { return $(e).val(); }).toArray().indexOf(this.productValue)); 
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getRunIndex = function()
   {
   //return Math.max(0, $("#ar_run_select option").map(function(i,e) { return $(e).val(); }).toArray().indexOf(this.runValue)); 
   return Math.max(0, $("#pr_date_select option").map(function(i,e) { return $(e).val(); }).toArray().indexOf(this.runValue)); 
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.refresh = function()
   {
   ar.layers.stations.refresh();
   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.loadData = function()
   {
   $("#ar_run_select").empty();
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getCategories = function()
   {
   return this.colormap.getCategories();
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getCategory = function(colour)
   {
   return this.colormap.getCategory(colour);
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getShortCategory = function(colour)
   {
   return this.colormap.getShortCategory(colour);
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getColourIndex = function(colour)
   {
   return this.colormap.getColourIndex(colour);
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getColour = function(category)
   {
   return this.colormap.getColour(category);
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getColourFromIndex = function(index)
   {
   return this.colormap.getColourFromIndex(index);
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getBaseURL = function()
   {
   return "geojson/pc/" + (this.subdir ? this.subdir : "");//"data/" + this.model.directory + "/" + (this.subdir ? this.subdir : "");
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getModelDuration = function()
   {
   return this.model.duration_hours;
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getTitle = function()
   {
   return "";
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getStationGeoJSONURL = function()
   {
   var ts = ar.time.getFileTimestamp();
//    return (ts ? "data/" + this.model.directory + "/" + ts + "/" + (this.model.subdir ? this.model.subdir : "") + "geojson/" + ts + ".geojson" : "");
   return (ts ? "data/" + this.model.directory + "/" + ts + "/" + "geojson/" + ts + ".geojson" : "");
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getImageURL = function(filename)
   {
   return "data/" + this.model.directory + "/" + ar.time.getFileTimestamp() + "/json/" + ar.time.getFileTimestamp() + ".json";
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getJSONURL = function(stationID)
   {
   return "data/" + this.model.directory + "/" + ar.time.getFileTimestamp() + "/" + (this.model.subdir ? this.model.subdir : "") + "json/" + stationID + ".json";
   }

//-------------------------------------------------------------------------------------------------

ar.project.prototype.getSubtitle = function()
   {
   return this.subtitle;
   }

//-------------------------------------------------------------------------------------------------
