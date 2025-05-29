const IbrahFlow = require('./ibrahflow');

// Create a new IbrahFlow instance
const app = new IbrahFlow({
    database: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'myapp'
    }
});

// Logging middleware
app.use(async (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    await next();
});

// Home route
app.get('/', async (req, res) => {
    const html = await app.render('index', {
        title: 'Welcome to IbrahFlow.js',
        message: 'A modern framework for full-stack JavaScript development'
    });
    app.send(res, html);
});

// Documentation route with dynamic content
app.get('/documentation', async (req, res) => {
    const sections = {
        gettingStarted: {
            title: 'Getting Started',
            items: [
                { id: 'installation', title: 'Installation', content: 'Installation guide and requirements' },
                { id: 'quick-start', title: 'Quick Start', content: 'Create your first application' },
                { id: 'project-structure', title: 'Project Structure', content: 'Understanding the framework' }
            ]
        },
        coreConcepts: {
            title: 'Core Concepts',
            items: [
                { id: 'database', title: 'Database Integration', content: 'Working with MySQL' },
                { id: 'routing', title: 'Routing', content: 'Define your application routes' },
                { id: 'views', title: 'View Rendering', content: 'Render dynamic views' },
                { id: 'middleware', title: 'Middleware', content: 'Extend functionality' }
            ]
        },
        uiComponents: {
            title: 'UI Components',
            items: [
                { id: 'components', title: 'Components Overview', content: 'Available UI components' },
                { id: 'customization', title: 'Customization', content: 'Customize your UI' }
            ]
        },
        bestPractices: {
            title: 'Best Practices',
            items: [
                { id: 'security', title: 'Security', content: 'Security best practices' },
                { id: 'performance', title: 'Performance', content: 'Optimize your application' }
            ]
        }
    };

    const codeExamples = {
        installation: {
            title: 'Terminal',
            code: 'npm install ibrahflow'
        },
        quickStart: {
            title: 'app.js',
            code: `const IbrahFlow = require('ibrahflow');

const app = new IbrahFlow({
    database: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'myapp'
    }
});

app.get('/', async (req, res) => {
    const html = await app.render('index', {
        title: 'Welcome to My App',
        message: 'Hello from IbrahFlow!'
    });
    app.send(res, html);
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});`
        },
        database: {
            title: 'Database Example',
            code: `// Connect to database
await app.connect();

// Execute queries
const users = await app.query('SELECT * FROM users');

// Insert data
await app.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    ['John', 'john@example.com']
);`
        },
        routing: {
            title: 'Routing Example',
            code: `// GET request
app.get('/users', async (req, res) => {
    const users = await app.query('SELECT * FROM users');
    app.send(res, JSON.stringify(users), 'application/json');
});

// POST request
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    await app.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    app.send(res, 'User created successfully');
});`
        }
    };

    const html = await app.render('documentation', {
        title: 'Documentation - IbrahFlow.js',
        sections,
        codeExamples,
        currentSection: req.query.section || 'getting-started',
        currentItem: req.query.item || 'installation'
    });
    app.send(res, html);
});

// API endpoint for documentation search
app.get('/api/docs/search', async (req, res) => {
    const { query } = req.query;
    // Implement search functionality here
    const results = []; // Add search results
    app.send(res, JSON.stringify(results), 'application/json');
});

// Features route
app.get('/features', async (req, res) => {
    const html = await app.render('features', {
        title: 'Features - IbrahFlow.js'
    });
    app.send(res, html);
});

// Example of database query
app.get('/users', async (req, res) => {
    try {
        const users = await app.query('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Example of POST request
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await app.query(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );
        res.json({ id: result.insertId, name, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
}); 