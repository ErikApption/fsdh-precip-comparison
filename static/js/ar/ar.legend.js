ar.legend =
   {
   ar_ecar_legend_visible: true,
   ar_ivt_legend_visible: true,
   ecar_position: {top: 0, left: 0},
   ivt_position: {top: 0, left: 0},

   initialize: function()
      {
      $("#ar_ecar_legend_container").draggable({ containment: "parent", start: function (event, ui) { $(this).css({ right: "auto", top: "auto", bottom: "auto" }); }, stop: function() { ar.legend.ecar_position = $("#ar_ecar_legend_container").position(); } });
      $("#ar_ivt_legend").draggable({ containment: "parent", start: function (event, ui) { $(this).css({ right: "auto", top: "auto", bottom: "auto" }); }, stop: function() { ar.legend.ivt_position = $("#ar_ivt_legend").position(); } });
      $("#ar_show_ecar_scale_button").on("mousedown", function() { if($(this).hasClass("down")) $("#ar_ecar_legend_container").show(); else $("#ar_ecar_legend_container").hide(); });
      $("#ar_show_ivt_scale_button").on("mousedown", function() { if($(this).hasClass("down")) $("#ar_ivt_legend").show(); else $("#ar_ivt_legend").hide(); });
      this.ecar_position = $("#ar_ecar_legend_container").position();
      this.ivt_position = $("#ar_ivt_legend").position();
      this.load();
      },

   save: function()
      {
      window.localStorage.setItem("ar_ecar_position", JSON.stringify(this.ecar_position));
      window.localStorage.setItem("ar_ivt_position", JSON.stringify(this.ivt_position));
      window.localStorage.setItem("ar_ecar_legend_visible", $("#ar_ecar_legend_container").is(":visible"));
      window.localStorage.setItem("ar_ivt_legend_visible", $("#ar_ivt_legend").is(":visible"));
      },

   load: function()
      {
//       var ar_ecar_position = localStorage.getItem("ar_ecar_position");
// 
//       if((ar_ecar_position !== "null") && (ar_ecar_position !== null))
//          {
//          this.ecar_position = JSON.parse(ar_ecar_position);
//          $("#ar_ecar_legend_container").css({left: this.ecar_position.left + "px", top: this.ecar_position.top + "px"});
//          }
// 
//       var ar_ivt_position = localStorage.getItem("ar_ivt_position");
// 
//       if((ar_ivt_position !== "null") && (ar_ivt_position !== null))
//          {
//          this.ivt_position = JSON.parse(ar_ivt_position);
//          $("#ar_ivt_legend").css({left: this.ivt_position.left + "px", top: this.ivt_position.top + "px"});
//          }

      if(localStorage.getItem("ar_ecar_legend_visible") === "false")
         $("#ar_show_ecar_scale_button").trigger("mousedown");

      if(localStorage.getItem("ar_ivt_legend_visible") === "false")
         $("#ar_show_ivt_scale_button").trigger("mousedown");
      },

   update: function(data, show)
      {
      var $div = $("<div></div>").addClass("legend-scale");
      colorList = ["#FE0000", "#FA8072", "#FEA500", "#00BFFF", "#0000FF",  "#008B8B", "#00FF00", "#FFFF00", "#FFFFFF"]; 

      if(data.lis)
         {
         var $title = $("<div></div>").addClass("legend-title").html(data.title).appendTo($div);
         
         var i = 0; 

         data.lis.forEach(function(li)
            {
            currClr = colorList[i];
            var $ll = $("<div></div>").addClass("legend_label_container").appendTo($div);
            // $("<div></div>").addClass(li.ar_class).addClass("legend_rectangle").appendTo($ll);
            $("<div></div>").addClass(li.ar_class).addClass("legend_rectangle").css({background: currClr}).appendTo($ll);
            $("<div></div>").addClass("legend_label").html(li.label).appendTo($ll);

            if(li.title)
               $ll.prop("title", li.title);
            
            i += 1;
            });

            
         }
      else if(data.image)
         $div.addClass("legend-scale-image").append($("<img>").prop({"src": data.image, width: data.width, height: data.height}));

      $("#ar_ecar_legend").empty().append($div);

      if(show)
         $("#ar_ecar_legend_container").show();

      return this;
      },

   slide: function(direction)
      {
      $("#ar_ecar_legend_container").css({right: "10px"});
      },

   hide: function()
      {
      this.ar_ecar_legend_visible = $("#ar_ecar_legend_container").is(":visible");
      this.ar_ivt_legend_visible = $("#ar_ivt_legend").is(":visible");
      $("#ar_ecar_legend_container,#ar_ivt_legend").hide();

      return this;
      },

   show: function()
      {
      if(this.ar_ecar_legend_visible === true)
         $("#ar_ecar_legend_container").show();

      if(this.ar_ivt_legend_visible === true)
         $("#ar_ivt_legend").show();

      return this;
      },

   updateModelLegend: function(ts, hr) //function(ts)
      {
      if(ar.projects.animationMode === "ai_approach")
         $("#ar_ecar_model_label").text("RDPS 10km");
      else if(ar.projects.animationMode === "weong")
         $("#ar_ecar_model_label").text("HRDPS WEonG");
      else if(ar.projects.animationMode === "hrdps_ai")
         $ ("#ar_ecar_model_label").text("HRDPS");
      else
         $("#ar_ecar_model_label").text("RDPS Burrows");

      $("#ar_ecar_run_label").text(ts.substr(0,4) + "-" + ts.substr(4,2) + "-" + ts.substr(6,2) + " " + hr.substr(1,2));      
      // $("#ar_ecar_run_label").text(ts.substr(0,4) + "-" + ts.substr(4,2) + "-" + ts.substr(6,2) + "-12Z " + hr.substr(1,2));
    
      // $("#ar_ecar_run_label").text("Run: " + ts.substr(0,4) + " " + ts.substr(4,2) + " " + ts.substr(6,2) + " " + ts.substr(8,2) + "Z");
      // $("#ar_ecar_model_label").text("RDPS 10km");

      if($("#ar_ecar_legend_container").is(":visible"))
         $("#ar_ecar_model_legend").show();
      }
   }
