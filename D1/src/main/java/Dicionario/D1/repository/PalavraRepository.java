package Dicionario.D1.repository;

import Dicionario.D1.model.Palavra;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PalavraRepository extends CrudRepository<Palavra, Integer> {
    List<Palavra> findAll();

    List<Palavra> findByTonicidade(String tonicidade);
    List<Palavra> findByCanonica(boolean canonica);
    List<Palavra> findByTonicidadeAndCanonica(String tonicidade, boolean canonica);
}
