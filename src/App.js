// src/App.js

import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Debits from './components/Debits';
import Credits from './components/Credits';
import axios from "axios";
import {Link} from 'react-router-dom';
import './App.css';
import { v4 as uuid } from 'uuid';

class App extends Component {
  constructor(props) {  // Create and initialize state
    super(props); 
    this.state = {
      accountBalance: 1234567.89,
      currentUser: {
        userName: 'Anthony',
        memberSince: '11/22/99',
      },
      debits: [],
      credits: [],
      debitSum: 0, 
      creditSum: 0
    };
  }

  async componentDidMount() {
    let debits = await axios.get("https://moj-api.herokuapp.com/debits")
    let credits = await axios.get("https://moj-api.herokuapp.com/credits")
   
    //get data from API response
    debits = debits.data
    credits = credits.data

    let debitSum = 0, creditSum = 0;
    // Calculating total debit 
    debits.forEach((debit) => {
      debitSum += debit.amount
    })
    // Calculating total credit
    credits.forEach((credit) => {
      creditSum += credit.amount
    })
    // Calculating accountBalance
    let accountBalance = (creditSum - debitSum).toFixed(2);

    this.setState({debits, credits, accountBalance, debitSum, creditSum});
  }

  // Update Balance Function 
  // Calculate debitSum, creditSum, and accountBalance once again 
  // Since componentDidMount is only called once
  updateBal = () => {
    this.state.debitSum = 0, this.state.creditSum = 0;
    this.state.debits.forEach((debit) => {
      this.state.debitSum += debit.amount
    })
    this.state.credits.forEach((credit) => {
      this.state.creditSum += credit.amount
    })
    let accountBalance = (this.state.creditSum - this.state.debitSum).toFixed(2);
    this.setState({accountBalance})
  } 

  // addDebit Function
  addDebit = (e) => {
    e.preventDefault();
    const description  = e.target[0].value;
    const amount  = Number(e.target[1].value);
    // Getting the Current Date
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
    // Create unique id 
    const unique_id = uuid();

    this.setState({debits: [...this.state.debits, {
        id: unique_id, 
        amount: amount, 
        description: description, 
        date: date 
        }
    ]},
      // Callback function to calculate balance since setState is async
      this.updateBal
    );
  }

  // addCredit Function
  addCredit = (e) => {
    e.preventDefault();
    const description  = e.target[0].value;
    const amount  = Number(e.target[1].value);
    // Getting the Current Date
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
    // Create unique id 
    const unique_id = uuid();

    this.setState({credits: [...this.state.credits, {
        id: unique_id, 
        amount: amount, 
        description: description, 
        date: date 
        }
    ]},
      // Callback function to calculate balance since setState is async
      this.updateBal
    );
  }
  
  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser}
    newUser.userName = logInInfo.userName
    this.setState({currentUser: newUser})
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance}/>);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince}  />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)  // Pass props to "LogIn" component
    
    // DebitsComponent
    const { debits } = this.state;
    const DebitsComponent = () => (
      <div>
        <Debits addDebit={this.addDebit} debits={debits} />
        <p>Balance: {this.state.accountBalance}</p>
        <p>Credits: {this.state.creditSum}</p>
        <p>Debits: {this.state.debitSum}</p>
        <Link to="/">Return to Home</Link>
      </div>
    )
    // CreditsComponent
    const { credits } = this.state;
    const CreditsComponent = () => (
      <div>
        <Credits addCredit={this.addCredit} credits={credits} />
        <p>Balance: {this.state.accountBalance}</p>
        <p>Credits: {this.state.creditSum}</p>
        <p>Debits: {this.state.debitSum}</p>
        <Link to="/">Return to Home</Link>
      </div>
    )
    return (
      <Router>
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;