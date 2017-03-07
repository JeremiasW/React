import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY='react';
const PATH_BASE='https://hn.algolia.com/api/v1';
const PATH_SEARCH='/search';
const PARAM_SEARCH='query=';

//var url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = (searchTerm) => (item) => !searchTerm ||
      item.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        result:null,
        searchTerm: DEFAULT_QUERY
      };
      this.setSearchTopStories = this.setSearchTopStories.bind(this);
      this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
      this.onDismiss = this.onDismiss.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
      this.onSearchSubmit = this.onSearchSubmit.bind(this);
    }

    onSearchSubmit(event) {
        const {searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    componentDidMount() {
      const {searchTerm} = this.state;
      this.fetchSearchTopStories(searchTerm);
    }
    fetchSearchTopStories(searchTerm){
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
    }
    setSearchTopStories(result){
      this.setState({result});
    }
    onSearchChange(event){
      this.setState({searchTerm:event.target.value});
    }
    onDismiss(id){
      const isNotId = item => item.objectID !== id;
      const updatedHits = this.state.result.hits.filter(isNotId);
      this.setState({
        result: { ...this.state.result, hits: updatedHits }
      });
    }
    render(){
      const{searchTerm, result} = this.state;
      if(!result) { return null;}
      return (
        <div className="App">
          <Search value={searchTerm} onSubmit={this.onSearchSubmit} onChange={this.onSearchChange}>Search</Search>
          { result &&
           <Table list={result.hits} onDismiss={this.onDismiss} />
          }
        </div>
      );
    }
  }
const Search = ({value,onChange,onSubmit,children}) => {
        return (
          <form onSubmit={onSubmit}>
          {children}
          <input type="text" value={value} onChange={onChange}/>
          <button type="submit">{children}</button>
          </form>
       );
    }

  const Table = ({list, pattern, onDismiss}) => {
        return(
          <div>
            { list.map(item =>
              <div key={item.objectID} className="table-row">
              <span><a href={item.url}>{item.title}</a></span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span><Button onClick={()=>onDismiss(item.objectID)} type="button">Dismiss</Button></span>
              </div>
            )}
          </div>
    );
  }
const Button = ({onClick,className='',children}) => {
    return (<button onClick={onClick} className={className} type="button">{children}</button>);
}
export default App;
export {Search, Button, Table}
