document.addEventListener("DOMContentLoaded", () => {
  const painelDetalhes = document.getElementById("painel-detalhes")
  const botaoFecharPainel = document.getElementById("fechar-painel")
  const conteudoPrincipal = document.querySelector(".conteudo-principal")
  const tabs = document.querySelectorAll(".tab")
  const container = document.querySelector(".lista-eventos")
  const filtroCategoria = document.getElementById("filtro-categoria")
  const botaoLimparFiltro = document.getElementById("limpar-filtro")

  // Carrega e exibe os eventos salvos
  const eventos = JSON.parse(localStorage.getItem("eventosClimaticos")) || [
    {
      id: 1,
      titulo: "Buraco na rua",
      descricao: "Um buraco na rua X está causando acidentes.",
      categoria: "Infraestrutura",
      lat: -23.5505,
      lng: -46.6333,
    },
    {
      id: 2,
      titulo: "Lâmpada queimada",
      descricao: "Uma lâmpada está queimada na rua Y.",
      categoria: "Iluminação",
      lat: -23.5489,
      lng: -46.6388,
    },
    {
      id: 3,
      titulo: "Vazamento de água",
      descricao: "Há um vazamento de água",
      categoria: "Saneamento",
      lat: -23.5522,
      lng: -46.6355,
    },
    {
      id: 4,
      titulo: "Árvore caída",
      descricao: "Uma árvore caiu na rua W, bloqueando a passagem.",
      categoria: "Meio Ambiente",
      lat: -23.5511,
      lng: -46.6377,
    },
    {
      id: 5,
      titulo: "Sinalização danificada",
      descricao: "Uma placa de sinalização está danificada na avenida A.",
      categoria: "Infraestrutura",
      lat: -23.5495,
      lng: -46.6344,
    },
  ]

  // Limpa o container antes de adicionar os tickets
  container.innerHTML = ""

  eventos.forEach((evento) => {
    const ticketDiv = document.createElement("div")
    ticketDiv.className = "ticket"
    ticketDiv.setAttribute("data-categoria", evento.categoria)
    ticketDiv.setAttribute("data-ticket-id", evento.id)

    ticketDiv.innerHTML =
      '<div class="ticket-cabecalho">' +
      '<div class="ticket-info">' +
      '<span class="ticket-id">ID: ' +
      evento.id +
      "</span>" +
      '<span class="ticket-data">' +
      (evento.endereco || "Coordenadas: (" + evento.lat.toFixed(3) + ", " + evento.lng.toFixed(3) + ")") +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="ticket-titulo">' +
      evento.titulo +
      "</div>" +
      '<div class="ticket-descricao">Categoria: ' +
      evento.categoria +
      "</div>" +
      '<div class="ticket-acoes">' +
      '<button class="botao-abrir" data-ticket="' +
      evento.id +
      '">Abrir Ticket</button>' +
      "</div>"

    container.appendChild(ticketDiv)
  })

  // Adiciona event listeners aos tickets criados dinamicamente
  function adicionarEventListeners() {
    const tickets = document.querySelectorAll(".ticket")

    tickets.forEach((ticket) => {
      ticket.addEventListener("click", function (e) {
        // Evita que o clique no botão "Abrir Ticket" dispare o evento do ticket
        if (e.target.classList.contains("botao-abrir")) {
          return
        }

        const ticketId = this.getAttribute("data-ticket-id")
        console.log("Ticket clicado, ID:", ticketId)
        abrirPainelDetalhes(ticketId)
      })
    })

    // Event listeners para os botões "Abrir Ticket"
    const botoesAbrir = document.querySelectorAll(".botao-abrir")
    botoesAbrir.forEach((botao) => {
      botao.addEventListener("click", function (e) {
        e.stopPropagation()
        const ticketId = this.getAttribute("data-ticket")
        console.log("Botão Abrir clicado, ID:", ticketId)
        abrirPainelDetalhes(ticketId)
      })
    })
  }

  // Chama a função para adicionar os event listeners
  adicionarEventListeners()

  function abrirPainelDetalhes(eventoId) {
    console.log("abrirPainelDetalhes foi chamada com o ID:", eventoId)

    // Recupera os eventos do localStorage
    const eventos = JSON.parse(localStorage.getItem("eventosClimaticos")) || []
    console.log("Eventos carregados do localStorage:", eventos)

    // Verifica se o eventoId passado corresponde ao ID de algum evento
    const ticket = eventos.find((e) => e.id === eventoId)

    if (!ticket) {
      alert("Evento não encontrado")
      return
    }

    // Preenche os detalhes no painel
    document.getElementById("detalhe-titulo").textContent = ticket.titulo
    document.getElementById("detalhe-id").textContent = "ID: " + ticket.id
    document.getElementById("detalhe-data").textContent =
      ticket.endereco || "Coordenadas: (" + ticket.lat.toFixed(3) + ", " + ticket.lng.toFixed(3) + ")"
    document.getElementById("detalhe-descricao").textContent = "Categoria: " + ticket.categoria

    const indicador = document.getElementById("detalhe-indicador")
    indicador.className = "indicador " + ticket.categoria.toLowerCase()
    document.getElementById("detalhe-status").textContent = ticket.categoria

    // Definir status inicial baseado na categoria ou usar um padrão
    const statusSelect = document.getElementById("status-ticket")
    const agenteSelect = document.getElementById("agente-responsavel")

    // Status padrão baseado na categoria ou aleatório para demonstração
    let statusInicial = "em-analise"
    if (ticket.categoria === "Tempestade") {
      statusInicial = "em-atendimento"
    } else if (ticket.categoria === "Seca") {
      statusInicial = "resolvido"
    }

    if (statusSelect) {
      statusSelect.value = statusInicial
    }

    // Agente padrão (Carlos Silva que está logado)
    if (agenteSelect) {
      agenteSelect.value = "carlos-silva"
    }

    // Exibe o painel de detalhes
    painelDetalhes.classList.add("aberto")
    conteudoPrincipal.classList.add("com-painel")

    // Esconde as áreas extras do painel
    const areaRespostaPainel = document.querySelector(".area-resposta-painel")
    const areaAnotacao = document.querySelector(".area-anotacao")
    const areaEncaminhar = document.querySelector(".area-encaminhar")

    if (areaRespostaPainel) areaRespostaPainel.style.display = "none"
    if (areaAnotacao) areaAnotacao.style.display = "none"
    if (areaEncaminhar) areaEncaminhar.style.display = "none"
  }

  function fecharPainelDetalhes() {
    painelDetalhes.classList.remove("aberto")
    conteudoPrincipal.classList.remove("com-painel")
  }

  // Event listener para fechar o painel
  if (botaoFecharPainel) {
    botaoFecharPainel.addEventListener("click", fecharPainelDetalhes)
  }

  // Event listeners para as tabs de filtro
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => {
        t.classList.remove("ativo")
      })
      this.classList.add("ativo")

      const categoria = this.getAttribute("data-categoria")
      filtrarTickets(categoria)
    })
  })

  function filtrarTickets(categoria) {
    const tickets = document.querySelectorAll(".ticket")

    if (categoria === "todos") {
      tickets.forEach((ticket) => {
        ticket.style.display = "block"
      })
      return
    }

    tickets.forEach((ticket) => {
      const categoriaTicket = ticket.getAttribute("data-categoria")
      ticket.style.display = categoriaTicket.toLowerCase() === categoria.toLowerCase() ? "block" : "none"
    })
  }

  // Event listeners para as ações do painel
  const botaoResponder = document.querySelector(".acao-btn.responder")
  const botaoAnotar = document.querySelector(".acao-btn.anotar")
  const botaoEncaminhar = document.querySelector(".acao-btn.encaminhar")
  const botaoAtualizar = document.querySelector(".botao-atualizar")
  const botaoExcluir = document.querySelector(".botao-excluir")

  const areaRespostaPainel = document.querySelector(".area-resposta-painel")
  const areaAnotacao = document.querySelector(".area-anotacao")
  const areaEncaminhar = document.querySelector(".area-encaminhar")

  if (botaoResponder) {
    botaoResponder.addEventListener("click", () => {
      if (areaRespostaPainel) {
        areaRespostaPainel.style.display = "block"
        if (areaAnotacao) areaAnotacao.style.display = "none"
        if (areaEncaminhar) areaEncaminhar.style.display = "none"
        areaRespostaPainel.querySelector("textarea").focus()
      }
    })
  }

  if (botaoAnotar) {
    botaoAnotar.addEventListener("click", () => {
      if (areaAnotacao) {
        areaAnotacao.style.display = "block"
        if (areaRespostaPainel) areaRespostaPainel.style.display = "none"
        if (areaEncaminhar) areaEncaminhar.style.display = "none"
        areaAnotacao.querySelector("textarea").focus()
      }
    })
  }

  if (botaoEncaminhar) {
    botaoEncaminhar.addEventListener("click", () => {
      if (areaEncaminhar) {
        areaEncaminhar.style.display = "block"
        if (areaRespostaPainel) areaRespostaPainel.style.display = "none"
        if (areaAnotacao) areaAnotacao.style.display = "none"
      }
    })
  }

  if (botaoAtualizar) {
    botaoAtualizar.addEventListener("click", () => {
      const agente = document.getElementById("agente-responsavel")?.value
      const status = document.getElementById("status-ticket")?.value
      const ticketId = document.getElementById("detalhe-id").textContent.replace("ID: ", "")

      // Recuperar eventos do localStorage
      const eventos = JSON.parse(localStorage.getItem("eventosClimaticos")) || []

      // Encontrar e atualizar o evento
      const eventoIndex = eventos.findIndex((e) => e.id.toString() === ticketId)
      if (eventoIndex !== -1) {
        eventos[eventoIndex].status = status
        eventos[eventoIndex].agente = agente
        eventos[eventoIndex].dataAtualizacao = new Date().toLocaleString("pt-BR")

        // Salvar de volta no localStorage
        localStorage.setItem("eventosClimaticos", JSON.stringify(eventos))
      }

      // Atualizar a exibição do status no painel
      const statusTexto = {
        "em-analise": "Em Análise",
        "em-atendimento": "Em Atendimento",
        resolvido: "Resolvido",
      }

      const agenteTexto = {
        "carlos-silva": "Carlos Silva",
        "ana-santos": "Ana Santos",
        "pedro-oliveira": "Pedro Oliveira",
        "maria-costa": "Maria Costa",
      }

      document.getElementById("detalhe-status").textContent = statusTexto[status] || status

      // Atualizar a cor do indicador baseado no status
      const indicador = document.getElementById("detalhe-indicador")
      indicador.className = "indicador"
      if (status === "em-analise") {
        indicador.classList.add("abertos")
      } else if (status === "em-atendimento") {
        indicador.classList.add("andamento")
      } else if (status === "resolvido") {
        indicador.classList.add("resolvidos")
      }

      alert(
        `Ticket atualizado com sucesso!\nStatus: ${statusTexto[status]}\nAgente: ${agenteTexto[agente] || "Não atribuído"}`,
      )
    })
  }

  // Modal de confirmação de exclusão
  const modalExcluir = document.getElementById("modal-excluir")
  const botaoFecharModal = document.querySelector(".botao-fechar-modal")
  const botaoCancelarModal = document.querySelector(".botao-cancelar-modal")
  const botaoConfirmarExcluir = document.querySelector(".botao-confirmar-excluir")

  function abrirModal() {
    if (modalExcluir) {
      modalExcluir.classList.add("ativo")
      document.body.style.overflow = "hidden"
    }
  }

  function fecharModal() {
    if (modalExcluir) {
      modalExcluir.classList.remove("ativo")
      document.body.style.overflow = "auto"
    }
  }

  if (botaoExcluir) {
    botaoExcluir.addEventListener("click", (e) => {
      e.stopPropagation()
      abrirModal()
    })
  }

  if (botaoFecharModal) {
    botaoFecharModal.addEventListener("click", fecharModal)
  }

  if (botaoCancelarModal) {
    botaoCancelarModal.addEventListener("click", fecharModal)
  }

  if (botaoConfirmarExcluir) {
    botaoConfirmarExcluir.addEventListener("click", () => {
      alert("Evento excluído com sucesso!")
      fecharModal()
      fecharPainelDetalhes()
    })
  }

  // Event listeners para as áreas de resposta, anotação e encaminhamento
  const botaoEnviarPainel = document.querySelector(".botao-enviar-painel")
  const botaoCancelarPainel = document.querySelector(".botao-cancelar-painel")
  const botaoSalvarAnotacao = document.querySelector(".botao-salvar-anotacao")
  const botaoCancelarAnotacao = document.querySelector(".botao-cancelar-anotacao")
  const botaoEncaminharTicket = document.querySelector(".botao-encaminhar")
  const botaoCancelarEncaminhar = document.querySelector(".botao-cancelar-encaminhar")

  if (botaoEnviarPainel) {
    botaoEnviarPainel.addEventListener("click", () => {
      const textarea = areaRespostaPainel?.querySelector("textarea")
      if (textarea && textarea.value.trim() !== "") {
        alert("Resposta enviada com sucesso!")
        textarea.value = ""
        areaRespostaPainel.style.display = "none"
      } else {
        alert("Por favor, digite uma resposta antes de enviar.")
      }
    })
  }

  if (botaoCancelarPainel) {
    botaoCancelarPainel.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja cancelar a resposta?")) {
        const textarea = areaRespostaPainel?.querySelector("textarea")
        if (textarea) textarea.value = ""
        if (areaRespostaPainel) areaRespostaPainel.style.display = "none"
      }
    })
  }

  if (botaoSalvarAnotacao) {
    botaoSalvarAnotacao.addEventListener("click", () => {
      const textarea = areaAnotacao?.querySelector("textarea")
      if (textarea && textarea.value.trim() !== "") {
        alert("Anotação salva com sucesso!")
        textarea.value = ""
        areaAnotacao.style.display = "none"
      } else {
        alert("Por favor, digite uma anotação antes de salvar.")
      }
    })
  }

  if (botaoCancelarAnotacao) {
    botaoCancelarAnotacao.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja cancelar a anotação?")) {
        const textarea = areaAnotacao?.querySelector("textarea")
        if (textarea) textarea.value = ""
        if (areaAnotacao) areaAnotacao.style.display = "none"
      }
    })
  }

  if (botaoEncaminharTicket) {
    botaoEncaminharTicket.addEventListener("click", () => {
      const departamento = document.getElementById("encaminhar-para")?.value
      if (departamento) {
        alert("Evento encaminhado com sucesso!")
        const textarea = areaEncaminhar?.querySelector("textarea")
        if (textarea) textarea.value = ""
        const select = document.getElementById("encaminhar-para")
        if (select) select.selectedIndex = 0
        if (areaEncaminhar) areaEncaminhar.style.display = "none"
      } else {
        alert("Por favor, selecione um departamento para encaminhar o ticket.")
      }
    })
  }

  if (botaoCancelarEncaminhar) {
    botaoCancelarEncaminhar.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja cancelar o encaminhamento?")) {
        const textarea = areaEncaminhar?.querySelector("textarea")
        if (textarea) textarea.value = ""
        const select = document.getElementById("encaminhar-para")
        if (select) select.selectedIndex = 0
        if (areaEncaminhar) areaEncaminhar.style.display = "none"
      }
    })
  }

  // Event listener para fechar modal com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalExcluir && modalExcluir.classList.contains("ativo")) {
      fecharModal()
    }
  })

  // Event listener para fechar modal clicando fora
  if (modalExcluir) {
    modalExcluir.addEventListener("click", (e) => {
      if (e.target === modalExcluir) {
        fecharModal()
      }
    })
  }

  // Botão de novo ticket
  const botaoNovo = document.querySelector(".botao-novo")
  if (botaoNovo) {
    botaoNovo.addEventListener("click", () => {
      // Redireciona para a página do mapa para criar um novo evento
      window.location.href = "mapa.html"
    })
  }

  // Adicionar funcionalidade de filtro por categoria
  filtroCategoria.addEventListener("change", () => {
    const categoriaSelecionada = filtroCategoria.value

    document.querySelectorAll(".ticket").forEach((ticket) => {
      if (categoriaSelecionada === "todos" || ticket.getAttribute("data-categoria") === categoriaSelecionada) {
        ticket.style.display = "block"
      } else {
        ticket.style.display = "none"
      }
    })
  })

  // Adicionar funcionalidade de limpar filtro
  botaoLimparFiltro.addEventListener("click", () => {
    filtroCategoria.value = "todos"

    document.querySelectorAll(".ticket").forEach((ticket) => {
      ticket.style.display = "block"
    })
  })
})
