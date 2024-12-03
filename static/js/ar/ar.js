// This website merges four AR websites as requested by Mindy Brugman

// Brian Crenna Brian.Crenna@canada.ca / greendog.pizza@gmail.com / brian@thunderbeachscientific.com
// latest update 2022 07 20 W

"use strict";

$(document).ready(function(){ ar.initialize(); });

$(window).on("unload", function() { ar.save(); });
// $(window).on("resize", function() { ar.legend.fix(); });

//-------------------------------------------------------------------------------------------------
var ar =
   {
   initialize: function()
      {
      this.ui.initialize();
      this.map.initialize();
     // this.chart.initialize();
      this.time.initialize();
      this.layers.initialize();
      this.legend.initialize();
      this.projects.initialize();
      this.popup.hide();
      this.load();
      },

   save: function()
      {
      if(window.localStorage)
         Object.keys(this).forEach(function(k) { if(this[k] && this[k].save) this[k].save(); }, this);
      },

   load: function()
      { 
      if(window.localStorage)
         Object.keys(this).forEach(function(k) { if(this[k] && this[k].load) this[k].load(); }, this);
      },

   zeropad: function(text, digits)
      {
      return ("0000000000" + text).slice(-Math.max(String(text).length, digits || 2));
      },

   refresh: function()
      {
      Object.keys(this).forEach(function(k) { if(this[k] && this[k].refresh) this[k].refresh(); }, this);
      }
   }

//-------------------------------------------------------------------------------------------------
