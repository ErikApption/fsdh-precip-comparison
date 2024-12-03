//-------------------------------------------------------------------------------------------------

ar.projects.ecar_scale_v3 =
   {
   id: "ecar_scale_v3",
   label: "ECAR scale (PSOW V.3.1)",
   title: "Extratropical Cyclone - Atmospheric River (ECAR) Scale (Version 3.1)",

   colormap:
      {
      categories:
         {
         "#F6F5E5": {l: "Missing data", s: "NAN", i: 0, ar_class: "missing_data"},
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

      getCategories: function()
         {
         var a = [];
         for(c in this.categories)
            {
            a.push({value: this.categories[c].i, html: "&ge; " + this.categories[c].l}); 
            }
         a.sort(function(a,b) {return a.value > b.value;});
         return a;
         },

      getCategory: function(colour) { return this.categories.hasOwnProperty(colour.toUpperCase()) ? this.categories[colour.toUpperCase()].l : "NA"; },
      getShortCategory: function(colour) { return this.categories.hasOwnProperty(colour.toUpperCase()) ? this.categories[colour.toUpperCase()].s : "NA"; },
      getColourIndex: function(colour) { return this.categories.hasOwnProperty(colour.toUpperCase()) ? this.categories[colour.toUpperCase()].i : -1; },

      getColour: function(category)
         {
         for(c in this.categories)
            {
            if(this.categories[c].ar_class === category)
               return c;
            }

         return "rgba(0,0,0,0.0)";
         }
      },

   models:
      [
      {
      id: "v3/gdps",
      label: "GDPS 15km",
      products:
         [
         {
         value: "ECAR",
         label: "ECAR S",
         plots:
            [
            { duration_hours: 240, step_hrs: 3, xtick_hrs: 24, yLabel: "Precipitation (mm/3hr)", key: "pr", subtitle: "ECAR Rating Based on Storm Total Precipitation Return Period"}
            ]
         }
         ]
      },

      {
      id: "v3/rdps",
      label: "RDPS 10km",
      products:
         [
         {
         value: "ECAR",
         label: "ECAR S",
         plots:
            [
            { duration_hours: 84, step_hrs: 1, xtick_hrs: 6, yLabel: "Precipitation (mm/hr)", key: "pr", subtitle: "ECAR Rating Based on Storm Total Precipitation Return Period"}
            ]
         }
         ]
      },

      {
      id: "v3/hrdps2p5km",
      label: "HRDPS 2.5km",
      products:
         [
         {
         value: "ECAR",
         label: "ECAR S",
         plots:
            [
            { duration_hours: 48, step_hrs: 1, xtick_hrs: 6, yLabel: "Precipitation (mm/hr)", key: "pr", subtitle: "ECAR Rating Based on Storm Total Precipitation Return Period"}
            ]
         }
         ]
      }
      ],

   legend:
      {
      title: "Max ECAR Scale",
      width: "200px",
      height: "300px",
      lis:
         [
         {ar_class: "arksuperstorm", label: "8: ARkSuperStorm (6x100y, &ge;7d)", title: "worst estimated, >= (+3C) GW PMP or 6 x 100 yr RP, >=7 days"},
         {ar_class: "pmpstorm", label: "7: PMPStorm (3x100y, &lt;7d)", title: "worst expected historically, >=PMP or 3 x 100 yr RP, 5-7 days"},
         {ar_class: "arkstorm", label: "6: ARkStorm (300-1000y, 3-5d)", title: "300 to 1000 yr RP, 3-5 days"},
         {ar_class: "superstorm", label: "5: SuperStorm (100-300y, 1-3d)", title: "100 to 300 yr RP storms, 2-3 days, or  CW3E 'exceptional' 1-3 days"},
         {ar_class: "extreme", label: "4: Extreme (30-100y, 1-3d)", title: "30 to 100 yr RP storms, 1 to 3 days"},
         {ar_class: "strong", label: "3: Strong (10-30y, 1-3d)", title: "10 to 30 yr RP storms, 1 to 3 days"},
         {ar_class: "moderate", label: "2: Moderate (3-10y, 1-3d)", title: "3 to 10 yr RP storms, 1 to 3 days"},
         {ar_class: "weak", label: "1: Weak (&lt;3y, 1-2d)", title: "less than 3 yr RP storms, 1 to 2 days"},
         {ar_class: "non_ar", label: "0: Non-AR (&lt;3y, &lt; warning lvl)", title: "less than 3 yr RP storms, below warning level"},
         {ar_class: "missing_data", label: "Missing Data", title: "Missing data"}
         ]
      }
   }
