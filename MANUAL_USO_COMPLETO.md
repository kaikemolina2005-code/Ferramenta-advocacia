# 📖 MANUAL DE USO - ADVGD CRM
## Guia Completo da Plataforma para Escritórios de Advocacia

---

## 📋 ÍNDICE

1. [Boas-vindas](#boas-vindas)
2. [Começar](#começar)
3. [Dashboard](#dashboard)
4. [Gerenciar Leads](#gerenciar-leads)
5. [Kanban](#kanban)
6. [Automação](#automação)
7. [Relatórios](#relatórios)
8. [WhatsApp](#whatsapp)
9. [FAQ](#faq)

---

## 🎉 BOAS-VINDAS

Bem-vindo ao **ADVGD CRM**, sua plataforma de gestão completa para escritório de advocacia!

Este manual irá guiá-lo através de todas as funcionalidades disponíveis.

### O Que Você Pode Fazer

✅ Gerenciar leads e clientes  
✅ Organizar processos em Kanban  
✅ Automatizar documentos com IA  
✅ Acompanhar métricas em tempo real  
✅ Receber leads via WhatsApp  
✅ Enviar emails automáticos  
✅ Integrar com OneDrive  
✅ Monitorar desempenho  

---

## 🚀 COMEÇAR

### Login na Plataforma

1. Acesse: `https://seu-dominio.vercel.app`
2. Digite seu **email**
3. Digite sua **senha**
4. Clique em **"Entrar"**

**Não tem conta?** Solicite ao administrador criar uma para você.

### Primeiro Acesso

Na primeira vez que você faz login:

1. **Dashboard** se abre automaticamente
2. Você verá um **tour opcional** (pule ou siga)
3. Explore as 6 seções principais no menu

### Menu Principal

No topo esquerdo, você verá:

```
┌─────────────────────┐
│  📊 Dashboard       │
│  📌 Leads          │
│  📋 Kanban         │
│  🤖 Automação      │
│  📈 Relatórios     │
│  💬 WhatsApp       │
└─────────────────────┘
```

---

## 📊 DASHBOARD

O Dashboard mostra um resumo de tudo que está acontecendo.

### Cards Principais

#### 1. **Leads Total**
- Número total de leads no sistema
- Clique para ver lista completa

#### 2. **Leads Este Mês**
- Leads adicionados no mês atual
- Tendência de crescimento

#### 3. **Leads Convertidos**
- Quantos leads viraram clientes
- Taxa de conversão

#### 4. **Revenue**
- Valor total em processamento
- Projeção de faturamento

### Gráficos e Tendências

#### 📈 Evolução de Leads
- Linha mostrando crescimento ao longo do tempo
- Azul = Leads
- Verde = Conversões

#### 🎯 Distribuição por Setor
- Gráfico pizza mostrando:
  - Exploração (Leads novos)
  - Execução (Em processamento)
  - Finalizado (Concluído)

#### 💰 Value by Source
- Origem dos leads mais valiosos
- Direto / Referência / Orgânico / Outro

### Ações no Dashboard

```
🔄 Atualizar  → F5 ou botão Refresh
📥 Exportar   → Botão Download (Excel/PDF)
📅 Filtrar    → Por período (Semana/Mês/Ano)
🎯 Perfurar   → Clique em qualquer card para detalhar
```

---

## 📌 GERENCIAR LEADS

A seção de Leads é onde você gerencia todos os seus clientes em potencial.

### Visualizar Leads

1. Clique em **"Leads"** no menu
2. Você verá uma **tabela com todos os leads**

### Colunas da Tabela

| Coluna | O Que Significa |
|--------|-----------------|
| **Nome** | Nome do cliente |
| **Email** | Contato de email |
| **Telefone** | Número de WhatsApp |
| **Status** | Exploração / Execução / Finalizado |
| **Valor** | Valor do processo em R$ |
| **Data** | Quando foi adicionado |
| **Responsável** | Quem está cuidando |

### Adicionar Lead

1. Clique no botão **"+ Novo Lead"** (canto superior direito)
2. Preencha o formulário:
   - **Nome** (obrigatório)
   - **Email** (obrigatório)
   - **Telefone** (WhatsApp)
   - **Descrição** do caso
   - **Tipo** de processo
   - **Valor** estimado
   - **Responsável**
3. Clique em **"Salvar"**

### Editar Lead

1. Clique no lead que quer editar
2. Abre um painel lateral
3. Modifique os campos desejados
4. Clique em **"Atualizar"**

### Filtrar Leads

Clique em **"Filtros"** e escolha:

- **Status:** Exploração / Execução / Finalizado
- **Responsável:** Seu nome ou colega
- **Data:** Período (Esta semana / Mês / Ano)
- **Valor:** Range (R$ 1.000 - R$ 50.000)

Clique em **"Aplicar"** para filtrar.

### Ações em Lote

Selecione múltiplos leads (checkbox) e:

- **Atribuir** para responsável
- **Mover** para novo status
- **Enviar** mensagem via WhatsApp
- **Deletar** leads

### Lead Details (Painel Lateral)

Ao clicar em um lead, você vê:

```
┌────────────────────────────┐
│ Nome: João Silva           │
│ Email: joao@email.com      │
│ Telefone: (11) 99999-9999 │
├────────────────────────────┤
│ Status: Exploração         │
│ Responsável: Você          │
│ Valor: R$ 15.000,00        │
│ Data: 15/05/2026           │
├────────────────────────────┤
│ 📝 Histórico de Ações      │
│ 💬 Mensagens               │
│ 📎 Anexos                  │
└────────────────────────────┘
```

---

## 📋 KANBAN

O Kanban é uma forma visual de organizar seus processos em 3 colunas:

### As 3 Colunas

#### 1. 📥 **Exploração** (Investigação)
- Leads novos
- Ainda não iniciado
- Informações sendo coletadas

#### 2. 🔄 **Execução** (Em Processamento)
- Caso já está sendo trabalhado
- Documentos sendo preparados
- Cliente em interação

#### 3. ✅ **Finalizado**
- Caso resolvido
- Cliente satisfeito
- Arquivo encerrado

### Como Usar

**Adicionar Card:**
1. Clique em **"+ Novo"** em uma coluna
2. Preencha informações rápidas
3. Pressione Enter

**Mover Card:**
1. Clique e segure o card
2. Arraste para outra coluna
3. Solte para confirmar

**Ver Detalhes:**
1. Clique no card
2. Painel lateral se abre
3. Veja histórico completo

**Editar Card:**
1. Passe o mouse sobre o card
2. Clique no ícone de 3 pontos (⋯)
3. Escolha: Editar / Deletar / Duplicar

### Campos do Card

```
┌──────────────────────┐
│ 👤 Nome Cliente      │
│ 💼 Tipo Processo     │
│ 💰 Valor             │
│ 👨‍💼 Responsável       │
│ 📅 Data Adicionado   │
│ 🏷️ Tags             │
└──────────────────────┘
```

### Filtros no Kanban

Clique em **"Filtros"** para:
- Ver apenas seus cards
- Filtrar por tipo de processo
- Filtrar por valor
- Filtrar por período

---

## 🤖 AUTOMAÇÃO

A seção de Automação permite criar regras para executar ações automaticamente.

### O Que Pode Automatizar

✅ Enviar emails quando status muda  
✅ Criar documentos automaticamente  
✅ Enviar mensagens WhatsApp  
✅ Atribuir tarefas  
✅ Criar alertas  

### Criar Nova Regra

1. Clique em **"Automação"** no menu
2. Clique em **"+ Nova Regra"**
3. Configure:

**Passo 1: Gatilho (Quando...)**
```
Quando [evento] acontecer
- Lead criado
- Status mudou para Execução
- Data de acompanhamento chegou
- Valor maior que R$ 10.000
```

**Passo 2: Condições (Se...)**
```
Se [condições] forem verdadeiras
- Responsável = João
- Tipo processo = Trabalhista
- Valor > R$ 50.000
```

**Passo 3: Ação (Então...)**
```
Então execute [ação]
- Enviar email (template)
- Gerar documento (template)
- Enviar WhatsApp
- Atribuir para...
- Criar alerta
```

### Exemplo Prático

**Cenário:** Enviar email quando novo lead é adicionado

1. **Gatilho:** "Lead criado"
2. **Condição:** Sem condições (sempre execute)
3. **Ação:** "Enviar email"
   - Template: "Bem-vindo ao CRM"
   - Para: Email do lead
4. Clique em **"Salvar"**

### Gerenciar Regras

```
✅ Ativo   → Regra está funcionando
❌ Inativo → Regra está desativada
🧪 Teste   → Simular a regra
📝 Editar  → Modificar regra
🗑️ Deletar  → Remover regra
```

### Templates Disponíveis

**Email:**
- Bem-vindo
- Acompanhamento
- Confirmação
- Encerramento
- Personalizado

**Documentos:**
- Contrato
- Parecer
- Petição
- Parecer técnico
- Personalizado

**WhatsApp:**
- Primeira mensagem
- Acompanhamento
- Solicitação de info
- Confirmação
- Personalizado

---

## 📈 RELATÓRIOS

Os Relatórios mostram análises profundas dos seus dados.

### Tipos de Relatório

#### 📊 **Leads Summary**
- Total de leads
- Taxa de conversão
- Leads por status
- Leads por responsável
- Tendência temporal

#### 💰 **Financial Report**
- Receita total
- Receita por período
- Receita por tipo de processo
- Receita por responsável
- Projeção

#### 👥 **Team Performance**
- Leads por responsável
- Taxa de conversão
- Tempo médio de conversão
- Leads abertos
- Eficiência

#### 🎯 **Pipeline Analysis**
- Taxa de progressão
- Tempo em cada fase
- Gargalos
- Velocidade de fechamento
- Forecast

### Gerar Relatório

1. Clique em **"Relatórios"**
2. Escolha o tipo de relatório
3. Selecione período (Semana / Mês / Trimestre / Ano)
4. Clique em **"Gerar"**

### Exportar Relatório

Depois de gerar:

- **PDF:** Clique em 📥 PDF
- **Excel:** Clique em 📥 Excel
- **Imprimir:** Clique em 🖨️ Imprimir

### Interpretar Gráficos

**Gráfico de Linha:**
- Mostra evolução ao longo do tempo
- Verde/Azul = Crescimento
- Vermelho = Queda

**Gráfico de Pizza:**
- Distribuição em porcentagem
- Clique para ver detalhes
- Cores diferentes = categorias

**Gráfico de Barras:**
- Comparação entre períodos
- Mais alto = Melhor performance
- Clique para comparar

---

## 💬 WHATSAPP

Receba leads automaticamente via WhatsApp e comunique-se sem deixar o CRM.

### Conectar WhatsApp

**Primeira Vez:**
1. Clique em **"WhatsApp"** no menu
2. Clique em **"Conectar WhatsApp"**
3. Escaneie o **QR Code** com seu telefone
4. Confirme no seu celular
5. Conexão estabelecida ✅

### Receber Leads via WhatsApp

Quando alguém manda mensagem:

1. Mensagem chega em nosso número
2. Sistema detecta que é nova pessoa
3. **Novo lead é criado automaticamente**
4. Você recebe notificação
5. Você pode responder direto no CRM

### Enviar Mensagem

1. Clique em um lead
2. Clique em **"💬 Enviar WhatsApp"**
3. Digite sua mensagem
4. Clique em **"Enviar"**

**Ou rápido:** Use o botão WhatsApp no card

### Templates de Mensagem

Use templates prontos:

```
Olá [NOME],

Obrigado por entrar em contato!
Estou aqui para ajudar com seus processos legais.

[ASSINATURA]
```

Clique em **"📋 Template"** para usar pré-configurados.

### Histórico de Conversa

Veja toda conversa com cliente:

1. Clique no lead
2. Vá até **"Histórico WhatsApp"**
3. Todas as mensagens aparecem
4. Sincronizado com seu celular

### Configurações

Clique em ⚙️ **"Configurações"** para:

- Auto-resposta (mensagem automática)
- Horários de funcionamento
- Status (Online / Fora do escritório)
- Template padrão

---

## ❓ FAQ - PERGUNTAS FREQUENTES

### Geral

**P: Como faço reset de senha?**
R: Na tela de login, clique em "Esqueceu sua senha?" e siga as instruções.

**P: Posso compartilhar um lead com colega?**
R: Sim! Edite o lead e mude o "Responsável" para seu colega.

**P: Como deletar um lead?**
R: Abra o lead, clique nos 3 pontos (⋯), escolha "Deletar".

**P: Os dados são seguros?**
R: Sim! Usamos HTTPS, autenticação JWT e as melhores práticas de segurança.

### Leads

**P: Posso importar leads em lote?**
R: Sim! Clique em "📥 Importar" na seção de Leads (arquivo CSV/Excel).

**P: Quantos leads posso ter?**
R: Ilimitado! Sem restrição de quantidade.

**P: Posso recuperar um lead deletado?**
R: Contacte o administrador - pode estar no backup.

### Kanban

**P: Posso ter mais de 3 colunas?**
R: Atualmente temos 3 padrão. Contacte o administrador para customizar.

**P: Os cards voltam ao lugar se recarregar?**
R: Sim! Mudanças são salvas automaticamente.

**P: Posso arquivar cards?**
R: Sim! Mova para "Finalizado" e depois delete se necessário.

### Automação

**P: Quantas regras de automação posso criar?**
R: Ilimitado! Crie quantas precisar.

**P: Como testar uma automação?**
R: Clique no botão "🧪 Testar" na lista de regras.

**P: Posso agendar ação para data específica?**
R: Sim! Use o gatilho "Data de acompanhamento".

### Relatórios

**P: Qual período máximo para relatório?**
R: Você pode gerar desde o primeiro dia até hoje.

**P: Como compartilhar relatório?**
R: Exporte em PDF e envie por email ou WhatsApp.

**P: Posso agendar relatórios?**
R: Contacte o administrador para configurar relatórios automáticos.

### WhatsApp

**P: Perdi a conexão WhatsApp, como reconecto?**
R: Clique em "Reconectar" e escaneie o QR code novamente.

**P: Minhas mensagens são privadas?**
R: Sim! Apenas você e o cliente veem as mensagens.

**P: Posso usar WhatsApp Business?**
R: Sim! Configure nas Configurações de WhatsApp.

---

## 🔐 DICAS DE SEGURANÇA

### Proteja Sua Conta

✅ **Senha Forte:** Mínimo 8 caracteres, letras, números e símbolos  
✅ **Nunca Compartilhe:** Sua senha com ninguém  
✅ **Logout:** Sempre faça logout ao sair do PC  
✅ **Dois Fatores:** Ative 2FA quando disponível  
✅ **Verificar URL:** Certifique-se que está no domínio correto  

### Proteção de Dados

✅ **Dados Criptografados:** Tudo está encriptografado em trânsito  
✅ **Backup Automático:** Sistema faz backup diário  
✅ **GDPR Compliant:** Segue regulamentações de privacidade  
✅ **Audit Trail:** Todos os acessos são registrados  

---

## 🆘 SUPORTE

### Precisa de Ajuda?

1. **Consulte este manual** - Pode ter a resposta aqui
2. **FAQ acima** - Respostas para perguntas comuns
3. **Contacte administrador** - Para problemas técnicos
4. **Email:** support@advgd-crm.com

### Reportar Bug

Se encontrar um erro:

1. Tire screenshot
2. Descreva o que estava fazendo
3. Envie para support@advgd-crm.com
4. Nós consertaremos assim que possível

---

## 📱 MOBILE

### Usando no Celular

A plataforma é **totalmente responsiva** e funciona no celular:

1. Acesse em seu navegador mobile
2. Todas as funções disponíveis
3. Interface adaptada para tela pequena
4. Sincronização em tempo real

### Apps Recomendados

Para melhor experiência, use:

- **Chrome** ou **Safari** (versão recente)
- **Conexão rápida** (WiFi recomendado)
- **Tela brilhante** (para leitura fácil)

---

## 🎓 TREINAMENTO

### Videos de Tutorial

Vídeos curtos estão disponíveis em:
- Dashboard - Clique em "❓ Ajuda"
- Cada seção tem um tutorial

### Webinar de Treinamento

Treinamentos ao vivo são oferecidos:
- **1ª semana:** Basics
- **2ª semana:** Avançado
- **3ª semana:** Masterclass

Contate o administrador para agendar.

---

## 🎯 MELHORES PRÁTICAS

### Organize Seus Dados

✅ Seja consistente com nomes  
✅ Use status corretamente  
✅ Atualize leads regularmente  
✅ Use responsáveis claramente  
✅ Mantenha descrições completas  

### Aproveite Automações

✅ Crie regras para tarefas repetitivas  
✅ Use templates de email/WhatsApp  
✅ Configure alertas importantes  
✅ Automatize follow-ups  

### Monitore Seu Performance

✅ Revise relatórios regularmente  
✅ Acompanhe sua taxa de conversão  
✅ Compare com team  
✅ Defina metas mensais  

---

## 📞 CONTATO

**Email:** support@advgd-crm.com  
**Telefone:** (11) 9999-9999  
**WhatsApp:** (11) 9999-9999  
**Horário:** Segunda a Sexta, 9h-18h  

---

## ✨ CONCLUSÃO

Parabéns! Você já sabe usar o **ADVGD CRM**!

Se tiver dúvidas:
1. Volte a este manual
2. Procure pela seção relevante
3. Contate o suporte

**Tenha sucesso com sua gestão legal!** 🚀

---

*Versão 1.0 - Maio 2026*  
*Manual atualizado e completo para ADVGD CRM*
