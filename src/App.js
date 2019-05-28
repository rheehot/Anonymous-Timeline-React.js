import React from 'react';
import Board from './components/Board';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './App.css';

const databaseURL = "http://localhost:3000/api/board";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: {},
      searchName: '',
      searchContent: '',
      name: '',
      content: '',
      password: '',
    }
  }
  _get() {
    fetch(`${databaseURL}`).then(res => {
      if(res.status !== 200) {
          throw new Error(res.statusText);
      }
      return res.json();
    }).then(data => {
      this.setState({boards: data['data']})
    });
  }
  componentDidMount() {
    this._get();
  }
  handleSearch = () => {
    fetch(`${databaseURL}?name=${this.state.searchName}&content=${this.state.searchContent}`).then(res => {
      if(res.status !== 200) {
          throw new Error(res.statusText);
      }
      return res.json();
    }).then(data => this.setState({boards: data['data']}));
  }
  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }
  handleEnter = (e) => {
    if(e.key === 'Enter') {
      this.handleSearch();
    }
  }
  handleSubmit = () => {
    fetch(`${databaseURL}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "name": this.state.name,
        "content": this.state.content,
        "password": this.state.password
      })
    }).then(res => {
      if(res.status !== 200) {
          throw new Error(res.statusText);
      }
      return res.json();
    }).then(data => {
      this.setState({
        searchName: '',
        searchContent: '',
        content: '',
      });
      this._get();
    });
  }
  render() {
    return (
      <div className="container">
        <div className="write-area">
          <TextField
            label="이름"
            type="text"
            margin="normal"
            variant="outlined"
            name="name"
            value={this.state.name}
            onChange={this.handleValueChange}
            onKeyPress={this.handleEnter}
          />
          <TextField
            label="비밀번호"
            type="password"
            margin="normal"
            variant="outlined"
            name="password"
            value={this.state.password}
            onChange={this.handleValueChange}
            onKeyPress={this.handleEnter}
            style={{marginRight: 20}}
          />
          <TextField
            label="메시지를 입력하세요."
            multiline
            rowsMax="6"
            name="content"
            value={this.state.content}
            onChange={this.handleValueChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <br />
          <Button variant="contained" onClick={this.handleSubmit}>
            작성
          </Button>
          <hr />
        </div> 
        <div className="search-area">
          <TextField
            label="이름"
            type="text"
            margin="normal"
            variant="outlined"
            name="searchName"
            value={this.state.searchName}
            onChange={this.handleValueChange}
            onKeyPress={this.handleEnter}
          />
          <TextField
            label="내용"
            type="text"
            margin="normal"
            variant="outlined"
            name="searchContent"
            value={this.state.searchContent}
            onChange={this.handleValueChange} 
            onKeyPress={this.handleEnter}
            style={{marginRight: 20}}
          />
          <Button variant="contained" onClick={this.handleSearch}>
            검색
          </Button>
        </div>
        {Object.keys(this.state.boards).map(id => {
          let board = this.state.boards[id];
          return (
            <div>
              <Board key={board.id} id={board.id} name={board.name} content={board.content} date={board.date}/>
              <br/>
            </div>
          )
        })}
      </div>
    );
  }
}

export default App;