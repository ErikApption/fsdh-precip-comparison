//-------------------------------------------------------------------------------------------------

ar.time = 
   {
   updateTimerID: 0,
   now_unix_timestamp: 0,
   index: 0,
   days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
   short_months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
   long_months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

   initialize: function()
      {
      vw.time_controls.initialize(ar,
         {
         step: 1,
         minTime: 1,
         maxTime: 84,
         maxTimeStep: 1,
         parent: "#vw_animation_fieldset",
         label_parent: "#vw_map_div",
         labelPosition: "sw",
         timeLabelTitle: "TBD3",  // "IVT",
         timeLabelHint: "TBD4",  // "Timestamp of displayed IVT calculated from GDPS",
         compare: false,
         comparing: false,
         changeStep: false,
         dateChanged: function(data) { ar.time.dateChanged(data); },
         timeChanged: function(data) { ar.time.timeChanged(data); }
         });

      this.update();
      return this;
      },

   update: function()
      {
      window.clearTimeout(this.updateTimerID);

      var date = new Date();
      this.now_unix_timestamp = date.getTime();
      this.year = date.getUTCFullYear();
      this.month = date.getUTCMonth() + 1;
      this.day = date.getUTCDate();
      this.hour = date.getUTCHours();
      this.now = Date.UTC(this.year, this.month - 1, this.day, this.hour, 0);
      this.timestamp = this.year + ar.zeropad(this.month) + ar.zeropad(this.day);

      ar.refresh();

      this.updateTimerID = window.setTimeout(function() { ar.time.update(); }, 30 * 60 * 1000);
      return this;
      },

   getIndex: function()
      {
      return this.index;
      },

   getDateTimeString: function(unix_timestamp)
      {
      var date = new Date(1000 * unix_timestamp);
      return date.getUTCFullYear() + ar.zeropad(date.getUTCMonth() + 1) + ar.zeropad(date.getUTCDate()) + " " + ar.zeropad(date.getUTCHours()) + ":" + ar.zeropad(date.getUTCMinutes()) + "Z";
      },

   dateChanged: function(data)
      {
      this.fileTimestamp = data.timestamp;
      this.fileHour = data.hour;
      //ar.projects.active.setRunValue(data.timestamp); 
      ar.layers.dateChanged(data);
      },

   timeChanged: function(data)
      {
      this.fileTimestamp = data.timestamp;
      this.fileHour = data.hour;
      this.index = data.index;
      //ar.projects.active.setRunValue(data.timestamp); 
      ar.layers.timeChanged(data);
      },

   getFileTimestamp: function()
      {
      return this.fileTimestamp;
      },

   getFileHour: function()
      {
      return this.fileHour;
      },

   getOffsetDateTime: function(offsetHours)
      {
      var year = parseInt(this.fileTimestamp.substr(0,4));
      var month = parseInt(this.fileTimestamp.substr(4,2)) - 1;
      var date = parseInt(this.fileTimestamp.substr(6,2));
      var hour = parseInt(this.fileTimestamp.substr(8,2));
      var dt = new Date(year, month, date, hour + offsetHours);
      return this.days[dt.getUTCDay()] + " " + this.long_months[dt.getUTCMonth()] + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear();
      },

   getTitleDateTimeFromUTS: function(uts)
      {
      var dt = new Date(uts);
      return this.days[dt.getUTCDay()] + " " + this.long_months[dt.getUTCMonth()] + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear();
      },

   triggerChange: function()
      {
      if(ar.projects.active !== null)
         vw.time_controls.triggerChange();
      }
   }

//-------------------------------------------------------------------------------------------------

