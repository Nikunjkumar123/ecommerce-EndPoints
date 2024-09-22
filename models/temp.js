import { MongoClient } from 'mongodb';
import {
  ObjectId
} from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'product': new ObjectId('66ef347a0d1f5c6336788bd7')
    }
  }, {
    '$group': {
      '_id': 'null', 
      'averageRating': {
        '$avg': '$rating'
      }, 
      'numberofReviews': {
        '$sum': 1
      }
    }
  }
];

const client = await MongoClient.connect(
  ''
);
const coll = client.db('test').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();