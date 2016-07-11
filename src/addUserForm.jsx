import React from 'react'

class AddUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.dispatcher = props.dispatcher;
        this.state = {name: '', email: ''};
        this.render = this.render.bind(this);
        this.getCurrentState = this.getCurrentState.bind(this);
        this.handleNameChange = this.getCurrentState.bind(this);
        this.handleEmailChange = this.getCurrentState.bind(this);
        this.addUser = this.addUser.bind(this);
    }

    getCurrentState() {
        return this.state;
    }
    handleNameChange(e) {
        this.setState({name: e.target.value});
    }
    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    addUser() {
        this.dispatcher(this.getCurrentState());
        this.setState({name: '', email: ''});
    }

    render() {
        return (
            <form>
                User Name: <input type="text" name="username" value={this.state.name} onChange={this.handleNameChange} />
                <br />
                Email: <input type="text" name="useremail" value={this.state.email} onChange={this.handleEmailChange} />
                <button onClick={self.addUser}>Add User</button>
            </form>
        );
    }
}

export default AddUserForm;
