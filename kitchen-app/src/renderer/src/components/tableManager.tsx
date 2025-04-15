import {useEffect, useState} from 'react'

namespace Tables {
    export namespace Order {
        export const translated: string = 'Замовлення';

        export class DatabaseObject {
            public id: number;
            public recipeId: number;
            public quantity: number;
            public createdAt: Date;

            constructor(orderItem : {id: number, recipe_id: number, quantity: number, created_at: Date | string}) {
                this.id = orderItem.id;
                this.recipeId = orderItem.recipe_id;
                this.quantity = orderItem.quantity;
                this.createdAt = new Date(orderItem.created_at);
            };
        };
        export class TableObject {
            public static getQuery = (userRole: string) => (
                `SELECT o.id, r.title, o.quantity, r.role, STRFTIME('%m-%d %H:%M', o.created_at) AS created_at FROM "order" o 
                    JOIN "recipe" r ON r.id = o.recipe_id 
                    ${userRole == 'waiter' || userRole == 'executive chef'? '' : `WHERE r.role = '${userRole}' `}
                    ORDER BY created_at ASC`
            );
            public static columns = [
                {translatedName: 'Назва страви', name: 'title'},
                {translatedName: 'Кількість порцій', name: 'quantity'},
                {translatedName: 'Роль кухаря', name: 'role'},
                {translatedName: 'Час створення', name: 'created_at'}
            ];

            public id: number;
            public recipeTitle: string;
            public quantity: number;
            public role: string;
            public createdAt: Date;

            constructor(orderItem: {id: number, title: string, quantity: number, role: string, created_at: Date}) {
                this.id = orderItem.id;
                this.recipeTitle = orderItem.title;
                this.quantity = orderItem.quantity;
                this.role = orderItem.role;
                this.createdAt = orderItem.created_at;
            };
        };
        export class PropertyObject {
            private static deleteOrder(id: number) {
                window.electron.database('DELETE FROM "order" WHERE id = ?', [id]);
            };

            public static async onClick(userRole: string, setDisplay: (display: JSX.Element | null) => void, order: TableObject) {
                const props = await window.electron.database(
                    `SELECT p.name, i.processing_type, i.amount || ' ' || p.measurement AS amount FROM "order" o 
                        JOIN "ingredient" i ON o.recipe_id = i.recipe_id
                        JOIN product p ON p.id = i.product_id
                        WHERE o.id = ?`, [order.id]) as {name: string, processing_type: string, amount: string}[];
                
                return (
                    <div className='dark-div'>
                        <div id='properties' className='pop-up'>
                            <h1>Рецепт "{order.recipeTitle}"</h1>
                            <p>🧾 Замовлено: <span style={{ fontWeight: 'bold'}}>{order.quantity}</span> порц.</p>
                            <table className='info-table'>
                                <tr>
                                    <td>Назва</td>
                                    <td>Тип обробки</td>
                                    <td>Кількість</td>
                                </tr>
                                {props.map(columnName => (
                                    (<tr>
                                        <td>{columnName.name}</td>
                                        <td>{columnName.processing_type}</td>
                                        <td>{columnName.amount}</td>
                                    </tr>)
                                ))}
                            </table>
                            <div className='functional-buttons'>
                                {userRole == 'waiter'
                                    ? null
                                    : (<button onClick={() => {this.deleteOrder(order.id); setDisplay(null)}}><p>Виконано!</p></button>)
                                }
                                <button onClick={() => setDisplay(null)}><p>Закрити</p></button>
                            </div>
                        </div>
                    </div>
                );      
            };
        };
    };

    export namespace Recipe {
        export const translated: string = 'Рецепти';

        export class DatabaseObject {
            public id: number;
            public title: string;
            public category: string;
            public role: string;
            public price: number;
            public weight: number;

            constructor(recipeItem : {id: number, title: string, category: string, role: string, price: number, weight: number}) {
                this.id = recipeItem.id;
                this.title = recipeItem.title;
                this.category = recipeItem.category;
                this.role = recipeItem.role;
                this.price = recipeItem.price;
                this.weight = recipeItem.weight;
            };
        };
        export class TableObject {
            public static getQuery = (userRole: string) => (
                `SELECT r.id, r.title, r.role, r.weight  FROM "recipe" r
                ${userRole == 'executive chef'? '' : `WHERE r.role = '${userRole}'`}`
            );
            public static columns = [
                {translatedName: 'Назва страви', name: 'title'},
                {translatedName: 'Роль кухаря', name: 'role'},
                {translatedName: 'Вага', name: 'weight'},
            ];

