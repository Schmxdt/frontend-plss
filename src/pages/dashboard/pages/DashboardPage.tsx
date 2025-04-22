import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Grid, Paper } from '@mui/material';
import { api } from '../../../services/api';
import { green, red, blue, orange } from '@mui/material/colors';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [percentualResolvido, setPercentualResolvido] = useState<number | null>(null);
  const [percentualPendente, setPercentualPendente] = useState<number | null>(null);
  const [percentualAtrasado, setPercentualAtrasado] = useState<number | null>(null);
  const [mediaTempoResolucao, setMediaTempoResolucao] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [resolvidoResponse, pendenteResponse, atrasadoResponse, mediaTempoResponse] = await Promise.all([
          api.get('/chamados-percentual'),
          api.get('/chamados-percentual-pendente'),
          api.get('/chamados-percentual-atrasado'),
          api.get('/chamados-media-tempo-resolucao'),
        ]);

        setPercentualResolvido(resolvidoResponse.data.percentual);
        setPercentualPendente(pendenteResponse.data.percentual);
        setPercentualAtrasado(atrasadoResponse.data.percentual);
        setMediaTempoResolucao(mediaTempoResponse.data.media_dias_resolucao);

        setChartData({
          labels: ['Resolvido', 'Pendente', 'Novo'],
          datasets: [
            {
              label: 'Percentual de Chamados (%)',
              data: [resolvidoResponse.data.percentual, pendenteResponse.data.percentual, atrasadoResponse.data.percentual],
              backgroundColor: [blue[500], orange[500], red[500]], // Cor das barras
            },
          ],
        });
      } catch (err) {
        setError('Erro ao carregar as métricas.');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
        Dashboard de Chamados
      </Typography>

      {/* Gráfico de Colunas */}
      <Box sx={{ marginBottom: 5 }}>
        <Paper sx={{ padding: 1, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Percentual de Chamados por Situação
          </Typography>
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Chamados Resolvidos, Pendentes e Atrasados no Mês',
                  },
                },
              }}
            />
          ) : (
            <Typography color="textSecondary">Carregando gráfico...</Typography>
          )}
        </Paper>
      </Box>


      {/* Grid de Cards */}
      <Grid container spacing={3}>
        {/* Card de Percentual Resolvido */}
        <Grid>
          <Card sx={{ backgroundColor: blue[500], color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Chamados Resolvidos Dentro do Prazo</Typography>
              <Typography variant="h4" fontWeight="bold">{percentualResolvido}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Percentual Pendente */}
        <Grid >
          <Card sx={{ backgroundColor: orange[500], color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Chamados Pendentes</Typography>
              <Typography variant="h4" fontWeight="bold">{percentualPendente}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Percentual Atrasado */}
        <Grid >
          <Card sx={{ backgroundColor: red[500], color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Chamados Resolvidos Após o Prazo</Typography>
              <Typography variant="h4" fontWeight="bold">{percentualAtrasado}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Média de Tempo de Resolução */}
        <Grid >
          <Card sx={{ backgroundColor: green[500], color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Média de Tempo de Resolução</Typography>
              <Typography variant="h4" fontWeight="bold">{mediaTempoResolucao} dias</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



    </Box>
  );
}
