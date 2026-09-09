import React, { useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

// Componentes definidos FORA do componente pai para evitar perda de foco a cada tecla digitada
const Campo = ({ label, name, type = "text", value, onChange, required = true, options, placeholder }) => {
  if (type === "select") {
    return (
      <div className="campo">
        <label htmlFor={name}>{label} {required && <span className="obrigatorio">*</span>}</label>
        <select id={name} name={name} value={value} onChange={onChange} required={required}>
          <option value="">Selecione</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="campo">
        <label htmlFor={name}>{label} {required && <span className="obrigatorio">*</span>}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} rows={4} />
      </div>
    );
  }

  return (
    <div className="campo">
      <label htmlFor={name}>{label} {required && <span className="obrigatorio">*</span>}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} />
    </div>
  );
};

const estadoInicial = {
  nome_completo: "",
  cpf: "",
  email: "",
  telefone: "",
  cidade: "",
  estado: "",
  formacao_estetica: "",
  instituicao_ensino: "",
  ano_conclusao: "",
  ja_atuou_esteticista: "",
  procedimentos_dominados: "",
  tempo_experiencia: "",
  empresa_anterior: "",
  disponibilidade_horario: "",
  pretensao_salarial: "",
  motivo_interesse: "",
  experiencia_atendimento_publico: "",
  lgpd_consentimento: false,
};

