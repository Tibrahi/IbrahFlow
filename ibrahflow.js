/**
 * IbrahFlow.js - A simple and powerful framework for full-stack JavaScript development
 * @version 1.0.0
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { parse } = require('url');

class IbrahFlow {
    constructor(config = {}) {
        this.config = {
            database: {
                host: config.database?.host || 'localhost',
                user: config.database?.user || 'root',
                password: config.database?.password || '',
                database: config.database?.database || '',
            },
            port: config.port || 3000,
            staticPath: config.staticPath || 'public',
            viewsPath: config.viewsPath || 'views'
        };
        
        this.routes = new Map();
        this.middleware = [];
        this.database = null;
        this.viewsPath = path.join(process.cwd(), 'views');
        this.publicPath = path.join(process.cwd(), 'public');
    }

    // Database connection
    async connect() {
        try {
            this.database = await mysql.createConnection(this.config.database);
            console.log('Database connected successfully');
            return this.database;
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    // Route handling
    get(path, handler) {
        this.routes.set(`GET:${path}`, handler);
    }

    post(path, handler) {
        this.routes.set(`POST:${path}`, handler);
    }

    put(path, handler) {
        this.routes.set(`PUT:${path}`, handler);
    }

    delete(path, handler) {
        this.routes.set(`DELETE:${path}`, handler);
    }

    // Middleware support
    use(middleware) {
        this.middleware.push(middleware);
    }

    // Response helper
    send(res, content, contentType = 'text/html') {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    }

    // Start the server
    listen(port, callback) {
        const server = http.createServer(async (req, res) => {
            const parsedUrl = parse(req.url, true);
            const pathname = parsedUrl.pathname;

            // Serve static files
            if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/images/')) {
                const filePath = path.join(this.publicPath, pathname);
                try {
                    const content = await fs.promises.readFile(filePath);
                    const ext = path.extname(filePath);
                    const contentType = {
                        '.css': 'text/css',
                        '.js': 'text/javascript',
                        '.svg': 'image/svg+xml',
                        '.png': 'image/png',
                        '.jpg': 'image/jpeg',
                        '.jpeg': 'image/jpeg',
                        '.gif': 'image/gif'
                    }[ext] || 'text/plain';

                    this.send(res, content, contentType);
                    return;
                } catch (error) {
                    res.writeHead(404);
                    res.end('File not found');
                    return;
                }
            }

            // Handle routes
            const route = this.routes.get(`${req.method} ${pathname}`);
            if (route) {
                try {
                    // Execute middleware
                    for (const middleware of this.middleware) {
                        await middleware(req, res);
                    }
                    await route(req, res);
                } catch (error) {
                    console.error('Error handling request:', error);
                    res.writeHead(500);
                    res.end('Internal Server Error');
                }
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });

        server.listen(port, callback);
    }

    // Database query helper
    async query(sql, params = []) {
        try {
            const [results] = await this.database.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }

    // View rendering helper
    async render(view, data = {}) {
        const viewPath = path.join(this.viewsPath, `${view}.html`);
        const template = await fs.promises.readFile(viewPath, 'utf8');
        
        // Simple template engine
        return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
            return data[key.trim()] || '';
        });
    }
}

module.exports = IbrahFlow; 