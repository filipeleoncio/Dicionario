package Dicionario.D1.service;

import Dicionario.D1.model.Palavra;

import java.util.List;

public interface PalavraService {

    /**
     * Função para salvar uma palavra no banco
     * @param palavra
     */
    Palavra salvarPalavra(Palavra palavra);
    List<Palavra> salvarListaPalavras(List<Palavra> palavras);

    void deletarPalavraPorId(int idPalavra);
    void limparBanco();

    /**
     * Função para buscar todas as palavras no banco
     * @return Lista de palavras
     */
    List<Palavra> buscaTodasPalavras();

    /**
     * Função para buscar palavras com a tonicidade passada por parametro
     * @param tonicidade
     * @return Lista de palavras associadas
     */
    List<Palavra> buscarPorTonicidade(String tonicidade);

    /**
     * Função para buscar palavras com a canonicidade passada por parametro
     * @param canonica
     * @return Lista de palavras associadas
     */
    List<Palavra> buscarPorCanonica(boolean canonica);

    /**
     * Função para buscar palavras de acordo com as caracteristicas
     * @param tonicidade
     * @param canonica
     * @return Lista de palavras associadas
     */
    List<Palavra> buscarPorCaracteristicas(String tonicidade, boolean canonica);

    /**
     * Função para buscar 30 palavras de acordo com as caracteristicas
     * @param tonicidade
     * @param canonica
     * @return Lista de palavras associadas
     */
    List<Palavra> buscar30PorCaracteristicas(String tonicidade, boolean canonica);
}
