import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Grid, Header, Radio, Select } from 'semantic-ui-react';
import './App.css';
import { If } from './components/Index';
import Palavra from './classes/Palavra';

import ReactExport from 'react-export-excel';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

/**
 * Consoantes usadas nas trocas singulares
 */
const consoantes = [ 'b', 'c', 'd', 'f', 'g', 'j', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v' ];
// const ignorar = [ 'h', 'k', 'w', 'x', 'y', 'z', 'ç' ];

/**
 * Consoantes que estão no final de paroxitonas acentuadas
 */
const acentoParoxitonasConsoantes = [ 'l', 'n', 'r', 'x', 's' ];

/**
 * Vogais usadas em trocas singulares
 */
const vogais = [ 'a', 'e', 'i', 'o', 'u' ];

/**
 * Vogais acentuadas usadas em trocas singulares
 */
const vogaisAcentuadas = [ 'á', 'é', 'í', 'ó', 'ú' ];

/**
 * Conjunto de consoantes usadas em trocas duplas
 */
const consCons = [
  'br', 'cr', 'dr', 'fr', 'gr', 'lr', 'nr', 'pr', 'rr', 'sr', 'tr', 'vr', //termina com r
  'bl', 'cl', 'fl', 'gl', 'nl', 'pl', 'rl', 'sl', 'tl',                   //termina com l
  'ch', 'lh', 'nh',                                                       //termina com h
  'mp', 'mb',                                                             //contem m
  'st', 'rt', 'nt', 'lt',                                                 //termina com t
  'sm', 'lm',                                                             //termina com m
  'pn', 'ps', 'dv', 'ft', 'gn', 'bj',                                     //outros
  'nd', 'nc', 'ng',
  // 'ngu', 'nqu'
]

/**
 * Conjunto de consoantes usadas em trocas duplas no inicio da palavra
 */
const consConsI = [ 'Br', 'Cr', 'Dr', 'Fr', 'Gr', 'Pr', 'Tr',
  'Bl', 'Cl', 'Fl', 'Gl', 'Pl', 'Tl',
  'Ch',
  'Ps', 'Pn', 'Gn'
]

/**
 * Conjunto de consoantes usadas em trocas triplas
 */
const consConsCons = [ 'rsp', 'rst' ];

/**
 * Conjunto de vogais usadas em trocas duplas
 */
const vogalVogal = [ 'ae', "ai", "ao", "au",
  'ea', 'ei', 'eo', 'eu',
  'ia', 'ie', 'io', 'iu',
  'oa', 'oe', 'oi', 'ou',
  'ua', 'ue', 'ui', 'uo'
];

/**
 * Conjunto de vogais usadas em trocas duplas no inicio da palavra
 */
const vogalVogalI = [ 'Ae', 'Ai', 'Ao', 'Au',
  'Ea', 'Ei', 'Eo', 'Eu',
  'Ia', 'Ie', 'Io', 'Iu',
  'Oa', 'Oe', 'Oi', 'Ou',
  'Ua', 'Ue', 'Ui', 'Uo'
];

/**
 * Opções que represantam a tonicidade da palavra
 */
const opcoes = [
  { key: '1', text: 'Oxitona', value: 'oxitona' },
  { key: '2', text: 'Paroxitona', value: 'paroxitona' },
  { key: '3', text: 'Proparoxitona', value: 'proparoxitona' }
]

/**
 * API de onde são buscadas as palavras de acordo com as características
 */
const Api = {
  url: 'http://localhost:8080',
  listaPalavras: '/palavra',
  buscar30PorCaracteristicas: ( tonicidade, isCanonica ) => `/palavra/buscar30PorCaracteristicas?tonicidade=${ tonicidade }&canonica=${ isCanonica }`
};

class App extends Component {
  state = {
    isCanonica: null,
    tonicidade: null,
    wordList: [],
    listaPessoal: [],
    listaDePseudoPalavras: []
  };

  lista = [];

  /**
   * Função que controla o radio button informando se a palavra é canonica ou não
   * @param {*} e
   * @param {*} param1
   */
  handleChangeRadio = ( e, { value } ) => {
    if ( value === '1' )
      this.setState( { isCanonica: true } );
    else
      this.setState( { isCanonica: false } );
  };

  /**
   * Função que lida com a seleção de uma das opções de tonicidade
   * @param {*} e
   * @param param1 Uma das opções de tonicidade
   */
  handleSelection = ( e, { value } ) => {
    this.setState( { tonicidade: value } );
  };

  /**
   * Função chamada quando o botão de busca é pressionado, buscando e atualizando a lista de palavras, caso as caracteristicas sejam validas
   * @param {String} tonicidade
   * @param {Boolean} isCanonica
   */
  handleSubmit = async ( tonicidade, isCanonica ) => {
    if ( tonicidade && isCanonica != null ) {
      const listaRecebida = await this.buscaListaPorCaracteristicas( tonicidade, isCanonica );

      this.setState( { wordList: listaRecebida.data } );
    }
    else {
      console.log( "sem informaçoes" );
    }
  };


  buscaLista = async () => {
    try {
      return await axios.get( Api.url + Api.listaPalavras );
    } catch ( err ) {
      const error = 'Erro -> buscaLista; Erro: ' + err;
      console.log( error );
      throw err;
    }
  };

  /**
   * Função que acessa a API que retorna a lista de palavras
   * @param {String} tonicidade
   * @param {String} isCanonica
   */
  buscaListaPorCaracteristicas = async ( tonicidade, isCanonica ) => {
    try {
      return await axios.get( Api.url + Api.buscar30PorCaracteristicas( tonicidade, isCanonica ) );
    } catch ( err ) {
      const error = 'Erro -> buscaListaPorCaracteristicas; Erro: ' + err;
      console.log( error );
      throw err;
    }

  };

  inserePalavra = async () => {
    const palavra1 = {
      "nome": "Morango",
      "canonica": false,
      "tonicidade": "paroxitona"
    }
    await axios.post( Api.url + Api.listaPalavras, palavra1 );
  };

  /**
   * Função que adiciona uma palavra na lista pessoal
   * @param {String} nome Palavra
   */
  adicionaPalavraListaPessoal = ( nome ) => {
    if ( !this.lista.find( ( word ) => word.nome === nome ) ) {
      const palavra = new Palavra( nome, this.state.tonicidade, this.state.isCanonica );

      this.lista.push( palavra );

      this.setState( { listaPessoal: this.lista } );
    }
  };

  /**
   * Função que exclui uma palavra da lista pessoal
   * @param {integer} id Índice da palavra a ser removida da lista
   */
  excluiPalavraListaPessoal = ( id ) => {
    this.lista.splice( id, 1 );
    this.setState( { listaPessoal: this.lista } );
  }

  /**
   * Função para gerar a entrada canonica na lista de pseudo-palavras
   * @param {Palavra} word Tipo composto com a palavra e suas características
   * @param {array} trocas Array de trocas a serem feitas na palavra
   * @return Palavra para entrada na lista de pseudo-palavras
   */
  retornaEntradaCanonicaListaPseudo = ( word, trocas ) => {
    var trocaIsVogal = Boolean;
    var replacement;
    var palavra = word.nome;
    for ( let m = 0; m < trocas.length; m++ ) {

      if ( trocas[ m ] % 2 === 1 ) // caso a palavra seja canonica, as vogais se encontram nas posições pares da palavra
        trocaIsVogal = true;
      else
        trocaIsVogal = false;

      if ( trocaIsVogal ) {
        replacement = vogais[ Math.floor( Math.random() * vogais.length ) ]; //substitui por uma vogal aleatória do vetor de vogais
      }
      else {
        replacement = consoantes[ Math.floor( Math.random() * consoantes.length ) ]; //substitui por uma consoante aleatoria do vetor de consoantes
      }

      palavra = this.retornaNovaPalavraModificada( palavra, trocas[ m ], replacement );
    }

    palavra = this.verificaAcentuacao( palavra, word.tonicidade, word.isCanonica, null );
    var entradaListaDePseudo = {
      nomePalavra: palavra,
      tonicidade: word.tonicidade,
      canonica: word.isCanonica
    }
    return entradaListaDePseudo;
  }

  /**
   * Função para gerar a entrada nao-canonica na lista de pseudo-palavras
   * @param {Palavra} word Tipo composto com a palavra e suas características
   * @param {array} trocas Array de trocas a serem feitas na palavra
   * @param {array} partes Array de partes da palavra
   * @param {integer} indiceAcento Índice em que se encontra o acento na palavra
   * @return Palavra para entrada na lista de pseudo-palavras
   */
  retornaEntradaNaoCanonicaListaPseudo = ( word, trocas, partes, indiceAcento ) => {
    var trocaIsVogal = Boolean;
    var replacement;
    var palavra = word.nome;
    for ( let m = 0; m < trocas.length; m++ ) {
      const tamanhoTroca = partes[ trocas[ m ] ].letras.length;
      trocaIsVogal = partes[ trocas[ m ] ].isVogal; //verifica se a parte em questão é composta por vogais ou consoantes

      //verifica o tamanho para fazer a troca equivalente
      switch ( tamanhoTroca ) {
        case 1:
          if ( trocaIsVogal ) {
            replacement = vogais[ Math.floor( Math.random() * vogais.length ) ];
          }
          else {
            replacement = consoantes[ Math.floor( Math.random() * consoantes.length ) ];
          }
          if ( trocas[ m ] === 0 ) {
            replacement = replacement.toUpperCase();
          }
          break;
        case 2:
          if ( trocas[ m ] === 0 ) {
            if ( trocaIsVogal ) {
              replacement = vogalVogalI[ Math.floor( Math.random() * vogalVogalI.length ) ];
            }
            else {
              replacement = consConsI[ Math.floor( Math.random() * consConsI.length ) ];
            }
          }
          else {
            if ( trocaIsVogal ) {
              replacement = vogalVogal[ Math.floor( Math.random() * vogalVogal.length ) ];
            }
            else {
              replacement = consCons[ Math.floor( Math.random() * consCons.length ) ];
            }
          }
          break;
        case 3:
          replacement = consConsCons[ Math.floor( Math.random() * consConsCons.length ) ];
          break;
        case 4:
          break;
        default:
      }
      palavra = this.retornaNovaPalavraModificada( palavra, partes[ trocas[ m ] ].indiceInicio, replacement );
    }

    palavra = this.verificaAcentuacao( palavra, word.tonicidade, word.isCanonica, indiceAcento );
    var entradaListaDePseudo = {
      nomePalavra: palavra,
      tonicidade: word.tonicidade,
      canonica: word.isCanonica
    };
    return entradaListaDePseudo;
  }

  /**
   * Função para verificar onde se pode modificar a palavra sem que seja alterado o motivo de sua acentuação
   * @param {String} nomeSemAcentos Palavra sem a acentuação
   * @param {integer} indiceAcento Índice onde se encontrava o acento
   * @param {Array} partes Array de partes da palavra
   * @returns Tamanho que pode ser alterável da palavra
   */
  retornaLimiteAlteracoes = ( nomeSemAcentos, indiceAcento, partes ) => {
    //Se nao tiver acento
    if ( indiceAcento === null ) {
      //termina em um => nao mexer nas 2 ultimas partes
      if ( nomeSemAcentos.charAt( nomeSemAcentos.length - 1 ) === 'm' && nomeSemAcentos.charAt( nomeSemAcentos.length - 2 ) === 'u' ) {
        return partes.length - 2;
      }
      //nao mexer na ultima parte
      else {
        return partes.length - 1;

      }
    }
    ///Se tiver acento, mudar a vontade pois as regras colocarão acento
    else {
      return partes.length;
    }
  }

  /**
   * Função para gerar as pseudo-palavras
   */
  gerarPseudoPalavras = async () => {
    let listaDePseudo = [];
    var i;

    var trocas;
    var novaPalavra;

    this.state.listaPessoal.forEach( ( word ) => {
      if ( word.isCanonica ) {
        //gera 4 pseudo-palavras a partir de uma palavra na lista pessoal
        for ( i = 0; i < 4; i++ ) {

          trocas = [];
          for ( let j = 0; j < word.nome.length; j++ ) //Caso a palavra seja canonica, suas partes tem tamanho 1 e seu vetor de trocas equivale ao seus indices
            trocas.push( j );

          //Vetor de trocas é embaralhado e dividido
          this.shuffleArray( trocas );
          trocas.splice( Math.floor( trocas.length ) / 2 );

          listaDePseudo.push( this.retornaEntradaCanonicaListaPseudo( word, trocas ) );
        }
      }
      else {
        let indiceAcento = null;
        let partes = [];
        let parte = {
          letras: [],
          isVogal: Boolean,
          indiceInicio: null
        };
        let isVogal;

        //Guarda posição do acento, caso exista
        for ( let t = 1; t < word.nome.length; t++ ) {
          if ( vogaisAcentuadas.find( ( v ) => v === word.nome.charAt( t ).toLowerCase() ) ) {
            indiceAcento = t;
          }
        }

        let nomeSemAcentos = word.nome.normalize( 'NFD' ).replace( /[^a-zA-Zs]/g, "" );

        //preenche o vetor de partes da palavra, onde cada parte é uma sequencia de vogais ou consoantes
        if ( vogais.find( ( v ) => v === nomeSemAcentos.charAt( 0 ).toLowerCase() ) ) {
          isVogal = true;
        }
        else {
          isVogal = false;
        }
        parte.letras.push( nomeSemAcentos.charAt( 0 ) );
        parte.isVogal = isVogal;
        parte.indiceInicio = 0;

        for ( let t = 1; t < nomeSemAcentos.length; t++ ) {
          var isVogalLocal;
          if ( vogais.find( ( v ) => v === nomeSemAcentos.charAt( t ) ) ) {
            isVogalLocal = true;
          }
          else {
            isVogalLocal = false;
          }

          if ( isVogal === isVogalLocal ) {
            parte.letras.push( nomeSemAcentos.charAt( t ) );
          }
          else {
            isVogal = !isVogal;
            partes.push( parte );
            parte = {
              letras: [],
              isVogal: Boolean,
              indiceInicio: null
            };
            parte.letras.push( nomeSemAcentos.charAt( t ) );
            parte.isVogal = isVogal;
            parte.indiceInicio = t;
          }
        }
        partes.push( parte );

        console.log( "partes", partes );

        //gera 4 pseudo-palavras a partir de uma palavra na lista pessoal
        for ( i = 0; i < 4; i++ ) {
          novaPalavra = [];
          trocas = [];
          let limite;


          limite = this.retornaLimiteAlteracoes( nomeSemAcentos, indiceAcento, partes );

          for ( let j = 0; j < limite; j++ )//Vetor de trocas se os indices das partes que podem ser alteradas na palavra
            trocas.push( j );

          console.log( limite );
          console.log( trocas );
          this.shuffleArray( trocas );
          trocas.splice( Math.floor( trocas.length ) / 2 );

          //Apos a troca de algumas partes da palavra, ela eh remontada
          for ( let j = 0; j < partes.length; j++ ) {
            novaPalavra.push( partes[ j ].letras.join( "" ) );
          }
          novaPalavra = novaPalavra.join( "" );

          listaDePseudo.push( this.retornaEntradaNaoCanonicaListaPseudo( word, trocas, partes, indiceAcento ) );
        }
      }
    } );
    this.setState( { listaDePseudoPalavras: listaDePseudo } );
  };

  /**
   * Função auxiliar para embaralhar um array
   * @param array Array a ser embaralhado
   */
  shuffleArray = ( array ) => {
    for ( var i = array.length - 1; i > 0; i-- ) {
      var j = Math.floor( Math.random() * ( i + 1 ) );
      var temp = array[ i ];
      array[ i ] = array[ j ];
      array[ j ] = temp;
    }
  }

  /**
   * Função para substiruir uma parte da palavra
   * @param {String} palavraOriginal Palavra original a ser modificada
   * @param {Integer} index Índice onde será efetuada a troca na palavra
   * @param {String} replacement Substituição a ser inserida na palavra
   * @returns Palavra modificada
   */
  retornaNovaPalavraModificada = ( palavraOriginal, index, replacement ) => {
    var palavraFinal = palavraOriginal.substr( 0, index ) + replacement;
    if ( index < palavraOriginal.length - replacement.length )
      return palavraFinal + palavraOriginal.substr( index + replacement.length );
    return palavraFinal;
  };

  /**
   * Função para verificar a acentuação de uma palavra
   * @param palavra
   * @param tonicidade
   * @param isCanonica
   * @param indiceAcento Indice em que se encontra o acento
   * @returns Palavra acentuada corretamente
   */
  verificaAcentuacao = ( palavra, tonicidade, isCanonica, indiceAcento ) => {
    switch ( tonicidade ) {
      case "oxitona":
        return this.verificaAcentuacaoOxitona( palavra, isCanonica );
      case "paroxitona":
        return this.verificaAcentuacaoParoxitona( palavra, isCanonica, indiceAcento );
      case "proparoxitona":
        return this.verificaAcentuacaoProparoxitona( palavra, isCanonica, indiceAcento );
      default:
    }
  };

  /**
   * Função para verificar a acentuação de palvras oxítonas
   * @param palavra
   * @param isCanonica
   * @returns Palavra acentuada corretamente
   */
  verificaAcentuacaoOxitona = ( palavra, isCanonica ) => {
    if ( isCanonica ) {
      if ( palavra.charAt( palavra.length - 1 ) === 'a' || palavra.charAt( palavra.length - 1 ) === 'e' || palavra.charAt( palavra.length - 1 ) === 'o' ) {
        const idVogalAcentuada = vogais.indexOf( palavra.charAt( palavra.length - 1 ) );
        return this.retornaNovaPalavraModificada( palavra, palavra.length - 1, vogaisAcentuadas[ idVogalAcentuada ] );
      }
      else {
        return palavra;
      }
    }
    else {
      if ( palavra.length > 3 && ( palavra.charAt( palavra.length - 2 ) === 'e' && palavra.charAt( palavra.length - 1 ) === 'm' ) ) {
        // console.log( "terminada em:", palavra.charAt( palavra.length - 1 ) );
        const idVogalAcentuada = vogais.indexOf( palavra.charAt( palavra.length - 2 ) );
        return this.retornaNovaPalavraModificada( palavra, palavra.length - 2, vogaisAcentuadas[ idVogalAcentuada ] );
      }
      else {
        return palavra;
      }
    }
  }

  /**
   * Função para verificar a acentuação de palavras paroxítonas
   * @param palavra
   * @param isCanonica
   * @param indiceAcento Índice onde se encontra o acento
   * @returns Palavra acentuada corretamente
   */
  verificaAcentuacaoParoxitona = ( palavra, isCanonica, indiceAcento ) => {
    if ( isCanonica )
      return palavra;
    else {
      if ( indiceAcento ) {
        if ( acentoParoxitonasConsoantes.find( ( c ) => c === palavra.charAt( palavra.length - 1 ) ) ) {
          const idVogalAcentuada = vogais.indexOf( palavra.charAt( indiceAcento ) );
          return this.retornaNovaPalavraModificada( palavra, indiceAcento, vogaisAcentuadas[ idVogalAcentuada ] );
        }
        let silabaFinal = palavra.charAt( palavra.length - 2 ) + palavra.charAt( palavra.length - 1 );
        if ( silabaFinal === 'ei' || silabaFinal === 'um' ) {
          const idVogalAcentuada = vogais.indexOf( palavra.charAt( indiceAcento ) );
          return this.retornaNovaPalavraModificada( palavra, indiceAcento, vogaisAcentuadas[ idVogalAcentuada ] );
        }
        return palavra;
      }
      else
        return palavra;
    }
  }

  /**
   * Função para verificar a acentuação de palavras paroxítonas
   * @param palavra
   * @param isCanonica
   * @param indiceAcento Índice onde se encontra o acento
   * @returns Palavra acentuada corretamente
   */
  verificaAcentuacaoProparoxitona = ( palavra, isCanonica, indiceAcento ) => {
    if ( isCanonica ) {
      // console.log( "verificando acento ", palavra, "id:", palavra.charAt( palavra.length - 5 ) );
      const idVogalAcentuada = vogais.indexOf( palavra.charAt( palavra.length - 5 ) );
      if ( idVogalAcentuada >= 0 )
        return this.retornaNovaPalavraModificada( palavra, palavra.length - 5, vogaisAcentuadas[ idVogalAcentuada ] );
      return palavra;
    }
    else {
      if ( indiceAcento ) {
        if ( acentoParoxitonasConsoantes.find( ( c ) => c === palavra.charAt( palavra.length - 1 ) ) ) {
          const idVogalAcentuada = vogais.indexOf( palavra.charAt( indiceAcento ) );
          return this.retornaNovaPalavraModificada( palavra, indiceAcento, vogaisAcentuadas[ idVogalAcentuada ] );
        }
        let silabaFinal = palavra.charAt( palavra.length - 2 ) + palavra.charAt( palavra.length - 1 );
        if ( silabaFinal === 'ei' || silabaFinal === 'um' ) {
          const idVogalAcentuada = vogais.indexOf( palavra.charAt( indiceAcento ) );
          return this.retornaNovaPalavraModificada( palavra, indiceAcento, vogaisAcentuadas[ idVogalAcentuada ] );
        }
        return palavra;
      }
      else
        return palavra;
    }
  }

  buscaPalavras = async () => {
    try {
      // const lista = await axios.get( 'http://www.portaldalinguaportuguesa.org/advanced.php?action=search&act=advanced' );
      // const lista = await axios.get( 'http://www.portaldalinguaportuguesa.org/advanced.php?action=lemma&lemma=178061' );
      const lista = await axios.get( 'http://www.portaldalinguaportuguesa.org/index.php?action=fonetica&act=list&region=lbx' );
      console.log( lista );
    } catch ( err ) {
      const error = 'Erro -> buscaLista; Erro: ' + err;
      console.log( error );
      throw err;
    }
  };

  render () {
    const { isCanonica, wordList, listaPessoal, listaDePseudoPalavras, tonicidade } = this.state;
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={ 4 } />
          <Grid.Column width={ 8 }>
            <Form onSubmit={ () => this.handleSubmit( tonicidade, isCanonica ) }>
              <Form.Field
                control={ Select }
                options={ opcoes }
                label='Tonicidade'
                placeholder='Tonicidade'
                onChange={ this.handleSelection }
              />
              <Form.Group inline>
                <Form.Field
                  control={ Radio }
                  label='Canonica'
                  value='1'
                  checked={ isCanonica === true }
                  onChange={ this.handleChangeRadio }
                />
                <Form.Field
                  control={ Radio }
                  label='Não Canonica'
                  value='2'
                  checked={ isCanonica === false }
                  onChange={ this.handleChangeRadio }
                />
              </Form.Group>
              <Form.Field control={ Button } >Buscar</Form.Field>
            </Form>
            <If condition={ wordList[ 0 ] }>
              <Header as='h2'>Lista de Palavras:</Header>
            </If>
            <div class="showList">
              { wordList.map( ( word, index ) => (
                <div class="showItem">
                  <Button class="showButton" key={ index } onClick={ () => this.adicionaPalavraListaPessoal( word.nome ) }>{ word.nome }</Button>
                </div>
              ) ) }
            </div>

            <If condition={ listaPessoal[ 0 ] }>
              <Header as='h2'>Lista Pessoal:</Header>
              { listaPessoal.map( ( word, index ) => (
                <div key={ index }>
                  <Grid centered columns='2'>
                    <Grid.Row>
                      <Grid.Column textAlign='center' verticalAlign='middle'>
                        <Header as='h4'>
                          { word.nome }
                        </Header>
                      </Grid.Column>
                      <Grid.Column textAlign='center'>
                        <Button onClick={ () => this.excluiPalavraListaPessoal( index ) }>Excluir Palavra</Button>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div>
              ) ) }
              <Button onClick={ this.gerarPseudoPalavras }>Gerar Pseudo-palavras</Button>
            </If>
            <If condition={ listaDePseudoPalavras[ 0 ] }>
              <Header as='h2'>Lista de Pseudo Palavras: </Header>
              {/* { listaDePseudoPalavras.map( ( entrada, index ) => (
                <Header as='h4' key={ index }>
                  { entrada.nomePalavra }
                </Header>
              ) ) } */}
              <ExcelFile filename="Pseudo-palavras" element={ <Button>Download</Button> }>
                <ExcelSheet data={ listaDePseudoPalavras } name="Pseudo-palavras">
                  <ExcelColumn label="Palavras" value="nomePalavra" />
                  <ExcelColumn label="Tonicidade" value="tonicidade" />
                  <ExcelColumn label="Canonica"
                    value={ ( col ) => col.canonica ? "Sim" : "Não" } />
                </ExcelSheet>
              </ExcelFile>
            </If>

          </Grid.Column>
          <Grid.Column width={ 4 } />
        </Grid.Row>
      </Grid >
    );
  }
}

export default App;
