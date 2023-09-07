/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // Create the 'users' table
    pgm.createTable('users', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
        email: { type: 'varchar(255)', unique: true, notNull: true },
        password: { type: 'varchar(255)', notNull: true },
        is_admin: { type: 'boolean', notNull: true },
    });
    // Create the 'products' table
    pgm.createTable('products', {
        id: 'id',
        category: 'text',
        brand: 'text',
        name: 'text',
        imageUrl: 'text',
        description: 'text',
        min_price: { type: 'decimal(10, 2)', notNull: true },
        max_price: { type: 'decimal(10, 2)', notNull: true },
        currency_code: 'text',
        amount: { type: 'decimal(10, 2)', notNull: true },
        availability: 'boolean',
        total_inventory: 'int',
    });
    // Create the 'billing_addresses' table
    pgm.createTable('billing_addresses', {
        id: 'id',
        user_id: { type: 'int', notNull: true },
        street: { type: 'varchar(255)', notNull: true },
        city: { type: 'varchar(255)', notNull: true },
        state: { type: 'varchar(255)', notNull: true },
        postal_code: { type: 'varchar(20)', notNull: true },
        country: { type: 'varchar(255)', notNull: true },
    });
    // Create the 'user_billing_addresses' table
    pgm.createTable('user_billing_addresses', {
        id: 'id',
        user_id: { type: 'int', references: 'users(id)' },
        billing_address_id: { type: 'int', references: 'billing_addresses(id)' },
    });
    // Create the 'shipping_addresses' table
    pgm.createTable('shipping_addresses', {
        id: 'id',
        user_id: { type: 'int', notNull: true },
        street: { type: 'varchar(255)', notNull: true },
        city: { type: 'varchar(255)', notNull: true },
        state: { type: 'varchar(255)', notNull: true },
        postal_code: { type: 'varchar(20)', notNull: true },
        country: { type: 'varchar(255)', notNull: true },
    });
    // Create the 'user_shipping_addresses' table
    pgm.createTable('user_shipping_addresses', {
        id: 'id',
        user_id: { type: 'int', references: 'users(id)' },
        shipping_address_id: { type: 'int', references: 'shipping_addresses(id)' },
    });
    // Create the 'product_reviews' table
    pgm.createTable('product_reviews', {
        id: 'id',
        product_id: { type: 'int', notNull: true },
        user_id: { type: 'int', notNull: true },
        rating: { type: 'int', notNull: true },
        review_text: 'text',
        review_date: { type: 'timestamp', notNull: true },
    });
    // Create the 'order_history' table
    pgm.createTable('order_history', {
        id: 'id',
        session_id: { type: 'uuid', notNull: true },
        user_id: { type: 'int', notNull: true },
        order_date: { type: 'timestamp', notNull: true },
        total_amount: { type: 'decimal(10, 2)', notNull: true },
        billing_address_id: { type: 'int', notNull: true },
        shipping_address_id: { type: 'int', notNull: true },
        order_products: { type: 'jsonb[]', notNull: true, default: "'{}'" },
        status: { type: 'text', notNull: true },
    });
    // Create the 'carts' table
    pgm.createTable('carts', {
        id: 'id',
        user_id: { type: 'int' },
        guest_id: { type: 'uuid' },
        created_at: { type: 'timestamptz', default: 'now()', notNull: true },
        updated_at: { type: 'timestamptz', default: 'now()', notNull: true },
    });
    // Create the 'cart_items' table
    pgm.createTable('cart_items', {
        id: 'id',
        user_id: { type: 'int' },
        cart_id: { type: 'int' },
        product_id: { type: 'int' },
        quantity: { type: 'int' },
        created_at: { type: 'timestamptz', default: 'now()', notNull: true },
        updated_at: { type: 'timestamptz', default: 'now()', notNull: true },
    });
};
exports.down = pgm => {
    pgm.dropTable('cart_items');
    pgm.dropTable('carts');
    pgm.dropTable('order_history');
    pgm.dropTable('product_reviews');
    pgm.dropTable('user_shipping_addresses');
    pgm.dropTable('shipping_addresses');
    pgm.dropTable('user_billing_addresses');
    pgm.dropTable('billing_addresses');
    pgm.dropTable('products');
    pgm.dropTable('users');
};
