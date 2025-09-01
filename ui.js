import Lib from "./lib.js";

const $campoJogadores = document.getElementById("campo-jogadores");
const $canvas = document.getElementById("canvas");
const form = document.getElementById("forms");
const $botoes = document.querySelectorAll("[data-action]");
const $jogadoresEscalados = document.getElementById("total-jogadores");
const $limiteJogadores = document.getElementById("limite-jogadores");
const $botaoTrocaTimeAtivo = document.getElementById("troca-time");
const $timeAtivo = document.getElementById("time-ativo");

// Define as posições dos jogadores
const posicoes = {
    GOL: "grid-column: 1; grid-row: 4/6;",
    LE: "grid-column: 2/4; grid-row: 2/3;",
    LD: "grid-column: 2/4; grid-row: 7/8;",

    ZAGE: "grid-column: 2; grid-row: 3/5;",
    ZAG: "grid-column: 2; grid-row: 4/6;",
    ZAGD: "grid-column: 2; grid-row: 5/7;",

    VOLE: "grid-column: 3/5; grid-row: 3/4;",
    VOL: "grid-column: 3/5; grid-row: 4/6;",
    VOLD: "grid-column: 3/5; grid-row: 6/7;",

    ME: "grid-column: 5; grid-row: 2/3;",
    MD: "grid-column: 5; grid-row: 7/8;",
    MC: "grid-column: 5; grid-row: 4/6;",
    MCE: "grid-column: 5; grid-row: 3/5;",
    MCD: "grid-column: 5; grid-row: 5/7;",
    MEI: "grid-column: 6; grid-row: 4/6;",

    PE: "grid-column: 7; grid-row: 2/3;",
    PD: "grid-column: 7; grid-row: 7/8;",
    CAE: "grid-column: 7/9; grid-row: 3/5;",
    CA: "grid-column: 7/9; grid-row: 4/6;",
    CAD: "grid-column: 7/9; grid-row: 5/7;",
}

// Adiciona eventos aos botões
$botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        const acao = botao.dataset.action;
        actions[acao]();
    });
});

$botaoTrocaTimeAtivo.addEventListener("click", () => {
    // Troca o time ativo
    $timeAtivo.value = $timeAtivo.value === "azul" ? "vermelho" : "azul";

    // mostra e adiciona os jogadores no campo
    actions.mostrarEscalacao();
    $campoJogadores.innerHTML = "";
    Lib.getData().forEach(jogador => {
        if (jogador.time !== $timeAtivo.value) return; // Mostra apenas jogadores do time ativo
        adicionaJogadorAoCampo(jogador);
    });

    // Exibe marcação do time ativo
    $campoJogadores.style.borderColor = $timeAtivo.value === "azul" ? "#008080" : "#3D0000";

    // Marca o número de jogadores escalados
    $jogadoresEscalados.textContent = Lib.getData().filter(j => j.time === $timeAtivo.value).length;
});

