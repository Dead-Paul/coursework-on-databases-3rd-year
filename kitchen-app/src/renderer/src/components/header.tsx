import { ChangeEvent, useState } from 'react';
import userLogo from '../assets/user.png';
import {user} from './tableManager';

const UserInfo = (
        {isVisible, setIsVisible, userInfo, setIsLoginFormVisible} : {
            isVisible: boolean,
            setIsVisible: (isVisible: boolean) => void,
            userInfo: {name: string, role: string},
            setIsLoginFormVisible: (isLoginFormVisible: boolean) => void
        }
    ) => {
    return (
        <div className='dark-div' style={{display: (isVisible? 'flex' : 'none')}}>
            <div id="user-info" className='pop-up' style={{display: (isVisible? 'flex' : 'none')}}>
                <div>
                    <p>Name: {userInfo.name}</p>
                    <p>Role: {userInfo.role}</p>
                </div>
                <button onClick={() => {
                        setIsVisible(false);
                        setIsLoginFormVisible(true);
                    }}>
                    <p>Вийти</p>
                </button>
                <button onClick={() => setIsVisible(false)} style={{'marginTop': '50px'}}><p>Закрити</p></button>
            </div>
        </div>
    );
};

const Header = (
        {setSelectedTable, userInfo, setIsLoginFormVisible} : {
            setSelectedTable: (selectedTable: string) => void, 
            userInfo: {name: string, role: string},
            setIsLoginFormVisible: (isLoginFormVisible: boolean) => void
        }
    ) : JSX.Element => {
    const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
    const userAccess = user(userInfo.role.toLowerCase() as 'executive chef' | 'cook chef' | 'sous chef' | 'salad chef' | 'waiter');

    return (
        <div id="header">
            <select onChange={(event : ChangeEvent<HTMLSelectElement>) => (setSelectedTable(event.target.value))}>
                {userAccess?.getAllTableWithAccess().map(table => 
                    (table? (<option value={table?.tableName}>{table?.tableTranslatedName}</option>) : null)
                )}
            </select>
            <button onClick={() => (!isUserInfoVisible ? setIsUserInfoVisible(true) : setIsUserInfoVisible(false))}>
                <img src={userLogo}/>
                <p>{userInfo.name}</p>
            </button>
            <UserInfo isVisible={isUserInfoVisible} userInfo={userInfo} setIsLoginFormVisible={setIsLoginFormVisible}
                setIsVisible={setIsUserInfoVisible}/>
        </div>
    );
};

export default Header;