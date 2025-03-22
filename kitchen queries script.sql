-- Get all recipes from the chef
SELECT * FROM "recipe" r  WHERE r."role" = "Chef";

-- Get all recipes from the Cook
SELECT * FROM "recipe" r  WHERE r."role" = "Cook";

-- Get all ingridients of the "Caesar Salad"
SELECT r.title AS recipe_name,
	p.name AS ingredient, 
    i.amount, 
    p.measurement, 
    i.processing_type
FROM ingredient i
JOIN product p ON i.product_id = p.id
JOIN recipe r ON i.recipe_id = r.id
WHERE r.title = "Caesar Salad";

-- Get all orders
SELECT 
	o.created_at,
	o.quantity,
	r.title,
	r.category,
	r.price
FROM "order" o
JOIN recipe r ON o.recipe_id = r.id;

-- Get all expenses from warehouse
SELECT 
	wl.log_at,
	p.name,
	wl.amount,
	p.measurement
FROM warehouse_log wl 
JOIN product p ON wl.product_id = p.id
WHERE wl.action_type = -1;

-- Get all adittion from warehouse
SELECT 
	wl.log_at,
	p.name,
	wl.amount,
	p.measurement
FROM warehouse_log wl 
JOIN product p ON wl.product_id = p.id
WHERE wl.action_type = 1;