// eventos dos botões
const actions = {
    adicionar: () => {
        // Verifica se o limite de jogadores foi atingido
        if (Number($limiteJogadores.value) <= Number($jogadoresEscalados.innerText)) return alert("Limite de jogadores atingido!");

        //Exibe o Formulario
        form.classList.add("show");

        // Criação do formulário
        form.innerHTML = `
        <li class="field">
            <label for="nome">Nome do Jogador:</label>
            <input type="text" name="nome" placeholder="Nome do Jogador" required max="15">
        </li>
        <li class="field">
            <label for="posicao">Posição do Jogador:</label>
            <select name="posicao" id="posicao">
                <option value="CA">Centroavante</option>
                <option value="CAE">Centroavante esquerdo</option>
                <option value="CAD">Centroavante direito</option>
                <option value="PD">Ponta direita</option>
                <option value="PE">Ponta esquerda</option>
                <option value="MEI">Meia atacante</option>
                <option value="ME">Meio esquerdo</option>
                <option value="MD">Meio Direito</option>
                <option value="MCE">Meio campo esquerdo</option>
                <option value="MCD">Meio campo direito</option>
                <option value="MC">Meio campo</option>
                <option value="VOLE">Volante esquerdo</option>
                <option value="VOLD">Voltante direito</option>
                <option value="VOL">Volante</option>
                <option value="LD">Lateral Direito</option>
                <option value="LE">Lateral Esquerdo</option>
                <option value="ZAG">Zagueiro central</option>
                <option value="ZAGE">Zagueiro esquerdo</option>
                <option value="ZAGD">Zagueiro direito</option>
                <option value="GOL">Goleiro</option>
            </select>
        </li>
        <button style="background-color: #4CAF50;" data-action="submit" class="submit" type="submit">Adicionar Jogador</button>
        `
        //Adicionando submissão
        const submit = form.querySelector("[data-action='submit']");
        submit.addEventListener("click", (event) => {
            event.preventDefault();

            //Coleta de dados do formulário
            const jogadores = Lib.getData();
            const formData = new FormData(form);
            const nome = formData.get("nome");
            const posicao = formData.get("posicao");

            //Etapas de verificação
            if (nome === "") return alert("Nome do jogador é obrigatório!");
            if (Lib.buscaJogadorPorNome(nome)) return alert("Jogador já existe!");

            if (Lib.buscaJogadorPorPosicaoETime(posicao, $timeAtivo.value)) return alert("Jogador já escalado nessa posição!");
            // Novo objeto de jogador com estatísticas
            const novoJogador = {
                nome,
                posicao,
                estatisticas: { assistencias: 0, gols: 0, cartoes: 0 },
                time: $timeAtivo.value,
                escalado: true
            };

            // Adiciona o novo jogador
            jogadores.push(novoJogador);
            Lib.saveData(jogadores);
            adicionaJogadorAoCampo(novoJogador);
            form.classList.remove("show");
        });
    },
    remover: () => {
        //Exibe o Formulario
        form.classList.add("show");

        //Criação do formulário
        form.innerHTML = `
            <li class="field">
                <label for="nome">Nome do Jogador:</label>
                <input type="text" name="nome" placeholder="Nome do Jogador" required>
            </li>
            <button style="background-color: #ff2c2c;" data-action="submit" class="submit" type="submit">Remover Jogador</button>
        `;

        //Adicionando submissão
        const submit = form.querySelector("[data-action='submit']");
        submit.addEventListener("click", (event) => {
            event.preventDefault();

            //Coleta de dados
            const formData = new FormData(form);
            const nome = formData.get("nome");

            //Remoção do jogador
            removeJogador(nome);

            //Esconde o formulario
            form.classList.remove("show");
        });
    },
    alterarPosicao: () => {
        //Exibe o Formulario
        form.classList.add("show");
        form.innerHTML = `
            <li class="field">
                <label for="nome">Nome do Jogador:</label>
                <input type="text" name="nome" placeholder="Nome do Jogador" required>
            </li>
            <li class="field">
                <label for="posicao">Nova posição do Jogador:</label>
                <select name="posicao" id="posicao">
                    <option value="CA">Centroavante</option>
                    <option value="CAE">Centroavante esquerdo</option>
                    <option value="CAD">Centroavante direito</option>
                    <option value="PD">Ponta direita</option>
                    <option value="PE">Ponta esquerda</option>
                    <option value="MEI">Meia atacante</option>
                    <option value="ME">Meio esquerdo</option>
                    <option value="MD">Meio Direito</option>
                    <option value="MCE">Meio campo esquerdo</option>
                    <option value="MCD">Meio campo direito</option>
                    <option value="MC">Meio campo</option>
                    <option value="LD">Lateral Direito</option>
                    <option value="LE">Lateral Esquerdo</option>
                    <option value="ZAG">Zagueiro central</option>
                    <option value="ZAGE">Zagueiro esquerdo</option>
                    <option value="ZAGD">Zagueiro direito</option>
                    <option value="GOL">Goleiro</option>
                </select>
            </li>
            <button style="background-color: #ffa72cff;" data-action="submit" class="submit" type="submit">Alterar Jogador</button>
        `;
        const submit = form.querySelector("[data-action='submit']");
        submit.addEventListener("click", (event) => {
            event.preventDefault();

            //Coleta de dados
            const formData = new FormData(form);
            const nome = formData.get("nome");
            const posicao = formData.get("posicao");

            //Altera a posição do jogador
            alterarPosicaoJogador(nome, posicao);

            //Esconde o formulario
            form.classList.remove("show");
        });
    },
    alterarNome: () => {
        //Exibe o Formulario
        form.classList.add("show");
        form.innerHTML = `
            <li class="field">
                <label for="nome">Nome do Jogador:</label>
                <input type="text" name="nome" placeholder="Nome do Jogador" required>
            </li>
            <li class="field">
                <label for="novo-nome">Novo nome do Jogador:</label>
                <input type="text" name="novo-nome" placeholder="Novo nome do Jogador" required>
            </li>
            <button style="background-color: #ffa72cff;" data-action="submit" class="submit" type="submit">Alterar Jogador</button>
        `;
        const submit = form.querySelector("[data-action='submit']");
        submit.addEventListener("click", (event) => {
            event.preventDefault();

            //Coleta de dados
            const formData = new FormData(form);
            const nome = formData.get("nome");
            const novoNome = formData.get("novo-nome");

            //Altera o nome do jogador
            alterarNomeJogador(nome, novoNome);

            //Esconde o formulario
            form.classList.remove("show");
        });
    },
    filtrar: () => {
        // mostra o formulario
        form.classList.add("show");
        form.innerHTML = `
            <li class="field">
                <label for="posicao">Posição do Jogador:</label>
                <select name="posicao" id="posicao">
                    <option value="TODAS">Todas</option>
                    <option value="CA">Centroavante</option>
                    <option value="CAE">Centroavante esquerdo</option>
                    <option value="CAD">Centroavante direito</option>
                    <option value="PD">Ponta direita</option>
                    <option value="PE">Ponta esquerda</option>
                    <option value="MEI">Meia atacante</option>
                    <option value="ME">Meio esquerdo</option>
                    <option value="MD">Meio Direito</option>
                    <option value="MCE">Meio campo esquerdo</option>
                    <option value="MCD">Meio campo direito</option>
                    <option value="MC">Meio campo</option>
                    <option value="VOLE">Volante esquerdo</option>
                    <option value="VOLD">Voltante direito</option>
                    <option value="VOL">Volante</option>
                    <option value="LD">Lateral Direito</option>
                    <option value="LE">Lateral Esquerdo</option>
                    <option value="ZAG">Zagueiro central</option>
                    <option value="ZAGE">Zagueiro esquerdo</option>
                    <option value="ZAGD">Zagueiro direito</option>
                    <option value="GOL">Goleiro</option>
                </select>
            </li>
            <button style="background-color: #4CAF50;" data-action="submit" class="submit" type="submit">Filtrar</button>
        `;
        // Submissao de Filtro
        const submit = form.querySelector("[data-action='submit']");
        submit.addEventListener("click", (event) => {
            event.preventDefault();
            // coleta dados
            const formData = new FormData(form);
            const posicao = formData.get("posicao");

            // Filtra jogadores por posição
            if (posicao === "TODAS") {
                $canvas.innerHTML = "";
                Lib.getData().forEach(jogador => exibeJogadorComEstatisticas(jogador));
            } else {
                $canvas.innerHTML = "";
                const jogadoresFiltrados = Lib.filtrarJogadoresPorPosicao(posicao)
                jogadoresFiltrados.forEach(jogador => exibeJogadorComEstatisticas(jogador));
            }
            // esconde o fomulario
            form.classList.remove("show");
        });
    },
    mostrarEscalacao: () => {
        // Limpa o canvas
        $canvas.innerHTML = "";

        // adiciona cada um dos jogadores ao canvas
        Lib.getData().forEach(jogador => {
            if (jogador.time !== $timeAtivo.value) return; // Mostra apenas jogadores do time ativo
            exibeJogadorSemEstatisticas(jogador);
        });
    },
    mostrarEstatisticas: () => {
        //Limpa canvas
        $canvas.innerHTML = "";

        // Adiciona cada jogador com estatísticas
        Lib.getData().forEach(jogador => {
            exibeJogadorComEstatisticas(jogador);
        });
    },
    atualizarEstatisticas: () => {
        form.classList.add("show");
        form.innerHTML = `
            <li class="field">
                <label for="nome">Nome do Jogador:</label>
                <input type="text" name="nome" placeholder="Nome do Jogador" required>
            </li>
            <li class="field">
                <label for="gols">Gols:</label>
                <input type="number" name="gols" min="0" value="0">
            </li>
            <li class="field">
                <label for="assistencias">Assistências:</label>
                <input type="number" name="assistencias" min="0" value="0">
            </li>
            <li class="field">
                <label for="cartoes">Cartões:</label>
                <input type="number" name="cartoes" min="0" value="0">
            </li>
            <button style="background-color: #4CAF50;" data-action="submit" class="submit" type="submit">Atualizar</button>
        `;
        // Adiciona evento de submit
        const submit = form.querySelector("[data-action='submit']");
        submit.addEventListener("click", (event) => {
            event.preventDefault();
            //coleta dados do formulario
            const formData = new FormData(form);
            const nome = formData.get("nome");
            const jogador = Lib.buscaJogadorPorNome(nome);

            // Verifica se o jogador existe
            if (!jogador) return alert("Jogador não encontrado!");

            // Atualiza estatísticas
            jogador.estatisticas.gols += Number(formData.get("gols"));
            jogador.estatisticas.assistencias += Number(formData.get("assistencias"));
            jogador.estatisticas.cartoes += Number(formData.get("cartoes"));

            Lib.alterarJogadorPorNome(nome, jogador);
            actions.mostrarEstatisticas();
            form.classList.remove("show");
        });
    },
    reset: () => {
        Lib.clearData();
        $canvas.innerHTML = "";
        $campoJogadores.innerHTML = "";
        $jogadoresEscalados.textContent = "0";
    }
}

