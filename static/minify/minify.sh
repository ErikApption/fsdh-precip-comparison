#!/bin/bash
# Brian Crenna  brian.crenna@ec.gc.ca or greendog.pizza@gmail.com or brian@thunderbeachscientific.com
# This script uglifies and minifies the javascript code for the merged AR website
# latest update 2022 10 25 Tu

echo "minifying target";

cd ../js/;

rm -f concat_full.js concat.js

cat lib/jquery.min.js lib/jquery-ui.min.js lib/jqplot/jquery.jqplot.min.js lib/jqplot/jqplot.dateAxisRenderer.min.js\
   lib/jqplot/jqplot.barRenderer.min.js lib/jqplot/jqplot.categoryAxisRenderer.min.js lib/jqplot/jqplot.canvasOverlay.js\
   lib/jqplot/jqplot.canvasTextRenderer.min.js lib/jqplot/jqplot.canvasAxisLabelRenderer.min.js lib/jqplot/jqplot.pointLabels.min.js\
   lib/jqplot/jqplot.cursor.js lib/jqplot/jqplot.highlighter.js lib/jqplot/jqplot.dragable.js lib/leaflet/leaflet-src.js\
   lib/leaflet/leaflet.ajax.min.js lib/leaflet/leaflet.canvas_overlay.js lib/dom-to-image.js lib/filesaver.js lib/vw.js\
   ar/ar.js ar/ar.colormap.js ar/ar.config.js ar/ar.layercontrol.js ar/ar.layers.js ar/ar.layers.precip.js\
   ar/ar.layers.basemap.js ar/ar.layers.animation.js ar/ar.layers.regions.js ar/ar.legend.js ar/ar.mail.js ar/ar.map.js\
   ar/ar.popup.js ar/ar.projects.js ar/ar.time.js ar/ar.ui.js > ../minify/concat_full.js

cd ../minify/;

java -jar yuicompressor-2.4.8.jar ./concat_full.js -o concat.js

cp concat.js concat_int.js

a=("k" "l" "p" "g" "r" "a" "u" "I" "z" "w" "d" "L" "t" "H" "y" "F" "e" "x" "D" "f" "p" "W" "C" "n" "b" "g" "h" "i" "j" "m" "c" "q" "s" "v" "E" "A" "Z" "B" "G" "Q" "S" "Y" "R" "P");
b=("l" "z" "b" "3" "p" "y" "c" "6" "5" "t" "I" "2" "h" "x" "9" "u" "8" "e" "g" "a" "7" "v" "r" "1" "i" "j" "0" "s" "k" "m" "n" "d" "q" "w" "4" "A" "E" "F" "K" "F" "R");
i=0;
j=0;

while read line;
   do
      r=${a[i]}${b[j]};

      sed -i "s/${line}/${r}/g" concat_int.js

      j=`expr $j + 1`;

      if [ "$j" -gt "38" ]; then
         j=0;
         i=`expr $i + 1`;
      fi
   done < minify.dict

cat header.txt concat_int.js > concat.js
rm concat_int.js

mv concat.js ../js/ar_ecar.min.js
