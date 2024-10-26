import * as crypto from 'crypto';

/**
 * 
 * @param text 
 * @param log_level - Display style
 *                  - 0	info	white
                    - 1	success	green
                    - 2	critical	red
                    - 3	warn	magenta
                    - 4	debug	yellow
                    - 5	empty(reserved)	white
 */
export const logger = (text: String, log_level: number) => {
    const logLevels: any = {
        0: { style: '' },
        1: { style: '\x1b[32m' },
        2: { style: '\x1b[31m' },
        3: { style: '\x1b[35m' },
        4: { style: '\x1b[33m' },
        5: { style: '' }
    };
    if (logLevels[log_level]) {
        console.log(`${logLevels[log_level].style}${text}\x1b[0m`);
    } else {
        console.log(`Invalid log level: ${log_level}`);
    }
}

/**
 * 
 * @param bytes - The byte count
 * @param si - Use SI (false by default)
 * @param dp - To the nearest x digits
 * @returns - {
 *      num,
 *      unit
 *  }
 */
export const hread = (bytes: number, si: boolean = false, dp: number = 1) => {
    const thresh = si ? 1024 : 1000;
    const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    if (Math.abs(bytes) < thresh) {
        return {
            num: bytes.toFixed(dp),
            unit: 'B'
        }
    }

    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return {
        num: bytes.toFixed(dp),
        unit: units[u]
    }
}

/**
 * 
 * @param seconds 
 * @returns - {num, unit}
 */
export const secondsToTime = (seconds: number) => {
    let result: { num: number; unit: string } = { num: 0, unit: 'seconds'}
    let days = Math.floor(seconds / (24 * 60 * 60));
    let hours = Math.floor(seconds / (60 * 60));
    let minutes = Math.floor(seconds / 60);

    if (days > 0) {
        result = {
            num: days,
            unit: "days"
        }
    } else if (hours > 0) {
        result = {
            num: hours,
            unit: "hours"
        }
    } else if (minutes > 0) {
        result = {
            num: minutes,
            unit: "minutes"
        }
    } else {
        result = {
            num: seconds,
            unit: "seconds"
        }
    }

    return result;
}

export const generateToken = (byteCounts: number) => {
    return crypto.randomBytes(byteCounts).toString('hex')
}

class TOTP {
    private static RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    private static RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
    private static CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    seeding(): string {
        const characters: string = TOTP.RFC4648;
        let result: string = '';
        const length = 16;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    tokenization(seed: string): string {
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
                alphabet = TOTP.RFC4648;
                input = input.replace(/=+$/, '');
                break;
            case 'RFC4648-HEX':
                alphabet = TOTP.RFC4648_HEX;
                input = input.replace(/=+$/, '');
                break;
            case 'Crockford':
                alphabet = TOTP.CROCKFORD;
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
export default new TOTP;
