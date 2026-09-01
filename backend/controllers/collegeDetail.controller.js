export const createCollegeDetail = async (req, res) => {
  try {
    const { name, logo, address, phone, email } = req.body;

    const college = await req.app.locals.db.collegeDetail.create({
      data: {
        name,
        logo,
        address,
        contact: {
          create: {
            phone,
            email,
          },
        },
      },
      include: {
        contact: true,
      },
    });

    res.status(201).json({
      message: "College detail created successfully",
      data: college,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create college detail",
      error: error.message,
    });
  }
};