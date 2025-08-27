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

function removePlayerByName(name) {
    const dados = getData();
    saveData(dados.filter(i => i.nome !== name));
}

function alterPlayerByName(nome, newItem) {
    const dados = getData();
    saveData(dados.map(i => i.nome === nome ? newItem : i));
}

const Lib = { saveData, getData, clearData, removePlayerByName, alterPlayerByName };

export default Lib;