const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roomId
 *               - checkIn
 *               - checkOut
 *             properties:
 *               userId:
 *                 type: string
 *               roomId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, bookingController.createBooking);

/**
 * @swagger
 * /bookings/user:
 *   get:
 *     summary: Get bookings of the logged-in user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 *       401:
 *         description: Unauthorized
 */
router.get('/user', verifyToken, bookingController.getUserBookings);

/**
 * @swagger
 * /bookings/cancel/{id}:
 *   post:
 *     summary: Cancel a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.post('/cancel/:id', verifyToken, bookingController.cancelBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admins only
 */
router.get('/', verifyToken, isAdmin, bookingController.getAllBookings);

module.exports = router;
