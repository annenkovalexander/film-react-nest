import { DevLogger } from "./dev_logger.service";

describe('DevLogger', () => {
    let logger: DevLogger;
    beforeEach(() => {
        logger = new DevLogger();
    })
    it('should call log for logger', () => {
        const spy = jest.spyOn(logger, 'log').mockImplementation(() => {});
        logger.log('Test message');
        expect(spy).toHaveBeenCalledWith('Test message');
        spy.mockRestore();
    });
    it('should call error for logger', () => {
        const spy = jest.spyOn(logger, 'error').mockImplementation(() => {});
        logger.error('Test message');
        expect(spy).toHaveBeenCalledWith('Test message');
        spy.mockRestore();
    });
    it('should call warn for logger', () => {
        const spy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
        logger.warn('Test message');
        expect(spy).toHaveBeenCalledWith('Test message');
        spy.mockRestore();
    });
    it('should call verbose for logger', () => {
        const spy = jest.spyOn(logger, 'verbose').mockImplementation(() => {});
        logger.verbose('Test message');
        expect(spy).toHaveBeenCalledWith('Test message');
        spy.mockRestore();
    });
    it('should call debug for logger', () => {
        const spy = jest.spyOn(logger, 'debug').mockImplementation(() => {});
        logger.debug('Test message');
        expect(spy).toHaveBeenCalledWith('Test message');
        spy.mockRestore();
    });
})