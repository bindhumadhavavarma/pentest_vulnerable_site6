import { lazy, Suspense, useContext, useEffect } from 'react';

/// Components
import Index from "./jsx";
import { connect, useDispatch } from 'react-redux';
import {  Route, Switch, withRouter } from 'react-router-dom';
// action
/// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/main.css";
import { UserContext } from './context/UserContext';


const Login = lazy(() => {
    return new Promise(resolve => {
    setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
  });
});

function App () {
    const {user}=useContext(UserContext);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log((user!=null));
        // checkAutoLogin(dispatch, props.history);
    }, []
    );
    
    let routes = (  
        <Switch>
            <Route path='/' component={Login} />
        </Switch>
    );
    if (user!=null) {
		return (
			<>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>  
                   }
                >
                    <Index / >
                </Suspense>
            </>
        );
	
	}else{
		return (
			<div className="vh-100">
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                  }
                >
                    {routes}
                </Suspense>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: (state.user!=null),
    };
};

export default withRouter(connect(mapStateToProps)(App)); 

