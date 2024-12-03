#!/bin/bash
# Nhi Dang
# This script searches for a string in the *.css file under the "public_html/DangN/ar_ecar/css" folder and send output to nhi_searchResults.txt
# Usage:   nhi_search.sh StringToSearch


echo "Search for \"$1 \" in: ar.css, hrc_concat.css, jquery.jqplot.css, jquery-ui-ar-mod.css, jquery-ui.css, leaflet.css, leaflet.grid.css, vw.css, vw.time_controls.css \n\n" >> nhi_searchResults.txt

grep -nH $1 ar.css hrc_concat.css jquery.jqplot.css jquery-ui-ar-mod.css jquery-ui.css leaflet.css leaflet.grid.css vw.css vw.time_controls.css >> nhi_searchResults.txt

echo >> nhi_searchResults.txt
echo >> nhi_searchResults.txt

echo "=================================================="  >> nhi_searchResults.txt

echo >> nhi_searchResults.txt
echo >> nhi_searchResults.txt

echo "done."




