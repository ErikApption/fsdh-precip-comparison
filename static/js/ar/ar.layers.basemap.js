//-------------------------------------------------------------------------------------------------

ar.layers.basemap = 
   {
   visible: true,
   opacity: 1.0,
   fillColour: "#FFF",

   sources:
      [
//      {id: "openstreetmap", label: "Open Street Map", url: "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"},
//      {id: "stamen_terrain_labelled", label: "Stamen terrain (labelled)", url: "http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg", attribution: "Map tiles by Stamen design, under CC BY 3.0 Data @ OpenStreetMap contributors."},
//      {id: "opentopomap", label: "Open Topo Map", url: "http://goc-dx.science.gc.ca/~brc123/relief/z{z}/row{y}/{z}_{x}-{y}.jpg"},
      {id: "cartodb_lightall", label: "CartoDB light all", url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"},
      {id: "openstreetmap", label: "Open Street Map", url: "http://goc-dx.science.gc.ca/~brc123/map_tiles/openstreetmap/{z}/{x}/{y}.png"},
      {id: "opentopomap", label: "Open Topo Map", url: "https://b.tile.opentopomap.org/{z}/{x}/{y}.png"},
      {id: "mapsforfree", label: "Maps for Free terrain", url: "https://maps-for-free.com/layer/relief/z{z}/row{y}/{z}_{x}-{y}.jpg"},
      {id: "stamen_terrain_labelled", label: "Stamen terrain (labelled)", url: "http://goc-dx.science.gc.ca/~brc123/map_tiles/stamen_terrain/{z}/{x}/{y}.jpg", attribution: "Map tiles by Stamen design, under CC BY 3.0 Data @ OpenStreetMap contributors."},
      {id: "stamen_terrain_unlabelled", label: "Stamen terrain (unlabelled)", url: "http://tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg", attribution: "Map tiles by Stamen design, under CC BY 3.0 Data @ OpenStreetMap contributors."}
      ],

   initialize: function()
      {
      this.createLayer();
      this.control = ar.layercontrol.create(this, "basemap");

      this.sources.forEach(function(source)
         {
         $("#vw_base_layer_select").append($("<option></option>").val(source.id).html(source.label));
         }, this);

      $("#vw_base_layer_select").on("change", function(){ ar.layers.basemap.setSource($(this).val());});
      },

   createLayer: function()
      {
      this.layer = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png");
      ar.map.addLayer(this.layer);
      },

   setSource: function(sourceID)
      {
      var source = ar.layers.basemap.sources.filter(function(source) { return (source.id === sourceID); });

      if(source.length > 0)
         {
         this.layer.setUrl(source[0].url);
         $("#vw_base_layer_select").val(sourceID);
         }
      },

   getOpacity: function()
      {
      return this.opacity;
      },

   setOpacity: function(value)
      {
      if(this.opacity !== value)
         {
         this.opacity = value;
         this.layer.setOpacity(this.opacity);
         }
      },

   getFillColour: function()
      {
      return this.fillColour;
      },

   setFillColour: function(value)
      {
      if(this.fillColour !== value)
         {
         this.fillColour = value;
         $("#vw_map_div").css("background-color", this.fillColour)
         }
      },

   toggle: function()
      {
      this.visible = !this.visible;

      if(this.layer)
         {
         if(this.visible === false)
            ar.map.removeLayer(this.layer);
         else
            ar.map.addLayer(this.layer);
         }
      },

   save: function()
      {
      window.localStorage.setItem("ar_basemap_visible", this.visible);
      window.localStorage.setItem("ar_basemap_opacity", this.opacity);
      window.localStorage.setItem("ar_basemap_colour", this.fillColour);
      window.localStorage.setItem("ar_basemap_source", $("#vw_base_layer_select").val());
      },

   load: function()
      { 
      if(ar.map.ready() && (window.localStorage.getItem("ar_basemap_visible") === "false"))
         this.control.trigger("top_click");

      if(window.localStorage.getItem("ar_basemap_opacity"))
         {
         var value = parseFloat(window.localStorage.getItem("ar_basemap_opacity"));
         this.setOpacity(value);
         }

      if(window.localStorage.getItem("ar_basemap_colour"))
         {
         var value = window.localStorage.getItem("ar_basemap_colour");
         this.setFillColour(value);
         }

      if(window.localStorage.getItem("ar_basemap_source"))
         {
         var value = window.localStorage.getItem("ar_basemap_source");

         var sources = $("#vw_base_layer_select option").map(function(i, e) { return $(e).val();}).toArray();

         if(sources.indexOf(value) > -1)
            $("#vw_base_layer_select").val(value).trigger("change");
         }
      }
   }

//-------------------------------------------------------------------------------------------------

