/**
 * MongoDB Database Connection Configuration
 * 
 * Connects to MongoDB Atlas using Mongoose.
 * Loads environment variables from the root .env file.
 */

const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
const { execSync } = require('child_process');

// Force IPv4 resolution first to prevent ECONNREFUSED/ENOTFOUND on Windows/Node.js 18+
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const logger = require('../utils/logger');

/**
 * Resolve standard mongodb+srv connection string to direct hosts using system nslookup
 * @param {string} srvURI 
 * @returns {string}
 */
const resolveMongoURIViaNslookup = (srvURI) => {
  if (srvURI.startsWith('mongodb+srv://')) {
    try {
      const match = srvURI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/:]+)(?::\d+)?\/(.+)/);
      if (match) {
        const [_, username, password, clusterDomain, dbNameAndQuery] = match;
        const dbName = dbNameAndQuery.split('?')[0];
        
        logger.info(`Running system nslookup for SRV records of: ${clusterDomain}`);
        const output = execSync(`nslookup -type=SRV _mongodb._tcp.${clusterDomain}`, { encoding: 'utf-8' });
        
        const hostRegex = /svr hostname\s*=\s*([a-zA-Z0-9.-]+)/g;
        const hosts = [];
        let m;
        while ((m = hostRegex.exec(output)) !== null) {
          hosts.push(m[1].trim());
        }
        
        if (hosts.length > 0) {
          const hostList = hosts.map(h => `${h}:27017`).join(',');
          
          // Query replica set name from the first host using command line or default name
          // We default to the known replicaSet if it's cluster0.v6cr0sn.mongodb.net
          const repSet = clusterDomain.includes('v6cr0sn') ? 'atlas-13fmr5-shard-0' : 'atlas-gp34bhf-shard-0';
          
          const directURI = `mongodb://${username}:${password}@${hostList}/${dbName}?ssl=true&authSource=admin&replicaSet=${repSet}`;
          logger.info('Successfully resolved connection URI using nslookup');
          return directURI;
        }
      }
    } catch (err) {
      logger.error(`nslookup SRV resolution failed: ${err.message}`);
    }
  }
  return srvURI;
};

/**
 * Connect to MongoDB Atlas with multiple fallback options
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  // Try Primary Connection Strategy
  try {
    logger.info('Attempting primary MongoDB connection (SRV)...');
    const conn = await mongoose.connect(mongoURI, options);
    logger.success(`MongoDB Connected: ${conn.connection.host}`);
    setupConnectionEvents();
    return;
  } catch (error) {
    logger.warn(`Primary MongoDB connection failed: ${error.message}`);
    logger.info('Starting fallback connection strategies...');
  }

  // Fallback Strategy 1: Known Cluster Direct Host Route
  if (mongoURI.includes('cluster0.v6cr0sn.mongodb.net')) {
    const fallbackURI = "mongodb://keerthisri:keerthisri@ac-gp34bhf-shard-00-00.v6cr0sn.mongodb.net:27017/cloudlearning?ssl=true&authSource=admin&replicaSet=atlas-13fmr5-shard-0";
    try {
      logger.info('Connecting using direct replica set connection string...');
      const conn = await mongoose.connect(fallbackURI, options);
      logger.success(`MongoDB Connected (Direct Shard Host): ${conn.connection.host}`);
      setupConnectionEvents();
      return;
    } catch (fallbackErr) {
      logger.error(`Direct shard host fallback failed: ${fallbackErr.message}`);
    }
  }

  // Fallback Strategy 2: Dynamic System nslookup SRV Resolution
  try {
    logger.info('Attempting dynamic nslookup SRV resolution...');
    const resolvedURI = resolveMongoURIViaNslookup(mongoURI);
    if (resolvedURI !== mongoURI) {
      const conn = await mongoose.connect(resolvedURI, options);
      logger.success(`MongoDB Connected (Dynamic NSLookup): ${conn.connection.host}`);
      setupConnectionEvents();
      return;
    }
  } catch (nslookupErr) {
    logger.error(`Dynamic NSLookup fallback failed: ${nslookupErr.message}`);
  }

  // Fallback Strategy 3: Single Shard Host (No Replica Set verification)
  if (mongoURI.includes('cluster0.v6cr0sn.mongodb.net')) {
    const singleURI = "mongodb://keerthisri:keerthisri@ac-gp34bhf-shard-00-00.v6cr0sn.mongodb.net:27017/cloudlearning?ssl=true&authSource=admin";
    try {
      logger.info('Connecting using standalone single host connection...');
      const conn = await mongoose.connect(singleURI, options);
      logger.success(`MongoDB Connected (Standalone Single Host): ${conn.connection.host}`);
      setupConnectionEvents();
      return;
    } catch (singleErr) {
      logger.error(`Standalone single host fallback failed: ${singleErr.message}`);
    }
  }

  // If all strategies fail
  logger.error('All database connection strategies exhausted. Server cannot start.');
  process.exit(1);
};

/**
 * Setup standard mongoose connection events
 */
function setupConnectionEvents() {
  logger.info(`Database: ${mongoose.connection.name}`);

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    logger.success('MongoDB reconnected successfully');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  });
}

module.exports = connectDB;
