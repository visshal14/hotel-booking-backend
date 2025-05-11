const { query } = require('../config/db');
const { v4: uuidv4 } = require('uuid');


const bookingController = {
    // User: Create a new booking
    createBooking: async (req, res) => {
        try {
            const { roomId, checkInDate, checkOutDate } = req.body;
            const userId = req.user.userId;

            // check if the room exists
            const roomResult = await query('SELECT * FROM rooms WHERE id = ?', [roomId]);
            if (roomResult.length === 0) {
                return res.status(400).json({ message: 'Room not found' });
            }

            const formattedCheckInDate = new Date(checkInDate);
            const formattedCheckOutDate = new Date(checkOutDate);
            console.log(checkInDate, checkOutDate);

            console.log(formattedCheckInDate, formattedCheckOutDate);

            // overlapping bookings
            const overlappingBooking = await query(
                `SELECT * FROM bookings 
                WHERE roomId = ? AND status != 'cancelled' AND (
                    (checkInDate < ? AND checkOutDate > ?) OR 
                    (checkInDate <= ? AND checkOutDate >= ?) OR
                    (checkInDate >= ? AND checkOutDate <= ?)
                )`,
                [roomId, formattedCheckOutDate, formattedCheckInDate, formattedCheckInDate, formattedCheckOutDate, formattedCheckInDate, formattedCheckOutDate]
            );

            if (overlappingBooking.length > 0) {
                return res.status(400).json({ message: 'Room is not available ' });
            }


            const today = new Date();
            if (new Date(checkInDate) < today || new Date(checkOutDate) < today) {
                return res.status(400).json({ message: 'check-in and check-out dates must be in the future' });
            }

            if (new Date(checkOutDate) < new Date(checkInDate)) {
                return res.status(400).json({ message: 'check-out date must be after check-in date' });
            }
            const id = uuidv4();

            await query('INSERT INTO bookings (id,userId, roomId, checkInDate, checkOutDate, status) VALUES (?,?, ?, ?, ?, ?)', [id, userId, roomId, formattedCheckInDate, formattedCheckOutDate, 'pending']);

            const booking = await query('SELECT * from bookings WHERE id = LAST_INSERT_ID()');
            res.status(201).json({ message: 'Booking created successfully', booking: booking[0] });

        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // User: Get all bookings 
    getUserBookings: async (req, res) => {
        try {
            const userId = req.user.userId;

            const bookings = await query(
                `SELECT bookings.*, rooms.roomNumber, rooms.roomType, hotels.name as hotelName, hotels.location as hotelLocation
                 FROM bookings 
                 JOIN rooms ON bookings.roomId = rooms.id
                 JOIN hotels ON rooms.hotelId = hotels.id
                 WHERE bookings.userId = ?`,
                [userId]
            );
            res.json(bookings);


        } catch (error) {
            console.error('Error fetching user bookings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // User: cancel a booking
    cancelBooking: async (req, res) => {
        try {
            const bookingId = req.params.id;
            const userId = req.user.userId;

            // find the booking and check if it belongs to the user
            const bookingResult = await query('SELECT * FROM bookings WHERE id = ? AND userId = ?', [bookingId, userId]);
            if (bookingResult.length === 0) {
                return res.status(404).json({ message: 'Booking not found or unauthorized' });
            }

            const booking = bookingResult[0];
            if (booking.status === 'cancelled') {
                return res.status(400).json({ message: 'Booking is already cancelled' });
            }

            // check if the booking is in the past
            const today = new Date();
            if (new Date(booking.checkInDate) < today) {
                return res.status(400).json({ message: 'Cannot cancel a booking that has already started' });
            }

            await query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', bookingId]);

            res.json({ message: 'Booking cancelled successfully' });


        } catch (error) {
            console.error('Error cancelling booking:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Admin: get all bookings
    getAllBookings: async (req, res) => {
        try {
            const bookings = await query(
                `SELECT bookings.*, users.username, users.email, rooms.roomNumber, rooms.roomType, 
                 hotels.name as hotelName, hotels.location as hotelLocation
                 FROM bookings 
                 JOIN users ON bookings.userId = users.id
                 JOIN rooms ON bookings.roomId = rooms.id
                 JOIN hotels ON rooms.hotelId = hotels.id`
            );


            res.json(bookings);


        } catch (error) {
            console.error('Error fetching all bookings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = bookingController;