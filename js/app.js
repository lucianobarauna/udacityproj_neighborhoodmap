// Local dos shoppings
const localShoppings = [
    {
        nome: 'Shopping Grande Rio',
        posição: {lat: -22.7977197, lng: -43.3544452},
        id: 0,
        marcador: [],
        visivel: true,
        destacado: false
    },
    {
        nome: 'Shopping Nova América',
        posição: {lat: -22.8781756, lng: -43.2742505},
        id: 1,
        marcador: [],
        visivel: true,
        destacado: false
    },
    {
        nome: 'Carioca Shopping',
        posição: {lat: -22.8499637, lng: -43.3132073},
        id: 2,
        marcador: [],
        visivel: true,
        destacado: false
    },
    {
        nome: 'Norte Shopping',
        posição: {lat: -22.8864318, lng: -43.2856869},
        id: 3,
        marcador: [],
        visivel: true,
        destacado: false
    },
    {
        nome: 'Shopping Rio Sul',
        posição: {lat: -22.9569748, lng: -43.1790104},
        id: 4,
        marcador: [],
        visivel: true,
        destacado: false
    },
    {
        nome: 'Barra Shopping',
        posição: {lat: -22.9986759, lng: -43.3573733},
        id: 5,
        marcador: [],
        visivel: true,
        destacado: false
    }
];

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
    for (let i = 0; i < localShoppings.length; i++) {
    	let marcador = new google.maps.Marker({
          position: localShoppings[i].posição,
          map: map,
          title: localShoppings[i].nome,
          animation: google.maps.Animation.DROP,
          icon: pinMarkPadrao,
          id: i
        });

        // Função para selecionar o lugar na lista
        marcador.addListener('click', function() {
            lugar = shoppRest.lugarLista()[this.id];
            shoppRest.selecionarLugar(lugar);
        });

    	localShoppings[i].marcador.push(marcador);
    }
}

// Construtor para lista de lugares
const Lugar = function(data){
    this.nome = ko.observable(data.nome);
    this.posição = ko.observable(data.posição);
    this.id = ko.observable(data.id);
    this.marcador = ko.observableArray(data.marcador);
    this.visivel = ko.observable(data.visivel);
    this.destacado = ko.observable(data.destacado);

}

// Construtor para lista de restaurantes
const Restaurante = function(data){
    this.nome = ko.observable(data.name);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.endereço = ko.observable(data.location.formattedAddress[0]);
    this.telefone = ko.observable(data.contact.formattedPhone);
}

const ViewModel = function() {
    const self = this;

    // Cria uma array observavel vazia para ser preenchida com os lugares iniciais
    this.lugarLista = ko.observableArray([]);

  	// Array para guardar a lista de restaurantes próximos
    this.restaurantes = ko.observableArray([]);

    // Coloca todos os dados iniciais na array osbservavel
    localShoppings.forEach(function(lugarItem){
        self.lugarLista.push( new Lugar(lugarItem) );
    });

    // Função para destacar o lugar selecionado
    this.selecionarLugar = function(lugar){
    	// Deixa todos marcadores com aparencia padrão
        for (let i = 0; i < self.lugarLista().length; i++) {
           self.lugarLista()[i].marcador()[0].setIcon(pinMarkPadrao);
           self.lugarLista()[i].destacado(false);
        }
        // Destaca o marcador selecionado
        lugar.marcador()[0].setIcon(pinMarkSelecionado);
        lugar.destacado(true);
        populateInfoWindow(lugar.marcador()[0], largeInfowindow)

       	let latitude = lugar.posição().lat;
	    let longitude = lugar.posição().lng;
	    let foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + latitude + ',' + longitude +
	        '&client_id=U4N0REIMZYC2YDKX5J32FFZGVD2Q1YUVYPVO2ZZSM4ZAJUTK&client_secret=2E5MWV3EAOKS3NU3TSRJT5WSS4EQD35FJG5RDYBTEVXQPN11&v=20160118&query=restaurante&limit=5'

	    // Limpa lista de restaurantees
	    self.restaurantes.removeAll()
	    //solicitação da API do foursquare de pesquisa dos 5 restaurantes mais próximos do lugar apontado
	    $.getJSON(foursquareURL, function( data ) {
	        for (let i = 0; i < data.response.venues.length; i++) {
	        	let response = data.response.venues[i];
	        	self.restaurantes.push(new Restaurante(response));
	        }
	    }).fail(function(){
	        alert("Tivemos um problema, tente carregar novamente a página.");
	    });

    }

    // Cria um observavel para linkar com o evento da pesquisa
    this.pesquisa = ko.observable('');

    // Função filtra os lugares e marcadores de acordo com a pesquisa
    this.pesquisar = function(value) {
        // Se a pesquisa estiver vazia mostra todos os lugares na lista e no mapa
        if (value == '') {
            for (let i = 0; i < self.lugarLista().length; i++) {
                self.lugarLista()[i].marcador()[0].setMap(map);
        		self.lugarLista()[i].visivel(true);
            }
            return
        }

        // Se o item corresponde à pesquisa é mostrado, caso o contrário esconde o marcador no mapa e na lista
        self.lugarLista().forEach(function(lugarItem){
            if (lugarItem.nome().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                lugarItem.marcador()[0].setMap(map);
                lugarItem.visivel(true);

            } else {
                lugarItem.marcador()[0].setMap(null);
                lugarItem.visivel(false);
            }

        });

    };

    this.pesquisa.subscribe(self.pesquisar);

}

shoppRest = new ViewModel();
ko.applyBindings(shoppRest);




