import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createGame, getGame, submitGuess } from './game';

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });

// POST /api/game — neue Spielsession starten
fastify.post('/api/game', async (_req, reply) => {
  const state = createGame();
  return reply.code(201).send({
    gameId: state.gameId,
    wordLength: state.wordLength,
    maxAttempts: state.maxAttempts,
  });
});

// GET /api/game/:gameId — aktuellen Spielstand abrufen
fastify.get<{ Params: { gameId: string } }>('/api/game/:gameId', async (req, reply) => {
  const state = getGame(req.params.gameId);
  if (!state) return reply.code(404).send({ error: 'Game not found' });
  return reply.send(state);
});

// POST /api/game/:gameId/guess — Guess abschicken
fastify.post<{
  Params: { gameId: string };
  Body: { word: string };
}>('/api/game/:gameId/guess', async (req, reply) => {
  const { gameId } = req.params;
  const { word } = req.body ?? {};

  if (!word || typeof word !== 'string') {
    return reply.code(400).send({ error: 'word is required' });
  }

  const outcome = submitGuess(gameId, word);
  if ('error' in outcome) {
    return reply.code(400).send(outcome);
  }

  return reply.send(outcome);
});

const PORT = parseInt(process.env.PORT ?? '3000', 10);

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
