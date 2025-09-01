const DATA_KEY = "jogadores";

function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function getData() {
    const data = localStorage.getItem(DATA_KEY);
    return data ? JSON.parse(data) : [];
}

function clearData() {
    localStorage.removeItem(DATA_KEY);
}

function removerJogadorPorNome(name) {
    saveData(getData().filter(i => i.nome !== name));
}

function alterarJogadorPorNome(name, newItem) {
    saveData(getData().map(i => i.nome === name ? newItem : i));
}

function buscaJogadorPorNome(name) {
    return findRecursivo(getData(), i => i.nome === name);
}

function buscaJogadorPorPosicao(position) {
    return findRecursivo(getData(), jogador => jogador.posicao === position);
}

function buscaJogadorPorPosicaoETime(position, time) {
    return findRecursivo(getData(), jogador => jogador.posicao === position && jogador.time === time);
}

function filtrarJogadoresPorPosicao(posicao) {
    return getData().filter(j => j.posicao === posicao);
}

function findRecursivo(array, callback, indice = 0) {
 
  if (indice >= array.length) {
    return undefined; 
  }

  const elementoAtual = array[indice];

 
  if (callback(elementoAtual, indice, array)) {
    return elementoAtual;
  }

  return findRecursivo(array, callback, indice + 1);
}

const Lib = {
    saveData,
    getData,
    clearData,
    removerJogadorPorNome,
    alterarJogadorPorNome,
    buscaJogadorPorNome,
    buscaJogadorPorPosicao,
    buscaJogadorPorPosicaoETime,
    filtrarJogadoresPorPosicao
};

export default Lib;