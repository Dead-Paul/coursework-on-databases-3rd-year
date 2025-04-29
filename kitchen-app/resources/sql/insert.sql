INSERT INTO worker (fullname, role) VALUES
('Іван Петренко', 'executive chef'),
('Олена Ковальчук', 'cook chef'),
('Андрій Шевченко', 'sous chef'),
('Марія Іванова', 'salad chef'),
('Петро Сидоренко', 'waiter'),
('Ганна Литвиненко', 'cook chef'),
('Максим Дяченко', 'sous chef'),
('Наталія Жукова', 'salad chef'),
('Юрій Бондар', 'waiter'),
('Світлана Романенко', 'executive chef');

INSERT INTO product (name, amount, measurement) VALUES
('Борошно пшеничне', 10000, 'г'),
('Цукор', 5000, 'г'),
('Сіль', 2000, 'г'),
('Олія соняшникова', 3000, 'мл'),
('Молоко', 5000, 'мл'),
('Яйця курячі', 200, 'шт'),
('Картопля', 10000, 'г'),
('Морква', 5000, 'г'),
('Цибуля ріпчаста', 4000, 'г'),
('Капуста білокачанна', 6000, 'г'),
('Куряче філе', 3000, 'г'),
('Свинина', 4000, 'г'),
('Яловичина', 3500, 'г'),
('Помідори', 3000, 'г'),
('Огірки', 2500, 'г'),
('Сметана', 2000, 'г'),
('Сир твердий', 1500, 'г'),
('Макарони', 5000, 'г'),
('Рис', 4000, 'г'),
('Гречка', 3500, 'г'),
('Кукурудза консервована', 1000, 'г'),
('Горошок зелений', 1000, 'г'),
('Часник', 300, 'г'),
('Зелень', 500, 'г'),
('Хліб пшеничний', 2000, 'г'),
('Батон', 1500, 'г'),
('Масло вершкове', 1000, 'г'),
('Кефір', 2000, 'мл'),
('Перець болгарський', 1000, 'г'),
('Яблука', 3000, 'г');

INSERT INTO recipe (title, category, role, price, weight) VALUES
('Борщ український', 'Супи', 'cook chef', 45.50, 350),
('Картопляне пюре з котлетою', 'Основні страви', 'cook chef', 60.00, 400),
('Олів’є', 'Салати', 'salad chef', 40.00, 250),
('Вінегрет', 'Салати', 'salad chef', 35.00, 250),
('Сирники зі сметаною', 'Сніданки', 'sous chef', 50.00, 300),
('Макарони по-флотськи', 'Основні страви', 'cook chef', 55.00, 400),
('Гречка з підливою', 'Основні страви', 'cook chef', 45.00, 350),
('Плов з куркою', 'Основні страви', 'cook chef', 65.00, 400),
('Салат "Весняний"', 'Салати', 'salad chef', 30.00, 200),
('Млинці з м’ясом', 'Сніданки', 'sous chef', 55.00, 300),
('Омлет з сиром', 'Сніданки', 'sous chef', 35.00, 250),
('Крем-суп із гарбуза', 'Супи', 'cook chef', 48.00, 300),
('Шніцель зі свинини', 'Основні страви', 'cook chef', 70.00, 350),
('Тушкована капуста з м’ясом', 'Основні страви', 'cook chef', 58.00, 350),
('Рагу овочеве', 'Основні страви', 'cook chef', 40.00, 300),
('Каша вівсяна з фруктами', 'Сніданки', 'sous chef', 38.00, 300),
('Салат з буряком і чорносливом', 'Салати', 'salad chef', 33.00, 200),
('Котлета по-київськи', 'Основні страви', 'cook chef', 75.00, 350),
('Суп з фрикадельками', 'Супи', 'cook chef', 50.00, 300),
('Холодник', 'Супи', 'cook chef', 45.00, 300);

-- Борщ український
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(1, 7, 300, 'варена'),    -- Картопля
(1, 8, 200, 'тушкована'), -- Морква
(1, 9, 150, 'тушкована'); -- Цибуля

-- Картопляне пюре з котлетою
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(2, 7, 250, 'варена'),
(2, 11, 150, 'смажена');

-- Олів’є
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(3, 7, 150, 'варена'),
(3, 8, 100, 'варена'),
(3, 21, 50, 'без обробки');

-- Вінегрет
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(4, 7, 150, 'варена'),
(4, 8, 100, 'варена'),
(4, 14, 80, 'свіжі');

-- Сирники зі сметаною
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(5, 6, 2, 'сирі'),
(5, 16, 100, 'сирі'),
(5, 2, 30, 'сирий');

-- Макарони по-флотськи
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(6, 18, 200, 'варені'),
(6, 12, 150, 'смажена'),
(6, 9, 50, 'смажена');

-- Гречка з підливою
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(7, 20, 200, 'варена'),
(7, 12, 100, 'тушкована'),
(7, 9, 50, 'смажена');

-- Плов з куркою
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(8, 19, 200, 'варений'),
(8, 11, 150, 'тушкована'),
(8, 8, 50, 'смажена');

-- Салат "Весняний"
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(9, 14, 100, 'свіжі'),
(9, 15, 80, 'свіжі'),
(9, 24, 30, 'свіжа');

-- Млинці з м’ясом
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(10, 1, 100, 'сире тісто'),
(10, 12, 100, 'тушковане м’ясо'),
(10, 5, 100, 'молоко для тіста');

-- Омлет з сиром
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(11, 6, 2, 'сирі'),
(11, 17, 50, 'натертий'),
(11, 5, 50, 'доданий');

-- Крем-суп із гарбуза
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(12, 8, 100, 'тушкований'),
(12, 9, 50, 'смажена'),
(12, 5, 100, 'додане');

-- Шніцель зі свинини
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(13, 12, 200, 'смажений'),
(13, 1, 30, 'панірування'),
(13, 6, 1, 'збите яйце');

-- Тушкована капуста з м’ясом
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(14, 10, 250, 'тушкована'),
(14, 12, 150, 'тушковане м’ясо'),
(14, 9, 50, 'смажена');

-- Рагу овочеве
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(15, 7, 100, 'тушкована'),
(15, 8, 100, 'тушкована'),
(15, 29, 100, 'тушкований');

-- Каша вівсяна з фруктами
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(16, 5, 200, 'молоко'),
(16, 30, 100, 'нарізані'),
(16, 20, 50, 'додано в кінці');

-- Салат з буряком і чорносливом
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(17, 8, 150, 'варена'),
(17, 3, 20, 'дрібно'),
(17, 22, 50, 'нарізаний');

-- Котлета по-київськи
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(18, 11, 200, 'відбите'),
(18, 27, 30, 'додано всередину'),
(18, 1, 30, 'паніровка');

-- Суп з фрикадельками
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(19, 13, 150, 'у вигляді кульок'),
(19, 7, 100, 'варена'),
(19, 9, 50, 'варена');

-- Холодник
INSERT INTO ingredient (recipe_id, product_id, amount, processing_type) VALUES
(20, 30, 150, 'терте'),
(20, 5, 100, 'охолоджене'),
(20, 24, 50, 'зелень свіжу');
