var express = require("express");
var exphbs = require("express-handlebars");
var port = process.env.PORT || 3000;

var app = express();

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
const { response } = require("express");

// Credenciales
mercadopago.configure({
  access_token:
    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
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
        id: "1234",
        title: req.query.title,
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url: req.query.img,
        quantity: parseInt(req.query.unit),
        unit_price: Number(req.query.price),
      },
    ],
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_63274575@testuser.com",
      phone: {
        area_code: "11",
        number: 22223333,
      },
      identification: {},
      address: {
        street_name: "Falsa",
        street_number: 123,
        zip_code: "1111",
      },
    },
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
    back_urls: {
      success: req.get("host") + "/success",
      failure: req.get("host") + "/failure",
      pending: req.get("host") + "/pending",
    },
    auto_return: "approved",
    notification_url: "https://enh41r6lixdk.x.pipedream.net",
    external_reference: "juanccassano@gmail.com",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      req.query.checkoutId = response.body.id;
      req.query.init_point = response.body.init_point;
      res.render("detail", req.query);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/failure", function (req, res) {
  res.render("failure");
});

app.get("/success", function (req, res) {
  res.render("success", req.query);
});

app.get("/pending", function (req, res) {
  res.render("pending");
});

app.listen(port);
