import { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Chamado } from '../../../models/chamado';
import { api } from '../../../services/api';
import { Categoria } from '../../../models/categoria';
import { Situacao } from '../../../models/situacao';

export default function ChamadosFormPage() {
  const { id } = useParams();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [situacao, setSituacao] = useState<string | number>('');
  const [categoria, setCategoria] = useState<string | number>('');
  const tableName = "chamados";

  const handleSituacaoChange = (event: SelectChangeEvent) => {
    setSituacao(event.target.value);
  };

  const handleCategoriaChange = (event: SelectChangeEvent) => {
    setCategoria(event.target.value);
  };

  const navigate = useNavigate();
  const [categoriaOptions, setCategoriaOptions] = useState<Categoria[]>([]);
  const [situacaoOptions, setSituacaoOptions] = useState<Situacao[]>([]);

  const handleSubmit = async (data: Chamado) => {
    try {
      if (id) {
        await api.put(`/${tableName}/${id}`, data);
      } else {
        await api.post(`/${tableName}`, data);
      }
      navigate(`/${tableName}`);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const categoriaResponse = await api.get(`/categorias`);
      setCategoriaOptions(
        categoriaResponse.data.map((item: Categoria) => ({
          id: item.id,
          nome: item.nome,
        }))
      );

      const situacaoResponse = await api.get(`/situacoes`);
      setSituacaoOptions( 
        situacaoResponse.data.map((item: { id: number; nome: string }) => ({
          id: item.id,
          nome: item.nome,
        }))
      );

      if (id) {
        try {
          const response = await api.get(`/${tableName}/${id}`);
          setTitulo(response.data.titulo);
          setDescricao(response.data.descricao);
          setSituacao(response.data.situacao_id);
          setCategoria(response.data.categoria_id);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [id]);

  return (
    <Box component="form" sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Editar Chamado' : 'Novo Chamado'}
      </Typography>

      <TextField
        label="Título"
        fullWidth
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        label="Descrição"
        fullWidth
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        margin="normal"
        required
        multiline
        rows={4}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="situacao-select-label">Situação</InputLabel>
        <Select
          labelId="situacao-select-label"
          id="situacao-select"
          value={id ? String(situacao) : 'Novo'}
          label="Situação"
          onChange={handleSituacaoChange}
          disabled={!id}
        >
          {!id && (
            <MenuItem value="Novo">Novo</MenuItem>
          )}

          {situacaoOptions.map((situacaoOption) => (
        <MenuItem key={situacaoOption.id} value={situacaoOption.id}>
          {situacaoOption.nome}
        </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="categoria-select-label">Categoria</InputLabel>
        <Select
          labelId="categoria-select-label"
          id="categoria-select"
          value={String(categoria)}
          label="Categoria"
          onChange={handleCategoriaChange}
        >
          {categoriaOptions.map((categoriaOption) => (
            <MenuItem key={categoriaOption.id} value={categoriaOption.id}>
              {categoriaOption.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mt={2}>
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit({
              titulo,
              descricao,
              categoria_id: categoria, // Enviando o ID da categoria
              situacao_id: situacao,   // Enviando o ID da situação
            });
          }}
          variant="contained"
          color="primary"
        >
          {id ? 'Salvar Alterações' : 'Criar Chamado'}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate(`/${tableName}`)}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
