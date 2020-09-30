import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Grid, Header, List, Radio, Segment, Select } from 'semantic-ui-react';
import './App.css';
import { If } from './components/Index';
import Palavra from './classes/Palavra';

// import ReactExport from 'react-data-export';
import ReactExport from 'react-export-excel';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const consoantes = [ 'b', 'c', 'd', 'f', 'g', 'j', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v' ];
const ignorar = [ 'h', 'k', 'w', 'x', 'y', 'z' ];

const vogais = [ 'a', 'e', 'i', 'o', 'u' ];
const vogaisAcentuadas = [ 'á', 'é', 'í', 'ó', 'ú' ];

const consCons = [
  'br', 'cr', 'dr', 'fr', 'gr', 'lr', 'nr', 'pr', 'rr', 'sr', 'tr', 'vr', //termina com r
  'bl', 'cl', 'fl', 'gl', 'nl', 'pl', 'rl', 'sl', 'tl',                   //termina com l
  'ch', 'lh', 'nh',                                                       //termina com h
  'mp', 'mb',                                                             //contem m
  'st', 'rt', 'nt', 'lt',                                                 //termina com t
  'sm', 'lm',                                                             //termina com m
  'pn', 'ps', 'dv', 'ft', 'gn', 'bj',                                     //outros
  'nd', 'nc', 'ng', 'ngu', 'nqu'
]

const consConsI = [ 'Br', 'Cr', 'Dr', 'Fr', 'Gr', 'Pr', 'Tr',
  'Bl', 'Cl', 'Fl', 'Gl', 'Pl', 'Tl',
  'Ch',
  'Ps', 'Pn', 'Gn'
]

const vogalVogal = [ 'ae', "ai", "ao", "au",
  'ea', 'ei', 'eo', 'eu',
  'ia', 'ie', 'io', 'iu',
  'oa', 'oe', 'oi', 'ou',
  'ua', 'ue', 'ui', 'uo'
];

const vogalVogalI = [ 'ae', "ai", "ao", "au",
  'ea', 'ei', 'eo', 'eu',
  'ia', 'ie', 'io', 'iu',
  'oa', 'oe', 'oi', 'ou',
  'ua', 'ue', 'ui', 'uo'
];


const opcoes = [
  { key: '1', text: 'Oxitona', value: 'oxitona' },
  { key: '2', text: 'Paroxitona', value: 'paroxitona' },
  { key: '3', text: 'Proparoxitona', value: 'proparoxitona' }
]

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
  //checkboxIsChecked;

  handleChangeRadio = ( e, { value } ) => {
    if ( value === '1' )
      this.setState( { isCanonica: true } );
    else
      this.setState( { isCanonica: false } );
    //console.log( this.state.isCanonica );
  };

  handleSelection = ( e, { value } ) => {
    this.setState( { tonicidade: value } );
  };

  handleSubmit = async ( tonicidade, isCanonica ) => {
    if ( tonicidade && isCanonica != null ) {
      // const listaRecebida = await this.buscaLista();
      const listaRecebida = await this.buscaListaPorCaracteristicas( tonicidade, isCanonica );

      console.log( "lista recebida: ", listaRecebida );
      this.setState( { wordList: listaRecebida.data } );
      // this.setState( { isCanonica } );
      console.log( "lista: ", this.state.wordList );
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

  adicionaPalavraListaPessoal = ( nome ) => {
    if ( !this.lista.find( ( word ) => word.nome === nome ) ) {
      const palavra = new Palavra( nome, this.state.tonicidade, this.state.isCanonica );

      this.lista.push( palavra );

      // this.state.listaPessoal.push( nome );
      this.setState( { listaPessoal: this.lista } );
      console.log( "lista pessoal: " + this.state.listaPessoal );
    }
  };

  excluiPalavraListaPessoal = ( id ) => {
    this.lista.splice( id, 1 );
    this.setState( { listaPessoal: this.lista } );
  }

  gerarPseudoPalavras = async () => {
    let listaDePseudo = [];
    // this.state.listaPessoal.map( ( word ) => console.log( word.nome, word.isCanonica ) );
    var i;
    var entradaListaDePseudo = {
      nomePalavra: null,
      tonicidade: null,
      canonica: Boolean
    };
    this.state.listaPessoal.forEach( ( word ) => {
      if ( word.isCanonica ) {
        for ( i = 0; i < 4; i++ ) {
          const numSilabas = word.nome.length / 2;

          const silabaTrocada = Math.floor( Math.random() * numSilabas ); //silaba aleatoria

          var replacement;
          if ( silabaTrocada === 0 )
            replacement = consoantes[ Math.floor( Math.random() * consoantes.length ) ].toUpperCase() + vogais[ Math.floor( Math.random() * vogais.length ) ];
          else
            replacement = consoantes[ Math.floor( Math.random() * consoantes.length ) ] + vogais[ Math.floor( Math.random() * vogais.length ) ];

          var novaPalavra = this.retornaNovaPalavraModificada( word.nome, silabaTrocada * 2, replacement );

          novaPalavra = this.verificaAcentuacao( novaPalavra, word.tonicidade, word.isCanonica );
          entradaListaDePseudo = {
            nomePalavra: novaPalavra,
            tonicidade: word.tonicidade,
            canonica: word.isCanonica
          }
          // listaDePseudo.push( novaPalavra );
          listaDePseudo.push( entradaListaDePseudo );

          console.log( "palavra adicionada a lista", novaPalavra );
          console.log( "Lista atual:", listaDePseudo );
        }

      }
      else {
        let partes = [];
        var parte = {
          letras: [],
          isVogal: Boolean,
          indiceInicio: null
        };
        var nomeSemAcentos = word.nome.normalize( 'NFD' ).replace( /[^a-zA-Zs]/g, "" ); //guardar posiçao acento
        console.log( "com acentos:", word.nome );
        console.log( "sem acentos:", nomeSemAcentos );
        var isVogal;

        if ( vogais.find( ( v ) => v === nomeSemAcentos.charAt( 0 ).toLowerCase() ) ) {
          isVogal = true;
          parte.letras.push( nomeSemAcentos.charAt( 0 ) );
          parte.isVogal = isVogal;
          parte.indiceInicio = 0;
          console.log( "primeira letra eh vogal:", isVogal, nomeSemAcentos.charAt( 0 ) );
        }
        else {
          isVogal = false;
          parte.letras.push( nomeSemAcentos.charAt( 0 ) );
          parte.isVogal = isVogal;
          parte.indiceInicio = 0;
          console.log( "primeira letra nao eh vogal:", isVogal, nomeSemAcentos.charAt( 0 ) );
        }

        for ( let t = 1; t < nomeSemAcentos.length; t++ ) {
          var isVogalLocal;
          if ( vogais.find( ( v ) => v === nomeSemAcentos.charAt( t ) ) ) {
            isVogalLocal = true;
          }
          else {
            isVogalLocal = false;
          }

          console.log( "letra ", nomeSemAcentos.charAt( t ), "vogal", isVogalLocal );

          if ( isVogal === isVogalLocal ) {
            parte.letras.push( nomeSemAcentos.charAt( t ) ); //Se achar 'Q' seguido de 'U', ou 'G' seguido de 'U', puxar os 2 como se fossem consoantes, pois sao um unico fonema
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

        var trocas;
        for ( i = 0; i < 4; i++ ) {
          novaPalavra = [];
          trocas = [];
          for ( var j = 0; j < partes.length; j++ )
            trocas.push( j );
          console.log( partes );
          console.log( trocas );

          this.shuffleArray( trocas );
          console.log( trocas );

          trocas.splice( Math.floor( trocas.length ) / 2 );
          // var trocasReduzidas = trocas.slice( 0, Math.floor( trocas.length ) / 2 );

          console.log( trocas );

          // partes.forEach( ( parte ) => novaPalavra.push( parte.letras.join( "" ) ) );
          // partes.map( ( parte ) => novaPalavra.push( parte.letras.join( "" ) ) );
          for ( j = 0; j < partes.length; j++ ) {
            novaPalavra.push( partes[ j ].letras.join( "" ) );
          }
          novaPalavra = novaPalavra.join( "" );
          console.log( "novaPalavra:", novaPalavra );
          console.log( "trocas:", trocas );

          // trocas.forEach( ( indiceTroca ) => {
          for ( let m = 0; m < trocas.length; m++ ) {
            // const tamanhoTroca = partes[ indiceTroca ].letras.length;
            const tamanhoTroca = partes[ trocas[ m ] ].letras.length;
            // var replacement;
            // var trocaIsVogal = partes[ indiceTroca ].isVogal;
            var trocaIsVogal = partes[ trocas[ m ] ].isVogal;
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
                // if ( indiceTroca === 0 ) {
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
                break;
              case 4:
                break;
              default:
            }
            // novaPalavra = this.retornaNovaPalavraModificada( novaPalavra, partes[ indiceTroca ].indiceInicio, replacement );
            novaPalavra = this.retornaNovaPalavraModificada( novaPalavra, partes[ trocas[ m ] ].indiceInicio, replacement );
          }
          // );

          // console.log( partes );
          // console.log( partes.join( "" ) );

          // var st1 = [];
          // partes.forEach( ( parte ) => st1.push( parte.join( "" ) ) );
          // console.log( st1.join( "" ) );
          novaPalavra = this.verificaAcentuacao( novaPalavra, word.tonicidade, word.isCanonica );
          entradaListaDePseudo = {
            nomePalavra: novaPalavra,
            tonicidade: word.tonicidade,
            canonica: word.isCanonica
          };
          listaDePseudo.push( entradaListaDePseudo );
          // listaDePseudo.push( novaPalavra );

          console.log( "palavra adicionada a lista", novaPalavra );
          console.log( "Lista atual:", listaDePseudo );
        }
      }

    } );
    this.setState( { listaDePseudoPalavras: listaDePseudo } );
  };

  shuffleArray = ( array ) => {
    for ( var i = array.length - 1; i > 0; i-- ) {
      var j = Math.floor( Math.random() * ( i + 1 ) );
      var temp = array[ i ];
      array[ i ] = array[ j ];
      array[ j ] = temp;
    }
  }

  retornaNovaPalavraModificada = ( palavraOriginal, index, replacement ) => {
    console.log( "palavra original:", palavraOriginal );
    console.log( "index:", index );
    console.log( "replacement:", replacement );
    var palavraFinal = palavraOriginal.substr( 0, index ) + replacement;
    if ( index < palavraOriginal.length - replacement.length )
      return palavraFinal + palavraOriginal.substr( index + replacement.length );
    return palavraFinal;

    // return palavraOriginal.substr( 0, index ) + replacement + index < palavraOriginal.length - replacement ? palavraOriginal.substr( index + replacement.length ) : null;
  };

  verificaAcentuacao = ( palavra, tonicidade, isCanonica ) => {
    switch ( tonicidade ) {
      case "oxitona":
        if ( isCanonica ) {
          if ( palavra.charAt( palavra.length - 1 ) === 'a' || palavra.charAt( palavra.length - 1 ) === 'e' || palavra.charAt( palavra.length - 1 ) === 'o' ) {
            console.log( "terminada em:", palavra.charAt( palavra.length - 1 ) );
            const idVogalAcentuada = vogais.indexOf( palavra.charAt( palavra.length - 1 ) );
            return this.retornaNovaPalavraModificada( palavra, palavra.length - 1, vogaisAcentuadas[ idVogalAcentuada ] );
          }
          else {
            return palavra;
          }
        }
        else {
          if ( palavra.length > 3 && ( palavra.charAt( palavra.length - 2 ) === 'e' && palavra.charAt( palavra.length - 1 ) === 'm' ) ) {
            console.log( "terminada em:", palavra.charAt( palavra.length - 1 ) );
            const idVogalAcentuada = vogais.indexOf( palavra.charAt( palavra.length - 2 ) );
            return this.retornaNovaPalavraModificada( palavra, palavra.length - 2, vogaisAcentuadas[ idVogalAcentuada ] );
          }
          else {
            return palavra;
          }
        }
      case "paroxitona":
        if ( isCanonica )
          return palavra;
        else {
          return palavra; //incompleto
        }
      case "proparoxitona":
        if ( isCanonica ) {
          console.log( "verificando acento ", palavra, "id:", palavra.charAt( palavra.length - 5 ) );
          const idVogalAcentuada = vogais.indexOf( palavra.charAt( palavra.length - 5 ) );
          if ( idVogalAcentuada >= 0 )
            return this.retornaNovaPalavraModificada( palavra, palavra.length - 5, vogaisAcentuadas[ idVogalAcentuada ] );
          return palavra;
        }
        else {
          return palavra; //incompleto
        }
      default:
    }
  };


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
            { wordList.map( ( word, index ) => (
              <div key={ index }>
                <Grid centered columns='2'>
                  <Grid.Row >
                    <Grid.Column textAlign='center' verticalAlign='middle'>
                      <Header as='h4'>
                        { word.nome }
                      </Header>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                      <Button onClick={ () => this.adicionaPalavraListaPessoal( word.nome ) }>Adicionar Palavra</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            ) ) }
            <If condition={ listaPessoal[ 0 ] }>
              <Header as='h2'>Lista Pessoal:</Header>
              { listaPessoal.map( ( word, index ) => (
                <div key={ index }>
                  <Grid centered columns='2'>
                    <Grid.Row >
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
              { listaDePseudoPalavras.map( ( entrada, index ) => (
                <Header as='h4' key={ index }>
                  { entrada.nomePalavra }
                </Header>
              ) ) }
              <ExcelFile filename="Pseudo-palavras" element={ <Button>Download de PseudoPalavras</Button> }>
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
