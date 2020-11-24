package Dicionario.D1.service.impl;

import Dicionario.D1.model.Palavra;
import Dicionario.D1.repository.PalavraRepository;
import Dicionario.D1.service.PalavraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@Service
public class PalavraServiceImpl implements PalavraService {

    private final PalavraRepository palavraRepository;

    @Autowired
    public PalavraServiceImpl(PalavraRepository palavraRepository) {
        this.palavraRepository = palavraRepository;
    }

    @Override
    public List<Palavra> buscaTodasPalavras() {
        return palavraRepository.findAll();
    }

    @Override
    public Palavra salvarPalavra(Palavra palavra) {
        return palavraRepository.save(palavra);
    }

    @Override
    public List<Palavra> salvarListaPalavras(List<Palavra> palavras){
        List<Palavra> resultado = new ArrayList<>();

        if(palavras == null)
            return resultado;

        for(Palavra palavra : palavras){
            resultado.add(palavraRepository.save(palavra));
        }

        //return palavraRepository.saveAll(palavras);
        return resultado;
    }

    @Override
    public void deletarPalavraPorId(int idPalavra) {
        palavraRepository.deleteById(idPalavra);
    }

    @Override
    public void limparBanco() {
        palavraRepository.deleteAll();
    }

    @Override
    public List<Palavra> buscarPorTonicidade(String tonicidade) {
        return palavraRepository.findByTonicidade(tonicidade);
    }

    @Override
    public List<Palavra> buscarPorCanonica(boolean canonica) {
        return palavraRepository.findByCanonica(canonica);
    }

    @Override
    public List<Palavra> buscarPorCaracteristicas(String tonicidade, boolean canonica) {
        return palavraRepository.findByTonicidadeAndCanonica(tonicidade, canonica);
    }

    @Override
    public List<Palavra> buscar30PorCaracteristicas(String tonicidade, boolean canonica) {
        List<Palavra> listaPalavras = buscarPorCaracteristicas(tonicidade, canonica);
        int tam = listaPalavras.size();

        List<Palavra> palavrasSelecionadas = new LinkedList<Palavra>(listaPalavras);

        Collections.shuffle(palavrasSelecionadas);
        return palavrasSelecionadas.subList(0, Math.min(tam, 30));
    }
}

