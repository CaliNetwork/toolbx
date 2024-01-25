class toolbx {
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
}
// Export as an object
export default new toolbx;