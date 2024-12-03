//-------------------------------------------------------------------------------------------------

ar.colormap = function(categories)
   {
   this.categories = categories;
   return this;
   }

//-------------------------------------------------------------------------------------------------

ar.colormap.create = function(categories)
   {
   return this.call(Object.create(this.prototype), categories);
   }

//-------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------

 ar.colormap.prototype.getCategories = function()
   {
   var a = [];

   for(c in this.categories)
      {
      a.push({value: this.categories[c].i, html: "&le; " + this.categories[c].l}); 
      // console.log(this.categories[c].l);// Nhi
      }

   a.sort(function(a,b) {return a.value > b.value;});
   return a;
   }

//-------------------------------------------------------------------------------------------------

ar.colormap.prototype.getCategory = function(colour)
   {
   return this.categories.hasOwnProperty(colour.toUpperCase()) ? this.categories[colour.toUpperCase()].l : "NA";
   }

//-------------------------------------------------------------------------------------------------

ar.colormap.prototype.getShortCategory = function(colour)
   {
   return this.categories.hasOwnProperty(colour.toUpperCase()) ? this.categories[colour.toUpperCase()].s : "NA";
   }

//-------------------------------------------------------------------------------------------------

ar.colormap.prototype.getColourIndex = function(colour)
   {
   return this.categories.hasOwnProperty(colour.toUpperCase()) ? this.categories[colour.toUpperCase()].i : -1;
   }

//-------------------------------------------------------------------------------------------------

ar.colormap.prototype.getColourFromIndex = function(index)
   {
   for(key in this.categories)
      {
      if(this.categories[key].i === index)
         return key;
      }

   return "rgba(255,255,255,1.0)";
   }

//-------------------------------------------------------------------------------------------------

ar.colormap.prototype.getColour = function(category)
   {
   for(c in this.categories)
      {
      if(this.categories[c].ar_class === category)
         return c;
      }

   return "rgba(255,255,255,1.0)";
   }

//-------------------------------------------------------------------------------------------------

