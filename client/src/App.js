import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import ClipboardJS from "clipboard";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage"
import Rentals from "./pages/Rentals";
import ShoppingCart from "./pages/ShoppingCart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import AddPropsToRoute from "./components/AddPropsToRoute";
import NoMatch from "./pages/NoMatch";
import Modal from "./components/Elements/Modal";
import AddProduct from "./pages/addProductComponents/Product";
import API from "./utils/API";
import "./App.css";

let isAuthenticated = false;


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
          //  send a state object with the redirect to inform the login page of the intended destination
          //  'loginShow' is to make sure the login form shows instead of the signup form
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location, loginShow: true }
            }}
          />
        )
    }
  />
);


class App extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    loggedIn: false,
    username: null,
    firstName: null,
    lastName: null,
    categories: null
  };

  componentDidMount() {
    this.getUser();
    new ClipboardJS('.clipboard-btn');
  }

  closeModal = () => {
    this.setState({
      modal: { isOpen: false }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  }

  updateUser = userObject => {
    isAuthenticated = userObject.auth;
    this.setState(userObject.state);
  };

  getUser = () => {
    API.getUser().then(res => {
      console.log(res);
      if (res.data._id) {
        isAuthenticated = true;
        API.getAllCategories()
          .then(categories => {
            this.setState({
              loggedIn: true,
              username: res.data.username,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              categories: categories.data
            });
          })
      } else {
        API.getAllCategories()
          .then(categories => {
            this.setState({
              loggedIn: false,
              username: null,
              firstName: null,
              categories: categories.data
            });
          })
      }
    });
  };

  setCategories = () => {
    API.getAllCategories()
      .then(categories => {
        this.setState({ categories: categories.data });
      })
  }

  badLogout = () => {
    API.logout()
      .then(() => {
        this.updateUser({
          auth: false,
          state: {
            loggedIn: false,
            username: null,
            firstName: null
          }
        });
      })
      .catch(err => console.log(err));
    this.setModal({
      body: <h5>Your account has been locked. Please call Admin and complain.</h5>,
      buttons: <button onClick={this.closeModal}></button>
    })
  }

  logout = event => {
    if (event) {
      event.preventDefault();
    }
    console.log("logging out");
    API.logout()
      .then(() => {
        this.updateUser({
          auth: false,
          state: {
            loggedIn: false,
            username: null,
            firstName: null
          }
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          closeModal={this.closeModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <Router>
          <Switch>
            <Route exact path="/"
              render={routeProps => (
                <Fragment>
                  <Home
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />

            <Route exact path="/map"
              render={routeProps=>(
                <Fragment>
                  <MapPage
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />

            <Route exact path="/rentals"
              render={routeProps => (
                <Fragment>
                  <Rentals
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />

            <Route exact path="/signup"
              render={routeProps => (
                <Fragment>
                  <Login
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    logout={this.logout}
                    loginShow={false}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/login"
              render={routeProps => (
                <Fragment>
                  <Login
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    logout={this.logout}
                    loginShow={true}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/addProduct"
              render={routeProps=>(
                <Fragment>
                  <AddProduct
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />


            <PrivateRoute path="/profile" component={AddPropsToRoute(Profile, {
              closeModal: this.closeModal,
              setModal: this.setModal,
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              logout: this.logout,
              badLogout: this.badLogout
            })}
            />
            <PrivateRoute path="/cart" component={AddPropsToRoute(ShoppingCart, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              logout: this.logout
            })}
            />


            <Route
              //component={NoMatch}
              // exact
              //path="*"
              render={routeProps => (
                <Fragment>
                  <NoMatch
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}

export default App;
