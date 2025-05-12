const { query } = require('../config/db');
const { v4: uuidv4 } = require('uuid');



const roomController = {
    // Admin: create a new room
    createRoom: async (req, res) => {
        try {
            const { hotelId, roomNumber, roomType, capacity, price } = req.body;


            const id = uuidv4();


            // check hotel exists
            const hotelResult = await query('SELECT * FROM hotels WHERE id = ?', [hotelId]);

            if (hotelResult.length === 0) {
                return res.status(400).json({ message: 'Hotel not found' });
            }

            await query('INSERT INTO rooms (id,hotelId, roomNumber, roomType, capacity, price) VALUES (?,?, ?, ?, ?, ?)', [id, hotelId, roomNumber, roomType, capacity, price]);


            const room = await query('SELECT * from rooms WHERE id = LAST_INSERT_ID()');

            res.status(201).json({ message: 'Room created successfully', room: room[0] });

        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // get all rooms
    getAllRooms: async (req, res) => {
        try {

            const rooms = await query(
                'SELECT rooms.*, hotels.name as hotelName, hotels.location as hotelLocation ' +
                'FROM rooms JOIN hotels ON rooms.hotelId = hotels.id'
            );

            res.json(rooms);

        } catch (error) {
            console.error('Error fetching rooms:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // get a single room by Id
    getRoomById: async (req, res) => {
        try {

            const roomResult = await query(
                'SELECT rooms.*, hotels.name as hotelName, hotels.location as hotelLocation ' +
                'FROM rooms JOIN hotels ON rooms.hotelId = hotels.id WHERE rooms.id = ?',
                [req.params.id]
            );

            if (roomResult.length === 0) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.json(roomResult[0]);

        } catch (error) {
            console.error('Error fetching room by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Admin: update a room
    updateRoom: async (req, res) => {
        try {
            const { hotelId, roomNumber, roomType, capacity, price } = req.body;

            // Check  hotel exists
            const hotelResult = await query('SELECT * FROM hotels WHERE id = ?', [hotelId]);

            if (hotelResult.length === 0) {
                return res.status(400).json({ message: 'Hotel not found' });
            }

            const result = await query(
                'UPDATE rooms SET hotelId = ?, roomNumber = ?, roomType = ?, capacity = ?, price = ? WHERE id = ?',
                [hotelId, roomNumber, roomType, capacity, price, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Room not found' });
            }
            // < !--ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
            const updatedRoom = await query('SELECT * from rooms WHERE id = ?', [req.params.id]);

            res.json({ message: 'Room updated successfully', room: updatedRoom[0] });

        } catch (error) {
            console.error('Error updating room:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Admin: delete a room
    deleteRoom: async (req, res) => {
        try {

            const result = await query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.json({ message: 'Room deleted successfully' });

        } catch (error) {
            console.error('Error deleting room:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // get rooms by hotel Id
    getRoomsByHotelId: async (req, res) => {
        try {

            const hotelId = req.params.hotelId;
            const rooms = await query('SELECT * FROM rooms WHERE hotelId = ?', [hotelId]);

            res.json(rooms);

        } catch (error) {
            console.error('Error fetching rooms by hotel ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = roomController;