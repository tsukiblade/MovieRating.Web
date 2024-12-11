import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '10s', target: 1 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests can fail
  },
};

const BASE_URL = 'http://localhost:8080';


export function setup() {
  const cleanResponse = http.post(`${BASE_URL}/clear-data`);
  check(cleanResponse, {
    'cleaned test data': (r) => r.status === 200,
  });

  const generateResponse = http.post(`${BASE_URL}/test-data?count=10`);
  check(generateResponse, {
    'generated test data': (r) => r.status === 200,
  });

  return { startTime: Date.now() };
}

export default function (data) {
  const movieTitle = `Test Movie ${randomString(8)}`;

  // Test GET /movies
  const moviesResponse = http.get(`${BASE_URL}/movies?page=1&pageSize=10`);
  check(moviesResponse, {
    'get movies status is 200': (r) => r.status === 200,
    'get movies returns array': (r) => Array.isArray(JSON.parse(r.body)),
  });

  // Test POST /movies
  const moviePayload = {
    title: movieTitle,
    description: 'Test movie description',
    genre: 'Test Genre',
    director: 'Test Director',
    actors: ['Actor 1', 'Actor 2']
  };

  const createMovieResponse = http.post(
    `${BASE_URL}/movies`,
    JSON.stringify(moviePayload),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(createMovieResponse, {
    'create movie status is 200': (r) => r.status === 200,
    'create movie returns id': (r) => JSON.parse(r.body).id !== undefined,
  });

  const movieId = JSON.parse(createMovieResponse.body).id;

  // Test GET /movies/{id}
  const movieDetailResponse = http.get(`${BASE_URL}/movies/${movieId}`);
  check(movieDetailResponse, {
    'get movie detail status is 200': (r) => r.status === 200,
    'get movie detail returns correct title': (r) => JSON.parse(r.body).title === movieTitle,
  });

  // Test POST /movies/{id}/comments
  const commentPayload = {
    username: 'Test User',
    title: `Test Comment ${randomString(6)}`,
    content: 'This is a test comment',
    rating: 4
  };

  const addCommentResponse = http.post(
    `${BASE_URL}/movies/${movieId}/comments`,
    JSON.stringify(commentPayload),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(addCommentResponse, {
    'add comment status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

export function teardown(data) {
  http.post(`${BASE_URL}/clear-data`);
  
  console.log(`Test duration: ${(Date.now() - data.startTime) / 1000}s`);
}