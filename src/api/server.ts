import fastify, { FastifyInstance } from 'fastify';
import websocket, { SocketStream } from 'fastify-websocket';
import getPort from 'get-port';
import { URL } from '@/reference';

export const getAvailablePort = async (): Promise<number> => getPort();

export const createWebServer = (): FastifyInstance => {
	const server = fastify({ logger: false });
	server.register(websocket);

	server.get(
		URL.WEBSOCKET,
		{ websocket: true },
		(connection: SocketStream) => {
			connection.socket.on('message', (message) => {
				console.log('ws message received: %s', message.toString());
			});
		}
	);

	return server;
};
