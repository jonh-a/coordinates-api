import {
  Request,
  Response,
  NextFunction,
} from 'express';
import { query } from '../db/database';

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  let ipAddress = req.headers['x-forwarded-for'];
  if (typeof ipAddress === 'object') {
    ipAddress = ipAddress?.[0] || '0.0.0.0';
  }
  if (typeof ipAddress === 'string') {
    ipAddress = ipAddress?.split(',')?.[0] || ipAddress;
  }
  if (!ipAddress) {
    ipAddress = req.socket.remoteAddress || '0.0.0.0';
  }
  const timeAccessed = Math.floor(new Date().getTime() / 1000);

  const queryString = 'INSERT INTO access_logs (ip_address, times_accessed, last_accessed) '
    + 'VALUES ($1, $2, $3) ON CONFLICT (ip_address) DO UPDATE SET times_accessed = access_logs.times_accessed + 1, '
    + 'last_accessed = $3;';

  try {
    query('db', queryString, [ipAddress, 1, timeAccessed]);
  } catch (e: any) {
    console.log('Error updating the access logs database');
  }
  next();
};

export default logRequest;
