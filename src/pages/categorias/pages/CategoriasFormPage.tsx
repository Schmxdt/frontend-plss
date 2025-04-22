import { useState, FormEvent, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Situacao } from '../../../models/situacao';
import { api } from '../../../services/api';

export default function CategoriasFormPage() {
  const { id } = useParams();
  const [nome, setNome] = useState('');
  const tableName = "categorias";
  const navigate = useNavigate();

  const handleSubmit = async (data: Situacao) => {
    try {
      if (id) {
        await api.put(`/${tableName}/${id}`, data);
      }
      else {
        await api.post(`/${tableName}`, data);
      }
      navigate(`/${tableName}`);
    }
    catch (error) {
      console.error("Error submitting answers:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await api.get(`/${tableName}/${id}`);
          setNome(response.data.nome);
        }
        catch (error) {
          console.error("Error fetching situacao:", error);
        }
      }
    };
    fetchData();
  }, [id]);

  return (
    <Box component="form" sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Editar Categoria' : 'Nova Categoria'}
      </Typography>

      <TextField
        label="Nome"
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        margin="normal"
        required
      />

      <Box mt={2}>
        <Button type="submit" onClick={(e) => { e.preventDefault(); handleSubmit({ nome }); }} variant="contained" color="primary">
          {id ? 'Salvar Alterações' : 'Criar Categoria'}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate(`/${tableName}`)}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
