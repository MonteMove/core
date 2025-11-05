import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptHasher {
    private saltRounds = 10;

    public withSaltRounds(rounds: number): this {
        this.saltRounds = rounds;

        return this;
    }

    public async hash(plainText: string): Promise<string> {
        const salt = await genSalt(this.saltRounds);

        return hash(plainText, salt);
    }

    public async compare(plainText: string, hashed: string): Promise<boolean> {
        return compare(plainText, hashed);
    }

    public async hashWithRounds(plainText: string, rounds: number): Promise<string> {
        return this.withSaltRounds(rounds).hash(plainText);
    }
}
