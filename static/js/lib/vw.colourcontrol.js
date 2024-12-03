//-------------------------------------------------------------------------------------------------

var vw = {};

//-------------------------------------------------------------------------------------------------

vw.colourcontrol = function(parent, options)
   {
   this.boxWidth = options.boxWidth || 12;

   var $canvas = $("<canvas></canvas>").prop({width: 13 * this.boxWidth, height: 32}).addClass("vw_colour_picker").appendTo(parent).on("mousedown", function(e)
      {
      if(options.callback)
         {
         var rect = $canvas[0].getBoundingClientRect();
         var x = e.clientX - rect.left;
         var y = e.clientY - rect.top;
         var data = this.getContext("2d").getImageData(x, y, 1, 1).data;
         options.callback("rgb(" + data[0] + "," + data[1] + "," + data[2] + ")", data);
         }
      });

   if($canvas.get(0))
      {
      var context = $canvas.get(0).getContext("2d");

      context.fillStyle = "black";
      context.fillRect(0, 0, $canvas.width(), $canvas.height());
      var r = [255, 255, 255, 255, 128,   0,   0,   0,   0,   0, 128, 255, 255];
      var g = [255,   0, 128, 255, 255, 255, 255, 255, 128,   0,   0,   0,   0];
      var b = [255,   0,   0,   0,   0,   0, 128, 255, 255, 255, 255, 255, 128];

      for(var i = 0; i < 13; i++)
         {
         var x = this.boxWidth * i;

         for(var j = 0; j < 4; j++)
            {
            var y = 8 * j;
            var factor = (5 - j) / 5;

            var fill = "";

            if(i === 0)
               fill = "rgb(" + 85 * (3 - j) + "," + 85 * (3 - j) + "," + 85 * (3 - j) + ")";
            else
               fill = "rgb(" + Math.round(factor * r[i]) + "," + Math.round(factor * g[i]) + "," + Math.round(factor * b[i]) + ")";

            context.fillStyle = fill;
            context.fillRect(x, y, this.boxWidth, 8);
            }
         }
      }

   return this;
   }

//-------------------------------------------------------------------------------------------------

vw.colourcontrol.create = function(parent, options)
   {
   return this.call(Object.create(this.prototype), parent, options);
   }

//-------------------------------------------------------------------------------------------------
