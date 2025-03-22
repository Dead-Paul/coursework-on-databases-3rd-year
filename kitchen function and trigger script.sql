CREATE TRIGGER log_expenses_after_order_delete AFTER DELETE ON "order"
FOR EACH ROW 
BEGIN
	INSERT INTO "warehouse_log" (product_id, action_type, amount) 
	SELECT i.product_id, -1, i.amount FROM "ingredient" i 
	WHERE i.recipe_id = OLD.recipe_id;
END;

DELETE FROM "order" WHERE recipe_id = 3;

SELECT * FROM ingredient i WHERE i.recipe_id = 3;

SELECT * FROM warehouse_log wl;

