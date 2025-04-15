import { useEffect, useState } from 'react';
import { Tables } from './tableManager';

const CreateTable = (
        {tableName, tableItems, userInfo, setPropertiesDisplay}: {
            tableName: string,
            tableItems: Object[],
            userInfo: {name: string, role: string},
            setPropertiesDisplay: (PropertiesDisplayFunction: JSX.Element ) => void
        }
    ) => {
    return (
        <table className='info-table'>
            <tr>
                {Tables[tableName].TableObject?.columns.map(
                        (columnName: {translatedName: string, name: string }) => 
                            (<td>{columnName.translatedName}</td>)
                    )}
            </tr>

            {
                tableItems.map(tableItem => (
                    <tr onClick={ async () => 
                        setPropertiesDisplay(
                            await Tables[tableName].PropertyObject.onClick(userInfo.role, 
                                setPropertiesDisplay, new Tables[tableName].TableObject(tableItem))
                        )}
                        onContextMenu={ async () =>
                            setPropertiesDisplay(
                                await Tables[tableName].PropertyObject.onContextMenu(userInfo.role, 
                                    setPropertiesDisplay, new Tables[tableName].TableObject(tableItem))
                        )}
                    > {
                        Tables[tableName].TableObject.columns.map((column: {name: string, translatedName:string}) =>
                            (<td>{tableItem[column.name]}</td>)
                        )
                    } </tr>
                ))
            }
        </table>
    )
};

const Body = ({selectedTable, userInfo} : {selectedTable: string, userInfo: {name: string, role: string}}) => {
    selectedTable = selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1);
    const [PropertiesDisplay, setPropertiesDisplay] = useState<JSX.Element | null>(null);
    const [tableItems, setTableItems] = useState<Object[]>([]);

    useEffect(() => {
        const getTableItems = async () => {
            try {
                setTableItems(await window.electron.database(Tables[selectedTable].TableObject.getQuery(userInfo.role)));
            } catch (error) {
                console.log(Tables[selectedTable].TableObject.getQuery(userInfo.role));
                console.warn(`User is unauthorized or there is an error in the code: \n"${error}".`);
            };
        };
        getTableItems();
    }, [userInfo, selectedTable, PropertiesDisplay]);

    return (
    <div id="body">
        <div className='functional-buttons'>
            {selectedTable === 'Warehouse'
                ? ([
                    <button onClick={() => Tables.Warehouse.PropertyObject.AddProduct(setPropertiesDisplay)}>
                        <p>Додати продукт</p>
                    </button>,
                    <button onClick={() => Tables.Warehouse.PropertyObject.findProduct(setPropertiesDisplay)}>
                        <p>Пошук</p>
                    </button>
                    ])
                : selectedTable === 'Recipe' || selectedTable === 'Menu'
                    ? (<button onClick={() => Tables.Recipe.PropertyObject.findRecipe(userInfo.role, setPropertiesDisplay)}>
                            <p>Пошук</p>
                        </button>)
                    : null
            }
            {userInfo.role === 'executive chef' && selectedTable === 'Recipe'
                ? (<button onClick={() => Tables.Recipe.PropertyObject.addRecipe(setPropertiesDisplay)}>
                        <p>Додати рецепт</p>
                    </button>)
                : null
            }
        </div>
        <CreateTable tableName={selectedTable} tableItems={tableItems} userInfo={userInfo} setPropertiesDisplay={setPropertiesDisplay}/>
        {PropertiesDisplay}
    </div>
    )
};

export default Body;