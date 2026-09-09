# Questionário Esteticista - Genthe

Construído no mesmo padrão do repositório de referência `questionario-coordcomercial`: tela única com etapas (vaga, LGPD, formulário em 3 etapas e sucesso), estilo embutido no próprio componente e painel administrativo com estatísticas, filtros e modal de detalhes.

## Passos para publicação

1. Executar `supabase_schema.sql` no SQL Editor do projeto Supabase `wlfxwtzjlbuzyigzspms`.
2. Criar o repositório `questionario-esteticista` na organização `gentedagenthe` no GitHub.
3. Subir todos os arquivos deste projeto para o repositório.
4. Conectar o repositório ao Vercel.
5. Configurar as variáveis de ambiente no Vercel:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_ADMIN_PASSWORD`
6. Publicar. O questionário fica disponível na raiz do domínio e o painel administrativo em `/admin`.
