const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

/*const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";*/

const plugins = [
  'medusa-fulfillment-manual',
  'medusa-payment-manual',
  {
    resolve: "@medusajs/file-local",
    options: {
      upload_dir: "uploads",
    },
  },

  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },

  {
    resolve: 'medusa-plugin-sendgrid',
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: 
        process.env.SENDGRID_ORDER_PLACED_ID,
      localization: {
        "de-DE": { // locale key
          order_placed_template:
            process.env.SENDGRID_ORDER_PLACED_ID_LOCALIZED,
        },
      },
    },
  },


  {
    resolve: 'medusa-payment-paypal',
    options: {
      sandbox: process.env.PAYPAL_SANDBOX,
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
      auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID,
    },
  },
  {
    resolve: 'medusa-payment-stripe',
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
  
  {
    resolve: 'medusa-plugin-dashboard',
    options: {
      enableUI: true,
    },
  },
/*
  {
    resolve: 'medusa-plugin-custom-dashboard',
    options: {
        enableUI: true,
    },
},
*/
{
  resolve: 'medusa-plugin-abandoned-cart',
  /** @type {import('medusa-plugin-abandoned-cart').PluginOptions} */
  options: {
    from: process.env.SENDGRID_FROM,
    subject: "You have something in your cart", // optional
    templateId: process.env.SENDGRID_ABANDONED_CART_TEMPLATE,
    enableUI: true,
    localization: {
      "de-DE": {
        subject: "Sie haben etwas in Ihrem Warenkorb gelassen",
        templateId: process.env.SENDGRID_ABANDONED_CART_DE_TEMPLATE,
      },
    },
  },
},

'medusa-plugin-product-reviews',
{
  resolve: 'medusa-storage-supabase',
  options: {
    referenceID: process.env.STORAGE_BUCKET_REF,
    serviceKey: process.env.STORAGE_SERVICE_KEY,
    bucketName: process.env.BUCKET_NAME,
  },
},
{
  resolve: 'medusa-plugin-restock-notification',
  options: {
    trigger_delay: 1000, // optional, delay time in milliseconds
    inventory_required: 10, // minimum inventory quantity to consider a variant as restocked
  },
},
/*
{
  resolve: `medusa-plugin-wishlist`,
},
*/

{
  resolve: 'medusa-plugin-segment',
  options: {
    write_key: process.env.SEGMENT_WRITE_KEY,
  },
},

{
  resolve: 'medusa-plugin-algolia',
  options: {
    applicationId: process.env.ALGOLIA_APP_ID,
    adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
    settings: {
      products: {
        indexSettings: {
          searchableAttributes: ["title", "description"],
          attributesToRetrieve: [
            "id",
            "title",
            "description",
            "handle",
            "thumbnail",
            "variants",
            "variant_sku",
            "options",
            "collection_title",
            "collection_handle",
            "images",
          ],
        },
        transformer: (product) => ({ 
          id: product.id, 
          // other attributes...
        }),
      },
    },
  },
},

{
  resolve: `medusa-plugin-sendgrid`,
  options: {
    api_key: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_FROM,
    order_placed_template: 
      process.env.SENDGRID_ORDER_PLACED_ID,
    localization: {
      "de-DE": { // locale key
        order_placed_template:
          process.env.SENDGRID_ORDER_PLACED_ID_LOCALIZED,
      },
    },
  },
},
];
/*
const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
};
*/

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig: {
    /*redis_url:  process.env.REDIS_URL || "redis://localhost:6379",*/
    database_url: process.env.DATABASE_URL || "postgres://postgres:Royal_Footwear@localhost:5432/postgres",
    database_type: "postgres",
    backend_url: process.env.BACKEND_URL || "http://localhost:7001",
    // CORS when consuming Medusa from admin
    admin_cors: process.env.ADMIN_CORS || "/http:\\/\\/localhost:700[01]$/",
    // CORS to avoid issues when consuming Medusa from a client
    store_cors: process.env.STORE_CORS || "/http:\\/\\/localhost:8000$/",
    auth_cors: process.env.AUTH_CORS || "/http:\\/\\/localhost:700\\d+$/",
    jwtSecret: process.env.JWT_SECRET  || "supersecret",
    cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    connectionName: process.env.REDIS_CONNECTION_NAME || "medusa",
    name: process.env.SESSION_NAME || "custom",
    jobs_batch_size: 100
  },
  plugins,
};