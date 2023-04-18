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
  console.log(req.query.title, " queryyyyyyyyyy");
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

// app.get("/api/orders/count", async (_req, res) => {
//   const countData = await shopify.api.rest.Order.count({
//     session: res.locals.shopify.session,
//     status: "any",
//   });
//   res.status(200).send(countData);
// });

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
app.get("/api/customers/search", async (req, res) => {
})

app.post("/api/customers/create.json", async (req, res) => {
  try {
    console.log("reqreqreq", req.body.phone);
    const customer = new shopify.api.rest.Customer({ session: res.locals.shopify.session });
    customer.first_name = req.body.first_name;
    customer.last_name = req.body.last_name;
    customer.email = req.body.email;
    customer.phone = req.body.phone;
    customer.addresses = req.body.addresses;
    customer.default_address = req.body.default_address;
    customer.verified_email = true;
    customer.send_email_welcome = false;
    const createdCustomer = await customer.save({
      update: true,
    });
    res.status(200).send(createdCustomer);
  } catch (err) {
    console.log(`Failed to process customers/create: ${err.message}`);
    res.status(500).send({ err: err.message });
  }

})


// app.get("/api/invoice", async (req, res, next) => {
//   const stream = res.writeHead(200, {
//     "Content-Type": "application/pdf",
//     "Content-Disposition": "attachment; filename: invoice.pdf",
//   });

//   pdfService.buildPDF(
//     (chunk) => stream.write(chunk),
//     () => stream.end()
//   );

// })



app.get("/api/shop.json", async (req, res) => {
  const countData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,

  });
  res.status(200).send(countData);
});

app.get("/api/products/:id.json", async (req, res) => {
  const getData = await shopify.api.rest.Product.find({
    session: res.locals.shopify.session,
    id: req.params.id
  });
  res.status(200).send(getData);
});

app.post("/api/orders/create.json", async (req, res) => {
  try {
    const order = new shopify.api.rest.Order({ session: res.locals.shopify.session });
    order.line_items = req.body.order.line_items
    order.customer = req.body.order.customer

    order.transactions = [{
      kind: req.body.order.transactions[0].kind,
      status: req.body.order.transactions[0].status,
      amount: req.body.order.transactions[0].amount,
    }]

    order.test = req.body.order.test
    order.financial_status = req.body.order.financial_status

    await order.save({
      update: true,
    });
    res.status(200).send(order);
  } catch (err) {
    console.log(`Failed to process orderss/create: ${err.message}`);
    res.status(500).send({ err: err.message });
  }
})


app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});





app.listen(PORT);
