import {BrowserRouter as Router, Switch, Route } from react-router-dom;

import ClientPortal from './components/Pages/ClientPortal'; // Step 2
import StaffPortal from './components/Pages/StaffPortal'; // Step 2
import AdminPortal from './components/Pages/AdminPortal'; // Step 2

export const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" >
                    <ClientPortal />
                    <StaffPortal />
                    <AdminPortal />
                </Route>
            </Switch>
        </Router>
    )
}