function adicionaJogadorAoCampo({ nome, posicao }) {
    $campoJogadores.innerHTML += `
        <div
            style="${posicoes[posicao]}; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 10;" data-jogador="${nome}">
            <img src="img/jogador-de-futebol.png" alt="${nome}" style="width: 30px; height: auto;">
            <p style="text-align: center; font-size: 16px;">${nome}</p>
        </div>
        `;
    //atualiza contador de jogadores escalados
    $jogadoresEscalados.textContent = Number($jogadoresEscalados.textContent) + 1;

    //exibe escalação
    actions.mostrarEscalacao();
}

function removeJogador(nome) {
    // remove do localStorage
    Lib.removerJogadorPorNome(nome);

    // remove o node element se o jogador existir
    const $jogadorRemovido = document.querySelector(`[data-jogador="${nome}"]`);
    if (!$jogadorRemovido) return;
    $jogadorRemovido.remove();
    actions.mostrarEscalacao();

    // atualiza o contador de jogadores escalados
    $jogadoresEscalados.textContent = Number($jogadoresEscalados.textContent) - 1;
}

function alterarPosicaoJogador(nome, novaPosicao) {
    //Busca jogador
    const jogador = Lib.buscaJogadorPorNome(nome);

    //Validações
    if (!jogador) return alert("Jogador não encontrado!");
    if (Lib.buscaJogadorPorPosicaoETime(novaPosicao, $timeAtivo.value)) return alert("Já existe um jogador nessa posição!");

    //Altera Jogador
    const novoItem = { ...jogador, posicao: novaPosicao };
    Lib.alterarJogadorPorNome(nome, novoItem);

    // Atualiza a exibição
    const $jogadorElemento = document.querySelector(`[data-jogador="${nome}"]`);
    if ($jogadorElemento) {
        $jogadorElemento.style = `${posicoes[novaPosicao]}; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 10;`;
    }
    actions.mostrarEscalacao();
}

