
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

// View
const ViewModel = function() {
    const self = this;

    // Cria uma array observavel vazia para ser preenchida com os lugares iniciais
    this.lugarLista = ko.observableArray([]);

  	// Array para guardar a lista de restaurantes próximos
    this.restaurantes = ko.observableArray([]);

    // Coloca todos os dados iniciais na array osbservavel
    localTarget.forEach(function(lugarItem){
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