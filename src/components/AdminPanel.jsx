import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const estilos = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f4f7fb; color: #1a1a2e; }

  .admin-wrap { max-width: 1100px; margin: 0 auto; padding: 24px 16px 60px; }

  .admin-header { background: #1B6FAB; color: #fff; border-radius: 14px; padding: 24px 28px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: gap; gap: 12px; }
  .admin-logo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.6rem; }
  .admin-logo span { color: #6BBF4E; }
  .admin-titulo { font-size: 0.9rem; opacity: 0.85; margin-top: 2px; }
  .admin-badge { background: rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 16px; font-size: 0.85rem; font-weight: 600; }

  .login-wrap { max-width: 380px; margin: 80px auto; background: #fff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 2px 20px rgba(27,111,171,0.1); text-align: center; }
  .login-logo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #1B6FAB; margin-bottom: 4px; }
  .login-logo span { color: #6BBF4E; }
  .login-sub { font-size: 0.82rem; color: #888; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 28px; }
  .login-wrap input { width: 100%; padding: 13px 14px; border: 1.5px solid #dde3ed; border-radius: 8px; font-size: 0.95rem; font-family: 'DM Sans', sans-serif; margin-bottom: 12px; outline: none; }
  .login-wrap input:focus { border-color: #1B6FAB; }
  .login-btn { width: 100%; background: #1B6FAB; color: #fff; border: none; border-radius: 8px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .login-erro { color: #e53935; font-size: 0.82rem; margin-bottom: 8px; }

  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: #fff; border-radius: 12px; padding: 18px 20px; box-shadow: 0 1px 8px rgba(27,111,171,0.07); }
  .stat-num { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #1B6FAB; }
  .stat-label { font-size: 0.78rem; color: #888; margin-top: 2px; }

  .filtros-wrap { background: #fff; border-radius: 12px; padding: 18px 20px; margin-bottom: 20px; box-shadow: 0 1px 8px rgba(27,111,171,0.07); display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
  .filtros-wrap input, .filtros-wrap select { padding: 10px 12px; border: 1.5px solid #dde3ed; border-radius: 8px; font-size: 0.88rem; font-family: 'DM Sans', sans-serif; outline: none; min-width: 180px; }
  .filtros-wrap input:focus, .filtros-wrap select:focus { border-color: #1B6FAB; }

  .tabela-wrap { background: #fff; border-radius: 12px; box-shadow: 0 1px 8px rgba(27,111,171,0.07); overflow: hidden; }
  .tabela-header { display: grid; grid-template-columns: 2fr 1fr 1.2fr 1.2fr 80px; gap: 12px; padding: 14px 20px; background: #f4f7fb; font-size: 0.75rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .tabela-linha { display: grid; grid-template-columns: 2fr 1fr 1.2fr 1.2fr 80px; gap: 12px; padding: 16px 20px; border-top: 1px solid #f0f3f8; align-items: center; cursor: pointer; transition: background 0.15s; }
  .tabela-linha:hover { background: #f8fafd; }
  .candidato-nome { font-weight: 600; font-size: 0.92rem; color: #1a1a2e; }
  .candidato-data { font-size: 0.8rem; color: #999; margin-top: 2px; }
  .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
  .badge-verde { background: #e8f8e0; color: #3a8a1e; }
  .badge-amarelo { background: #fff8e0; color: #9a7000; }
  .badge-vermelho { background: #fce8e8; color: #c0392b; }
  .badge-azul { background: #e0eaf8; color: #1B6FAB; }
  .badge-cinza { background: #f0f0f0; color: #777; }
  .btn-ver { background: #1B6FAB; color: #fff; border: none; border-radius: 8px; padding: 8px 14px; font-size: 0.8rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
  .btn-ver:hover { background: #155a8a; }
  .vazio { padding: 40px; text-align: center; color: #aaa; font-size: 0.9rem; }

  .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 100; display: flex; align-items: flex-start; justify-content: center; overflow-y: auto; padding: 24px 16px; }
  .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 720px; margin: auto; overflow: hidden; }
  .modal-header { background: #1B6FAB; color: #fff; padding: 24px 28px; display: flex; justify-content: space-between; align-items: flex-start; }
  .modal-nome { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.3rem; }
  .modal-cargo { font-size: 0.85rem; opacity: 0.8; margin-top: 4px; }
  .modal-fechar { background: rgba(255,255,255,0.2); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 12px; }
  .modal-body { padding: 28px; max-height: 70vh; overflow-y: auto; }
  .modal-secao { margin-bottom: 28px; }
  .modal-secao-titulo { font-size: 0.72rem; font-weight: 700; color: #1B6FAB; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; padding-bottom: 6px; border-bottom: 1.5px solid #e8f0f8; }
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-campo { background: #f8fafc; border-radius: 8px; padding: 12px 14px; }
  .modal-campo-label { font-size: 0.72rem; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .modal-campo-valor { font-size: 0.88rem; color: #1a1a2e; line-height: 1.6; }
  .modal-campo-full { grid-column: 1 / -1; }
  .modal-destaque { border-left: 3px solid #1B6FAB; }
  .modal-footer { padding: 16px 28px; border-top: 1px solid #f0f3f8; display: flex; gap: 10px; flex-wrap: wrap; }
  .btn-wpp { background: #25D366; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 0.85rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-wpp:hover { background: #1da851; }
  .btn-fechar-modal { background: #f4f7fb; color: #555; border: 1.5px solid #dde3ed; border-radius: 8px; padding: 10px 18px; font-size: 0.85rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }

  @media (max-width: 700px) {
    .tabela-header, .tabela-linha { grid-template-columns: 1fr auto; }
    .tabela-header > *:not(:first-child):not(:last-child), .tabela-linha > *:not(:first-child):not(:last-child) { display: none; }
    .modal-grid { grid-template-columns: 1fr; }
    .admin-header { flex-direction: column; }
  }
`;

const badgeFormacao = (v) => {
  if (!v) return <span className="badge badge-cinza">—</span>;
  if (v.includes('Sim, completo')) return <span className="badge badge-verde">{v}</span>;
  if (v.includes('Cursando')) return <span className="badge badge-azul">{v}</span>;
  return <span className="badge badge-vermelho">{v}</span>;
};

const badgeTempo = (v) => {
  if (!v) return <span className="badge badge-cinza">—</span>;
  if (v.includes('Acima') || v.includes('1 e 3')) return <span className="badge badge-verde">{v}</span>;
  if (v.includes('6 meses')) return <span className="badge badge-amarelo">{v}</span>;
  return <span className="badge badge-vermelho">{v}</span>;
};

const fmtData = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
};

const Campo = ({ label, valor, full, destaque }) => (
  <div className={`modal-campo${full ? ' modal-campo-full' : ''}${destaque ? ' modal-destaque' : ''}`}>
    <div className="modal-campo-label">{label}</div>
    <div className="modal-campo-valor">{valor || '—'}</div>
  </div>
);

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroFormacao, setFiltroFormacao] = useState('');
  const [filtroTempo, setFiltroTempo] = useState('');
  const [selecionado, setSelecionado] = useState(null);

  const login = () => {
    if (senha === process.env.REACT_APP_ADMIN_PASSWORD) {
      setAutenticado(true);
      setErroLogin('');
    } else {
      setErroLogin('Senha incorreta.');
    }
  };

  useEffect(() => {
    if (!autenticado) return;
    const carregar = async () => {
      setCarregando(true);
      const { data } = await supabase
        .from('candidatos_esteticista')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setCandidatos(data);
      setCarregando(false);
    };
    carregar();
  }, [autenticado]);

  const filtrados = candidatos.filter(c => {
    const texto = busca.toLowerCase();
    const nomeOk = !busca || (c.nome || '').toLowerCase().includes(texto) || (c.email || '').toLowerCase().includes(texto);
    const formacaoOk = !filtroFormacao || (c.formacao_estetica || '').includes(filtroFormacao);
    const tempoOk = !filtroTempo || (c.tempo_experiencia || '').includes(filtroTempo);
    return nomeOk && formacaoOk && tempoOk;
  });

  const copiarWpp = (c) => {
    const txt = `*Genthe — Esteticista*\n\n*Candidato(a):* ${c.nome}\n*CPF:* ${c.cpf}\n*E mail:* ${c.email}\n*Telefone:* ${c.telefone}\n*Bairro:* ${c.bairro}\n*Formação em Estética:* ${c.formacao_estetica}\n*Tempo de experiência:* ${c.tempo_experiencia}\n*Procedimentos dominados:* ${c.procedimentos_dominados}\n*Pretensão salarial:* ${c.pretensao_salarial}\n*Disponibilidade de horário:* ${c.disponibilidade_horario}\n*Enviado em:* ${fmtData(c.created_at)}`;
    navigator.clipboard.writeText(txt);
    alert('Copiado para área de transferência!');
  };

  if (!autenticado) return (
    <>
      <style>{estilos}</style>
      <div className="login-wrap">
        <div className="login-logo">ge<span>n</span>the</div>
        <div className="login-sub">painel administrativo</div>
        {erroLogin && <div className="login-erro">{erroLogin}</div>}
        <input type="password" placeholder="Senha de acesso" value={senha}
          onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()} />
        <button className="login-btn" onClick={login}>Entrar</button>
      </div>
    </>
  );

  const total = candidatos.length;
  const comFormacao = candidatos.filter(c => c.formacao_estetica === 'Sim, completo').length;
  const expSuficiente = candidatos.filter(c => c.tempo_experiencia && !c.tempo_experiencia.includes('Menos') && !c.tempo_experiencia.includes('Não possuo')).length;
  const hoje = new Date().toDateString();
  const hoje_ = candidatos.filter(c => new Date(c.created_at).toDateString() === hoje).length;

  return (
    <>
      <style>{estilos}</style>
      <div className="admin-wrap">
        <div className="admin-header">
          <div>
            <div className="admin-logo">ge<span>n</span>the</div>
            <div className="admin-titulo">Painel Administrativo · Esteticista</div>
          </div>
          <div className="admin-badge">Campo Grande/MS</div>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-num">{total}</div><div className="stat-label">Total de candidatos</div></div>
          <div className="stat-card"><div className="stat-num" style={{color:'#6BBF4E'}}>{comFormacao}</div><div className="stat-label">Ensino Superior completo em Estética</div></div>
          <div className="stat-card"><div className="stat-num" style={{color:'#6BBF4E'}}>{expSuficiente}</div><div className="stat-label">Experiência acima de 6 meses</div></div>
          <div className="stat-card"><div className="stat-num" style={{color:'#f39c12'}}>{hoje_}</div><div className="stat-label">Enviados hoje</div></div>
        </div>

        <div className="filtros-wrap">
          <input placeholder="Buscar por nome ou e mail" value={busca} onChange={e => setBusca(e.target.value)} />
          <select value={filtroFormacao} onChange={e => setFiltroFormacao(e.target.value)}>
            <option value="">Formação, todas</option>
            <option value="Sim, completo">Superior completo em Estética</option>
            <option value="Cursando">Cursando</option>
            <option value="Não possuo">Não possui</option>
          </select>
          <select value={filtroTempo} onChange={e => setFiltroTempo(e.target.value)}>
            <option value="">Experiência, todas</option>
            <option value="Acima de 3 anos">Acima de 3 anos</option>
            <option value="1 e 3">Entre 1 e 3 anos</option>
            <option value="6 meses e 1">Entre 6 meses e 1 ano</option>
            <option value="Menos de 6">Menos de 6 meses</option>
            <option value="Não possuo">Sem experiência</option>
          </select>
        </div>

        <div className="tabela-wrap">
          <div className="tabela-header">
            <div>Candidato(a)</div>
            <div>Formação</div>
            <div>Experiência</div>
            <div>Pretensão</div>
            <div></div>
          </div>
          {carregando && <div className="vazio">Carregando</div>}
          {!carregando && filtrados.length === 0 && <div className="vazio">Nenhum candidato encontrado.</div>}
          {filtrados.map(c => (
            <div key={c.id} className="tabela-linha" onClick={() => setSelecionado(c)}>
              <div>
                <div className="candidato-nome">{c.nome}</div>
                <div className="candidato-data">{fmtData(c.created_at)}</div>
              </div>
              <div>{badgeFormacao(c.formacao_estetica)}</div>
              <div>{badgeTempo(c.tempo_experiencia)}</div>
              <div><span style={{fontSize:'0.88rem',color:'#444'}}>{c.pretensao_salarial || '—'}</span></div>
              <div><button className="btn-ver" onClick={e => { e.stopPropagation(); setSelecionado(c); }}>Ver</button></div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selecionado && (
          <div className="modal-bg" onClick={() => setSelecionado(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="modal-nome">{selecionado.nome}</div>
                  <div className="modal-cargo">Esteticista · {fmtData(selecionado.created_at)}</div>
                </div>
                <button className="modal-fechar" onClick={() => setSelecionado(null)}>✕</button>
              </div>
              <div className="modal-body">

                <div className="modal-secao">
                  <div className="modal-secao-titulo">Dados Pessoais</div>
                  <div className="modal-grid">
                    <Campo label="Nome" valor={selecionado.nome} />
                    <Campo label="CPF" valor={selecionado.cpf} />
                    <Campo label="E mail" valor={selecionado.email} />
                    <Campo label="Telefone" valor={selecionado.telefone} />
                    <Campo label="Idade" valor={selecionado.idade} />
                    <Campo label="Cidade / Bairro" valor={`${selecionado.cidade} — ${selecionado.bairro}`} full />
                  </div>
                </div>

                <div className="modal-secao">
                  <div className="modal-secao-titulo">⭐ Critérios de Triagem</div>
                  <div className="modal-grid">
                    <Campo label="Formação em Estética" valor={selecionado.formacao_estetica} destaque />
                    <Campo label="Tempo de experiência" valor={selecionado.tempo_experiencia} destaque />
                    <Campo label="Já atuou como esteticista" valor={selecionado.ja_atuou_esteticista} destaque />
                    <Campo label="Instituição de ensino" valor={selecionado.instituicao_curso} />
                    <Campo label="Empresa ou clínica anterior" valor={selecionado.empresa_anterior} />
                    <Campo label="Procedimentos dominados" valor={selecionado.procedimentos_dominados} full />
                  </div>
                </div>

                <div className="modal-secao">
                  <div className="modal-secao-titulo">Disponibilidade e Motivação</div>
                  <div className="modal-grid">
                    <Campo label="Disponibilidade de horário" valor={selecionado.disponibilidade_horario} />
                    <Campo label="Pretensão salarial" valor={selecionado.pretensao_salarial} />
                    <Campo label="Experiência em atendimento ao público" valor={selecionado.experiencia_atendimento_publico} />
                    <Campo label="Motivo do interesse" valor={selecionado.motivo_interesse} full />
                    <Campo label="Informações adicionais" valor={selecionado.informacoes_adicionais} full />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button className="btn-wpp" onClick={() => copiarWpp(selecionado)}>📋 Copiar para WhatsApp</button>
                <button className="btn-fechar-modal" onClick={() => setSelecionado(null)}>Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
