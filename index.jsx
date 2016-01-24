import React from 'react';
import {render} from 'react-dom';
import { createStore,bindActionCreators } from 'redux';
import { Provider ,connect} from 'react-redux';
import Immutable from 'immutable'
//action
function changeText(){
    return {
        type:'CHANGE_TEXT'
    }
}

function buttonClick(){
    return {
        type:'BUTTON_CLICK'
    }
}

function addInput(){
    return {
        type:'ADD_INPUT'
    }
}

function inputChange(text,index){
    return {
        type:'INPUT_CHANGE',
        text:text,
        index:index
    }
}

//reducer
const initialState = {
    text: 'Hello',
    inputs:[{
        content:'123'
    }]
}
function todoApp(state = initialState, action) {
    console.log(state);
    switch (action.type) {
        case 'CHANGE_TEXT':
            return {
                text:state.text=='Hello'?'Stark':'Hello',
                inputs:state.inputs
            }
        case 'BUTTON_CLICK':
            return {
                text: 'You just click button',
                inputs:state.inputs
            }
        case 'ADD_INPUT':
            return {
                text: state.text,
                inputs: [
                    ...state.inputs,
                    {
                        content:''
                    }
                ]
            }
        case 'INPUT_CHANGE':
            var newState = {
                text: action.text,
                inputs: state.inputs.slice(0,state.inputs.length)
            }
            newState.inputs[action.index].content = action.text;
            return newState;
            // const tmp = Immutable.Map(state);
            // console.log(tmp,action.index,action.text);
            // state.inputs[action.index].content = action.text;
            // return tmp;

            // return {
            //     text: action.text,
            //     inputs: [
            //         ...state.inputs.slice(0, action.index),
            //         {
            //             content:action.text
            //         },
            //         ...state.inputs.slice(action.index+1),
            //     ]
            // }
        default:
          return {
            text:'Hello',
            inputs:[{
                content:'123'
            }]
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
        this.props.actions.changeText();
    }

    render() {
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
        this.props.actions.buttonClick();
    }

    render() {
        return (
            <button onClick={this.handleClick} >change</button>
        );
    }
}

class Input extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        console.log(this.props);
        this.props.inputChange(event.target.value,this.props.index);
    }

    render() {
        return (
            <input onChange={this.handleChange}/>
        );
    }
}

class InputArea extends React.Component{
    constructor(props) {
        super(props);
        //this.handleChange = this.handleChange.bind(this);
    }

    handleChange(){
        //this.props.actions.buttonClick();
    }

    render() {
        var inputs = [];
        var _this = this;
        this.props.inputs.map((input, index) =>
            inputs.push(<Input index={index} key={index} inputChange={(text,index)=>{this.props.actions.inputChange(text,index)}}/>)
        )
        return (
            <div>
                {inputs}
            </div>
        );
    }
}

class InputAddButton extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.actions.addInput();
    }

    render() {
        return (
            <button onClick={this.handleClick} > Add Input </button>
        );
    }
}

class TextItem extends React.Component{
    constructor(props) {
        super(props);
        //this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.actions.addInput();
    }

    render() {
        return (
            <p> {this.props.text} </p>
        );
    }
}


class App extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        const { actions, text, inputs} = this.props;
        return (
            <div>
                <Hello actions={actions} text={text} />
                <Change actions={actions} />

                <InputArea inputs={inputs} actions={actions} />
                <InputAddButton actions={actions} />


            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        text: state.text ,
        inputs: state.inputs
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({
            changeText:changeText,
            buttonClick:buttonClick,
            addInput:addInput,
            inputChange:inputChange
        },dispatch)
    }
}

App = connect(mapStateToProps,mapDispatchToProps)(App)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

