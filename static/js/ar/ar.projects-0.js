//-------------------------------------------------------------------------------------------------

ar.projects = 
   {
   active: null,
   activeModelID: "",
   IVT_threshold: 250,
   missingValueMode: "a",
   values:
      [
      {
      id: "ecar_scale_storm_total",
      scale: "E",
      subscale: "S",
      label: "ECAR scale (storm total)",
      title: "Extratropical Cyclone - Atmospheric River (ECAR) Scale (Storm total)",
      subtitle: "ECAR rating based on storm total precipitation return period",
      usesIVTThreshold: false,

      colormap_categories:
         {
         "#FFFFFF": {l: "Missing data", s: "NA", i: -1, ar_class: "missing_data"},
         "#808080": {l: "Non-AR", s: "0", i: 0, ar_class: "non_ar"},
         "#02BDFD": {l: "Weak", s: "1", i:1, ar_class: "weak"},
         "#00FD00": {l: "Moderate", s: "2", i: 2, ar_class: "moderate"},
         "#FAFD00": {l: "Strong", s: "3", i: 3, ar_class: "strong"},
         "#FEA500": {l: "Extreme", s: "4", i: 4, ar_class: "extreme"},
         "#FE0000": {l: "SuperStorm", s: "5", i: 5, ar_class: "superstorm"},
         "#FF00FF": {l: "ARkStorm", s: "6", i: 6, ar_class: "arkstorm"},
         "#800080": {l: "PMP Storm", s: "7", i: 7, ar_class: "pmpstorm"},
         "#400080": {l: "ARkSuperStorm", s: "8", i: 8, ar_class: "arksuperstorm"}
         },

      models:
         [
         {
         id: "gdps",
         directory: "gdps",
         label: "GDPS 15km",
         yLabel: "Precipitation (mm/3hr)",
         duration_hours: 240,
         step_hrs: 3,
         xtick_hrs: 24,
         products:
            [
            {
            value: "ECAR_S",
            label: "ECAR S",
            title: "ECAR S",
            subtitle: "Storm Total Based Rating",
            plots:[{ key: "pr"}]
            }
            ]
         },
         {
         id: "rdps",
         directory: "rdps",
         label: "RDPS 10km",
         yLabel: "Precipitation (mm/3hr)",
         duration_hours: 84,
         step_hrs: 3,
         xtick_hrs: 6,
         products:
            [
            {
            value: "ECAR_S",
            label: "ECAR S",
            title: "ECAR_S",
            subtitle: "Storm Total Based Rating",
            plots:[{ key: "pr"}]
            }
            ]
         },
         {
         id: "hrdps",
         directory: "hrdps",
         label: "HRDPS 2.5km",
         yLabel: "Precipitation (mm/hr)",
         duration_hours: 48,
         step_hrs: 1,
         xtick_hrs: 6,
         products:
            [
            {
            value: "ECAR_S",
            label: "ECAR S",
            title: "ECAR_S",
            subtitle: "Storm Total Based Rating",
            plots: [ { key: "pr"} ]
            }
            ]
         }
         ],
      legend:
         {
         title: "ECAR Storm Total",
         width: "200px",
         height: "300px",
         lis:
            [
            {ar_class: "arksuperstorm", label: "8: ARkSuperStorm (6x100y, &ge;7d)", title: "worst estimated, >= (+3C) GW PMP or 6 x 100 yr RP, >=7 days"},
            {ar_class: "pmpstorm", label: "7: PMPStorm (3x100y, 5-7d)", title: "worst expected historically, >=PMP or 3 x 100 yr RP, 5-7 days"},
            {ar_class: "arkstorm", label: "6: ARkStorm (300-1000y, 3-5d)", title: "300 to 1000 yr RP, 3-5 days"},
            {ar_class: "superstorm", label: "5: SuperStorm (100-300y, 1-3d)", title: "100 to 300 yr RP storms, 2-3 days, or  CW3E 'exceptional' 1-3 days"},
            {ar_class: "extreme", label: "4: Extreme (30-100y, 1-3d)", title: "30 to 100 yr RP storms, 1 to 3 days"},
            {ar_class: "strong", label: "3: Strong (10-30y, 1-3d)", title: "10 to 30 yr RP storms, 1 to 3 days"},
            {ar_class: "moderate", label: "2: Moderate (3-10y, 1-3d)", title: "3 to 10 yr RP storms, 1 to 3 days"},
            {ar_class: "weak", label: "1: Weak (&lt;3y, 1-2d)", title: "less than 3 yr RP storms, 1 to 2 days"},
            {ar_class: "non_ar", label: "0: Non-AR (&lt;3y, &lt; 50mm/24h)", title: "less than 3 yr RP storms, below 50mm/24h"},
            {ar_class: "missing_data", label: "Missing Data", title: "Missing data"}
            ]
         }
      },

      {
      id: "ar_scale",
      scale: "A",
      subscale: "",
      label: "AR scale (CW3E/Scripps)",
      title: "Atmospheric River (AR) Scale (CW3E/Scripps)",
      subtitle: "AR (CW3E/Scripps) rating based on IVT strength and duration",
      usesIVTThreshold: true,

      colormap_categories:
         {
         "#FFFFFF": {l: "Missing data", s: "NA", i:-1, ar_class: "missing_data"},
         "#808080": {l: "Non-AR", s: "0", i: 0, ar_class: "non_ar"},
         "#02BDFD": {l: "Weak", s: "1", i:1, ar_class: "weak"},
         "#00FD00": {l: "Moderate", s: "2", i: 2, ar_class: "moderate"},
         "#FAFD00": {l: "Strong", s: "3", i: 3, ar_class: "strong"},
         "#FEA500": {l: "Extreme", s: "4", i: 4, ar_class: "extreme"},
         "#FE0000": {l: "Exceptional", s: "5", i: 5, ar_class: "exceptional"}
         },

      base_directory: "",
      target_directory: "",
      models:
         [
         {
         id: "gdps",
         directory: "gdps",
         label: "GDPS 15km",
         duration_hours: 240,
         step_hrs: 6,
         xtick_hrs: 24,
         products:
            [
            {
            value: "AR",
            label: "AR (CW3E/Scripps)",
            title: "AR Scale",
            subtitle: "Storm IVT and Duration Rating",
            plots:
               [
               { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"}
               ]
            }
            ]
         },
         {
         id: "rdps",
         directory: "rdps",
         label: "RDPS",
         duration_hours: 84,
         step_hrs: 6,
         xtick_hrs: 12,
         products:
            [
            {
            value: "AR",
            label: "AR (CW3E/Scripps)",
            title: "AR Scale",
            subtitle: "Storm IVT and Duration Rating",
            plots: [ { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"} ]
            }
            ]
         },
         {
         id: "hrdps",
         directory: "hrdps",
         label: "HRDPS 2.5km",
         duration_hours: 48,
         step_hrs: 3,
         xtick_hrs: 6,
         products:
            [
            {
            value: "AR",
            label: "AR (CW3E/Scripps)",
            title: "AR (CW3E/Scripps)",
            subtitle: "Storm IVT and Duration Rating",
            plots: [ { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"} ]
            }
            ]
         }
         ],
      legend:
         {
         width: 234,
         height: 234,
         image: "css/images/ar_scale_legend.png",
         classID: "ar"
         }
      },

      {
      id: "ecar_scale_weighted",
      scale: "E",
      subscale: "W",
      label: "ECAR scale (weighted)",
      title: "Extratropical Cyclone - Atmospheric River (ECAR) Scale (Weighted)",
      subtitle: "ECAR rating based on weighted variables",
      usesIVTThreshold: true,

      colormap_categories:
         {
         "#FFFFFF": {l: "Missing data", s: "NA", i:-1, ar_class: "missing_data"},
         "#808080": {l: "Non-AR", s: "0", i: 0, ar_class: "non_ar"},
         "#02BDFD": {l: "Weak", s: "1", i:1, ar_class: "weak"},
         "#00FD00": {l: "Moderate", s: "2", i: 2, ar_class: "moderate"},
         "#FAFD00": {l: "Strong", s: "3", i: 3, ar_class: "strong"},
         "#FEA500": {l: "Extreme", s: "4", i: 4, ar_class: "extreme"},
         "#FE0000": {l: "SuperStorm", s: "5", i: 5, ar_class: "superstorm"},
         "#FF00FF": {l: "ARkStorm", s: "6", i: 6, ar_class: "arkstorm"},
         "#800080": {l: "PMP Storm", s: "7", i: 7, ar_class: "pmpstorm"},
         "#400080": {l: "ARkSuperStorm", s: "8", i: 8, ar_class: "arksuperstorm"}
         },

      base_directory: "",
      target_directory: "",
      models:
         [
         {
         id: "gdps",
         directory: "gdps",
         label: "GDPS 15km",
         duration_hours: 240,
         step_hrs: 6,
         xtick_hrs: 24,
         products:
            [
            {
            value: "ECAR_W",
            label: "ECAR_W",
            title: "ECAR_W",
            subtitle: "Weighted Variable Storm Rating",
            plots:
               [
               { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"},
               { yLabel: "Precip (mm/3h)", key: "pr", subtitle: "GDPS ECAR rating based on storm total precipitation return period"}
               ]
            },
            {
            value: "ECAR_max",
            label: "ECAR_max",
            title: "ECAR_max",
            subtitle: "Max. weighted variable rating",
            plots:
               [
               { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"},
               { yLabel: "Precip (mm/3h)", key: "pr", subtitle: "GDPS ECAR Rating Based on Storm Total Precipitation Return Period"}
               ]
            }
            ]
         },
         {
         id: "rdps",
         directory: "rdps",
         label: "RDPS",
         duration_hours: 84,
         step_hrs: 6,
         xtick_hrs: 12,
         products:
            [
            {
            value: "ECAR_W",
            label: "ECAR_W",
            title: "ECAR_W",
            subtitle: "Weighted Variable Storm Rating",
            plots:
               [
               { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"},
               { yLabel: "Precip (mm/3h)", key: "pr", subtitle: "GDPS ECAR rating based on storm total precipitation return period"}
               ]
            },
            {
            value: "ECAR_max",
            label: "ECAR_max",
            title: "ECAR_max",
            subtitle: "Max. weighted variable rating",
            plots:
               [
               { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"},
               { yLabel: "Precip (mm/3h)", key: "pr", subtitle: "GDPS ECAR Rating Based on Storm Total Precipitation Return Period"}
               ]
            }
            ]
         },
         {
         id: "hrdps",
         directory: "hrdps",
         label: "HRDPS 2.5km",
         duration_hours: 48,
         step_hrs: 3,
         xtick_hrs: 6,
         products:
            [
            {
            value: "ECAR_W",
            label: "ECAR_W",
            title: "ECAR_W",
            subtitle: "Weighted Variable Storm Rating",
            plots:
               [
               { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"},
               { yLabel: "Precip (mm/h)", key: "pr", subtitle: "HRDPS ECAR Rating Based on Storm Total Precipitation Return Period"}
               ]
            },
            {
            value: "ECAR_max",
            label: "ECAR_max",
            title: "ECAR_max",
            subtitle: "Max. weighted variable rating",
            plots:
               [
               { yLabel: "IVT (kg m\u207B\u00B9 s\u207B\u00B9)", key: "ivt"},
               { yLabel: "Precip (mm/h)", key: "pr", subtitle: "HRDPS ECAR Rating Based on Storm Total Precipitation Return Period"}
               ]
            }
            ]
         }
         ],
      legend:
         {
         title: "Max ECAR Scale",
         width: "200px",
         height: "200px",
         lis:
            [
            {ar_class: "arksuperstorm", label: "8: ARkSuperStorm (6x100y, &ge;7d)", title: "worst estimated, >= (+3C) GW PMP or 6 x 100 yr RP, >=7 days"},
            {ar_class: "pmpstorm", label: "7: PMPStorm (3x100y, 5-7d)", title: "worst expected historically, >=PMP or 3 x 100 yr RP, 5-7 days"},
            {ar_class: "arkstorm", label: "6: ARkStorm (300-1000y, 3-5d)", title: "300 to 1000 yr RP, 3-5 days"},
            {ar_class: "superstorm", label: "5: SuperStorm (100-300y, 1-3d)", title: "100 to 300 yr RP storms, 2-3 days, or  CW3E 'exceptional' 1-3 days"},
            {ar_class: "extreme", label: "4: Extreme (30-100y, 1-3d)", title: "30 to 100 yr RP storms, 1 to 3 days"},
            {ar_class: "strong", label: "3: Strong (10-30y, 1-3d)", title: "10 to 30 yr RP storms, 1 to 3 days"},
            {ar_class: "moderate", label: "2: Moderate (3-10y, 1-3d)", title: "3 to 10 yr RP storms, 1 to 3 days"},
            {ar_class: "weak", label: "1: Weak (&lt;3y, 1-2d)", title: "less than 3 yr RP storms, 1 to 2 days"},
            {ar_class: "non_ar", label: "0: Non-AR (&lt;3y, &lt; 50mm/24h)", title: "less than 3 yr RP storms, below 50mm/24h"},
            {ar_class: "missing_data", label: "Missing Data", title: "Missing data"}
            ]
         }
      },

      {
      id: "total_precip_return",
      scale: "E",
      subscale: "R",
      label: "ECAR total precip return periods",
      title: "ECAR total Precipitation Return Periods for Different Durations",
      subtitle: "Precipitation Running Totals and Return Periods (1hr, 6hrs, 12hrs, 24hrs, 48hrs)",

      colormap_categories: {"#FFFFFF": {l: "missing", s: "missing", i: -1}, "#808080": {l: "non-AR", s: "non-AR", i: 0}, "#02BDFD": {l: "&lt; 3 yrs", s: "&lt; 3, &ge; 50mm/24h", i: 1},"#00FD00": {l: "[3-10) yrs", s: "[3-10)", i: 2}, "#FAFD00": {l: "[10-30) yrs", s: "[10-30)", i: 3}, "#FEA500": {l: "[30-100) yrs", s: "[30-100)", i: 4}, "#FE0000": {l: "[100-300)", s: "[100-300)", i: 5}, "#FF00FF": {l: "[300-1000) yrs", s: "[300-1000)", i: 6}, "#800080": {l: "&gt; 1000", s: "&gt; 1000", i: 7},"#400080": {l: "ARkSuperStorm", s: "ARkSuperStorm", i: 8}},

      models:
         [
         {
         id: "gdps",
         directory: "gdps",
         label: "GDPS 15km",
         yLabel: "precipitation amounts (mm)",
         duration_hours: 240,
         step_hrs: 3,
         xtick_hrs: 24,
         products:
            [
            {
            value: "x",
            label: "IDF max",
            title: "ECAR_IDF",
            subtitle: "Max. Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 6,
            label: "IDF 06hr",
            title: "ECAR_IDF", 
            subtitle: "6hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 12,
            label: "IDF 12hr",
            title: "ECAR_IDF",
            subtitle: "12hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 24,
            label: "IDF 24hr",
            title: "ECAR_IDF",
            subtitle: "24hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 48,
            label: "IDF 48hr",
            title: "ECAR_IDF",
            subtitle: "48hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            }
            ]
         },
         {
         id: "rdps",
         directory: "rdps",
         label: "RDPS 10km",
         yLabel: "precipitation amounts (mm)",
         duration_hours: 84,
         step_hrs: 3,
         xtick_hrs: 6,
         products:
            [
            {
            value: "x", 
            label: "IDF max", 
            title: "ECAR_IDF",
            subtitle: "Max. Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 6, 
            label: "IDF 06hr", 
            title: "ECAR_IDF",
            subtitle: "6hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 12,
            label: "IDF 12hr",
            title: "ECAR_IDF",
            subtitle: "12hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 24,
            label: "IDF 24hr",
            title: "ECAR_IDF",
            subtitle: "24hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 48,
            label: "IDF 48hr",
            title: "ECAR_IDF",
            subtitle: "48hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            }
            ]
         },
         {
         id: "hrdps",
         directory: "hrdps",
         label: "HRDPS 2.5km",
         yLabel: "precipitation amounts (mm)",
         duration_hours: 48,
         step_hrs: 1,
         xtick_hrs: 6,
         products:
            [
            {
            value: "x",
            label: "IDF max",
            title: "ECAR_IDF", 
            subtitle: "Max. Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 1,
            label: "IDF 01hr",
            title: "ECAR_IDF",
            subtitle: "1hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 6,
            label: "IDF 06hr",
            title: "ECAR_IDF<br>6hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 12,
            label: "IDF 12hr",
            title: "ECAR_IDF<br>12hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 24,
            label: "IDF 24hr",
            title: "ECAR_IDF", 
            subtitle: "24hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            },
            {
            value: 48,
            label: "IDF 48hr",
            title: "ECAR_IDF", 
            subtitle: "48hr Total Precip RP Rating",
            plots:
               [
               { key: "pr"}
               ]
            }
            ]
         }
         ],
      legend:
         {
         title: "ECAR Return Period",
         width: "230px",
         height: "300px",
         lis:
            [ 
	         {ar_class: "rpPMPSS", label: "ARkSuperStorm (6x100y)"},
            {ar_class: "rpPMPS", label: "PMPStorm (3x 100y)"},
            {ar_class: "rp300", label: "ARkStorm: [300-1000y)"},
            {ar_class: "rp100", label: "SuperStorm: [100-300y)"},
            {ar_class: "rp30", label: "Extreme: [30-100y)"},
            {ar_class: "rp10", label: "Strong: [10-30y)"},
            {ar_class: "rp3", label: "Moderate: [3-10y)"},
            {ar_class: "rpweak", label: "Weak: &lt; 3y, &ge; 50mm/24h"},
            {ar_class: "rp0", label: "&lt; 3y"},
            {ar_class: "rpna", label: "Missing data"}
            ],
         classID: "idf"
         }
      }
      ],

   initialize: function()
      {
      this.values.forEach(function(value) { ar.project.create(value); }, this);
      $("#ar_run_select").on("change", function() { ar.popup.hide(); vw.time_controls.setTimestamp($(this).val()); });
      $("#ar_product_select").on("change", function() { ar.projects.active.setProductValue($(this).val(), true); });
      $("#ar_model_select").on("change", function() { ar.projects.setModelValue($(this).val(), true); });
      $("#ar_project_select").on("change", function(e) { ar.projects.activate($(this).val(), true); $("#ar_product_select").trigger("change"); });
      $("#ar_ivt_mode_fieldset").find(".ivt_mode").on("mousedown", function() { var id = $(this).prop("id"); ar.projects.setIVTThreshold(parseInt(id.substr(id.lastIndexOf("_") + 1))); });
      $("#ar_missing_mode_fieldset").find(".missing_mode").on("mousedown", function() { ar.projects.setMissingValueMode($(this).prop("id")); });
      this.alex.initialize();
      return this;
      },

   save: function()
      {
      window.localStorage.setItem("ar_project_active", this.active.id);
      window.localStorage.setItem("ar_project_active_model", this.getActiveModelID());
      window.localStorage.setItem("ar_project_active_product", this.getActiveProduct().value);
      window.localStorage.setItem("ar_project_missing_values", this.getMissingValueMode());
      },

   load: function()
      {
      var missingValueMode = window.localStorage.getItem("ar_project_missing_values");

      if((missingValueMode === "a") || (missingValueMode === "v"))
         {
         this.missingValueMode = missingValueMode;

         if(this.missingValueMode === "v")
            $("#ar_missing_mode_fieldset").find(".missing_mode").toggleClass("down");
         }

      var projectID = window.localStorage.getItem("ar_project_active");

      if(projectID && this.hasOwnProperty(projectID))
         {
         $("#ar_project_select").val(projectID);
         this.activate(projectID, false);
         }

      var modelID = window.localStorage.getItem("ar_project_active_model");

      if(modelID)
         {
         $("#ar_model_select").val(modelID);

         if(this.active)
            this.active.setModelValue(modelID, false);
         }

      var productID = window.localStorage.getItem("ar_project_active_product");

      if(productID)
         {
         $("#ar_product_select").val(productID);

         if(this.active)
            this.active.setProductValue(productID, false);
         }

      $("#ar_project_select").trigger("change");
      },

   activate: function(projectID, update)
      {
      this.values.forEach(function(p) { this[p.id].deactivate(); }, this);
      this.active = this[projectID];
      this.active.activate(update);

      if(this.activeModelID === "")
         this.activeModelID = this.active.getModelID();

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
      },

   setModelValue: function(modelID, update)
      {
      this.activeModelID = modelID;
      this.active.setModelValue(modelID, true);
      },

   getActiveModelID: function()
      {
      return this.activeModelID;
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

   getActiveProduct: function()
      {
      return this.active.getProduct();
      },

   getActiveModel: function()
      {
      return this.active.getModel();
      },

   getActiveProduct: function()
      {
      return this.active.getProduct();
      },

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

   getActiveJSONURL: function(stationID)
      {
      return this.active.getJSONURL(stationID);
      },

   getActiveStationGeoJSONURL: function()
      {
      return this.active.getStationGeoJSONURL();
      },

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
         result += "_" + $("#ar_run_select option:selected").text().replace(/ |\./g, "_");

         var text = $("#ar_product_select option:selected").text().replace(/ |\./g, "_");
         result += "_" + text.substr(0, text.indexOf("(") - 1).trim();
         }

      if(this.IVT_threshold < 249)
         result += "_thrshld_IVT_100";

      return result + ".png";
      },

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
   }

//-------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------

ar.projects.alex =
   {
   id: "alex",
   label: "GW Storm Rating Plots 1950-2100",
   title: "Climate Warming Impacts on Storminess 1950-2100",

   initialize: function()
      {
      ar.projects.values.push({id: this.id});
      $("#ar_project_select").append($("<option></option>").val(this.id).text(this.label));
      $("#ar_document_tab_li").hide();
      },

   activate: function(update)
      {
      this.active = true;
      $("#ar_title_container").html(this.title + ((ar.layers.alex.mode === "obs") ? " (JRA 1980-2020)" : " (CanRCM4)"));
      $(".ar_guide_content").hide();
      $("#ar_guide_" + this.id).show();
      $("#ar_mrp_fieldset,#ar_stations_mode").hide();
      $("#ar_plot_tab_li").hide();
      $("#ar_document_tab_li").show();
      $("#ar_alex_mode_container").show();
      $("#ar_weighting_fieldset,#ar_ivt_mode_fieldset").hide();
      ar.layers.stations.hide();
      ar.layers.ivt.hide();
      ar.layers.alex.show();
      ar.legend.hide();
      return this;
      },

   deactivate: function()
      {
      this.active = false;
      $("#ar_mrp_fieldset,#ar_stations_mode").show();
      $("#ar_plot_tab_li").show();
      $("#ar_document_tab_li").hide();
      $("#ar_alex_mode_container").hide();
      ar.layers.stations.show();
      ar.layers.ivt.show();
      ar.layers.alex.hide();
      ar.legend.show();
      return this;
      },

   setModelID: function()
      {
      return this;
      },

   setModelValue: function()
      {
      return this;
      },

   getModelID: function()
      {
      return "";
      },

   setProductValue: function()
      {
      return this;
      },

   getProduct: function()
      {
      return "";
      },

   getShortCategory: function()
      {
      return "";
      },

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
   }

//-------------------------------------------------------------------------------------------------

