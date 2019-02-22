DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products (
    id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price INTEGER(10),
    stock_quantity INTEGER(10),
    PRIMARY KEY (id)
);