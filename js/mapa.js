let mapa
let popup
let autocomplete

function initMap() {
  const centro = { lat: -14.235, lng: -51.9253 }

  mapa = new google.maps.Map(document.getElementById("mapa"), {
    zoom: 4,
    center: centro,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
    fullscreenControl: true,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
    },
  })

  // Botão de localização atual
  const locationButton = document.getElementById("location-button")
  const infoWindow = new google.maps.InfoWindow()

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          infoWindow.setPosition(pos)
          infoWindow.setContent("Sua localização atual")
          infoWindow.open(mapa)
          mapa.setCenter(pos)
          mapa.setZoom(15)
        },
        () => {
          handleLocationError(true, infoWindow, mapa.getCenter())
        },
      )
    } else {
      handleLocationError(false, infoWindow, mapa.getCenter())
    }
  })

  // Habilita autocomplete no campo de endereço
  const input = document.getElementById("endereco-input")
  autocomplete = new google.maps.places.Autocomplete(input)
  autocomplete.bindTo("bounds", mapa)

  // Quando o usuário escolhe um lugar
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace()

    if (!place.geometry) {
      alert("Endereço não encontrado.")
      return
    }

    const pos = place.geometry.location
    const endereco = place.formatted_address || place.name

    mapa.setCenter(pos)
    mapa.setZoom(15)

    abrirFormulario(pos, endereco)
  })

  mapa.addListener("click", (e) => {
    abrirFormulario(e.latLng)
  })

  // Carregar eventos salvos
  carregarEventosSalvos()
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos)
  infoWindow.setContent(
    browserHasGeolocation
      ? "Erro: O serviço de geolocalização falhou."
      : "Erro: Seu navegador não suporta geolocalização.",
  )
  infoWindow.open(mapa)
}

function abrirFormulario(pos, endereco = null) {
  if (popup) popup.close()

  const conteudoForm = `
    <div style="font-family: 'Inter', sans-serif; min-width: 280px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">Registrar Evento Climático</h3>
      
      <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #333;">
        <strong>Título:</strong>
        <input type="text" id="titulo" placeholder="Ex: Enchente forte"
               style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;" />
      </label>

      <label style="display: block; margin: 15px 0 5px; font-weight: 500; color: #333;">
        <strong>Tipo de evento:</strong>
        <select id="categoria"
                style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
          <option value="Tempestade">Tempestade</option>
          <option value="Enchente">Enchente</option>
          <option value="Incêndio">Incêndio</option>
          <option value="Terremoto">Terremoto</option>
          <option value="Seca">Seca</option>
        </select>
      </label>

      ${endereco ? `<p style="font-size: 14px; color: #6b7280; margin: 15px 0;"><strong>Endereço:</strong> ${endereco}</p>` : ""}

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button onclick="popup.close()"
                style="padding: 8px 16px; background-color: #f3f4f6; color: #4b5563; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
          Cancelar
        </button>
        <button onclick="window.adicionarEvento(${pos.lat()}, ${pos.lng()}, '${endereco ? endereco.replace(/'/g, "\\'") : ""}')"
                style="padding: 8px 16px; background-color: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
          Adicionar
        </button>
      </div>
    </div>
  `

  popup = new google.maps.InfoWindow({
    content: conteudoForm,
    position: pos,
  })

  popup.open(mapa)
}

