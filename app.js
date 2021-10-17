var express = require("express");
var exphbs = require("express-handlebars");
var port = process.env.PORT || 3000;

var app = express();

const bodyParser = require("body-parser");

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// SDK de Mercado Pago
const mercadopago = require("mercadopago");

// Credenciales
mercadopago.configure({
  access_token:
    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
});

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  // Crea un objeto de preferencia

  let preference = {
    items: [
      {
        title: req.query.title,
        unit_price: Number(req.query.price),
        quantity: parseInt(req.query.unit),
      },
    ],
    payment_methods: {
      excluded_payment_methods: [
        {
          id: "amex",
        },
      ],
      excluded_payment_types: [
        {
          id: "atm",
        },
      ],
      installments: 6,
    },
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      req.query.checkoutId = response.body.id;
      res.render("detail", req.query);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(port);
