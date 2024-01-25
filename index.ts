import * as crypto from 'crypto';
class toolbx {
    private static RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    private static RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
    private static CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    // logger
    logger(text: string, log_level: number) {
        const logLevels: any = {
            0: { style: '', symbol: '0.0  ' },
            1: { style: '\x1b[32m', symbol: 'o.0√ ' },
            2: { style: '\x1b[31m', symbol: '0.o/ ' },
            3: { style: '\x1b[35m', symbol: 'x.X  ' },
            4: { style: '\x1b[33m', symbol: '?.?  ' },
            5: { style: '', symbol: '' }
        };
        if (logLevels[log_level]) {
            console.log(`${logLevels[log_level].style}${logLevels[log_level].symbol}${text}\x1b[0m`);
        } else {
            console.log(`Invalid log level: ${log_level}`);
        }
    }
    TOTPseeding(): string {
        const characters: string = toolbx.RFC4648;
        let result: string = '';
        const length = 16;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    TOTPtokenization(seed: string): string {
        const epoch = Math.round(new Date().getTime() / 1000.0);
        let counter = Math.floor(epoch / 30);
        const counterBuffer = Buffer.alloc(8);
        for (let i = 0; i < 8; i++) {
            counterBuffer[7 - i] = counter & (0xff);
            counter >>= 8;
        }
        const seedBuffer = Buffer.from(this.base32Decode(seed, 'RFC4648'));
        const hmac = crypto.createHmac('sha1', seedBuffer);
        const hash = hmac.update(counterBuffer).digest();
        const offset = hash[hash.length - 1] & 0xf;
        const binary =
            ((hash[offset] & 0x7f) << 24) |
            ((hash[offset + 1] & 0xff) << 16) |
            ((hash[offset + 2] & 0xff) << 8) |
            (hash[offset + 3] & 0xff);
        const otp = binary % Math.pow(10, 6);
        return otp.toString().padStart(6, '0');
    }
    base32Decode(input: string, variant: string) {
        let alphabet: string;

        switch (variant) {
            case 'RFC3548':
            case 'RFC4648':
                alphabet = toolbx.RFC4648;
                input = input.replace(/=+$/, '');
                break;
            case 'RFC4648-HEX':
                alphabet = toolbx.RFC4648_HEX;
                input = input.replace(/=+$/, '');
                break;
            case 'Crockford':
                alphabet = toolbx.CROCKFORD;
                input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1');
                break;
            default:
                throw new Error('Unknown base32 variant: ' + variant);
        }
        const length = input.length;
        let bits = 0;
        let value = 0;
        let index = 0;
        const output = new Uint8Array((length * 5 / 8) | 0);
        for (let i = 0; i < length; i++) {
            const idx = alphabet.indexOf(input[i]);
            if (idx === -1) {
                throw new Error('Invalid character found: ' + input[i]);
            }
            value = (value << 5) | idx;
            bits += 5;
            if (bits >= 8) {
                output[index++] = (value >>> (bits - 8)) & 255;
                bits -= 8;
            }
        }
        return output.buffer;
    }
}
// Export as an object
export default new toolbx;