function alterarNomeJogador(nome, novoNome) {
    //Busca jogador
    const jogador = Lib.buscaJogadorPorNome(nome);

    //Validações
    if (!jogador) return alert("Jogador não encontrado!");
    if (Lib.buscaJogadorPorNome(novoNome)) return alert("Já existe um jogador com esse nome!");

    //Altera Jogador
    const novoItem = { ...jogador, nome: novoNome };
    Lib.alterarJogadorPorNome(nome, novoItem);

    // Atualiza a exibição
    const $jogadorElemento = document.querySelector(`[data-jogador="${nome}"]`);
    if ($jogadorElemento) {
        $jogadorElemento.dataset.jogador = novoNome;
        $jogadorElemento.querySelector("p").textContent = novoNome;
    }
    actions.mostrarEscalacao();
}


function exibeJogadorComEstatisticas(jogador) {
    //Cria o elemento
    const div = document.createElement("div");
    div.className = "jogador";
    div.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: start; gap: 5px;">
            <div class="jogador-info">
                <p style="font-weight: bold;">${jogador.nome}</p>
                <p style="font-size: 12px; padding: 5px; border-radius: 5px; background-color: #1A2E24;">${jogador.posicao}</p>
                <p style="font-size: 12px; padding: 5px; border-radius: 5px; background-color: ${jogador.time === "azul" ? "#008080" : "#3D0000"}">${jogador.time}</p>
            </div>
            <p style="font-size: 12px; padding: 5px; border-radius: 5px; background-color: #1A2E24;">
                Gols: ${jogador.estatisticas.gols} | Assist.: ${jogador.estatisticas.assistencias} | Cartões: ${jogador.estatisticas.cartoes}
            </p>
        </div>
        <button style="cursor: pointer; color: #ea7f41ff; background: none; border: none;">x</button>
     `;
    
     // Adiciona evento de remoção
    const $button = div.querySelector(".jogador button");
    $button.addEventListener("click", () => removeJogador(jogador.nome));
    $canvas.appendChild(div);

    // Adiciona o elemento ao canvas
    $canvas.appendChild(div);
}

function exibeJogadorSemEstatisticas(jogador) {
    // Cria o elemento
    const div = document.createElement("div");
    div.className = "jogador";
    div.innerHTML = `
        <div class="jogador-info">
            <p>${jogador.nome}</p>
            <p style="font-size: 12px; padding: 5px; border-radius: 5px; background-color: #1A2E24;">${jogador.posicao}</p>
            <p style="font-size: 12px; padding: 5px; border-radius: 5px; background-color: ${jogador.time === "azul" ? "#008080" : "#3D0000"}">${jogador.time}</p>
        </div>
        <button style="cursor: pointer; color: #ea7f41ff; background: none; border: none;">x</button>
    `;
    // Adiciona evento de remoção
    const $button = div.querySelector(".jogador button");
    $button.addEventListener("click", () => removeJogador(jogador.nome));

    // Adiciona o elemento ao canvas
    $canvas.appendChild(div);
}

// Carrega os jogadores salvos no localStorage ao iniciar a página
Lib.getData().forEach(jogador => jogador.time === $timeAtivo.value ? adicionaJogadorAoCampo(jogador) : '');