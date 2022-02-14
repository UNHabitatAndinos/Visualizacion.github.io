// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [3.9, -73],
    zoom: 6,
    minZoom: 6,
    scrollWheelZoom: false,
});

map.once('focus', function() { map.scrollWheelZoom.enable(); });

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [3.9, -73];
    map.setView(cucu, 6);
}).addTo(map);

var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib});


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        'Departamento ' + props.DPTO_CNM_1 + '<br />' +
        'Beneficiarios mensuales ' + props.BEN_MEN  + '<br />' + '<br />'+

        '<b>Beneficiarios por grupos etarios </b>' + '<br />' +
        '0 a 5 años ' + props.N_0_5 + '<br />' +
        '6 a 12 años ' + props.N_6_12+ '<br />' +
        '13 a 17 años ' + props.T_13_17 + '<br />' +
        '18 a 59 años ' + props.T_18_59+ '<br />' +
        'Mayor 60 años ' + props.T_60 + '<br />' + '<br />'+

        '<b>Tipo de implementación </b>' + '<br />' +
        '# Conjunta ' + props.CONJUN+ '<br />' +
        '# Directa ' + props.DIR + '<br />' +
        '# Indirecta ' + props.INDIR + '<br />' + '<br />'+
        '# de actividades dentro del RMRP ' + props.N_ACTI + '<br />' +  '<br />' : 'Seleccione departamento');
};
info.addTo(map);

function stylec(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0,
        dashArray: '3',
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#494949',
        dashArray: '',
        fillOpacity: 0.7,
        opacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}


function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p>${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    BEN_MEN: {
        title: "Beneficiarios mensuales",
        subtitle: "Población",
        elem1: '<div><span  style= "color:#007179">▉</span>Mayor 500.001</div>',
        elem2: '<div><span  style= "color:#338D94">▉</span>250.001 - 500.000</div>',
        elem3: '<div><span  style= "color:#66AAAF">▉</span>50.001 - 250.000</div>',
        elem4: '<div><span  style= "color:#99C6C9">▉</span>20.001 - 50.000 </div>',
        elem5: '<div><span  style= "color:#CCE3E4">▉</span>1 - 20.000</div>',
        elem6: '',
        elem7: '',
        elem8: "Base de datos para la respuesta a la población refugiada y migrante proveniente de Venezuela ",
    },
    CONJUN: {
        title: "Tipo de implementación conjunta",
        subtitle: "#",
        elem1: '<div><span  style= "color:#007179">▉</span>Mayor 51</div>',
        elem2: '<div><span  style= "color:#338D94">▉</span>29 - 50</div>',
        elem3: '<div><span  style= "color:#66AAAF">▉</span>16 - 28</div>',
        elem4: '<div><span  style= "color:#99C6C9">▉</span>4 - 15</div>',
        elem5: '<div><span  style= "color:#CCE3E4">▉</span>0 - 3</div>',
        elem6: '',
        elem7: '',
        elem8: "Base de datos para la respuesta a la población refugiada y migrante proveniente de Venezuela ",
    },

}

var indi;

function resetHighlight(e) {
    indi.setStyle(fillColor);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

indi = L.geoJson(Manzana, {
    style: legends.BEN_MEN,
    onEachFeature: onEachFeature
}).addTo(map);

var currentStyle = 'BEN_MEN';

function setProColor(d) {
    if (currentStyle === 'BEN_MEN') {
        return d > 500000 ? '#007179' :
            d > 250000 ? '#338D94' :
                d > 50000 ? '#66AAAF' :
                    d > 20000 ? '#99C6C9' :
                        '#CCE3E4';
    }else if (currentStyle === 'CONJUN') {
        return d > 50? '#007179' :
        d > 28? '#338D94' :
            d > 15 ? '#66AAAF' :
                d > 3 ? '#99C6C9' :
                    '#CCE3E4';
    } 
    else if (currentStyle === 'A_ALC') {
        return d > 86 ? '#1a9641' :
            d > 85 ? '#a6d96a' :
                d > 64 ? '#f4f466' :
                    d > 29 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'ESC_ANOS') {
        return d > 15 ? '#1a9641' :
            d > 13 ? '#a6d96a' :
                d > 11 ? '#f4f466' :
                    d > 8 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'MIXTICIDAD') {
        return d > 1.05 ? '#1a9641' :
            d > 0.78 ? '#a6d96a' :
                d > 0.53 ? '#f4f466' :
                    d > 0.29 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'DESEM_JUVE') {
                        return d > 38 ? '#d7191c' :
                        d > 20 ? '#fdae61' :
                            d > 11 ? '#f4f466' :
                                d > 4 ? '#a6d96a':
                                '#1a9641';
    }
    else if (currentStyle === 'A_INTER') {
        return d > 85 ? '#1a9641' :
            d > 51 ? '#a6d96a' :
                d > 32 ? '#f4f466' :
                    d > 13 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'T_DESEMP') {
        return d > 50 ? '#d7191c' :
                        d > 30 ? '#fdae61' :
                            d > 20 ? '#f4f466' :
                                d > 10 ? '#a6d96a':
                                '#1a9641';
    }
    else if (currentStyle === 'PM10') {
        return d > 45 ? '#d7191c' :
            d > 43 ? '#fdae61' :
                d > 41 ? '#f4f466' :
                    d > 39 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'DES_RANGO') {
        return d > 11 ? '#d7191c' :
            d > 8 ? '#fdae61' :
                d > 5 ? '#f4f466' :
                    d > 2 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'MAX_EST') {
        return d > 5 ? '#1a9641':
            d > 4 ? '#82E0AA'  :
            d > 3 ? '#a6d96a'  :
                d > 2 ? '#f4f466' :
                    d > 1 ? '#fdae61' :
                    d > 0 ? '#d7191c':
                    '#c3bfc2';
    }
    else if (currentStyle === 'VEN') {
        return d > 100 ? '#d7191c' :
            d > 77 ? '#fdae61' :
                d > 25 ? '#f4f466' :
                    d > 5 ? '#a6d96a' :
                    '#1a9641';
    }

    else {
        return d > 3 ? '#1a9641' :
                d > 2 ? '#f4f466' :
                    d > 1 ? '#a6d96a' :
                        '#1a9641';
    }

}


function fillColor(feature) {
    return {
        fillColor:  setProColor(feature.properties[currentStyle]),
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle) ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle) ? 0.9 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'BEN_MEN'});

function popupText(feature, layer) {
    layer.bindPopup('Localidad ' + feature.properties.LOCALIDAD + '<br />')
}
