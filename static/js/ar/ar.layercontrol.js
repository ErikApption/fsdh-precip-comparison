//-------------------------------------------------------------------------------------------------

ar.layercontrol = function(owner, type, permanent)
   {
   this.owner = owner;
/*
   if(type === "precip")
      return this;//type = "stations";  
*/
   this.type = type;
   this.permanent = (permanent !== false);
   this.$button = $("<div></div>").addClass("vw_button vw_layer_button").addClass(type);
   this.$topButton = $("<div></div>").prop({title: "Hide " + type + " layer"}).addClass("vw_button upper_layer toggle").addClass(type).appendTo(this.$button);
   this.$bottomButton = $("<div></div>").prop({title: "Activate " + type + " layer"}).addClass("vw_button lower_layer toggle").appendTo(this.$button);

   if(this.permanent !== false)
      this.$button.appendTo("#vw_layer_div");

   var that = this;

   this.$button.on("mouseenter", function() { $("#vw_map_info").text(type + " layer controls"); that.mouseEnter(); });
   this.$button.on("mouseleave", function() { $("#vw_map_info").text("");  that.mouseLeave(); });

   this.$topButton.on("click", function()
      {
      $(this).toggleClass("down").prop("title", ($(this).hasClass("down") ? "Show " : "Hide ") + type + " layer");
      that.topButtonClick();
      });

   this.$bottomButton.on("click", function()
      {
      $("#vw_layer_div").find(".lower_layer").not(this).removeClass("down");
      $("#vw_layer_div").find(".vw_layer_button").removeClass("selected");
      $("#vw_layer_fieldset").find("fieldset").hide();

      ar.layers.activate(that.owner);

      that.bottomButtonClick();

      $(this).toggleClass("down").prop("title", ($(this).hasClass("down") ? "Deactivate " : "Activate ") + type + " layer");

      if($(this).hasClass("down"))
         {
         $(this).closest(".vw_layer_button").addClass("selected");
         $("#vw_layer_fieldset").show();
         that.bottomButtonActivated();
         }
      else
         {
         $(this).closest(".vw_layer_button").removeClass("selected");
         $("#vw_layer_fieldset").hide();
         that.bottomButtonDeactivated();
         }
      });

   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.create = function(owner, type)
   {
   return this.call(Object.create(this.prototype), owner, type);
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.show = function()
   {
   this.$button.show();
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.hide = function()
   {
   this.$button.hide();
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.mouseEnter = function()
   {
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.mouseLeave = function()
   {
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.topButtonClick = function()
   {
   this.owner.toggle();
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.bottomButtonClick = function()
   {
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.bottomButtonActivated = function()
   {
   if(this.permanent === true)
      {
      var caption = this.type + " layer";
      $("#vw_active_layer_title").text(caption[0].toUpperCase() + caption.substr(1))
      $("#vw_layer_fieldset > ." + this.type.toLowerCase()).show();

      if(this.owner.getOpacity)
         $("#vw_layer_opacity_slider").slider("option", "value", Math.round(100 * this.owner.getOpacity()));
      }
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.bottomButtonDeactivated = function()
   {
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.trigger = function(action)
   {
   if(action === "bottom_click")
      this.$bottomButton.trigger("click");
   else if(action === "top_click")
      this.$topButton.trigger("click");

   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.layercontrol.prototype.isActive = function()
   {
   return this.$bottomButton.hasClass("down");
   }

//-------------------------------------------------------------------------------------------------
