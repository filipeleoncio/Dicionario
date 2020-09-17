import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Grid, Header, List, Radio, Segment, Select } from 'semantic-ui-react';
import './App.css';
import { If } from './components/Index';

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
    isCanonica: Boolean,
    tonicidade: null,
    wordList: [],
    listaPessoal: []
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
      //console.log( listaRecebida );
      this.setState( { wordList: listaRecebida.data } );
      // this.setState( { isCanonica } );
      console.log( this.state.wordList );
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
    if ( !this.lista.includes( nome ) ) {
      this.lista.push( nome );
      // this.state.listaPessoal.push( nome );
      this.setState( { listaPessoal: this.lista } );
      console.log( "lista pessoal: " + this.state.listaPessoal );
    }
  };

  excluiPalavraListaPessoal = ( id ) => {
    this.lista.splice( id, 1 );
    this.setState( { listaPessoal: this.lista } );
  }

  render () {
    const { isCanonica, wordList, listaPessoal, tonicidade } = this.state;
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
            </If>
            { listaPessoal.map( ( word, index ) => (
              <div key={ index }>
                <Grid centered columns='2'>
                  <Grid.Row >
                    <Grid.Column textAlign='center' verticalAlign='middle'>
                      <Header as='h4'>
                        { word }
                      </Header>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                      <Button onClick={ () => this.excluiPalavraListaPessoal( index ) }>Excluir Palavra</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            ) ) }
          </Grid.Column>
          <Grid.Column width={ 4 } />
        </Grid.Row>
      </Grid >
    );
  }
}

export default App;
