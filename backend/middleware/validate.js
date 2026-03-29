const { z } = require('zod');

// General validation middleware generator
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Data validation failed',
                errors: (err.issues || []).map(e => ({ 
                    field: Array.isArray(e.path) ? e.path.join('.') : 'unknown', 
                    message: e.message 
                }))
            });
        }
        next(err);
    }
};

// --- SCHEMAS ---

/**
 * Project submission — validates title, description, type, and URLs.
 * Prevents oversized payloads and invalid URLs from reaching the DB.
 */
const submitProjectSchema = z.object({
    body: z.object({
        title: z.string()
            .min(3, 'Title must be at least 3 characters')
            .max(150, 'Title cannot exceed 150 characters')
            .trim(),
        description: z.string()
            .min(20, 'Description must be at least 20 characters')
            .max(5000, 'Description cannot exceed 5000 characters'),
        type: z.enum(['independent', 'collaborative'], {
            errorMap: () => ({ message: "Type must be 'independent' or 'collaborative'" })
        }),
        techStack: z.array(z.string().max(50)).max(20, 'Too many tech stack entries').optional(),
        githubRepo: z.string().url('GitHub repo must be a valid URL').max(500).optional().or(z.literal('')),
        deployedLink: z.string().url('Deployed link must be a valid URL').max(500).optional().or(z.literal('')),
        images: z.array(z.string().url()).max(10, 'Too many images').optional(),
    })
});

/**
 * Event creation schema
 */
const createEventSchema = z.object({
    body: z.object({
        title:          z.string().min(3, 'Title must be at least 3 characters').max(200),
        description:    z.string().min(10, 'Description needs more detail').max(5000),
        date:           z.string(),
        time:           z.string().optional(),
        location:       z.string().min(2, 'Location is required').max(300),
        organizer:      z.string().max(100),
        organizerEmail: z.string().email('Invalid organizer email'),
        maxAttendees:   z.coerce.number().int().positive().optional(),
        category:       z.string().max(50).optional(),
        type:           z.enum(['virtual', 'in-person']).optional(),
    }).passthrough() // Allow other fields like image, whatsappGroupLink
});

/**
 * Pagination schema — used on GET list endpoints
 */
const paginationSchema = z.object({
    query: z.object({
        page:   z.string().regex(/^\d+$/).transform(Number).optional(),
        limit:  z.string().regex(/^\d+$/).transform(Number).optional(),
        search: z.string().max(100).optional(),
    }).passthrough()
});

module.exports = {
    validate,
    schemas: {
        submitProjectSchema,
        createEventSchema,
        paginationSchema,
    }
};