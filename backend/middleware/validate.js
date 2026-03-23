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

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        sapId: z.string().optional(),
        branch: z.string().optional(),
        year: z.string().optional(),
        section: z.string().optional()
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required")
    })
});

const createEventSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        description: z.string().min(10, "Description needs more detail"),
        date: z.string(),
        time: z.string().optional(),
        location: z.string().min(2, "Location is required"),
        organizer: z.string(),
        organizerEmail: z.string().email("Invalid organizer email"),
        maxAttendees: z.coerce.number().int().positive().optional(),
        category: z.string().optional(),
        type: z.enum(["virtual", "in-person"]).optional()
    }).passthrough() // Allow other fields like image, whatsappGroupLink
});

const paginationSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        search: z.string().optional()
    }).passthrough()
});

module.exports = {
    validate,
    schemas: {
        registerSchema,
        loginSchema,
        createEventSchema,
        paginationSchema
    }
};