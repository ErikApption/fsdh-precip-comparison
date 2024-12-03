ar.popup =
   {
   visible: false,

   initialize: function()
      {
      this.hide();
      },

   showStation: function(properties, position)
      {
      var html = "";

      this.properties = properties;
      this.position = position;

      if(properties.id)
         html = "<div style=\"text-align:center; width:98%; margin-top: 3px;\"><b>" + properties.id + "</b></div>";

      if(properties.uts)
         html += "<div style=\"font-size: 13px; color: #039; text-align: center;\">" + ar.time.getDateTimeString(properties.uts) + "</div>";

      if(properties.hasOwnProperty("scale") && properties.hasOwnProperty("category"))
         html += "<div style=\"text-align:center; width:98%; padding-top: 2px; font-weight: bold;\">" + ar.projects.getScaleText(properties.scale, properties.subscale) + " " + properties.category + "</div>";
      else if(properties.category)
         html += "<div style=\"text-align:center; width:98%; padding-top: 2px;\">" + properties.category + "</div>";

      if(properties.info)
         html += "<div style=\"text-align:center; width:98%; padding-top: 2px;\">" + properties.info + "</div>";

      if(html === "")
         {
         html = "<div style=\"text-align:center; width:98%; padding-top: 4px;\"><b>No data</b></div>";
         $("#ar_popup_table").hide();
         }

      $("#ar_popup_title").html(html);

      $("#ar_popup").css({top: Math.max(10, (position.y - $("#ar_popup").height() - 10)) + "px", left: Math.min($(window).width() - $("#ar_popup").width() - 10, (position.x + 15)) + "px"}).show();

      this.visible = true;
      },

   hide: function()
      {
      this.visible = false;
      $("#ar_popup_title").html("");
      $("#ar_popup,#ar_popup_table").hide();
      }
   }
