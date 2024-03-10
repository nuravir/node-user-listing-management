const auth = require('../middleware/authorization');
const roles = require('../roles');
const Listing = require('../models/listings');
const express = require('express');

const router = express.Router();

// Create a new listing
router.post('/create', auth.verifyToken, (req, res) => {

    if (req.user.role !== roles.OWNER && req.user.role !== roles.ADMIN) {
        return res.status(403).json({ error: 'Permission denied' });
    }
    const { name, phone, city, address, images } = req.body;
    const owner = req.user.email;
    const newListing = new Listing({ name, owner, phone, city, address, images });
    newListing.save();
    res.json(newListing);
});

// Retrieve all listings - everyone has access.
router.get('/fetch', auth.verifyToken, async (req, res) => {
    const listings = await Listing.find();
    res.json(listings);
});

// Retrieve a single listing by ID - everyone has access.
router.get('/fetch/:name', auth.verifyToken, async (req, res) => {
    const name = req.params.name;
    const listing = await Listing.findOne({ name });
    res.json(listing);
});

// Update a listing by ID
router.patch('/update', auth.verifyToken, async (req, res) => {

    if (req.user.role !== roles.OWNER && req.user.role !== roles.ADMIN) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    delete req.body.user?.review;
    delete req.body.user?.reviews;

    const name = req.body.name;
    const listing = await Listing.findOneAndUpdate({ name }, req.body, { new: true });
    res.json(listing);
});

// Delete a listing by ID
router.delete('/delete/:name', auth.verifyToken, async (req, res) => {

    if (req.user.role !== roles.ADMIN) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    const name = req.params.name;
    await Listing.deleteOne({ name });
    res.json({
        message: 'Listing deleted successfully'
    });
});

// Create a new review
router.post('/reviews/:name', auth.verifyToken, async (req, res) => {
    try {

        if (req.user.role !== roles.ADMIN && req.user.role !== roles.USER) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        const name = req.params.name;
        const { rating, comment } = req.body;

        // Find the listing by ID
        const listing = await Listing.findOne({ name });

        if (!listing) {
            return res.status(404).json({ error: 'User not found' });
        }

        const users = listing.reviews.map(review => review.user);
        const hasWrittenReview = users.includes(req.user.email);
        if (hasWrittenReview) {
            return res.status(403).json({ error: 'You have already written a review' });
        } else {
            // Add the new review to the user's reviews array
            listing.reviews.push({ user: req.user.email, rating, comment });
            await listing.save();

            res.json(listing.reviews[listing.reviews.length - 1]); // Return the newly added review
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read reviews
router.get('/reviews/:name', auth.verifyToken, async (req, res) => {
    try {
        const name = req.params.name;

        // Find the listing by ID
        const listing = await Listing.findOne({ name });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        res.json(listing.reviews); // Return the listing's reviews
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update reviews
router.patch('/reviews/:name/:reviewId', auth.verifyToken, async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const name = req.params.name;
        const { rating, comment } = req.body;

        // Find the listing by ID
        const listing = await Listing.findOne({ name });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }


        // Find the review by ID
        const reviewIndex = listing.reviews.findIndex(review => review._id.toString() === reviewId);

        if (reviewIndex == -1) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if the user is authorized to update the review
        if (req.user.role === roles.ADMIN || (req.user.role === roles.USER && listing.reviews[reviewIndex].user === req.user.email)) {
            // If the user is admin or the owner of the review, update the review
            const updatedReview = { ...listing.reviews[reviewIndex], rating: rating, comment: comment, updatedAt: Date.now() };
            listing.reviews[reviewIndex] = updatedReview;
            await listing.save();
            res.json(updatedReview); // Return the updated review
        } else if (req.user.role === roles.OWNER) {
            const review = listing.reviews[reviewIndex];
            // If the user is the owner of the listing associated with the review, add a reply

            // Check if the user has already replied to the review
            if (listing.owner !== req.user.email) {
                return res.status(403).json({ error: 'You are not the owner of this listing'});
            }

            // Append the reply to the existing review
            review.reply = { user: req.user.email, comment };
            listing.reviews[reviewIndex] = review;
            await listing.save();
            res.json(review); // Return the updated review with the reply
        } else {
            // User doesn't have permission to update the review
            return res.status(403).json({ error: 'Permission denied' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete review
router.delete('/reviews/:name/:reviewId', auth.verifyToken, async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const name = req.params.name;

        // Find the listing by name
        const listing = await Listing.findOne({ name });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Find the review index by ID
        const reviewIndex = listing.reviews.findIndex(review => review._id.toString() === reviewId);

        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if the user is authorized to delete the review
        if (req.user.role === roles.ADMIN || (req.user.role === roles.USER && listing.reviews[reviewIndex].user === req.user.email)) {
            // If the user is admin or the owner of the review, delete the review
            listing.reviews.splice(reviewIndex, 1); // Remove the review from the array
            await listing.save();
            res.json({ message: 'Review deleted successfully' });
        } else {
            // User doesn't have permission to delete the review
            return res.status(403).json({ error: 'Permission denied' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

