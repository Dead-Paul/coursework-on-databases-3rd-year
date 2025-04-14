-- Get "order" as table
SELECT o.id, r.title, o.quantity, r.role, STRFTIME('%m-%d %H:%M', o.created_at) AS created_at FROM "order" o 
	JOIN "recipe" r ON r.id = o.recipe_id
;

-- Get "recipe" as table
SELECT r.id, r.title, r.role, r.weight  FROM "recipe" r 
ORDER BY r.id DESC LIMIT 1
;
SELECT r.id, r.title, r.role, r.weight  FROM "recipe" r
                 ORDER BY r.id DESC LIMIT 1;
-- Get "menu" as table
SELECT r.id, r.title, r.category, r.price, r.weight FROM "recipe" r
;

-- Get "warehouse" as table
SELECT wl.id, p.name, wl.action_type, wl.amount || ' ' || p.measurement AS amount, 
		STRFTIME('%m-%d %H:%M', wl.log_at) AS log_at 
	FROM "warehouse_log" wl 
	JOIN "product" p ON p.id = wl.product_id 
	ORDER BY wl.log_at DESC
;

-- Get "worker" as table
SELECT w.id, w.fullname, w.role FROM "worker" w
;

-- Get products from order where id = ?
SELECT p.name, i.processing_type, i.amount || ' ' || p.measurement AS amount FROM "order" o 
	JOIN "ingredient" i ON o.recipe_id = i.recipe_id
	JOIN product p ON p.id = i.product_id
	WHERE o.id = 4
;

SELECT * FROM "order" o;

INSERT INTO "warehouse_log" (product_id, action_type, amount) 
	SELECT i.product_id, -1 as action_type, i.amount FROM "ingredient" i WHERE i.recipe_id = 2
;

SELECT * FROM "warehouse_log" wl;

SELECT p.name, i.processing_type, i.amount || ' ' || p.measurement AS amount FROM "recipe" r 
                        JOIN "ingredient" i ON r.id = i.recipe_id
                        JOIN product p ON p.id = i.product_id
                        WHERE r.id = 1;

SELECT o.id, r.title, o.quantity, r.role, STRFTIME('%m-%d %H:%M', o.created_at) AS created_at FROM "order" o 
                    JOIN "recipe" r ON r.id = o.recipe_id WHERE r.role = "cook chef" ORDER BY created_at ASC
                    