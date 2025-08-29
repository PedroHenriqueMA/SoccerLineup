import Lib from "./lib.js";

const campoJogadoresElemento = document.getElementById("campo-jogadores");
const canvas = document.getElementById("canvas");
const form = document.getElementById("forms");
const botoes = document.querySelectorAll("[data-action]");
const $jogadoresEscalados = document.getElementById("total-jogadores");
const $limiteJogadores = document.getElementById("limite-jogadores");
const $botaoTrocaTime = document.getElementById("troca-time");

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
botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        const acao = botao.dataset.action;
        actions[acao]();
    });
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
        //adicionando submissão
        const submit = form.querySelector("[data-action='submit']");
        submit.addEventListener("click", (event) => {
            event.preventDefault();

            //Coleta de dados do formulário
            const jogadores = Lib.getData();
            const formData = new FormData(form);
            const nome = formData.get("nome");
            const posicao = formData.get("posicao");

            //Etapas de verificação -> talvez mudar para tirar esse método find
            if (nome === "") return alert("Nome do jogador é obrigatório!");
            if (jogadores.find(j => j.nome === nome)) return alert("Jogador já escalado!");
            if (jogadores.find(j => j.posicao === posicao)) return alert("Jogador já escalado nessa posição!");

            //Adição do jogador
            jogadores.push({ nome, posicao });
            Lib.saveData(jogadores);
            addJogador({ nome, posicao });

            //Esconde o formulario
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
        form.appendChild(submit);
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
        `
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
        `
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
        console.log("Filtrar jogadores");
    },
    // pensando em tirar essa action daqui e colocar como função a parte
    mostrarEscalacao: () => {
        // Limpa o canvas
        canvas.innerHTML = "";

        // adiciona cada um dos jogadores ao canvas
        Lib.getData().forEach(jogador => {
            const div = document.createElement("div");
            div.className = "jogador";
            div.innerHTML = `
                <div class="jogador-info">
                    <p>${jogador.nome}</p>
                    <p style="font-size: 12px; padding: 5px; border-radius: 5px; background-color: #1A2E24;">${jogador.posicao}</p>
                </div>
                <button style="cursor: pointer; color: #ea7f41ff; background: none; border: none;">x</button>
                `;

            // Adiciona evento de remoção
            const $button = div.querySelector(".jogador button");
            $button.addEventListener("click", () => {
                removeJogador(jogador.nome);
            });

            // Adiciona o jogador ao canvas
            canvas.appendChild(div);
        });
    },
    mostrarEstatisticas: () => {
        console.log("Mostrar estatísticas");
    },
    importar: () => {
        console.log("Importar jogadores");
    },
    exportar: () => {
        console.log("Exportar jogadores");
    },
    reset: () => {
        Lib.clearData();
        canvas.innerHTML = "";
        campoJogadoresElemento.innerHTML = "";
        $jogadoresEscalados.textContent = "0";
    }
}

function addJogador({ nome, posicao }) {
    //adiciona jogador ao campo
    campoJogadoresElemento.innerHTML += `
        <div
            style="${posicoes[posicao]}; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 10;" data-jogador="${nome}">
            <img src="img/jogador-de-futebol.png" alt="${nome}" style="width: 30px; height: auto;">
            <p style="text-align: center; font-size: 16px;">${nome}</p>
        </div>
        `;
    //atualiza contador de jogadores escalados
    $jogadoresEscalados.textContent = Lib.getData().length;

    //exibe escalação
    actions.mostrarEscalacao();
}
function removeJogador(nome) {
    // remove do localStorage
    Lib.removePlayerByName(nome);

    // remove o node element
    const $jogadorRemovido = document.querySelector(`[data-jogador="${nome}"]`);
    $jogadorRemovido.remove();

    //exibe a escalação atualizada
    actions.mostrarEscalacao();

    // atualiza o contador de jogadores escalados
    $jogadoresEscalados.textContent = Lib.getData().length;
}

function alterarPosicaoJogador(nome, novaPosicao) {
    const jogadores = Lib.getData();
    const jogador = jogadores.find(j => j.nome === nome);

    if (!jogador) return alert("Jogador não encontrado!");
    if (jogadores.find(j => j.posicao === novaPosicao)) return alert("Já existe um jogador nessa posição!");

    const novoItem = { nome: jogador.nome, posicao: novaPosicao };
    Lib.alterPlayerByName(nome, novoItem);

    // Atualiza o jogador no campo
    const $jogadorElemento = document.querySelector(`[data-jogador="${nome}"]`);
    if ($jogadorElemento) {
        $jogadorElemento.style = `${posicoes[novaPosicao]}; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 10;`;
    }

    // Exibe a escalação atualizada
    actions.mostrarEscalacao();
}

function alterarNomeJogador(nome, novoNome) {
    const jogadores = Lib.getData();
    const jogador = jogadores.find(j => j.nome === nome);

    if (!jogador) return alert("Jogador não encontrado!");
    if (jogadores.find(j => j.nome === novoNome)) return alert("Já existe um jogador com esse nome!");

    const novoItem = { nome: novoNome, posicao: jogador.posicao };
    Lib.alterPlayerByName(nome, novoItem);

    // Atualiza o jogador no campo
    const $jogadorElemento = document.querySelector(`[data-jogador="${nome}"]`);
    if ($jogadorElemento) {
        $jogadorElemento.dataset.jogador = `${novoNome}`;
        $jogadorElemento.querySelector("p").textContent = novoNome;
    }

    // Exibe a escalação atualizada
    actions.mostrarEscalacao();
}

// Carrega os jogadores salvos no localStorage ao iniciar a página
Lib.getData().forEach(jogador => addJogador({ nome: jogador.nome, posicao: jogador.posicao }));


{/* 
    <div                POSICAO
        style="(grid-column: 1; grid-row: 4/6); display: flex; justify-content: center; align-items: center; flex-direction: column;">
        <img src="assets/img/jogador-de-futebol.png" alt="fulano" style="width: 30px; height: auto;">
        <p>fulano</p>                                  NOME
            NOME
    </div> 
 */}


// Fazer funções novas
// -> guardar estatisticas de jogo (asistencias, gols, cartões)
//    -> mudar como o objeto
//    -> funçao pra mostrar as estatisticas

const jogador = {
    nome: '',
    posicao: '',
    estatisticas: {
        assistencias: 0,
        gols: 0,
        cartoes: 0
    },
    time: 'azul',
    escalado: false
}
// criar recursividade de: jogadores.find(jogador => jogador.nome === nome) e jogadores.find(jogador => jogador.posicao === posicao);
// fazer uma função que filtra os jogadores por posição