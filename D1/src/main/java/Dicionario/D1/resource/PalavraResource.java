package Dicionario.D1.resource;

import Dicionario.D1.model.Palavra;
import Dicionario.D1.service.PalavraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/palavra")
public class PalavraResource {
    private final PalavraService palavraService;

    @Autowired
    public PalavraResource(PalavraService palavraService) {
        this.palavraService = palavraService;
    }

    @GetMapping
    public List<Palavra> buscarTodasPalavras(){
        return palavraService.buscaTodasPalavras();
    }

    @GetMapping("/buscarPorTonicidade/{tonicidade}")
    public List<Palavra> buscarPorTonicidade(@PathVariable String tonicidade){
        return palavraService.buscarPorTonicidade(tonicidade);
    }

    @GetMapping("/buscarPorCanonica/{canonica}")
    public List<Palavra> buscarPorCanonica(@PathVariable boolean canonica){
        return palavraService.buscarPorCanonica(canonica);
    }

    /*
    @GetMapping("/buscarPorCaracteristicas/{tonicidade}/{canonica}")
    public List<Palavra> buscarPorCaracteristicas(@PathVariable String tonicidade, @PathVariable boolean canonica){
        return palavraService.buscarPorCaracteristicas(tonicidade, canonica);
    }
    */

    @GetMapping("/buscarPorCaracteristicas")
    public List<Palavra> buscarPorCaracteristicas(@RequestParam String tonicidade, @RequestParam boolean canonica){
        return palavraService.buscarPorCaracteristicas(tonicidade, canonica);
    }

    @GetMapping("/buscar30PorCaracteristicas")
    public List<Palavra> buscar30PorCaracteristicas(@RequestParam String tonicidade, @RequestParam boolean canonica){
        return palavraService.buscar30PorCaracteristicas(tonicidade, canonica);
    }

    @PostMapping
    public Palavra salvarPalavra(@RequestBody Palavra palavra){
        return palavraService.salvarPalavra(palavra);
    }

    @PostMapping("/salvarLista")
    public List<Palavra> salvarListaPalavras(@RequestBody List<Palavra> palavras){
        return palavraService.salvarListaPalavras(palavras);
    }

    @DeleteMapping
    public void deletarPalavraPorId(@RequestParam("id") int idPalavra){
        palavraService.deletarPalavraPorId(idPalavra);
    }

    @DeleteMapping("/todos")
    public void limparBanco(){
        palavraService.limparBanco();
    }


}
