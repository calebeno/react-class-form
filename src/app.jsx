import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, Link, browserHistory, RouteHandler} from 'react-router'
import $ from 'jquery';
import {createStore} from 'redux'
import AddUserForm from './addUserForm'

var userList = [];

// sample redux stuff
// --------------------------------------------
// The Reducer Function
var dummyReducer = function (state=[], action) {
    console.log(state);
    console.log(action);
    if (action.type === 'ADD_USER') {
        state = action.user;
    }
    return state;
};

// Create a store by passing in the reducer
var dummyStore = createStore(dummyReducer);

//---------------------------------------------

var Home = React.createClass({
    render: function () {
        return (
            <div>
                <p>Welcome to the Home Page...</p>
            </div>
        );
    }
});

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list: []};
        this.render = this.render.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.reduxDispatch = this.reduxDispatch.bind(this);
    }

    componentDidMount() {
        var self = this;
        $.getJSON('/data.json').done(function (data) {
            userList = data.list;
            self.setState({
                list: data.list
            });
        });

        // magic of redux here below, this listens for changes to the dummy store and updates the state
        dummyStore.subscribe(function () {
            var tmpList = self.state.list;
            tmpList.push(dummyStore.getState());
            console.log("getState", dummyStore.getState());
            self.setState(tmpList);
        });
    }

    render() {
        var self = this;
        var list = this.state.list;
        return (
            <div>
                <ul>
                    {list.map(function (item, i) {
                        return <li key={i}><Link to={`/users/${i}`}>{item.name}</Link> - {item.email}</li>
                    })}
                </ul>
                <AddUserForm dispatcher={self.reduxDispatch} />
                <button onClick={self.clickHandler}>Test Clicker</button>
                <button onClick={self.reduxDispatch}>Dispatch</button>
            </div>
        );
    }

    clickHandler() {
        console.log('so this was a click event, now you can use a similar event to "save"', this.state);
        var tmpState = this.state.list;
        tmpState.push({name: "hello world", email: 'hello@icct.com'});
        this.setState({list: tmpState});
    }

    reduxDispatch(user) {
        console.log('dispatched...');
        dummyStore.dispatch({
            type: 'ADD_USER',
            user: user
        });
    }
}

var UsersDetail = React.createClass({
    render: function () {
        var id = this.props.params.id;
        var userDetail = userList[id] || {name: '', email: ''};
        return (
            <div>
                <div>name: {userDetail.name}</div>
                <div>email: {userDetail.email}</div>
            </div>
        );
    }
});

var MainLayout = React.createClass({
    render: function () {
        return (
            <div>
                <span>Header:</span>
                <Link to="/">Home</Link> |
                <Link to="/users">Users</Link>
                <hr/>
                <div>
                    <h2>Body Content</h2>
                    {this.props.children}
                </div>
                <div>
                    <hr/>
                    footer
                </div>
            </div>
        );
    }
});

ReactDOM.render((
    <Router>
        <Route component={MainLayout}>
            <Route path="/" component={Home}/>
            <Route path="/users" component={Users}/>
            <Route path="/users/:id" component={UsersDetail}/>
        </Route>
    </Router>
), document.getElementById('app'));
