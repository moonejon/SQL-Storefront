var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "computer#4",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) console.log(err);
});

function startStore() {
    connection.query("SELECT * FROM products", function(err, res) {
        inquirer
            .prompt([
                {
                    name: "confirmStart",
                    type: "confirm",
                    message: "Would you like to begin?"
                }
            ])
            .then(function(response) {
                if (response.confirmStart == false) {
                    console.log("Okay... bye!!");
                    setTimeout((function () {
                        return process.kill(process.pid);
                    }), 5000);
                } else {
                    inquirer
                        .prompt([
                            {
                                name: "productsForSale",
                                type: "rawlist",
                                choices: function() {
                                    var products = [];
                                    for (var i = 0; i < res.length; i++) {
                                        products.push(
                                            "ID: " +
                                                res[i].id +
                                                " | " +
                                                "Name: " +
                                                res[i].product_name +
                                                " | " +
                                                "Price: $" +
                                                res[i].price +
                                                " | " +
                                                "Category: " +
                                                res[i].department_name
                                        );
                                    }
                                    return products;
                                },

                                message: "Pick a product to purchase"
                            },
                            {
                                name: "requestedStock",
                                type: "input",
                                message:
                                    "How many units would you like to purchase?",
                                validate: function(value) {
                                    if (isNaN(value) === false) {
                                        return true;
                                    }
                                    return false;
                                }
                            }
                        ])
                        .then(function(response) {
                            var selectedId = response.productsForSale
                                .match(/\d+/g)
                                .map(Number);

                            connection.query(
                                "SELECT stock_quantity FROM products WHERE ?",
                                { id: selectedId[0] },
                                function(err, availableStock) {
                                    if (err) console.log(err);

                                    if (
                                        response.requestedStock < availableStock[0].stock_quantity
                                    ) {
                                        connection.query(
                                            "UPDATE products SET ? WHERE ?",
                                            [
                                                {
                                                    stock_quantity: availableStock[0].stock_quantity - response.requestedStock
                                                },
                                                {
                                                    id: selectedId[0]
                                                }
                                            ]
                                        );
                                        connection.query(
                                            "SELECT price FROM products WHERE ?",
                                            { id: selectedId[0] },
                                            function(err, price) {
                                                if (err) console.log(err);
                                                totalPrice =
                                                    price[0].price * response.requestedStock;
                                                console.log(
                                                    "Your total purchase price is $" + totalPrice
                                                );
                                            }
                                        );
                                    } else {
                                        console.log("We do not have enough stock to fulfill your request.");
                                    }
                                }
                            );
                        });
                }
            });
    });
}

startStore();
