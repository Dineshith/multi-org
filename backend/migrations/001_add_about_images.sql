USE multiorg;

ALTER TABLE organizations
    ADD COLUMN about_image_url VARCHAR(1000) NULL AFTER logo_url,
    ADD COLUMN why_us_image_url VARCHAR(1000) NULL AFTER about_image_url;