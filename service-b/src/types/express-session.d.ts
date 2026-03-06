
import 'express-session';

declare module 'express-serve-static-headers' {
    interface Request {
        session: import('express-session').Session & {
            user?: any; 
            returnTo?: string;
        };
    }
}

declare module 'express' {
    interface Request {
        session: import('express-session').Session & {
            user?: any;
            returnTo?: string;
        };
    }
}