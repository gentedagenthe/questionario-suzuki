import React, { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const TOTAL_ETAPAS = 3;

const estilos = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f4f7fb; color: #1a1a2e; }

  .wrap { max-width: 680px; margin: 0 auto; padding: 24px 16px 60px; }

  .header { text-align: center; margin-bottom: 32px; }
  .logo-texto { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #1B6FAB; letter-spacing: -1px; }
  .logo-n { color: #6BBF4E; }
  .tagline { font-size: 0.78rem; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .subtitulo-vaga { font-size: 0.9rem; color: #1B6FAB; font-weight: 600; margin-top: 6px; }

  .card-vaga { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); margin-bottom: 24px; }
  .titulo-vaga { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.7rem; color: #1B6FAB; margin-bottom: 4px; }
  .sub-vaga { font-size: 0.9rem; color: #666; margin-bottom: 24px; }
  .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .info-card { background: #f4f7fb; border-radius: 10px; padding: 14px 16px; }
  .info-icon { font-size: 1.2rem; margin-bottom: 4px; }
  .info-label { font-size: 0.72rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .info-valor { font-size: 0.95rem; font-weight: 600; color: #1a1a2e; margin-top: 2px; }
  .secao-titulo { font-size: 0.78rem; font-weight: 700; color: #1B6FAB; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
  .lista-beneficios { list-style: none; margin-bottom: 24px; }
  .lista-beneficios li { display: flex; align-items: center; gap: 8px; font-size: 0.92rem; color: #444; padding: 5px 0; }
  .check { color: #6BBF4E; font-weight: 700; font-size: 1rem; }
  .lista-requisitos { list-style: none; margin-bottom: 28px; }
  .lista-requisitos li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.9rem; color: #444; padding: 5px 0; line-height: 1.5; }
  .btn-candidatar { width: 100%; background: #1B6FAB; color: #fff; border: none; border-radius: 10px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-candidatar:hover { background: #155a8a; }

  .card-lgpd { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); }
  .lgpd-icon { font-size: 2rem; margin-bottom: 12px; }
  .lgpd-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.2rem; color: #1B6FAB; margin-bottom: 16px; }
  .lgpd-texto { font-size: 0.88rem; color: #555; line-height: 1.8; margin-bottom: 20px; }
  .lgpd-texto strong { color: #1a1a2e; }
  .lgpd-check { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; cursor: pointer; }
  .lgpd-check input { width: 18px; height: 18px; margin-top: 2px; accent-color: #1B6FAB; cursor: pointer; flex-shrink: 0; }
  .lgpd-check span { font-size: 0.88rem; color: #333; line-height: 1.6; }
  .erro-lgpd { color: #e53935; font-size: 0.82rem; margin-bottom: 12px; }
  .btn-iniciar { width: 100%; background: #6BBF4E; color: #fff; border: none; border-radius: 10px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-iniciar:hover { background: #57a33e; }

  .progresso-wrap { margin-bottom: 28px; }
  .progresso-bar-bg { background: #e0eaf4; border-radius: 99px; height: 6px; margin-bottom: 8px; }
  .progresso-bar { background: linear-gradient(90deg, #1B6FAB, #6BBF4E); border-radius: 99px; height: 6px; transition: width 0.4s; }
  .progresso-texto { font-size: 0.78rem; color: #888; text-align: right; }

  .card-etapa { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); }
  .etapa-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.4rem; color: #1B6FAB; margin-bottom: 4px; }
  .etapa-sub { font-size: 0.88rem; color: #888; margin-bottom: 28px; }

  .campo { margin-bottom: 20px; }
  .campo label { display: block; font-size: 0.85rem; font-weight: 600; color: #333; margin-bottom: 6px; }
  .obrigatorio { color: #e53935; margin-left: 2px; }
  .campo input, .campo select, .campo textarea {
    width: 100%; padding: 12px 14px; border: 1.5px solid #dde3ed; border-radius: 8px;
    font-size: 0.92rem; font-family: 'DM Sans', sans-serif; color: #1a1a2e;
    background: #fafbfc; transition: border-color 0.2s; outline: none;
  }
  .campo input:focus, .campo select:focus, .campo textarea:focus { border-color: #1B6FAB; background: #fff; }
  .campo textarea { resize: vertical; min-height: 100px; }
  .campo select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%231B6FAB' d='M6 8L0 0h12z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
  .campo-erro input, .campo-erro select, .campo-erro textarea { border-color: #e53935; }
  .msg-erro { color: #e53935; font-size: 0.78rem; margin-top: 4px; }

  .nav-btns { display: flex; gap: 12px; margin-top: 28px; }
  .btn-voltar { flex: 1; background: #f4f7fb; color: #1B6FAB; border: 1.5px solid #d0dcea; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-voltar:hover { background: #e0eaf4; }
  .btn-continuar { flex: 2; background: #1B6FAB; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-continuar:hover { background: #155a8a; }
  .btn-enviar { flex: 2; background: #6BBF4E; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-enviar:hover { background: #57a33e; }
  .btn-enviar:disabled { background: #aaa; cursor: not-allowed; }

  .card-sucesso { background: #fff; border-radius: 16px; padding: 48px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); text-align: center; }
  .sucesso-icon { font-size: 3.5rem; margin-bottom: 16px; }
  .sucesso-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.5rem; color: #1B6FAB; margin-bottom: 12px; }
  .sucesso-texto { font-size: 0.92rem; color: #555; line-height: 1.8; }

  .footer { text-align: center; margin-top: 32px; font-size: 0.78rem; color: #aaa; }

  @media (max-width: 480px) {
    .grid-info { grid-template-columns: 1fr 1fr; gap: 8px; }
    .card-vaga, .card-lgpd, .card-etapa { padding: 24px 18px; }
  }
`;

const campoVazio = (v) => !v || v.trim() === '' || v === 'Selecione...';

// Todos os componentes de campo definidos fora do componente pai,
// para evitar recriação no DOM a cada renderização e perda de foco.

const CampoWrapper = ({ id, label, obrig, erro, children }) => (
  <div className={`campo${erro ? ' campo-erro' : ''}`}>
    <label htmlFor={id}>{label}{obrig && <span className="obrigatorio"> *</span>}</label>
    {children}
    {erro && <div className="msg-erro">{erro}</div>}
  </div>
);

const CampoInput = ({ id, label, obrig, erro, value, onChange, type = 'text', placeholder = '' }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete="off"
    />
  </CampoWrapper>
);

const CampoSelect = ({ id, label, obrig, erro, value, onChange, opcoes }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <select id={id} value={value} onChange={onChange}>
      <option value="">Selecione...</option>
      {opcoes.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </CampoWrapper>
);

const CampoTextarea = ({ id, label, obrig, erro, value, onChange, placeholder = '' }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      rows={4}
      onKeyDown={e => { if (e.key === 'Enter') e.stopPropagation(); }}
    />
  </CampoWrapper>
);

export default function Questionario() {
  const [tela, setTela] = useState('vaga');
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [erros, setErros] = useState({});

  const [dados, setDados] = useState({
    nome: '', cpf: '', email: '', telefone: '', idade: '', cidade: '', bairro: '', mora_com: '',
    formacao_estetica: '', instituicao_curso: '',
    ja_atuou_esteticista: '', procedimentos_dominados: '', tempo_experiencia: '', empresa_anterior: '',
    disponibilidade_horario: '', pretensao_salarial: '',
    motivo_interesse: '', experiencia_atendimento_publico: '', informacoes_adicionais: ''
  });

  const set = useCallback((campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const formatarCPF = (v) => {
    const n = v.replace(/\D/g, '').slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0,3)}.${n.slice(3)}`;
    if (n.length <= 9) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`;
    return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`;
  };

  const handleCPF     = useCallback((e) => set('cpf', formatarCPF(e.target.value)), [set]);
  const handleNome    = useCallback((e) => set('nome', e.target.value), [set]);
  const handleEmail   = useCallback((e) => set('email', e.target.value), [set]);
  const handleTel     = useCallback((e) => set('telefone', e.target.value), [set]);
  const handleIdade   = useCallback((e) => set('idade', e.target.value), [set]);
  const handleCidade  = useCallback((e) => set('cidade', e.target.value), [set]);
  const handleBairro  = useCallback((e) => set('bairro', e.target.value), [set]);
  const handleMoraCom = useCallback((e) => set('mora_com', e.target.value), [set]);

  const handleFormacao    = useCallback((e) => set('formacao_estetica', e.target.value), [set]);
  const handleInstituicao = useCallback((e) => set('instituicao_curso', e.target.value), [set]);
  const handleJaAtuou     = useCallback((e) => set('ja_atuou_esteticista', e.target.value), [set]);
  const handleProcedimentos = useCallback((e) => set('procedimentos_dominados', e.target.value), [set]);
  const handleTempo       = useCallback((e) => set('tempo_experiencia', e.target.value), [set]);
  const handleEmpresa     = useCallback((e) => set('empresa_anterior', e.target.value), [set]);

  const handleDispHorario = useCallback((e) => set('disponibilidade_horario', e.target.value), [set]);
  const handlePretensao   = useCallback((e) => set('pretensao_salarial', e.target.value), [set]);
  const handleMotivo      = useCallback((e) => set('motivo_interesse', e.target.value), [set]);
  const handleAtendimento = useCallback((e) => set('experiencia_atendimento_publico', e.target.value), [set]);
  const handleInfoAdic    = useCallback((e) => set('informacoes_adicionais', e.target.value), [set]);

  const validarEtapa = () => {
    const e = {};
    if (etapa === 1) {
      if (campoVazio(dados.nome)) e.nome = 'Campo obrigatório';
      if (campoVazio(dados.cpf) || dados.cpf.replace(/\D/g,'').length < 11) e.cpf = 'CPF inválido';
      if (campoVazio(dados.email)) e.email = 'Campo obrigatório';
      if (campoVazio(dados.telefone)) e.telefone = 'Campo obrigatório';
      if (campoVazio(dados.idade)) e.idade = 'Campo obrigatório';
      if (campoVazio(dados.cidade)) e.cidade = 'Campo obrigatório';
      if (campoVazio(dados.bairro)) e.bairro = 'Campo obrigatório';
      if (campoVazio(dados.mora_com)) e.mora_com = 'Campo obrigatório';
    }
    if (etapa === 2) {
      if (campoVazio(dados.formacao_estetica)) e.formacao_estetica = 'Campo obrigatório';
      if (campoVazio(dados.ja_atuou_esteticista)) e.ja_atuou_esteticista = 'Campo obrigatório';
      if (campoVazio(dados.procedimentos_dominados)) e.procedimentos_dominados = 'Campo obrigatório';
      if (campoVazio(dados.tempo_experiencia)) e.tempo_experiencia = 'Campo obrigatório';
    }
    if (etapa === 3) {
      if (campoVazio(dados.disponibilidade_horario)) e.disponibilidade_horario = 'Campo obrigatório';
      if (campoVazio(dados.pretensao_salarial)) e.pretensao_salarial = 'Campo obrigatório';
      if (campoVazio(dados.motivo_interesse)) e.motivo_interesse = 'Campo obrigatório';
      if (campoVazio(dados.experiencia_atendimento_publico)) e.experiencia_atendimento_publico = 'Campo obrigatório';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const avancar = () => {
    if (!validarEtapa()) { window.scrollTo(0, 0); return; }
    setEtapa(e => e + 1);
    window.scrollTo(0, 0);
  };

  const voltar = () => { setEtapa(e => e - 1); window.scrollTo(0, 0); };

  const enviar = async () => {
    if (!validarEtapa()) { window.scrollTo(0, 0); return; }
    setEnviando(true);
    setErroEnvio('');
    const { error } = await supabase.from('candidatos_esteticista').insert([{ ...dados, lgpd_aceite: true }]);
    setEnviando(false);
    if (error) { setErroEnvio('Ocorreu um erro ao enviar. Por favor, tente novamente.'); return; }
    setTela('sucesso');
    window.scrollTo(0, 0);
  };

  const bloquearEnter = (e) => { if (e.key === 'Enter') e.preventDefault(); };

  return (
    <>
      <style>{estilos}</style>
      <div className="wrap">

        <div className="header">
          <div className="logo-texto">ge<span className="logo-n">n</span>the</div>
          <div className="tagline">gente que entende de gente</div>
          {tela === 'form' && <div className="subtitulo-vaga">Esteticista · Campo Grande/MS</div>}
        </div>

        {/* TELA DA VAGA */}
        {tela === 'vaga' && (
          <div className="card-vaga">
            <div className="titulo-vaga">Esteticista</div>
            <div className="sub-vaga">Clínica de Estética · Campo Grande/MS</div>
            <div className="grid-info">
              <div className="info-card"><div className="info-icon">📄</div><div className="info-label">Contratação</div><div className="info-valor">CLT</div></div>
              <div className="info-card"><div className="info-icon">💰</div><div className="info-label">Salário</div><div className="info-valor">R$ 2.173,00</div></div>
              <div className="info-card"><div className="info-icon">🕗</div><div className="info-label">Horário</div><div className="info-valor">Seg a Sex · 8h às 17h e Sáb · 8h às 12h</div></div>
              <div className="info-card"><div className="info-icon">📍</div><div className="info-label">Modalidade</div><div className="info-valor">Presencial</div></div>
            </div>
            <div className="secao-titulo">🎁 Benefícios</div>
            <ul className="lista-beneficios">
              <li><span className="check">✓</span> Vale transporte, com desconto de 6%</li>
              <li><span className="check">✓</span> Bônus de R$ 200,00 por assiduidade, pontualidade e proatividade</li>
              <li><span className="check">✓</span> Oportunidade de crescimento</li>
            </ul>
            <div className="secao-titulo">📚 Requisitos</div>
            <ul className="lista-requisitos">
              <li><span className="check">✓</span> Ensino Superior completo em Estética</li>
              <li><span className="check">✓</span> Conhecimento em procedimentos estéticos</li>
            </ul>
            <button className="btn-candidatar" onClick={() => { setTela('lgpd'); window.scrollTo(0, 0); }}>
              Candidate-se agora →
            </button>
          </div>
        )}

        {/* TELA LGPD */}
        {tela === 'lgpd' && (
          <div className="card-lgpd">
            <div className="lgpd-icon">🔒</div>
            <div className="lgpd-titulo">Proteção de Dados — LGPD</div>
            <div className="lgpd-texto">
              As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de seleção e recrutamento pela <strong>Genthe Consultoria</strong>, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei n° 13.709/2018 — LGPD)</strong>.<br /><br />
              Seus dados serão tratados com segurança, sigilo e responsabilidade. Não serão compartilhados com terceiros sem sua autorização prévia e expressa, exceto com a empresa contratante vinculada a este processo seletivo, para fins exclusivos de avaliação de candidatura.<br /><br />
              Ao prosseguir, você também autoriza, mediante o fornecimento do seu CPF e nome completo, a realização de consulta de antecedentes judiciais como etapa complementar do processo seletivo. Você poderá solicitar a correção, atualização ou exclusão dos seus dados a qualquer momento pelo e mail <strong>contato@genthe.com.br</strong>.
            </div>
            <label className="lgpd-check">
              <input type="checkbox" checked={lgpdAceite} onChange={e => { setLgpdAceite(e.target.checked); setLgpdErro(false); }} />
              <span>Li e concordo com o tratamento dos meus dados pessoais para participação neste processo seletivo, conforme a LGPD.</span>
            </label>
            {lgpdErro && <div className="erro-lgpd">É necessário concordar com os termos para continuar.</div>}
            <button className="btn-iniciar" onClick={() => {
              if (!lgpdAceite) { setLgpdErro(true); return; }
              setTela('form'); window.scrollTo(0, 0);
            }}>Iniciar questionário →</button>
          </div>
        )}

        {/* FORMULÁRIO */}
        {tela === 'form' && (
          <>
            <div className="progresso-wrap">
              <div className="progresso-bar-bg">
                <div className="progresso-bar" style={{ width: `${(etapa / TOTAL_ETAPAS) * 100}%` }} />
              </div>
              <div className="progresso-texto">Etapa {etapa} de {TOTAL_ETAPAS}</div>
            </div>

            <div className="card-etapa" onKeyDown={bloquearEnter}>

              {/* ETAPA 1 */}
              {etapa === 1 && (
                <>
                  <div className="etapa-titulo">Dados Pessoais</div>
                  <div className="etapa-sub">Vamos começar com suas informações básicas.</div>
                  <CampoInput id="nome" label="Nome completo" obrig erro={erros.nome} value={dados.nome} onChange={handleNome} />
                  <CampoInput id="cpf" label="CPF" obrig erro={erros.cpf} value={dados.cpf} onChange={handleCPF} placeholder="000.000.000-00" />
                  <CampoInput id="email" label="E mail" obrig erro={erros.email} value={dados.email} onChange={handleEmail} type="email" />
                  <CampoInput id="telefone" label="Telefone / WhatsApp" obrig erro={erros.telefone} value={dados.telefone} onChange={handleTel} />
                  <CampoInput id="idade" label="Idade" obrig erro={erros.idade} value={dados.idade} onChange={handleIdade} />
                  <CampoInput id="cidade" label="Cidade" obrig erro={erros.cidade} value={dados.cidade} onChange={handleCidade} />
                  <CampoInput id="bairro" label="Bairro" obrig erro={erros.bairro} value={dados.bairro} onChange={handleBairro} />
                  <CampoTextarea id="mora_com" label="Com quem mora atualmente?" obrig erro={erros.mora_com} value={dados.mora_com} onChange={handleMoraCom}
                    placeholder="Ex: sozinho(a), com cônjuge, com família, com filhos" />
                </>
              )}

              {/* ETAPA 2 */}
              {etapa === 2 && (
                <>
                  <div className="etapa-titulo">Formação e Experiência</div>
                  <div className="etapa-sub">Conte nos sobre sua formação e sua trajetória profissional.</div>
                  <CampoSelect id="formacao_estetica" label="Você possui Ensino Superior completo em Estética?" obrig erro={erros.formacao_estetica}
                    value={dados.formacao_estetica} onChange={handleFormacao}
                    opcoes={['Sim, completo', 'Cursando', 'Não possuo']} />
                  <CampoInput id="instituicao_curso" label="Instituição de ensino"
                    erro={erros.instituicao_curso} value={dados.instituicao_curso} onChange={handleInstituicao} placeholder="Nome da instituição" />
                  <CampoSelect id="ja_atuou_esteticista" label="Já atuou como esteticista?" obrig erro={erros.ja_atuou_esteticista}
                    value={dados.ja_atuou_esteticista} onChange={handleJaAtuou}
                    opcoes={['Sim', 'Não']} />
                  <CampoTextarea id="procedimentos_dominados" label="Quais procedimentos estéticos você domina?" obrig
                    erro={erros.procedimentos_dominados} value={dados.procedimentos_dominados} onChange={handleProcedimentos}
                    placeholder="Descreva os procedimentos que você realiza" />
                  <CampoSelect id="tempo_experiencia" label="Há quanto tempo você atua na área de estética?" obrig erro={erros.tempo_experiencia}
                    value={dados.tempo_experiencia} onChange={handleTempo}
                    opcoes={['Menos de 6 meses', 'Entre 6 meses e 1 ano', 'Entre 1 e 3 anos', 'Acima de 3 anos', 'Não possuo experiência na área']} />
                  <CampoInput id="empresa_anterior" label="Empresa ou clínica anterior"
                    erro={erros.empresa_anterior} value={dados.empresa_anterior} onChange={handleEmpresa} placeholder="Opcional" />
                </>
              )}

              {/* ETAPA 3 */}
              {etapa === 3 && (
                <>
                  <div className="etapa-titulo">Disponibilidade e Motivação</div>
                  <div className="etapa-sub">Últimas informações antes de concluir.</div>
                  <CampoSelect id="disponibilidade_horario" label="O horário de trabalho é de segunda a sexta, das 8h às 17h, com intervalo de almoço, e sábado das 8h às 12h. Você tem disponibilidade?" obrig
                    erro={erros.disponibilidade_horario} value={dados.disponibilidade_horario} onChange={handleDispHorario}
                    opcoes={['Sim, total disponibilidade', 'Sim, com ressalvas', 'Não tenho disponibilidade']} />
                  <CampoInput id="pretensao_salarial" label="Qual é a sua pretensão salarial para esta vaga?" obrig
                    erro={erros.pretensao_salarial} value={dados.pretensao_salarial} onChange={handlePretensao}
                    placeholder="R$ " />
                  <CampoTextarea id="motivo_interesse" label="Qual o motivo do seu interesse nesta vaga?" obrig
                    erro={erros.motivo_interesse} value={dados.motivo_interesse} onChange={handleMotivo} />
                  <CampoSelect id="experiencia_atendimento_publico" label="Já possui experiência em atendimento ao público?" obrig
                    erro={erros.experiencia_atendimento_publico} value={dados.experiencia_atendimento_publico} onChange={handleAtendimento}
                    opcoes={['Sim', 'Não']} />
                  <CampoTextarea id="informacoes_adicionais" label="Informações adicionais que gostaria de compartilhar"
                    erro={erros.informacoes_adicionais} value={dados.informacoes_adicionais} onChange={handleInfoAdic}
                    placeholder="Opcional" />
                  {erroEnvio && <div className="msg-erro" style={{ marginBottom: '12px' }}>{erroEnvio}</div>}
                </>
              )}

              <div className="nav-btns">
                {etapa > 1 && (
                  <button className="btn-voltar" type="button" onClick={voltar}>← Voltar</button>
                )}
                {etapa < TOTAL_ETAPAS && (
                  <button className="btn-continuar" type="button" onClick={avancar}>Continuar →</button>
                )}
                {etapa === TOTAL_ETAPAS && (
                  <button className="btn-enviar" type="button" onClick={enviar} disabled={enviando}>
                    {enviando ? 'Enviando' : 'Enviar questionário ✓'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* SUCESSO */}
        {tela === 'sucesso' && (
          <div className="card-sucesso">
            <div className="sucesso-icon">✅</div>
            <div className="sucesso-titulo">Questionário enviado!</div>
            <div className="sucesso-texto">
              Obrigado pela participação. Nossa equipe analisará suas respostas e, se houver compatibilidade com a vaga de <strong>Esteticista</strong>, entraremos em contato em breve.<br /><br />
              <strong>Genthe — que entende de gente.</strong>
            </div>
          </div>
        )}

        <div className="footer">genthe.com.br · contato@genthe.com.br</div>
      </div>
    </>
  );
}
