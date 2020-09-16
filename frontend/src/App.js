import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Grid, Header, List, Radio, Select } from 'semantic-ui-react';
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

  handleSubmit = async () => {
    const listaRecebida = await this.buscaLista();
    //console.log( listaRecebida );
    this.setState( { wordList: listaRecebida.data } );
    console.log( this.state.wordList );

    //console.log( "Canonicidade: " + this.state.isCanonica );
    //console.log( "Tonicidade: " + this.state.tonicidade );
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

  inserePalavra = async () => {
    const palavra1 = {
      "nome": "Manga",
      "canonica": false,
      "tonicidade": "paroxitona"
    }
    await axios.post( Api.url + Api.listaPalavras, palavra1 );
  }

  adicionaPalavraListaPessoal = ( nome ) => {
    this.state.listaPessoal.push( nome );
    console.log( "lista pessoal: " + this.state.listaPessoal );
  }

  render () {
    const { isCanonica, wordList, listaPessoal } = this.state;
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={ 4 } />
          <Grid.Column width={ 8 }>
            <Form onSubmit={ this.handleSubmit }>
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
            <List>
              <Header as='h2'>Lista de Palavras:</Header>
              { wordList.map( ( word, index ) => (
                <div key={ index }>
                  <List horizontal>
                    <List.Item>{ word.nome }</List.Item>
                    <Button onChange={ this.adicionaPalavraListaPessoal( word.nome ) }>Adicionar Palavra</Button>
                  </List>
                </div>
              ) ) }
            </List>
            <List>
              <Header as='h2'>Lista Pessoal:</Header>
              { listaPessoal.map( ( word, index ) => (
                <div key={ index }>
                  <List horizontal>
                    <List.Item>{ word }</List.Item>
                    <Button>Excluir Palavra</Button>
                  </List>
                </div>
              ) ) }
            </List>
          </Grid.Column>
          <Grid.Column width={ 4 } />
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