function carregarEventosSalvos() {
  const eventos = JSON.parse(localStorage.getItem("eventosClimaticos")) || []

  eventos.forEach((evento) => {
    const posicao = { lat: evento.lat, lng: evento.lng }

    // Determinar a cor com base na categoria
    let cor
    switch (evento.categoria) {
      case "Tempestade":
        cor = "#3b82f6" // azul
        break
      case "Enchente":
        cor = "#0ea5e9" // azul claro
        break
      case "Incêndio":
        cor = "#ef4444" // vermelho
        break
      case "Terremoto":
        cor = "#8b5cf6" // roxo
        break
      case "Seca":
        cor = "#f59e0b" // laranja
        break
      default:
        cor = "#10b981" // verde
    }

    // Criar marcador
    const marcador = new google.maps.Marker({
      position: posicao,
      map: mapa,
      title: evento.titulo,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: cor,
        fillOpacity: 0.9,
        strokeWeight: 2,
        strokeColor: "#ffffff",
        scale: 10,
      },
    })

    // Criar janela de informação
    const info = new google.maps.InfoWindow({
      content: `
        <div style="font-family: 'Inter', sans-serif; padding: 5px;">
          <h3 style="margin-top: 0; color: #333; font-size: 16px;">${evento.titulo}</h3>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Categoria:</strong> ${evento.categoria}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Local:</strong> ${evento.endereco || "Coordenadas: " + evento.lat.toFixed(4) + ", " + evento.lng.toFixed(4)}</p>
        </div>
      `,
    })

    marcador.addListener("click", () => {
      info.open(mapa, marcador)
    })

    // Criar círculo
    new google.maps.Circle({
      strokeColor: cor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: cor,
      fillOpacity: 0.2,
      map: mapa,
      center: posicao,
      radius: 400,
    })
  })
}

window.adicionarEvento = (lat, lng, endereco = "") => {
  const titulo = document.getElementById("titulo")?.value || "Sem título"
  const categoria = document.getElementById("categoria")?.value || "Sem categoria"
  const posicao = { lat, lng }

  // Recupera a lista existente ou cria uma nova
  const eventosSalvos = JSON.parse(localStorage.getItem("eventosClimaticos")) || []

  // Cria um ID único para o evento
  const id = Date.now().toString()

  // Adiciona o novo evento à lista
  eventosSalvos.push({
    id: id,
    titulo: titulo,
    categoria: categoria,
    lat: lat,
    lng: lng,
    endereco: endereco || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
  })

  // Salva de volta no localStorage
  localStorage.setItem("eventosClimaticos", JSON.stringify(eventosSalvos))

  // Determinar a cor com base na categoria
  let cor
  switch (categoria) {
    case "Tempestade":
      cor = "#3b82f6" // azul
      break
    case "Enchente":
      cor = "#0ea5e9" // azul claro
      break
    case "Incêndio":
      cor = "#ef4444" // vermelho
      break
    case "Terremoto":
      cor = "#8b5cf6" // roxo
      break
    case "Seca":
      cor = "#f59e0b" // laranja
      break
    default:
      cor = "#10b981" // verde
  }

  // Cria marcador
  const marcador = new google.maps.Marker({
    position: posicao,
    map: mapa,
    title: titulo,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: cor,
      fillOpacity: 0.9,
      strokeWeight: 2,
      strokeColor: "#ffffff",
      scale: 10,
    },
  })

  const info = new google.maps.InfoWindow({
    content: `
      <div style="font-family: 'Inter', sans-serif; padding: 5px;">
        <h3 style="margin-top: 0; color: #333; font-size: 16px;">${titulo}</h3>
        <p style="margin: 5px 0; color: #4b5563;"><strong>Categoria:</strong> ${categoria}</p>
        <p style="margin: 5px 0; color: #4b5563;"><strong>Local:</strong> ${endereco || "Coordenadas: " + lat.toFixed(4) + ", " + lng.toFixed(4)}</p>
      </div>
    `,
  })

  marcador.addListener("click", () => {
    info.open(mapa, marcador)
  })

  new google.maps.Circle({
    strokeColor: cor,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: cor,
    fillOpacity: 0.2,
    map: mapa,
    center: posicao,
    radius: 400,
  })

  if (popup) popup.close()

  // Mostrar confirmação
  const confirmacao = new google.maps.InfoWindow({
    content: `
      <div style="font-family: 'Inter', sans-serif; padding: 10px; text-align: center;">
        <p style="margin: 0; color: #10b981; font-weight: 500;">Evento registrado com sucesso!</p>
      </div>
    `,
    position: posicao,
  })

  confirmacao.open(mapa)
  setTimeout(() => {
    confirmacao.close()
  }, 3000)
}
