INSERT INTO "worker" (fullname, role) 
VALUES 
    ('John Doe', 'Sause Chef'),
    ('Jane Smith', 'Cook'),
    ('Mark Johnson', 'Master Chef'),
    ('Emily Davis', 'Waiter'),
    ('Chris Williams', 'Chef');

INSERT INTO "recipe" (title, category, role, price, weight) 
VALUES 
    ('Spaghetti Carbonara', 'Pasta', 'Cook', 12.99, 400),
    ('Caesar Salad', 'Salad', 'Cook', 8.99, 200),
    ('Margherita Pizza', 'Pizza', 'Cook', 15.49, 600),
    ('Chicken Curry', 'Curry', 'Cook', 18.99, 500),
    ('Grilled Salmon', 'Seafood', 'Chef', 22.99, 350);

INSERT INTO "product" (name, amount, measurement) 
VALUES 
    ('Tomato', 50, 'kg'),
    ('Chicken Breast', 100, 'kg'),
    ('Cheese', 30, 'kg'),
    ('Olive Oil', 10, 'liters'),
    ('Lettuce', 60, 'kg');

INSERT INTO "order" (recipe_id, quantity) 
VALUES 
    (1, 3),
    (2, 2),
    (3, 4),
    (4, 1),
    (5, 2);

INSERT INTO "ingredient" (recipe_id, product_id, amount, processing_type) 
VALUES 
    (1, 1, 2, 'Chopped'),
    (1, 3, 0.5, 'Grated'),
    (2, 1, 1, 'Sliced'),
    (3, 2, 1, 'Diced'),
    (4, 4, 0.25, 'Blended');

INSERT INTO "warehouse_log" (product_id, action_type, amount) 
VALUES 
    (1, 1, 20),
    (2, -1, 10),
    (3, 1, 15),
    (4, -1, 5),
    (5, 1, 30);

