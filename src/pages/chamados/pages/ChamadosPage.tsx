import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { api } from '../.././../services/api';
import { Chamado } from '../../../models/chamado';
import { useEffect, useState } from 'react';
import { Alert, Button, Container, IconButton, Paper, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import { Add, Delete, Edit, Update } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ChamadosPage() {
  const [rows, setRows] = useState<Chamado[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const tableName = "chamados";

  const fetchData = async (search: string) => {
    try {
      const response = await api.get(`/${tableName}`, {
        params: {
          search, // Passando o valor da pesquisa para a API
        },
      });
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/${tableName}/${id}`);
      setSnackbarMessage("Registro excluído com sucesso!");
      setOpenSnackbar(true);
      fetchData(search);
    } catch (error) {
      console.error("Erro ao excluir registro:", error);
      setSnackbarMessage("Erro ao excluir o registro.");
      setOpenSnackbar(true);
    }
  };

  // Funções para editar e atualizar registros
  const handleEdit = (id: string) => {
    navigate(`/${tableName}/${id}`);
  };

  // Função para atualizar 
  const handleRefresh = () => {
    setSearch("");
    try {
      setSnackbarMessage("Table refreshed successfully!");
      setOpenSnackbar(true);
      fetchData(search);
    }
    catch (error) {
      console.error("Error refreshing table:", error);
      setSnackbarMessage("Error refreshing table.");
      setOpenSnackbar(true);
    }
  };

  const columns: GridColDef[] = [
    { field: "titulo", headerName: "Título", flex: 1 },
    { field: "descricao", headerName: "Descrição", flex: 1 },
    { field: "categoria_nome", headerName: "Categoria", flex: 1 },
    { field: "situacao_nome", headerName: "Situação", flex: 1 },
    { field: "data_criacao", headerName: "Criação", flex: 1 },
    { field: "prazo_solucao", headerName: "Prazo", flex: 1 },
    { field: "data_solucao", headerName: "Solução", flex: 1 },

    {
      field: "actions",
      headerName: "Ações",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <Box display="flex" gap={1}>
            <Tooltip title="Editar">
              <IconButton color="primary" onClick={() => handleEdit(id)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Deletar">
              <IconButton color="error" onClick={() => handleDelete(id)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData(search);
  }, [search]);

  return (
    <Container maxWidth={false} sx={{ mt: 6 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h3"
          gutterBottom
          textAlign="start"
          fontWeight="bold"
        >
          Chamados
        </Typography>

        <Box sx={{ width: "100%", mt: 2 }}>

          {/* // Botão de Adicionar */}
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => {
                  navigate(`/${tableName}/new`)
                }}
                sx={{ mb: 2 }}
              >
                Adicionar
              </Button>

              <Button
                variant="contained"
                color="info"
                startIcon={<Edit />}
                disabled={!selectedId}
                onClick={() => handleEdit(selectedId!)}
                sx={{ mb: 2 }}
              >
                Editar
              </Button>

              <Button
                variant="contained"
                color="warning"
                startIcon={<Delete />}
                disabled={!selectedId}
                onClick={() => handleDelete(selectedId!)}
                sx={{ mb: 2 }}
              >
                Deletar
              </Button>
            </Box>

            {/* // Botão de Atualizar */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Update />}
              onClick={() => {
                handleRefresh();
              }}
              sx={{ mb: 2 }}
            >
              Atualizar
            </Button>
          </Box>

          <Box sx={{ width: "100%", mt: 2 }}>
            {/* Campo de busca "dentro" do grid */}
            <Box sx={{ mb: 2 }}>
              <TextField
                placeholder="Pesquisar..."
                fullWidth
                size="small"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchData(search)}
              />
            </Box>

            {/* Tabela */}
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              checkboxSelection
              disableRowSelectionOnClick
              pagination
              pageSizeOptions={[5, 10, 20, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              onRowSelectionModelChange={(row) => {
                const sizeRow = row.ids
                const selectedIDs = new Set(sizeRow);

                setSelectedId(selectedIDs.size > 0 && selectedIDs.size === 1 ? String(selectedIDs.values().next().value) : null);
              }}
            />
          </Box>
        </Box>

        {/* Snackbar para mensagens */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </Paper>
    </Container>
  );
}