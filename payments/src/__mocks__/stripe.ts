import { randomBytes } from 'crypto';

// TODO: Change this after creating stripe account
export const fakeStripe = {
    charges: {
        create: jest.fn().mockImplementation((chargeOptions) => {
            const { source } = chargeOptions;
            if (source === 'tok_visa' || source.startsWith('tok_')) {
                return {
                    id: randomBytes(8).toString('hex'),
                    status: 'OK',
                    errors: []
                }
            }
            return {
                id: '',
                status: 'FAILED',
                errors: [{ message: 'Bad token' }]
            }
        })
    }
}