import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [salas, setSalas] = useState([]);  // Estado para armazenar as salas
  const [numeroSala, setNumeroSala] = useState("");   // Estado para armazenar o número da sala inserido no formulário
  const [modoEdicao, setModoEdicao] = useState(false);  // Estado para controlar o modo de edição
  const [salaEditada, setSalaEditada] = useState(null);  // Estado para armazenar a sala sendo editada

  // Efeito que carrega as salas do localStorage ao iniciar o aplicativo
  useEffect(() => {
    const salasData = localStorage.getItem("salas");
    if (salasData) {
      setSalas(JSON.parse(salasData));
    }
  }, []);

  // Efeito que salva as salas no localStorage sempre que houver alterações
  useEffect(() => {
    localStorage.setItem("salas", JSON.stringify(salas));
  }, [salas]);

  // Função para lidar com a alteração do input do número da sala
  const handleInputChange = (event) => {
    setNumeroSala(event.target.value);
  };

  // Função para lidar com o envio do formulário
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Verificar se o número da sala está vazio
    if (numeroSala.trim() === "") {
      alert("Por favor, digite o número da sala.");
      return;
    }

    // Verificar se já existe uma sala com o mesmo número
    const salaExistente = salas.find((sala) => sala.numeroSala === numeroSala);
    if (salaExistente) {
      alert(
        "Já existe uma sala com esse número. Por favor, digite um número diferente."
      );
      return;
    }

    // Modo de edição
    if (modoEdicao) {
      if (salaEditada) {
        // Atualizar a sala editada com o novo número
        const salasAtualizadas = salas.map((sala) => {
          if (sala.id === salaEditada.id) {
            return { ...sala, numeroSala: numeroSala };
          }
          return sala;
        });
        setSalas(salasAtualizadas);
        setModoEdicao(false);
        setSalaEditada(null);
        setNumeroSala("");
      }
    }
    // Modo de cadastro
    else {
      // Criar uma nova sala com o número fornecido
      const novaSala = {
        id: salas.length + 1,
        numeroSala: numeroSala,
      };
      setSalas([...salas, novaSala]);
      setNumeroSala("");
    }
  };

  // Função para lidar com a exclusão de uma sala
  const handleDeleteSala = (id) => {
    // Filtrar as salas, removendo a sala com o ID correspondente
    const novasSalas = salas.filter((sala) => sala.id !== id);
    setSalas(novasSalas);
    reorganizarIDs(novasSalas);
  };

  // Função para reorganizar os IDs das salas após a exclusão
  const reorganizarIDs = (salasAtualizadas) => {
    const salasReorganizadas = salasAtualizadas.map((sala, index) => {
      return { ...sala, id: index + 1 };
    });
    setSalas(salasReorganizadas);
  };

  // Função para lidar com a edição de uma sala
  const handleEditSala = (sala) => {
    setModoEdicao(true);
    setSalaEditada(sala);
    setNumeroSala(sala.numeroSala);
  };

  return (
    <div className="container">
      <h1 className="titulo">Sistema de Salas</h1>

      <form className="formulario" onSubmit={handleFormSubmit}>
        <input
          type="number"
          className="campo-formulario"
          placeholder="Número da Sala"
          value={numeroSala}
          onChange={handleInputChange}
        />
        <button type="submit" className="botao botao-primario">
          {modoEdicao ? "Editar" : "Cadastrar"}
        </button>
      </form>

      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número da Sala</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id}>
              <td>{sala.id}</td>
              <td>{sala.numeroSala}</td>
              <td className="acoes">
                <button
                  className="botao botao-excluir"
                  onClick={() => handleDeleteSala(sala.id)}
                >
                  Excluir
                </button>
                <button
                  className="botao botao-primario"
                  onClick={() => handleEditSala(sala)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
