CREATE TRIGGER log_expenses_after_order_delete AFTER DELETE ON "order"
FOR EACH ROW 
BEGIN
	INSERT INTO "warehouse_log" (product_id, action_type, amount) 
	SELECT i.product_id, -1, i.amount FROM "ingredient" i 
	WHERE i.recipe_id = OLD.recipe_id;
END;

CREATE TRIGGER change_product_amount_after_warehouse_log_insert AFTER INSERT ON "warehouse_log"
FOR EACH ROW
BEGIN
	UPDATE product
	    SET amount = amount + (NEW.amount * NEW.action_type)
    WHERE id = NEW.product_id;
END;
