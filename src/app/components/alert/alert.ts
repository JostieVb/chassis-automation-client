export class Alert {
    constructor(
        public message: string,
        public type: string,
        public prefix?: string,
        public clearAlertBox?: boolean,
        public dismissable?: boolean,
        public interval?: number
    ) {}
}
