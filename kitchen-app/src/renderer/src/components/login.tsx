import { useState, useRef } from 'react';

const Login = (
        {setUserInfo, userInfo, isVisible, setIsVisible} : {
            setUserInfo : (userInfo: {name: string, role:string}) => void,
            userInfo: {name: string, role:string},
            isVisible: boolean,
            setIsVisible: (isVisible: boolean) => void
        }
    ) => {

    const [warningMessage, setWarningMessage] = useState('');
    const inputRef = {name: useRef<HTMLInputElement>(null), role: useRef<HTMLInputElement>(null)};

    const loginEvent = async () => {
        userInfo = {name: (inputRef.name.current?.value || ''), role: (inputRef.role.current?.value || '')};
        const query = await window.electron.database('SELECT * FROM "worker" WHERE fullname = ? AND role = ?', [userInfo.name, userInfo.role]);
        if (query.length) {
            setUserInfo(Object.assign(userInfo, {role : userInfo.role.toLowerCase()}))
            setWarningMessage('');
            setIsVisible(false);
        }
        else
            setWarningMessage('Тут є помилка!');
    };

    return (
        <div className='dark-div' style={{'display': isVisible? 'block' : 'none'}}>
            <div id='login' className='pop-up' style={{'display': isVisible? 'flex' : 'none'}}>
                <div>
                    <p>Ім'я та фамілія:</p>
                    <input ref={inputRef.name} />
                    <p>Роль:</p>
                    <input ref={inputRef.role} />
                </div>
                <button onClick={loginEvent}><p>Війти</p></button>
                <p style={{'color': 'red'}}>{warningMessage}</p>
            </div>
        </div>
    );
};

export default Login;