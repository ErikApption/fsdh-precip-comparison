//-------------------------------------------------------------------------------------------------

ar.layers = 
   {
   active: null,
   //order: ["stations", "precip", "regions", "stationsanim", "basemap"], // ["stations", "precip", "regions", "ivt", "basemap"],
   order: ["precip", "regions", "animation", "basemap"],

   initialize: function()
      {
      this.reverse_order = this.order.slice().reverse();
      $("#vw_layer_fieldset").hide();
      $("#vw_layer_opacity_slider").slider({min: 0, value: Math.round(100 * ar.layers.getOpacity()), max: 100, slide: function(e, ui) { ar.layers.setOpacity(ui.value / 100); }});
      $("#source_controls").find(".radio").on("mousedown", function() { ar.layers.stations.setDisplayedSource($(this).prop("id")); });
      this.lineColourControl = vw.colourcontrol.create("#vw_line_colour_fieldset", {boxWidth: 9, callback: function(colour, data) { ar.layers.setLineColour(colour); }});
      this.fillColourControl = vw.colourcontrol.create("#vw_fill_colour_fieldset", {boxWidth: 9, callback: function(colour, data) { ar.layers.setFillColour(colour); }});
      this.order.forEach(function(k) {this[k].initialize(); }, this);
      },

   activate: function(layer)
      {
      this.active = layer;
      },

   getOpacity: function()
      {
      return (this.active && this.active.getOpacity) ? this.active.getOpacity() : 1.0;
      },

   setOpacity: function(value)
      {
      if(this.active && this.active.setOpacity)
         this.active.setOpacity(value);
      },

   getLineWidth: function()
      {
      return (this.active && this.active.getLineWidth) ? this.active.getLineWidth() : 1;
      },

   setLineWidth: function(value)
      {
      if(this.active && this.active.setLineWidth)
         this.active.setLineWidth(value);
      },

   getFillColour: function()
      {
      return (this.active && this.active.getFillColour) ? this.active.getFillColour() : "white";
      },

   setFillColour: function(value)
      {
      if(this.active && this.active.setFillColour)
         this.active.setFillColour(value);
      },

   getLineColour: function()
      {
      return (this.active && this.active.getLineColour) ? this.active.getLineColour() : "#777";
      },

   setLineColour: function(value)
      {
      if(this.active && this.active.setLineColour)
         this.active.setLineColour(value);
      },

   save: function()
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].save) this[k].save(); }, this);
      },

   load: function()
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].load) this[k].load(); }, this);
      },

   fieldChanged: function(field)
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].fieldChanged) this[k].fieldChanged(field); }, this);
      },

   dateChanged: function(data)
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].dateChanged) this[k].dateChanged(data); }, this);
      },

   timeChanged: function(data)
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].timeChanged) this[k].timeChanged(data); }, this);
      },

   projectChanged: function(project)
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].projectChanged) this[k].projectChanged(project); }, this);
      },
/*
   modelChanged: function(model)
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].modelChanged) this[k].modelChanged(model); }, this);
      },
*/
   tabChanged: function(tabID)
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].tabChanged) this[k].tabChanged(tabID); }, this);
      },

   reorder: function()
      {
      this.reverse_order.forEach(function(k) { if(this[k] && this[k].bringToFront) this[k].bringToFront(); }, this);
      }
   }

//-------------------------------------------------------------------------------------------------