            public id: number;
            public title: string;
            public role: string;
            public weight: number;

            constructor(recipeItem: {id: number, title: string, role: string, weight: number}) {
                this.id = recipeItem.id;
                this.title = recipeItem.title;
                this.role = recipeItem.role;
                this.weight = recipeItem.weight;
            };
        };
        export class PropertyObject {
            private static async editRecipe(recipe: TableObject, setDisplay: (display: JSX.Element | null) => void, 
                deleteOnCancel? : boolean) {
                const EditRecipeComponent = ({recipe, ingredients, products, setDisplay, categories, roles} : {
                        recipe: DatabaseObject,
                        ingredients: any[],
                        products: any[],
                        setDisplay: (display: JSX.Element | null) => void
                        categories: string[],
                        roles: string[]
                    })  => {
                    const [title, setTitle] = useState(recipe.title);
                    const [category, setCategory] = useState(recipe.category);
                    const [role, setRole] = useState(recipe.role);
                    const [price, setPrice] = useState(recipe.price.toFixed(2));
                    const [weight, setWeight] = useState(recipe.weight);
                    const [ingredientList, setIngredientList] = useState(ingredients);
                
                    const updateIngredient = (index: number, field: string, value: any) => {
                        const updated = [...ingredientList];
                        updated[index][field] = value;
                        setIngredientList(updated);
                    };
                
                    const handleSave = async () => {
                        await window.electron.database(
                            `UPDATE recipe SET title = ?, category = ?, role = ?, price = ?, weight = ? WHERE id = ?`,
                            [title, category, role, parseFloat(price), parseInt(weight.toString()), recipe.id]
                        );
                
                        await window.electron.database(`DELETE FROM ingredient WHERE recipe_id = ?`, [recipe.id]);
                
                        for (const ing of ingredientList) {
                            await window.electron.database(
                                `INSERT INTO ingredient (recipe_id, product_id, amount, processing_type)
                                 VALUES (?, ?, ?, ?)`,
                                [recipe.id, ing.product_id, ing.amount, ing.processing_type]
                            );
                        };
                        setDisplay(null);
                    };
                    const handleDelete = async () => {
                        const confirmed = confirm(`Ви дійсно хочете видалити рецепт "${title}"?`);
                        if (!confirmed) return;
                    
                        await window.electron.database(`DELETE FROM ingredient WHERE recipe_id = ?`, [recipe.id]);
                        await window.electron.database(`DELETE FROM recipe WHERE id = ?`, [recipe.id]);
                    
                        setDisplay(null);
                    };

                    const addIngredient = () => {
                        const firstProduct = products[0];
                        setIngredientList([...ingredientList, {
                            id: -1, product_id: firstProduct.id, name: firstProduct.name,
                            amount: 1, processing_type: '', measurement: firstProduct.measurement
                        }]);
                    };
                
                    const removeIngredient = (index: number) => {
                        const updated = [...ingredientList];
                        updated.splice(index, 1);
                        setIngredientList(updated);
                    };
                
                    return (
                        <div className='dark-div'>
                            <div id='properties' className='pop-up'>
                                <h1>Рецепт "{title}"</h1>
                                <table>
                                    <tbody>
                                        <tr><td>Назва</td><td><input value={title} onChange={e => setTitle(e.target.value)} /></td></tr>
                                        <tr>
                                            <td>Категорія</td>
                                            <td>
                                                <input list="category-list" value={category} onChange={e => setCategory(e.target.value)}/>
                                                <datalist id="category-list">
                                                    {categories.map((c, idx) => (
                                                        <option key={idx} value={c} />
                                                    ))}
                                                </datalist>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Роль</td>
                                            <td>
                                                <input list="role-list" value={role} onChange={e => setRole(e.target.value)}/>
                                                <datalist id="role-list">
                                                    {roles.map((r, idx) => (
                                                        <option key={idx} value={r} />
                                                    ))}
                                                </datalist>
                                            </td>
                                        </tr>
                                        <tr><td>Ціна</td><td><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} /></td></tr>
                                        <tr><td>Вага</td><td><input type="number" value={weight} onChange={e => setWeight(parseInt(e.target.value))} /></td></tr>
                                    </tbody>
                                </table>
                    
                                <h2>Інгредієнти</h2>
                                <table className='info-table'>
                                    <tr><td>Продукт</td><td>Кількість</td><td>Тип обробки</td><td></td></tr>
                                    {ingredientList.map((ing, index) => (
                                        <tr key={index}>
                                            <td>
                                                <select
                                                    value={ing.product_id}
                                                    onChange={e => {
                                                        const newProduct = products.find(p => p.id === parseInt(e.target.value))!;
                                                        updateIngredient(index, 'product_id', newProduct.id);
                                                        updateIngredient(index, 'name', newProduct.name);
                                                        updateIngredient(index, 'measurement', newProduct.measurement);
                                                    }}
                                                >
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input type="number" value={ing.amount}
                                                    onChange={e => updateIngredient(index, 'amount', parseInt(e.target.value))}
                                                />
                                                {` ${ing.measurement}`}
                                            </td>
                                            <td>
                                                <input
                                                    value={ing.processing_type}
                                                    onChange={e => updateIngredient(index, 'processing_type', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={() => removeIngredient(index)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                                <div className='functional-buttons'>
                                    <button onClick={addIngredient}>➕ Додати інгредієнт</button>
                                    <button onClick={handleSave}><p>Зберегти</p></button>
                                    <button onClick={handleDelete} style={{ color: 'red' }}><p>Видалити рецепт</p></button>
                                    <button onClick={() => deleteOnCancel? handleDelete() : setDisplay(null)}><p>Скасувати</p></button>
                                </div>
                            </div>
                        </div>
                    );
                };
                
                const [recipeData] = await window.electron.database(
                    `SELECT * FROM recipe WHERE id = ?`, [recipe.id]
                ) as Recipe.DatabaseObject[];
            
                const ingredients = await window.electron.database(
                    `SELECT i.id, i.product_id, p.name, i.amount, i.processing_type, p.measurement FROM ingredient i
                     JOIN product p ON p.id = i.product_id
                     WHERE i.recipe_id = ?`, [recipe.id]
                ) as any[];

                const recipeCategories = await window.electron.database(
                    `SELECT DISTINCT category FROM recipe`
                ) as { category: string }[];
                
                const workerRoles = await window.electron.database(
                    `SELECT DISTINCT role FROM recipe`
                ) as { role: string }[];
                
                const products = await window.electron.database(`SELECT id, name, measurement FROM product`) as any[];
            
                return (
                    <EditRecipeComponent
                        recipe={recipeData}
                        ingredients={ingredients}
                        products={products}
                        setDisplay={setDisplay}
                        categories={recipeCategories.map(recipe => recipe.category)}
                        roles={workerRoles.map(worker => worker.role)}
                    />
                );
            };

            public static async onClick(userRole: string, setDisplay: (display: JSX.Element | null) => void, recipe: TableObject) {
                const props = await window.electron.database(
                    `SELECT p.name, i.processing_type, i.amount || ' ' || p.measurement AS amount FROM "recipe" r 
                        JOIN "ingredient" i ON r.id = i.recipe_id
                        JOIN product p ON p.id = i.product_id
                        WHERE r.id = ?`, [recipe.id]) as {name: string, processing_type: string, amount: string}[];
                
                return (
                    <div className='dark-div'>
                        <div id='properties' className='pop-up'>
                            <h1>Рецепт "{recipe.title}"</h1>
                            <table className='info-table'>
                                <tr>
                                    <td>Назва</td>
                                    <td>Тип обробки</td>
                                    <td>Кількість</td>
                                </tr>
                                {props.map(columnName => (
                                    (<tr>
                                        <td>{columnName.name}</td>
                                        <td>{columnName.processing_type}</td>
                                        <td>{columnName.amount}</td>
                                    </tr>)
                                ))}
                            </table>
                            <div className='functional-buttons'>
                                {userRole == 'executive chef'
                                    ? (<button onClick={async () => {setDisplay(await this.editRecipe(recipe, setDisplay))}}>
                                            <p>Редагувати</p>
                                        </button>)
                                    : null
                                }
                                <button onClick={() => setDisplay(null)}><p>Закрити</p></button>
                            </div>
                        </div>
                    </div>
                );      
            };
            
            public static async findRecipe(userRole: string, setDisplay: (display: JSX.Element | null) => void) {
                const FindRecipeForm = () => {
                    const [searchTerm, setSearchTerm] = useState('');
                    const [searchBy, setSearchBy] = useState('name');
                    const [searchResults, setSearchResults] = useState<any[]>([]);
                    const [suggestions, setSuggestions] = useState<string[]>([]);

                    useEffect(() => {
                        const fetchSuggestions = async () => {
                            let query = '';
                            switch (searchBy) {
                                case 'name':
                                    query = 'SELECT DISTINCT title AS value FROM recipe';
                                    break;
                                case 'category':
                                    query = 'SELECT DISTINCT category AS value FROM recipe';
                                    break;
                                case 'ingredient':
                                    query = 'SELECT DISTINCT name AS value FROM product';
                                    break;
                            }
                            const result = await window.electron.database(query, []) as { value: string }[];
                            setSuggestions(result.map(row => row.value));
                        };
                
                        fetchSuggestions();
                    }, [searchBy]);

                    const handleSearch = async () => {
                        let query = '';
                        let params: any[] = [];
            
                        switch (searchBy) {
                            case 'name': 
                                query = `SELECT r.id, r.title, r.category, r.price, r.weight
                                            FROM recipe r WHERE r.title LIKE ?`;
                                params = [`%${searchTerm}%`];
                                break;
                            case 'category':
                                query = `SELECT r.id, r.title, r.category, r.price, r.weight
                                    FROM recipe r WHERE r.category LIKE ?`;
                               params = [`%${searchTerm}%`];
                               break;
                            case 'ingredient':
                                query = `SELECT DISTINCT r.id, r.title, r.category, r.price, r.weight
                                    FROM recipe r
                                    JOIN ingredient i ON r.id = i.recipe_id
                                    JOIN product p ON i.product_id = p.id
                                    WHERE p.name LIKE ?`;
                                params = [`%${searchTerm}%`];
                                break;
                        }
                        const recipes = await window.electron.database(query, params) as any[];
            
                        setSearchResults(recipes);
                    };
            
                    return (
                        <div className='dark-div'>
                            <div id="properties" className="pop-up">
                                <h1>Пошук рецепту</h1>
                
                                <label>Шукати за:
                                    <select value={searchBy} onChange={e => setSearchBy(e.target.value as any)}>
                                        <option value="name">Назва страви</option>
                                        <option value="category">Категорія</option>
                                        <option value="ingredient">Інгредієнт</option>
                                    </select>
                                </label>
                
                                <br />
                                <label>Пошуковий запит:
                                    <input
                                        list="search-suggestions"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <datalist id="search-suggestions">
                                        {suggestions.map((val, idx) => (
                                            <option key={idx} value={val} />
                                        ))}
                                    </datalist>
                                </label>
                
                                <br />
                                <button onClick={handleSearch}><p>Шукати</p></button>
                                <br />
                
                                {searchResults.length > 0 && (
                                    <div>
                                        <h2>Результати пошуку</h2>
                                        <table className='info-table'>
                                            <tr>
                                                <th>Назва</th>
                                                <th>Категорія</th>
                                                <th>Ціна</th>
                                                <th>Вага</th>
                                            </tr>
                                            {searchResults.map((recipe: any) => (
                                                <tr key={recipe.id}
                                                    onClick={async () =>
                                                        setDisplay(await this.onClick(userRole, setDisplay, recipe))
                                                    }
                                                >
                                                    <td>{recipe.title}</td>
                                                    <td>{recipe.category}</td>
                                                    <td>{recipe.price}</td>
                                                    <td>{recipe.weight}</td>
                                                </tr>
                                            ))}
                                        </table>
                                    </div>
                                )}
                                <br />
                                <button onClick={() => setDisplay(null)}><p>Закрити</p></button>
                            </div>
                        </div>
                    );
                };
                setDisplay(<FindRecipeForm />);
            };

            public static async addRecipe(setDisplay: (display: JSX.Element | null) => void) {
                const {lastInsertRowid} = await window.electron.database(`INSERT INTO "recipe" (title, category, role, price, weight)
                    VALUES ('Новий рецепт', '', '', 0.00, 0)`) as Object as {lastInsertRowid: number};
                setDisplay(await Recipe.PropertyObject.editRecipe(
                    new TableObject({id: lastInsertRowid, title: 'Новий рецепт', role: 'Не вказана', weight: 0}), setDisplay, true)
                );
            };
        };
    };

    export namespace Menu {
        export const translated: string = 'Меню';

        export class TableObject {
            public static getQuery = (_?: string) => (
                `SELECT r.id, r.title, r.category, r.price, r.weight FROM "recipe" r`
            );
            public static columns = [
                {translatedName: 'Назва страви', name: 'title'},
                {translatedName: 'Категорія', name: 'category'},
                {translatedName: 'Ціна за порцію', name: 'price'},
                {translatedName: 'Вага (грамм)', name: 'weight'},
            ];

            public id: number;
            public title: string;
            public category: string;
            public price: number;
            public weight: number;

            constructor(menuItem: {id: number, title: string, category: string, price: number, weight: number}) {
                this.id = menuItem.id;
                this.title = menuItem.title;
                this.category = menuItem.category;
                this.price = menuItem.price;
                this.weight = menuItem.weight;
            };
        };
        export class PropertyObject {

            public static async onClick(userRole: string, setDisplay: (display: JSX.Element | null) => void, recipe: Recipe.TableObject) {
                return await Recipe.PropertyObject.onClick(userRole, setDisplay, recipe)
            };

            public static async onContextMenu(userRole: string, setDisplay: (display: JSX.Element | null) => void,
                menu: TableObject) {
                if (userRole !== 'waiter') return null;

                const QuantityPrompt = () => {
                    const [quantity, setQuantity] = useState(1);
                    const [isSubmitted, setIsSubmitted] = useState(false);
            
                    const handleSubmit = async () => {
                        if (quantity < 1 || isNaN(quantity)) {
                            alert('Кількість має бути більша за 0');
                            return;
                        };
            
                        setIsSubmitted(true);
                        await window.electron.database(
                            `INSERT INTO "order" (recipe_id, quantity) VALUES (?, ?)`,
                            [menu.id, quantity]
                        );
                    };
            
                    if (isSubmitted) return null;

                    return (
                        <div className='dark-div'>
                            <div id="properties" className="pop-up">
                                <h2>Нове замовлення</h2>
                                <p>Страва: <strong>{menu.title}</strong></p>
                                <label>
                                    Кількість:
                                    <input
                                        type="number"
                                        value={quantity}
                                        min={1}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    />
                                </label>
                                <div className='functional-buttons'>
                                    <button onClick={handleSubmit}><p>Підтвердити</p></button>
                                    <button onClick={() => setDisplay(null)}><p>Скасувати</p></button>
                                </div>
                            </div>
                        </div>
                    );
                };
                return <QuantityPrompt />;
            };
        };
    };

    export namespace Warehouse {
        export const translated: string = 'Склад';
    
        export class DatabaseObject {
            public id: number;
            public name: string;
            public amount: number;
            public measurement: string;
    
            constructor(productItem: {id: number, name: string, amount: number, measurement: string}) {
                this.id = productItem.id;
                this.name = productItem.name;
                this.amount = productItem.amount;
                this.measurement = productItem.measurement;
            };
        };
    
        export class TableObject {
            public static getQuery = (_?: string) => (
                `SELECT id, name, amount || ' ' || measurement AS amount, measurement FROM product ORDER BY name ASC`
            );
    
            public static columns = [
                { translatedName: 'Назва продукту', name: 'name' },
                { translatedName: 'Кількість', name: 'amount' }
            ];
    
            public id: number;
            public name: string;
            public amount: string;
            public measurement: string;
    
            constructor(productItem: {id: number, name: string, amount: string, measurement: string}) {
                this.id = productItem.id;
                this.name = productItem.name;
                this.amount = productItem.amount;
                this.measurement = productItem.measurement;
            };
        };

        export class PropertyObject {
            public static async AddProduct(setDisplay: (display: JSX.Element | null) => void) {
                const products = await window.electron.database(
                    `SELECT id, name, measurement FROM product ORDER BY name ASC`
                ) as { id: number; name: string; measurement: string }[];
            
                const AddProductForm = () => {
                    const [selectedId, setSelectedId] = useState<number>(products[0]?.id || 0);
                    const [amount, setAmount] = useState<number>(1);
                    const [isSubmitted, setIsSubmitted] = useState(false);
            
                    const handleSubmit = async () => {
                        if (amount <= 0 || isNaN(amount)) {
                            alert("Введіть коректну кількість (> 0)");
                            return;
                        };
            
                        await window.electron.database(
                            `INSERT INTO warehouse_log (product_id, action_type, amount) VALUES (?, 1, ?)`,
                            [selectedId, amount]
                        );
            
                        setIsSubmitted(true);
                    };
            
                    if (isSubmitted) {
                        setDisplay(null);
                        return;
                    };
            
                    return (
                        <div className='dark-div'>
                            <div id="properties" className="pop-up">
                                <h2>Додати продукт на склад</h2>
                                <label>
                                    Продукт:
                                    <select onChange={e => setSelectedId(parseInt(e.target.value))} value={selectedId}>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.measurement})
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <br />
                                <label>
                                    Кількість:
                                    <input
                                        type="number"
                                        min={1}
                                        value={amount}
                                        onChange={e => setAmount(parseInt(e.target.value))}
                                    />
                                </label>
                                <br />
                                <div className='functional-buttons'>
                                    <button onClick={handleSubmit}><p>Додати</p></button>
                                    <button onClick={() => setDisplay(null)}><p>Скасувати</p></button>
                                </div>
                            </div>
                        </div>
                    );
                };
            
                setDisplay(<AddProductForm />);
            };

            public static async onClick(_: string, setDisplay: (display: JSX.Element | null) => void, product: TableObject) {
                const logs = await window.electron.database(
                    `SELECT wl.id, wl.action_type, wl.amount, STRFTIME('%m-%d %H:%M', wl.log_at) AS log_at 
                    FROM "warehouse_log" wl 
                    WHERE wl.product_id = ?
                    ORDER BY wl.log_at DESC`,
                    [product.id]
                ) as { action_type: number; amount: number; log_at: string }[];

                const totalAdded = logs.filter(log => log.action_type === 1).reduce((sum, log) => sum + log.amount, 0);
                const totalUsed = logs.filter(log => log.action_type === -1).reduce((sum, log) => sum + log.amount, 0);

                const LogTable = () => (
                    <div className='dark-div'>
                        <div id="properties" className="pop-up">
                            <h2>Журнал дій для: {product.name}</h2>
                            <p><strong>Всього додано:</strong> {totalAdded} {product.measurement}</p>
                            <p><strong>Всього використано:</strong> {totalUsed} {product.measurement}</p>
                            <table className='info-table'>
                                <tr>
                                    <th>Дія</th>
                                    <th>Кількість</th>
                                    <th>Час</th>
                                </tr>
                                {logs.map((log, index) => (
                                    <tr key={index}>
                                        <td>{log.action_type === 1 ? 'Додано' : 'Використано'}</td>
                                        <td>{`${log.amount} ${product.measurement}`}</td>
                                        <td>{log.log_at}</td>
                                    </tr>
                                ))}
                            </table>
                            <button onClick={() => setDisplay(null)}><p>Закрити</p></button>
                        </div>
                    </div>
                );
                return <LogTable />;
            };

            public static async findProduct(setDisplay: (display: JSX.Element | null) => void) {
                const allProducts = await window.electron.database(Warehouse.TableObject.getQuery()) as TableObject[];
            
                const FindProductForm = () => {
                    const [searchTerm, setSearchTerm] = useState('');
                    const [results, setResults] = useState<typeof allProducts>([]);
            
                    const handleSearch = () => {
                        const filtered = allProducts.filter(p => 
                            p.name.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        setResults(filtered);
                    };
            
                    return (
                        <div className="dark-div">
                            <div id="properties" className="pop-up">
                                <h2>Пошук продукту на складі</h2>
            
                                <label>
                                    Назва продукту:
                                    <input
                                        list="product-suggestions"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <datalist id="product-suggestions">
                                        {allProducts.map((p, idx) => (
                                            <option key={idx} value={p.name} />
                                        ))}
                                    </datalist>
                                </label>
                                <br />
                                <button onClick={handleSearch}><p>Шукати</p></button>
                                <br />
            
                                {results.length > 0 && (
                                    <div>
                                        <h3>Результати:</h3>
                                        <table className='info-table'>
                                            <tr>
                                                <th>Назва</th>
                                                <th>Кількість</th>
                                            </tr>
                                            {results.map((p) => (
                                                <tr key={p.id} onClick={async () => setDisplay(await this.onClick('', setDisplay, p))}>
                                                    <td>{p.name}</td>
                                                    <td>{p.amount}</td>
                                                </tr>
                                            ))}
                                        </table>
                                    </div>
                                )}
                                <br />
                                <button onClick={() => setDisplay(null)}><p>Закрити</p></button>
                            </div>
                        </div>
                    );
                };
                setDisplay(<FindProductForm />);
            };
        };
    };

    export namespace Worker {
        export const translated: string = 'Користувачи';

        export class DatabaseObject {
            public id: number;
            public fullname: string;
            public role: string;

            constructor(userItem : {id: number, fullname: string, role: string}) {
                this.id = userItem.id;
                this.fullname = userItem.fullname;
                this.role = userItem.role;
            };
        };
        export class TableObject {
            public static getQuery = (_? : string) => (
                `SELECT w.id, w.fullname, w.role FROM "worker" w`
            );
            public static columns = [
                {translatedName: 'Фамілія Ім\'я', name: 'fullname'},
                {translatedName: 'Роль', name: 'role'}
            ];

            public id: number;
            public fullname: string;
            public role: string;

            constructor(workerItem: {id: number, fullname: string, role: string}) {
                this.id = workerItem.id;
                this.fullname = workerItem.fullname;
                this.role = workerItem.role;
            };
        };
        export class PropertyObject {
            public static async onClick(_: string, setDisplay: (display: JSX.Element | null) => void, worker: TableObject) {
                const recipes = await window.electron.database(`${Menu.TableObject.getQuery()} 
                    ${worker.role.toLowerCase() !== 'executive chef'? ('WHERE r.role = \'' + worker.role.toLowerCase() + '\'') : ''}`
                ) as Menu.TableObject[];

                return (
                    <div className='dark-div'>
                        <div id='properties' className='pop-up'>
                            <h1>Рецепти доступні для "{worker.fullname}"</h1>
                            <table className='info-table'>
                                <tr>
                                    <th>Назва страви</th>
                                    <th>Категорія</th>
                                </tr>
                                {recipes.map(recipe => (
                                    <tr key={recipe.id} onClick={async () => setDisplay(
                                            await Menu.PropertyObject.onClick('executive chef', setDisplay, 
                                                new Recipe.TableObject({
                                                    id: recipe.id,
                                                    title: recipe.title, 
                                                    weight: recipe.weight, 
                                                    role: worker.role.toLowerCase()
                                                })
                                            )
                                        )}
                                    >
                                        <td>{recipe.title}</td>
                                        <td>{recipe.category}</td>
                                    </tr>
                                ))}
                            </table>
                            <button onClick={() => setDisplay(null)}><p>Закрити</p></button>
                        </div>
                    </div>
                );
            };
        };
    };
};

class TablesAccess {
    private _order: boolean | undefined;
    private _recipe: boolean | undefined;
    private _menu: boolean | undefined;
    private _warehouse: boolean | undefined;
    private _worker: boolean | undefined;

    public get order() {return this._order;}; 
    public get recipe() {return this._recipe;};
    public get menu() {return this._menu;};
    public get warehouse() {return this._warehouse;};
    public get worker() {return this._worker;};

    constructor(order?: boolean, recipe?: boolean, menu?: boolean, warehouse?: boolean, user?: boolean)
    {
        this._order = order;
        this._recipe = recipe;
        this._menu = menu;
        this._warehouse = warehouse;
        this._worker = user;
    };

    public getAllTableWithAccess() {
        return Object.keys(Tables).map((name) => {
            if (Boolean(this[name.toLowerCase()])) 
                return { 
                    tableName: name,
                    tableTranslatedName: Tables[name].translated as string,
                    access: Boolean(this[name] || false)
                };
            else return undefined;
        });
    };
};

const roles = {
    'executive chef': new TablesAccess(true, true, true, true, true),
    'cook chef': new TablesAccess(true, true),
    'sous chef': new TablesAccess(true, true),
    'salad chef': new TablesAccess(true, true),
    'waiter' : new TablesAccess(true, false, true)
};

const user = (userRole: 'executive chef' | 'cook chef' | 'sous chef' | 'salad chef' | 'waiter'): TablesAccess | undefined => roles[userRole];

export {user, Tables};