function Questionario() {
  const [dados, setDados] = useState(estadoInicial);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setDados((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErro("");

      if (!dados.lgpd_consentimento) {
        setErro("É necessário aceitar os termos de consentimento para prosseguir.");
        return;
      }

      setEnviando(true);

      const { error } = await supabase.from("candidatos_esteticista").insert([
        {
          nome_completo: dados.nome_completo,
          cpf: dados.cpf,
          email: dados.email,
          telefone: dados.telefone,
          cidade: dados.cidade,
          estado: dados.estado,
          formacao_estetica: dados.formacao_estetica,
          instituicao_ensino: dados.instituicao_ensino,
          ano_conclusao: dados.ano_conclusao,
          ja_atuou_esteticista: dados.ja_atuou_esteticista,
          procedimentos_dominados: dados.procedimentos_dominados,
          tempo_experiencia: dados.tempo_experiencia,
          empresa_anterior: dados.empresa_anterior,
          disponibilidade_horario: dados.disponibilidade_horario,
          pretensao_salarial: dados.pretensao_salarial,
          motivo_interesse: dados.motivo_interesse,
          experiencia_atendimento_publico: dados.experiencia_atendimento_publico,
          lgpd_consentimento: dados.lgpd_consentimento,
        },
      ]);

      setEnviando(false);

      if (error) {
        setErro("Ocorreu um erro ao enviar o formulário. Tente novamente.");
        return;
      }

      setEnviado(true);
    },
    [dados]
  );

  if (enviado) {
    return (
      <div className="container">
        <div className="card sucesso">
          <h2>Obrigado pelo seu interesse!</h2>
          <p>Seu cadastro para a vaga de Esteticista foi recebido com sucesso.</p>
          <p>Nossa equipe entrará em contato pelos dados informados caso seu perfil avance no processo seletivo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <header className="cabecalho">
          <h1>Questionário de Candidatura</h1>
          <h2>Vaga: Esteticista</h2>
          <p className="subtitulo">Campo Grande/MS</p>
        </header>

        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados Pessoais</legend>
            <Campo label="Nome completo" name="nome_completo" value={dados.nome_completo} onChange={handleChange} />
            <Campo label="CPF" name="cpf" value={dados.cpf} onChange={handleChange} placeholder="000.000.000-00" />
            <Campo label="E-mail" name="email" type="email" value={dados.email} onChange={handleChange} />
            <Campo label="Telefone / WhatsApp" name="telefone" value={dados.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
            <Campo label="Cidade" name="cidade" value={dados.cidade} onChange={handleChange} />
            <Campo label="Estado" name="estado" value={dados.estado} onChange={handleChange} />
          </fieldset>

          <fieldset>
            <legend>Formação</legend>
            <Campo
              label="Possui Ensino Superior completo em Estética?"
              name="formacao_estetica"
              type="select"
              value={dados.formacao_estetica}
              onChange={handleChange}
              options={["Sim, completo", "Cursando", "Não possuo"]}
            />
            <Campo label="Instituição de ensino" name="instituicao_ensino" value={dados.instituicao_ensino} onChange={handleChange} />
            <Campo label="Ano de conclusão ou previsão de conclusão" name="ano_conclusao" value={dados.ano_conclusao} onChange={handleChange} />
          </fieldset>

          <fieldset>
            <legend>Experiência Profissional</legend>
            <Campo
              label="Já atuou como esteticista?"
              name="ja_atuou_esteticista"
              type="select"
              value={dados.ja_atuou_esteticista}
              onChange={handleChange}
              options={["Sim", "Não"]}
            />
            <Campo
              label="Quais procedimentos estéticos você domina?"
              name="procedimentos_dominados"
              type="textarea"
              value={dados.procedimentos_dominados}
              onChange={handleChange}
              placeholder="Descreva os procedimentos que você realiza"
            />
            <Campo label="Tempo de experiência na área" name="tempo_experiencia" value={dados.tempo_experiencia} onChange={handleChange} />
            <Campo label="Empresa ou clínica anterior" name="empresa_anterior" value={dados.empresa_anterior} onChange={handleChange} />
          </fieldset>

          <fieldset>
            <legend>Disponibilidade</legend>
            <Campo
              label="Tem disponibilidade para o horário de segunda a sexta feira, das 08:00 às 17:00 horas, e sábado das 08:00 às 12:00 horas?"
              name="disponibilidade_horario"
              type="select"
              value={dados.disponibilidade_horario}
              onChange={handleChange}
              options={["Sim, tenho disponibilidade total", "Tenho disponibilidade parcial"]}
            />
            <Campo label="Pretensão salarial" name="pretensao_salarial" value={dados.pretensao_salarial} onChange={handleChange} />
          </fieldset>

          <fieldset>
            <legend>Sobre Você</legend>
            <Campo
              label="Qual o motivo do seu interesse nesta vaga?"
              name="motivo_interesse"
              type="textarea"
              value={dados.motivo_interesse}
              onChange={handleChange}
            />
            <Campo
              label="Já possui experiência em atendimento ao público?"
              name="experiencia_atendimento_publico"
              type="select"
              value={dados.experiencia_atendimento_publico}
              onChange={handleChange}
              options={["Sim", "Não"]}
            />
          </fieldset>

          <fieldset>
            <legend>Autorização de Uso de Dados</legend>
            <div className="lgpd">
              <p>
                Ao preencher este formulário, você autoriza a Genthe Consultoria em Gestão de Pessoas a coletar e tratar
                os dados pessoais informados, com a finalidade exclusiva de conduzir o processo seletivo para a vaga de
                Esteticista, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
              <p>
                Os dados informados poderão ser compartilhados com a empresa contratante responsável pela vaga, apenas
                para fins de avaliação e seleção, sendo armazenados pelo prazo necessário à condução do processo seletivo
                e eliminados posteriormente, salvo obrigação legal de retenção.
              </p>
              <p>
                Você também autoriza, mediante o fornecimento de seu CPF e nome completo, a realização de consulta de
                antecedentes judiciais como etapa complementar do processo seletivo, sendo os resultados utilizados
                exclusivamente para fins de avaliação da candidatura.
              </p>
            </div>
            <label className="checkbox-lgpd">
              <input
                type="checkbox"
                name="lgpd_consentimento"
                checked={dados.lgpd_consentimento}
                onChange={handleChange}
              />
              Li e autorizo o tratamento dos meus dados pessoais conforme descrito acima.
            </label>
          </fieldset>

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar candidatura"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Questionario;
