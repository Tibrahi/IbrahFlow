# IbrahFlow.js

A modern web framework for building scalable applications with Node.js and MySQL.

## Features

- 🚀 Fast and lightweight
- 📦 Built-in MySQL database integration
- 🎨 Simple and powerful view engine
- 🔒 Authentication middleware
- 📝 Clean and intuitive API
- 🛠️ Easy to extend and customize

## Installation

```bash
npm install ibrahflow
```

## Quick Start

1. Create a new project:

```bash
mkdir my-ibrahflow-app
cd my-ibrahflow-app
npm init -y
npm install ibrahflow
```

2. Create your first app:

```javascript
const IbrahFlow = require('ibrahflow');

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
});
```

## Project Structure

```
my-ibrahflow-app/
├── src/
│   ├── core/           # Core framework files
│   ├── database/       # Database related files
│   ├── routing/        # Routing system
│   ├── middleware/     # Middleware components
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   ├── models/         # Database models
│   ├── views/          # View templates
│   │   ├── layouts/    # Layout templates
│   │   └── partials/   # Partial templates
│   └── public/         # Static files
│       ├── css/        # Stylesheets
│       ├── js/         # Client-side JavaScript
│       └── images/     # Images and assets
├── tests/              # Test files
└── docs/              # Documentation
```

## Documentation

For detailed documentation, visit our [documentation page](https://ibrahflow.js.org/docs).

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 