import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();


//Route for Save a new Book
router.post('/', async (request, response) => {
    try {
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ){
            return response.status(400).send({
                message: 'Send all rewuired fields: title, author, publishYear',
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        const book = await Book.create(newBook);

        return response.status(201).send(book);
    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for Get All Books from database
router.get('/', async (request, response) => {
    try{
        const books = await Book.find({});

        return response.status(200).json({
            count: books.length,
            data: books
        });
    }catch (error){
        console.log(error.message);
        response.status(500).send({message: error.message });
    }
});

// Route for Get one Books from database by ID
router.get('/:id', async (request, response) => {
    try{

        const { id } = request.params;

        const book = await Book.findById(id);

        return response.status(200).json(book);
    }catch (error){
        console.log(error.message);
        response.status(500).send({message: error.message });
    }
});

// Route to Update a Book
router.put('/:id', async (request, response) => {
    try {
        // Validate required fields
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }

        // Extract ID from params
        const { id } = request.params;

        // Update book by ID
        const result = await Book.findByIdAndUpdate(id, request.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });

        // If no book is found, return 404
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        // Successfully updated
        return response.status(200).send({
            message: 'Book updated successfully',
            book: result,
        });
    } catch (error) {
        console.error(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Route for Delete a Book
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id);
        if (!result){
            return response.status(404).json({message: 'Book not found' });
        }

        return response.status(200).send({message: 'Book deleted successfully'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})

export default router;