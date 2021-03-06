import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const databaseURL = "http://localhost:3000/api/board";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateDialog: false,
            deleteDialog: false,
            content: this.props.content,
            name: this.props.name,
            password: '',
            message: ''
        }
    }
    func(date, time) {
        let year = date.split('-')[0];
        let month = date.split('-')[1];
        let day = date.split('-')[2];
        let hour = time.split(':')[0];
        let minute = time.split(':')[1];
        let second = time.split(':')[2];
        let myDate = new Date(year, month - 1, day, Number(hour) + 9, minute, second);
        return myDate.toString();
    }
    handleUpdateDialogToggle = () => this.setState({
        updateDialog: !this.state.updateDialog,
        password: ''
    })
    handleDeleteDialogToggle = () => this.setState({
        deleteDialog: !this.state.deleteDialog,
        password: '',
        message: ''
    })
    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    handleUpdateSubmit = () => {
        this._put(this.props.id, this.state.name, this.state.content, this.state.password, this.state.password);
    }
    handleDeleteSubmit = () => {
        this._delete(this.props.id, this.state.password);
    }
    _put(id, name, content, currentPassword, newPassword) {
        return fetch(`${databaseURL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'password': currentPassword
            },
            body: JSON.stringify({
                "name": name,
                "content": content,
                "password": newPassword
            })
        }).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            if(data['success'] === false) {
                this.setState({message : data['data']});
            } else {
                this.handleUpdateDialogToggle();
                this.props.stateRefresh();
            }
        });
    }
    _delete(id, password) {
        return fetch(`${databaseURL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'password': password 
            }
        }).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            if(data['success'] === false) {
                this.setState({message : data['data']});
            } else {
                this.handleDeleteDialogToggle();
                this.props.stateRefresh();
            }
        });
    }
    render() {
        return (
            <div>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary">
                            {this.props.name}
                        </Typography>
                        <Typography>
                            {this.props.content.split('\n').map(line => {
                                return (<span>{line}<br/></span>);
                            })}
                        </Typography>
                        <Typography color="textSecondary">
                            {this.func(this.props.date.split('T')[0], this.props.date.split('T')[1].split('.')[0])}
                        </Typography>
                    </CardContent>
                    <CardActions style={{marginLeft: 10, marginBottom: 10}}>
                        <Typography
                            color="primary"
                            style={{marginRight: 10}}
                            onClick={this.handleUpdateDialogToggle}>
                            수정
                        </Typography>
                        <Typography
                            color="error"
                            style={{marginRight: 10}}
                            onClick={this.handleDeleteDialogToggle}>
                            삭제
                        </Typography>
                    </CardActions>
                </Card>
                <Dialog open={this.state.updateDialog} onClose={this.handleUpdateDialogToggle}>
                    <DialogTitle>게시물 수정하기</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="메시지"
                            type="text"
                            name="content"
                            value={this.state.content}
                            onChange={this.handleValueChange}
                            inputProps={{style: {height: 80}}}
                            fullWidth
                            multiline
                            rowsMax="6"
                            variant="outlined"/>
                        <br/><br/>
                        <TextField
                            label="현재 비밀번호"
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleValueChange}
                            inputProps={{style: {width: 320}}}
                            fullWidth
                            variant="outlined"/>
                        <br/>
                        <br/>
                        {this.state.message}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleUpdateSubmit}>
                            수정
                        </Button>
                        <Button variant="outlined" color="primary" onClick={this.handleUpdateDialogToggle}>닫기</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.deleteDialog} onClose={this.handleDeleteDialogToggle}>
                    <DialogTitle>게시물 삭제하기</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="비밀번호"
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleValueChange}
                            inputProps={{style: {width: 320}}}
                            fullWidth
                            variant="outlined"/>
                        <br/>
                        <br/>
                        {this.state.message}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleDeleteSubmit}>
                            삭제
                        </Button>
                        <Button variant="outlined" color="primary" onClick={this.handleDeleteDialogToggle}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Board;