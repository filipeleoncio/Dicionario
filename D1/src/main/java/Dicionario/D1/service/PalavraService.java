package Dicionario.D1.service;

import Dicionario.D1.model.Palavra;

import java.util.List;

public interface PalavraService {
    Palavra salvarPalavra(Palavra palavra);
    List<Palavra> salvarListaPalavras(List<Palavra> palavras);

    void deletarPalavraPorId(int idPalavra);
    void limparBanco();

    List<Palavra> buscaTodasPalavras();

    List<Palavra> buscarPorTonicidade(String tonicidade);
    List<Palavra> buscarPorCanonica(boolean canonica);
    List<Palavra> buscarPorCaracteristicas(String tonicidade, boolean canonica);

    List<Palavra> buscar30PorCaracteristicas(String tonicidade, boolean canonica);
}
