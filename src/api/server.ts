import { URL } from '@/reference';
import fastify, { FastifyInstance } from 'fastify';
import websocket, { SocketStream } from 'fastify-websocket';
import getPort from 'get-port';

export const getAvailablePort = async (): Promise<number> => {
	return await getPort();
};

export const createWebServer = (): FastifyInstance => {
	const server = fastify({ logger: false });
	server.register(websocket);

	server.get(
		URL.WEBSOCKET,
		{ websocket: true },
		(connection: SocketStream) => {
			connection.socket.on('message', (message) => {
				console.log('ws message received: %s', message.toString());
			})
		}
	);

	return server;
};
