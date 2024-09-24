import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';

const OlMap = ({ mapProvider, currentCoordinates }) => {
  const mapDivRef = useRef(null);
  const [map, setMap] = useState(null);
  const [vectorSource, setVectorSource] = useState(new VectorSource()); // Vector source for dynamic markers
  const [clickedCoordinate, setClickedCoordinate] = useState();

  const googleMapsUrl =
    'https://maps.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i375060738!3m9!2spl!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0';
  const OSM_URL = 'https://tile.osm.org/{z}/{x}/{y}.png';

  const zoom = 14;
  const minZoom = 5;
  const maxZoom = 18;

  useEffect(() => {
    const url = mapProvider === 'GMAPS' ? googleMapsUrl : OSM_URL;

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'assets/marker.png', // Path to marker image
        }),
      }),
    });

    const tileLayer = new TileLayer({
      source: new XYZ({
        url,
      }),
    });

    const view = new View({
      center: fromLonLat(currentCoordinates),
      zoom,
      maxZoom,
      minZoom,
    });

    const mapObj = new Map({
      target: mapDivRef.current,
      layers: [tileLayer, vectorLayer],
      view,
    });

    // Add marker when user clicks on the map
    mapObj.on('click', (e) => {
      console.log(e.coordinate)
      const coords = e.coordinate;
      setClickedCoordinate(coords);
      addMarker(coords); // Add a marker to the clicked location
    });

    setMap(mapObj);

    return () => {
      if (mapObj) {
        mapObj.setTarget(null); // Cleanup the map on unmount
      }
    };
  }, [mapProvider, currentCoordinates, zoom, minZoom, maxZoom]);

  // Function to add a marker to the map at a specific location
  const addMarker = (coordinates) => {
    const marker = new Feature({
      geometry: new Point(coordinates),
    });
    vectorSource.addFeature(marker); // Add the marker to the vector source
  };

  useEffect(() => {
    if (map) {
      const view = map.getView();
      view.setCenter(fromLonLat(currentCoordinates)); // Center the map based on current coordinates
      view.setZoom(zoom);
    }
  }, [map, currentCoordinates, zoom]);

  return <div ref={mapDivRef} className="map h-[760px] w-[55%] rounded-xl" />;
};

export default OlMap;
