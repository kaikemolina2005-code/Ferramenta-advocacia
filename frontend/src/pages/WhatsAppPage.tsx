import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Card, Button, Badge } from '@/components/TopBar';
import { designSystem } from '@/theme/designSystem';
import axios from 'axios';

interface ConnectionStatus {
  configured: boolean;
  phoneNumberId: string;
}

interface Activity {
  id: string;
  leadId: string;
  type: string;
  description: string;
  details: string;
  createdAt: string;
  lead: {
    id: string;
    name: string;
    whatsappId: string;
  };
}

interface Stats {
  totalLeads: number;
  byStatus: { status: string; _count: number }[];
  byCategory: { category: string; _count: number }[];
  lastLeads: any[];
}

export const WhatsAppPage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [logs, setLogs] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Novos estados para filtros e organização
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'priority' | 'name'>('priority');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statusRes, logsRes, statsRes] = await Promise.all([
        axios.get('/api/whatsapp/status').catch(e => ({ data: { configured: false, phoneNumberId: 'Erro ao conectar' } })),
        axios.get('/api/whatsapp/logs?limit=10').catch(e => ({ data: [] })),
        axios.get('/api/whatsapp/stats').catch(e => ({ data: null })),
      ]);

      setConnectionStatus(statusRes.data);
      setLogs(logsRes.data || []);
      setStats(statsRes.data);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Erro ao carregar dados do WhatsApp';
      console.error('Erro ao carregar dados:', error);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestMessage = async () => {
    if (!testPhone || !testMessage) {
      alert('Preencha o número e a mensagem');
      return;
    }

    try {
      setSending(true);
      const response = await axios.post('/api/whatsapp/send-test', {
        phoneNumber: testPhone.replace(/\D/g, ''), // Remove caracteres não-numéricos
        message: testMessage,
      });

      setSendResult({ success: true, message: response.data.message });
      setTestMessage('');
      setTestPhone('');
      setTimeout(() => setSendResult(null), 5000);
    } catch (error: any) {
      setSendResult({
        success: false,
        message: error.response?.data?.error || 'Erro ao enviar mensagem',
      });
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (configured: boolean) => {
    if (configured) {
      return <Badge variant="success">🟢 Conectado</Badge>;
    }
    return <Badge variant="warning">⚫ Não Configurado</Badge>;
  };

  const renderLogDetails = (details: unknown) => {
    if (!details) return null;

    if (typeof details === 'string') {
      try {
        return JSON.stringify(JSON.parse(details), null, 2);
      } catch {
        return details;
      }
    }

    try {
      return JSON.stringify(details, null, 2);
    } catch {
      return String(details);
    }
  };

  // Calcular score de prioridade
  const calculatePriority = (lead: any) => {
    let score = 0;
    
    // Score por status
    if (lead.status === 'CONVERTED') score += 50;
    else if (lead.status === 'CONSULTING') score += 30;
    else score += 10;
    
    // Score por categoria
    if (lead.category === 'PROCESS') score += 25;
    else if (lead.category === 'RETIREMENT') score += 20;
    else if (lead.category === 'BPC_LOAS') score += 15;
    
    // Score por recência
    const hoursAgo = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 1) score += 15;
    else if (hoursAgo < 6) score += 10;
    else if (hoursAgo < 24) score += 5;
    
    return score;
  };

  // Análise de sentimento simulada
  const getSentimentAnalysis = (lead: any) => {
    // Simulação: baseado no status e categoria
    if (lead.status === 'CONVERTED') return { text: 'Muito Positivo', emoji: '😊', color: '#28a745' };
    if (lead.status === 'CONSULTING') return { text: 'Positivo', emoji: '🙂', color: '#007bff' };
    return { text: 'Neutro', emoji: '😐', color: '#ffc107' };
  };

  // Filtrar e ordenar leads
  const getFilteredAndSortedLeads = () => {
    if (!stats?.lastLeads) return [];
    
    let filtered = stats.lastLeads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.phone.includes(searchTerm);
      const matchesCategory = filterCategory === 'ALL' || lead.category === filterCategory;
      const matchesStatus = filterStatus === 'ALL' || lead.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Ordenação
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        return calculatePriority(b) - calculatePriority(a);
      } else if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  // Exportar para CSV
  const exportToCSV = () => {
    const leads = getFilteredAndSortedLeads();
    const headers = ['Nome', 'Telefone', 'Categoria', 'Status', 'Prioridade', 'Data', 'Sentimento'];
    const rows = leads.map(lead => [
      lead.name,
      lead.phone,
      lead.category,
      lead.status,
      calculatePriority(lead),
      new Date(lead.createdAt).toLocaleDateString('pt-BR'),
      getSentimentAnalysis(lead).text
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-whatsapp-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      padding: '32px',
      backgroundColor: designSystem.colors.neutral.light,
      minHeight: '100vh'
    }}>
      {/* Erro Banner */}
      {error && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '24px',
          borderRadius: '8px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: designSystem.colors.primary.dark
        }}>
          💬 WhatsApp Integration
        </h1>
        <button
          onClick={loadData}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: designSystem.colors.primary.dark,
            color: designSystem.colors.neutral.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: designSystem.transitions.normal,
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.primary.light}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.primary.dark}
        >
          {loading ? '⌛' : '🔄'} Atualizar
        </button>
      </div>

      {/* Status */}
      <Card title="Status da Conexão" icon="🔌" hoverable style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '12px',
            borderBottom: `1px solid ${designSystem.colors.neutral.gray300}`
          }}>
            <span style={{ color: designSystem.colors.neutral.gray600, fontWeight: '500' }}>
              Status:
            </span>
            {connectionStatus && getStatusBadge(connectionStatus.configured)}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: designSystem.colors.neutral.gray600, fontWeight: '500' }}>
              Phone ID:
            </span>
            <code style={{
              backgroundColor: designSystem.colors.neutral.light,
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: designSystem.colors.primary.dark
            }}>
              {connectionStatus?.phoneNumberId || 'Não configurado'}
            </code>
          </div>
        </div>
      </Card>

      {/* Teste de Mensagem */}
      {connectionStatus?.configured && (
        <Card title="Enviar Mensagem de Teste" icon="✉️" hoverable style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: designSystem.colors.primary.dark,
                marginBottom: '8px'
              }}>
                Número WhatsApp
              </label>
              <input
                type="text"
                placeholder="ex: 5511999999999"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: `1px solid ${designSystem.colors.neutral.gray300}`,
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: designSystem.colors.primary.dark,
                marginBottom: '8px'
              }}>
                Mensagem
              </label>
              <textarea
                placeholder="Digite a mensagem..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: `1px solid ${designSystem.colors.neutral.gray300}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Segoe UI, sans-serif',
                  resize: 'vertical'
                }}
              />
            </div>
            <Button
              variant={sending ? 'secondary' : 'primary'}
              onClick={handleSendTestMessage}
              disabled={sending}
            >
              {sending ? '⌛ Enviando...' : '✉️ Enviar Mensagem'}
            </Button>
            {sendResult && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  backgroundColor: sendResult.success
                    ? designSystem.colors.status.success + '20'
                    : designSystem.colors.status.error + '20',
                  color: sendResult.success
                    ? designSystem.colors.status.success
                    : designSystem.colors.status.error,
                  border: `1px solid ${sendResult.success ? designSystem.colors.status.success : designSystem.colors.status.error}`
                }}
              >
                {sendResult.message}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Painel de Controle de Leads */}
      {stats && stats.lastLeads.length > 0 && (
        <Card title="🎛️ Painel de Controle de Leads" icon="⚙️" hoverable style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Barra de Busca e Filtros */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {/* Busca */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: designSystem.colors.primary.dark,
                  marginBottom: '6px'
                }}>
                  🔍 Buscar Lead
                </label>
                <input
                  type="text"
                  placeholder="Nome ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${designSystem.colors.neutral.gray300}`,
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Filtro de Categoria */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: designSystem.colors.primary.dark,
                  marginBottom: '6px'
                }}>
                  📁 Categoria
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${designSystem.colors.neutral.gray300}`,
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                >
                  <option value="ALL">Todas</option>
                  <option value="PROCESS">Processos</option>
                  <option value="RETIREMENT">Aposentadoria</option>
                  <option value="BPC_LOAS">BPC/LOAS</option>
                  <option value="CONSULTATION">Consulta</option>
                </select>
              </div>

              {/* Filtro de Status */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: designSystem.colors.primary.dark,
                  marginBottom: '6px'
                }}>
                  ✓ Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${designSystem.colors.neutral.gray300}`,
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                >
                  <option value="ALL">Todos</option>
                  <option value="INITIAL">Inicial</option>
                  <option value="CONSULTING">Em Consulta</option>
                  <option value="PAYMENT">Pagamento</option>
                  <option value="CONVERTED">Convertido</option>
                </select>
              </div>

              {/* Ordenação */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: designSystem.colors.primary.dark,
                  marginBottom: '6px'
                }}>
                  ↕️ Ordenar
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${designSystem.colors.neutral.gray300}`,
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                >
                  <option value="priority">Por Prioridade</option>
                  <option value="recent">Mais Recentes</option>
                  <option value="name">Por Nome</option>
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: designSystem.colors.primary.dark,
                  marginBottom: '6px'
                }}>
                  👁️ Visualização
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: viewMode === 'grid' ? designSystem.colors.primary.dark : designSystem.colors.neutral.light,
                      color: viewMode === 'grid' ? designSystem.colors.neutral.white : designSystem.colors.primary.dark,
                      border: `1px solid ${designSystem.colors.primary.dark}`,
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ◼◼ Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: viewMode === 'list' ? designSystem.colors.primary.dark : designSystem.colors.neutral.light,
                      color: viewMode === 'list' ? designSystem.colors.neutral.white : designSystem.colors.primary.dark,
                      border: `1px solid ${designSystem.colors.primary.dark}`,
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ☰ Lista
                  </button>
                </div>
              </div>
            </div>

            {/* Ações em Lote */}
            <div style={{
              display: 'flex',
              gap: '12px',
              paddingTop: '12px',
              borderTop: `1px solid ${designSystem.colors.neutral.gray300}`,
              flexWrap: 'wrap'
            }}>
              <button
                onClick={exportToCSV}
                style={{
                  padding: '10px 16px',
                  backgroundColor: designSystem.colors.accent.gold,
                  color: designSystem.colors.primary.dark,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                📊 Exportar para CSV
              </button>
              <span style={{
                padding: '10px 16px',
                backgroundColor: designSystem.colors.neutral.light,
                borderRadius: '6px',
                fontSize: '13px',
                color: designSystem.colors.neutral.gray600
              }}>
                📌 {getFilteredAndSortedLeads().length} leads encontrados
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Organização de Leads - Bot de IA do WhatsApp */}
      {stats && stats.lastLeads.length > 0 && (
        <Card title="🤖 Leads Organizados pelo Bot de IA" icon="📱" hoverable style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: viewMode === 'grid' 
                ? 'grid' 
                : 'flex',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(250px, 1fr))' : undefined,
              flexDirection: viewMode === 'list' ? 'column' : undefined,
              gap: '12px'
            }}>
              {getFilteredAndSortedLeads().map((lead) => {
                const priority = calculatePriority(lead);
                const sentiment = getSentimentAnalysis(lead);
                
                return viewMode === 'grid' ? (
                  // GRID VIEW
                  <div
                    key={lead.id}
                    style={{
                      backgroundColor: designSystem.colors.neutral.white,
                      border: `2px solid ${designSystem.colors.primary.lighter}`,
                      borderRadius: '8px',
                      padding: '16px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = designSystem.shadows.md;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Header do Lead */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{
                          fontWeight: '600',
                          color: designSystem.colors.primary.dark,
                          margin: 0,
                          maxWidth: '70%'
                        }}>
                          {lead.name}
                        </h4>
                        <Badge variant={lead.status === 'CONVERTED' ? 'success' : lead.status === 'CONSULTING' ? 'info' : 'warning'}>
                          {lead.status}
                        </Badge>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: designSystem.colors.neutral.gray500,
                        margin: 0
                      }}>
                        📞 {lead.phone}
                      </p>
                    </div>

                    {/* Categoria, Dados e Prioridade */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <Badge variant="primary">{lead.category}</Badge>
                      <span style={{
                        fontSize: '11px',
                        color: designSystem.colors.neutral.gray500,
                        backgroundColor: designSystem.colors.neutral.light,
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        📅 {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {/* Score de Prioridade */}
                    <div style={{
                      backgroundColor: priority > 70 ? '#d4edda' : priority > 40 ? '#fff3cd' : '#e2e3e5',
                      borderLeft: `4px solid ${priority > 70 ? '#28a745' : priority > 40 ? '#ffc107' : '#6c757d'}`,
                      padding: '10px',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        fontWeight: '600',
                        color: priority > 70 ? '#155724' : priority > 40 ? '#856404' : '#383d41'
                      }}>
                        ⭐ Prioridade: {priority}/100
                      </p>
                    </div>

                    {/* IA Insights e Sentimento */}
                    <div style={{
                      backgroundColor: `${designSystem.colors.accent.gold}10`,
                      border: `1px solid ${designSystem.colors.accent.gold}40`,
                      borderRadius: '6px',
                      padding: '10px',
                      fontSize: '12px',
                      marginBottom: '12px'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontWeight: '500',
                        color: designSystem.colors.accent.gold,
                        marginBottom: '4px'
                      }}>
                        🧠 Análise da IA:
                      </p>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: '16px',
                        color: designSystem.colors.neutral.gray600,
                        fontSize: '11px'
                      }}>
                        <li>Categoria: <strong>{lead.category}</strong></li>
                        <li>Sentimento: <strong>{sentiment.text} {sentiment.emoji}</strong></li>
                        <li>Resposta: {Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / 60000)} min atrás</li>
                      </ul>
                    </div>

                    {/* Ações */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '12px'
                    }}>
                      <button style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: designSystem.colors.primary.light,
                        color: designSystem.colors.primary.dark,
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.primary.dark}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.primary.light}
                      >
                        ✉️ Responder
                      </button>
                      <button style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: `${designSystem.colors.status.success}20`,
                        color: designSystem.colors.status.success,
                        border: `1px solid ${designSystem.colors.status.success}`,
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        ✓ Aprovar
                      </button>
                    </div>
                  </div>
                ) : (
                  // LIST VIEW
                  <div
                    key={lead.id}
                    style={{
                      backgroundColor: designSystem.colors.neutral.white,
                      border: `1px solid ${designSystem.colors.neutral.gray300}`,
                      borderRadius: '6px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.neutral.light}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.neutral.white}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <strong>{lead.name}</strong>
                        <Badge variant="primary">{lead.category}</Badge>
                        <span style={{
                          fontSize: '11px',
                          color: 'white',
                          backgroundColor: priority > 70 ? '#28a745' : '#ffc107',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}>
                          ⭐ {priority}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: designSystem.colors.neutral.gray600 }}>
                        📞 {lead.phone} • {sentiment.text} {sentiment.emoji}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '6px 12px',
                        backgroundColor: designSystem.colors.primary.light,
                        color: designSystem.colors.primary.dark,
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        ✉️
                      </button>
                      <button style={{
                        padding: '6px 12px',
                        backgroundColor: `${designSystem.colors.status.success}20`,
                        color: designSystem.colors.status.success,
                        border: `1px solid ${designSystem.colors.status.success}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        ✓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Estatísticas */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <Card title="Total de Leads" icon="👥" hoverable>
            <p style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: designSystem.colors.primary.dark,
              margin: '0'
            }}>
              {stats.totalLeads}
            </p>
          </Card>

          <Card title="Por Status" icon="📊" hoverable>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.byStatus.map((item) => (
                <div
                  key={item.status}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${designSystem.colors.neutral.gray300}`
                  }}
                >
                  <span style={{ fontSize: '13px', color: designSystem.colors.neutral.gray600 }}>
                    {item.status}
                  </span>
                  <span style={{
                    fontWeight: '600',
                    color: designSystem.colors.primary.dark,
                    backgroundColor: `${designSystem.colors.primary.light}20`,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {item._count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Por Categoria" icon="🏷️" hoverable>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.byCategory.map((item) => (
                <div
                  key={item.category}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${designSystem.colors.neutral.gray300}`
                  }}
                >
                  <span style={{ fontSize: '13px', color: designSystem.colors.neutral.gray600 }}>
                    {item.category}
                  </span>
                  <span style={{
                    fontWeight: '600',
                    color: designSystem.colors.primary.dark,
                    backgroundColor: `${designSystem.colors.accent.gold}20`,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {item._count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Logs de Mensagens */}
      <Card title="Últimas Mensagens Recebidas" icon="📨" hoverable style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {logs.length === 0 ? (
            <p style={{
              textAlign: 'center',
              color: designSystem.colors.neutral.gray400,
              padding: '32px 0',
              margin: 0
            }}>
              Nenhuma mensagem recebida
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                style={{
                  backgroundColor: designSystem.colors.neutral.light,
                  borderRadius: '8px',
                  padding: '12px',
                  border: `1px solid ${designSystem.colors.neutral.gray300}`,
                  transition: designSystem.transitions.normal
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = designSystem.shadows.md;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <p style={{
                      fontWeight: '600',
                      color: designSystem.colors.primary.dark,
                      margin: '0 0 4px 0'
                    }}>
                      {log.lead.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: designSystem.colors.neutral.gray500,
                      margin: 0
                    }}>
                      {log.lead.whatsappId}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: designSystem.colors.neutral.gray500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={12} />
                    {new Date(log.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: designSystem.colors.neutral.gray600,
                  margin: 0
                }}>
                  {log.description}
                </p>
                {log.details && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    backgroundColor: designSystem.colors.neutral.light,
                    padding: '8px',
                    borderRadius: '6px',
                    color: designSystem.colors.neutral.gray600,
                    maxHeight: '80px',
                    overflowY: 'auto',
                    fontFamily: 'monospace'
                  }}>
                    {renderLogDetails(log.details)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Últimos Leads */}
      {stats && stats.lastLeads.length > 0 && (
        <Card title="Últimos Leads (WhatsApp)" icon="📋" hoverable>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  borderBottom: `1px solid ${designSystem.colors.neutral.gray300}`,
                  backgroundColor: designSystem.colors.neutral.light
                }}>
                  {['Nome', 'Telefone', 'Categoria', 'Status', 'Data'].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: designSystem.colors.primary.dark
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.lastLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: `1px solid ${designSystem.colors.neutral.gray300}`,
                      transition: designSystem.transitions.normal
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.neutral.light}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{
                      padding: '12px 16px',
                      color: designSystem.colors.primary.dark,
                      fontWeight: '500',
                      fontSize: '13px'
                    }}>
                      {lead.name}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: designSystem.colors.neutral.gray600,
                      fontSize: '13px'
                    }}>
                      {lead.phone}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '12px'
                    }}>
                      <Badge variant="info">{lead.category}</Badge>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '12px'
                    }}>
                      <Badge variant={lead.status === 'INITIAL' ? 'warning' : 'success'}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: designSystem.colors.neutral.gray500,
                      fontSize: '12px'
                    }}>
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Instruções de Configuração */}
      {!connectionStatus?.configured && (
        <Card title="⚙️ Configurar WhatsApp" icon="🔧" hoverable>
          <p style={{
            fontSize: '13px',
            color: designSystem.colors.neutral.gray600,
            marginBottom: '12px'
          }}>
            Para habilitar o WhatsApp, configure as variáveis de ambiente no arquivo{' '}
            <code style={{
              backgroundColor: designSystem.colors.neutral.light,
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              .env
            </code>:
          </p>
          <pre style={{
            backgroundColor: designSystem.colors.neutral.light,
            padding: '16px',
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '12px',
            color: designSystem.colors.primary.dark,
            fontFamily: 'monospace',
            margin: '12px 0'
          }}>
{`WHATSAPP_BUSINESS_PHONE_ID=seu-phone-id
WHATSAPP_BUSINESS_ACCESS_TOKEN=seu-access-token
WHATSAPP_BUSINESS_ACCOUNT_ID=seu-account-id
WHATSAPP_WEBHOOK_TOKEN=webhook_token_seguro_2026`}
          </pre>
          <p style={{
            fontSize: '12px',
            color: designSystem.colors.neutral.gray500,
            margin: 0
          }}>
            Acesse a documentação em{' '}
            <code style={{
              backgroundColor: designSystem.colors.neutral.light,
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              README.WHATSAPP.md
            </code>{' '}
            para detalhes completos de configuração.
          </p>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppPage;
