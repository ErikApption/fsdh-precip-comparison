  /*
   * @class CanvasOverlay
   * @aka L.CanvasOverlay
   * @inherits Interactive layer
   *
   * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
   *
   * @example
   *
   * ```js
   * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
   *    imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
   * L.imageOverlay(imageUrl, imageBounds).addTo(map);
   * ```
   */

L.ImageOverlay.Canvas = L.ImageOverlay.extend(
   {
   options:
      {
      opacity: 1.0,
      interactive: false,
      crossOrigin: false,
      errorOverlayUrl: '',
      zIndex: 1,
      className: '',
      image_smoothing: false
      },

   any3d: true,

   create$1:  function (tagName, className, container)
      {
      var el = document.createElement(tagName);
      el.className = className || '';

      if(container)
         container.appendChild(el);

      return el;
      },

   hasClass: function(el, name) {
        if (el.classList !== undefined) {
                return el.classList.contains(name);
        }
        var className = getClass(el);
        return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
      },

  getClass: function (el) {
        // Check if the element is an SVGElementInstance and use the correspondingElement instead
        // (Required for linked SVG elements in IE11.)
        if (el.correspondingElement) {
                el = el.correspondingElement;
        }
        return el.className.baseVal === undefined ? el.className : el.className.baseVal;
      },

   setClass: function(el, name)
      {
      if(el.className.baseVal === undefined)
         el.className = name;
      else
         el.className.baseVal = name;   // in case of SVG element
      },

   addClass: function(el, name)
      {
      if (el.classList !== undefined) {
               var classes = name.trim().split(/\s+/);
               for (var i = 0, len = classes.length; i < len; i++) {
                     el.classList.add(classes[i]);
               }
      } else if (!this.hasClass(el, name)) {
               var className = this.getClass(el);
               this.setClass(el, (className ? className + ' ' : '') + name);
      }
      },

   setPosition: function (el, point)
      {
      el._leaflet_pos = point;

      if(this.any3d)
         this.setTransform(el, point);
      else
         {
         el.style.left = point.x + 'px';
         el.style.top = point.y + 'px';
         }
      },

   testProp: function(props) {
        var style = document.documentElement.style;

        for (var i = 0; i < props.length; i++) {
                if (props[i] in style) {
                        return props[i];
                }
        }
        return false;
      },

   setTransform: function(el, offset, scale)
      {
      var pos = offset || new Point(0, 0);

      el.style[this.TRANSFORM] =
                (this.ie3d ?
                        'translate(' + pos.x + 'px,' + pos.y + 'px)' :
                        'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
                (scale ? ' scale(' + scale + ')' : '');
      },

   falseFn: function () { return false; },

   bind: function (fn, obj) {
        var slice = Array.prototype.slice;

        if (fn.bind) {
                return fn.bind.apply(fn, slice.call(arguments, 1));
        }

        var args = slice.call(arguments, 2);

        return function () {
                return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
        };
      },

   _initImage: function()
      {
      this.TRANSFORM = this.testProp(['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform']);
      this.ie3d = ('ActiveXObject' in window) && ('transition' in document.documentElement.style);

      this.canvas_image = null;
      this._image = document.createElement("canvas");
      $(this._image).addClass(".leaflet-image-layer");
      this.context = this._image.getContext("2d");
      this.context.imageSmoothingEnabled = this.options.image_smoothing;
      this.addClass(this._image, 'leaflet-image-layer');
      if (this._zoomAnimated) { this.addClass(this._image, 'leaflet-zoom-animated'); }
      if (this.options.className) { this.addClass(this._image, this.options.className); }
      
      this._image.onselectstart = this.falseFn;
      this._image.onmousemove = this.falseFn;

      this.value_canvas = document.createElement("canvas");
      this.value_canvas.width = 1;
      this.value_canvas.height = 1;
      this.value_context = this.value_canvas.getContext("2d");
      this.value_context.imageSmoothingEnabled = false;
      // @event load: Event
      // Fired when the ImageOverlay layer has loaded its image
//       img.onload = this.bind(this.fire, this, 'load');
//       img.onerror = this.bind(this._overlayOnError, this, 'error');

      if(this.options.zIndex)
         this._updateZIndex();
      },

   _reset: function(redraw)
      {
      var image = this._image,

      bounds = new L.Bounds(
                        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
                        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
                    size = bounds.getSize();

                this.setPosition(image, bounds.min);
                this.clearImage();
                image.width  = size.x;
                image.height = size.y;
                image.style.width  = size.x + 'px';
                image.style.height = size.y + 'px';
                // canvas clears on resize
                this.context.imageSmoothingEnabled = this.options.image_smoothing;
                if(this.canvas_image)
                   this.setImageData(this.imageData);

      this.image_bounds = bounds;
      },

   setUrl: function(url)
      {
      },

   setSmoothing: function(isSmoothed)
      {
      if(this.options.image_smoothing !== isSmoothed)
         {
         this.options.image_smoothing = isSmoothed;
         this.context.imageSmoothingEnabled = this.options.image_smoothing;

         if(this.canvas_image)
            this.setImage(this.canvas_image);
         }
      },

   setImage: function(image)
      {
      this.canvas_image = image;

      if(this.context)
         {
         var s = this._image.style;
         this.clearImage();
         this.context.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
         }

      return this;
      },

   setImageData: function(imageData)
      {
      this.imageData = imageData;
      this.canvas_image = imageData.image;

      if(this.context)
         {
         var s = this._image.style;
         this.clearImage();
         
         if(imageData.image && (imageData.image.width > 0) && (imageData.image.height))
            {
            this.context.drawImage(imageData.image, 0, 0, imageData.image.width, imageData.image.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

            if((this.coloured === true) && (this.red !== undefined))   // selected red as one the colours which has been defined; if none, no need to recolour (i.e. faster)
               {
	            this.context.save();
               this.context.globalCompositeOperation = "source-in";
               this.context.fillStyle = "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
               this.context.fillRect(0, 0, imageData.image.width, imageData.image.height);
	            this.context.restore();
               }
            }
	    
	  // This approach was way slower; keeping for future reference
	    
	  //  var imgd = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
          //  var p = imgd.data;
          //  var red = this.red;
          //  var green = this.green;
          //  var blue = this.blue;

          //  for (var i = 0, n = p.length; i < n; i += 4)
//                p[i] = p[i + 1] = p[i + 2] = (3 * p[i] + 3 * p[i + 1] + 2 * p[i + 2]) / 8;
//                p[i] = 255; p[i + 1] = p[i + 2] = 0;
//                p[i] = p[i + 1] = p[i + 2] = 0;
          //     {
          //     p[i] = red;
          //     p[i + 1] = green;
          //     p[i + 2] = blue;
          //     }

          //  this.context.putImageData(imgd, 0, 0);
          //  }
         }

      return this;
      },

   clearImage: function()
      {
      if(this.context)
         {
         this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
         }

      return this;
      },

   getColourData: function(layerPoint)
      {
      if(this.imageData)
         {
         // get the point within the layer

         var bounds = this.getImageBounds();

         var x = layerPoint.x - bounds.min.x;
         var y = layerPoint.y - bounds.min.y;

         // get the point on the image

         var x_image = Math.round(x * this.imageData.image.width / this.context.canvas.width);
         var y_image = Math.round(y * this.imageData.image.height / this.context.canvas.height);

         // return the value (unscaled) image pixel data at that point

         if((x_image >= 0) && (x_image <= this.imageData.image.width) && (y_image >= 0) && (y_image <= this.imageData.image.height))
            {
            this.value_context.clearRect(0, 0, 1, 1);
            this.value_context.drawImage(this.imageData.image, x_image, y_image, 1, 1, 0, 0, 1, 1);
            return this.value_context.getImageData(0, 0, 1, 1).data;
            }
         else
            return null;
         }
      else
         return null;
      },

   getImageSize: function()
      {
      return {width: this.canvas_image.width, height: this.canvas_image.height};
      },

   getImageBounds: function()
      {
      return this.image_bounds;
      },

   getImageStyle: function()
      {
      return this._image.style;
      },

   setColoured: function(value)
      {
      this.coloured = value;
      return this;
      },

   setColour: function(values)
      {
      this.red = values[0];
      this.green = values[1];
      this.blue = values[2];
      this.setColoured(true);

      if(this.imageData)
         this.setImageData(this.imageData);

      return this;
      },

   getColour: function()
      {
      return [this.red, this.green, this.blue];
      },

   getColourText: function()
      {
      return "rgb(" + this.red + "," + this.green +"," + this.blue + ")";
      }
   });

L.canvasOverlay = function canvasOverlays(url, bounds, options)
   {
   return new L.ImageOverlay.Canvas(url, bounds, options);
   };
