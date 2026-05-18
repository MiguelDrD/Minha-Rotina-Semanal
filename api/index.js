import server from '../dist/server/server.js';

export const GET = (req) => server.fetch(req);
export const POST = (req) => server.fetch(req);
export const PUT = (req) => server.fetch(req);
export const DELETE = (req) => server.fetch(req);
export const PATCH = (req) => server.fetch(req);
export const OPTIONS = (req) => server.fetch(req);
export const HEAD = (req) => server.fetch(req);
