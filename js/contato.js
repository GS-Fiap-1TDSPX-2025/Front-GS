document.addEventListener("DOMContentLoaded", () => {
  // Função para o menu mobile
  const botaoMenuMobile = document.querySelector(".botao-menu-mobile")
  const navegacaoDesktop = document.querySelector(".navegacao-desktop")

  if (botaoMenuMobile) {
    botaoMenuMobile.addEventListener("click", () => {
      navegacaoDesktop.classList.toggle("visivel")
    })
  }

  // Elementos do formulário
  const formulario = {
    assunto: document.getElementById("assunto"),
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    confirmaEmail: document.getElementById("confirma-email"),
    ddd: document.getElementById("ddd"),
    telefone: document.getElementById("telefone"),
    cidade: document.getElementById("cidade"),
    estado: document.getElementById("estado"),
    titulo: document.getElementById("titulo"),
    mensagem: document.getElementById("mensagem"),
    termos: document.getElementById("termos"),
    botaoLimpar: document.getElementById("botao-limpar"),
    botaoEnviar: document.getElementById("botao-enviar"),
  }

  // Elementos de erro
  const erros = {
    assunto: document.getElementById("erro-assunto"),
    nome: document.getElementById("erro-nome"),
    email: document.getElementById("erro-email"),
    confirmaEmail: document.getElementById("erro-confirma-email"),
    ddd: document.getElementById("erro-ddd"),
    telefone: document.getElementById("erro-telefone"),
    cidade: document.getElementById("erro-cidade"),
    estado: document.getElementById("erro-estado"),
    titulo: document.getElementById("erro-titulo"),
    mensagem: document.getElementById("erro-mensagem"),
    termos: document.getElementById("erro-termos"),
  }

  // Função para limpar o formulário
  formulario.botaoLimpar.addEventListener("click", () => {
    // Limpar todos os campos
    Object.values(formulario).forEach((campo) => {
      if (
        campo &&
        campo.tagName &&
        (campo.tagName === "INPUT" || campo.tagName === "TEXTAREA" || campo.tagName === "SELECT")
      ) {
        campo.value = ""
        if (campo.type === "checkbox") {
          campo.checked = false
        }
        // Remover classe de erro
        campo.parentElement.classList.remove("campo-erro")
      }
    })

    // Limpar mensagens de erro
    Object.values(erros).forEach((erro) => {
      if (erro) {
        erro.textContent = ""
      }
    })

    // Resetar o select para a opção padrão
    formulario.assunto.selectedIndex = 0
  })

  // Função para validar e-mail
  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // Função para validar números
  function validarNumero(numero) {
    return /^\d+$/.test(numero)
  }

  // Função para mostrar erro
  function mostrarErro(campo, mensagemErro) {
    const elementoCampo = formulario[campo]
    const elementoErro = erros[campo]

    if (elementoCampo && elementoErro) {
      elementoErro.textContent = mensagemErro
      elementoCampo.parentElement.classList.add("campo-erro")
      return false
    }
    return true
  }

  // Função para limpar erro
  function limparErro(campo) {
    const elementoCampo = formulario[campo]
    const elementoErro = erros[campo]

    if (elementoCampo && elementoErro) {
      elementoErro.textContent = ""
      elementoCampo.parentElement.classList.remove("campo-erro")
    }
  }

  // Validação em tempo real para os campos
  Object.keys(formulario).forEach((campo) => {
    const elemento = formulario[campo]
    if (
      elemento &&
      elemento.tagName &&
      (elemento.tagName === "INPUT" || elemento.tagName === "TEXTAREA" || elemento.tagName === "SELECT")
    ) {
      elemento.addEventListener("input", () => {
        validarCampo(campo)
      })

      elemento.addEventListener("blur", () => {
        validarCampo(campo)
      })
    }
  })

  // Função para validar um campo específico
  function validarCampo(campo) {
    const valor = formulario[campo].value.trim()

    switch (campo) {
      case "assunto":
        if (!valor) {
          return mostrarErro(campo, "Por favor, selecione um assunto.")
        }
        break

      case "nome":
        if (!valor) {
          return mostrarErro(campo, "O nome é obrigatório.")
        } else if (valor.length < 3) {
          return mostrarErro(campo, "O nome deve ter pelo menos 3 caracteres.")
        }
        break

      case "email":
        if (!valor) {
          return mostrarErro(campo, "O e-mail é obrigatório.")
        } else if (!validarEmail(valor)) {
          return mostrarErro(campo, "Por favor, insira um e-mail válido.")
        }
        break

      case "confirmaEmail":
        if (!valor) {
          return mostrarErro(campo, "A confirmação de e-mail é obrigatória.")
        } else if (valor !== formulario.email.value.trim()) {
          return mostrarErro(campo, "Os e-mails não coincidem.")
        }
        break

      case "ddd":
        if (!valor) {
          return mostrarErro(campo, "O DDD é obrigatório.")
        } else if (!validarNumero(valor)) {
          return mostrarErro(campo, "O DDD deve conter apenas números.")
        } else if (valor.length !== 2) {
          return mostrarErro(campo, "O DDD deve ter 2 dígitos.")
        }
        break

      case "telefone":
        if (!valor) {
          return mostrarErro(campo, "O telefone é obrigatório.")
        } else if (!validarNumero(valor)) {
          return mostrarErro(campo, "O telefone deve conter apenas números.")
        } else if (valor.length < 8 || valor.length > 9) {
          return mostrarErro(campo, "O telefone deve ter entre 8 e 9 dígitos.")
        }
        break

      case "cidade":
        if (!valor) {
          return mostrarErro(campo, "A cidade é obrigatória.")
        }
        break

      case "estado":
        if (!valor) {
          return mostrarErro(campo, "O estado é obrigatório.")
        } else if (valor.length !== 2) {
          return mostrarErro(campo, "Use a sigla do estado com 2 letras.")
        }
        break

      case "titulo":
        if (!valor) {
          return mostrarErro(campo, "O título da mensagem é obrigatório.")
        }
        break

      case "mensagem":
        if (!valor) {
          return mostrarErro(campo, "A mensagem é obrigatória.")
        } else if (valor.length < 10) {
          return mostrarErro(campo, "A mensagem deve ter pelo menos 10 caracteres.")
        }
        break

      case "termos":
        if (!formulario.termos.checked) {
          return mostrarErro(campo, "Você precisa concordar com os termos.")
        }
        break
    }

    // Se chegou aqui, não há erro neste campo
    limparErro(campo)
    return true
  }

  // Função para validar todo o formulário
  function validarFormulario() {
    let formValido = true

    // Validar cada campo
    Object.keys(formulario).forEach((campo) => {
      if (campo !== "botaoLimpar" && campo !== "botaoEnviar") {
        const campoValido = validarCampo(campo)
        formValido = formValido && campoValido
      }
    })

    return formValido
  }

  // Evento de envio do formulário
  formulario.botaoEnviar.addEventListener("click", () => {
    if (validarFormulario()) {
      // Simulação de envio bem-sucedido
      alert("Formulário enviado com sucesso! Em breve entraremos em contato.")

      // Limpar o formulário após o envio
      formulario.botaoLimpar.click()
    } else {
      // Rolar até o primeiro erro
      const primeiroErro = document.querySelector(".campo-erro")
      if (primeiroErro) {
        primeiroErro.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  })

  // Mascaras para campos específicos
  formulario.ddd.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 2)
  })

  formulario.telefone.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 9)
  })

  formulario.estado.addEventListener("input", function () {
    this.value = this.value
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 2)
      .toUpperCase()
  })
})
