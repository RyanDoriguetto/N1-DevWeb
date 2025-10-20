-- PostgreSQL schema para Coffee Shop

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL -- ADMIN, CAIXA, ATENDENTE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL, -- ADMIN, CAIXA, ATENDENTE
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
    CREATE TYPE product_category AS ENUM ('CAFE','BEBIDA','COMIDA','SOBREMESA');
  END IF;
END $$;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  prep_time_min SMALLINT NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('RECEBIDO','EM_PREPARO','PRONTO','ENTREGUE','CANCELADO');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM ('PENDENTE','DINHEIRO','CARTAO','PIX');
  END IF;
END $$;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  created_by INT REFERENCES users(id) NOT NULL,
  created_by_role VARCHAR(20) NOT NULL,
  creation_type VARCHAR(10) NOT NULL CHECK (creation_type IN ('BALCAO','MESA')),
  table_number SMALLINT,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'RECEBIDO',
  payment_method payment_method NOT NULL DEFAULT 'PENDENTE',
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(10,2) NOT NULL CHECK (line_total >= 0)
);

CREATE OR REPLACE FUNCTION update_order_total() RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders o
  SET total = COALESCE((SELECT SUM(line_total) FROM order_items oi WHERE oi.order_id = o.id), 0)
  WHERE o.id = NEW.order_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_items_total ON order_items;
CREATE TRIGGER trg_order_items_total
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION update_order_total();

INSERT INTO roles(name) VALUES ('ADMIN'),('CAIXA'),('ATENDENTE')
ON CONFLICT DO NOTHING;
