import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Grid, Header, List, Radio, Segment, Select } from 'semantic-ui-react';
import './App.css';
import { If } from './components/Index';
import Palavra from './classes/Palavra';

const consoantes = [ 'b', 'c', 'd', 'f', 'g', 'j', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v' ];

const vogais = [ 'a', 'e', 'i', 'o', 'u' ];
const vogaisAcentuadas = [ 'á', 'é', 'í', 'ó', 'ú' ];

const consCons = [
  'br', 'cr', 'dr', 'fr', 'gr', 'lr', 'nr', 'pr', 'rr', 'sr', 'tr', 'vr', //termina com r
  'bl', 'cl', 'fl', 'gl', 'nl', 'pl', 'rl', 'sl', 'tl',                   //termina com l
  'ch', 'lh', 'nh',                                                       //termina com h
  'mp', 'mb',                                                             //contem m
  'st', 'rt', 'nt', 'lt',                                                 //termina com t
  'sm', 'lm',                                                             //termina com m
  'pn', 'ps', 'dv', 'ft', 'gn', 'bj', 'nc',                               //outros
  'ng', 'nq'
]

const consConsI = [ 'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr',
  'bl', 'cl', 'fl', 'gl', 'pl', 'tl',
  'ch',
  'ps', 'pn', 'gn'
]

const vogalVogal = [];

const vogalVogalI = [];


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
    this.state.listaPessoal.map( ( word ) => console.log( word.nome, word.isCanonica ) );

    this.state.listaPessoal.forEach( ( word ) => {
      if ( word.isCanonica ) {
        for ( var i = 0; i < 4; i++ ) {
          const numSilabas = word.nome.length / 2;

          const silabaTrocada = Math.floor( Math.random() * numSilabas ); //silaba aleatoria

          var replacement;
          if ( silabaTrocada === 0 )
            replacement = consoantes[ Math.floor( Math.random() * consoantes.length ) ].toUpperCase() + vogais[ Math.floor( Math.random() * vogais.length ) ];
          else
            replacement = consoantes[ Math.floor( Math.random() * consoantes.length ) ] + vogais[ Math.floor( Math.random() * vogais.length ) ];

          var novaPalavra = this.retornaNovaPalavraModificada( word.nome, silabaTrocada * 2, replacement );

          novaPalavra = this.verificaAcentuacao( novaPalavra, word.tonicidade );

          listaDePseudo.push( novaPalavra );
        }
      }
      else {
        for ( i = 0; i < 4; i++ ) {

        }
      }

    } );
    this.setState( { listaDePseudoPalavras: listaDePseudo } );
  };

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

  verificaAcentuacao = ( palavra, tonicidade ) => {
    switch ( tonicidade ) {
      case "oxitona":
        if ( palavra.charAt( palavra.length - 1 ) === 'a' || palavra.charAt( palavra.length - 1 ) === 'e' || palavra.charAt( palavra.length - 1 ) === 'o' ) {
          console.log( "terminada em:", palavra.charAt( palavra.length - 1 ) );
          const idVogalAcentuada = vogais.indexOf( palavra.charAt( palavra.length - 1 ) );
          return this.retornaNovaPalavraModificada( palavra, palavra.length - 1, vogaisAcentuadas[ idVogalAcentuada ] );
        }
        else {
          return palavra;
        }

      //em, ens
      case "paroxitona":
        break;
      case "proparoxitona":
        break;
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
              { listaDePseudoPalavras.map( ( nomePalavra, index ) => (
                <Header as='h4' key={ index }>
                  { nomePalavra }
                </Header>
              ) ) }
            </If>

          </Grid.Column>
          <Grid.Column width={ 4 } />
        </Grid.Row>
      </Grid >
    );
  }
}

export default App;
