import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../supabaseClient";

const LinhaCandidato = ({ candidato }) => (
  <tr>
    <td>{candidato.nome_completo}</td>
    <td>{candidato.telefone}</td>
    <td>{candidato.email}</td>
    <td>{candidato.formacao_estetica}</td>
    <td>{candidato.tempo_experiencia}</td>
    <td>{candidato.disponibilidade_horario}</td>
    <td>{new Date(candidato.created_at).toLocaleDateString("pt-BR")}</td>
  </tr>
);

function Admin() {
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [candidatos, setCandidatos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSenhaChange = useCallback((e) => {
    setSenha(e.target.value);
  }, []);

  const carregarCandidatos = useCallback(async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("candidatos_esteticista")
      .select("*")
      .order("created_at", { ascending: false });

    setCarregando(false);

    if (error) {
      setErro("Erro ao carregar candidatos.");
      return;
    }

    setCandidatos(data);
  }, []);

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      if (senha === process.env.REACT_APP_ADMIN_PASSWORD) {
        setAutenticado(true);
        setErro("");
      } else {
        setErro("Senha incorreta.");
      }
    },
    [senha]
  );

  useEffect(() => {
    if (autenticado) {
      carregarCandidatos();
    }
  }, [autenticado, carregarCandidatos]);

  if (!autenticado) {
    return (
      <div className="container">
        <div className="card admin-login">
          <h2>Acesso Restrito</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={senha}
              onChange={handleSenhaChange}
              placeholder="Senha de acesso"
            />
            <button type="submit">Entrar</button>
          </form>
          {erro && <p className="erro">{erro}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container admin-painel">
      <h1>Candidatos - Esteticista</h1>
      {carregando && <p>Carregando...</p>}
      {erro && <p className="erro">{erro}</p>}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>E-mail</th>
            <th>Formação</th>
            <th>Experiência</th>
            <th>Disponibilidade</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {candidatos.map((c) => (
            <LinhaCandidato key={c.id} candidato={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
