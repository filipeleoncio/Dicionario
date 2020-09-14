package Dicionario.D1.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Palavra {
    @GeneratedValue
    @Id
    private int id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "canonica")
    private boolean canonica;

    @Column(name = "tonicidade")
    private String tonicidade;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public boolean isCanonica() {
        return canonica;
    }

    public void setCanonica(boolean canonica) {
        this.canonica = canonica;
    }

    public String getTonicidade() {
        return tonicidade;
    }

    public void setTonicidade(String tonicidade) {
        this.tonicidade = tonicidade;
    }
}
