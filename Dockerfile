FROM httpd:latest

COPY static/ /usr/local/apache2/htdocs/

# Copy the custom Apache configuration file
#COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf

RUN mkdir /mnt/fsdh

RUN mkdir /mnt/fsdh/geojson

RUN mkdir /mnt/fsdh/data

# Create the symbolic link
RUN ln -s /mnt/fsdh/geojson /usr/local/apache2/htdocs/geojson

# Create the symbolic link
RUN ln -s /mnt/fsdh/data /usr/local/apache2/htdocs/data

EXPOSE 80
