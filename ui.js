import Lib from "./lib.js";

const campoJogadoresElemento = document.getElementById("campo-jogadores");
const canvas = document.getElementById("canvas");
const form = document.getElementById("forms");
const botoes = document.querySelectorAll("[data-action]");
const $jogadoresEscalados = document.getElementById("total-jogadores");
const $limiteJogadores = document.getElementById("limite-jogadores");

// Define as posições dos jogadores
const posicoes = {
    GOL: "grid-column: 1; grid-row: 4/6;",
    LE: "grid-column: 2; grid-row: 2/3;",
    LD: "grid-column: 2; grid-row: 7/8;",

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

        // Criação do formulário
        form.innerHTML = `
        <li class="field">
            <label for="nome">Nome do Jogador:</label>
            <input type="text" name="nome" placeholder="Nome do Jogador" required>
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
        });
    },
    remover: () => {
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
        });
        form.appendChild(submit);
    },
    alterarPosicao: () => {
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
        });
    },
    alterarNome: () => {
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
                    <p style="font-size: 12px; color: gray;">${jogador.posicao}</p>
                </div>
                <button style="cursor: pointer; color: red; background: none; border: none;" data-action="remove-jogador">x</button>
                `;

            // Adiciona evento de remoção
            const $button = div.querySelector("[data-action='remove-jogador']");
            $button.addEventListener("click", () => {
                removeJogador(jogador);
            });

            // Adiciona o jogador ao canvas
            canvas.appendChild(div);
        });
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
    }
}

function addJogador({ nome, posicao }) {
    //adiciona jogador ao campo
    campoJogadoresElemento.innerHTML += `
        <div
            style="${posicoes[posicao]}; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 10;" data-jogador="${nome}">
            <img src="img/jogador-de-futebol.png" alt="${nome}" style="width: 30px; height: auto;">
            <p>${nome}</p>
        </div>
        `;
    //atualiza contador de jogadores escalados
    $jogadoresEscalados.textContent = Lib.getData().length;

    //exibe escalação
    actions.mostrarEscalacao();
}
function removeJogador(nome) {
    // remove do localStorage
    Lib.removeDataByName(nome);

    // remove o node element
    const $jogadorRemovido = document.getElementById(`[data-jogador=${nome}]`);
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
    Lib.alterData(nome, novoItem);

    // Atualiza o jogador no campo
    const $jogadorElemento = document.getElementById(`[data-jogador=${nome}]`);
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
    Lib.alterData(nome, novoItem);

    // Atualiza o jogador no campo
    const $jogadorElemento = document.getElementById(`[data-jogador=${nome}]`);
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


// Fazer funções auxiliares
// para usar recursividade ao inves de loops e métodos de array: jogadores.find(jogador => jogador.nome === nome) e jogadores.find(jogador => jogador.posicao === posicao);
