-- Seed script for sample data
-- Run this after schema.sql to populate the database with sample data

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Phones', 'phones', 'Mobile phones and smartphones', '/images/category/phones.png'),
('Computers', 'computers', 'Laptops, desktops, and accessories', '/images/category/computers.png'),
('SmartWatch', 'smartwatch', 'Smart watches and wearables', '/images/category/smartwatch.png'),
('Camera', 'camera', 'Cameras and photography equipment', '/images/category/camera.png'),
('HeadPhones', 'headphones', 'Audio equipment and headphones', '/images/category/headphones.png'),
('Gaming', 'gaming', 'Gaming consoles and accessories', '/images/category/gaming.png')
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for products
DO $$
DECLARE
    phones_id UUID;
    computers_id UUID;
    smartwatch_id UUID;
    camera_id UUID;
    headphones_id UUID;
    gaming_id UUID;
BEGIN
    SELECT id INTO phones_id FROM categories WHERE slug = 'phones';
    SELECT id INTO computers_id FROM categories WHERE slug = 'computers';
    SELECT id INTO smartwatch_id FROM categories WHERE slug = 'smartwatch';
    SELECT id INTO camera_id FROM categories WHERE slug = 'camera';
    SELECT id INTO headphones_id FROM categories WHERE slug = 'headphones';
    SELECT id INTO gaming_id FROM categories WHERE slug = 'gaming';

    -- Insert Products
    INSERT INTO products (
        name, slug, description, price, original_price, stock, 
        category_id, image_url, images, rating, reviews_count,
        is_featured, is_best_selling, is_new_arrival, is_flash_sale, flash_sale_discount
    ) VALUES
    -- Gaming Products
    ('HAVIT HV-G92 Gamepad', 'havit-hv-g92-gamepad', 'High-quality gaming controller with precision controls', 120.00, 160.00, 50, gaming_id, 
     '/images/5d5c2e5250752d55f8b60f2aa2923183dadbc135.png', 
     ARRAY['/images/5d5c2e5250752d55f8b60f2aa2923183dadbc135.png'], 5.0, 88, true, true, false, true, 25),
    
    ('AK-900 Wired Keyboard', 'ak-900-wired-keyboard', 'Mechanical keyboard with RGB lighting', 960.00, 1160.00, 30, computers_id,
     '/images/288e013365fe639fccc1fe4168fca740ef1f85e7.png',
     ARRAY['/images/288e013365fe639fccc1fe4168fca740ef1f85e7.png'], 4.0, 75, true, false, false, true, 17),
    
    ('IPS LCD Gaming Monitor', 'ips-lcd-gaming-monitor', '27-inch 4K gaming monitor with high refresh rate', 370.00, 400.00, 25, computers_id,
     '/images/5e634682db5174aff99bb9337d2dc9598a0b44e4.png',
     ARRAY['/images/5e634682db5174aff99bb9337d2dc9598a0b44e4.png'], 5.0, 99, true, true, false, true, 8),
    
    ('S-Series Comfort Chair', 's-series-comfort-chair', 'Ergonomic office chair with lumbar support', 375.00, 400.00, 40, computers_id,
     '/images/a61d4c7110b18ab55a1e1a07ebf54a46ebb07284.png',
     ARRAY['/images/a61d4c7110b18ab55a1e1a07ebf54a46ebb07284.png'], 4.0, 65, false, false, false, true, 6),
    
    -- Best Selling Products
    ('The North Coat', 'the-north-coat', 'Warm winter coat with waterproof material', 260.00, 360.00, 60, NULL,
     '/images/04a1915fd6cedd7c8b1073685c5f1be1b50e1ac6.png',
     ARRAY['/images/04a1915fd6cedd7c8b1073685c5f1be1b50e1ac6.png'], 4.0, 65, false, true, false, false, NULL),
    
    ('Gucci duffle bag', 'gucci-duffle-bag', 'Luxury designer duffle bag', 960.00, 1160.00, 15, NULL,
     '/images/4f3ca1d12722dbdf98f25179d3c0b785988c513d.png',
     ARRAY['/images/4f3ca1d12722dbdf98f25179d3c0b785988c513d.png'], 5.0, 65, false, true, false, false, NULL),
    
    ('RGB liquid CPU Cooler', 'rgb-liquid-cpu-cooler', 'High-performance liquid cooling system', 160.00, 170.00, 35, computers_id,
     '/images/6739d39dc218c97b645d616c8188a4f2e6aaf84b.png',
     ARRAY['/images/6739d39dc218c97b645d616c8188a4f2e6aaf84b.png'], 4.0, 65, false, true, false, false, NULL),
    
    ('Small BookSelf', 'small-bookshelf', 'Compact bookshelf for small spaces', 360.00, 360.00, 20, NULL,
     '/images/991387c05dd6d44594e01b675513068803e2426d.png',
     ARRAY['/images/991387c05dd6d44594e01b675513068803e2426d.png'], 4.0, 65, false, true, false, false, NULL),
    
    -- New Arrivals
    ('ASUS FHD Gaming Laptop', 'asus-fhd-gaming-laptop', 'High-performance gaming laptop with RTX graphics', 700.00, 700.00, 10, computers_id,
     '/images/203be522b7b02d10672f6f6147762cf52bfcfc54.png',
     ARRAY['/images/203be522b7b02d10672f6f6147762cf52bfcfc54.png'], 5.0, 325, true, false, true, false, NULL),
    
    ('CANON EOS DSLR Camera', 'canon-eos-dslr-camera', 'Professional DSLR camera with 24MP sensor', 360.00, 400.00, 8, camera_id,
     '/images/38932d5accb54c528f9bcf326ca48ea29bd6d890.png',
     ARRAY['/images/38932d5accb54c528f9bcf326ca48ea29bd6d890.png'], 4.0, 95, false, false, true, false, 10),
    
    ('Curology Product Set', 'curology-product-set', 'Complete skincare product set', 500.00, 500.00, 50, NULL,
     '/images/d0b7bb25884f6fdfc1357634d7d7b09e05755c2f.png',
     ARRAY['/images/d0b7bb25884f6fdfc1357634d7d7b09e05755c2f.png'], 4.0, 145, false, false, true, false, NULL),
    
    ('Kids Electric Car', 'kids-electric-car', 'Safe electric car for kids', 960.00, 1000.00, 12, NULL,
     '/images/e86f6e872757d20a14861e2e0ebd4e9889693f59.png',
     ARRAY['/images/e86f6e872757d20a14861e2e0ebd4e9889693f59.png'], 5.0, 65, false, false, true, false, 4),
    
    ('Jr. Zoom Soccer Cleats', 'jr-zoom-soccer-cleats', 'Professional soccer cleats for youth', 1160.00, 1160.00, 30, NULL,
     '/images/e60892a4f0a3d5d144dce622c7338ec5be12908f.png',
     ARRAY['/images/e60892a4f0a3d5d144dce622c7338ec5be12908f.png'], 4.0, 35, false, false, true, false, NULL),
    
    ('GP11 Shooter USB Gamepad', 'gp11-shooter-usb-gamepad', 'USB gaming controller for PC', 660.00, 700.00, 25, gaming_id,
     '/images/288e013365fe639fccc1fe4168fca740ef1f85e7.png',
     ARRAY['/images/288e013365fe639fccc1fe4168fca740ef1f85e7.png'], 4.0, 55, false, false, true, false, 6),
    
    ('Quilted Satin Jacket', 'quilted-satin-jacket', 'Stylish quilted jacket with satin finish', 660.00, 660.00, 40, NULL,
     '/images/04a1915fd6cedd7c8b1073685c5f1be1b50e1ac6.png',
     ARRAY['/images/04a1915fd6cedd7c8b1073685c5f1be1b50e1ac6.png'], 4.0, 55, false, false, true, false, NULL),
    
    ('Breed Dry Dog Food', 'breed-dry-dog-food', 'Premium dry dog food for all breeds', 100.00, 100.00, 100, NULL,
     '/images/bacbff99a8fc8e50822cb2d2d168e5d0e8bf7ea6.png',
     ARRAY['/images/bacbff99a8fc8e50822cb2d2d168e5d0e8bf7ea6.png'], 3.0, 35, false, false, false, false, NULL)
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- Note: This seed script assumes the images exist in the public/images directory
-- Adjust image paths as needed based on your actual image files

