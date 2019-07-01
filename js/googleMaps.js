
// Configuração do google maps

let map;
let pinMarkPadrao;
let pinMarkDestacado;
let pinMarkSelecionado;
let largeInfowindow;

// Função para fazer o marcador de acordo com a cor e tamanho solicitados (crédito aula do google maps api)
let makeMarkerIcon = function (markerColor, markerWidth, markerHeight) {
    const markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
    new google.maps.Size(markerWidth, markerHeight),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(markerWidth, markerHeight));

    return markerImage;
}

// Função para fazer aparecer o info window (crédito aula do google maps api)
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
        });
    }
}

// Inicia o mapa
var initMap = function() {

	// Monta o mapa na tela
	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: -22.9137531, lng: -43.5860658},
    	zoom: 10,
    	mapTypeControl: false
    });

	// Carrega 3 tipos de pin
	pinMarkPadrao = makeMarkerIcon('F44336', 21, 34);
	pinMarkDestacado = makeMarkerIcon('FFC107', 21, 34);
    pinMarkSelecionado = makeMarkerIcon('4CAF50', 25, 41);

    largeInfowindow = new google.maps.InfoWindow();

    // Coloca marcadores dos lugares iniciais no mapa
    for (let i = 0; i < localTarget.length; i++) {
    	let marcador = new google.maps.Marker({
          position: localTarget[i].posição,
          map: map,
          title: localTarget[i].nome,
          animation: google.maps.Animation.DROP,
          icon: pinMarkPadrao,
          id: i
        });

        // Função para selecionar o lugar na lista
        marcador.addListener('click', function() {
            lugar = shoppRest.lugarLista()[this.id];
            shoppRest.selecionarLugar(lugar);
        });

    	localTarget[i].marcador.push(marcador);
    }
}

// Callback para error
var googlemapError = function () {
    $('#modalErro').modal('show');
    $('#map').toggleClass('error');
};