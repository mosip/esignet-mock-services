const db = require('./database');

// Function to insert data into the travel_pass_data table
const insertTravelPassData = async (data) => {
  const {
    uin,
    full_name,
    phone_number,
    gender,
    invoice_number,
    invoice_date,
    exporter_name,
    importer_name,
    truck_license_plate_number,
    cross_border_entry_exit_post,
    date_of_departure,
    date_of_return,
    country_of_origin,
    country_of_destination,
  } = data;

  const queryText = `
    INSERT INTO travel_pass_data (
      uin,
      full_name,
      phone_number,
      gender,
      invoice_number,
      invoice_date,
      exporter_name,
      importer_name,
      truck_license_plate_number,
      cross_border_entry_exit_post,
      date_of_departure,
      date_of_return,
      country_of_origin,
      country_of_destination
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 
    )
    RETURNING *;
  `;
  try {
    const result = await db.query(queryText, [
      uin,
      full_name,
      phone_number,
      gender,
      invoice_number,
      invoice_date,
      exporter_name,
      importer_name,
      truck_license_plate_number,
      cross_border_entry_exit_post,
      date_of_departure,
      date_of_return,
      country_of_origin,
      country_of_destination
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Failed executing query: ", queryText);
    console.error("Failed variables: ",data );
    throw new Error('Error inserting travel pass data');
  }
};

module.exports = {
  insertTravelPassData,
};
