//-------------------------------------------------------------------------------------------------

ar.map = 
   {
   map: null,

   initialize: function()
      {
      this.map = L.map("vw_map_div", {minZoom: 3, maxZoom: 9, crs: L.CRS.EPSG900913, scrollWheelZoom: true, fadeAnimation: false, renderer: L.canvas()}).setView([56.5, -127.0], 6);
      this.map.on("mousemove", function(e) { ar.map.mousemove(e); });
      this.map.on("mouseout", function(e) { $("#vw_lat_lng").html(""); });
      L.control.scale({ position: "bottomright", metric: true, imperial: false, updateWhenIdle: true }).addTo(this.map);
      return this;
      },

   save: function()
      {
      if(window.localStorage)
         {
         localStorage.setItem("ar_map_center", JSON.stringify(this.map.getCenter()));
         localStorage.setItem("ar_map_zoom", this.map.getZoom());
         }
      },

   load: function()
      { 
      if(window.localStorage)
         {
         var zoom = this.map.getZoom();

         if(localStorage.getItem("ar_map_zoom"))
            zoom = Math.min(10, parseInt(localStorage.getItem("ar_map_zoom")));

         var center = this.map.getCenter();

         if(localStorage.getItem("ar_map_center"))
            center = JSON.parse(localStorage.getItem("ar_map_center"));

         this.map.setView(center, zoom);
         }
      },

   mousemove: function(e)
      {
      $("#vw_lat_lng").html(this.latLngToHtml(e.latlng));
      },

   latLngToHtml: function(p)
      {
      return p.lat.toFixed(5) + ((p.lat > 0) ? "&deg;N" : "&deg;S") + ", " + Math.abs(p.lng).toFixed(5) + ((p.lng < 0) ? "&deg;W" : "&deg;E");
      },

   addLayer: function(layer)
      {
      if(this.map)
         {
         this.map.addLayer(layer);
         ar.layers.reorder();
         }
      },

   removeLayer: function(layer)
      {
      if(this.map)
         this.map.removeLayer(layer);
      },

   invalidateSize: function()
      {
      if(this.map)
         this.map.invalidateSize();
      },

   latLngToContainerPoint: function(latlng)
      {
      return this.map.latLngToContainerPoint(latlng);
      },

   ready: function()
      {
      return (this.map !== null);
      },

   getZoom: function()
      {
      return this.map.getZoom();
      }
   }

//-------------------------------------------------------------------------------------------------
