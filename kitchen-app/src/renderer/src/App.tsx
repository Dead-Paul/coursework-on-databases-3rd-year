import './assets/style.css';

import { useState } from 'react';
import Login from './components/login';
import Header from './components/header';
import Body from './components/body';


function App(): JSX.Element {
    const [selectedTable, setSelectedTable] = useState('order');
    const [userInfo, setUserInfo] = useState<{name: string, role: string}>({name: '', role: ''});
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);

    const TableChangeHandler = (selectedTable: string) => { setSelectedTable(selectedTable); };

    return (
    <>
        <Login setUserInfo={setUserInfo} userInfo={userInfo} isVisible={isLoginFormVisible} setIsVisible={setIsLoginFormVisible}/>
        <Header setSelectedTable={TableChangeHandler} userInfo={userInfo} setIsLoginFormVisible={setIsLoginFormVisible}/>
        <Body selectedTable={selectedTable} userInfo={userInfo}/>
    </>
    );
};

export default App;