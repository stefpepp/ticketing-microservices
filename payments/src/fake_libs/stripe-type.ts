import { randomBytes } from 'crypto';

export enum CURRENCIES {
    USD = 'usd',
    EUR = 'eur',
    GBR = 'gbr',
    RSD = 'rsd'
}

export const token = 'tok_visa';

interface OptionsFields {
    api_version: string;
}

interface CreateChargeOptions {
    currency: CURRENCIES;
    amount: number;
    source: string
}

interface PaymentResult {
    id: string;
    status: string;
    errors: { message: string, field?: string }[];
}

export class Stripe {
    readonly charges = {
        async create(chargeOptions: CreateChargeOptions): Promise<PaymentResult> {
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
        }
    }

    constructor(api_key: string, options: OptionsFields) {
    }
}

