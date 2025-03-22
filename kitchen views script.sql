DROP VIEW "order_info";

CREATE VIEW "order_info" AS
	SELECT 
		o.created_at,
		o.quantity,
		r.title,
		r.category,
		r.price,
		r.id AS recipe_id,
		r.role
	FROM "order" o
	JOIN recipe r ON o.recipe_id = r.id;

SELECT * FROM order_info;

DROP VIEW "warehouse_log_info";

CREATE VIEW "warehouse_log_info" AS
	SELECT 
		wl.log_at,
		p.name,
		SUM(wl.amount) AS amount,
		p.measurement,
		wl.action_type,
		p.id AS product_id
	FROM warehouse_log wl 
	JOIN product p ON wl.product_id = p.id
	GROUP BY p.id, wl.action_type;

SELECT * FROM warehouse_log_info;
