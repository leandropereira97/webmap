const map=$('#map').data('map');
const mapLayers=map.getLayers();

export function getLayerByName(layername){
    let layer =null;

    mapLayers.forEach(lyr => {
        if(lyr.get('name')===layername)
        layer=lyr;        
    });
    return layer;
}