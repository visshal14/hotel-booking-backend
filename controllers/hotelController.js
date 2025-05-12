const { query } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const hotelController = {
    // Admin: create a new hotel
    createHotel: async (req, res) => {
        try {
            const { name, location, description, amenities } = req.body;

            const id = uuidv4();

            await query('INSERT INTO hotels (id, name, location, description, amenities) VALUES (?,?, ?, ?, ?)', [id, name, location, description, amenities]);

            const hotel = await query('SELECT * from hotels WHERE id = LAST_INSERT_ID()');

            res.status(201).json({ message: 'Hotel created successfully', hotel: hotel[0] });

        } catch (error) {
            console.error('Error creating hotel:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // get all hotels
    getAllHotels: async (req, res) => {
        try {

            const hotels = await query('SELECT * FROM hotels');

            res.json(hotels);


        } catch (error) {
            console.error('Error fetching hotels:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // get a single hotel by Id
    getHotelById: async (req, res) => {
        try {
            const hotel = await query('SELECT * FROM hotels WHERE id = ?', [req.params.id]);

            if (hotel.length === 0) {
                return res.status(404).json({ message: 'hotel not found' });
            }

            res.json(hotel[0]);

        } catch (error) {

            console.error('Error fetching hotel by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Admin: update a hotel
    updateHotel: async (req, res) => {
        try {
            const { name, location, description, amenities } = req.body;

            const result = await query(
                'UPDATE hotels SET name = ?, location = ?, description = ?, amenities = ? WHERE id = ?',
                [name, location, description, amenities, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            const updatedHotel = await query('SELECT * from hotels WHERE id = ?', [req.params.id])

            res.json({ message: 'Hotel updated successfully', hotel: updatedHotel[0] })

        } catch (error) {
            console.error('Error updating hotel:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    // < !--ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
    // Admin: delete a hotel
    deleteHotel: async (req, res) => {
        try {

            const result = await query('DELETE FROM hotels WHERE id = ?', [req.params.id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Hotel not found' })
            }

            res.json({ message: 'Hotel deleted successfully' })

        } catch (error) {
            console.error('Error deleting hotel:', error);
            res.status(500).json({ message: 'Internal server error' })
        }
    },
};

module.exports = hotelController;