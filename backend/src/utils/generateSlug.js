const generateSlug = async (name, pool) => {
  // Convert name to slug
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const originalSlug = slug;
  let counter = 1;

  // Check if slug already exists
  while (true) {
    const [rows] = await pool.execute(
      "SELECT id FROM organizations WHERE slug = ? LIMIT 1",
      [slug]
    );

    if (rows.length === 0) {
      break;
    }

    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export default generateSlug;