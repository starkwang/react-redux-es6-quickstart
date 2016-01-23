import React from 'react';
import {render} from 'react-dom';
import { createStore,bindActionCreators } from 'redux';
import { Provider ,connect} from 'react-redux';

//action
function changeAction(){
    return {
        type:'CHANGE'
    }
}

function buttonAction(){
    return {
        type:'CHANGE'
    }
}

//reducer
const initialState = {
    text: 'Hello'
}
function todoApp(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE':
      return {
        text:state.text=='Hello'?'Stark':'Hello'
      }
    default:
      return {
        text:'Hello'
    };
  }
}

//store
let store = createStore(todoApp);


class Hello extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.actions.changeAction();
    }

    render() {
        var text = this.props.text;
        return (
            <h1 onClick={this.handleClick}> {this.props.text} </h1>
        );
    }
}

class Change extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.actions.buttonAction();
    }

    render() {
        return (
            <button onClick={this.handleClick} >change</button>
        );
    }
}

class App extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        var { actions, text} = this.props;
        console.log(this.props);
        return (
            <div>
                <Hello actions={actions} text={text}/>
                <Change actions={actions}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
  return { text: state.text }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({changeAction:changeAction,buttonAction:buttonAction},dispatch)
    }
}

App = connect(mapStateToProps,mapDispatchToProps)(App)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

