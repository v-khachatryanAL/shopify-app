// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products.json", async (req, res) => {
  let title = (req.query.title)?.toString().toLowerCase()
  let data = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
    query: req.query.title
  });

  if (title && typeof title === 'string' && title !== undefined) {
    data = data.filter(item => item.title?.toLowerCase().includes(title))
    res.status(200).send(data);
  } else {
    res.status(200).send(data);
  }
});

app.get("/api/products/:id.json", async (req, res) => {
  const getData = await shopify.api.rest.Product.find({
    session: res.locals.shopify.session,
    id: req.params.id
  });
  res.status(200).send(getData);
});

app.get("/api/users.json", async (req, res) => {
  const getData = await shopify.api.rest.User.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(getData);
})

app.post("/api/products/create.json", async (req, res) => {
  const { products } = req.body;
  try {
    for (let i = 0; i < products.length; i++) {
      const product = new shopify.api.rest.Product({ session: res.locals.shopify.session });
      const { id, ...frontProduct } = products[i];
      if (typeof id === "number") {
        product.id = id;
      }
      for (const key in frontProduct) {
        product[key] = frontProduct[key]
      }
      await product.save({
        update: true,
      });
    }
    res.status(200).send("success");
  } catch (err) {
    console.log(`Failed to process product/create: ${err.message}`);
    res.status(500).send({ err: err.message });
  }
});

app.put("/api/products/:id.json", async (req, res) => {
  try {
    const product = new shopify.api.rest.Product({ session: res.locals.shopify.session });
    product.title = req.body.product.title;
    product.price = req.body.product.price;
    product.quantity = req.body.product.quantity;
    product.discount = req.body.product.discount;
    product.variants = req.body.product.variants;
    product.options = req.body.product.options;
    product.body_html = req.body.product.body_html;
    product.status = "draft";

    await product.save({
      update: true,
    });
    res.status(200).send([product]);
  } catch (error) {
    res.status(500).send({ err: error.message });
  }
})

app.get("/api/currencies.json", async (req, res) => {
  const currencies = await shopify.api.rest.Currency.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(currencies);
})

app.get("/api/locations.json", async (req, res) => {
  const languages = await shopify.api.rest.Location.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(languages);
})

app.get("/api/orders.json", async (req, res) => {
  console.log(shopify.api.rest, " shopify.api.rest");
  const countData = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: req.query['status'],
    fields: req.query['title'],
    financial_status: req.query['financial_status'],
    created_at_min: req.query['created_at_min'],
    created_at_max: req.query['created_at_max'],
  });
  res.status(200).send(countData);
});

app.delete("/api/orders/:id.json", async (req, res) => {
  const deleteData = await shopify.api.rest.Order.delete({
    session: res.locals.shopify.session,
    id: req.params.id
  });
  res.status(200).send(deleteData);
});

app.get("/api/orders/:id.json", async (req, res) => {
  const getData = await shopify.api.rest.Order.find({
    session: res.locals.shopify.session,
    id: req.params.id
  });
  res.status(200).send(getData);
});

app.post("/api/orders/create.json", async (req, res) => {
  try {
    const order = new shopify.api.rest.Order({ session: res.locals.shopify.session });

    order.line_items = req.body.order.line_items
    console.log({
      order: order.line_items
    });
    // order.customer = req.body.order.customer
    // order.invoiceNumber = req.body.order.number
    // order.currency = req.body.order.currency

    // order.transactions = [{
    //   kind: req.body.order.transactions[0].kind,
    //   status: req.body.order.transactions[0].status,
    //   amount: req.body.order.transactions[0].amount,
    // }]

    // order.test = req.body.order.test
    // order.financial_status = req.body.order.financial_status
    // order.total_discounts = req.body.order.discount
    // order.total_price = req.body.order.totalOrders
    // order.subtotal_price = req.body.order.subTotal
    // await order.save({
    //   update: true,
    // });
    res.status(200).send({ order, line_items: order.line_items });
  } catch (err) {
    console.log(`Failed to process orderss/create: ${err.message}`);
    res.status(500).send({ err: err.message });
  }
})

app.get("/api/customers.json", async (req, res) => {
  const getData = await shopify.api.rest.Customer.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(getData);
})

app.get("/api/customers/search", async (req, res) => {
  try {
    const getData = await shopify.api.rest.Customer.search({
      session: res.locals.shopify.session,
      query: req.query.first_name
    });
    res.status(200).send(getData);
  } catch (error) {
    res.status(500).send({ err: error.message });
  }
})

app.put("/api/customers/:id.json", async (req, res) => {
  try {
    const customer = new shopify.api.rest.Customer({ session: res.locals.shopify.session });
    customer.id = parseInt(req.params.id);
    customer.first_name = req.body.customer.first_name;
    customer.last_name = req.body.customer.last_name;
    customer.email = req.body.customer.email;
    customer.phone = req.body.customer.phone;
    customer.addresses = req.body.customer.addresses;
    customer.default_address = req.body.customer.default_address;
    customer.verified_email = req.body.customer.verified_email;
    customer.send_email_welcome = req.body.customer.send_email_welcome;

    await customer.save({
      update: true,
    });

    res.status(200).send(customer);
  } catch (error) {
    res.status(500).send({ err: error.message });
  }
})

app.post("/api/customers/create.json", async (req, res) => {
  try {
    const customer = new shopify.api.rest.Customer({ session: res.locals.shopify.session });
    customer.first_name = req.body.first_name;
    customer.last_name = req.body.last_name;
    customer.email = req.body.email;
    customer.phone = req.body.phone;
    customer.addresses = req.body.addresses;
    customer.default_address = req.body.default_address;
    customer.verified_email = req.body.verified_email;
    customer.send_email_welcome = req.body.send_email_welcome;
    const createdCustomer = await customer.save({
      update: true,
    });
    res.status(200).send(createdCustomer);
  } catch (err) {
    console.log(`Failed to process customers/create: ${err.message}`);
    res.status(500).send({ err: err.message });
  }

});

// app.get("/api/payment_gateway.json", async (req, res) => {
//   try {
//     console.log();
//     const payments = await shopify.api.rest.PaymentGateway.all({ session: res.locals.shopify.session });
//     console.log('payments', payments);
//     res.status(200).send(payments);
//   } catch (error) {
//     res.status(500).send({ err: error.message });
//   }
// });

app.get('/api/payment_gateways.json', async (req, res) => {
  try {
    const paymentGateways = await shopify.api.rest.PaymentGateway.all({
      session: res.locals.shopify.session
    });
    res.status(200).send(paymentGateways);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving payment gateways');
  }
});

app.get('/api/languages.json', async (req, res) => {
  try {
    // console.log(shopify.api, " shopify.api");
    const paymentGateways = await shopify.api.rest.Location.all({
      session: res.locals.shopify.session
    });
    res.status(200).send(paymentGateways);
  } catch (err) {
    console.error(err);
    res.status(500).send('error');
  }
});


app.get("/api/countries.json", async (req, res) => {
  let tax = req.query.tax
  try {
    let getData = await shopify.api.rest.Country.all({
      session: res.locals.shopify.session,
    });

    if (tax) {
      getData = getData.filter(item => item.tax === parseFloat(tax))
      res.status(200).send(getData);
    } else {
      res.status(200).send(getData);
    }
  } catch (error) {
    res.status(500).send({ err: error.message });
  }
});

app.get("/api/shop.json", async (req, res) => {
  const countData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
