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


// This function creates a set of time controls for use in various projects.
// written by Brian Crenna  (brian.crenna@canada.ca/greendog.pizza@gmail.com)
// Last updated 2021 10 17 Su


vw.time_controls =
   {
   index: 0,
   minIndex: 0,
   maxIndex: 83, //40,
   step: 0.5,
   minStep: 0.5,
   maxStep: 1,//12,
   time: 0.0,
   maxTime: 36.0,
   steps: [0.5, 1],//[0.5, 1, 3, 6, 12],
   stepIndex: 0,
   timestamp: "",
   geojson_timestamp: "",
   timeLabel: "",
   timeLabelTitle: "",
   timeLabelHint: "",
   hasCompareButton: false,
   comparing: false,
   changeStep: true,
   maxHr: 83,
   activeAnimation: false,

   initialize: function(owner, options)
      {
      $(document).on("keydown", function(e)
         {
         if((e.which === 39) || (e.which === 40) || (e.which === 190))
            vw.time_controls.next();
         else if((e.which === 37) || (e.which === 38) || (e.which === 188))
            vw.time_controls.previous();
         });

      this.owner = owner;

      if(options.parent)
         this.$parent = $(options.parent);

      if(options.step)
         this.step = options.step;

      if(options.timestamp)
         this.timestamp = options.timestamp;

      if(options.maxTime)
         {
         this.maxIndex = Math.round((options.maxTime - 1) / this.step); //Math.round(options.maxTime / this.step);
         }

      if(options.maxTimeStep)
         {
         this.maxStep = options.maxTimeStep;
         this.steps = this.steps.filter(function(step) { return (step <= options.maxTimeStep + 0.00001); });
         }

      if(options.minIndex)
         {
         this.minIndex = options.minIndex;
         this.index = this.minIndex;
         }

      if(options.changeStep !== undefined)
         this.changeStep = options.changeStep;

      this.maxTime = this.maxIndex * this.step;

      this.labelContainer = (options.label_parent || "body");

      this.hourDigits = (options.hour_digits || 3);

      if(options.timeLabelTitle)
         this.timeLabelTitle = options.timeLabelTitle;

      if(options.timeLabelHint)
         this.timeLabelHint = options.timeLabelHint;

      if(options.labelPosition)
         {
         if(options.labelPosition === "sw")
            this.labelCss = {top: "", left: "10px", bottom: "10px", right: ""};
         else if(options.labelPosition === "nw")
            this.labelCss = {top: "10px", left: "10px", bottom: "", right: ""};
         else if(options.labelPosition === "ne")
            this.labelCss = {top: "10px", left: "", bottom: "", right: "10px"};
         else if(options.labelPosition === "se")
            this.labelCss = {top: "", left: "", bottom: "10px", right: "10px"};
         }

      if(options.maxIndex)
         this.maxIndex = Math.min(this.maxTime -1, options.maxIndex);    //options.maxIndex;

      if(options.compare === true)
         {
         this.hasCompareButton = true;
         this.comparing = (options.comparing || false);
         this.onCompare = options.onCompare;
         this.onRestore = options.onRestore;
         }

      this.dateChanged = options.dateChanged;
      this.timeChanged = options.timeChanged;

      this.createControls();
      this.$parent.children(".time").on("mousedown", function() { if(!$(this).hasClass("inactive")) { vw.time_controls[$(this).prop("id").substr(3)](this); } });

      if(this.hasCompareButton === true)
         {
         $("#tc_compare").off("mousedown").on("mousedown", function(e) { vw.time_controls.compare(e.ctrlKey); });
         $("#tc_compare").on("mouseup", function(e) { if(!e.ctrlKey) vw.time_controls.restore(false); });
         }

      $("#time_slider").slider({min: this.step * this.minIndex, max: this.step * this.maxIndex, step: this.step, slide: function(e, ui) { vw.time_controls.update(ui.value); }});      

      // initialize the mousewheel to move the time slider when it's over the time container

      $("body").on("mousewheel", function(e) { if(e.deltaY < 0) vw.time_controls.next(); else if(e.deltaY > 0) vw.time_controls.previous(); });
      },

   createControls: function()
      {
      if(this.timeLabelTitle !== "")
         $("<fieldset></fieldset>").prop({id: "time_label_container"}).append($("<legend></legend>").html(this.timeLabelTitle)).append($("<div></div>").prop({id: "time_label"})).appendTo(this.labelContainer);
      else
         $("<div></div>").prop({id: "time_label_container"}).append($("<div></div>").prop({id: "time_label"})).appendTo(this.labelContainer);

      if(this.labelCss)
         $("#time_label_container").css(this.labelCss);

      if(this.timeLabelHint !== "")
         $("#time_label_container").prop("title", this.timeLabelHint);

      if(!this.$parent)
         this.$parent = $("<div></div>").prop({id: "time_container"}).appendTo("body");

      $("<div></div>").addClass("time_button time").prop({id: "tc_first", title: "Jump to first model time step"}).appendTo(this.$parent);
      $("<div></div>").addClass("time_button time").prop({id: "tc_previous", title: "Step back"}).appendTo(this.$parent);
      $("<div></div>").addClass("time_button time").prop({id: "tc_reverse", title: "Animate model data in reverse"}).appendTo(this.$parent);
      $("<div></div>").addClass("time_button time").prop({id: "tc_pause", title: "Pause model data animation"}).appendTo(this.$parent);
      $("<div></div>").addClass("time_button time").prop({id: "tc_play", title: "Animate model data"}).appendTo(this.$parent);
      $("<div></div>").addClass("time_button time").prop({id: "tc_next", title: "Step ahead"}).appendTo(this.$parent);
      $("<div></div>").addClass("time_button time").prop({id: "tc_last", title: "Jump to last model time step"}).appendTo(this.$parent);

      if(this.changeStep === true)
         $("<div></div>").addClass("time_button time").prop({id: "tc_increment_step", title: "Change model time step (hours)"}).appendTo(this.$parent).text(this.minStep);

      if(this.hasCompareButton === true)
         {
         $("<div></div>").addClass("time_button time").prop({id: "tc_compare", title: "Compare scenes; <ctrl> to swap"}).appendTo(this.$parent);

         if(this.comparing === false)
            $("#tc_compare").hide();
         }

      $("<div></div>").prop({id: "time_slider"}).appendTo(this.$parent);
      },

   first: function()
      {
      //this.activeAnimation = true;
      return this.pause().setIndex(0);
      },

   previous: function()
      {
      //this.activeAnimation = true;
      return this.pause().setIndex(this.index - 1);
      },

   reverse: function()
      {
     // this.activeAnimation = true;
      this.pause();

      if(this.index > 0)
         {
         this.setIndex(this.index - 1);
         this.timeoutID = window.setTimeout(function() { vw.time_controls.reverse(); }, 600);
         }
      else
         {
         this.timeoutID = window.setTimeout(function()
            {
            vw.time_controls.setIndex(vw.time_controls.maxIndex);
            timeoutID = window.setTimeout(function() { vw.time_controls.reverse(); }, 600);
            }, 1500);
         }

      return this;
      },

   pause: function()
      {
      this.activeAnimation = true;
      window.clearTimeout(this.timeoutID);
      ar.mail.update();
      return this;
      },

   play: function()
      {
      this.pause();
      
      if(this.index < this.maxIndex)
         {
         this.setIndex(this.index + 1);
         this.timeoutID = window.setTimeout(function() { vw.time_controls.play(); }, 600);
         }
      else
         {
         this.timeoutID = window.setTimeout(function()
            {
            vw.time_controls.setIndex(0);
            vw.time_controls.timeoutID = window.setTimeout(function() { vw.time_controls.play(); }, 600);
            }, 1500);
         }

      return this;
      },

   next: function()
      {
      this.pause().setIndex(this.index + 1);
      },

   last: function()
      {
      this.pause().setIndex(this.maxIndex);
      },

   increment_step: function()
      {
      if(++this.stepIndex >= this.steps.length)
         this.stepIndex = 0;

      this.setStep(this.steps[this.stepIndex]);
      },

   compare: function(mode)
      {
      if(this.onCompare)
         this.onCompare(mode);
      },

   restore: function(mode)
      {
      if(this.onRestore)
         this.onRestore(mode);
      },

   setIndex: function(index)
      {
      this.index = Math.max(this.minIndex, Math.min(index, this.maxIndex));
      this.time = this.step * this.index;
      $("#time_slider").slider("option", "value", this.time);
      this.update($("#time_slider").slider("value"));
      this.updateButtons();

      return this;
      },

   getIndex: function()
      {
      return this.index;
      },

   getEffectiveIndex: function(step)
      {
      return (step < 0.501) || (this.step > 0.501) ? this.index : Math.round(0.5 * this.index);
      },

   getTimestamp: function()
      {
      return this.timestamp;
      },

   getUnixTimestamp: function()
      {
      if(this.timestamp.length > 7)
         {
         var minutes = ((this.step < 0.9) && ((this.index % 2) === 1)) ? 30 : 0;
         return Date.UTC(this.timestamp.substr(0, 4), this.timestamp.substr(4,2) - 1, this.timestamp.substr(6,2), parseInt(this.timestamp.slice(-2)) + Math.floor(this.step * this.index + 0.001), minutes, 0);
         }
      else
         return 0;
      },

   getHour: function()
      {
      return this.hour;
      },

   getAlternateHour: function()
      {
      return this.alternateHour;
      },

   getMaximumTime: function()
      {
      return this.maxTime;
      },

   setMaxIndex: function(value)
      {
      if( (value < this.maxTime -1) && (this.maxIndex !== value)) //if(this.maxIndex !== value)
         {
         this.maxIndex = value;
         $("#time_slider").slider("option", "max", this.step * this.maxIndex);
         }

      return this;
      },

   getMaxIndex: function()
      {
      return this.maxIndex;
      },

   setStep: function(value)
      {
      if(Math.abs(this.step - value) > 1.0e-3)
         {
         this.step = value;
         this.steps.forEach(function(step, i) { if(Math.abs(this.step - step) < 1.0e-3) this.stepIndex = i; }, this);
         this.step = this.steps[this.stepIndex];
         this.maxIndex = Math.round((this.maxTime -1) / this.step);; //Math.round(this.maxTime / this.step);
         this.setIndex(Math.floor((this.time + 0.0001) / this.step));
         $("#time_slider").slider("option", "step", this.step);
         $("#time_slider").slider("option", "max", this.maxTime);
         $("#time_slider").slider("option", "value", this.time);
         $("#tc_increment_step").text((this.step < 0.5001) ? this.step.toFixed(1) : this.step.toFixed(0)).css("font-size", (this.step < 0.5001) ? "18px" : "20px");

         if(typeof this.owner.timeStepChanged === "function")
            this.owner.timeStepChanged(this.step);
         }

      return this;
      },

   setStepIndex: function(value)
      {
      // find the index of the value

      for(var i = 0; i < this.steps.length; i++)
         {
         if(Math.abs(value - this.steps[i]) < 0.001)
            {
            this.stepIndex = i;
            break;
            }
         }

      this.setStep(this.steps[this.stepIndex]);

      return this;
      },

   getStep: function()
      {
      return this.step;
      },

   setMaxValue: function(value)
      {
      if(this.step * this.maxIndex !== value)
         {
         this.maxIndex = Math.round(value / this.step);
         this.maxTime = this.step * this.maxIndex;
         $("#time_slider").slider("option", "max", this.step * this.maxIndex);
         }

      return this;
      },

   updateButtons: function()
      {
      $("#time_fieldset").children(".time").removeClass("inactive");

      if(this.index === 0)
         $("#ar_first,#ar_previous,#ar_reverse,#ar_pause").addClass("inactive");
      else if(this.index === this.maxIndex)
         $("#ar_pause,#ar_play,#ar_next,#ar_last").addClass("inactive");
      },

   setTimestamp: function(timestamp)
      {
      this.timestamp = timestamp;

      if(this.timestamp.length < 10)
         this.timestamp += "00";

         this.update($("#time_slider").slider("value"));

      if(this.dateChanged)
         {
         this.setIndex(0);
         this.dateChanged({timestamp: this.timestamp, step: this.step, index: this.index, hour: this.hour, alternateHour: this.alternateHour});
         }

      return this;
      },

   getDateISOStringFromTimestamp: function()
      {
      if(this.timestamp === "")
         this.setTimestamp(ar.projects.selectedDate);
         
      var utc_stamp = Date.UTC(this.timestamp.substr(0, 4), this.timestamp.substr(4,2) - 1, this.timestamp.substr(6,2), 12 + parseInt(this.hour));
      var date = new Date(utc_stamp);
      return date.toISOString();
         
      },

   update: function(sliderValue)
      {
      this.index = Math.round(sliderValue / this.step);     
      this.hour = this.zeropad(1 + Math.floor(this.step * this.index + 0.0001), this.hourDigits);
      this.alternateHour = this.hour;

      //if((this.step < 0.9) && ((this.index % 2) === 1))
         //this.hour += "_p5";

      this.updateTimeLabel();
      var dateStr = this.getDateISOStringFromTimestamp();
      var geoDate = dateStr.substr(0, 4) + dateStr.substr(5, 2) + dateStr.substr(8, 2);
      var geoTime =  this.zeropad(parseInt(dateStr.substr(11,2)), this.hourDigits);
      ar.layers.precip.updateGeojsonPlot(geoDate, geoTime); //ar.layers.precip.updateGeojsonPlot(this.timestamp, this.hour);
      ar.legend.updateModelLegend(geoDate, geoTime);   //this.updateRunLabel(this.timestamp, this.hour);

      
      if(this.timeChanged)
         this.timeChanged({timestamp: this.timestamp, unix_timestamp: this.getUnixTimestamp(), step: this.step, index: this.index, hour: this.hour, alternateHour: this.alternateHour});

      $("#time_slider").slider("option", "value", sliderValue)
      },

   updateTimeLabel: function()
      {
      if(this.timestamp === "") //if(this.timestamp !== "")
         this.setTimestamp(ar.projects.selectedDate);
                 
         //var minutes = ((this.step < 0.9) && ((this.index % 2) === 1)) ? 30 : 0;
      var utc_stamp = Date.UTC(this.timestamp.substr(0, 4), this.timestamp.substr(4,2) - 1, this.timestamp.substr(6,2), 12 + parseInt(this.hour));      
       //  var utc_stamp = Date.UTC(this.timestamp.substr(0, 4), this.timestamp.substr(4,2) - 1, this.timestamp.substr(6,2), parseInt(this.timestamp.slice(-2)) + Math.floor(this.step * this.index + 0.001), minutes, 0);
      var date = new Date(utc_stamp);
      var dateStr = date.toISOString(); console.log("updateTimeLabel - dateStr = " + dateStr); // Nhi
      this.timeLabel = "Valid: " + date.toISOString().substr(0,13).replace("T", "-") + "Z";
         //this.timeLabel = date.toISOString().slice(0, -11).replace("T", " ") + "Z";//this.timeLabel = date.toISOString().slice(0, -5).replace("T", " ") + "Z";
      $("#time_label").text(this.timeLabel);
      },

   getTimeLabel: function()
      {
      return this.timeLabel;
      },

   zeropad: function(text, digits)
      {
      return("0000000" + text).slice(-Math.max(String(text).length, digits || 2));
      },

   setMinimumTimeStep: function(value)
      {
      if(Math.abs(this.minStep - value) > 1.0e-6)
         {
         if(this.minStep < value)
            {
            this.steps = this.steps.filter(function(step) {return (step >= value - 0.00001);});

            if(this.stepIndex >= this.steps.length)
               this.stepIndex = this.steps.length - 1;
            }
         else
            this.steps.unshift(value);

         this.minStep = value;

         if(this.step > this.minStep)
            this.setStep(this.minStep);

//          $("#time_slider").slider("option", "step", this.minStep);
         this.setMaxIndex(Math.round(this.maxTime / this.minStep));

         this.setIndex(Math.floor($("#time_slider").slider("value") / this.step));
         }

      return this;
      },

   getMinimumTimeStep: function()
      {
      return this.minStep;
      },

   setComparing: function(value)
      {
      if(this.comparing !== value)
         {
         this.comparing = value;

         if(this.comparing === true)
            $("#tc_compare").show();
         else
            $("#tc_compare").hide();
         }

      return this;
      },

   show: function()
      {
      this.$parent.show();
      $("#time_label_container").show();
      },

   hide: function()
      {
      this.$parent.hide();
      $("#time_label_container").hide();
      },

   triggerChange: function()
      {
      this.setIndex(this.getIndex());
      }
   }
