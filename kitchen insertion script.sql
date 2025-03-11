INSERT INTO "worker" (id, fullname, role) VALUES
(1, 'John Doe', 'Chef'),
(2, 'Jane Smith', 'Sous Chef'),
(3, 'Michael Brown', 'Waiter'),
(4, 'Emily White', 'Dishwasher');

INSERT INTO "recipe" (id, title, category, role, price, weight) VALUES
(1, 'Spaghetti Bolognese', 'Pasta', 'Chef', 12.99, 500),
(2, 'Caesar Salad', 'Salad', 'Sous Chef', 8.99, 300),
(3, 'Grilled Chicken', 'Main Course', 'Chef', 15.99, 450),
(4, 'Margarita Pizza', 'Pizza', 'Sous Chef', 10.99, 400);

INSERT INTO "product" (id, amount, measurement) VALUES
(1, 50, 'grams'),
(2, 100, 'grams'),
(3, 200, 'grams'),
(4, 150, 'grams'),
(5, 500, 'grams'),
(6, 1000, 'grams'),
(7, 20, 'pieces'),
(8, 10, 'pieces');

INSERT INTO "order" (id, recipe_id, quantity, created_at) VALUES
(1, 1, 2, '2025-03-11 12:30:00'),
(2, 2, 3, '2025-03-11 12:45:00'),
(3, 3, 1, '2025-03-11 13:00:00'),
(4, 4, 2, '2025-03-11 13:15:00');

INSERT INTO "ingredient" (id, recipe_id, product_id, amount, processing_type) VALUES
(1, 1, 1, 100, 'Chopped'),
(2, 1, 2, 200, 'Cooked'),
(3, 1, 3, 50, 'Fresh'),
(4, 2, 4, 100, 'Chopped'),
(5, 2, 5, 150, 'Grated'),
(6, 3, 6, 200, 'Grilled'),
(7, 4, 7, 1, 'Baked'),
(8, 4, 8, 1, 'Grilled');

INSERT INTO "warehouse_log" (id, product_id, action_type, amount, log_at) VALUES
(1, 1, 1, 100, '2025-03-11 10:00:00'),
(2, 2, 1, 200, '2025-03-11 10:30:00'),
(3, 3, 2, 50, '2025-03-11 11:00:00'),
(4, 4, 1, 150, '2025-03-11 11:30:00'),
(5, 5, 2, 200, '2025-03-11 12:00:00'),
(6, 6, 1, 500, '2025-03-11 12:30:00'),
(7, 7, 2, 10, '2025-03-11 13:00:00'),
(8, 8, 2, 5, '2025-03-11 13:30:00');
